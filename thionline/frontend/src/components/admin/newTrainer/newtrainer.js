import React, { Component } from 'react'
import './newtrainer.css';
import {
    Form,
    Input,
    Button,
    Select
} from 'antd';
import {SecurePost} from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import { connect } from 'react-redux';
import { 
    ChangeTrainerConfirmDirty,
    ChangeTrainerModalState,
    ChangeTrainerTableData
} from '../../../actions/adminAction';
import Alert from '../../../components/common/alert';
const { Option } = Select;
class NewTrainer extends Component {

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Mật khẩu không khớp !');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.props.admin.TrainerconfirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                
                    SecurePost({
                        url : `${apis.CREATE_TRAINER}`,
                        data : {
                            _id : this.props.admin.trainerId,
                            name :values.name,
                            password : values.password,
                            emailid : values.emailid,
                            contact : values.prefix+values.contact
                        }
                    }).then((response)=>{
                        if(response.data.success){
                            this.props.ChangeTrainerModalState(false,null,'Đăng ký');
                            Alert('success','Thành công',response.data.message);
                            this.props.ChangeTrainerTableData();
                        }
                        else{
                            console.log(response.data);
                            this.props.ChangeTrainerModalState(false,null,'Đăng ký');
                            return Alert('warning','Cảnh báo!',response.data.message);
                        }
                    }).catch((error)=>{
                        this.props.ChangeTrainerModalState(false,null,'Đăng ký');
                        return Alert('error','Lỗi!','Lỗi máy chủ');
                    })
                
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: this.props.admin.trainerdetails.prefix || '+84',
            rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
          })(
            <Select style={{ width: 70 }}>
              <Option value="+84">+84</Option>
            </Select>,
          );
        return (
            <div className="register-trainer-form">
                <div className="register-trainer-form-body">
                    <Form  onSubmit={this.handleSubmit}>
                        <Form.Item label="Tên" hasFeedback className="input-admin-trainer">
                            {getFieldDecorator('name', {
                                initialValue : this.props.admin.trainerdetails.name,
                                rules: [{ required: true, message: 'Vui lòng điền tên!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>
                    
                        { !this.props.admin.trainerId ? <Form.Item label="E-mail" hasFeedback className="input-admin-trainer">
                            {getFieldDecorator('emailid', {
                                initialValue : this.props.admin.trainerdetails.emailid,
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lệ!',
                                    },
                                    {
                                        required: true,
                                        message: 'Vui lòng điền email!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item> : null }

                        <Form.Item label="Số điện thoại" className="input-admin-trainer">
                            {getFieldDecorator('contact', {
                                initialValue : this.props.admin.trainerdetails.contact,
                                rules: [
                                    { 
                                        required: true, 
                                        message: 'Vui lòng điền số điện thoại!' 
                                    }/* ,
                                    {
                                        len:10,
                                        message:'Contact number must be 10 digit long'
                                    } */],
                            })(<Input addonBefore={prefixSelector} min={8} max={11} />)}
                        </Form.Item>

                        { !this.props.admin.trainerId ? <div><Form.Item label="Mật khẩu" hasFeedback className="input-admin-trainer">
                                {getFieldDecorator('password', {
                                    initialValue : this.props.admin.trainerdetails.password,
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mật khẩu!',
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                        
                            <Form.Item label="Xác nhận mật khẩu" hasFeedback className="input-admin-trainer">
                                {getFieldDecorator('confirm', {
                                    initialValue : this.props.admin.trainerdetails.confirmpassword,
                                    rules: [
                                    {
                                        required: true,
                                        message: 'Nhập lại mật khẩu của bạn!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                    ],
                                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                            </Form.Item></div> : null}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                {this.props.admin.Trainermode}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    admin : state.admin
});



const NewTrainerForm = Form.create({ name: 'register' })(NewTrainer);

export default connect(mapStateToProps,{
    ChangeTrainerConfirmDirty,
    ChangeTrainerModalState,
    ChangeTrainerTableData
})(NewTrainerForm);

