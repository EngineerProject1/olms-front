import HomeHeader from './header/HomeHeader'
import classes from './Home.module.css'
function Home() {
  return (
    <div>
      <div className={classes.Header}>
        <HomeHeader />
      </div>
    </div>
  )
}
export default Home
