import { createBrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import Main from "pages/main";
import { Login } from "pages/login";

export const defaultRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

export const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "announcement",
        element: <div>announcement</div>,
      },
      {
        path: "laboratory",
        element: <></>
      },
      {
        path: "appointment",
        children: [
          {
            path: "auditAppointment",
            element: <div>auditAppointment</div>,
          },
          {
            path: "appointmentRecord",
            element: <></>,
          }
        ],
      },
      {
        path: "device",
        element: <></>
      },
      {
        path: "user",
        children: [
          {
            path: "studentUser",
            element: <div>studentUser</div>,
          },
          {
            path: "attendance",
            element: <></>,
          },
          {
            path: "teacherUser",
            element: <></>
          }
        ],
      }
    ]
  },
]);