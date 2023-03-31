let QuestionModel = require("../models/questions");
let options = require("../models/option");
let tool = require("./tool");



let createQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        req.check('body', `Câu hỏi không hợp lệ!`).notEmpty();
        req.check('subject', 'Chọn môn!').notEmpty();
        var errors = req.validationErrors()
        if(errors){
            res.json({
                success : false,
                message : 'Dữ liệu nhập vào không hợp lệ',
                errors : errors
            })
        }
        else {
            var body =  req.body.body;
            var option =  req.body.options;
            var quesimg =  req.body.quesimg;
            var difficulty =  req.body.difficulty;
            var subjectid = req.body.subject;
            var anscount = 0;
            var weightage = req.body.weightage;
            option.map((d,i)=>{
                if(d.isAnswer){
                    anscount=anscount+1;
                }
            })
            console.log(anscount);
            var explanation = req.body.explanation;
                QuestionModel.findOne({ body : body,status:1 },{status:0})
                .then((info)=>{
                    if(!info){
                        options.insertMany(option,(err,op)=>{
                            if(err){
                                console.log(err);
                                res.status(500).json({
                                    success : false,
                                    message : "Không thể tạo câu hỏi!"
                                })
                            }
                            else{
                                var ra=[];
                                console.log(op)
                                op.map((d,i)=>{
                                    if(d.isAnswer){
                                        ra.push(d._id)
                                    }
                                })
                                var tempdata = QuestionModel({
                                    body: body,
                                    explanation : explanation,
                                    quesimg : quesimg,
                                    subject : subjectid,
                                    difficulty :difficulty,
                                    options:op,
                                    createdBy : req.user._id,
                                    anscount:anscount,
                                    weightage : weightage,
                                    rightAnswers:ra
                                })
                                tempdata.save().then(()=>{
                                    res.json({
                                        success : true,
                                        message : `Tạo câu hỏi thành công!`
                                    })
                                }).catch((err)=>{
                                    console.log(err);
                                    res.status(500).json({
                                        success : false,
                                        message : "Không thể tạo câu hỏi!"
                                    })
                                })
                            }
                        })
                    }
                    else{
                        res.json({
                            success : false,
                            message : `Câu hỏi này đã tồn tại!`
                        })
                    }   

                })
            
        }
        
    }

    else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })
    }
}


let deleteQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var _id =  req.body._id;
        QuestionModel.findOneAndUpdate({
            _id : _id
        },
        {
            status : 0

        }).then(()=>{
            res.json({
                success: true,
                message :  "Đã xoá câu hỏi"
            })
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Không thể xoá"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })
    } 
}


let getAllQuestions = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var subject = req.body.subject;
        if(subject.length!==0){
            QuestionModel.find({subject : subject,status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Không thể lấy dữ liệu"
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Thành công`,
                        data : question
                    })
                }
            })        

        }
        else{
            QuestionModel.find({status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Không thể lấy dữ liệu"
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Thành công`,
                        data : question
                    })
                }
            })        
        }
        }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })
    } 
}   
 




let getSingleQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        let _id = req.params._id;
        console.log(_id);
        QuestionModel.find({_id : _id , status : 1},{status : 0})
        .populate('subject', 'topic')
        .populate('options')
        .exec(function (err, question) {
            if (err){
                console.log(err)
                res.status(500).json({
                    success : false,
                    message : "Không thể lấy dữ liệu"
                })
            }
            else{
                if(question.length===0){
                    res.json({
                        success : false,
                        message : `Không tồn tại`,
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Thành công`,
                        data : question
                    })
                }   
            }
        })        
    }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })
    }    
}
 
//create test papers

module.exports = { createQuestion, getAllQuestions, getSingleQuestion, deleteQuestion}







