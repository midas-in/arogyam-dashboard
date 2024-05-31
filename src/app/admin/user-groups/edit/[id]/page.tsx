'use client';

import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Button, Col, Row, Form, Input, Transfer, Spin, message } from 'antd';
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";

import {
    fetchSingleUserGroup, fetchUserRoles, fetchAssignedRoleMappings,
    fetchAvailableRoleMappings, assignRoles, removeAssignedRoles,
    createUserGroup, updateUserGroup
} from '@/app/loader';

/** default form initial values */
export const defaultInitialValues: GroupRepresentation = {
    access: {
        view: false,
        manage: false,
        manageMembership: false,
    },
    attributes: {},
    clientRoles: {},
    id: '',
    name: '',
    path: '',
    realmRoles: [],
    subGroups: [],
};

/**
 * Util function that updates assigned/available roles on keycloak
 *
 * @param {GroupRepresentation} initialValues - form initial values
 * @param {string[]} targetSelectedKeys - target choice box selected keys
 * @param {string[]} sourceSelectedKeys - source choice box selected keys
 * @param {RoleRepresentation[]} roles - list of all keycloak realm roles
 */
export const handleTransferChange = async (
    initialValues: GroupRepresentation,
    targetSelectedKeys: string[],
    sourceSelectedKeys: string[],
    roles: RoleRepresentation[],
    accessToken: string,
) => {
    if (targetSelectedKeys.length) {
        const data: RoleRepresentation[] = [];
        targetSelectedKeys.forEach((roleId: string) => {
            const roleObj = roles.find((role: RoleRepresentation) => role.id === roleId);
            data.push(roleObj as RoleRepresentation);
        });
        await removeAssignedRoles(accessToken, { id: initialValues.id, roles: data });
    } else if (sourceSelectedKeys.length) {
        const data: RoleRepresentation[] = [];
        sourceSelectedKeys.forEach((roleId: string) => {
            const roleObj = roles.find((role: RoleRepresentation) => role.id === roleId);
            data.push(roleObj as RoleRepresentation);
        });
        await assignRoles(accessToken, { id: initialValues.id, roles: data });
    }
};

export const submitForm = async (
    values: GroupRepresentation & { roles?: string[] },
    accessToken: string,
    setSubmittingCallback: Dispatch<SetStateAction<boolean>>,
    router: any
): Promise<void> => {
    if (values.id) {
        updateUserGroup(accessToken, values)
            .then(() => message.success(('User Group edited successfully')))
            .catch((_: Error) => message.error(('There was a problem editing User Group')))
            .finally(() => {
                router.push('/admin/user-groups');
                setSubmittingCallback(false);
            });
    } else {
        let newUUID: string | undefined;
        createUserGroup(accessToken, { name: values.name })
            .then((res: any) => {
                const locationStr = res.headers.get('location')?.split('/') as string[];
                newUUID = locationStr[locationStr.length - 1];
                message.success(('User Group created successfully'));
            })
            .catch((_: Error) => message.error(('There was a problem creating User Group')))
            .finally(() => {
                setSubmittingCallback(false);
                if (newUUID) {
                    router.push(`/admin/user-groups/${newUUID}`);
                }
            });
    }
};

export default function EditGroup() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [initialValues, setInitialValues] = React.useState<GroupRepresentation>(defaultInitialValues);
    const [allRoles, setAllRoles] = React.useState<RoleRepresentation[]>([]);
    const [availableRoles, setAvailableRoles] = React.useState<RoleRepresentation[]>([]);
    const [assignedRoles, setAssignedRoles] = React.useState<RoleRepresentation[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [sourceSelectedKeys, setSourceSelectedKeys] = useState<string[]>([]);
    const [targetSelectedKeys, setTargetSelectedKeys] = useState<string[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const router = useRouter();
    const [form] = Form.useForm();
    const { data: session } = useSession();

    const layout = {
        labelCol: {
            xs: { offset: 0, span: 16 },
            sm: { offset: 2, span: 10 },
            md: { offset: 0, span: 8 },
            lg: { offset: 0, span: 6 },
        },
        wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
    };
    const tailLayout = {
        wrapperCol: {
            xs: { offset: 0, span: 16 },
            sm: { offset: 12, span: 24 },
            md: { offset: 8, span: 16 },
            lg: { offset: 6, span: 14 },
        },
    };

    const fetchAllData = async () => {
        if (id && session?.accessToken) {
            setIsLoading(true);
            try {
                await fetchSingleUserGroup(session.accessToken, { id })
                    .then((data) => {
                        if (data) {
                            setInitialValues(data);
                        }
                    })
                await fetchUserRoles(session.accessToken).then(setAllRoles)
                await fetchAssignedRoleMappings(session.accessToken, { id })
                    .then((data) => {
                        if (data.length) {
                            setAssignedRoles(data);
                        }
                    })
                await fetchAvailableRoleMappings(session.accessToken, { id }).then(setAvailableRoles)
            }
            catch (e) {
                message.error('error fetching data')
            }
            finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {

        if (id && session?.accessToken) {
            fetchAllData();
        }
    }, [id, session?.accessToken])

    /**
     * Update form initial values when initialValues prop changes, without this
     * the form fields initial values will not change if initialValues is updated
     */
    React.useEffect(() => {
        form.setFieldsValue({
            ...initialValues,
        });
    }, [form, initialValues]);

    const onChange = async (nextTargetKeys: any[]) => {
        // only add finally block since catch has already
        // been handled in function definition
        handleTransferChange(
            initialValues,
            targetSelectedKeys,
            sourceSelectedKeys,
            allRoles,
            session?.accessToken as string
        ).finally(() => setTargetKeys(nextTargetKeys));
    };

    const onSelectChange = (sourceSelectedKeys: any[], targetSelectedKeys: any[]) => {
        setSourceSelectedKeys([...sourceSelectedKeys]);
        setTargetSelectedKeys([...targetSelectedKeys]);
    };

    const data = [...assignedRoles, ...availableRoles].map((item: RoleRepresentation) => ({
        key: item.id,
        title: item.name,
    }));

    const { name } = initialValues;
    const pageTitle = initialValues?.id
        ? `Edit User Group | ${name}`
        : 'New User Group';

    if (isLoading) {
        return <Spin size="large" className="custom-spinner" />;
    }

    return (
        <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] flex-col">
            <h2 className="text-xl font-semibold mb-5">{pageTitle}</h2>
            <div className="p-5 bg-white h-min w-full justify-center flex">
                <Row className="content-section user-group min-w-[300px]">
                    <Col className="bg-white p-3" span={24}>
                        <Form
                            {...layout}
                            form={form}
                            initialValues={{
                                ...initialValues,
                            }}
                            onFinish={(values: GroupRepresentation & { roles?: string[] }) => {
                                // remove roles array from payload
                                delete values.roles;
                                setIsSubmitting(true);
                                submitForm(
                                    { ...initialValues, ...values },
                                    session?.accessToken as string,
                                    setIsSubmitting,
                                    router,
                                ).catch(() => message.error('There was a problem submitting the form'));
                            }}
                        >
                            <Form.Item
                                name="name"
                                id="name"
                                label={'Name'}
                                rules={[{ required: true, message: 'Name is required' }]}
                            >
                                <Input />
                            </Form.Item>
                            {initialValues.id ? (
                                <Form.Item name="roles" id="roles" label={'Realm Roles'}>
                                    <Transfer
                                        dataSource={data}
                                        titles={[('Available Roles'), ('Assigned Roles')]}
                                        listStyle={{
                                            minWidth: 300,
                                            minHeight: 300,
                                        }}
                                        targetKeys={
                                            targetKeys.length
                                                ? targetKeys
                                                : assignedRoles.map((role: any) => role.id)
                                        }
                                        selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
                                        render={(item) => <div>{item.title}</div>}
                                        disabled={false}
                                        onChange={onChange}
                                        onSelectChange={onSelectChange}
                                        locale={{
                                            notFoundContent: ('The list is empty'),
                                            searchPlaceholder: ('Search'),
                                        }}
                                    />
                                </Form.Item>
                            ) : (
                                ''
                            )}
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit" className="create-group">
                                    {isSubmitting ? ('Saving') : ('Save')}
                                </Button>
                                <Button onClick={() => router.push('/admin/user-groups')} className="cancel-group ml-5">
                                    {('Cancel')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
