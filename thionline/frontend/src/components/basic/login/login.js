import React from "react";
import { Form, Input, Icon, Button } from 'antd';
import './login.css';
import { connect } from 'react-redux';
import { login, logout } from '../../../actions/loginAction';
import auth from '../../../services/AuthServices';
import Alert from '../../common/alert';
import { Redirect } from 'react-router-dom';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoggedIn :false
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Form da nhan: ', values);
                auth.LoginAuth(values.email,values.password).then((response)=>{
                    console.log(response);
                    if(response.data.success){
                        this.props.login(response.data.user)
                        auth.storeToken(response.data.token);
                        this.setState({
                            isLoggedIn : true
                        })
                    }
                    else{
                        return Alert('error','Lỗi!',response.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                    return Alert('error','Lỗi!','Lỗi máy chủ');
                })              
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        if(this.state.isLoggedIn){
            return <Redirect to={this.props.user.userOptions[0].link} />
        }
        else{
            return(
                <div className="login-container">
                    <div className="login-inner">
                        <Form  onSubmit={this.handleSubmit}>
                            <Form.Item label="Địa chỉ email" hasFeedback className="email-address"> 
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ!',
                                        },
                                        {
                                            required: true,
                                            message: 'Vui lòng điền E-mail!',
                                        },
                                    ],
                                })(<Input 
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Tên tài khoản"/>)}
                            </Form.Item>
                            <Form.Item label="Mật khẩu" hasFeedback className="password">
                                {getFieldDecorator('password', {
                                    rules: [
                                        { 
                                            required: true, message: 'Vui lòng nhập mật khẩu!' 
                                        }
                                    ],
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Mật khẩu"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>  
                </div>
            )
        }
    }

}

const LoginForm = Form.create({ name: 'login' })(Login);


const mapStateToProps = state => ({
    user : state.user
});

export default connect(mapStateToProps,{
    login, 
    logout
})(LoginForm);