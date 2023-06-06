import { Button, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import classes from './HomeHeader.module.css'
function HomeHeader({
  setOpen,
  setNoticeId,
}: {
  setOpen: React.Dispatch<boolean>
  setNoticeId: React.Dispatch<number>
}) {
  return (
    <>
      <Header className={classes.Header}>
        <div className={classes.Header}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 28 }}>
              <img
                src="/logo.svg"
                style={{ width: 35, height: 35, marginRight: 8 }}
              />
            </div>
            <div>
              <Menu
                className={classes.Item}
                theme="dark"
                mode="horizontal"
                selectable={false}
                items={[
                  {
                    key: 'index',
                    label: '首页',
                    onClick: () => {
                      location.href = '/'
                    },
                  },
                  {
                    key: 'appointment',
                    label: '实验室预约',
                    onClick: () => {
                      location.href = '/login'
                    },
                  },
                  {
                    key: 'notice',
                    label: '公告',
                    onClick: () => {
                      setNoticeId(-1)
                      setOpen(true)
                    },
                  },
                ]}
              />
            </div>
          </div>
          <div className={classes.Login}>
            <Button
              type="text"
              className={classes.Login}
              onClick={() => {
                location.href = '/login'
              }}>
              登录
            </Button>
          </div>
        </div>
      </Header>
    </>
  )
}
export default HomeHeader
