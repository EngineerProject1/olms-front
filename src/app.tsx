import React from "react";
import { RouterProvider } from "react-router-dom";
import { rootRouter } from './components/router';
import { message } from 'antd';
import axios from "./tools/axios";
import { MessageInstance } from "antd/es/message/interface";

let messageApi: MessageInstance;

export default function App(props: any) {
    const [messageApi2, contextHolder] = message.useMessage();
    messageApi = messageApi2

    return (
        <>
            {contextHolder}
            <RouterProvider router={rootRouter} />
        </>
    );
}
export { messageApi };