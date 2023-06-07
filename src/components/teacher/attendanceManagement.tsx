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
import { GlobalContext } from 'app'
import dayjs from 'dayjs'
import { Key, useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'

export function AttendanceManagement() {
  const { messageApi } = useContext(GlobalContext)
  // 搜索框
  const { Search } = Input
  // 多选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  // 预约信息
  const [appointInfo, setAppointInfo] = useState()
  // 加载
  const [tableLoading, setTableLoading] = useState(true)
  // 打开考勤面板
  const [modalOpen, setModalOpen] = useState(false)

  // 考勤分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    pages: 1,
    name: '',
    loader: true,
    time: '',
    timeSlot: 0,
  })

  // 正在考勤的key
  const [editRecord, setEditRecord] = useState<any>({
    key: 0,
    status: '',
    id: 0,
  })

  // 所管理的实验室
  const [labs, setLabs] = useState<any>([])

  // 查询时的日期
  const [day, setDay] = useState<string>()
  // 查询时的时间段
  const [slot, setSlot] = useState<number>()

  // 页面加载

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
        record: {
          uid: Number
          key: Key
          status: String
          id: string
          type: number
        }
      ) => {
        const flag = record.type === 1
        return (
          <Space>
            <a
              onClick={() => {
                setModalOpen(true)
                setEditRecord({
                  key: flag ? record.uid : record.key,
                  status: record.status,
                  id: flag ? record.key : record.uid,
                })
              }}>
              考勤
            </a>
          </Space>
        )
      },
    },
  ]
  // 封装所选实验室id
  const [labId, setLabId] = useState<any>({
    id: 0,
    name: '无考勤实验室',
  })

  // 拉取考勤列表信息
  useEffect(() => {
    // 获取当前时间
    getNowFormatDate()

    // 加载所管理的实验室
    const loadLabs = async () => {
      let res = await axios.get('/auth/getLabs')
      let data = res.data.data
      // 默认显示第一个实验室考勤信息
      if (labId.id === 0) {
        setLabId({
          id: data[0].id,
          name: data[0].name,
        })
      }
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
      setTableLoading(true)
      const res = await axios.get(`/attendanceManager/${id}`, {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
        },
      })
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
            type: number
          }) => {
            return {
              uid: item.userId,
              key: item.id,
              id: item.userName,
              name: item.realName,
              experimentName: item.experimentName,
              status: transFormStatus(item.status),
              type: item.type,
            }
          }
        )
      )
      setTableLoading(false)
    }
    if (labId.id !== 0) {
      loadUsers(labId.id)
    } else {
      loadLabs()
    }
  }, [
    params.page,
    params.pageSize,
    params.total,
    params.loader,
    params.name,
    labId.id,
  ])

  // 设置当前实验室id
  const loadLabId = (id: Key, name: any) => {
    setLabId({
      ...labId,
      id: id,
      name: name,
    })
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

  // 新增考勤信息
  const addAttendance = async (
    appointmentId: Key,
    status: String,
    userId: Number
  ) => {
    await axios.post('/attendanceManager', {
      appointmentId: appointmentId,
      status: status,
      userId: userId,
    })
  }

  // 修改考勤信息
  const updateAttendance = async (
    appointmentId: Key,
    status: String,
    userId: Number
  ) => {
    await axios.put('/attendanceManager', {
      appointmentId: appointmentId,
      status: status,
      userId: userId,
    })
  }

  // 获取当前时间年月日以及时间段
  const getNowFormatDate = async () => {
    let date = new Date()
    let year = date.getFullYear() //获取完整的年份(4位)
    let month: any = date.getMonth() + 1 //获取当前月份(0-11,0代表1月)
    let strDate: any = date.getDate() // 获取当前日(1-31)
    if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

    let hour = date.getHours()
    let slot = 0
    if (hour >= 8 && hour < 10) {
      slot = 1
    } else if (hour >= 10 && hour < 12) {
      slot = 2
    } else if (hour >= 14 && hour < 16) {
      slot = 3
    } else if (hour >= 16 && hour < 18) {
      slot = 4
    }

    setDay(`${year}-${month}-${strDate}`)
    setSlot(slot)
  }

  // 为学生设置考勤状态
  const setStatus = async (e: any) => {
    setTableLoading(true)
    let status = e.target.value

    // 单个考勤
    if (selectedRowKeys.length === 0) {
      // 如果没有考勤过 添加考勤信息
      if (editRecord.status === '未考勤') {
        addAttendance(editRecord.key, status, Number(editRecord.id))
      }
      // 如果考勤过了 修改考勤状态
      else {
        updateAttendance(editRecord.key, status, Number(editRecord.id))
      }
    }
    // 批量考勤
    else {
      for (let i = 0; i < selectedRows.length; i++) {
        debugger
        const selectedRow = selectedRows[i]
        const flag = selectedRow.type == 1
        let appointmentId = flag ? selectedRow.uid : selectedRow.key
        let userId = flag ? selectedRow.key : selectedRow.uid
        let statusNow = selectedRow.status
        // 如果没有考勤过 添加考勤信息
        if (statusNow === '未考勤') {
          addAttendance(appointmentId, status, userId)
        }
        // 如果考勤过了 修改考勤状态
        else {
          updateAttendance(appointmentId, status, userId)
        }
      }
    }
    // 重置多选框
    setSelectedRowKeys([])
    messageApi.success('考勤成功')
    // 刷新页面
    setParams({
      ...params,
      loader: !params.loader,
    })
    // 重置record
    setEditRecord([])
    // 管理modal
    setModalOpen(false)
    setTableLoading(false)
  }

  // 可选框
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }

  // 按姓名搜索
  const onSearch = (value: string) => {
    setParams({
      ...params,
      name: value,
    })
  }

  return (
    <div>
      <Modal
        centered
        open={modalOpen}
        footer={null}
        width={420}
        onCancel={() => setModalOpen(false)}>
        <span style={{ marginRight: 20 }}>考勤状态</span>
        <Radio.Group
          size="large"
          style={{ height: 150 }}
          onChange={setStatus}
          value={0}>
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
        <Card title="当前实验室" style={{ width: 300 }}>
          <Select
            onSelect={loadLabId}
            style={{ width: 217 }}
            placeholder="请选择考勤实验室"
            notFoundContent="当前账号无管理的实验室"
            optionFilterProp="children"
            value={labId.name}
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
        <Card title="当前考勤时间" style={{ width: 300, marginLeft: 29 }}>
          <DatePicker
            inputReadOnly
            allowClear={false}
            open={false}
            style={{ width: 160, height: 32, marginBottom: 2 }}
            value={dayjs(day, 'YYYY-MM-DD')}
          />
        </Card>
        <Card title="当前考勤时间段" style={{ width: 300, marginLeft: 29 }}>
          <Select
            open={false}
            disabled={false}
            allowClear={false}
            style={{ width: 165, height: 35 }}
            options={[
              { value: 0, label: '当前不在实验时间' },
              { value: 1, label: '08:00 ~ 10:00' },
              { value: 2, label: '10:00 ~ 12:00' },
              { value: 3, label: '14:00 ~ 16:00' },
              { value: 4, label: '16:00 ~ 18:00' },
            ]}
            value={slot}
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
          onSearch={onSearch}
          style={{ width: 200 }}
          size="large"
        />

        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={() => setModalOpen(true)}
          style={{ marginRight: 50 }}>
          批量考勤
        </Button>
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
          disabled={tableLoading}
          showSizeChanger
          pageSizeOptions={[10, 15, 20]}
          onChange={(page, pageSize) => {
            setTableLoading(true)
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
