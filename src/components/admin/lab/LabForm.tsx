import { Alert, Button, Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { GlobalContext } from 'app'
import MyUpload from 'components/myUpload'
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
  const { messageApi } = useContext(GlobalContext)
  // 图片名字
  const [images, setImages] = useState('')
  // 教师姓名
  const [teachers, setTeachers] = useState([])
  // 该位置是否存在实验室
  const [isLocation, setIsLocation] = useState<boolean>(false)
  // form表单
  const [form] = useForm()
  useEffect(() => {
    axios.get('/teacher/names').then((resp) => {
      const data = resp.data
      setTeachers(data.data)
    })
    if (editId !== -1) {
      axios.get(`/lab/${editId}`).then((resp) => {
        const data = resp.data
        console.log(data)
      })
    }
  }, [editId])

  // 关闭modal清除表单
  const resetForm = () => {
    form.resetFields()
    setOpen(false)
    setImages('')
  }

  const checkAddress = () => {
    const location = form.getFieldValue('location')
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
    axios.post('/auth/lab', { ...values, images: images }).then((resp) => {
      const data = resp.data
      console.log(data)
      setOpen(false)
      if (data.code === 200) {
        messageApi.info(data.msg)
        resetForm()
      }
    })
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
                pattern: /^\w{10,12}$/,
                message: '实验室名称为10-12个字符',
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
                message: '实验室名称为10-12个字符',
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
            <Select placeholder="状态">
              <Select.Option value="0">可用</Select.Option>
              <Select.Option value="1">暂不可用</Select.Option>
              <Select.Option value="2">维修中</Select.Option>
            </Select>
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
