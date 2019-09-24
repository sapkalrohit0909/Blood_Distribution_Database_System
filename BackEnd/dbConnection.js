const mysql=require('mysql');
const util = require('util');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'blood_bank_project'
  });

  connection.connect((err)=>{
    if(err){
        console.log('Failed to connect to database',err);
    }
    else{
        console.log('Connected to databse successfully');
    }
});
const query = util.promisify(connection.query).bind(connection);

module.exports=query;