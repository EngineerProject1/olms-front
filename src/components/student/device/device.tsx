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

export function Device() {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  // 表单作用(修改设备信息 | 新增设备)
  const [formName, setFormName] = useState('新增设备')

  //搜索查询
  const onSearch = async (values: any) => {
    if (values.name && values.status) {
      setParams({
        ...params,
        name: values.name,
        status: values.status,
      })
    } else if (!values.name && values.status) {
      setParams({
        ...params,
        name: '',
        status: values.status,
      })
    } else if (values.name && !values.status) {
      setParams({
        ...params,
        name: values.name,
        status: 1,
      })
    }
  }
  //查出所有实验室
  const [labNames, setLabNames] = useState<any>()
  // useEffect(() => {
  //   const getLabNames = async () => {
  //     const res = await axios.get('lab')
  //     console.log(res)
  //     setLabNames(res)
  //   }
  //   getLabNames()
  // }, [labNames])

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
    name: '',
    status: 1,
  })

  const [loading, setLoading] = useState(true)
  // const [name, setName] = useState('')
  // 拉取所有设备列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get(`/device`, {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
          status: params.status,
        },
      })
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
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
  }, [params.pageSize, params.total, params.page, params.name, params.status])

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
      // sorter: {
      //   compare: (a, b) => a.price - b.price,
      //   multiple: 3,
      // },
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

  // 对多选框的操作
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
      setFormName('修改设备信息')
    } else {
      setFormName('新增设备')
    }
  }

  const [form] = Form.useForm()

  // 单条删除
  const handleDelete = async (id: React.Key) => {
    // 当前行索引
    console.log(id)
    const res = await axios.delete(`/auth/device/${id}`)
    messageApi.success(res.data.msg)
    setParams({
      ...params,
      total: params.total - 1,
    })
  }

  // 批量删除
  const delBatch = async () => {
    await axios.delete('/auth/device', {
      data: {
        ids: selectedRowKeys,
      },
    })
    messageApi.success('成功删除')
    setParams({
      ...params,
      total: params.total - selectedRowKeys.length,
    })
    setSelectedRowKeys([])
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
      setParams({
        ...params,
      })
    } else {
      //添加设备信息
      const res = await axios.post('/auth/device', values)
      const message = res.data.msg
      messageApi.success(message)
      setParams({
        ...params,
        total: params.total + 1,
      })
    }
    handleCancel()
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

  const showModal = (id: React.Key) => {
    handleEdit(id)
    setOpen(true)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* 搜索框 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <Search
            placeholder="请输入设备名称"
            onSearch={onSearch}
            style={{ width: 200 }}
          /> */}
          <Form
            style={{ display: 'flex', justifyContent: 'space-between' }}
            onFinish={onSearch}>
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
            <Form.Item name="status" label="状态" style={{ width: 200 }}>
              <Select>
                <Select.Option value="0">可用</Select.Option>
                <Select.Option value="2">已被借用</Select.Option>
                <Select.Option value="3">维修中</Select.Option>
                <Select.Option value="4">损坏</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginLeft: 10 }}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div
          style={{
            width: 180,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          {/* 批量删除 */}
          <Popconfirm
            title="是否删除所选设备信息？"
            onConfirm={delBatch}
            disabled={selectedRowKeys.length === 0}>
            <Button danger disabled={selectedRowKeys.length === 0}>
              删除选中
            </Button>
          </Popconfirm>

          {/* 新增设备 */}
          <Button
            onClick={() => showModal(-1)}
            type="primary"
            style={{ marginBottom: 16, marginRight: 105, float: 'right' }}>
            + 新增设备
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
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
      {/* 分页 */}
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
    </div>
  )
}
