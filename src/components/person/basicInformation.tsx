import { Avatar, Button, Form, Input, Radio } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect } from 'react'

export function BasicInformation(props: any) {
  const { user } = useContext(GlobalContext)
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(user)
  }, [user])
  return (
    <div style={{ display: 'flex' }}>
      <Form
        name="basic"
        form={form}
        style={{ maxWidth: 400, width: '100%' }}
        //onFinish={onFinish}
        layout="vertical"
        //onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item label="姓名" name="username" rules={[{ message: '' }]}>
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item label="性别" name="sex" rules={[{ message: '' }]}>
          <Radio.Group disabled>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="学院" name="collegeName" rules={[{ message: '' }]}>
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item label="专业" name="majorName" rules={[{ message: '' }]}>
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item label="年级" name="grade" rules={[{ message: '' }]}>
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item label="班级" name="classNumber" rules={[{ message: '' }]}>
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '' }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: '' }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '30%' }}>
            更新基本信息
          </Button>
        </Form.Item>
      </Form>
      <Avatar src={user.avatar} size="large" />
    </div>
  )
}
