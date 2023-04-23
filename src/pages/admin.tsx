import React from 'react';
import { BellOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, MenuProps, Typography } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const headerColor = "#ffffff";

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key:string = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey:number = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

export default function Admin(props: any) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{width:"100%",height:"100%"}}>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.svg" style={{ width: 35, height: 35, marginRight: 8 }} />
          <Title level={2} style={{ marginBottom: 0, color: headerColor }}>OLMS</Title>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <Badge count={50} overflowCount={100} size="small" dot={true} >
            <BellOutlined style={{ fontSize: 20, color: headerColor }} />
          </Badge> */}
          <div style={{ display: "flex", alignItems: "center",marginLeft:8 }}>
            <Avatar src="/avatar.png" size='small' style={{marginRight:2}}/>
            <Text style={{ color: headerColor }}>9622</Text>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer,overflowY:"auto" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};