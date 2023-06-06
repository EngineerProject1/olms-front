import Announcement from 'components/admin/announcement/announcement'
import AppointRecord from 'components/admin/appointment/appointmentRecord/AppointRecord'
import { Device } from 'components/admin/device/device'
import Lab from 'components/admin/lab/Lab'
import StudentManagement from 'components/admin/userManagement/studentManagement/studentManagement'
import TeacherManagement from 'components/admin/userManagement/teacherManagement/teacherManagement'
import LabAppointment from 'components/common/LabAppointment/labAppointment'
import Home from 'components/home/Home'
import { BasicInformation } from 'components/person/basicInformation'
import { ChangePassword } from 'components/person/changePassword'
import Person from 'components/person/person'
import { adminMenu, studentMenu, teacherMenu } from 'components/sidebarMenus'
import Attendance from 'components/student/attendance/attendance'
import { DeviceBorrow } from 'components/student/device/deviceBorrow'
import { DeviceReturn } from 'components/student/device/deviceReturn'
import { AppointmentInfo } from 'components/teacher/appointmentInfo/appointmentInfo'
import { AttendanceManagement } from 'components/teacher/attendanceManagement'
import { Login } from 'pages/login'
import Main from 'pages/main'
import { useEffect } from 'react'
import { createBrowserRouter, useNavigate } from 'react-router-dom'

export const defaultRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
        element: (
          <>
            <Lab />
          </>
        ),
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
            element: <AppointRecord />,
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
            path: 'teacherUser',
            element: <TeacherManagement />,
          },
          {
            path: 'attendance',
            element: <>attendance</>,
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
            element: <ChangePassword />,
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
        element: <Redirect target="appointment/appointmentInfo" />,
      },
      {
        path: 'appointment',
        children: [
          {
            path: 'appointmentInfo',
            element: <AppointmentInfo />,
          },
          {
            path: 'labAppointment',
            element: <LabAppointment />,
          },
        ],
      },
      {
        path: 'device',
        children: [
          {
            path: 'deviceBorrow',
            element: <DeviceBorrow />,
          },
          {
            path: 'deviceReturn',
            element: <DeviceReturn />,
          },
        ],
      },
      {
        path: 'attendance',
        element: <AttendanceManagement />,
      },
      {
        path: 'person',
        element: <Person />,
        children: [
          { path: 'basicInformation', element: <BasicInformation /> },
          {
            path: 'changePassword',
            element: <ChangePassword />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Redirect target="appointment/appointmentInfo" />,
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
        element: <LabAppointment />,
      },
      {
        path: 'checkRecord',
        element: <Attendance />,
      },
      {
        path: 'device',
        children: [
          {
            path: 'deviceBorrow',
            element: <DeviceBorrow />,
          },
          {
            path: 'deviceReturn',
            element: <DeviceReturn />,
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
            element: <ChangePassword />,
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
