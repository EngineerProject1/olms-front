import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd'
import User from 'mdoel/User'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

const UserDropMenu = () => {
  const personalCenter = () => {
    console.log('个人中心')
  }

  const logout = () => {
    axios.get('/auth/logout').then((resp) => {
      if (resp.data.code === 200) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setFlag(false)
        location.href = '/login'
      }
    })
  }
  const items: MenuProps['items'] = [
    {
      label: '个人中心',
      key: '1',
      onClick: personalCenter,
    },
    {
      label: '退出登录',
      key: '2',
      onClick: logout,
    },
  ]

  const [flag, setFlag] = useState(true)
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
    if (flag) {
      // 获取当前登录的用户信息
      axios.get('/token').then((resp) => {
        setUser(resp.data.data)
      })
    }
  }, [])

  return (
    <Space wrap>
      <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}>
        <Space>
          <Space>
            <Avatar
              src={
                user.avatar != ''
                  ? `/api/img/download?name=${user.avatar}`
                  : '/avatar.png'
              }
              size="large"
            />
          </Space>
          <Button
            style={{
              backgroundColor: '#001529',
              border: 'none',
              outline: 'none',
            }}>
            <Space style={{ fontSize: '18px', color: 'white' }}>
              {user.realName}
            </Space>
          </Button>
        </Space>
      </Dropdown>
    </Space>
  )
}

export default UserDropMenu
