let UserModel = require("../models/user");
let tool = require("./tool");

let trainerRegister = (req,res,next)=>{
    console.log(req.user.type);
    var _id = req.body._id || null;
    if(req.user.type==='ADMIN'){
        req.check('name', `Tên không hợp lệ`).notEmpty();
        if(_id==null){
            req.check('password','Mật khẩu không hợp lệ').isLength({min : 5,max :6});
            req.check('emailid', ` Email không hợp lệ`).isEmail().notEmpty();
        }
        req.check('contact','Số điện thoại không hợp lệ').isLength({min : 4,max :14}).isNumeric({no_symbols: false});
        var errors = req.validationErrors()
        if(errors){
            res.json({
                success : false,
                message : 'Thông tin nhập vào không hợp lệ',
                errors : errors
            })
        }
        else {
            var name =  req.body.name;
            var password = req.body.password;
            var emailid =  req.body.emailid;
            var contact = req.body.contact;
            if(_id!=null){
                UserModel.findOneAndUpdate({
                    _id : _id,
                    status : 1
                },
                { 
                    name : name,
                    contact  : contact
                }).then(()=>{
                    res.json({
                        success : true,
                        message : `Cập nhật thành công!`
                    })
                }).catch((err)=>{
                    res.status(500).json({
                        success : false,
                        message : "Không thể cập nhật thông tin"
                    })
                })
            }
            else{
                UserModel.findOne({'emailid': emailid,status:1}).then((user)=>{
                    if(!user){
                        tool.hashPassword(password).then((hash)=>{
                            var tempdata = new UserModel({
                                name : name,
                                password : hash,
                                emailid : emailid,
                                contact  : contact,
                                createdBy : req.user._id
                            })
                            tempdata.save().then(()=>{
                                res.json({
                                    success : true,
                                    message : `Thêm giáo viên thành công!`
                                })
                            }).catch((err)=>{
                                console.log(err);
                                res.status(500).json({
                                    success : false,
                                    message : "Không thể thêm giáo viên"
                                })
                            })
                        }).catch((err)=>{
                            console.log(err);
                            res.status(500).json({
                                success : false,
                                message : "Không thể thêm giáo viên"
                            })
                        })
                        
                        
                    }
                    else{
                        res.json({
                            success : false,
                            message : `Email này đã được đăng ký!`
                        })
                    }
                }).catch((err)=>{
                    res.status(500).json({
                        success : false,
                        message : "Không thể thêm giáo viên"
                    })
                }) 
            }
                       
        }
    }
    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        })
    }
}

let removeTrainer = (req,res,next)=>{
    if(req.user.type==='ADMIN'){
        var _id =  req.body._id;
        UserModel.findOneAndUpdate({
            _id : _id
        },
        {
            status : 0

        }).then(()=>{
            res.json({
                success: true,
                message :  "Tài khoản đã xoá"
            })
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Không thể xoá tài khoản"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi phân quyền!"
        })
    } 
}







let getAllTrainers = (req,res,next)=>{
    if(req.user.type==='ADMIN'){
        UserModel.find({type: 'TRAINER', status : 1},{ password: 0, type: 0,createdBy : 0,status : 0 }).then((info)=>{
            res.json({
                success : true,
                message : `Thành công`,
                data : info
            })
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Không thể lấy dữ liệu"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi phân quyền!"
        }) 
    }
}



let getSingleTrainer = (req,res,next)=>{
    if(req.user.type==='ADMIN'){
        let _id = req.params._id;
        console.log(_id);
        UserModel.find({_id : _id,status : 1},{password: 0, type: 0, createdBy : 0,status : 0}).then((info)=>{
            if(info.length === 0){
                res.json({
                    success : false,
                    message : `Tài khoản không tồn tại!`,
                
                })
            }
            else{
                res.json({
                    success : true,
                    message : `Thành công`,
                    data : info
                })

            }
           
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Không thể lấy dữ liệu"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Lỗi phân quyền!"
        })
    }    
}







module.exports = { trainerRegister, getAllTrainers, getSingleTrainer, removeTrainer }