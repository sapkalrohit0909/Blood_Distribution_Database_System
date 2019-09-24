const express = require("express");
const router = express.Router();
const query = require("../dbConnection");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;

var yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
var today = yyyy + "-" + mm + "-" + dd;

router.get("/history/:id", async (req, res) => {
  let receiver_id = req.params.id;

  let queryString = `select receiver_name,receiver_address,rec.blood_group,age,sex,bank_name,bank_address,history.blood_group,quantity,date
  from receiver rec inner join history_table history on  rec.receiver_id=history.receiver_id
  inner join blood_bank bank on bank.bank_code=history.bank_code 
  where rec.receiver_id=${receiver_id}`;
  let result = await query(queryString);
  if (result.length == 0) {
    let result1=[];
    res.json(result);
    // res.status(404).send("The receiver with given id does not found!!");
    return;
  }else{
    console.log("inside else");
  // res.send(result);
    res.json(result);
  }
  
});

router.post("/fulfill/:id/:type/:qty", async (req, res) => {
  let receiver_id = req.params.id;
  let blood_group = req.params.type;
  let quantity = req.params.qty;

  //Inserting to history_table


  try {
    let queryStringH = `insert into history_table values(${receiver_id},1,"${blood_group}",${quantity},"${today}")`;
    let fulfill_resultH = await query(queryStringH);
  } catch (error) {
    let result1=[];
    res.json(result1);
    return;
  }
  
  //checking and fulfilling req quantity from bank_storage
  let original_req_qty = quantity;
  var flag = false;
  let queryStringBQ = `select quantity from blood_bank_storage where blood_group="${blood_group}"`;
  let bank_qty = await query(queryStringBQ);
  if (quantity <= bank_qty[0].quantity) {
    bank_qty[0].quantity = bank_qty[0].quantity - quantity;
    console.log("current qty", bank_qty[0].quantity);
    let queryStringBU = `update blood_bank_storage set quantity=${
      bank_qty[0].quantity
    } where blood_group='${blood_group}'`;
    let up_bank_qty = await query(queryStringBU);
  } else {
    quantity = quantity - bank_qty[0].quantity;
    let queryStringBU1 = `update blood_bank_storage set quantity=0
   where blood_group='${blood_group}'`;
    let up_bank_qty1 = await query(queryStringBU1);
    for (let i = 1; i <= 4; i++) {
      let queryStringInv = `select quantity from blood_inventory_storage join blood_inventory on  blood_inventory_storage.inventory_id=blood_inventory.inventory_id where isNearby=${i} and blood_group="${blood_group}"`;
      let invCheckQ = await query(queryStringInv);
      if (quantity <= invCheckQ[0].quantity) {
        invCheckQ[0].quantity = invCheckQ[0].quantity - quantity;
        flag = true;
        let queryStringBU = `update blood_inventory join blood_inventory_storage on blood_inventory_storage.inventory_id=blood_inventory.inventory_id set quantity=${
          invCheckQ[0].quantity
        } where isNearby=${i} and blood_group='${blood_group}'`;
        let up_inv_qty = await query(queryStringBU);
        console.log("Inv  --", i);
        break;
      } else {
        quantity = quantity - invCheckQ[0].quantity;

        let queryStringBUP = `update blood_inventory join blood_inventory_storage on blood_inventory_storage.inventory_id=blood_inventory.inventory_id set quantity=0 where isNearby=${i} and blood_group='${blood_group}'`;
        let up_inv_qty_up = await query(queryStringBUP);
      }
    }
    if (flag) {
      console.log("inside if");
      let result1=[];
      result1[0]={"message":"Your request is fullfilled."};
      res.json(result1);
      return;
      // res.send(
      //   "Receiver request is fulfilled and updated in receiver history table"
      // );
    } else {
      console.log("else");
      let result1=[];
      res.json(result1);
      return;
      // res.send("Can't ful fill");
    }
  }
  console.log("inside api");
  let result=[];
  result[0]={"message":"Your request is fullfilled."};
  res.json(result);
  return;
  // res
  //   .status(200)
  //   .send(
  //     "Updated receiver details in receiver, history and emergency contact tables"
  //   );
});

router.get("/getblood/:type/:qty", async (req, res) => {
  let blood_group = req.params.type;
  let qty = req.params.qty;
  let queryString = `select quantity from blood_bank_storage where blood_group="${blood_group}"`;
  let result = await query(queryString);
  let originalQty = qty;
  var flag = false;
  if (result.length == 0) {
    let result1=[];
    res.json(result1);
    // res
    //   .status(404)
    //   .send("We don't have enough Quantity to fulfill this request!!");
    return;
  }
  if (qty <= result[0].quantity) {
    result[0].quantity = Math.abs(result[0].quantity - qty); // SHould be reduced in the bank storge
    console.log("Available bankstorage", qty);
    let result1=[]
    result1[0]={"message":"We have enough Quantity to fulfill this request from bank!!"}
    res.json(result1);
    // res.send("We have enough Quantity to fulfill this request from bank!!");
  } else {
    qty = qty - result[0].quantity;
    for (let i = 1; i <= 4; i++) {
      let queryStringInv = `select quantity from blood_inventory_storage join blood_inventory on  blood_inventory_storage.inventory_id=blood_inventory.inventory_id where isNearby=${i} and blood_group="${blood_group}"`;
      let invCheckQ = await query(queryStringInv);
      if (qty <= invCheckQ[0].quantity) {
        console.log("Fulfilled from inv:::", i);
        flag = true;
        break;
      } else {
        console.log("Qty befor", qty);
        qty = qty - invCheckQ[0].quantity;
        console.log("Qty After inv", qty, "inv ", i);
      }
    }
    if (flag) {
      // res.send("We can ful fill this request");
      let result=[];
      result[0]={"message":"We can full fill this request"}
      res.json(result);
    } else {
      let result=[];
      // res.send("We Can't ful fill this request");
      res.json(result);
    }
  }
});
router.post("/fulfill", async (req, res) => {
  let receiver_name = req.body.receiver_name;
  let receiver_address = req.body.receiver_address;
  let blood_group = req.body.blood_group;
  let age = req.body.age;
  let sex = req.body.sex;
  let bank_code = req.body.bank_code;
  let quantity = req.body.quantity;
  let number = req.body.number;
  let number1 = req.body.number1;
  //Inserting to receiver
  let queryString = `insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("${receiver_name}","${receiver_address}","${blood_group}",${age},"${sex}")`;
  let fulfill_result = await query(queryString);
  console.log("fulfill_result", fulfill_result.insertId);
  if (fulfill_result.affectedRows == 1) {
    //Inserting to history_table
    let queryStringH = `insert into history_table values(${
      fulfill_result.insertId
    },${bank_code},"${blood_group}",${quantity},"${today}")`;
    let fulfill_resultH = await query(queryStringH);
    //Inserting to emergency_contact 1
    let queryStringE = `insert into emergency_contact values(${
      fulfill_result.insertId
    },${number})`;
    let fulfill_resultE = await query(queryStringE);
    //Inserting to emergency_contact 2
    let queryStringE1 = `insert into emergency_contact values(${
      fulfill_result.insertId
    },${number1})`;
    let fulfill_resultE1 = await query(queryStringE1);
    //checking and fulfilling req quantity from bank_storage
    let original_req_qty = quantity;
    var flag = false;
    let queryStringBQ = `select quantity from blood_bank_storage where blood_group="${blood_group}"`;
    let bank_qty = await query(queryStringBQ);
    if (quantity <= bank_qty[0].quantity) {
      bank_qty[0].quantity = bank_qty[0].quantity - quantity;
      console.log("current qty", bank_qty[0].quantity);
      let queryStringBU = `update blood_bank_storage set quantity=${
        bank_qty[0].quantity
      } where blood_group='${blood_group}'`;
      let up_bank_qty = await query(queryStringBU);
    } else {
      quantity = quantity - bank_qty[0].quantity;
      let queryStringBU1 = `update blood_bank_storage set quantity=0
     where blood_group='${blood_group}'`;
      let up_bank_qty1 = await query(queryStringBU1);
      for (let i = 1; i <= 4; i++) {
        let queryStringInv = `select quantity from blood_inventory_storage join blood_inventory on  blood_inventory_storage.inventory_id=blood_inventory.inventory_id where isNearby=${i} and blood_group="${blood_group}"`;
        let invCheckQ = await query(queryStringInv);
        if (quantity <= invCheckQ[0].quantity) {
          invCheckQ[0].quantity = invCheckQ[0].quantity - quantity;
          flag = true;
          let queryStringBU = `update blood_inventory join blood_inventory_storage on blood_inventory_storage.inventory_id=blood_inventory.inventory_id set quantity=${
            invCheckQ[0].quantity
          } where isNearby=${i} and blood_group='${blood_group}'`;
          let up_inv_qty = await query(queryStringBU);
          console.log("Inv  --", i);
          break;
        } else {
          quantity = quantity - invCheckQ[0].quantity;

          let queryStringBUP = `update blood_inventory join blood_inventory_storage on blood_inventory_storage.inventory_id=blood_inventory.inventory_id set quantity=0 where isNearby=${i} and blood_group='${blood_group}'`;
          let up_inv_qty_up = await query(queryStringBUP);
          console.log("Inv else filled --", i);
        }
      }
      if (flag) {
        let result=[];
        result[0]={"message":"Receiver request is fulfilled"}
        // res.send("Receiver request is fulfilled");
        res.json(result);
      } else {
        let result=[];
        // res.send("Receiver request can not be fulfilled");
        res.json(result);
      }
    }
    let result=[]
    result[0]={"message":"Updated receiver details in receiver, history, emergency contact and updated the corresponding inventory tables"};
    // res
    //   .status(200)
    //   .send(
    //     "Updated receiver details in receiver, history, emergency contact and updated the corresponding inventory tables"
    //   );
    res.json(result);
  } else {
    let result=[]
    // res.send("OOPS");
    res.json(result);
  }
});

module.exports = router;
