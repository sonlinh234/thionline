import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, InputNumber , Input, Button,Select  } from 'antd';
import { changeStep,changeBasicNewTestDetails } from '../../../actions/testAction';
import { SecurePost } from '../../../services/axiosCall';
import './newtest.css';
import apis from '../../../services/Apis'
const { Option } = Select;


class BasicTestFormO extends Component {
    constructor(props){
        super(props);
        this.state={
            checkingName:""
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                this.props.changeBasicNewTestDetails({
                    testType:values.type,
                    testTitle: values.title,
                    testDuration : values.duration,
                    OrganisationName:values.organisation,
                    testSubject:values.subjects
                })
                this.props.changeStep(1);
            }
        });
    };

    validateTestName = (rule, value, callback) => {
        if(value.length>=5){
            this.setState({
                checkingName:"validating"
            })
            SecurePost({
                url:apis.CHECK_TEST_NAME,
                data:{
                    testname:value
                }
            }).then((data)=>{
                console.log(data);
                if(data.data.success){
                    if(data.data.can_use){
                        this.setState({
                            checkingName:"success"
                        })
                        callback();
                    }
                    else{
                        this.setState({
                            checkingName:"error"
                        })
                        callback('Đã có bài kiểm tra khác cùng tên.');
                    }
                }
                else{
                    this.setState({
                        checkingName:"success"
                    })
                    callback()
                }
            }).catch((ee)=>{
                console.log(ee);
                this.setState({
                    checkingName:"success"
                })
                callback()
            })
        }
        else{
            callback();
        }        
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="basic-test-form-outer">
                <div className="basic-test-form-inner">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="Loại"  hasFeedback>
                            {getFieldDecorator('type', {
                                initialValue : this.props.test.newtestFormData.testType,
                                rules: [{ required: true, message: 'Vui lòng chọn loại kiểm tra' }],
                            })(
                                <Select 
                                placeholder="Loại"
                                >
                                    <Option value="pre-test">Kiểm tra kiến thức</Option>
                                    <Option value="post-test">Kiểm tra cuối kỳ</Option>   
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="Tiêu đề"  hasFeedback validateStatus={this.state.checkingName}>
                            {getFieldDecorator('title', {
                                initialValue : this.props.test.newtestFormData.testTitle,
                                rules: [
                                    { required: true, message: 'Vui lòng nhập tiêu đề' },
                                    { min:5, message: 'Tiêu đề tối thiểu 5 ký tự' },
                                    { validator: this.validateTestName }
                                ],
                                
                            })(
                                <Input placeholder="Tiêu đề" />
                            )}
                        </Form.Item>
                        <Form.Item label="Môn"  hasFeedback>
                            {getFieldDecorator('subjects', {
                                initialValue : this.props.test.newtestFormData.testSubject,
                                rules: [{ required: true, message: 'Vui lòng chọn môn' }],
                            })(
                                <Select
                                mode="multiple"
                                placeholder="Chọn một hoặc nhiều môn"
                                style={{ width: '100%' }}
                                allowClear={true}
                                optionFilterProp="s"
                                >
                                    {this.props.admin.subjectTableData.map(item => (
                                        <Select.Option key={item._id} value={item._id} s={item.topic}>
                                        {item.topic}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="Thời gian (tối thiểu 15 phút)" hasFeedback>
                            {getFieldDecorator('duration', {
                                initialValue : this.props.test.newtestFormData.testDuration,
                                rules: [{ required: true, message: 'Vui lòng nhập thời gian' }],
                            })(
                                <InputNumber style={{width:'100%'}}  placeholder="Thời gian kiểm tra" min={15} max={180}/>
                            )}
                        </Form.Item> 
                        <Form.Item label="Lớp"  hasFeedback>
                            {getFieldDecorator('organisation', {
                                initialValue : this.props.test.newtestFormData.OrganisationName
                            })(
                                <Input placeholder="Lớp" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Tiếp tục
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
const BasicTestForm = Form.create({ name: 'Basic Form' })(BasicTestFormO);

const mapStateToProps = state => ({
    test : state.test,
    admin:state.admin
});

export default connect(mapStateToProps,{
    changeStep,
    changeBasicNewTestDetails
})(BasicTestForm);