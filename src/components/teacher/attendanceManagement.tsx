import {
  Button,
  Card,
  DatePicker,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Space,
  Table,
} from 'antd'
import dayjs from 'dayjs'
import { Key, useEffect, useState } from 'react'
import axios from 'tools/axios'

export function AttendanceManagement() {
  // 搜索框
  const { Search } = Input
  // 多选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // 预约信息
  const [appointInfo, setAppointInfo] = useState()
  // 加载
  const [tableLoading, setTableLoading] = useState(false)
  // 打开考勤面板
  const [modalOpen, setModalOpen] = useState(false)

  // 考勤分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 50,
    pages: 1,
    name: '',
    loader: true,
  })

  // 正在考勤的key
  const [editRecord, setEditRecord] = useState<any>({
    key: 0,
    status: '',
    id: 0,
  })

  // 所管理的实验室
  const [labs, setLabs] = useState<any>([])

  // 表格列名
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '职工号/学号',
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: '实验名称',
      dataIndex: 'experimentName',
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
      render: (
        _: any,
        record: { uid: Number; key: Key; status: String; id: Number }
      ) => (
        <Space>
          <a
            onClick={() => {
              setModalOpen(true)
              console.log(record.key, record.status, record.id)
              setEditRecord({
                key: record.key,
                status: record.status,
                id: record.uid,
              })
              console.log(record)
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
    // 加载所管理的实验室
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
    // 加载用户信息
    const loadUsers = async (id: Key) => {
      const res = await axios.get(`/attendanceManager/${id}`, {
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
      setAppointInfo(
        data.records.map(
          (item: {
            userId: Number
            id: Key
            userName: String
            realName: String
            experimentName: String
            status: Number
          }) => {
            return {
              uid: item.userId,
              key: item.id,
              id: item.userName,
              name: item.realName,
              experimentName: item.experimentName,
              status: transFormStatus(item.status),
            }
          }
        )
      )
    }
    if (labId !== 0) {
      loadUsers(labId)
    } else {
      loadLabs()
    }
  }, [params.page, params.pageSize, params.total, params.loader, params.name])

  // 设置当前实验室id
  const loadLabId = (id: Key) => {
    setLabId(id)
    setParams({
      ...params,
      loader: !params.loader,
    })
  }

  // 转状态为字符串
  const transFormStatus = (status: any) => {
    let str = '未考勤'
    if (status === 0) {
      str = '缺勤'
    } else if (status === 1) {
      str = '正常'
    } else if (status === 2) {
      str = '迟到'
    } else if (status === 3) {
      str = '早退'
    } else if (status === 4) {
      str = '请假'
    }
    return str
  }

  //
  const setStatus = async (e: any) => {
    console.log(e.target.value)
    let status = e.target.value
    // 如果没有考勤过 添加考勤信息
    if (editRecord.status === '未考勤') {
      await axios.post('/attendanceManager', {
        appointmentId: editRecord.key,
        status: status,
        userId: Number(editRecord.id),
      })
    }
    // 如果考勤过了 修改考勤状态
    else {
      await axios.put('/attendanceManager', {
        appointmentId: editRecord.key,
        status: status,
        userId: Number(editRecord.id),
      })
    }
    // 刷新页面
    setParams({
      ...params,
      loader: !params.loader,
    })
    // 重置record
    setEditRecord([])
    // 管理modal
    setModalOpen(false)
  }
  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log(selectedRowKeys)
    },
  }

  const dateFormat = 'YYYY-MM-DD'
  // 封装所选实验室id
  const [labId, setLabId] = useState<Key>(0)
  return (
    <div>
      <Modal
        centered
        open={modalOpen}
        footer={null}
        width={420}
        onCancel={() => setModalOpen(false)}>
        <span style={{ marginRight: 20 }}>考勤状态</span>
        <Radio.Group size="large" style={{ height: 150 }} onChange={setStatus}>
          <div style={{ marginTop: 50 }}>
            <Radio.Button value="1">正常</Radio.Button>
            <Radio.Button value="2">迟到</Radio.Button>
            <Radio.Button value="3">早退</Radio.Button>
            <Radio.Button value="4">请假</Radio.Button>
          </div>
        </Radio.Group>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: 20,
        }}>
        <Card title="实验室" style={{ width: 300 }}>
          <Select
            onSelect={loadLabId}
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
          onRow={(record) => {
            return {
              onClick: (event) => {}, // 点击行
            }
          }}
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