import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'
import { TeacherEditor } from './teacherEditor'

const TeacherManagement: React.FC = () => {
  const { messageApi } = useContext(GlobalContext)

  // 表单
  const [form] = Form.useForm()

  // 搜索框
  const { Search } = Input

  // 弹出表单标识
  const [modalOpen, setModalOpen] = useState(false)

  // 加载动态显示
  const [loading, setLoading] = useState(false)

  // 学院信息
  const [college, setCollege] = useState<any>([])

  // tid输入框是否弹出职工号已经存在的状态
  const [isRepeatTid, setIsRepeatTid] = useState(false)

  // 编辑时存储数据项的id值
  const [editId, setEditId] = useState(0)

  // 编辑中的管理员
  const [editorManager, setEditorManager] = useState(false)

  // 编辑中重置密码
  const [resetPwd, setResetPwd] = useState({
    isDisabled: true,
    isReset: false,
  })

  // 编辑时是否改变学院标志
  const [isChangeCollege, setIsChangeCollege] = useState(false)

  // 教师信息列表
  const [teachers, setTeachers] = useState<any>()

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

  // 回填信息时封装学院id
  const [collegeId, setCollegeId] = useState(0)

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
              loadFormValue(record.key)
              setEditId(record.id)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该教师信息？"
            onConfirm={() => delTeacher(record.id, record.key)}>
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

  // 关闭表单
  const closeForm = () => {
    form.resetFields()
    // 隐藏表单
    setModalOpen(false)
    // 重置职工号重复弹出框
    setIsRepeatTid(false)
    // 重置管理员选项
    setEditorManager(false)
    // 重置userId
    setEditId(0)
    // 重置 重置密码选项
    setResetPwd({
      isDisabled: true,
      isReset: false,
    })
    // 重置是否改变学院
    setIsChangeCollege(false)
    setModalOpen(false)
  }

  // 获取学院信息
  const getCollege = async () => {
    let res = await axios.get('/student/college')
    let data = res.data.data
    setCollege(
      data.map((item: { id: React.Key; collegeName: String }) => {
        return {
          key: item.id,
          name: item.collegeName,
        }
      })
    )
  }

  const loadFormValue = async (tid: React.Key) => {
    setModalOpen(true)
    setResetPwd({
      ...resetPwd,
      isDisabled: false,
    })
    getCollege()
    setLoading(true)
    let res = await axios.get(`/teacher/${tid}`)
    const data = res.data.data
    console.log(data)
    let value = {
      tid: data.username,
      teacherName: data.realName,
      sex: data.sex === '男' ? 1 : 0,
      collegeId: data.collegeName,
      phone: data.phone,
      email: data.email,
      isManager: data.isSetManager === 1 ? true : false,
    }
    // 是否开启管理员开关
    setEditorManager(value.isManager)
    form.setFieldsValue(value)
    // 存入学院id
    setCollegeId(data.collegeId)
    setLoading(false)
  }

  // 单条删除
  const delTeacher = async (userId: any, tid: any) => {
    await axios.delete('/teacher', {
      data: {
        id: userId,
        tid: tid,
      },
    })
    messageApi.success('删除教师信息成功！')
    setParams({
      ...params,
      total: params.total - 1,
    })
  }

  // 批量删除
  const delBatch = async () => {
    console.log(selectedRowKeys)
    await axios.delete('/teachers', {
      data: {
        ids: selectedRowKeys,
      },
    })
    messageApi.success('批量删除教师信息成功！')
    setParams({
      ...params,
      total: params.total - selectedRowKeys.length,
    })
    setSelectedRowKeys([])
  }

  return (
    <>
      <Modal
        centered
        open={modalOpen}
        footer={null}
        width={430}
        onCancel={() => {
          closeForm()
        }}>
        <TeacherEditor
          form={form}
          setModalOpen={setModalOpen}
          college={college}
          isRepeatTid={isRepeatTid}
          setIsRepeatTid={setIsRepeatTid}
          editId={editId}
          editorManager={editorManager}
          setEditorManager={setEditorManager}
          resetPwd={resetPwd}
          setResetPwd={setResetPwd}
          closeForm={closeForm}
          params={params}
          setParams={setParams}
          collegeId={collegeId}
          isChangeCollege={isChangeCollege}
          setIsChangeCollege={setIsChangeCollege}
        />
      </Modal>
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
              onConfirm={delBatch}
              disabled={selectedRowKeys.length === 0}>
              <Button danger disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
            {/* 新增教师 */}
            <Button
              type="primary"
              onClick={() => {
                setModalOpen(true)
                getCollege()
                setResetPwd({
                  ...resetPwd,
                  isReset: true,
                })
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
    </>
  )
}

export default TeacherManagement
