import React, { useEffect, useState } from 'react'
import { NavigateFunction, RouterProvider, useNavigate } from 'react-router-dom'
import { adminRouter, defaultRouter, roleToRouter } from 'components/router'
import { message } from 'antd'
import axios from 'tools/axios'
import { MessageInstance } from 'antd/es/message/interface'

export const GlobalContext = React.createContext<{
  setRouter: React.Dispatch<any>
  messageApi: MessageInstance
}>(null as any)

export default function App(props: any) {
  const [messageApi, contextHolder] = message.useMessage()
  const [router, setRouter] = useState(defaultRouter)
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
        console.log(data)
      })
    }
    const tmp = localStorage.getItem('role')
    if (tmp != null) {
      setRouter(roleToRouter[tmp as keyof {}])
    }
    return () => {
      axios.interceptors.response.clear()
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{ setRouter: setRouter, messageApi: messageApi }}>
      {contextHolder}
      <RouterProvider router={router} />
    </GlobalContext.Provider>
  )
}
