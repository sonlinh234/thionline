import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Input,Button,Descriptions, Icon,message   } from 'antd';
import {changeTestRegisterLink,updateCurrentTestBasicDetails,changeTestRegisterStatus,changeTestStatus,updateCandidatesTest} from '../../../actions/conductTest';
import { connect } from 'react-redux';
import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../common/alert';

class TestDetails extends React.Component {

    componentDidMount(){
        var link = window.location.href.split('/').splice(0,3);
        var mainlink="";
        link.forEach((d,i)=>{
            mainlink=mainlink+d+"/"
        });
        mainlink=mainlink+`trainee/register?testid=${this.props.conduct.id}`
        this.props.changeTestRegisterLink(mainlink);
        this.props.updateCurrentTestBasicDetails(this.props.conduct.id);
        this.props.updateCandidatesTest();
    }

    changeRegistrationStatus=(d)=>{
        SecurePost({
            url:`${apis.STOP_REGISTRATION}`,
            data:{
                id:this.props.conduct.id,
                status:d
            }
        }).then((response)=>{
            if(response.data.success){
                this.props.changeTestRegisterStatus(d)
                Alert('success','Thành công!','Đã thay đổi trạng thái đăng ký');
            }
            else{
                Alert('error','Lỗi!',response.data.message)
            }
        }).catch((error)=>{
            console.log(error);
            Alert('error','Lỗi!','Lỗi Server')
        })
    }

    changeTestStatus = ()=>{
        SecurePost({
            url:`${apis.START_TEST_BY_TRAINER}`,
            data:{
                id:this.props.conduct.id
            }
        }).then((response)=>{
            console.log(response);
            if(response.data.success){
                this.props.changeTestStatus(response.data.data);
                Alert('success','Thành công!','Đã bắt đầu kiểm tra');
            }
            else{
                Alert('error','Lỗi!',response.data.message)
            }
        }).catch((error)=>{
            console.log(error);
            Alert('error','Lỗi!','Lỗi Server')
        })
    }

    endTestByTrainee = ()=>{
        SecurePost({
            url:`${apis.END_TEST_BY_TRAINER}`,
            data:{
                id:this.props.conduct.id
            }
        }).then((response)=>{
            console.log(response);
            if(response.data.success){
                this.props.changeTestStatus(response.data.data);
                Alert('success','Thành công!','Đã kết thúc kiểm tra');
            }
            else{
                Alert('error','Lỗi!',response.data.message)
            }
        }).catch((error)=>{
            console.log(error);
            Alert('error','Lỗi!','Lỗi Server')
        }) 
    }


    getCandidates = ()=>{
        SecurePost({
            url:`${apis.GET_TEST_CANDIDATES}`,
            data:{
                id: this.props.conduct.id
            }
        }).then((response)=>{
            console.log(response);
        }).catch((error)=>{
            console.log(error)
        })
    }
    
    render(){
        console.log(this.props.conduct.basictestdetails.testbegins);
        return (
            <div>
                <Descriptions size="small" column={4} title="Thông tin" layout="vertical" bordered={true}>
                    <Descriptions.Item span={1} label="Id">{this.props.conduct.id}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Link đăng ký"><Input disabled={true} value={this.props.conduct.testRegisterLink} addonAfter={<CopyToClipboard text={this.props.conduct.testRegisterLink} onCopy={()=>message.success('Đã chép vào clipboard')}><Icon type="copy"/></CopyToClipboard>}/></Descriptions.Item>
                    <Descriptions.Item span={1} label={this.props.conduct.basictestdetails.isRegistrationavailable?"Mở đăng ký":"Đóng đăng ký"}><Button disabled={this.props.conduct.basictestdetails.testbegins} onClick={()=>{this.changeRegistrationStatus(!this.props.conduct.basictestdetails.isRegistrationavailable)}} type={this.props.conduct.basictestdetails.isRegistrationavailable?"danger":"primary"}>{this.props.conduct.basictestdetails.isRegistrationavailable?"Dừng đăng ký":"Mở đăng ký"}</Button></Descriptions.Item>
                    <Descriptions.Item span={3} label={this.props.conduct.basictestdetails.testbegins?"Đang kiểm tra":"Bài kiểm tra chưa được bắt đầu"}><Button  disabled={this.props.conduct.basictestdetails.testbegins} onClick={()=>{this.changeTestStatus()}} type={"primary"}>Bắt đầu kiểm tra</Button><Button  disabled={!this.props.conduct.basictestdetails.testbegins} onClick={()=>{this.endTestByTrainee()}} type={"danger"}>Kết thúc kiểm tra</Button></Descriptions.Item>
                </Descriptions>            
            </div>
        )
    }
    
}


const mapStateToProps = state => ({
    trainer : state.trainer,
    conduct : state.conduct
});

export default connect(mapStateToProps,{
    changeTestRegisterLink,
    updateCurrentTestBasicDetails,
    changeTestRegisterStatus,
    changeTestStatus,
    updateCandidatesTest
})(TestDetails);