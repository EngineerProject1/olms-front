import { useState } from 'react'
import classes from './Home.module.css'
import HomeHeader from './header/HomeHeader'
import DeviceImage from './image/DeviceImage'
import LabImage from './image/LabImage'
import Notice from './notice/Notice'
import stars from './stars.module.css'
function Home() {
  // 控制modal打开与否
  const [open, setOpen] = useState<boolean>(false)
  // 显示的公告id
  const [noticeId, setNotceId] = useState<number>(-1)
  return (
    <div>
      <div>
        <div className={stars.stars}></div>
        <div className={stars.stars2}></div>
        <div className={stars.stars3}></div>
      </div>
      <div>
        <div className={classes.Home}>
          <div className={classes.Header}>
            <HomeHeader setOpen={setOpen} setNoticeId={setNotceId} />
          </div>
          <div className={classes.Content}>
            <div className={classes.LabImage}>
              <LabImage />
            </div>
            <div className={classes.NoticeAndDeviceImage}>
              <div className={classes.Notice}>
                <Notice
                  open={open}
                  setOpen={setOpen}
                  noticeId={noticeId}
                  setNoticeId={setNotceId}
                />
              </div>
              <div className={classes.DeviceImage}>
                <DeviceImage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
