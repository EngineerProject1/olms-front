import { BarsOutlined, CheckCircleOutlined, DashboardOutlined, HighlightOutlined, UserOutlined } from "@ant-design/icons";
import { MenuItemProps, MenuProps } from "antd";
import { ItemType, MenuItemGroupType, MenuItemType } from "antd/es/menu/hooks/useItems";
import React from "react";

type MenuItem = [string,React.FunctionComponent<any>,string,[string,String][]?];
const adminMenuItems:MenuItem[]=[
    ["a",DashboardOutlined,"公告管理"],
    ["b",BarsOutlined,"实验室管理"],
    ["c",CheckCircleOutlined,"预约管理",[["c1","审核预约"],["c2","预约记录"]]],
    ["d",HighlightOutlined,"设备管理"],
    ["e",UserOutlined,"用户管理",[["e1","学生管理"],["e2","教师管理"],["e3","考勤管理"]]]
];

function MenuItemsToMenuProps(menuItems:MenuItem[]):MenuProps["items"]{
    let result:MenuProps["items"]=[];
    for(let menuItem of menuItems){
        let item:any={
            key:menuItem[0],
            icon:React.createElement(menuItem[1]),
            label:menuItem[2]
        }
        if(menuItem[3]!=undefined){
            item.children=menuItem[3].map((data)=>{
                return {
                    key:data[0],
                    label:data[1]
                }
            });
        }
        result.push(item as ItemType);
    }
    return result
}

export const adminMenu:MenuProps["items"]=MenuItemsToMenuProps(adminMenuItems)