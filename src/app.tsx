import React, { useEffect, useState } from 'react'
import { NavigateFunction, RouterProvider, useNavigate } from 'react-router-dom'
import { adminRouter, defaultRouter } from 'components/router'
import { message } from 'antd'
import axios from 'tools/axios'
import { MessageInstance } from 'antd/es/message/interface'

export const GlobalContext = React.createContext<{
  setRouter: React.Dispatch<any>
  messageApi: MessageInstance
}>(null as any)
let hasResponseInterceptor = false

export default function App(props: any) {
  const [messageApi, contextHolder] = message.useMessage()
  const [router, setRouter] = useState(defaultRouter)
  if (hasResponseInterceptor) {
    axios.interceptors.response.clear()
  }
  hasResponseInterceptor = true
  axios.interceptors.response.use((response) => {
    let data = response.data
    if (data.code != 200) {
      messageApi.error(data.msg)
    }
    return response
  })
  return (
    <GlobalContext.Provider
      value={{ setRouter: setRouter, messageApi: messageApi }}>
      {contextHolder}
      <RouterProvider router={router} />
    </GlobalContext.Provider>
  )
}
