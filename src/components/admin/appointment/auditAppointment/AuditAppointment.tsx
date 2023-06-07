import { Pagination, Popconfirm, Table } from 'antd'
import { GlobalContext } from 'app'
import {
  AppointRecords,
  AppointRecordsSelectParams,
  ClassAppoint,
} from 'mdoel/AppointRecordModel'
import { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'

function AuditAppoint() {
  const status = ['待审核', '通过', '拒绝']
  // 查询参数
  const [params, setParams] = useState<AppointRecordsSelectParams>({
    page: 1,
    pageSize: 10,
    type: 1,
    labId: -1,
    only: 1,
  })
  const [flag, setFlag] = useState(true)
  const { messageApi } = useContext(GlobalContext)
  const [total, setTotal] = useState(1)
  // 页面加载
  const [loading, setLoading] = useState(true)
  // 未审核预约记录
  const [appointClass, setAppointClass] = useState<ClassAppoint[]>([])
  const audit = (id: number, status: string) => {
    axios
      .put('/auth/auditAppointment', null, { params: { id, status } })
      .then((response) => {
        messageApi.success('成功审核预约')
        //刷新页面
        setFlag(!flag)
      })
  }
  useEffect(() => {
    axios.get('/auth/appointment', { params }).then((resp) => {
      const data = resp.data.data
      setTotal(data.total)
      setAppointClass(
        data.records.map((item: AppointRecords) => {
          return {
            key: item.id,
            username: item.username,
            appointUsername: item.appointUsername,
            role: item.role,
            labName: item.labName,
            experimentName: item.experimentName,
            purpose: item.purpose,
            bookTime:
              item.bookTime + ' ' + item.startTime + ' ~ ' + item.endTime,
            status: status[Number(item.status)],
            grade:
              item.majorName +
              (item.grade % 100 < 10
                ? '0' + (item.grade % 100)
                : item.grade % 100) +
              '级' +
              item.classNumber +
              '班',
          }
        })
      )
      setLoading(false)
    })
  }, [params, flag])
  const classColumns = [
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
      title: '审核',
      dataIndex: 'status',
      width: '11.11%',
      render: (_: any, item: any) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '60%',
          }}>
          <Popconfirm
            title="确定接受预约"
            onConfirm={() => {
              audit(item.key, '1')
            }}>
            <a>接受</a>
          </Popconfirm>
          <Popconfirm
            title="确定拒绝预约"
            onConfirm={() => {
              audit(item.key, '2')
            }}>
            <a style={{ color: 'red' }}>拒绝</a>
          </Popconfirm>
        </div>
      ),
    },
  ]
  return (
    <>
      <Table
        columns={classColumns}
        dataSource={appointClass}
        bordered
        loading={loading}
        pagination={false}
      />
      <Pagination
        style={{ float: 'right' }}
        pageSize={params.pageSize}
        showSizeChanger
        disabled={loading}
        pageSizeOptions={[5, 10, 15, 20]}
        onChange={(page: number, pageSize: number) => {
          setLoading(true)
          setParams({
            ...params,
            page: page,
            pageSize: pageSize,
          })
        }}
        total={total}
        showQuickJumper
        showTotal={(total: number) => `总共${total}条数据`}
      />
    </>
  )
}
export default AuditAppoint
