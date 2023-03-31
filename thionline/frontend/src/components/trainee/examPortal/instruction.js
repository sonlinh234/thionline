import React from 'react'
import { connect } from 'react-redux';
import { Button } from 'antd';
import {ProceedtoTest,fetchTestdata} from '../../../actions/traineeAction';
import './portal.css';

function Instruction(props) {
    return (
        <div>
            <div className="instaruction-page-wrapper">
                <div className="instruction-page-inner">
                    <h2>Hướng dẫn chung:</h2>
                    <h4>1. Tất cả các câu hỏi là bắt buộc.</h4>
                    <h4>2. Bạn có thể đánh dấu bất kỳ câu hỏi nào.</h4>
                    <h4>3. Câu trả lời có thể được cập nhật bất cứ lúc nào trước khi hết giờ.</h4>
                    <h4>4. Bài kiểm tra này có giới hạn thời gian, đồng hồ đếm ngược trên bảng điều khiển bên phải.</h4>
                    <h4>5. Click vào 'Kết thúc kiểm tra' để nộp bài trước khi hết giờ. </h4>
                    <h4>6. Bài làm sẽ tự động được nộp khi đồng hồ đếm về 0.</h4>
                <h4><b>Lưu ý :</b>Để lưu câu trả lời, click vào nút 'Lưu & tiếp tục'.</h4>
                    <div className="proceed-to-test-button">
                        <Button style={{float:'right'}} type="primary" icon="caret-right" onClick={()=>{props.ProceedtoTest(props.trainee.testid,props.trainee.traineeid,()=>{props.fetchTestdata(props.trainee.testid,props.trainee.traineeid)})}}  loading={props.trainee.proceedingToTest}>
                            Vào kiểm tra
                        </Button>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    trainee : state.trainee
});




export default connect(mapStateToProps,{
    ProceedtoTest,
    fetchTestdata
})(Instruction);