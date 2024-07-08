import KcAdminClient from '@keycloak/keycloak-admin-client';
import Fhir from 'fhir.js/src/adapters/native';
import axios from 'axios';

const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    realmName: process.env.NEXT_PUBLIC_KEYCLOAK_REALM
});

const createFhirClient = (token: string) => {
    const client = Fhir({
        baseUrl: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        auth: {
            bearer: token,
        }
    });
    return client;
}

export async function fetchUsers(accessToken: string) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.find()
}

export async function fetchUserRoles(accessToken: string) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.roles.find()
}

export async function fetchUserGroups(accessToken: string) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.find()
}

export async function fetchUserDetail(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.findOne(payload);
}

export async function createUser(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.create(payload);
}

export async function updateUser(accessToken: string, { id, ...payload }: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.update({ id }, payload);
}

export async function resetUserPassword(accessToken: string, { id, ...credential }: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.resetPassword({ id, credential });
}

export async function deleteUser(accessToken: string, userId: string) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.del({ id: userId });
}

export async function createUserGroup(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.create(payload);
}

export async function updateUserGroup(accessToken: string, { id, ...payload }: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.update({ id }, payload);
}

export async function fetchSingleUserGroup(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.findOne(payload);
}

export async function fetchAssignedRoleMappings(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.listRealmRoleMappings(payload);
}

export async function fetchAvailableRoleMappings(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.listAvailableRealmRoleMappings(payload);
}

export async function assignRoles(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.addRealmRoleMappings(payload);
}

export async function removeAssignedRoles(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.groups.delRealmRoleMappings(payload);
}

export async function addUserToGroup(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.addToGroup(payload);
}

export async function fetchUserAssignedGroups(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.listGroups(payload)
}

export async function removeUserFromGroup(accessToken: string, payload: any) {
    kcAdminClient.setAccessToken(accessToken);
    return kcAdminClient.users.delFromGroup(payload);
}

export function fetchFhirComposition(accessToken: string) {
    const fhirClient = createFhirClient(accessToken);
    return fhirClient.search({
        type: 'Composition',
        query: {
            type: 'http://snomed.info/sct|1156600005'
        }
    }).then(({ data }: { data: any }) => data);
}

export function fetchFhirResource(accessToken: string, payload: { resourceType: string, query: object }) {
    const { resourceType, query } = payload;
    return axios({
        method: 'GET',
        baseURL: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        url: `/${resourceType}/_search`,
        params: query,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(({ data }: { data: any }) => data);
    // const fhirClient = createFhirClient(accessToken);
    // return fhirClient.search({ type: resourceType, query }).then(({ data }: { data: any }) => data);
}

export function fetchFhirResourceEverything(accessToken: string, payload: any) {
    const { resourceType, id, query } = payload;
    return axios({
        method: 'GET',
        baseURL: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        url: `/${resourceType}/${id}/$everything`,
        params: query,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(({ data }: { data: any }) => data);
}

export function fetchFhirSingleResource(accessToken: string, payload: { resourceType: string, id: string }) {
    const { resourceType, id } = payload;
    const fhirClient = createFhirClient(accessToken);
    return fhirClient.read({ type: resourceType, id }).then(({ data }: { data: any }) => data);
}

export function updateFhirResource(accessToken: string, payload?: any) {
    const fhirClient = createFhirClient(accessToken);
    return fhirClient.update({
        type: payload.resourceType,
        id: payload.id,
        resource: payload
    }).then(({ data }: { data: any }) => data);
}

export function extractQuestionnaireResponse(accessToken: string, payload: { resourceType: string, parameter: object }) {
    return axios({
        method: 'POST',
        baseURL: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        url: `/QuestionnaireResponse/$extract`,
        data: payload,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(({ data }: { data: any }) => data);
}

export function createMultipleFhirResources(accessToken: string, payload: { resourceType: string, query: object }) {
    return axios({
        method: 'POST',
        baseURL: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        url: ``,
        data: payload,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(({ data }: { data: any }) => data);
}

export function executeFhirCqlQuery(accessToken: string, payload: { resourceType: string, parameter: object }) {
    return axios({
        method: 'POST',
        baseURL: process.env.NEXT_PUBLIC_FHIR_API_BASE_URL,
        url: `/$cql`,
        data: payload,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(({ data }: { data: any }) => data);
}
