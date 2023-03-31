let QuestionModel = require("../models/questions");
let TestPaperModel = require("../models/testpaper");
let TraineeEnterModel = require("../models/trainee");
let tool = require("./tool");
let options = require("../models/option");
let SubjectModel = require("../models/subject");
let result  =require("../services/excel").result;
let ResultModel = require("../models/results");


let createEditTest = (req,res,next)=>{
    var _id = req.body._id || null;
    if(req.user.type==='TRAINER'){
    req.check('type', `Kiểu không hơp lệ`).notEmpty();
    req.check('title', 'Nhập tiêu đề').notEmpty();
    req.check('questions', 'Nhập câu hỏi').notEmpty();

    var errors = req.validationErrors()
    if(errors){
        res.json({
            success : false,
            message : 'Không hợp lệ',
            errors : errors
        })
    }
    else {
        var title =  req.body.title;
        var questions = req.body.questions;
        if(_id!=null){
            TestPaperModel.findOneAndUpdate({
                _id : _id,
            },
            {
                title : title,
                questions : questions
            }).then(()=>{
                res.json({
                    success: true,
                    message :  "Đã cập nhật đề!"
                })
            }).catch((err)=>{
                res.status(500).json({
                    success : false,
                    message : "Không thể cập nhật!"
            })
        })
      }
    else{
        var type =  req.body.type;
        var title =  req.body.title;
        var questionsid =  req.body.questions;
        var difficulty =  req.body.difficulty || null;
        var organisation = req.body.organisation;
        var duration = req.body.duration;
        var subjects = req.body.subjects;
        
            TestPaperModel.findOne({ title : title,type : type,testbegins : 0 },{status:0})
            .then((info)=>{
                if(!info){
                    var tempdata = TestPaperModel({
                        type: type,
                        title : title,
                        questions : questionsid,
                        difficulty : difficulty,
                        organisation : organisation,
                        duration :duration,
                        createdBy : req.user._id,
                        subjects : subjects,
                    
                    })
                    tempdata.save().then((d)=>{
                        res.json({
                            success : true,
                            message : `Đã tạo đề thành công!`,
                            testid : d._id
                        })
                    }).catch((err)=>{
                        console.log(err);
                        res.status(500).json({
                            success : false,
                            message : "Không thể tạo!"
                        })
                    })
                }
                else{
                    res.json({
                        success : false,
                        message : `Đã tồn tại!`
                    })
                }   

            })
        
        }
     }
  }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })

    }
}

let getSingletest = (req,res,next)=>{
    let id = req.params._id;
    console.log(id);
    TestPaperModel.find({_id: id,status : 1},{createdAt: 0, updatedAt : 0,status : 0})
    .populate('createdBy', 'name')
    .populate('questions' , 'body')
    .populate({
        path: 'subjects',
        model : SubjectModel
    })
    .populate({ path: 'questions', 
        populate: {  
            path: 'options',
            model: options,
        }
    })
    .exec(function (err, testpaper) {
        if (err){
            console.log(err)
            res.status(500).json({
                success : false,
                message : "Không thể tải dữ liệu"
            })
        }
        else{
            res.json({
                success : true,
                message : `Thành công`,
                data : testpaper
            })   
        }
    })        
}

let getAlltests = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var title = req.body.title;
            TestPaperModel.find({createdBy : req.user._id,status : 1},{status : 0})
            .sort({ "createdAt": -1 })
            .populate('questions' , 'body')
            .populate({
                path: 'subjects',
                model : SubjectModel
            })
            .populate({ path: 'questions', 
            populate: {  
                path: 'options',
                model: options
            }

        })
        
            .exec(function (err, testpaper) {
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
                        data : testpaper
                    })
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

let deleteTest = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var _id =  req.body._id;
        TestPaperModel.findOneAndUpdate({
            _id : _id
        },
        {
            status : 0

        }).then(()=>{
            res.json({
                success: true,
                message :  "Câu hỏi đã xoá"
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
let TestDetails = (req,res,next)=>{
    if(req.user.type === 'TRAINER'){
        let testid = req.body.id;
        TestPaperModel.findOne({_id:testid,createdBy : req.user._id},{isResultgenerated:0,isRegistrationavailable:0,createdBy:0,status:0,testbegins:0,questions : 0})
        .populate('subjects', 'topic')
        .exec(function(err,TestDetails){
                if(err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Không thể tải dữ liệu"
                    })
                }else{
                    if(!TestDetails){
                        res.json({
                            success : false,
                            message : 'Test id không hợp lệ.'
                        })
                    }else{
                        res.json({
                            success : true,
                            message : 'Thành công',
                            data : TestDetails
                        })

                    }
                }
        })
    }else{
        res.status(401).json({
            success : false,
            message : "Lỗi quyền!"
        })
    }
}

let basicTestdetails = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        let testid = req.body.id;
        TestPaperModel.findById(testid,{questions:0})
        .populate('createdBy', 'name')
        .populate('subjects', 'topic')
        .exec(function (err, basicTestdetails){
            if(err){
                console.log(err)
                res.status(500).json({
                    success : false,
                    message : "Không thể lấy dữ liệu"
                })
            }
            else{
                if(!basicTestdetails){
                    res.json({
                        success : false,
                        message : 'Test id không hợp lệ.'
                    })

                }
                else{
                    res.json({
                        success : true,
                        message : 'Thành công',
                        data : basicTestdetails
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

 let getTestquestions = (req,res,next)=>{
     if(req.user.type==="TRAINER"){
         var testid = req.body.id;
         TestPaperModel.findById(testid,{type:0,title:0,subjects:0,duration:0,organisation:0,difficulty:0,testbegins:0,status:0,createdBy:0,isRegistrationavailable:0})
        .populate('questions','body')
        .populate({ 
          path: 'questions',
          model: QuestionModel,
          select : {'body': 1,'quesimg' : 1,'weightage':1,'anscount': 1},
            populate: {  
                path: 'options',
                model: options
            }

    })
        .exec(function (err, getTestquestions){
            if(err){
                console.log(err)
                res.status(500).json({
                    success : false,
                    message : "Không thể lấy dữ liệu"
                })
            }
            else{
                if(!getTestquestions){
                    res.json({
                        success : false,
                        message : 'Test id không hợp lệ.'
                    })

                }
                else{
                    res.json({
                        success : true,
                        message : 'Thành công',
                        data : getTestquestions.questions
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

 let getCandidateDetails = (req,res,next)=>{
    if(req.user.type==="TRAINER"){
        var testid = req.body.testid;
       ResultModel.find({testid : testid},{score : 1, userid : 1})
       .populate('userid')
       .exec(function(err,getCandidateDetails){
        if(err){
            console.log(err)
            res.status(500).json({
                success : false,
                message : "Không thể lấy dữ liệu"
            })
        }else{
            if(getCandidateDetails.length==null){
                res.json({
                    success : false,
                    message: 'Test id không hợp lệ!'
                })
            }else{
                res.json({
                    success : true,
                    message:'Thông tin chi tiết',
                    data : getCandidateDetails
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


 let getCandidates = (req,res,next)=>{
    if(req.user.type==="TRAINER"){
        var testid = req.body.id;
        TraineeEnterModel.find({testid:testid},{testid:0})
        .then((getCandidates)=>{
            res.json({
                success: true,
                message :  "Thành công",
                data : getCandidates
            })
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Không thể lấy dữ liệu!"
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

 let beginTest = (req,res,next)=>{
    if(req.user.type==="TRAINER"){
        var id = req.body.id;
        TestPaperModel.findOneAndUpdate({_id:id,testconducted : false},{testbegins:1,isRegistrationavailable:0},{new: true})
        .then((data)=>{
            if(data){
                res.json({
                    success : true,
                    message : 'Bài kiểm tra đã bắt đầu.',
                    data : {
                        isRegistrationavailable: data.isRegistrationavailable,
                        testbegins : data.testbegins,
                        testconducted : data.testconducted,
                        isResultgenerated : data.isResultgenerated
                    }
                })
            }
            else{
                res.json({
                    success : false,
                    message : "Không thể bắt đầu."
                })
            }
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Lỗi server"
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

 let endTest = (req,res,next)=>{
    if(req.user.type==="TRAINER"){
        var id = req.body.id;
        TestPaperModel.findOneAndUpdate({_id:id,testconducted:0,testbegins:1,isResultgenerated:0},{testbegins:false,testconducted:true, isResultgenerated:true},{
            new: true
          })
        .then((info)=>{
            if(info){
                console.log(info);
                result(id,MaxMarks).then((sheet)=>{
                    res.json({
                        success : true,
                        message : 'Bài kiểm tra đã kết thúc.',
                        data : {
                            isRegistrationavailable : info.isRegistrationavailable,
                            testbegins : info.testbegins,
                            testconducted : info.testconducted,
                            isResultgenerated : info.isResultgenerated
                        }
                    })
                }).catch((error)=>{
                    console.log(error)
                    res.status(500).json({
                        success : false,
                        message : "Lỗi máy chủ"
                    })
                })
            }
            else{
                res.json({
                    success : false,
                    message : "Dữ liệu nhập vào không hợp lệ!"
                })
            }  
           
        }).catch((err)=>{
            console.log(err)
            res.status(500).json({
                success : false,
                message : "Lỗi máy chủ"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Không được cấp quyền!"
        })
    }
 }

 let MaxMarks = (testid)=>{
    return new Promise((resolve,reject)=>{
        TestPaperModel.findOne({_id:testid},{questions:1})
        .populate({
            path : 'questions',
            model : QuestionModel,
            select : {'weightage' : 1}
        })
        .exec(function(err,Ma){
            if(err){
                console.log(err)
                reject(err)
            }else{
                if(!Ma){
                    reject(new Error('Test id không hợp lệ'))
                }else{
                    let m = 0;
                    Ma.questions.map((d,i)=>{
                        m+=d.weightage;
                    })
                    console.log(m)
                    resolve(m)
                }
            }
        })

    })
}

let MM = (req,res,next)=>{
    var testid = req.body.testid;
    if(req.user.type === 'TRAINER'){
        MaxMarks(testid).then((MaxM)=>{
            res.json({
                success : true,
                message : 'Điểm tối đa',
                data : MaxM
            })
        }).catch((error)=>{
            res.status(500).json({
                success:false,
                message:"Không thể tải điểm",
            })
        })
    }else{
        res.status(401).json({
            success : false,
            message : "Không được cấp quyền!"
        })
    }
}
 
let checkTestName =(req,res,next)=>{
    var testName = req.body.testname;
    if(req.user.type === 'TRAINER'){
        TestPaperModel.findOne({title:testName},{_id:1}).then((data)=>{
            if(data){
                res.json({
                    success:true,
                    can_use:false
                })
            }
            else{
                res.json({
                    success:true,
                    can_use:true
                })
            }
        }).catch((error)=>{
            console.log(error);
            res.status(500).json({
                success:false,
                message:"Lỗi máy chủ"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Không được cấp quyền!"
        })
    }
}
 

 
 

module.exports = {checkTestName,createEditTest,getSingletest,getAlltests,deleteTest,MaxMarks,MM,getCandidateDetails,basicTestdetails,TestDetails,getTestquestions,getCandidates,beginTest,endTest}