import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography,Skeleton  } from 'antd'
import './portal.css';
import Instruction from './instruction';
import TestBoard from './testBoard';
import Answer from '../answersheet/answer';
import { fetchTraineedata,setTestDetsils,fetchTestdata } from '../../../actions/traineeAction';
import queryString from 'query-string';
const { Title } = Typography;


class MainPortal extends Component {
    constructor(props){
        super(props);
        let params = queryString.parse(this.props.location.search);
        this.state={
            testDetails:params
        }
        this.props.setTestDetsils(params.testid,params.traineeid)
        
    }

    componentDidMount(){
        console.log(this.props.trainee.traineeid)
        this.props.fetchTraineedata(this.state.testDetails.traineeid)
        this.props.fetchTestdata(this.state.testDetails.testid,this.state.testDetails.traineeid)
    }


    render() {
        if(this.props.trainee.initialloading2 || this.props.trainee.initialloading1){
            return(
                <div className="skeletor-wrapper">
                    <Skeleton active />
                    <Skeleton active />
                </div>  
            )
        }
        else{
            if(this.props.trainee.invalidUrl){
                return window.location.href=``;
            }
            else{
                if(this.props.trainee.LocaltestDone){
                    return(
                        <div>
                            <Answer/>
                        </div>
                    )
                }
                else{
                    if(this.props.trainee.testconducted){
                        return(
                            <div className="Test-portal-not-started-yet-wrapper">
                                <div className="Test-portal-not-started-yet-inner">
                                    <Title className="Test-portal-not-started-yet-inner-message" style={{color:'#fff'}} level={4}>Bài kiểm tra đã kết thúc!<br/></Title>
                                </div>
                            </div>
                        )
                    }
                    else{
                        if(!this.props.trainee.testbegins){
                            return(
                                <div className="Test-portal-not-started-yet-wrapper">
                                    <div className="Test-portal-not-started-yet-inner">
                                        <Title className="Test-portal-not-started-yet-inner-message" style={{color:'#fff'}} level={4}>Bài kiểm tra vẫn chưa bắt đầu. Đợi thông báo từ giáo viên và tải lại trang.</Title>
                                    </div>
                                </div>
                            )
                        }
                        else{
                            if(this.props.trainee.startedWriting){
                                return(
                                    <div>
                                        <TestBoard />
                                    </div>
                                )
                            }
                            else{
                                return(
                                    <div>
                                        <Instruction/>                             
                                    </div>
                                )
                            }
                        }
                    }
                }
            }
            
        }
        
    }

}


const mapStateToProps = state => ({
    trainee : state.trainee
});




export default connect(mapStateToProps,{
    fetchTraineedata,
    setTestDetsils,
    fetchTestdata
})(MainPortal);

