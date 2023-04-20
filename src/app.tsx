import React from "react";
import { RouterProvider } from "react-router-dom";
import {rootRouter} from './components/router'

export default function App(props: any) {
    return (
        <RouterProvider router={rootRouter}/>
    );
}