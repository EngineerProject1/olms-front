import React, { useState } from 'react';
import { BellOutlined, LaptopOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, MenuProps, Typography } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { adminMenu } from 'components/sidebarMenus';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const headerColor = "#ffffff";

function MenuTrigger(props:{collapsed:boolean,toggleCollapsed:React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>}){
  return(
    <div style={{width:"100%",height:"100%",backgroundColor:headerColor,display:"flex",alignItems:"center",boxShadow:"inset 0px 1px 0px #F0F0F0"}}>
      <Button type="text" style={{marginLeft:16}} onClick={props.toggleCollapsed} >
        {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  );
}

export default function Admin(props: any) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function toggleCollapsed(){
    setCollapsed(!collapsed);
  }

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
        <Sider trigger={React.createElement(MenuTrigger,{collapsed,toggleCollapsed})} collapsible collapsed={collapsed} width={200} style={{ background: colorBgContainer,overflowY:"auto" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={adminMenu}
            inlineCollapsed={collapsed}
            // items={items2}
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