import { Pagination, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

interface Attendance {
  key: string
  labName: string
  status: number
  experimentName: string
  bookTime: string
}
export default function Attendance() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pageParam, setPageParam] = useState({
    page: 1,
    pageSize: 5,
  })
  const [list, setList] = useState<Attendance[]>([])
  const [total, setTotal] = useState(1)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios
      .get('/auth/attendanceForPerson', { params: pageParam })
      .then((response) => {
        const data = response.data.data
        const resultList: Attendance[] = data.records
        setList(
          resultList.map((item: any) => {
            const status = ['缺勤', '正常', '迟到', '早退']
            return {
              ...item,
              key: item.id.toString(),
              bookTime: `${item.bookTime} ${item.startTime.slice(
                0,
                -3
              )}~${item.endTime.slice(0, -3)}`,
              status: status[Number.parseInt(item.status)],
            }
          })
        )
        setLoading(false)
        setTotal(data.total)
      })
  }, [pageParam, modalOpen])

  const columns = [
    {
      title: '实验名称',
      dataIndex: 'experimentName',
      width: '25%',
    },
    {
      title: '实验室名称',
      dataIndex: 'labName',
      width: '25%',
    },
    {
      title: '预约时间',
      dataIndex: 'bookTime',
      width: '25%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '25%',
    },
  ]
  return (
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
        pageSizeOptions={[5, 10, 15, 20]}
        onChange={(page, pageSize) => {
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
  )
}
