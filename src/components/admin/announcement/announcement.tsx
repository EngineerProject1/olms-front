import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import AddButton from './addButton'
interface DataType {
  key: React.Key
  title: String
  name: String
  level: Number
  createTime: String
}
// 搜索框
const { Search, TextArea } = Input
const onSearch = (value: string) => console.log(value)
const Announcement: React.FC = () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  // 加载动态显示
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

  // 单条删除
  const delAnnouncement = async (id: React.Key) => {
    await axios.delete(`/auth/notice/${id}`)
    // 通过修改params刷新列表
    setParams({
      ...params,
    })
  }
  // 批量删除
  const delBatch = async () => {
    await axios.delete('/auth/notice', {
      data: {
        ids: selectedRowKeys,
      },
    })
    setParams({
      ...params,
    })
    setSelectedRowKeys([])
  }

  // 编辑
  const navigate = useNavigate()
  const goEdit = () => {
    navigate('/edit')
  }
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
      render: (_: any, record: { key: React.Key }) => (
        <Space>
          <a>编辑</a>
          <Popconfirm
            title="是否该公告信息？"
            onConfirm={() => delAnnouncement(record.key)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const data: DataType[] = list

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // )
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <>
      <div>
        {/* 搜索框 */}
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 200 }}
        />
        {/* 新增公告 */}
        <AddButton></AddButton>
        {/* 批量删除 */}
        <Popconfirm
          title="是否删除所选公告信息？"
          onConfirm={delBatch}
          disabled={selectedRowKeys.length === 0}>
          <Button
            danger
            style={{
              // backgroundColor: '#e96b6b',
              marginBottom: 16,
              float: 'right',
              marginRight: 10,
            }}
            disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </Popconfirm>

        <Table
          // components={}
          rowSelection={{
            preserveSelectedRowKeys: true,
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
    </>
  )
}

export default Announcement
