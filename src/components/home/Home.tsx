import HomeHeader from './header/HomeHeader'
import classes from './Home.module.css'
import HomeImage from './image/HomeImage'
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
          <div className={classes.Image}>
            <HomeImage />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
