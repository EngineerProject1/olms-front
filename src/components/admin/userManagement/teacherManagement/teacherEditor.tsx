import { Alert, Button, Form, Input, Radio, Select, Switch } from 'antd'
import { GlobalContext } from 'app'
import { useContext } from 'react'
import axios from 'tools/axios'

export function TeacherEditor(props: {
  // 传过来的参数
  form: any
  setModalOpen: React.Dispatch<any>
  college: any
  isRepeatTid: any
  setIsRepeatTid: any
  editId: any
  editorManager: any
  setEditorManager: any
  resetPwd: any
  setResetPwd: any
  closeForm: any
  params: any
  setParams: any
}) {
  const {
    form,
    setModalOpen,
    college,
    isRepeatTid,
    setIsRepeatTid,
    editId,
    editorManager,
    setEditorManager,
    resetPwd,
    setResetPwd,
    closeForm,
    params,
    setParams,
  } = props

  const { messageApi } = useContext(GlobalContext)

  // 提交表单信息
  const onFinish = async (values: any) => {
    let isManager = form.getFieldValue('isManager')
    let sex = form.getFieldValue('sex')
    // let res = await axios.get(`/teacher/${values.tid}`)
    // let flag = res.data.data
    // let data = {
    //   ...values,
    //   username: values.tid,
    //   realName: values.teacherName,
    //   sex: (sex === undefined || sex === 1 ? 1 : 0) === 1 ? '男' : '女',
    //   isSetManager:
    //     (isManager === undefined || isManager === false ? false : true) === true
    //       ? 1
    //       : 0,
    //   isResetPwd: resetPwd.isReset === true ? 1 : 0,
    // }
    // console.log(data)
    // 增添教师信息
    // if (flag === null) {
    //   await axios.post('/teacher', data)
    //   setParams({
    //     ...params,
    //     total: params.total + 1,
    //   })
    //   messageApi.success('添加学生信息成功！')
    // }
    // 修改教师信息
    // else {
    //   // 如果没有修改学院专业信息，则将学院专业对应id赋值
    //   if (isChangeCollege === false) {
    //     await axios.put('/student', {
    //       ...data,
    //       collegeId: collegeAndMajorId.collegeId,
    //       majorId: collegeAndMajorId.majorId,
    //       id: editId,
    //     })
    //   } else {
    //     await axios.put('/student', {
    //       ...data,
    //       id: editId,
    //     })
    //   }
    //   messageApi.success('修改学生信息成功！')
    // }
    // 关闭表单
    closeForm()
    setParams({
      ...params,
      loader: !params.loader,
    })
  }

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 校验职工号
  const checkSid = async () => {
    let tid = form.getFieldValue('tid')
    let res = await axios.get(`/teacher/${tid}`)
    console.log(res)
    if (res.data.data === null) {
      setIsRepeatTid(false)
    } else setIsRepeatTid(true)
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      form={form}
      disabled={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{
        width: 400,
        background: 'white',
        marginTop: 15,
        padding: '1em',
      }}>
      <Form.Item>{editId === 0 ? '新增' : '编辑'}教师</Form.Item>

      <Form.Item
        name="tid"
        label="职工号"
        validateTrigger="onChange"
        extra={
          isRepeatTid === true ? (
            <Alert
              style={{}}
              message="该职工号已存在！"
              type="error"
              showIcon
            />
          ) : (
            ''
          )
        }
        rules={[
          {
            required: true,
            pattern: /^\d{7}$/,
            message: '职工号为7位数字',
          },
        ]}>
        <Input
          placeholder="请输入职工号"
          // 当失去焦点校验职工号是否重复
          onBlur={checkSid}
        />
      </Form.Item>

      <Form.Item
        name="teacherName"
        label="姓名"
        rules={[
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
            message: '姓名长度不得超过20个字符',
          },
        ]}>
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item name="sex" label="性别">
        {/* <Radio.Group onChange={setSexValue} value={sex} defaultValue={sex}> */}
        <Radio.Group defaultValue={1}>
          <Radio value={1}>男</Radio>
          <Radio value={0}>女</Radio>
        </Radio.Group>
      </Form.Item>

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
            // setMajor([])
            // setIsChangeCollege(true)
          }}
          // onSelect={getMajor}
          showSearch
          style={{ width: 217 }}
          placeholder="点击搜索学院关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={college.map((item: { key: React.Key; name: String }) => {
            return {
              value: item.key,
              label: item.name,
            }
          })}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="电话"
        rules={[
          {
            pattern: /^\d{11}$/,
            message: '请输入正确的电话号码格式',
          },
        ]}>
        <Input placeholder="请输入电话" />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            pattern:
              /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: '请输入正确的邮箱格式',
          },
        ]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item name="isManager" label="管理员">
        <Switch
          // disabled={true}
          checked={editorManager}
          onChange={() => setEditorManager(!editorManager)}
        />
      </Form.Item>

      <Form.Item name="isResetPwd" label="重置密码">
        <Switch
          disabled={resetPwd.isDisabled}
          checked={resetPwd.isReset}
          onChange={() =>
            setResetPwd({
              ...resetPwd,
              isReset: !resetPwd.isReset,
            })
          }
        />
      </Form.Item>

      <Form.Item>
        <div
          style={{
            width: 180,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Button
            disabled={isRepeatTid}
            // onClick={() => setIsShowMajor(false)}
            htmlType="submit"
            type="primary"
            style={{ marginLeft: 310, marginBottom: 10 }}>
            提交
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
