const express=require('express');
const router = express.Router();
const query=require('../dbConnection');


router.get('/report/:id',async(req,res)=>{
    let inventory_id=req.params.id;
    var queryString=`select location,blood_group,quantity 
                    from blood_inventory inventory inner join blood_inventory_storage storage on inventory.inventory_id=storage.inventory_id 
                    where inventory.inventory_id=${inventory_id}`;
    let result=await query(queryString);
    if(result.length==0){
        let result1=[];
        res.status(404).json(result1);
        return;
    }
    res.json(result);
});

router.post("/transfer/:inventoryId/:campId",async (req,res)=>{
    inventoryId=req.params.inventoryId;
    campId=req.params.campId;
    let queryString="select * from blood_inventory where inventory_id="+inventoryId;
    let result=await query(queryString);
    if(result.length==0){
        res.json([{"message":"Incorrect inventory ID"}]);
    }else{
        queryString="select inventory_id from conducts where camp_id="+campId;
        result=await query(queryString);
        if(result.length==0){
            res.json([{"message":"Incorrect Camp ID"}]);
        }else{
            if(result[0]["inventory_id"]==inventoryId){
                // res.send("matched");
                queryString="select isTransfered from camp_collection where camp_id="+campId;
                result=await query(queryString);
                if(result[0]["isTransfered"]){
                    res.json([{"message":"BLOOD is already transfered...No blood present in this camp collection"}]);
                }else{
                    queryString="update camp_collection set isTransfered=True where camp_id="+campId;
                    result=await query(queryString);
                    queryString="select distinct(blood_group) from camp_collection where camp_id="+campId;
                    result=await query(queryString);

                    for(let i=0;i<result.length;i++){
                        queryString="select quantity from camp_collection where camp_id="+campId+" and blood_group='"+result[i]["blood_group"]+"'";
                        let result1=await query(queryString);
                        queryString="update blood_inventory_storage set quantity=quantity+"+result1[0]["quantity"]+" where inventory_id="+inventoryId+" and blood_group='"+result[i]["blood_group"]+"'";
                        result1=await query(queryString);
                    }
                    res.json([{"message":"Blood successfully transfered to the bank"}]);
                }
            }else{
                res.json([{"message":"This camp is not for the given inventory..We cant give you blood of this camp"}]);
            }
        }    
    }
})


module.exports=router;