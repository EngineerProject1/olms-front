import { Tag } from 'antd'

export interface AppointRecordsSelectParams {
  page: number
  pageSize: number
  type: number
  labId: number
}
export interface AppointRecords {
  appointUsername: string
  bookTime: string
  classNumber: number
  createTime: string
  endTime: string
  experimentName: string
  grade: number
  id: number
  labId: number
  labName: string
  majorId: number
  majorName: string
  purpose: string
  role: string
  startTime: string
  status: string
  time: string
  timeSlotId: number
  type: number
  updateTime: string
  userId: number
  username: string
}

export interface PersonAppoint {
  username: string
  appointUsername: string
  role: string
  labName: string
  experimentName: string
  purpose: string
  bookTime: string
  status: number
}

export interface ClassAppoint {
  username: string
  appointUsername: string
  role: string
  labName: string
  experimentName: string
  purpose: string
  bookTime: string
  status: number
  grade: string
}

export const personColumns = [
  {
    title: '学号/工号',
    dataIndex: 'username',
    width: '12.5%',
  },
  {
    title: '预约人',
    dataIndex: 'appointUsername',
    width: '12.5%',
  },
  {
    title: '身份',
    dataIndex: 'role',
    width: '8%',
    render: (role: string) => (
      <span>
        {<Tag color={role === 'teacher' ? 'geekblue' : 'green'}>{role}</Tag>}
      </span>
    ),
  },
  {
    title: '实验室',
    dataIndex: 'labName',
    width: '12.5%',
  },
  {
    title: '实验名称',
    dataIndex: 'experimentName',
    width: '12.5%',
  },
  {
    title: '目的',
    dataIndex: 'purpose',
    width: '12.5%',
  },
  {
    title: '预约时间',
    dataIndex: 'bookTime',
    width: '16.5%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '12.5%',
  },
]

export const classColumns = [
  {
    title: '学号/工号',
    dataIndex: 'username',
    width: '11.11%',
  },
  {
    title: '预约人',
    dataIndex: 'appointUsername',
    width: '11.11%',
  },
  {
    title: '身份',
    dataIndex: 'role',
    width: '6%',
    render: (role: string) => (
      <span>
        {<Tag color={role === 'teacher' ? 'geekblue' : 'green'}>{role}</Tag>}
      </span>
    ),
  },
  {
    title: '实验室',
    dataIndex: 'labName',
    width: '11.11%',
  },
  {
    title: '实验名称',
    dataIndex: 'experimentName',
    width: '11.11%',
  },
  {
    title: '目的',
    dataIndex: 'purpose',
    width: '11.11%',
  },
  {
    title: '预约班级',
    dataIndex: 'grade',
    width: '11.11%',
  },
  {
    title: '预约时间',
    dataIndex: 'bookTime',
    width: '16.22%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '11.11%',
  },
]
