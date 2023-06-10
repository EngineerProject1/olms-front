import { Alert, Button, Checkbox, Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { GlobalContext } from 'app'
import MyUpload from 'components/myUpload'
import { LabModel } from 'mdoel/LabModel'
import { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'

function LabForm({
  editId,
  open,
  setOpen,
}: {
  editId: number
  open: boolean
  setOpen: React.Dispatch<boolean>
}) {
  // 实验室数据
  const [labData, setLabData] = useState<LabModel>()
  // 开放时间
  const openSchedule = [
    { label: '周一', value: 2 },
    { label: '周二', value: 3 },
    { label: '周三', value: 4 },
    { label: '周四', value: 5 },
    { label: '周五', value: 6 },
    { label: '周六', value: 7 },
    { label: '周日', value: 1 },
  ]
  const { messageApi } = useContext(GlobalContext)
  // 实验室状态
  const labStatus = [
    { label: '可用', value: 0 },
    { label: '暂不可用', value: 1 },
    { label: '维修中', value: 2 },
  ]
  // 图片名字
  const [images, setImages] = useState('')
  // 教师姓名
  const [teachers, setTeachers] = useState([])
  // 该位置是否存在实验室
  const [isLocation, setIsLocation] = useState<boolean>(false)
  // form表单
  const [form] = useForm()
  // 修改时第一次不占用
  const [editLoaction, setEditLocation] = useState()
  useEffect(() => {
    axios.get('/teacher/names').then((resp) => {
      const data = resp.data
      setTeachers(data.data)
    })
    if (editId !== -1 && open) {
      // 回显数据
      axios.get(`/lab/${editId}`).then((resp) => {
        const data = resp.data.data
        setLabData(data)
        setImages(data.images)
        setEditLocation(data.location)
        form.setFieldsValue(data)
      })
    }
  }, [open])

  // 关闭modal清除表单
  const resetForm = () => {
    form.resetFields()
    setOpen(false)
    setImages('')
  }

  const checkAddress = () => {
    const location = form.getFieldValue('location')
    if (location === editLoaction) {
      return
    }
    axios
      .get('/lab/location', {
        params: {
          location,
        },
      })
      .then((resp) => {
        if (resp.data.msg === '已存在实验室') {
          setIsLocation(true)
        } else {
          setIsLocation(false)
        }
      })
  }

  // 提交表单数据
  const onFinsh = (values: any) => {
    if (editId === -1) {
      axios.post('/auth/lab', { ...values, images: images }).then((resp) => {
        const data = resp.data
        setOpen(false)
        if (data.code === 200) {
          messageApi.success(data.msg)
          resetForm()
        }
      })
    } else {
      axios
        .put('/auth/lab', { ...labData, ...values, images: images })
        .then((resp) => {
          const data = resp.data
          setOpen(false)
          if (data.code === 200) {
            messageApi.success(data.msg)
            resetForm()
          }
        })
    }
  }

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose={true}
      onCancel={() => {
        resetForm()
      }}
      width={380}>
      <div>{editId === -1 ? '新增实验室' : '编辑实验室'}</div>
      <div>
        <Form
          onFinish={onFinsh}
          form={form}
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          style={{
            width: 380,
            marginTop: 15,
            padding: '1em',
          }}
          layout="horizontal">
          <Form.Item
            name="name"
            label="名称"
            rules={[
              {
                required: true,
                pattern: /^[\u4e00-\u9fa5\w]{2,12}$/,
                message: '实验室名称为2-12个字符',
              },
            ]}>
            <Input placeholder="请输入实验室名称" />
          </Form.Item>
          <Form.Item name="images" label="图片">
            <MyUpload
              setName={setImages}
              fileList={images ? '/api/img/download?name=' + images : undefined}
            />
          </Form.Item>
          <Form.Item
            name="masterId"
            label="负责人"
            rules={[{ required: true }]}>
            <Select
              placeholder="请选择负责人"
              options={teachers.map((item: any) => {
                return {
                  value: item.id,
                  label: item.real_name,
                }
              })}></Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="地址"
            rules={[
              {
                required: true,
                pattern: /^[A-Z]\d{3}$/,
                message: '地址为一位字母和三位数字',
              },
            ]}
            extra={
              isLocation === true ? (
                <Alert style={{}} message="被占用" type="error" showIcon />
              ) : (
                ''
              )
            }>
            <Input placeholder="请输入实验室位置" onBlur={checkAddress} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input placeholder="描述" />
          </Form.Item>
          <Form.Item name="weekdays" label="开放时间:">
            <Checkbox.Group
              options={openSchedule}
              defaultValue={labData?.weekdays}
              style={{ flexWrap: 'wrap', justifyContent: 'right' }}
            />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="容量"
            rules={[
              {
                required: true,
                pattern: /^[3-9]\d$/,
                message: '30-99',
              },
            ]}>
            <Input placeholder="容量" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[
              {
                required: true,
                pattern: /^[\u4e00-\u9fa5\w]{2,10}$/,
                message: '类型为2-10个字符',
              },
            ]}>
            <Input placeholder="类型" />
          </Form.Item>
          {/* 实验室状态(0:可用,1:暂不可用,2:维修中) */}
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select placeholder="状态" options={labStatus} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editId === -1 ? '新增' : '修改'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default LabForm
