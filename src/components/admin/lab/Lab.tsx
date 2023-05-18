import { Image, Pagination, Popconfirm, Space } from 'antd'
import Search from 'antd/es/input/Search'
import Table from 'antd/es/table'
import Button from 'antd/lib/button'
import { LabDateType, LabModel, LabPageParams } from 'mdoel/LabModel'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'
const columns = [
  {
    title: '实验室名称',
    dataIndex: 'name',
    width: '12.5%',
  },
  {
    title: '图片',
    dataIndex: 'images',
    width: '12.5%',
    render: (images: any) => (
      <Image width={60} src={`/api/img/download?name=${images}`}></Image>
    ),
  },
  {
    title: '负责人',
    dataIndex: 'master',
    width: '12.5%',
  },
  {
    title: '地址',
    dataIndex: 'location',
    width: '12.5%',
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: '12.5%',
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    width: '12.5%',
    sorter: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: '12.5%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '12.5%',
    render: (_: any, record: { key: React.Key }) => (
      <Space>
        <a
          onClick={() => {
            console.log(1)
          }}>
          编辑
        </a>
        <Popconfirm
          title="是否删除该公告信息？"
          onConfirm={() => {
            console.log(2)
          }}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      </Space>
    ),
  },
]
function Lab() {
  // 查询的条件
  const [params, setParams] = useState<LabPageParams>({
    page: 1,
    pageSize: 10,
    total: 1,
    name: '',
    capacity: '',
  })

  // 设置排序条件
  const onChange = ({
    pagination,
    filter,
    sorter,
  }: {
    pagination: any
    filter: any
    sorter: any
  }) => {
    const field = sorter.field
    const order = sorter.order ? sorter.order.replace('end', '') : ''
    setParams({ ...params, capacity: order })
  }

  // 实验室数据
  const [data, setData] = useState<LabDateType[]>()

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 页面加载
  const [loading, setLoading] = useState(true)

  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: LabDateType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  useEffect(() => {
    // 获取lab数据
    axios.get('/lab', { params }).then((resp) => {
      const data = resp.data.data
      setParams({
        ...params,
        total: data.total,
        page: data.current,
        pageSize: data.size,
      })

      // 设置实验室数据
      setData(
        data.records.map((item: LabModel) => {
          return {
            key: item.id,
            name: item.name,
            master: item.masterName,
            location: item.location,
            description: item.description,
            capacity: item.capacity,
            type: item.type,
          }
        })
      )

      setLoading(false)
    })
  }, [params.capacity, params.name, params.page, params.pageSize, params.total])

  return (
    <>
      {/* 搜索框 */}
      <div>
        <Search
          placeholder="实验室名字"
          onSearch={(e) => {
            setParams({ ...params, name: e })
          }}
          style={{ width: 200 }}
          size="large"
        />
        {/* 新增实验室 */}
        <Button
          onClick={() => console.log('新增设备')}
          type="primary"
          style={{ marginBottom: 16, marginRight: 105, float: 'right' }}>
          + 新增实验室
        </Button>
      </div>
      {/* 表格 */}
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        onChange={(pagination, filter, sorter) => {
          onChange({ pagination, filter, sorter })
        }}
        bordered
        loading={loading}
        pagination={false}
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
    </>
  )
}
export default Lab
