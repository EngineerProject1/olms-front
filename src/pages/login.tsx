import React, { useContext } from "react";
import { Avatar, Button, Checkbox, Form, Input, Layout, message } from 'antd'
import { Footer } from "antd/es/layout/layout";
import { GithubOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Typography } from 'antd';
import axios from "tools/axios"
import { GlobalContext } from "app";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export function Login(props: any) {
    const marginX = 20;
    const messageApi = useContext(GlobalContext).messageApi;

    const onFinish = (values: any) => {
        axios.post("/login", values).then((response) => {
            let data = response.data;
            if (data.code == 200) {
                messageApi.success("成功登录");
                sessionStorage.setItem("token", data.data.token);
                console.log(response)
            }
        });
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    function openGithub() {
        window.open("https://github.com/EngineerProject1/olms-front");
    }

    return (
        <Layout style={{ width: "100%", height: "100%", background: "#F0F2F5" }}>
            <Content
                style={{
                    margin: 0,
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflowX: "hidden",
                    overflowY: "auto",
                    backgroundColor: "#F0F2F5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <div style={{
                    width: 280,
                    height: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <div style={{
                        width: "100%",
                        marginBottom: 45,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: 13,
                            marginBottom: 40
                        }}>
                            <Avatar src={"/logo.svg"} />
                            <Title level={2} style={{ marginBottom: 3, marginLeft: 8 }}>OLMS</Title>
                        </div>
                        <Form
                            name="basic"
                            style={{ maxWidth: 600, width: "100%" }}
                            onFinish={onFinish}
                            layout="vertical"
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入学号/教职工号' }]}
                            >
                                <Input placeholder="学号/教职工号" prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入密码' }]}
                            >
                                <Input.Password placeholder="密码" prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item >
                                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Content>
            <Footer style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#F0F2F5" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                    <Text type="secondary" style={{ marginLeft: marginX, marginRight: marginX }}>cuit9622</Text>
                    <GithubOutlined
                        style={{ color: "rgba(0,0,0,0.45)", marginLeft: marginX, marginRight: marginX }}
                        onClick={openGithub} />
                    <Text type="secondary" style={{ marginLeft: marginX, marginRight: marginX }}>OLMS</Text>
                </div>
                <Text type="secondary">Copyright ©2023 Produced by cuit9622</Text>
            </Footer>
        </Layout >
    );
}