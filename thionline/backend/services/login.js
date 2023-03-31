let UserModel = require("../models/user");
var passport = require("../services/passportconf");
var jwt = require('jsonwebtoken');
var config = require('config');




let userlogin = (req,res,next)=>{
    req.check('emailid', ` Email không hợp lệ`).isEmail().notEmpty();
    req.check('password','Mật khẩu không hợp lệ').isLength({min : 5,max :6});
    var errors = req.validationErrors()
    if(errors){
        res.json({
            success : false,
            message : 'Dữ liệu không hợp lệ',
            errors : errors
        })
    }else{
        passport.authenticate('login',{session:false},(err,user,info)=>{
            if(err || !user){
               res.json(info);
            }
            else{
                req.login({_id:user._id}, {session: false}, (err) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: "Lỗi máy chủ"
                        });
                    }
        
                    var token = jwt.sign({_id:user._id},config.get('jwt.secret'),{expiresIn: 5000000});
                    res.json({
                        success: true,
                        message: "Đăng nhập thành công",
                        user: {
                            name : user.name,
                            type: user.type,
                            _id : user._id,
                            emailid : user.emailid,
                            contact : user.contact
                        },
                        token: token
                    });
                });
            }
            })(req,res,next);     
    }
        
}



     
module.exports = { userlogin };

