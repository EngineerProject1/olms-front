import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  MenuProps,
  theme,
  Typography,
} from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import User from 'mdoel/User'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'tools/axios'

const { Header, Sider } = Layout
const { Title, Text } = Typography
const headerColor = '#ffffff'

function MenuTrigger(props: {
  collapsed: boolean
  toggleCollapsed: React.MouseEventHandler<HTMLAnchorElement> &
    React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: headerColor,
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'inset 0px 1px 0px #F0F0F0',
      }}>
      <Button
        type="text"
        style={{ marginLeft: 16 }}
        onClick={props.toggleCollapsed}>
        {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  )
}

export default function Main(props: { menu: MenuProps['items'] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [menuConfig, setMenuConfig] = useState<{
    openKeys: string[]
    selectKeys: string[]
    breadCrumbItems: ItemType[]
  }>({
    openKeys: [],
    selectKeys: [],
    breadCrumbItems: [],
  })
  const navigate = useNavigate()

  // 用户信息
  const [user, setUser] = useState<User>({
    id: 1,
    username: 'xxx',
    passowrd: '',
    salt: '',
    realName: 'xxx',
    sex: '男',
    phone: '111',
    email: '222',
    avatar: '',
    createTime: new Date(),
    updateTime: new Date(),
  })

  useEffect(() => {
    // 获取当前登录的用户信息
    axios.get('/token').then((resp) => {
      setUser(resp.data.data)
    })
    const urlSegement = location.pathname.split('/').filter((value) => value)
    let defaultOpenkeys: string[] = []
    let breadCrumbItems = [{ title: <HomeOutlined /> }]
    let item: string
    let i = 0
    let menu = props.menu!!
    item = urlSegement[i]
    while (item != undefined) {
      item = urlSegement[i]
      const result: any = menu.find((value) => value!!.key == item)
      defaultOpenkeys.push(item)
      breadCrumbItems.push({ title: result.label })
      i++
      item = urlSegement[i]
      menu = result.children
    }
    defaultOpenkeys.pop()
    setMenuConfig({
      openKeys: defaultOpenkeys,
      selectKeys: [urlSegement[urlSegement.length - 1]],
      breadCrumbItems: breadCrumbItems,
    })
  }, [])

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setMenuConfig({ ...menuConfig, openKeys: [keys[keys.length - 1]] })
  }
  const onSelect = (info: { keyPath: string[] }) => {
    let result = ''
    for (let item of info.keyPath.reverse()) {
      result += `/${item}`
    }
    navigate(result)
    const urlSegement = location.pathname.split('/').filter((value) => value)
    let breadCrumbItems = [{ title: <HomeOutlined /> }]
    let item: string
    let i = 0
    let menu = props.menu!!
    item = urlSegement[i]
    while (item != undefined) {
      item = urlSegement[i]
      const result: any = menu.find((value) => value!!.key == item)
      breadCrumbItems.push({ title: result.label })
      i++
      item = urlSegement[i]
      menu = result.children
    }
    setMenuConfig({
      ...menuConfig,
      selectKeys: [urlSegement[urlSegement.length - 1]],
      breadCrumbItems: breadCrumbItems,
    })
  }

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingInline: 0,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 28 }}>
          <img
            src="/logo.svg"
            style={{ width: 35, height: 35, marginRight: 8 }}
          />
          <Title level={2} style={{ marginBottom: 0, color: headerColor }}>
            OLMS
          </Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 80 }}>
          {/* <Badge count={50} overflowCount={100} size="small" dot={true} >
            <BellOutlined style={{ fontSize: 20, color: headerColor }} />
          </Badge> */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            {user.avatar}
            <Avatar
              src={
                user.avatar != ''
                  ? `/api/img/download?name=${user.avatar}`
                  : '/avatar.png'
              }
              size="large"
              style={{ marginRight: 2 }}
            />
            <Text
              style={{
                color: headerColor,
                fontSize: '18px',
                marginLeft: '12px',
              }}>
              {user.realName}
            </Text>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider
          trigger={React.createElement(MenuTrigger, {
            collapsed,
            toggleCollapsed,
          })}
          collapsible
          collapsed={collapsed}
          width={200}
          style={{
            background: colorBgContainer,
            overflowY: 'auto',
            userSelect: 'none',
          }}>
          <Menu
            mode="inline"
            selectedKeys={menuConfig.selectKeys}
            style={{ height: '100%', borderRight: 0 }}
            items={props.menu}
            inlineCollapsed={collapsed}
            openKeys={menuConfig.openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={menuConfig.breadCrumbItems}
          />
          <div
            style={{
              padding: '24px 24px 0px 24px',
              margin: 0,
              background: colorBgContainer,
            }}>
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}
