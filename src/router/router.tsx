import Announcement from 'components/admin/announcement/announcement'
import { Device } from 'components/admin/device/device'
import StudentManagement from 'components/admin/userManagement/studentManagement/studentManagement'
import { BasicInformation } from 'components/person/basicInformation'
import { adminMenu, studentMenu, teacherMenu } from 'components/sidebarMenus'
import { Login } from 'pages/login'
import Main from 'pages/main'
import Person from 'pages/person'
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
        element: <Announcement />,
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
            element: <StudentManagement />,
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
      {
        path: 'person',
        element: <Person />,
        children: [
          { path: 'basicInformation', element: <BasicInformation /> },
          {
            path: 'changePassword',
            element: 'change',
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
      {
        path: 'person',
        element: <Person />,
        children: [
          { path: 'basicInformation', element: <BasicInformation /> },
          {
            path: 'changePassword',
            element: 'change',
          },
        ],
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
      {
        path: 'person',
        element: <Person />,
        children: [
          { path: 'basicInformation', element: <BasicInformation /> },
          {
            path: 'changePassword',
            element: 'change',
          },
        ],
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
