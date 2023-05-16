import { Button, Input, Popconfirm, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

const TeacherManagement: React.FC = () => {
  // 搜索框
  const { Search } = Input

  // 加载动态显示
  const [loading, setLoading] = useState(false)

  // 教师信息列表
  const [teachers, setTeachers] = useState<any>([
    {
      name: '张三',
      key: 2022222,
      college: '软件工程',
    },
  ])

  // 学生分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 50,
    pages: 1,
    name: '',
    loader: true,
  })

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 通过姓名进行搜索
  const onSearch = (value: string) => {
    setParams({
      ...params,
      name: value,
    })
  }

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log(selectedRowKeys)
    },
  }

  // 表格列名
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '职工号',
      dataIndex: 'key',
      width: '25%',
    },
    {
      title: '学院',
      dataIndex: 'college',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a
            onClick={() => {
              // loadFormValue(record.key)
              // setEditId(record.id)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该学生信息？"
            // onConfirm={() => delStudent(record.id, record.key)}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 拉取教师列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get('/teacher', {
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
      setTeachers(
        data.records.map(
          (item: {
            id: Number
            teacherName: String
            tid: Number
            collegeName: String
          }) => {
            return {
              id: item.id,
              key: item.tid,
              name: item.teacherName,
              college: item.collegeName,
            }
          }
        )
      )
      setLoading(false)
    }
    console.log('刷新页面')
    loadList()
  }, [params.page, params.pageSize, params.total, params.loader, params.name])

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 搜索框 */}
          <Search
            placeholder="输入姓名搜索"
            onSearch={onSearch}
            style={{ width: 200 }}
            size="large"
          />
          <div
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            {/* 批量删除 */}
            <Popconfirm
              title="是否删除所选教师信息？"
              // onConfirm={delBatch}
              // disabled={selectedRowKeys.length === 0}
            >
              <Button
                danger
                // disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
            {/* 新增教师 */}
            <Button
              type="primary"
              onClick={() => {
                // setModalOpen(true)
                // getCollege()
                // setResetPwd({
                //   ...resetPwd,
                //   isReset: true,
                // })
              }}>
              新增教师
            </Button>
          </div>
        </div>
      </div>
      <Table
        // components={}
        rowSelection={{
          preserveSelectedRowKeys: true,
          type: 'checkbox',
          ...rowSelection,
        }}
        bordered
        dataSource={teachers}
        columns={defaultColumns}
        pagination={false}
        loading={loading}
      />
    </>
  )
}

export default TeacherManagement
