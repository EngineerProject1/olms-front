import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Button,
  Input,
  Popconfirm,
  Table,
  Space,
  Pagination,
  ConfigProvider,
} from 'antd'
import axios from 'tools/axios'

interface DataType {
  key: React.Key
  title: String
  name: String
  level: Number
  createTime: String
}
// 搜索框
const { Search } = Input
const onSearch = (value: string) => console.log(value)
const Announcement: React.FC = () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  const [loading, setLoading] = useState(true)
  // 公告信息列表
  const [list, setList] = useState<any>([])
  // 公告分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 5,
    total: 50,
    pages: 1,
  })
  //加载分页page参数
  useEffect(() => {
    const loadPage = async () => {
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
  // 拉取公告列表信息
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

  const defaultColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: '发布人',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '排序等级',
      dataIndex: 'level',
      width: '20%',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: () => (
        <Space>
          <a>编辑</a>
          <Popconfirm title="确认删除该公告信息？">
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const data: DataType[] = list

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
  }

  return (
    <div>
      {/* 搜索框 */}
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      {/* 新增公告 */}
      <Button
        type="primary"
        style={{ marginBottom: 16, float: 'right', marginRight: 150 }}>
        +新增公告
      </Button>
      <Table
        // components={}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        bordered
        dataSource={list}
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
        showTotal={(total) => `总共${params.total}条数据`}
      />
    </div>
  )
}

export default Announcement
