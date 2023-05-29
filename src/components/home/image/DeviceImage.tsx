import { Carousel } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'
import classes from './Image.module.css'

function DeviceImage() {
  const [device, setDevice] = useState([])
  const [images, setImages] = useState()
  // 数组乱序去前6个
  const suffle = (devices: any) => {
    // 乱序
    for (let i = devices.length; i; i--) {
      let j = Math.floor(Math.random() * i)
      ;[devices[i - 1], devices[j]] = [devices[j], devices[i - 1]]
    }
    return devices.slice(0, devices.length < 6 ? devices.length + 1 : 6)
  }
  useEffect(() => {
    axios.get('/device/all').then((resp) => {
      const data = resp.data
      // 过滤掉没有图片的设备
      const devices = data.data.filter((item: any) => {
        return (
          item.images !== null &&
          item.images !== undefined &&
          item.images !== '' &&
          item.labName !== null &&
          item.labName !== undefined &&
          item.labName !== ''
        )
      })
      setDevice(suffle(devices))
      setImages(
        devices.map((item: any) => {
          return (
            <div key={item.id}>
              <img
                src={`/api/img/download?name=${item.images}`}
                className={classes.DeviceImage}></img>
              <h3 className={classes.Name}>{item.name}</h3>
              <p className={classes.Name}>所属实验室:{item.labName}</p>
              <p className={classes.Name}>设备型号:{item.model}</p>
            </div>
          )
        })
      )
    })
  }, [])
  return (
    <Carousel dots={false} effect="fade" autoplay className={classes.Carousel}>
      {images}
    </Carousel>
  )
}
export default DeviceImage
