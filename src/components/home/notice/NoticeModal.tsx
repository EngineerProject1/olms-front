import { List, Modal, Pagination } from 'antd'
import { NoticeModel } from 'mdoel/AnnouncementModel'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'
import classes from './NoticeModal.module.css'
function NoticeModal({
  noticeId,
  open,
  setOpen,
}: {
  noticeId: any
  open: boolean
  setOpen: React.Dispatch<boolean>
}) {
  // 公告信息
  const [notice, setNotice] = useState<NoticeModel>()
  // 公告信息
  const [notices, setNotices] = useState<NoticeModel[]>([])
  // 查询的条件
  const [params, setParams] = useState({
    page: 1,
    pageSize: 6,
    total: 1,
    pages: 1,
  })
  // 第一个的id
  const [firstId, setFirstId] = useState()
  useEffect(() => {
    if (noticeId !== -1) {
      getNoticeById(noticeId)
    } else {
      axios.get('/notice', { params }).then((resp) => {
        const data = resp.data.data
        console.log(data)
        setParams({
          ...params,
          total: data.total,
          page: data.current,
          pageSize: data.size,
        })
        setNotices(data.records)
        setFirstId(data.records[0].id)
        setNotice(data.records[0])
      })
    }
  }, [open, params.page, params.pageSize, params.total])
  const getNoticeById = (id: number) => {
    axios.get(`/notice/${id}`).then((resp) => {
      const data = resp.data.data

      setNotice(data)
    })
  }
  return (
    <div className={classes.Border}>
      <Modal
        className={classes.AntModal}
        open={open}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setOpen(false)
        }}
        width={1600}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {noticeId !== -1 ? (
            <div className={classes.AntModalBody}>
              <h1 style={{ textAlign: 'center' }}>{notice?.title}</h1>
              <p style={{ textAlign: 'center' }}>{notice?.updateTime}</p>
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: '1.7',
                  textIndent: '2em',
                }}
                dangerouslySetInnerHTML={{ __html: notice?.content }}
              />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <div
                  style={{
                    float: 'left',
                  }}>
                  {' '}
                  <List
                    style={{
                      backgroundColor: '#fff',
                      width: '300px',
                      float: 'left',
                    }}
                    header={<h3>公告信息</h3>}
                    footer={
                      <div style={{ color: '#204d74', cursor: 'pointer' }}>
                        <Pagination
                          simple
                          total={params.total}
                          pageSize={6}
                          onChange={(page, pageSize) => {
                            setParams({
                              ...params,
                              page: page,
                              pageSize: 6,
                            })
                          }}
                        />
                      </div>
                    }
                    bordered
                    dataSource={notices}
                    renderItem={(item: NoticeModel) => (
                      <List.Item
                        style={
                          item.id === firstId
                            ? { color: '#ff9c6a' }
                            : { color: '#337ab7' }
                        }>
                        <p
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            getNoticeById(item.id)
                          }}>
                          {item.title}
                        </p>
                        <p
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            getNoticeById(item.id)
                          }}>
                          {item.createTime}
                        </p>
                      </List.Item>
                    )}
                  />
                </div>
                <div
                  style={{ marginLeft: '25px', flexGrow: '1' }}
                  className={classes.AntModalBody}>
                  <h1 style={{ textAlign: 'center' }}>{notice?.title}</h1>
                  <p style={{ textAlign: 'center' }}>{notice?.updateTime}</p>
                  <p
                    style={{
                      fontSize: '18px',
                      lineHeight: '1.7',
                      textIndent: '2em',
                    }}
                    dangerouslySetInnerHTML={{ __html: notice?.content }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
export default NoticeModal
