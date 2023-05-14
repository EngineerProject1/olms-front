import { ConfigProvider, message } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import zhCN from 'antd/locale/zh_CN'
import { User } from 'mdoel/User'
import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { defaultRouter, roleToRouter } from 'router/router'
import axios from 'tools/axios'

export const GlobalContext = React.createContext<{
  messageApi: MessageInstance
  user: User
  setRouter: React.Dispatch<React.SetStateAction<any>>
  setUser: React.Dispatch<React.SetStateAction<User>>
}>(null as any)

export default function App(props: any) {
  //通过token中的信息设置对应路由
  let targetRouter = defaultRouter
  const token = localStorage.getItem('token')
  if (token != null) {
    const role = JSON.parse(atob(token.split('.')[1])).selectedRole
    targetRouter = roleToRouter[role as keyof {}]
  }

  const [messageApi, contextHolder] = message.useMessage()
  const [router, setRouter] = useState(targetRouter)
  const [user, setUser] = useState<User>({
    id: 0,
    username: '',
    passowrd: '',
    salt: '',
    realName: '',
    sex: '',
    phone: '',
    email: '',
    avatar: '',
    createTime: new Date(),
    updateTime: new Date(),
  })

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      axios.get('/auth/token').then((resp) => {
        if (resp.data.data.grade) {
          resp.data.data.grade = resp.data.data.grade + '级'
        }
        if (resp.data.data.classNumber) {
          resp.data.data.classNumber = resp.data.data.classNumber + '班'
        }
        setUser(resp.data.data)
      })
    }
    axios.interceptors.response.use((response) => {
      let data = response.data
      if (data.code != 200) {
        messageApi.error(data.msg)
        switch (data.code) {
          case 401: //token异常时将路由设置为默认路由
            localStorage.removeItem('token')
            setRouter(defaultRouter)
            break
        }
        return Promise.reject(response)
      }
      return response
    })
    return () => {
      axios.interceptors.response.clear()
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        setRouter: setRouter,
        messageApi: messageApi,
        user: user,
        setUser: setUser,
      }}>
      <ConfigProvider locale={zhCN}>
        {contextHolder}
        <RouterProvider router={router} />
      </ConfigProvider>
    </GlobalContext.Provider>
  )
}
