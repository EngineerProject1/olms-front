import type { UploadProps } from 'antd'
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { GlobalContext } from 'app'
import { nanoid } from 'nanoid'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'

// 数据类型
interface DataType {
  key: React.Key
  name: string
  images: string
  price: number
  model: string
  count: number
}

export function DeviceReturn() {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  // 表单作用(修改设备信息 | 新增设备)
  const [formName, setFormName] = useState('新增设备')

  //搜索查询
  const onSearch = async (values: any) => {
    if (values.name) {
      setParams({
        ...params,
        name: values.name,
      })
    } else {
      setParams({
        ...params,
        name: '',
      })
    }
  }
  //归还设备
  const handleReturn = async (records: any) => {
    console.log(records)
    const res = await axios.put('/auth/deviceReturn', records)
    setParams({
      ...params,
      total: params.total - 1,
    })
  }

  //一键归还所有设备
  const returnALL = async () => {
    console.log(list)
    const res = await axios.put('/auth/deviceReturnAll', list)
    messageApi.success(res.data.msg)
    setParams({
      ...params,
      total: 0,
    })
  }

  // 得到后端返回的文件名
  const [fileName, setFileName] = useState('')

  // status

  // 设备信息列表
  const [list, setList] = useState<any>([])

  // 设备分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    total: 50,
    pages: 1,
    name: '',
  })

  const [loading, setLoading] = useState(true)
  // const [name, setName] = useState('')
  // 拉取所有设备列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get(`/auth/deviceLend`, {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
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
            name: string
            images: string
            price: number
            model: string
            count: number
          }) => {
            return {
              key: nanoid(),
              name: item.name,
              images: item.images,
              price: item.price,
              model: item.model,
              count: item.count,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params.pageSize, params.total, params.page, params.name])

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
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },

    {
      title: '借用数量',
      dataIndex: 'count',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="确定归还?" onConfirm={() => handleReturn(record)}>
            <a style={{ color: '#4169e1' }}>归还</a>
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

  const handleCancel = () => {
    console.log('Clicked cancel button')
  }
  return (
    <div>
      {/* 搜索框 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form
          style={{ display: 'flex', justifyContent: 'space-between' }}
          onFinish={onSearch}>
          <Form.Item
            name="name"
            label="设备名称"
            rules={[
              {
                pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
                message: '名称长度不得超过20个字符',
              },
            ]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ marginLeft: 10 }}>
              查询
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Button htmlType="submit" type="primary" onClick={returnALL}>
            一键归还
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
