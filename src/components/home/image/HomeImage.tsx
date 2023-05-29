import { Carousel } from 'antd'
import { LabModel } from 'mdoel/LabModel'
import { useEffect, useRef, useState } from 'react'
import axios from 'tools/axios'
import classes from './HomeImage.module.css'
function HomeImage() {
  const myRef = useRef(null)
  const [lab, setLabs] = useState<LabModel[]>([])
  const [images, setImages] = useState()
  // 数组乱序去前6个
  const suffle = (labs: LabModel[]) => {
    // 乱序
    for (let i = labs.length; i; i--) {
      let j = Math.floor(Math.random() * i)
      ;[labs[i - 1], labs[j]] = [labs[j], labs[i - 1]]
    }
    return labs.slice(0, labs.length < 6 ? labs.length + 1 : 6)
  }
  useEffect(() => {
    axios.get('/allLab').then((resp) => {
      const data = resp.data
      // 过滤掉没有图片的实验室
      const labs = data.data.filter((item: LabModel) => {
        return (
          item.images !== null &&
          item.images !== undefined &&
          item.images !== ''
        )
      })
      setLabs(suffle(labs))
      setImages(
        labs.map((item: LabModel) => {
          return (
            <div>
              <div
                className={classes.BtnLeft}
                onClick={() => {
                  myRef?.current?.prev?.()
                }}>
                &lt;
              </div>
              <div
                className={classes.BtnRight}
                onClick={() => {
                  myRef?.current?.next?.()
                }}>
                &gt;
              </div>
              <div>
                <img
                  src={`/api/img/download?name=${item.images}`}
                  className={classes.Image}></img>
                <h3 className={classes.Name}>{item.name}</h3>
                <p className={classes.Name}>{item.description}</p>
              </div>
            </div>
          )
        })
      )
    })
  }, [])
  return (
    <Carousel
      ref={myRef}
      dots={false}
      effect="fade"
      autoplay
      className={classes.Carousel}>
      {images}
    </Carousel>
  )
}
export default HomeImage
