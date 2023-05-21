import { Form, Input, Modal, Switch } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useState } from 'react'
import axios from 'tools/axios'
import { AppointmentRequest } from './labAppointment'

export function BookAppointmentForm(props: {
  modalOpen: boolean
  setModalOpen: React.Dispatch<boolean>
  appointRequest: AppointmentRequest
}) {
  const role = JSON.parse(
    atob((localStorage.getItem('token') as string).split('.')[1])
  ).selectedRole
  const { messageApi, user } = useContext(GlobalContext)
  const [isForClass, setIsForClass] = useState(false)
  const [form] = Form.useForm()
  const resetForm = () => {
    form.resetFields()
    setIsForClass(false)
    props.setModalOpen(false)
  }
  const onFinish = (values: any) => {
    let requestBody: AppointmentRequest = {
      ...props.appointRequest,
      ...values,
      isForClass: undefined,
      type: undefined,
    }
    if (values.type != undefined) {
      if (values.type == true) {
        requestBody = { ...requestBody, type: '1' }
      } else {
        requestBody = { ...requestBody, type: '0' }
      }
    }
    axios.post('/auth/addAppointment', requestBody).then((values) => {
      messageApi.success('成功预约')
      props.setModalOpen(false)
      resetForm()
    })
  }

  return (
    <Modal
      centered
      open={props.modalOpen}
      title="预约实验室"
      width={500}
      okText="预约"
      onCancel={() => {
        resetForm()
      }}
      onOk={() => {
        form.submit()
      }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Form
          name="basic"
          form={form}
          style={{ width: '80%' }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Form.Item
            name="experimentName"
            label="实验名称"
            rules={[
              { required: true, message: '请输入实验名称' },
              { pattern: /^.{4,}$/, message: '实验名称最少4个字' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="purpose"
            label="预约理由"
            rules={[
              { required: true, message: '请输入理由' },
              { pattern: /^.{8,}$/, message: '理由最少8个字' },
            ]}>
            <Input.TextArea />
          </Form.Item>
          {role === 'teacher' ? (
            <Form.Item name="type" label="是否为班级借用">
              <Switch
                onChange={(checked) => {
                  setIsForClass(checked)
                }}
              />
            </Form.Item>
          ) : null}
          {isForClass ? (
            <Form.Item
              name="classNumber"
              label="班级"
              rules={[{ required: true, message: '请输入班级' }]}>
              <Input type="number" />
            </Form.Item>
          ) : null}
        </Form>
      </div>
    </Modal>
  )
}
