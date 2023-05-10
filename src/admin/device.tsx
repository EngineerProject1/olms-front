import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PlusOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'tools/axios'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Table,
  Image,
  message,
  Pagination,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import type { UploadProps } from 'antd'
import MyUpload from 'components/myUpload'

const { RangePicker } = DatePicker
const { TextArea } = Input

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}
// 搜索框
const { Search } = Input
const onSearch = (value: string) => console.log(value)

export function Device() {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  // 得到后端返回的文件名
  const [fileName, setFileName] = useState('')

  // 设备信息列表
  const [list, setList] = useState<any>([])

  // 设备分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 8,
    total: 50,
    pages: 1,
  })

  //加载分页page参数
  useEffect(() => {
    const loadPage = async () => {
      // 获取设备信息
      const res = await axios.get('/notice', {
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
    }
    loadPage()
  }, [])

  const [loading, setLoading] = useState(true)
  // 拉取所有设备列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get('/notice', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      })
      const data = res.data.data
      console.log(res)
      setList(
        data.records.map(
          (item: {
            id: React.Key
            title: String
            name: String
            level: Number
            createTime: String
          }) => {
            return {
              key: item.id,
              title: item.title,
              name: item.name,
              level: item.level,
              createTime: item.createTime,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params])

  // 数据类型
  interface DataType {
    key: React.Key
    name: string
    images: string
    belongLab: string
    price: number
    model: string
    status: string
  }

  // 列字段
  const columns: ColumnsType<DataType> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'images',
      render: (images) => (
        <Image width={60} src={`/api/img/download?name=${images}`}></Image>
      ),
    },
    {
      title: '所属实验室',
      dataIndex: 'belongLab',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleEdit(record.key)
            }}>
            编辑
          </a>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record.key)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 数据
  const defaultData: DataType[] = [
    {
      key: 1,
      name: '加速器',
      images: '99128c0c-a134-4d6a-ab8a-65469f0810f3.jpeg',
      belongLab: 'D204',
      price: 1231,
      model: 'FBI-114',
      status: '空闲',
    },
    {
      key: 2,
      name: '加速器',
      images: '99128c0c-a134-4d6a-ab8a-65469f0810f3.jpeg',
      belongLab: 'D204',
      price: 1231,
      model: 'FBI-114',
      status: '空闲',
    },
  ]

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  // 选择框
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
    ],
  }

  type SizeType = Parameters<typeof Form>[0]['size']
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  )

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size)
  }

  const [hiddenFlag, setHiddenFlag] = useState(true)

  // 关闭表单
  const closeForm = () => {
    setHiddenFlag(true)
  }

  //新增 或 编辑 设备
  const handleEdit = (id: React.Key) => {
    setHiddenFlag(false)
    if (id === -1) {
    } else {
    }
  }

  // 编辑功能
  // 文案适配  路由参数id 判断条件
  // const id = params.post('id')
  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      // const res = await axios.get(`/mp/articles/${id}`)
      const data = defaultData
      // 表单数据回填
      form.setFieldsValue({ data })
      // 回填upload
      const formatImgList = data.map((item) => item.images)
    }
    const data = defaultData
    // 表单数据回填
    form.setFieldsValue({ data })
    // 回填upload
    const formatImgList = data.map((item) => item.images)
    // 必须是编辑状态 才可以发送请求
    // if (id) {
    //   loadDetail()
    // }
  }, [form])

  // 删除操作
  const handleDelete = (id: React.Key) => {
    // 当前行索引
    console.log(id)
  }

  // 表单提交
  const onFinish = (values: any) => {
    console.log({ ...values, images: fileName })
  }

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const props: UploadProps = {
    name: 'file',
    action: '/api/img/upload',
    method: 'POST',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  return (
    <div style={{ position: 'relative' }}>
      {/* 搜索框 */}
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      <Button
        onClick={() => handleEdit(-1)}
        type="primary"
        style={{ marginBottom: 16, marginRight: 105, float: 'right' }}>
        + 新增设备
      </Button>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={defaultData}
        bordered
        pagination={false}
        loading={loading}
      />
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
        showTotal={(total) => `总共${params.total}条数据`}
      />
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        hidden={hiddenFlag}
        disabled={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          width: 400,
          position: 'absolute',
          background: 'white',
          top: '-25%',
          left: '25%',
          boxShadow: '1px 2px 9px #808080',
          margin: '4em',
          padding: '1em',
        }}>
        <CloseOutlined
          style={{ float: 'right', marginTop: 5 }}
          onClick={closeForm}
        />

        <Form.Item>新增设备</Form.Item>

        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
              message: '名称长度不得超过20个字符',
            },
          ]}>
          <Input placeholder="请输入名称" />
        </Form.Item>

        <Form.Item
          name="images"
          label="图片"
          valuePropName="fileList"
          getValueFromEvent={normFile}>
          <MyUpload setName={setFileName} />
        </Form.Item>

        <Form.Item name="belongLab" label="实验室">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="价格"
          rules={[{ pattern: /^\d+[/.\d*]?$/, message: '请输入正确的数字' }]}>
          <Input placeholder="请输入价格" />
        </Form.Item>

        <Form.Item
          name="model"
          label="型号"
          rules={[
            {
              pattern: /^[\u4e00-\u9fa5\w\s-]{1,30}$/,
              message: '型号长度不得超过30个字符',
            },
          ]}>
          <Input placeholder="请输入型号" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{ marginLeft: 310, marginBottom: 10 }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
