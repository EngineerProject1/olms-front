import type { UploadProps } from 'antd'
import {
  Form,
  Image,
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
import MySearch from './mySearch'

// 数据类型
interface DataType {
  key: React.Key
  name: string
  images: string
  // count: number
  price: number
  model: string
}

export function DeviceBorrow() {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )

  //借用设备
  const handleBorrow = async (values: any) => {
    console.log(values)

    const res = await axios.put(`/auth/deviceLend`, {
      ...values,
      id: values.key,
    })
    const { data } = res
    if (data.msg === '借用成功') {
      message.success(data.msg)
      setParams({
        ...params,
        total: params.total - 1,
      })
    } else {
      message.error('借用失败，当前可能未在实验进行时间段内')
    }
  }

  //查出所有实验室

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
    id: 3,
    name: '',
  })
  const [loading, setLoading] = useState(true)
  // const [name, setName] = useState('')
  // 拉取所有设备列表信息
  useEffect(() => {
    const loadList = async () => {
      const res = await axios.get(`/auth/deviceByLab`, {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
          labId: params.id,
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
            id: number
            labId: number
          }) => {
            return {
              key: item.id,
              name: item.name,
              images: item.images,
              price: item.price,
              model: item.model,
              // count: item.count,
              labId: item.labId,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params.pageSize, params.total, params.page, params.name, params.id])

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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="确定借用?" onConfirm={() => handleBorrow(record)}>
            <a style={{ color: '#4169e1' }}>借用</a>
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

  return (
    <div>
      {/* 搜索框 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <MySearch setList={setList} setParams={setParams}></MySearch>
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
        disabled={loading}
        style={{ float: 'right' }}
        pageSize={params.pageSize}
        showSizeChanger
        pageSizeOptions={[5, 10, 15, 20]}
        onChange={(page, pageSize) => {
          setLoading(true)
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
