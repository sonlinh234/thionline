var mongoose = require("mongoose");
var config = require('config');
let tool = require("./tool")



//database connection
mongoose.Promise = global.Promise;
const options = {
  autoIndex: false,
  maxPoolSize: 10
};

mongoose.connect(config.get('mongodb.connectionString'),options).then(()=>{
    console.log("da ket noi mongoDB");
    //tool.createadmin();
}).catch((err)=>{
    console.log("Loi ket noi database",err);
})


module.exports=mongoose;