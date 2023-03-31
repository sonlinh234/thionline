let TestPaperModel = require("../models/testpaper");
const appRoot = require("app-root-path");
let FeedbackModel=require("../models/feedback");

let stopRegistration = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        
        var id  =  req.body.id;
        var s = req.body.status;
        TestPaperModel.findById(id,{testbegins:1,testconducted:1}).then((d)=>{
            if(d){
                if(d.testbegins!=true && d.testconducted!=true){
                    TestPaperModel.findOneAndUpdate({_id : id},{isRegistrationavailable : s})      
                    .exec(function (err){
                        if (err){
                            console.log(err)
                            res.status(500).json({
                                success : false,
                                message : "Không thể thay đổi trạng thái đăng ký"
                            })
                        }
                        else{
                            res.json({
                                success : true,
                                message : `Đã thay đổi trạng thái đăng ký!`,
                                currentStatus : s
                            })       
                        }
                    })
                }
                else{
                    res.json({
                        success : false,
                        message : "Không thể thay đổi trạng thái đăng ký"
                    })
                }
            }
            else{
                res.status(500).json({
                    success : false,
                    message : "Không thể thay đổi trạng thái đăng ký"
                })
            }

        }).catch((e)=>{
            console.log(e);
            res.status(500).json({
                success : false,
                message : "Không thể thay đổi trạng thái đăng ký"
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
/*
let Download = (req,res,next)=>{
    var testid = req.body.id;
    if(req.user.type === 'TRAINER'){
        const file = `${appRoot}/public/result/result-${testid}.xlsx`;
        res.download(file);
    }else{
       res.status(401).json({
           success : false,
           message : "Không được cấp quyền!"
       })
    }

}
*/
let Download = (req,res,next)=>{
    var testid = req.body.id;
    if(req.user.type === 'TRAINER'){
        const file = `${req.protocol + '://' + req.get('host')}/result/result-${testid}.xlsx`;
        res.json({
            success : true,
            message : 'File sent successfully',
            file :file
        })
    }else{
       res.status(401).json({
           success : false,
           message : "Không được cấp quyền!"
       })
    }

}




let getFeedBack =(req,res,next)=>{
    var testid = req.body.testid;
    if(req.user.type === 'TRAINER'){
        FeedbackModel.find({testid:testid})
        .populate('userid')
        .exec((err,data)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success:false,
                    message:"Lỗi máy chủ"
                })
            }
            else{
                res.json({
                    success:true,
                    message:"Đã gửi phản hồi",
                    data:data
                })
            } 
        })
    }else{
       res.status(401).json({
           success : false,
           message : "Không được cấp quyền!"
       })
    }
}

module.exports = {stopRegistration,Download,getFeedBack}