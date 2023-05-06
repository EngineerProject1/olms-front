import {
  createBrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import Main from 'pages/main'
import { Login } from 'pages/login'
import { adminMenu, teacherMenu, studentMenu } from './sidebarMenus'

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

export const teacherRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={teacherMenu} />,
    children: [
      {
        path: 'appointment',
        children: [
          {
            path: 'appointmentInfo',
            element: <div>appointmentInfo</div>,
          },
          {
            path: 'labAppointment',
            element: <div>labAppointment</div>,
          },
        ],
      },
      {
        path: 'deviceBorrow',
        element: <div>deviceBorrow</div>,
      },
      {
        path: 'attendance',
        element: <div>attendance</div>,
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
])

export const studentRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={studentMenu} />,
    children: [
      {
        path: 'labAppointment',
        element: <div>labAppointment</div>,
      },
      {
        path: 'checkRecord',
        element: <div>checkRecord</div>,
      },
      {
        path: 'deviceBorrow',
        element: <div>deviceBorrow</div>,
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
])
