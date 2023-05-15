import React, { useContext, useEffect, useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
} from 'antd'
import { GlobalContext } from 'app'
import axios from 'tools/axios'
interface DataType {
  id: React.Key
  // sid
  key: React.Key
  name: String
  college: String
  major: String
  grade: Number
  class: Number
  role: Number
}
// 搜索框
const { Search } = Input
const onSearch = (value: string) => console.log(value)
const StudentManagement: React.FC = () => {
  const { messageApi } = useContext(GlobalContext)

  // 表单
  const [form] = Form.useForm()

  // 加载动态显示
  const [loading, setLoading] = useState(false)

  // 学生信息列表
  const [students, setStudents] = useState<any>([])

  // 学生分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 5,
    total: 50,
    pages: 1,
  })

  // 隐藏表单标志
  const [isHiddenForm, setIsHiddenForm] = useState(true)

  // 学院信息
  const [college, setCollege] = useState<any>([])

  // 专业信息
  const [major, setMajor] = useState<any>([])

  // sid输入框是否弹出学号已经存在的状态
  const [isRepeatSid, setIsRepeatSid] = useState(false)

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 专业下拉框可选标志
  const [isShowMajor, setIsShowMajor] = useState(false)

  // 编辑时是否改变学院标志
  const [isChangeCollege, setIsChangeCollege] = useState(false)

  // 回填信息时封装学院专业id
  const [collegeAndMajorId, setCollegeAndMajorId] = useState({
    collegeId: 0,
    majorId: 0,
  })

  // 编辑时存储数据项的id值
  const [editId, setEditId] = useState(0)

  // 表格列名
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '学号',
      dataIndex: 'key',
      width: '15%',
    },
    {
      title: '学院',
      dataIndex: 'college',
      width: '15%',
    },
    {
      title: '专业',
      dataIndex: 'major',
      width: '15%',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      width: '15%',
    },
    {
      title: '班级',
      dataIndex: 'class',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a
            onClick={() => {
              loadFormValue(record.key)
              setIsHiddenForm(false)
              getCollege()
              setEditId(record.id)
              setResetPwd({
                ...resetPwd,
                isDisabled: false,
              })
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该学生信息？"
            onConfirm={() => delStudent(record.id, record.key)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  const loadFormValue = async (sid: React.Key) => {
    setLoading(true)
    let res = await axios.get(`/student/${sid}`)
    const data = res.data.data
    console.log(data)
    let value = {
      sid: data.username,
      studentName: data.realName,
      sex: data.sex === '男' ? 1 : 0,
      classNumber: data.classNumber,
      grade: data.grade,
      collegeId: data.collegeName,
      majorId: data.majorName,
      phone: data.phone,
      email: data.email,
      isManager: data.isSetManager === 1 ? true : false,
    }
    // 是否开启管理员开关
    setEditorManager(value.isManager)
    form.setFieldsValue(value)
    // 存入学院专业id
    setCollegeAndMajorId({
      collegeId: data.collegeId,
      majorId: data.majorId,
    })
    setLoading(false)
    console.log(collegeAndMajorId)
    console.log(form.getFieldValue('isManager'))
  }

  // 拉取学生列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get('/student', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      })
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
      setStudents(
        data.records.map(
          (item: {
            id: Number
            studentName: String
            sid: Number
            collegeName: String
            majorName: String
            grade: Number
            classNumber: Number
          }) => {
            return {
              id: item.id,
              key: item.sid,
              name: item.studentName,
              college: item.collegeName,
              major: item.majorName,
              grade: item.grade,
              class: item.classNumber,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params.page, params.pageSize, params.total])

  // 获取学院信息
  const getCollege = async () => {
    let cRes = await axios.get('/student/college')
    let cData = cRes.data.data
    setCollege(
      cData.map((item: { id: React.Key; collegeName: String }) => {
        return {
          key: item.id,
          name: item.collegeName,
        }
      })
    )
  }

  // 获取专业信息
  const getMajor = async (id: Number) => {
    // 每次选择完学院后，清空专业
    form.setFieldValue('majorId', '')
    const mRes = await axios.get(`/student/major/${id}`)
    let mData = mRes.data.data

    setMajor(
      mData.map((item: { id: React.Key; majorName: String }) => {
        return {
          key: item.id,
          name: item.majorName,
        }
      })
    )
    setIsShowMajor(true)
  }

  // 单条删除
  const delStudent = async (userId: any, sid: any) => {
    await axios.delete('/student', {
      data: {
        id: userId,
        sid: sid,
      },
    })
    messageApi.success('删除学生信息成功！')
    setParams({
      ...params,
    })
  }
  // 批量删除
  const delBatch = async () => {
    // await axios.delete('/students', {
    //   data: {
    //     ids: selectedRowKeys.map((item: any) => {
    //       return {
    //         id: item.id,
    //         sid: item.key,
    //       }
    //     }),
    //   },
    // })
    // setParams({
    //   ...params,
    // })
    setSelectedRowKeys([])
  }

  // 提交数据
  const onFinish = async (values: any) => {
    let isManager = form.getFieldValue('isManager')
    let sex = form.getFieldValue('sex')
    let res = await axios.get(`/student/${values.sid}`)
    let flag = res.data.data
    let data = {
      ...values,
      username: values.sid,
      realName: values.studentName,
      sex: (sex === undefined || sex === 1 ? 1 : 0) === 1 ? '男' : '女',
      isSetManager:
        (isManager === undefined || isManager === false ? false : true) === true
          ? 1
          : 0,
      isResetPwd: resetPwd.isReset === true ? 1 : 0,
    }
    console.log(data)
    // 增添学生信息
    if (flag === null) {
      await axios.post('/student', data)
      messageApi.success('添加学生信息成功！')
    }
    // 修改学生信息
    else {
      // 如果没有修改学院专业信息，则将学院专业对应id赋值
      if (isChangeCollege === false) {
        await axios.put('/student', {
          ...data,
          collegeId: collegeAndMajorId.collegeId,
          majorId: collegeAndMajorId.majorId,
          id: editId,
        })
      } else {
        await axios.put('/student', {
          ...data,
          id: editId,
        })
      }
      messageApi.success('修改学生信息成功！')
    }

    // 关闭表单
    closeForm()
  }

  // 校验学号
  const checkSid = async () => {
    let sid = form.getFieldValue('sid')
    let res = await axios.get(`/student/${sid}`)
    if (res.data.data === null) {
      setIsRepeatSid(false)
    } else setIsRepeatSid(true)
  }

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRows)
      console.log(selectedRows)
    },
  }

  // 关闭表单
  const closeForm = () => {
    form.resetFields()
    resetForm()
    setIsHiddenForm(true)
  }

  // 重置表单
  const resetForm = () => {
    // 隐藏表单
    setIsHiddenForm(true)
    // 重置学号重复弹出框
    setIsRepeatSid(false)
    // 重置专业下拉框可选
    setIsShowMajor(false)
    // 重置管理员选项
    setEditorManager(false)
    // 重置userId
    setEditId(0)
    // 重置 重置密码选项
    setResetPwd({
      isDisabled: true,
      isReset: false,
    })
  }

  // 编辑中的管理员
  const [editorManager, setEditorManager] = useState(false)

  // 编辑中重置密码
  const [resetPwd, setResetPwd] = useState({
    isDisabled: true,
    isReset: false,
  })

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 搜索框 */}
          <Search
            placeholder="姓名"
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
              title="是否删除所选学生信息？"
              // onConfirm={delBatch}
              disabled={selectedRowKeys.length === 0}>
              <Button danger disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
            {/* 新增学生 */}
            <Button
              type="primary"
              onClick={() => {
                setIsHiddenForm(false)
                getCollege()
                setResetPwd({
                  ...resetPwd,
                  isReset: true,
                })
              }}>
              新增学生
            </Button>
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
          dataSource={students}
          columns={defaultColumns}
          pagination={false}
          loading={loading}
        />
        {/*  分页 */}

        <Pagination
          style={{ float: 'right' }}
          pageSize={params.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
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
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        hidden={isHiddenForm}
        form={form}
        disabled={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          height: 725,
          width: 400,
          position: 'absolute',
          background: 'white',
          top: '-7%',
          left: '37%',
          boxShadow: '1px 2px 9px #808080',
          margin: '4em',
          padding: '1em',
        }}>
        <CloseOutlined
          style={{ float: 'right', marginTop: 5 }}
          onClick={() => {
            closeForm()
          }}
        />

        <Form.Item>新增学生</Form.Item>

        <Form.Item
          name="sid"
          label="学号"
          validateTrigger="onChange"
          extra={
            isRepeatSid === true ? (
              <Alert
                style={{}}
                message="该学号已存在！"
                type="error"
                showIcon
              />
            ) : (
              ''
            )
          }
          rules={[
            {
              required: true,
              pattern: /^\d{7}$/,
              message: '学号为7位数字',
            },
          ]}>
          <Input
            placeholder="请输入学号"
            // 当失去焦点校验学号是否重复
            onBlur={checkSid}
          />
        </Form.Item>

        <Form.Item
          name="studentName"
          label="姓名"
          rules={[
            {
              required: true,
              pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
              message: '姓名长度不得超过20个字符',
            },
          ]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item name="sex" label="性别">
          {/* <Radio.Group onChange={setSexValue} value={sex} defaultValue={sex}> */}
          <Radio.Group defaultValue={1}>
            <Radio value={1}>男</Radio>
            <Radio value={0}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="classNumber"
          label="班级"
          rules={[
            {
              required: true,
              pattern: /^\d{1}$/,
              message: '请输入班级对应数字',
            },
          ]}>
          <Input placeholder="请输入班级对应数字" />
        </Form.Item>

        <Form.Item
          name="grade"
          label="年级"
          rules={[
            {
              required: true,
              pattern: /^\d{4}$/,
              message: '请输入年级对应数字',
            },
          ]}>
          <Input placeholder="请输入年级对应数字" />
        </Form.Item>

        <Form.Item
          name="collegeId"
          label="学院"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            onChange={() => {
              setMajor([])
              setIsChangeCollege(true)
            }}
            onSelect={getMajor}
            showSearch
            style={{ width: 217 }}
            placeholder="点击搜索学院关键字"
            optionFilterProp="children"
            filterOption={(input, option) =>
              ((option?.label ?? '') as any).includes(input)
            }
            options={college.map((item: { key: React.Key; name: String }) => {
              return {
                value: item.key,
                label: item.name,
              }
            })}
          />
        </Form.Item>
        <Form.Item
          name="majorId"
          label="专业"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            disabled={!isShowMajor}
            // defaultValue
            showSearch
            style={{ width: 217 }}
            placeholder="点击搜索专业关键字"
            optionFilterProp="children"
            filterOption={(input, option) =>
              ((option?.label ?? '') as any).includes(input)
            }
            options={major.map((item: { key: React.Key; name: String }) => {
              return {
                value: item.key,
                label: item.name,
              }
            })}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[
            {
              pattern: /^\d{11}$/,
              message: '请输入正确的电话号码格式',
            },
          ]}>
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              pattern:
                /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
              message: '请输入正确的邮箱格式',
            },
          ]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="isManager" label="管理员">
          <Switch
            // disabled={true}
            checked={editorManager}
            onChange={() => setEditorManager(!editorManager)}
          />
        </Form.Item>
        <Form.Item name="isResetPwd" label="重置密码">
          <Switch
            disabled={resetPwd.isDisabled}
            checked={resetPwd.isReset}
            onChange={() =>
              setResetPwd({
                ...resetPwd,
                isReset: !resetPwd.isReset,
              })
            }
          />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <Button
              disabled={isRepeatSid}
              onClick={() => setIsShowMajor(false)}
              htmlType="submit"
              type="primary"
              style={{ marginLeft: 310, marginBottom: 10 }}>
              提交
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  )
}

export default StudentManagement
