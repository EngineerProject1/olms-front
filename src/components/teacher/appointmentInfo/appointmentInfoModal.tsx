import { Modal, Pagination, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

interface Appointment {
  username: string
  realname: string
  status: string
  updateTime: string
}

export function AppointmentInfoModal(props: {
  modalOpen: boolean
  setModalOpen: React.Dispatch<boolean>
  appointmentId: number
}) {
  const [list, setList] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pageParam, setPageParam] = useState({
    page: 1,
    pageSize: 5,
  })
  const columns = [
    {
      title: '学号',
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '20%',
    },
    {
      title: '处理时间',
      dataIndex: 'updateTime',
      width: '20%',
    },
  ]

  useEffect(() => {
    if (props.modalOpen == true) {
      setLoading(true)
      axios
        .get('/auth/getAttendanceForTargetAppointment', {
          params: { ...pageParam, appointmentId: props.appointmentId },
        })
        .then((response) => {
          const status = ['缺勤', '正常', '迟到', '早退']
          const data = response.data.data
          const resultList: Appointment[] = data.records
          setList(
            resultList.map((item: Appointment) => ({
              ...item,
              key: item.username,
              status: status[Number.parseInt(item.status)],
            }))
          )
          setLoading(false)
          setTotal(data.total)
        })
    }
  }, [pageParam, props.modalOpen])

  return (
    <Modal
      centered
      open={props.modalOpen}
      title="查看班级考勤"
      width={800}
      footer={null}
      onCancel={() => {
        props.setModalOpen(false)
      }}>
      <Table
        bordered
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={false}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          style={{ display: 'inline-block' }}
          pageSize={pageParam.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
          onChange={(page, pageSize) => {
            setPageParam({
              page: page,
              pageSize: pageSize,
            })
          }}
          total={total}
          showQuickJumper
          showTotal={(total) => `总共${total}个预约可选择`}
        />
      </div>
    </Modal>
  )
}
