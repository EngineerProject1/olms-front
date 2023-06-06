import { useEffect, useState } from 'react'
import { Select, Form, Input, Button } from 'antd'
import type { SelectProps } from 'antd'
import axios from 'tools/axios'

const MySearch = ({
  setList,
  setParams,
}: {
  setList: ([]) => void
  setParams: any
}) => {
  //获取当前用户预约的实验室名称
  const [labNames, setLabNames] = useState<[]>()
  useEffect(() => {
    const getLabNames = async () => {
      const res = await axios.get('/auth/appointmentLab')
      const { data } = res
      setLabNames(data.data)
    }
    getLabNames()
  }, [])

  const options: SelectProps['options'] = []
  if (labNames) {
    labNames.map((item: { id: string; name: string }) =>
      options.push({
        value: item.id,
        label: item.name,
      })
    )
  }

  //获取所选择的实验室的设备信息
  const getList = (value: any) => {
    setParams((pre: any) => {
      return {
        ...pre,
        id: value,
        name: '',
      }
    })
  }

  //搜索查询
  const onSearch = async (values: any) => {
    setParams((pre: any) => {
      return {
        ...pre,
        name: values.name,
      }
    })
  }
  return (
    <>
      <div>
        <Select
          placeholder="选择实验室"
          onSelect={getList}
          style={{ width: 150 }}
          options={options}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form
          style={{ display: 'flex', justifyContent: 'space-between' }}
          onFinish={onSearch}>
          <Form.Item
            name="name"
            label="设备名称"
            rules={[
              {
                pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
                message: '名称长度不得超过20个字符',
              },
            ]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ marginLeft: 10 }}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default MySearch
