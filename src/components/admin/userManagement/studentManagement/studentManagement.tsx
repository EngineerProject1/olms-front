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
  RadioChangeEvent,
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
const { Search, TextArea } = Input
const onSearch = (value: string) => console.log(value)
const StudentManagement: React.FC = () => {
  const { messageApi } = useContext(GlobalContext)
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )

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
  const [hiddenFlag, setHiddenFlag] = useState(true)

  // 学院信息
  const [college, setCollege] = useState<any>([])

  // 专业信息
  const [major, setMajor] = useState<any>([])

  // sid输入框是否弹出学号已经存在的状态
  const [sidStatus, setSidStatus] = useState(false)
  // 从sid的值
  const [sidValue, setSidValue] = useState()

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 专业下拉框可选标志
  const [selectFlag, setSelectFlag] = useState(true)

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
      render: (_: any, record: { key: React.Key }) => (
        <Space>
          <a
            onClick={() => {
              setHiddenFlag(false)
            }}>
            编辑
          </a>
          <Popconfirm title="是否该学生信息？">
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  // 加载分页page参数
  useEffect(() => {
    ;(async () => {
      const res = await axios.get('/student', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      })
      // console.log(res)
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
    })()
  }, [])

  // 是否是管理员
  // const getRoles = async () => {
  //   let res = await axios.get(`/student/role/2021000`)
  //   let role
  //   return 1
  // }

  const getRole = () => {
    return 1
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
      console.log(data)
      setStudents(
        data.records.map(
          (item: {
            studentName: String
            sid: Number
            collegeName: String
            majorName: String
            grade: Number
            classNumber: Number
          }) => {
            return {
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
  }, [params])

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
    const mRes = await axios.get(`/student/major/${id}`)
    console.log(mRes)
    let mData = mRes.data.data

    setMajor(
      mData.map((item: { id: React.Key; majorName: String }) => {
        return {
          key: item.id,
          name: item.majorName,
        }
      })
    )
    setSelectFlag(false)
  }
  // 单条删除
  // const delAnnouncement = async (id: React.Key) => {
  //   await axios.delete(`/auth/notice/${id}`)
  //   // 通过修改params刷新列表
  //   setParams({
  //     ...params,
  //   })
  // }
  // 批量删除
  // const delBatch = async () => {
  //   await axios.delete('/auth/notice', {
  //     data: {
  //       ids: selectedRowKeys,
  //     },
  //   })
  //   setParams({
  //     ...params,
  //   })
  //   setSelectedRowKeys([])
  // }

  // 提交数据
  const onFinish = async (values: any) => {
    console.log(values)
    console.log(sex)
    console.log(isManager)
    await axios.post('/student', {
      ...values,
      username: values.sid,
      realName: values.studentName,
      sex: sex,
      isSetManager: isManager === true ? 1 : 0,
    })
    // 关闭表单
    closeForm()
    // 关闭专业下拉框可选
    setSelectFlag(true)
    messageApi.success('添加学生信息成功！')
  }

  // 校验学号
  const checkSid = async () => {
    let res = await axios.get(`/student/${sidValue}`)
    console.log(res)
    if (res.data.data === null) {
      setSidStatus(false)
    } else setSidStatus(true)
  }

  // 获取输入学号Input框的value
  const getSidValue = (event: any) => {
    let value = event.target.value
    setSidValue(value)
  }
  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  // 关闭表单
  const closeForm = () => {
    setHiddenFlag(true)
  }

  // 性别
  const [sex, setSex] = useState(1)
  const setSexValue = (e: RadioChangeEvent) => {
    setSex(e.target.value)
  }

  // 是否设为管理员按钮
  const [isManager, setIsManager] = useState(false)
  const setManageButton = (checked: boolean) => {
    setIsManager(checked)
  }

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 搜索框 */}
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
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
                setHiddenFlag(false)
                getCollege()
              }}>
              新增学生
            </Button>
          </div>
        </div>
        <Table
          // components={}
          rowSelection={{
            preserveSelectedRowKeys: true,
            type: selectionType,
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
        hidden={hiddenFlag}
        disabled={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          height: 703,
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
            closeForm(), setSelectFlag(true)
          }}
        />

        <Form.Item>新增学生</Form.Item>

        <Form.Item
          name="sid"
          label="学号"
          validateTrigger="onChange"
          extra={
            sidStatus === true ? (
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
            // 获取value
            onChange={getSidValue}
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
          <Radio.Group onChange={setSexValue} value={sex} defaultValue={sex}>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
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
            onChange={() => setMajor([])}
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
            disabled={selectFlag}
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
          <Switch onClick={setManageButton} />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <Button
              disabled={sidStatus}
              onClick={() => setSelectFlag(true)}
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
