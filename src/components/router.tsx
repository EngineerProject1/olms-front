import Announcement from 'components/admin/announcement/announcement'
import {
  AnnouncementEditor,
  announcementLoader,
} from 'components/admin/announcement/announcementEditor'
import { Device } from 'components/admin/device/device'
import { adminMenu, studentMenu, teacherMenu } from 'components/sidebarMenus'
import { Login } from 'pages/login'
import Main from 'pages/main'
import { useEffect } from 'react'
import { createBrowserRouter, useNavigate } from 'react-router-dom'

export const defaultRouter = createBrowserRouter([
  {
    path: '/',
    element: <>None</>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Redirect target="" />,
  },
])

export const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={adminMenu} />,
    errorElement: <Redirect target="" />,
    children: [
      {
        index: true,
        element: <Redirect target="announcement" />,
      },
      {
        path: 'announcement',
        children: [
          { index: true, element: <Announcement /> },
          {
            path: 'edit/:noticeId',
            loader: announcementLoader as any,
            element: <AnnouncementEditor />,
          },
        ],
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
        element: (
          <>
            <Device />
          </>
        ),
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
    element: <Redirect target="announcement" />,
  },
])

export const teacherRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={teacherMenu} />,
    children: [
      {
        index: true,
        element: <Redirect target="appointment" />,
      },
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
    element: <Redirect target="appointment" />,
  },
])

export const studentRouter = createBrowserRouter([
  {
    path: '/',
    element: <Main menu={studentMenu} />,
    children: [
      {
        index: true,
        element: <Redirect target="labAppointment" />,
      },
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
    element: <Redirect target="labAppointment" />,
  },
])

export const roleToRouter = {
  admin: adminRouter,
  teacher: teacherRouter,
  student: studentRouter,
}

function Redirect(props: { target: string }) {
  const navigate = useNavigate()
  console.log('redirct from ', location.pathname, ' to ', props.target)
  useEffect(() => {
    navigate(props.target)
  }, [])
  return <></>
}
