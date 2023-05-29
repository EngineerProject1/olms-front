import classes from './Home.module.css'
import HomeHeader from './header/HomeHeader'
import DeviceImage from './image/DeviceImage'
import LabImage from './image/LabImage'
import Notice from './notice/Notice'
import stars from './stars.module.css'
function Home() {
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
            <HomeHeader />
          </div>
          <div className={classes.LabImage}>
            <LabImage />
          </div>
          <div style={{ display: 'flex' }}>
            <div>
              <Notice />
            </div>
            <div
              style={{ marginLeft: '600px', alignItems: 'center' }}
              className={classes.DeviceImage}>
              <DeviceImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
