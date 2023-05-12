import { ConfigProvider, message } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import zhCN from 'antd/locale/zh_CN'
import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { defaultRouter, roleToRouter } from 'router/router'
import axios from 'tools/axios'

export const GlobalContext = React.createContext<{
  setRouter: React.Dispatch<any>
  messageApi: MessageInstance
}>(null as any)

export default function App(props: any) {
  let targetRouter = defaultRouter
  const token = localStorage.getItem('token')
  if (token != null) {
    const role = JSON.parse(atob(token.split('.')[1])).selectedRole
    targetRouter = roleToRouter[role as keyof {}]
  }

  const [messageApi, contextHolder] = message.useMessage()
  const [router, setRouter] = useState(targetRouter)
  useEffect(() => {
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
    if (localStorage.getItem('token') != null) {
      axios.get('/token').then((response) => {
        const data = response.data
        //console.log(data)
      })
    }
    return () => {
      axios.interceptors.response.clear()
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{ setRouter: setRouter, messageApi: messageApi }}>
      <ConfigProvider locale={zhCN}>
        {contextHolder}
        <RouterProvider router={router} />
      </ConfigProvider>
    </GlobalContext.Provider>
  )
}
