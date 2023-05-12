import type { UploadProps } from 'antd'
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Modal,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { GlobalContext } from 'app'
import MyUpload from 'components/myUpload'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'

// 数据类型
interface DataType {
  key: React.Key
  name: string
  images: string
  labName: string
  price: number
  model: string
  status: string
}

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

  // status
  let defaultStatus = ['可用', '未被借用', '已被借用', '维修中', '损坏']

  // 设备信息列表
  const [list, setList] = useState<any>([])

  // 设备分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 5,
    total: 50,
    pages: 1,
  })

  //加载分页page参数
  useEffect(() => {
    const loadPage = async () => {
      // 获取设备信息
      const res = await axios.get('/device', {
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
      const res = await axios.get('/device', {
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
            name: string
            images: string
            labName: string
            price: number
            model: string
            status: number
          }) => {
            return {
              key: item.id,
              name: item.name,
              images: item.images,
              labName: item.labName,
              price: item.price,
              model: item.model,
              status: defaultStatus[item.status],
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params])

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
      dataIndex: 'labName',
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
          <a onClick={() => showModal(record.key)}>编辑</a>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record.key)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
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

  // 成功消息提示
  const { messageApi } = useContext(GlobalContext)

  //新增 或 编辑 设备
  const [fileList, setFileList] = useState<string>()
  const handleEdit = (id: React.Key) => {
    const loadDetail = async () => {
      const res = await axios.get(`/device/${id}`)
      const data = res.data.data
      setFileName(data.images)
      data.images = '/api/img/download?name=' + data.images

      // 表单数据回填
      form.setFieldsValue(data)
      // 回填upload
      setFileList(data.images)
    }
    setId(id)
    form.resetFields()
    if (id !== -1) {
      loadDetail()
    }
  }

  const [form] = Form.useForm()

  // 删除操作
  const handleDelete = (id: React.Key) => {
    // 当前行索引
    console.log(id)
  }

  const [id, setId] = useState<React.Key>()
  // 表单提交
  const onFinish = async (values: any) => {
    values = {
      ...values,
      id,
      images: fileName,
    }
    console.log(values)
    if (id !== -1) {
      //修改设备信息
      const res = await axios.put('/auth/device', values)
      const message = res.data.msg
      messageApi.success(message)
    } else {
      //添加设备信息
      const res = await axios.post('/auth/device', values)
      const message = res.data.msg
      messageApi.success(message)
    }
    setParams({
      page: 1,
      pageSize: 5,
      total: 50,
      pages: 1,
    })
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

  //关于Modal部分
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')

  const showModal = (id: React.Key) => {
    handleEdit(id)
    setOpen(true)
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  return (
    <div>
      {/* 搜索框 */}
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        style={{ width: 200 }}
      />

      {/* 新增设备 */}
      <Button
        onClick={() => showModal(-1)}
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
        dataSource={list}
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

      <Modal
        centered
        open={open}
        footer={null}
        width={430}
        onCancel={() => {
          handleCancel()
        }}>
        <Form
          preserve={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          layout="horizontal"
          disabled={false}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            width: 400,
            background: 'white',
            marginTop: 15,
            padding: '1em',
          }}
          form={form}>
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
            <MyUpload setName={setFileName} fileList={fileList as string} />
          </Form.Item>

          <Form.Item name="labName" label="实验室">
            <Select>
              <Select.Option value="D204">D204</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            className="price"
            name="price"
            label="价格"
            rules={[
              { pattern: /^\d+[/.\d*]?\d$/, message: '请输入正确的数字' },
            ]}>
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
          <br></br>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              onClick={() => {
                handleCancel()
              }}
              style={{ marginLeft: 260, marginBottom: 0 }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
