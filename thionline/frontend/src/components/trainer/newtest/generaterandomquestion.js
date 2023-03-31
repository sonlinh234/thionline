import React, { Component } from 'react';
import { Button, Skeleton,Modal,Form,InputNumber,Transfer,Row,Col } from 'antd';
import { connect } from 'react-redux';
import { changeStep,changeMode,removeQuestionFromMainQueue,changeBasicNewTestDetails,fetchSubjectWiseQuestion,pushQuestionToQueue } from '../../../actions/testAction';
import './newtest.css';
import Alert from '../../common/alert';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';

class GeneraterandomQuestionO extends Component {
    constructor(props){
        super(props);
        this.state={
            generating:false,
            autogenerate:true,
            ActiveQuestionId:null,
            Mvisible:false
        }
        this.props.changeMode(this.props.mode);
    }

    componentDidMount(){
        this.props.fetchSubjectWiseQuestion(this.props.test.newtestFormData.testSubject);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                if(values.no<=this.props.test.questionsAvailablebasedonSubject.length){
                    var qus=[];
                    var allquestions=[...this.props.test.questionsAvailablebasedonSubject];
                    var l=allquestions.length-1;
                    for(var i=values.no;i>0;i--){
                        l=l-1;
                        var r = Math.floor(Math.random() * l);
                        qus.push(allquestions[r]._id);
                        allquestions.splice(r,1);
                    }
                    this.props.pushQuestionToQueue(qus);
                    this.setState({
                        autogenerate : false
                    })
                }
                else{
                    Alert('error','Lỗi!',"Không đủ câu hỏi." );
                } 
            }
        });
    };

    renderItem = item => {
        const customLabel = (
          <span className="custom-item">
                <Button shape="circle" onClick={()=>{this.OpenModel(item._id)}} icon="info" style={{background:'linear-gradient(to right,rgb(80,190,189),rgb(0,153,153),rgb(0,153,203))',color:'greenblue'}} size="small" ></Button>
                {item.body}
          </span>
        )
        return {
            label: customLabel, 
            value: item._id, 
        }
    }

    OpenModel=(qid)=>{
        this.setState({
            ActiveQuestionId:qid,
            Mvisible:true
        })
    }
    handleCancel=()=>{
        this.setState({
            Mvisible:false
        })
    }

    handleChange = (targetKeys, direction, moveKeys) => {
        this.props.pushQuestionToQueue(targetKeys);
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Row>
                    <Col span={5} style={{padding:'20px 0px'}}>
                        <div className={`random-question-generation ${this.props.mode ==="random"? "notblind" : "blind"}`}>
                            <Form onSubmit={this.handleSubmit} >
                                <Form.Item label="Nhập số lượng câu hỏi" hasFeedback>
                                    {getFieldDecorator('no', {
                                        rules: [{ required: true, message: 'Vui lòng nhập số lượng câu hỏi' }],
                                    })(
                                        <InputNumber style={{width:'100%'}}  placeholder="Số lượng câu hỏi" min={10} max={50}/>
                                    )}
                                </Form.Item> 
                                <Form.Item>
                                    <Button type="default" htmlType="submit" block disabled={!this.state.autogenerate}>
                                        Tạo đề
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col span={19} style={{padding:'20px'}}>
                        <Transfer
                            disabled={this.props.mode ==="random"? true : false}
                            rowKey={record => record._id}
                            dataSource={this.props.test.questionsAvailablebasedonSubject}
                            listStyle={{
                                width: '45%',
                                height: 500,
                            }}
                            targetKeys={this.props.test.newtestFormData.testQuestions}
                            render={this.renderItem}
                            onChange={this.handleChange}
                            locale={{itemUnit: 'câu hỏi', itemsUnit: 'câu hỏi', notFoundContent: 'Không có dữ liệu', searchPlaceholder: 'Tìm kiếm' }}
                        />
                    </Col>
                </Row>
                <Modal
                    destroyOnClose={true}
                    width="70%"
                    style={{top:'30px'}}
                    title="Chi tiết câu hỏi"
                    visible={this.state.Mvisible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                    >
                    <SingleQuestionDetails qid={this.state.ActiveQuestionId}/>
                </Modal>  
            </div>
        )
    }
}

const GeneraterandomQuestion = Form.create({ name: 'Basic Form' })(GeneraterandomQuestionO);

const mapStateToProps = state => ({
    test : state.test
});

export default connect(mapStateToProps,{
    changeStep,
    changeBasicNewTestDetails,
    fetchSubjectWiseQuestion,
    pushQuestionToQueue,
    removeQuestionFromMainQueue,
    changeMode
})(GeneraterandomQuestion);



class SingleQuestionDetails extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fetching:false,
            qdetails:null
        }
    }

    componentDidMount(){
        this.setState({
            fetching:true
        })
        Post({
            url:apis.FETCH_SINGLE_QUESTION_BY_TRAINEE,
            data:{
                qid:this.props.qid
            }
        }).then((response)=>{
            console.log(response)
            if(response.data.success){
                this.setState({
                    qdetails:response.data.data[0]
                })
            }
            else{
                Alert('error','Lỗi !',response.data.message);
            }
            this.setState({
                fetching:false
            })
        }).catch((error)=>{
            this.setState({
                fetching:false
            })
            console.log(error)
            Alert('error','Lỗi !',"Lỗi server");
        })
    }
    
    render(){
        const optn =['A','B','C','D','E'];
        let Optiondata=this.state.qdetails;
        if(Optiondata!==null){
            return (
                <div>
                    <div className="mainQuestionDetailsContaine">
                        <div className="questionDetailsBody">
                            {Optiondata.body}
                        </div>
                        {Optiondata.quesimg?
                            <div className="questionDetailsImageContainer">
                                <img alt="Question" className="questionDetailsImage" src={Optiondata.quesimg} />  
                            </div>
                            : null
                        }
                        <div>
                            {Optiondata.options.map((d,i)=>{
                                return(
                                    <div key={i}>
                                        <Row type="flex" justify="center" className="QuestionDetailsOptions">
                                            <Col span={2}>
                                                {
                                                    d.isAnswer?<Button className="green" shape="circle">{optn[i]}</Button>:<Button type="primary" shape="circle">{optn[i]}</Button>
                                                }
                                                
                                            </Col>
                                            {d.optimg?
                                                <Col span={6} style={{padding:'5px'}}>
                                                    <img alt="options" className="questionDetailsImage" src={d.optimg} />
                                                </Col>
                                            :
                                                null
                                            }
                                            {d.optimg?
                                                <Col span={14}>{d.optbody}</Col>
                                            :
                                                <Col span={20}>{d.optbody}</Col>
                                            }
                                        </Row>
                                    
                                    </div>
                                )
                            })}
                        </div>
                    </div>
    
                </div>
            )
        }
        else{
            return(
                <div className="skeletor-wrapper">
                    <Skeleton active />
                    <Skeleton active />
                </div>
            )
        }
        
    }
}