import { Button, Form, Input } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect, useState } from 'react'
import { BookInfo } from './labAppointment'

export function BookAppointmentForm(props: {
  bookInfo: BookInfo
  setModalOpen: React.Dispatch<any>
}) {
  const width = 800
  const { messageApi } = useContext(GlobalContext)
  const [isLoading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      form.setFieldsValue({})
      setLoading(false)
    })()
  }, [props])
  return (
    <Form>
      <Form.Item
        name="purpose"
        label="理由"
        rules={[
          { required: true, message: '请输入理由' },
          { pattern: /^.{8,}$/, message: '理由最少8个字' },
        ]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => {}}>
          预约实验室
        </Button>
      </Form.Item>
    </Form>
  )
}
