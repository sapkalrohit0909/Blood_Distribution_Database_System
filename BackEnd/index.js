const express=require('express');
const app=express();
const receiver=require('./routes/receiver');
const blood_bank=require('./routes/blood_bank');
const blood_inventory=require('./routes/blood_inventory');
const donar=require('./routes/donar');
const blood_camp=require('./routes/blood_camp');

app.use(express.json());
app.use(express.urlencoded());
app.use('/api/receiver',receiver);
app.use('/api/bloodbank',blood_bank);
app.use('/api/donar',donar);
app.use('/api/bloodinventory',blood_inventory);
app.use('/api/bloodcamp',blood_camp);


app.listen(3000,(err)=>{
    if(err){
        console.log("failed to start serevr");
    }else{
        console.log('Server started succcesfully')
    }
});


