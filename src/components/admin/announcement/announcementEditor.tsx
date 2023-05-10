import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Form, Input, InputNumber } from 'antd'
import axios from 'tools/axios'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { RefObject, useContext, useRef } from 'react'
import { GlobalContext } from 'app'

export function AnnouncementEditor() {
  const width = 800
  const { data } = useLoaderData() as {
    data: { content: string; title: string; id: number }
  }
  const navigate = useNavigate()
  const { messageApi } = useContext(GlobalContext)

  const quillRef = useRef<any>()
  const onFinish = async (values: any) => {
    let response
    if (data.id == 0) {
      response = await axios.post('/auth/notice', { ...values, id: data.id })
    } else {
      response = await axios.put('/auth/notice', { ...values, id: data.id })
    }
    messageApi.success('成功')
    navigate('/announcement')
  }
  return (
    <Form
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 13 }}
      // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
      initialValues={data}
      onFinish={onFinish}>
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入文章标题' }]}>
        <Input placeholder="请输入文章标题" style={{ width: width }} />
      </Form.Item>
      <Form.Item
        label="内容"
        name="content"
        rules={[{ required: true, message: '请输入文章内容' }]}>
        <ReactQuill
          theme="snow"
          ref={quillRef}
          style={{
            height: 500,
            width: width,
            marginBottom: 50,
          }}
          // defaultValue={data.content}
        />
      </Form.Item>
      <Form.Item
        name="level"
        label="等级"
        rules={[{ required: true, message: '请输入等级' }]}>
        <InputNumber min={1} max={100} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button type="primary" htmlType="submit" style={{ width: 72 }}>
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export async function announcementLoader({
  params,
}: {
  params: { noticeId: string }
}) {
  if (Number.parseInt(params.noticeId) == 0) {
    return { data: { id: 0 } }
  }
  const response = await axios.get('/notice/' + params.noticeId)
  return { data: response.data.data }
}
