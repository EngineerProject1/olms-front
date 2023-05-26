import HomeHeader from './header/HomeHeader'
import classes from './Home.module.css'
import HomeImage from './image/HomeImage'
function Home() {
  return (
    <div className={classes.Home}>
      <div className={classes.Header}>
        <HomeHeader />
      </div>
      <div className={classes.Image}>
        <HomeImage />
      </div>
    </div>
  )
}
export default Home
