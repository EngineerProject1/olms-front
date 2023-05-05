import {
  createBrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import Main from 'pages/main'
import { Login } from 'pages/login'
import { adminMenu } from './sidebarMenus'

export const defaultRouter = createBrowserRouter([
  {
    path: '/',
    element: <>None</>,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={adminMenu} />,
    children: [
      {
        path: 'announcement',
        element: <div>announcement</div>,
      },
      {
        path: 'laboratory',
        element: <>laboratory</>,
      },
      {
        path: 'appointment',
        children: [
          {
            path: 'auditAppointment',
            element: <div>auditAppointment</div>,
          },
          {
            path: 'appointmentRecord',
            element: <>appointmentRecord</>,
          },
        ],
      },
      {
        path: 'device',
        element: <>device</>,
      },
      {
        path: 'user',
        children: [
          {
            path: 'studentUser',
            element: <div>studentUser</div>,
          },
          {
            path: 'attendance',
            element: <>attendance</>,
          },
          {
            path: 'teacherUser',
            element: <>teacherUser</>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
])
