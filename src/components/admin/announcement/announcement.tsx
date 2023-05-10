import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Popconfirm, Table, Space, Pagination } from 'antd'
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
    total: 0,
    pages: 1,
  })

  //加载分页page参数
  useEffect(() => {
    ;(async () => {
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
    })()
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
  const editAnnouncement = (id: React.Key) => {
    navigate(`/announcement/edit/${id}`)
  }
  // 单条删除
  const delAnnouncement = async (id: React.Key) => {
    await axios.delete(`/auth/notice/${id}`)
    // 通过修改params刷新列表
    setParams({
      ...params,
      total: params.total - 1,
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
      total: params.total - selectedRowKeys.length,
    })
    setSelectedRowKeys([])
  }

  // 编辑
  const navigate = useNavigate()
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
          <a
            onClick={() => {
              editAnnouncement(record.key)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该公告信息？"
            onConfirm={() => {
              delAnnouncement(record.key)
            }}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

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
              title="是否删除所选公告信息？"
              onConfirm={delBatch}
              disabled={selectedRowKeys.length === 0}>
              <Button danger disabled={selectedRowKeys.length === 0}>
                删除选中
              </Button>
            </Popconfirm>
            {/* 新增公告 */}
            <Button
              type="primary"
              onClick={() => {
                navigate('/announcement/edit/0')
              }}>
              新增公告
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
