import {
  Button,
  Card,
  DatePicker,
  Input,
  Pagination,
  Select,
  Space,
  Table,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

export function AttendanceManagement() {
  // 搜索框
  const { Search } = Input
  // 多选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // 预约信息
  const [appointInfo, setAppointInfo] = useState([
    {
      name: '王五',
      key: 2021001,
      experientName: '牛顿力学',
      status: '未考勤',
    },
    {
      name: '王五',
      key: 2021001,
      experientName: '牛顿力学',
      status: '未考勤',
    },
  ])
  // 加载
  const [tableLoading, setTableLoading] = useState(false)

  // 考勤分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 50,
    pages: 1,
    name: '',
    loader: true,
  })

  // 所管理的实验室
  const [labs, setLabs] = useState([])

  // 表格列名
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '职工号/学号',
      dataIndex: 'key',
      width: '20%',
    },
    {
      title: '实验名称',
      dataIndex: 'experientName',
      width: '20%',
    },
    {
      title: '考勤状态',
      dataIndex: 'status',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (_: any, record: {}) => (
        <Space>
          <a
            onClick={() => {
              // loadFormValue(record.key)
              // setEditId(record.id)
            }}>
            考勤
          </a>
          {/* <Popconfirm title="是否该教师信息？">
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm> */}
        </Space>
      ),
    },
  ]

  // 拉取考勤列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get('/auth/attendanceManager', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
        },
      })
      console.log(res)
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
      // setAppointInfo(
      //   data.records.map(
      //     (item: {
      //       id: Number
      //       teacherName: String
      //       tid: Number
      //       collegeName: String
      //     }) => {
      //       return {
      //         id: item.id,
      //         key: item.tid,
      //         name: item.teacherName,
      //         college: item.collegeName,
      //       }
      //     }
      //   )
      // )
      // setLoading(false)
    }
    const loadLabs = async () => {
      let res = await axios.get('/auth/getLabs')
      console.log(res)
      let data = res.data.data
      setLabs(
        data.map((item: { id: React.Key; name: String }) => {
          return {
            key: item.id,
            name: item.name,
          }
        })
      )
    }
    console.log('刷新页面')
    // loadList()
    loadLabs()
  }, [params.page, params.pageSize, params.total, params.loader, params.name])

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log(selectedRowKeys)
    },
  }

  const dateFormat = 'YYYY-MM-DD'
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: 20,
        }}>
        <Card title="实验室" style={{ width: 300 }}>
          <Select
            style={{ width: 217 }}
            placeholder="请选择考勤实验室"
            optionFilterProp="children"
            filterOption={(input, option) =>
              ((option?.label ?? '') as any).includes(input)
            }
            options={labs.map((item: { key: React.Key; name: String }) => {
              return {
                value: item.key,
                label: item.name,
              }
            })}
          />
        </Card>
        <Card title="考勤时间" style={{ width: 300, marginLeft: 29 }}>
          <DatePicker
            inputReadOnly
            allowClear={false}
            open={false}
            style={{ width: 160, height: 32, marginBottom: 2 }}
            defaultValue={dayjs('2015-06-06', dateFormat)}
          />
        </Card>
        <Card title="考勤时间段" style={{ width: 300, marginLeft: 29 }}>
          <Select
            open={false}
            disabled={false}
            allowClear={false}
            placeholder="请选择时间段"
            style={{ width: 165, height: 35 }}
            options={[
              { value: 1, label: '08:00 ~ 10:00' },
              { value: 2, label: '10:00 ~ 12:00' },
              { value: 3, label: '14:00 ~ 16:00' },
              { value: 4, label: '16:00 ~ 18:00' },
            ]}
            value={2}
          />
        </Card>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
        {/* 搜索框 */}
        <Search
          placeholder="输入姓名搜索"
          // onSearch={onSearch}
          style={{ width: 200 }}
          size="large"
        />

        <Button type="primary">批量考勤</Button>
      </div>
      <div>
        <Table
          // components={}
          rowSelection={{
            preserveSelectedRowKeys: true,
            type: 'checkbox',
            ...rowSelection,
          }}
          bordered
          dataSource={appointInfo}
          columns={defaultColumns}
          pagination={false}
          loading={tableLoading}
        />
        {/*  分页 */}

        <Pagination
          style={{ float: 'right' }}
          pageSize={params.pageSize}
          showSizeChanger
          pageSizeOptions={[10, 15, 20]}
          onChange={(page, pageSize) => {
            setParams({
              ...params,
              page: page,
              pageSize: pageSize,
            })
          }}
          total={params.total}
          showQuickJumper
          showTotal={(total) => `总共${total}条数据`}
        />
      </div>
    </div>
  )
}
