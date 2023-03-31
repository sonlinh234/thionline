//view all subjects and single subject
let SubjectModel = require("../models/subject");


let createEditsubject = (req,res,next)=>{
    var _id = req.body._id || null;
    if(req.user.type==='ADMIN'){
    req.check('topic', `Môn không hợp lệ`).notEmpty();
    var errors = req.validationErrors()
    if(errors){
        res.json({
            success : false,
            message : 'Đầu vào không hợp lệ',
            errors : errors
        })
    }
    else {
        var topic =  req.body.topic;
        if(_id!=null){
            SubjectModel.findOneAndUpdate({
                _id : _id,

            },
            {
                topic : topic,
            }).then(()=>{
                res.json({
                    success: true,
                    message :  "Sửa tên môn thành công"
                })
            }).catch((err)=>{
                res.status(500).json({
                    success : false,
                    message : "Không thể đổi tên môn"
            })
        })

    }
        else{   
            SubjectModel.findOne({topic : topic}).then((info)=>{
                if(!info){
                    var tempdata = SubjectModel({
                        topic : topic,
                        createdBy : req.user._id
                    })
                    tempdata.save().then(()=>{
                        res.json({
                            success : true,
                            message : `Môn đã được tạo thành công!`
                        })
                    }).catch((err)=>{
                        console.log(err);
                        res.status(500).json({
                            success : false,
                            message : "Không thể tạo môn!"
                        })
                    })
                }
                else{
                    res.json({
                        success : false,
                        message : `Môn đã có trên hệ thống!`
                    })
                }   

            })
        }
    }
  }


    else{
        res.status(401).json({
            success : false,
            message : "Lỗi phân quyền!"
        })

    }
}




            

let getAllSubjects = (req,res,next)=>{
    SubjectModel.find({status : 1},{createdAt: 0, updatedAt : 0})
    .populate('createdBy', 'name')
    
    .exec(function (err, subject) {
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
                data : subject
            })   
        }
    })        

}

let getSingleSubject = (req,res,next)=>{
    let id = req.params._id;
    console.log(id);
    SubjectModel.find({_id: id},{createdAt: 0, updatedAt : 0,status : 0})
    .populate('createdBy', 'name')
    .exec(function (err, subject) {
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
                data : subject
            })   
        }
    })        
}

    module.exports = { createEditsubject ,getAllSubjects, getSingleSubject}
    
