const express=require('express');
const router = express.Router();
const query=require('../dbConnection');


router.post('/bloodbank/donar',async(req,res)=>{
    let donar_name=req.body.donar_name;
    let email=req.body.email;
    let donar_address=req.body.donar_address;
    let blood_group=req.body.blood_group;
    let quantity=req.body.quantity;
    let camp_id=req.body.camp_id;//camp_id should exist in donation_camp table//
    //donar should donate blood to a donation camp which is conducted by the blood inventory//
    let queryString=`select * from donar where email="${email}"`;
    let donar_result=await query(queryString);
    if(donar_result.length==0){
        let insertIntoDonarQueryString=`insert into donar(email,donar_address,blood_group,donar_name) values("${email}","${donar_address}","${blood_group}","${donar_name}")`;
        let result=await query(insertIntoDonarQueryString);
        let insertIntoDonatesToCamp=`insert into donates_to_camp(donar_id,camp_id,quantity) 
                                    select ${result.insertId} as donar_id,${camp_id} as camp_id,${quantity} as quantity from donation_camp 
                                    where camp_id='${camp_id}')`;
        let result_insert_into_camp=await query(insertIntoDonatesToCamp);        
        let updateCampCollection=`update camp_collection set quantity=quantity+${quantity} where blood_group='${blood_group}' and camp_id='${camp_id}')`;
        let updateCampCollection_result=await query(updateCampCollection);
        res.send("Thanks for donating blood to this Donation Camp!!!!!");
    }else{
        // 
        console.log(donar_result[0].donar_id);
        console.log("inside else");
        newdate = new Date();
        newdate = newdate.toISOString().slice(0,10);
        try{
            let insertIntoDonatesToCamp=`insert into donates_to_camp(donar_id,camp_id) select ${donar_result[0].donar_id} as donar_id,camp_id from donation_camp where date='${newdate}'`;
            console.log(insertIntoDonatesToCamp);
            let result_insert_into_donation_camp=await query(insertIntoDonatesToCamp);
        }catch{
            res.send("You cannot donate blood on the same day...Please come to this camp after 3 months");
            return;
        }
        console.log("after");
        let updateCampCollection=`update camp_collection set quantity=quantity+${quantity} where blood_group='${blood_group}' and camp_id='${camp_id}')`;
        let updateCampCollection_result=await query(updateCampCollection);
        res.send("Thanks for Donating blood to this Donation camp!!!");
    }
});








router.post('/bloodbank/',async(req,res)=>{

});
