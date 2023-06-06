import { Form, Input, Modal, Select, Switch } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect, useState } from 'react'
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
  const [college, setCollege] = useState<any>([])
  const [major, setMajor] = useState<any>([])
  const [isChangeCollege, setIsChangeCollege] = useState(false)
  const [gradeAndClass, setGradeAndClass] = useState<
    {
      grade: number
      classNumber: number[]
    }[]
  >([])
  const [grade, setGrade] = useState(0)
  const [form] = Form.useForm()
  const resetForm = () => {
    form.resetFields()
    props.setModalOpen(false)
    setIsForClass(false)
    setMajor([])
    setGradeAndClass([])
  }
  const onFinish = (values: any) => {
    let requestBody: AppointmentRequest = {
      ...props.appointRequest,
      ...values,
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

  const getMajor = async (id: Number) => {
    // 每次选择完学院后，清空专业
    form.setFieldValue('majorId', '')
    const mRes = await axios.get(`/student/major/${id}`)
    let mData = mRes.data.data

    setMajor(
      mData.map((item: { id: React.Key; majorName: String }) => {
        return {
          key: item.id,
          name: item.majorName,
        }
      })
    )
  }

  useEffect(() => {
    ;(async () => {
      let Res = await axios.get('/student/college')
      let Data = Res.data.data
      setCollege(
        Data.map((item: { id: React.Key; collegeName: String }) => {
          return {
            key: item.id,
            name: item.collegeName,
          }
        })
      )
    })()
  }, [])

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
            <Form.Item name="type" label="是否为班级借用" initialValue={false}>
              <Switch
                onChange={(checked) => {
                  setIsForClass(checked)
                }}
              />
            </Form.Item>
          ) : null}
          {isForClass ? (
            <>
              <Form.Item
                name="collegeId"
                label="学院"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Select
                  onChange={() => {
                    setMajor([])
                    setIsChangeCollege(true)
                  }}
                  onSelect={getMajor}
                  showSearch
                  style={{ width: 217 }}
                  placeholder="点击搜索学院关键字"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as any).includes(input)
                  }
                  options={college.map(
                    (item: { key: React.Key; name: String }) => {
                      return {
                        value: item.key,
                        label: item.name,
                      }
                    }
                  )}
                />
              </Form.Item>
              <Form.Item
                name="majorId"
                label="专业"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Select
                  showSearch
                  style={{ width: 217 }}
                  onSelect={(item) => {
                    ;(async () => {
                      const response = await axios.get('/studentClass', {
                        params: { majorId: item },
                      })
                      const data = response.data.data
                      setGradeAndClass(data)
                    })()
                  }}
                  placeholder="点击搜索专业关键字"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as any).includes(input)
                  }
                  options={major.map(
                    (item: { key: React.Key; name: String }) => {
                      return {
                        value: item.key,
                        label: item.name,
                      }
                    }
                  )}
                />
              </Form.Item>
              <Form.Item
                name="grade"
                label="年级"
                rules={[
                  {
                    required: true,
                    pattern: /^\d{4}$/,
                    message: '请输入年级对应数字',
                  },
                ]}>
                <Select
                  showSearch
                  style={{ width: 217 }}
                  placeholder="点击搜索年级"
                  optionFilterProp="children"
                  onSelect={(e) => {
                    setGrade(e)
                  }}
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as any).includes(input)
                  }
                  options={gradeAndClass.map((item) => ({
                    value: item.grade,
                    label: item.grade,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="classNumber"
                label="班级"
                rules={[{ required: true, message: '请输入班级' }]}>
                <Select
                  showSearch
                  style={{ width: 217 }}
                  placeholder="点击搜索班级"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as any).includes(input)
                  }
                  options={gradeAndClass
                    .find((value) => value.grade == grade)
                    ?.classNumber.map((item) => ({ value: item, label: item }))}
                />
              </Form.Item>
            </>
          ) : null}
        </Form>
      </div>
    </Modal>
  )
}
