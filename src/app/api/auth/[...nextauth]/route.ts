import NextAuth, { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt from 'jsonwebtoken';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

import { fetchFhirResource } from '@/app/loader';
import { PRACTITIONER_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, PRACTITIONER, SUPERVISOR, getResourcesFromBundle, getUserTypeCode, getUserType } from '@/utils/fhir-utils';

type UserTypes = typeof PRACTITIONER | typeof SUPERVISOR;

function requestRefreshOfAccessToken(token: JWT) {
    if (!process.env.KEYCLOAK_ISSUER || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET) {
        throw new Error("Environment variables for Keycloak are not properly set.");
    }
    if (!token.refreshToken) {
        throw new Error("Refresh token is missing in the JWT token.");
    }

    const refreshToken: string = token.refreshToken as string ?? ''; // Use an empty string if token.refreshToken is undefined or null

    return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            refresh_token: refreshToken
        }),
        method: "POST",
        cache: "no-store"
    });
}

async function fetchRole(accessToken: string, id: string) {
    return fetchFhirResource(accessToken, { resourceType: 'PractitionerRole', query: { identifier: id } })
        .then((data: IBundle) => {
            const practitionerRole = (getResourcesFromBundle<IPractitionerRole>(data)[0]);
            let userType: UserTypes = 'practitioner';
            if (practitionerRole) {
                // getting the user type to default to when editing a user
                // by comparing practitioner resource user type codes
                // this is probably not the best way because these codes are constants
                // but it's the best for now
                const userTypeCode = getUserTypeCode(practitionerRole);
                if (userTypeCode) {
                    userType = getUserType(
                        userTypeCode as typeof PRACTITIONER_USER_TYPE_CODE | typeof SUPERVISOR_USER_TYPE_CODE
                    );
                    return userType;
                }
            }
            return userType;
        })
        .catch(error => console.error("Error fetching userType", error.response.data))
}

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/',
    },
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
        })
    ],
    session: {
        maxAge: 60 * 30
    },
    callbacks: {
        async jwt({ token, account }: any) {
            if (account) {
                token.idToken = account.id_token
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
                token.resourceId = account.providerAccountId
                if (account.access_token) {
                    const decodedToken: any = jwt.decode(account.access_token as string);
                    if (decodedToken) {
                        token.permissions = decodedToken.realm_access?.roles ?? [];
                    }
                    const userType = await fetchRole(account.access_token as string, account.providerAccountId);
                    token.userType = userType;
                }
            }
            // we take a buffer of one minute(60 * 1000 ms)
            if (Date.now() < (token.expiresAt! * 1000 - 60 * 1000)) {
                return token
            } else {
                try {
                    const response = await requestRefreshOfAccessToken(token)

                    const tokens: TokenSet = await response.json()

                    if (!response.ok) throw tokens

                    const updatedToken: JWT = {
                        ...token, // Keep the previous token properties
                        idToken: tokens.id_token,
                        accessToken: tokens.access_token,
                        expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    }
                    return updatedToken
                } catch (error) {
                    console.error("Error refreshing access token", error)
                    return { ...token, error: "RefreshAccessTokenError" }
                }
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.userType = token.userType as string;
            session.resourceId = token.resourceId as string;
            session.permissions = token.permissions as string[];
            return session
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
