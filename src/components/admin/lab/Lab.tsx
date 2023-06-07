import { Image, Pagination, Popconfirm, Select, Space } from 'antd'
import Search from 'antd/es/input/Search'
import Table from 'antd/es/table'
import Button from 'antd/lib/button'
import { GlobalContext } from 'app'
import { LabDateType, LabModel, LabPageParams } from 'mdoel/LabModel'
import { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'
import LabForm from './LabForm'

function Lab() {
  const columns = [
    {
      title: '实验室名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '图片',
      dataIndex: 'images',
      width: '11.1%',
      render: (images: any) => (
        <Image width={60} src={`/api/img/download?name=${images}`}></Image>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'master',
      width: '10%',
    },
    {
      title: '地址',
      dataIndex: 'location',
      width: '8%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '10%',
    },
    {
      title: '开放时间',
      dataIndex: 'weekdays',
      width: '16%',
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      width: '6%',
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a
            onClick={() => {
              setEditId(record.id)
              setOpen(true)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否删除该信息？"
            onConfirm={() => {
              delLab(record.key)
            }}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 实验室状态
  const labStatus = ['可用', '暂不可用', '维修中']
  const { messageApi } = useContext(GlobalContext)
  // 查询的条件
  const [params, setParams] = useState<LabPageParams>({
    page: 1,
    pageSize: 10,
    total: 1,
    name: '',
    capacity: '',
    status: '',
  })
  // 实验室数据
  const [data, setData] = useState<LabDateType[]>()

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 页面加载
  const [loading, setLoading] = useState(true)

  // 选择的key
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: LabDateType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  // 设置Modal是否打开
  const [open, setOpen] = useState<boolean>(false)

  // 编辑时存储数据的id
  const [editId, setEditId] = useState(-1)

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
      console.log(data)

      // 设置实验室数据
      setData(
        data.records.map((item: LabModel) => {
          let openTime = ''
          for (const weekday of item.weekdays) {
            switch (weekday) {
              case 2:
                openTime += '周一,'
                break
              case 3:
                openTime += '周二,'
                break
              case 4:
                openTime += '周三,'
                break
              case 5:
                openTime += '周四,'
                break
              case 6:
                openTime += '周五,'
                break
              case 7:
                openTime += '周六,'
                break
              case 1:
                openTime += '周日,'
                break
              default:
                break
            }
          }
          openTime = openTime.substring(0, openTime.length - 1)
          return {
            id: item.id,
            key: item.id,
            images: item.images,
            name: item.name,
            master: item.masterName,
            location: item.location,
            description: item.description,
            capacity: item.capacity,
            type: item.type,
            status: labStatus[item.status],
            weekdays: openTime,
          }
        })
      )

      setLoading(false)
    })
  }, [
    params.capacity,
    params.name,
    params.page,
    params.pageSize,
    params.total,
    params.status,
    open,
  ])

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
    setLoading(true)
    const field = sorter.field
    const order = sorter.order ? sorter.order.replace('end', '') : ''
    setParams({ ...params, capacity: order })
  }
  // 单个删除
  const delLab = (id: React.Key) => {
    axios.delete(`/auth/lab/${id}`).then((resp) => {
      const data = resp.data
      if (data.code === 200) {
        messageApi.success(data.msg)
      } else {
        messageApi.error(data.error)
      }
      setParams({ ...params, total: params.total - 1 })
    })
  }

  // 批量删除
  const delBatch = () => {
    axios
      .delete('/auth/lab', {
        data: {
          ids: selectedRowKeys,
        },
      })
      .then((resp) => {
        const data = resp.data
        if (data.code === 200) {
          messageApi.success(data.msg)
        } else {
          messageApi.error(data.error)
        }
        setParams({
          ...params,
          total: params.total - selectedRowKeys.length,
        })
        setSelectedRowKeys([])
      })
  }

  return (
    <>
      {/* 搜索框 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search
            disabled={loading}
            allowClear={true}
            placeholder="实验室名字"
            onSearch={(e) => {
              setLoading(true)
              setParams({ ...params, name: e })
            }}
            style={{ width: 200 }}
            size="large"
          />
          <Select
            size="large"
            disabled={loading}
            placeholder="实验室状态"
            style={{ width: 130 }}
            allowClear={true}
            onSelect={(e) => {
              setLoading(true)
              setParams({ ...params, status: e })
            }}
            onClear={() => {
              setLoading(true)
              setParams({ ...params, status: '' })
            }}>
            <Select.Option value="0">可用</Select.Option>
            <Select.Option value="1">暂不可用</Select.Option>
            <Select.Option value="2">维修中</Select.Option>
          </Select>
        </Space>
        <div
          style={{
            width: 180,
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: '100px',
          }}>
          {/* 批量删除 */}
          <Popconfirm
            title="是否删除所选信息？"
            onConfirm={delBatch}
            disabled={selectedRowKeys.length === 0}>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              style={{ marginRight: '16px' }}>
              删除选中
            </Button>
          </Popconfirm>
          {/* 新增实验室 */}
          <Button
            onClick={() => {
              setOpen(true)
              setEditId(-1)
            }}
            type="primary"
            style={{ marginBottom: 16, marginRight: 105, float: 'right' }}>
            + 新增实验室
          </Button>
        </div>
      </div>

      <LabForm editId={editId} open={open} setOpen={setOpen} />
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
        disabled={loading}
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
    </>
  )
}
export default Lab
