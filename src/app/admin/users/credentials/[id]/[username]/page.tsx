'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

import { Button, Form, Col, Row, Input, message } from 'antd';
import { resetUserPassword } from '@/app/loader';


/** interface for data fields for team's form */
export interface UserCredentialsFormFields {
    password: string;
    confirm: string;
    temporary: boolean;
}

export const submitForm = (
    values: UserCredentialsFormFields,
    userId: string,
    accessToken: string,
    router: any
): void => {

    const { password } = values;
    resetUserPassword(accessToken, {
        id: userId,
        temporary: false,
        type: 'password',
        value: password,
    })
        .then(() => {
            message.success('Credentials updated successfully');
            router.push('/admin/users');
        })
        .catch((e) => {
            message.error(e.description);
        })
}

export default function UserCredentials() {

    const router = useRouter();
    const { id, username } = useParams();
    const { data: session } = useSession();


    const layout = {
        labelCol: {
            xs: { offset: 0, span: 16 },
            sm: { offset: 2, span: 10 },
            md: { offset: 0, span: 12 },
            lg: { offset: 0, span: 8 },
        },
        wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
    };
    const tailLayout = {
        wrapperCol: {
            xs: { offset: 0, span: 16 },
            sm: { offset: 12, span: 24 },
            md: { offset: 10, span: 16 },
            lg: { offset: 8, span: 14 },
        },
    };

    const heading = `${'User Credentials'} | ${username}`;


    return (
        <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] flex-col">
            <h2 className="text-xl font-semibold mb-5">{heading}</h2>
            <div className="p-5 bg-white h-min w-full justify-center flex">
                <Row className='min-w-[500px]'>
                    <Col className="bg-white p-3" span={24}>
                        <div className="form-container">
                            <Form
                                {...layout}
                                onFinish={(values: UserCredentialsFormFields) =>
                                    submitForm(values, id as string, session?.accessToken as string, router)
                                }
                            >
                                <Form.Item
                                    name="password"
                                    label={('Password')}
                                    rules={[
                                        {
                                            required: true,
                                            message: ('Password is required'),
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label={('Confirm Password')}
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: ('Confirm Password is required'),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('The two passwords that you entered do not match!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit" className="reset-password">
                                        {('Set password')}
                                    </Button>
                                    <Button onClick={() => router.push('/admin/users')} className="ml-5">
                                        {('Cancel')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
