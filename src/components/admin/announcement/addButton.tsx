import React, { useState } from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd'
import Publish from './quillText'

interface Values {
  title: string
  description: string
  modifier: string
}

interface CollectionCreateFormProps {
  open: boolean
  onCreate: (values: Values) => void
  onCancel: () => void
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="新增公告"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}>
      <Publish />
    </Modal>
  )
}

const AddButton: React.FC = () => {
  const [open, setOpen] = useState(false)

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values)
    setOpen(false)
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true)
        }}>
        新增公告
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </div>
  )
}

export default AddButton
