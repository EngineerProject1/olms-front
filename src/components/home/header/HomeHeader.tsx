import { Button } from 'antd'
import classes from './HomeHeader.module.css'
function HomeHeader() {
  return (
    <>
      <div className={classes.LeftHeader}>
        <span
          className={classes.Item}
          onClick={() => {
            location.href = '/'
          }}>
          首页
        </span>
        <span
          className={classes.Item}
          onClick={() => {
            location.href = '/login'
          }}>
          公告
        </span>
        <span
          className={classes.Item}
          onClick={() => {
            location.href = '/login'
          }}>
          实验室预约
        </span>
      </div>
      <div className={classes.LeftHeader}>
        <Button
          type="text"
          className={classes.Login}
          onClick={() => {
            location.href = '/login'
          }}>
          登录
        </Button>
      </div>
    </>
  )
}
export default HomeHeader
