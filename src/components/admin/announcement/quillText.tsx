import { Form, Input } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Publish = () => {
  return (
    // ...
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 26 }}
      // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
      initialValues={{ content: '' }}>
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入文章标题' }]}>
        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
      </Form.Item>
      <Form.Item
        label="内容"
        name="content"
        rules={[{ required: true, message: '请输入文章内容' }]}>
        <ReactQuill
          theme="snow"
          style={{
            height: 300,
            width: 400,
            marginBottom: 30,
          }}
        />
      </Form.Item>
    </Form>
  )
}
export default Publish
