import { Pagination, Select, Space, Switch, Table } from 'antd'
import {
  AppointRecords,
  AppointRecordsSelectParams,
  ClassAppoint,
  PersonAppoint,
  classColumns,
  personColumns,
} from 'mdoel/AppointRecordModel'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

function AppointRecord() {
  const status = ['待审核', '通过', '拒绝']
  // 查询参数
  const [params, setParams] = useState<AppointRecordsSelectParams>({
    page: 1,
    pageSize: 10,
    type: 0,
    labId: -1,
  })
  const [total, setTotal] = useState(1)
  // 有预约记录的实验室
  const [labs, setLabs] = useState([])
  // 页面加载
  const [loading, setLoading] = useState(true)
  // 个人预约记录
  const [appointPerson, setAppointPerson] = useState<PersonAppoint[]>([])
  // 班级预约记录
  const [appointClass, setAppointClass] = useState<ClassAppoint[]>([])
  useEffect(() => {
    // 获取有预约记录的实验室
    axios.get(`/auth/appointment/lab/${params.type}`).then((resp) => {
      const data = resp.data.data
      setLabs(data)
    })

    axios.get('/auth/appointment', { params }).then((resp) => {
      const data = resp.data.data
      setTotal(data.total)
      // 个人预约记录
      if (params.type === 0) {
        setAppointPerson(
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
            }
          })
        )
      } else {
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
      }
      setLoading(false)
    })
  }, [params.page, params.labId, params.pageSize, total, params.type])
  const switchChange = (checked: boolean) => {
    setLoading(true)
    if (checked) {
      setParams({ ...params, type: 1 })
    } else {
      setParams({ ...params, type: 0 })
    }
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Select
            disabled={loading}
            size="large"
            placeholder="实验室"
            style={{ width: 150 }}
            allowClear={true}
            onSelect={(e) => {
              setLoading(true)
              setParams({ ...params, labId: e })
            }}
            onClear={() => {
              setLoading(true)
              setParams({ ...params, labId: -1 })
            }}
            options={labs.map((item: any) => {
              return {
                value: item.id,
                label: item.name,
              }
            })}
          />
          <Switch
            disabled={loading}
            checkedChildren="班级预约"
            unCheckedChildren="个人预约"
            onClick={switchChange}
          />
        </Space>
      </div>
      {params.type === 0 ? (
        <Table
          columns={personColumns}
          dataSource={appointPerson}
          bordered
          loading={loading}
          pagination={false}
        />
      ) : (
        <Table
          columns={classColumns}
          dataSource={appointClass}
          bordered
          loading={loading}
          pagination={false}
        />
      )}
      {/* 分页 */}
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
export default AppointRecord
