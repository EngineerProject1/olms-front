import { DatePicker, Input, Pagination, Select, Space, Table } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import axios from 'tools/axios'
import { BookAppointmentForm } from './bookAppointmentForm'

export interface AppointmentRequest {
  classNumber?: number
  experimentName: string
  labId: number
  offsetDay: number
  purpose: string
  timeSlotId: number
  type?: string
}
interface TimeSlot {
  value: string
  label: string
  disabled?: boolean
}
interface Appointment {
  key: string
  labId: number
  name: string
  location: string
  capacity: number
  cur: number
}
export default function LabAppointment() {
  const { Search, TextArea } = Input
  const [modalOpen, setModalOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [pageParam, setPageParam] = useState({
    page: 1,
    pageSize: 5,
    offSetDay: 0,
    timeSlotId: 0,
    type: '',
  })
  const [targetDateTime, setTargetDateTim] = useState<{
    targetDate?: any
    targetTime?: string
  }>({})
  const currentDateString = useRef('')
  const [list, setList] = useState<Appointment[]>([])
  const [total, setTotal] = useState(1)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    axios.get('/timeSlot').then((response) => {
      const data = response.data.data
      let result: TimeSlot[] = []
      data.map((item: any) => {
        result.push({
          value: item.id.toString(),
          label: `${item.startTime} ~ ${item.endTime}`,
        })
      })
      setTimeSlots(result)
      setTargetDateTim({ targetDate: dayjs().add(1, 'day'), targetTime: '1' })
      setPageParam({ ...pageParam, offSetDay: 1, timeSlotId: 1 })
    })
  }, [])
  useEffect(() => {
    if (
      pageParam.timeSlotId != 0 &&
      pageParam.offSetDay != 0 &&
      modalOpen == false
    ) {
      setLoading(true)
      axios
        .get('/auth/getTargetTypeAppointment', { params: pageParam })
        .then((response) => {
          const data = response.data.data
          const resultList: Appointment[] = data.records
          setList(
            resultList.map((item: Appointment) => ({
              ...item,
              key: item.labId.toString(),
              curCapacity: `${item.cur}/${item.capacity}`,
            }))
          )
          setLoading(false)
          setTotal(data.total)
        })
    }
  }, [pageParam, modalOpen])

  const appointRequest = useRef<AppointmentRequest>({
    labId: 0,
    experimentName: '',
    offsetDay: 0,
    purpose: '',
    timeSlotId: 0,
  })
  const bookLab = (key: React.Key) => {
    appointRequest.current = {
      ...appointRequest.current,
      labId: Number.parseInt(key as string),
      offsetDay: pageParam.offSetDay,
      timeSlotId: pageParam.timeSlotId,
    }
    setModalOpen(true)
  }
  const onTimeSlotSelect = (value: string) => {
    setTargetDateTim({ ...targetDateTime, targetTime: value })
    setPageParam({ ...pageParam, timeSlotId: Number.parseInt(value) })
  }
  const onDateSelect = (date: any, dateString: string) => {
    const offsetDay = date.diff(dayjs().startOf('day'), 'day')
    currentDateString.current = dateString
    setTargetDateTim({ ...targetDateTime, targetDate: date })
    setPageParam({ ...pageParam, offSetDay: offsetDay })
  }
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return (
      current &&
      //dayjs().endOf('day')表示当天的最后一刻时间
      //dayjs().add(7, 'day')表示7天后的最后一刻时间
      (current < dayjs().endOf('day') || current >= dayjs().add(7, 'day'))
    )
  }
  const columns = [
    {
      title: '实验室名称',
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: '实验室地点',
      dataIndex: 'location',
      width: '16%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '12%',
    },
    {
      title: '开放时间',
      dataIndex: 'openTime',
      width: '20%',
      render: (_: any, record: { key: React.Key }) => (
        <>{`${currentDateString.current} ${
          timeSlots[pageParam.timeSlotId - 1].label
        }`}</>
      ),
    },
    {
      title: '容量',
      dataIndex: 'curCapacity',
      width: '16%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '16%',
      render: (_: any, record: { key: React.Key }) => (
        <Space>
          <a
            onClick={() => {
              bookLab(record.key)
            }}>
            预约
          </a>
        </Space>
      ),
    },
  ]
  return (
    <>
      <BookAppointmentForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        appointRequest={appointRequest.current}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
        {/* 搜索框 */}
        <Search
          placeholder="类型"
          onSearch={(e) => {
            setPageParam({ ...pageParam, type: e })
          }}
          style={{ width: 300 }}
          size="large"
        />
        <div
          style={{
            width: 300,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <DatePicker
            allowClear={false}
            disabledDate={disabledDate}
            onChange={onDateSelect}
            value={targetDateTime.targetDate}
          />
          <Select
            allowClear={false}
            placeholder="请选择时间段"
            style={{ width: 130 }}
            onChange={onTimeSlotSelect}
            options={timeSlots}
            value={targetDateTime.targetTime}
          />
        </div>
      </div>
      <Table
        bordered
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={false}
      />
      {/*  分页 */}
      <Pagination
        style={{ float: 'right' }}
        pageSize={pageParam.pageSize}
        showSizeChanger
        pageSizeOptions={[5, 10, 15, 20]}
        onChange={(page, pageSize) => {
          setPageParam({
            ...pageParam,
            page: page,
            pageSize: pageSize,
          })
        }}
        total={total}
        showQuickJumper
        showTotal={(total) => `总共${total}个预约可选择`}
      />
    </>
  )
}
