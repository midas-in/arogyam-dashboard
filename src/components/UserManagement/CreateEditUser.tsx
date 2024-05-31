'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Select, message } from 'antd';
import dynamic from "next/dynamic";
const ReactSelect = dynamic(() => import("react-select"), { ssr: false });
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

import {
    IdentifierUseCodes, getObjLike, keycloakIdentifierCoding, groupResourceType,
    PRACTITIONER_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, PRACTITIONER, SUPERVISOR,
    HumanNameUseCodes, practitionerRoleResourceType, parseFhirHumanName, getResourcesFromBundle,
    getUserTypeCode, getUserType
} from '@/utils/fhir-utils';
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {
    fetchFhirComposition, fetchUserGroups, fetchUserDetail,
    createUser, updateUser, addUserToGroup, removeUserFromGroup, fetchUserAssignedGroups,
    createUpdateFhirResource, fetchFhirResource
} from '@/app/loader';

// interface UserAttributes {
//     fhir_core_app_id: string[];
// }
// interface UserData {
//     practitioner?: IPractitioner,
//     practitionerRole?: IPractitionerRole,
//     firstName: string,
//     lastName: string,
//     username: string,
//     email: string,
//     enabled: boolean,
//     attributes: UserAttributes
// }
type UserTypes = typeof PRACTITIONER | typeof SUPERVISOR;

const defaultUserData = {
    firstName: ``,
    lastName: ``,
    username: ``,
    email: ``,
    enabled: true,
    attributes: {
        fhir_core_app_id: []
    }
}

export const getPractitionerSecondaryIdentifier = (keycloakID: string): Identifier => {
    return {
        use: IdentifierUseCodes.SECONDARY,
        type: {
            coding: [keycloakIdentifierCoding],
            text: 'Keycloak user ID',
        },
        value: keycloakID,
    };
};

export const createEditFhirGroupResource = (
    keycloakUserEnabled: boolean,
    keycloakID: string,
    keycloakUserName: string,
    practitionerID: string,
    existingGroupID: string | undefined,
    accessToken: string
) => {
    const newGroupResourceID = v4();
    const secondaryIdentifier = getPractitionerSecondaryIdentifier(keycloakID);
    const payload: IGroup = {
        resourceType: groupResourceType,
        id: existingGroupID ?? newGroupResourceID,
        identifier: [
            { use: IdentifierUseCodes.OFFICIAL, value: existingGroupID ?? newGroupResourceID },
            secondaryIdentifier,
        ],
        active: keycloakUserEnabled,
        type: 'practitioner',
        actual: true,
        code: {
            coding: [
                {
                    system: 'http://snomed.info/sct',
                    code: PRACTITIONER_USER_TYPE_CODE,
                    display: 'Assigned practitioner',
                },
            ],
        },
        name: keycloakUserName,
        member: [
            {
                entity: {
                    reference: `Practitioner/${practitionerID}`,
                },
            },
        ],
    };
    return createUpdateFhirResource(accessToken, payload);
};

export const createEditPractitionerRoleResource = (
    userType: UserTypes,
    keycloakID: string,
    keycloakUserEnabled: boolean,
    practitionerID: string,
    practitionerName: HumanName[],
    existingPractitionerRoleID: string | undefined,
    accessToken: string
) => {
    const newPractitionerRoleResourceID = v4();

    let practitionerRoleResourceCode: IPractitionerRole['code'] = [
        {
            coding: [
                {
                    system: 'http://snomed.info/sct',
                    code: PRACTITIONER_USER_TYPE_CODE,
                    display: 'Assigned practitioner',
                },
            ],
        },
    ];

    if (userType === 'supervisor') {
        practitionerRoleResourceCode = [
            {
                coding: [
                    {
                        system: 'http://snomed.info/sct',
                        code: SUPERVISOR_USER_TYPE_CODE,
                        display: 'Supervisor (occupation)',
                    },
                ],
            },
        ];
    }

    const practitionerDisplayName = getObjLike(
        practitionerName,
        'use',
        HumanNameUseCodes.OFFICIAL,
        true
    )[0];
    const secondaryIdentifier = getPractitionerSecondaryIdentifier(keycloakID);
    const payload: IPractitionerRole = {
        resourceType: practitionerRoleResourceType,
        id: existingPractitionerRoleID ?? newPractitionerRoleResourceID,
        identifier: [
            {
                use: IdentifierUseCodes.OFFICIAL,
                value: existingPractitionerRoleID ?? newPractitionerRoleResourceID,
            },
            secondaryIdentifier,
        ],
        active: keycloakUserEnabled,
        practitioner: {
            reference: `Practitioner/${practitionerID}`,
            display: parseFhirHumanName(practitionerDisplayName),
        },
        code: practitionerRoleResourceCode,
    };

    // use update (PUT) for both creating and updating practitioner resource
    // because create (POST) does not honour a supplied resource id
    // and overrides with a server provided one instead
    return createUpdateFhirResource(accessToken, payload);
};

export function CreateEditUser({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<{}[]>([]);
    const [userGroups, setUserGroups] = useState<{ label: string, value: string }[]>([]);
    const [previousUserGroupIds, setPreviousUserGroupIds] = useState<string[]>([]);
    const [composition, setComposition] = useState<any>([]);
    const [userData, setUserData] = useState<UserRepresentation>(defaultUserData);
    const [group, setGroup] = useState<IGroup>();
    const [practitioner, setPractitioner] = useState<IPractitioner>();
    const [practitionerRole, setPractitionerRole] = useState<IPractitionerRole>();
    const [userType, setUserType] = useState<UserTypes>('practitioner');
    const [errors, setErrors] = useState<{ [key in keyof UserRepresentation]?: boolean }>({});

    useEffect(() => {
        if (session?.accessToken) {
            fetchUserGroups(session.accessToken)
                .then((data) => setGroups(data))
                .catch(error => message.error('Error fetching groups:', error));
            fetchFhirComposition(session.accessToken)
                .then((data: any) => {
                    setComposition(getResourcesFromBundle(data));
                })
                .catch((error: any) => message.error('Error fetching groups:', error));
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (id && session?.accessToken) {
            fetchUserDetail(session.accessToken, { id })
                .then(data => {
                    if (data) {
                        setUserData(data);
                    }
                })
                .catch(error => message.error('Error fetching user detail:', error));
            fetchUserAssignedGroups(session.accessToken, { id })
                .then(data => {
                    if (data) {
                        setUserGroups(data.map((group: any) => ({ value: group.id, label: group.name })));
                        setPreviousUserGroupIds(data.map((group: any) => group.id))
                    }
                })
                .catch(error => message.error('Error fetching user assigned groups:', error));
            fetchFhirResource(session.accessToken, { resourceType: 'Group', query: { identifier: id } })
                .then((data: IBundle) => {
                    setGroup(getResourcesFromBundle<IGroup>(data)[0]);
                })
                .catch((error: any) => message.error('Error fetching Group:', error));
            fetchFhirResource(session.accessToken, { resourceType: 'Practitioner', query: { identifier: id } })
                .then((data: IBundle) => {
                    setPractitioner(getResourcesFromBundle<IPractitioner>(data)[0]);
                })
                .catch((error: any) => message.error('Error fetching Practitioner:', error));
            fetchFhirResource(session.accessToken, { resourceType: 'PractitionerRole', query: { identifier: id } })
                .then((data: IBundle) => {
                    const practitionerRole = (getResourcesFromBundle<IPractitionerRole>(data)[0]);
                    setPractitionerRole(practitionerRole);
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
                        }
                    }
                    setUserType(userType);
                })
                .catch((error: any) => message.error('Error fetching PractitionerRole:', error));
        }
    }, [id, session?.accessToken]);


    const onChange = (key: keyof UserRepresentation) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(prevState => ({
            ...prevState,
            [key]: key === 'enabled' ? Boolean(+e.target.value) : e.target.value
        }));
        setErrors(prev => ({ ...prev, [key]: !e.target.value }));
    }

    const onUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserType(e.target.value as 'practitioner' | 'supervisor');
    };

    const onAppIdChange = (value: string) => {
        setUserData(prevState => ({
            ...prevState,
            attributes: {
                fhir_core_app_id: [value]
            }
        }));
        setErrors(prev => ({ ...prev, attributes: !value }));
    }

    const onGroupSelectionChange = (values: any) => {
        setUserGroups(values);
    }

    const onSubmit = async () => {
        try {
            if (!session?.accessToken) {
                message.error('Missing session');
                return;
            }
            if (!userData.firstName || !userData.lastName || !userData.username || !userData.attributes?.fhir_core_app_id?.length) {
                setErrors({
                    firstName: !userData.firstName,
                    lastName: !userData.lastName,
                    username: !userData.username,
                    attributes: !userData.attributes?.fhir_core_app_id?.length
                })
                return;
            }

            let userId: string = userData.id || '';
            if (userData.id) {
                await updateUser(session.accessToken, userData);
            }
            else {
                const createdUser = await createUser(session.accessToken, userData);
                userId = createdUser.id;
            }

            await Promise.all(userGroups.map((group) => {
                return addUserToGroup(session.accessToken as string, { id: userId, groupId: group.value });
            }));
            if (previousUserGroupIds) {
                await Promise.all(previousUserGroupIds.map((groupId) => {
                    if (!userGroups.map(ug => ug.value)?.includes(groupId)) {
                        return removeUserFromGroup(session.accessToken as string, { id: userId, groupId });
                    }
                }));
            }

            let officialIdentifier;
            let secondaryIdentifier;
            if (practitioner) {
                const currentIdentifiers = (practitioner as IPractitioner).identifier;
                officialIdentifier = getObjLike(currentIdentifiers, 'use', IdentifierUseCodes.OFFICIAL)[0];
                secondaryIdentifier = getObjLike(currentIdentifiers, 'use', IdentifierUseCodes.SECONDARY)[0];
            }

            if (!officialIdentifier) {
                officialIdentifier = {
                    use: IdentifierUseCodes.OFFICIAL,
                    value: v4(),
                };
            }

            if (!secondaryIdentifier) {
                secondaryIdentifier = getPractitionerSecondaryIdentifier(userId);
            }
            const practitionerPayload: IPractitioner = {
                resourceType: 'Practitioner',
                id: officialIdentifier.value,
                identifier: [officialIdentifier, secondaryIdentifier],
                active: userData.enabled ?? false,
                name: [
                    {
                        use: IdentifierUseCodes.OFFICIAL,
                        family: userData.lastName,
                        given: [userData.firstName ?? '', ''],
                    },
                ],
                telecom: [
                    {
                        system: 'email',
                        value: userData.email,
                    },
                ],
            };
            const createdPractitioner = await createUpdateFhirResource(session.accessToken, practitionerPayload);

            await createEditFhirGroupResource(
                userData.enabled ?? false,
                userId,
                `${userData.firstName} ${userData.lastName}`,
                practitionerPayload.id ?? '',
                group?.id,
                session.accessToken as string
            );
            await createEditPractitionerRoleResource(
                userType,
                userId,
                userData.enabled ?? false,
                practitionerPayload.id ?? '',
                createdPractitioner.name ?? [],
                practitionerRole?.id,
                session.accessToken as string
            )
            setUserData(defaultUserData);
            message.success(`User ${userData.id ? 'updated' : 'created'} successfully`);
            if (userData.id) {
                router.push('/admin/users');
            }
            else {
                router.push(`/admin/users/credentials/${userId}/${userData.username}`);
            }
        } catch (error) {
            message.error(`Error ${userData.id ? 'updating' : 'creating'} user`);
        }
    }

    const pageTitle = userData.id
        ? `Edit User | ${userData.username}`
        : 'Add User';

    return <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] justify-center flex-col">
        <h2 className="text-xl font-semibold mb-5">{pageTitle}</h2>
        <div className="p-5 bg-white h-min w-full justify-center flex">
            <div className="">
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">First Name<small className="text-red-500">*</small> :</label>
                    <input
                        className={`md:w-[350px] p-2 text-sm font-semilight border border-block rounded ${errors.firstName ? 'border-red-500' : ''}`}
                        value={userData.firstName} onChange={onChange('firstName')}
                    />
                </div>
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Last Name<small className="text-red-500">*</small> :</label>
                    <input
                        className={`md:w-[350px] p-2 text-sm font-semilight border border-block rounded ${errors.lastName ? 'border-red-500' : ''}`}
                        value={userData.lastName} onChange={onChange('lastName')}
                    />
                </div>
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Username<small className="text-red-500">*</small> :</label>
                    <input
                        className={`md:w-[350px] p-2 text-sm font-semilight border border-block rounded ${errors.username ? 'border-red-500' : ''}`}
                        value={userData.username} onChange={onChange('username')}
                        disabled={!!userData.id}
                    />
                </div>
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Email :</label>
                    <input
                        className="md:w-[350px] p-2 text-sm font-semilight border border-block rounded"
                        value={userData.email} onChange={onChange('email')}
                    />
                </div>
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">User Type :</label>
                    <input className="" type="radio" id="practitioner" name="usertype" value="practitioner" checked={userType === 'practitioner'} onChange={onUserTypeChange} />
                    <label className="ml-1" htmlFor="practitioner">Practitioner</label>
                    <input className="ml-5" type="radio" id="supervisor" name="usertype" value="supervisor" checked={userType === 'supervisor'} onChange={onUserTypeChange} />
                    <label className="ml-1" htmlFor="supervisor">Supervisor</label>
                </div>
                <div className="mt-5 flex">
                    <label className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Enable User :</label>
                    <input className="" type="radio" id="yes" name="enabled" value="1" checked={userData.enabled} onChange={onChange('enabled')} />
                    <label className="ml-1" htmlFor="yes">Yes</label>
                    <input className="ml-5" type="radio" id="no" name="enabled" value="0" checked={!userData.enabled} onChange={onChange('enabled')} />
                    <label className="ml-1" htmlFor="no">No</label>
                </div>
                <div className="mt-5 flex">
                    <label htmlFor="groups" className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Keycloak User Group:</label>
                    <ReactSelect
                        className='md:w-[350px] text-sm font-semilight md:w-[350px]'
                        options={groups.map((group: any) => {
                            return { value: group.id, label: group.name }
                        })}
                        value={userGroups}
                        onChange={onGroupSelectionChange}
                        isMulti
                    />
                </div>
                <div className="mt-5 flex">
                    <label htmlFor="groups" className="block min-w-[100px] md:min-w-[180px] font-regular mr-2 text-right mr-5">Application ID<small className="text-red-500">*</small> :</label>
                    <Select
                        status={errors.attributes ? 'error' : ''}
                        className='md:w-[350px] text-sm font-semilight md:w-[350px]'
                        options={composition?.map((e: any) => {
                            return { value: e.identifier.value, label: `${e.title}(${e.identifier.value})` }
                        }) ?? []}
                        value={userData.attributes?.fhir_core_app_id[0]}
                        onChange={onAppIdChange}
                    />
                </div>
                <div className="mt-5 flex justify-center">
                    <button
                        className="bg-app_primary disabled:bg-gray-300 text-white font-medium text-sm py-1 px-4 rounded mx-5"
                        onClick={onSubmit}
                    >
                        Save
                    </button>
                    <Link href={'/admin/users'} className="border rounded py-1 px-4" >Cancel</Link>
                </div>
            </div>
        </div>
    </div >
}
