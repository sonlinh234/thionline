import React, { Component } from 'react';
import './trainerRegister.css';
import { Row, Col, Form, Icon, Input, Button, Select, Typography } from 'antd';
import queryString from 'query-string';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';
const { Option } = Select;
const { Title } = Typography;
class TraineeRegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inform: true,
            testid: null,
            user: null
        }
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search)
        console.log(params)
        this.setState({
            testid: params.testid
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('form: ', values);
                console.log(this.state.testid);
                Post({
                    url: apis.REGISTER_TRAINEE_FOR_TEST,
                    data: {
                        name: values.name,
                        emailid: values.email,
                        contact: `${values.prefix}${values.contact}`,
                        organisation: values.organisation,
                        testid: this.state.testid,
                        location: values.location
                    }
                }).then((data) => {
                    console.log(data.data);
                    if (data.data.success) {
                        this.setState({
                            inform: false,
                            user: data.data.user
                        })
                    }
                    else {
                        this.props.form.resetFields();
                        Alert('error', 'Lỗi!', data.data.message);
                    }
                }).catch((error) => {
                    console.log(error);
                    this.props.form.resetFields();
                    Alert('error', 'Lỗi!', "Lỗi Server");
                })
            }
        });
    };

    resendMail = () => {
        Post({
            url: apis.RESEND_TRAINER_REGISTRATION_LINK,
            data: {
                id: this.state.user._id
            }
        }).then((response) => {
            if (response.data.success) {
                Alert('success', 'Thành công!', "Đã gửi link đến email của bạn");
            }
            else {
                Alert('error', 'Lỗi!', response.data.message);
            }
        }).catch((error) => {
            console.log(error);
            Alert('error', 'Lỗi!', "Lỗi Server");
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '+84',
            rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
        })(
            <Select style={{ width: 70 }}>
                <Option value="+84">+84</Option>
            </Select>,
        );
        return (
            <div className="trainee-registration-form-wrapper">
                {this.state.inform ?
                    <div className="trainee-registration-form-inner">
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Row>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <Form.Item label="Tên" hasFeedback>
                                        {getFieldDecorator('name', {
                                            rules: [{ required: true, message: 'Vui lòng điền tên bạn' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="Tên"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <Form.Item label="Email" hasFeedback>
                                        {getFieldDecorator('email', {
                                            rules: [{
                                                type: 'email',
                                                message: 'Email không hợp lệ!',
                                            },
                                            {
                                                required: true,
                                                message: 'Vui lòng điền email!',
                                            }],
                                        })(
                                            <Input
                                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="Địa chỉ Email"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <Form.Item label="Số điện thoại" hasFeedback>
                                        {getFieldDecorator('contact', {
                                            rules: [{
                                                required: true,
                                                message: 'Vui long điền sđt!'
                                            }/* ,
                                            {
                                                len: 10,
                                                message: 'Số điện thoại phải có độ dài 10 ký tự'
                                            } */],
                                        })(<Input addonBefore={prefixSelector} min={8} max={12} />)}
                                    </Form.Item>
                                    <Form.Item label="Lớp" hasFeedback>
                                        {getFieldDecorator('organisation', {
                                            rules: [{
                                                required: true,
                                                message: 'Vui lòng nhập tên',
                                            }],
                                        })(
                                            <Input
                                                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="Lớp"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <Form.Item label="Địa chỉ" hasFeedback>
                                        {getFieldDecorator('location', {
                                            rules: [{ required: true, message: 'Vui lòng điền tên' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="Địa chỉ"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ paddingTop: '33px' }}>
                                    <Form.Item>
                                        <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                                            Đăng ký
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div> :
                    <div className="reasendmail-container-register">
                        <Title style={{ color: '#fff' }} level={4}>Email chứa link kiểm tra đã được gửi đến {this.state.user.emailid}</Title>
                        <Button type="primary" onClick={this.resendMail}>Gửi lại email</Button>
                    </div>}
            </div>
        )
    }
}

const TraineeRegister = Form.create({ name: 'Trainee Registration' })(TraineeRegisterForm);
export default TraineeRegister;