import { Pagination, Space, Switch, Table, Typography } from 'antd'
import Attendance from 'components/student/attendance/attendance'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'
import { AppointmentInfoModal } from './appointmentInfoModal'

interface AttendanceList {
  key: string
  classNumber: number
  labName: string
  experimentName: string
  bookTime: string
  id: number
}
export function AppointmentInfo() {
  const [isForClass, setIsForClass] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [appointmentId, setAppointmentId] = useState(0)
  const [pageParam, setPageParam] = useState({
    page: 1,
    pageSize: 5,
  })
  const [list, setList] = useState<AttendanceList[]>([])
  const [total, setTotal] = useState(1)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (isForClass) {
      setLoading(true)
      axios
        .get('/auth/attendanceForClass', { params: pageParam })
        .then((response) => {
          const data = response.data.data
          const resultList: AttendanceList[] = data.records
          setList(
            resultList.map((item: any) => {
              return {
                ...item,
                key: item.id.toString(),
                bookTime: `${item.bookTime} ${item.startTime.slice(
                  0,
                  -3
                )}~${item.endTime.slice(0, -3)}`,
              }
            })
          )
          setLoading(false)
          setTotal(data.total)
        })
    }
  }, [pageParam, isForClass])

  const columns = [
    {
      title: '实验名称',
      dataIndex: 'experimentName',
      width: '20%',
    },
    {
      title: '实验室名称',
      dataIndex: 'labName',
      width: '20%',
    },
    {
      title: '班级',
      dataIndex: 'classNumber',
      width: '20%',
    },
    {
      title: '预约时间',
      dataIndex: 'bookTime',
      width: '20%',
    },
    {
      title: '操作',
      width: '20%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a
            onClick={() => {
              console.log(record)
              setAppointmentId(record.id)
              setModalOpen(true)
            }}>
            查看
          </a>
        </Space>
      ),
    },
  ]
  return (
    <div>
      <AppointmentInfoModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        appointmentId={appointmentId}
      />
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <Typography>查看班级预约：</Typography>
        <Switch
          defaultChecked
          onChange={(checked) => {
            setIsForClass(checked)
          }}
        />
      </div>
      {isForClass ? (
        <>
          <Table
            bordered
            loading={loading}
            dataSource={list}
            columns={columns}
            pagination={false}
          />
          <Pagination
            style={{ float: 'right' }}
            pageSize={pageParam.pageSize}
            showSizeChanger
            disabled={loading}
            pageSizeOptions={[5, 10, 15, 20]}
            onChange={(page, pageSize) => {
              setLoading(true)
              setPageParam({
                page: page,
                pageSize: pageSize,
              })
            }}
            total={total}
            showQuickJumper
            showTotal={(total) => `总共${total}个考勤记录`}
          />
        </>
      ) : (
        <Attendance />
      )}
    </div>
  )
}
