import React, { useState } from 'react';
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, MenuProps, Typography } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const headerColor = "#ffffff";

function MenuTrigger(props: { collapsed: boolean, toggleCollapsed: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: headerColor, display: "flex", alignItems: "center", boxShadow: "inset 0px 1px 0px #F0F0F0" }}>
      <Button type="text" style={{ marginLeft: 16 }} onClick={props.toggleCollapsed} >
        {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  );
}

export default function Main(props: { menu: MenuProps["items"] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys([keys[keys.length - 1]]);
  };
  const onSelect = (info: { keyPath: string[] }) => {
    let result = "";
    for (let item of info.keyPath.reverse()) {
      result += `/${item}`;
    }
    navigate(result);
  }

  const urlSegement = location.pathname.split("/").filter((value) => value);
  let breadCrumbItems = [{ title: <HomeOutlined /> }];
  console.log(props.menu)
  let item: string;
  let i = 0;
  let menu = props.menu!!;
  item = urlSegement[i];
  while (item != undefined) {
    item = urlSegement[i];
    const result: any = menu.find((value) => value!!.key == item);
    breadCrumbItems.push({ title: result.label });
    i++;
    item = urlSegement[i];
    menu = result.children;
  }
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: 0 }}>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 28 }}>
          <img src="/logo.svg" style={{ width: 35, height: 35, marginRight: 8 }} />
          <Title level={2} style={{ marginBottom: 0, color: headerColor }}>OLMS</Title>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 80 }}>
          {/* <Badge count={50} overflowCount={100} size="small" dot={true} >
            <BellOutlined style={{ fontSize: 20, color: headerColor }} />
          </Badge> */}
          <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
            <Avatar src="/avatar.png" size='small' style={{ marginRight: 2 }} />
            <Text style={{ color: headerColor }}>9622</Text>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider trigger={React.createElement(MenuTrigger, { collapsed, toggleCollapsed })} collapsible collapsed={collapsed} width={200} style={{ background: colorBgContainer, overflowY: "auto", userSelect: "none" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['announcement']}
            style={{ height: '100%', borderRight: 0 }}
            items={props.menu}
            inlineCollapsed={collapsed}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={breadCrumbItems} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};