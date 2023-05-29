import { List } from 'antd'
import { NoticeModel } from 'mdoel/AnnouncementModel'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

function Notice() {
  // 公告信息
  const [notices, setNotices] = useState<NoticeModel[]>([])
  // 第一个的id
  const [firstId, setFirstId] = useState()
  useEffect(() => {
    axios
      .get('/notice', {
        params: { page: 1, pageSize: 8, createTime: 'desc', level: 'desc' },
      })
      .then((resp) => {
        const data = resp.data.data
        setNotices(data.records)
        setFirstId(data.records[0].id)
      })
  }, [])
  return (
    <>
      <List
        style={{ backgroundColor: '#fff', width: '700px' }}
        header={<h3>公告信息</h3>}
        footer={<div style={{ color: '#204d74', cursor: 'pointer' }}>更多</div>}
        bordered
        dataSource={notices}
        renderItem={(item: NoticeModel) => (
          <List.Item
            style={
              item.id === firstId ? { color: '#ff9c6a' } : { color: '#337ab7' }
            }>
            <p>{item.title}</p>
            <p>{item.createTime}</p>
          </List.Item>
        )}
      />
    </>
  )
}
export default Notice
