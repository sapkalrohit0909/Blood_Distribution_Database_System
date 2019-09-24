const express = require("express");
const router = express.Router();
const query = require("../dbConnection");

router.post("/createCamp", async (req, res) => {
  let inventory_id = req.body.inventory_id;
  let camp_name = req.body.camp_name;
  let date = req.body.date;
  var queryCreateCamp = `insert into donation_camp (camp_name,date)values
  ('${camp_name}','${date}')`;
  let resultCamp = await query(queryCreateCamp);
  console.log("Campi_id", resultCamp.insertId);
  var conductsAdd = `insert into conducts (bank_code,camp_id,inventory_id)values
  (1,${resultCamp.insertId},${inventory_id})`;
  console.log(conductsAdd);
  let resultConductsAdd = await query(conductsAdd);
  console.log("inserted into conducts");
  let Blood_groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  for (let i = 0; i < Blood_groups.length; i++) {
    var campCpllection = `insert into camp_collection values
  (${resultCamp.insertId},'${Blood_groups[i]}',0,False)`;
    let campQ = await query(campCpllection);
  }
  if (resultCamp.length == 0) {
    res.json(resultCamp);
    return;
  } else {
    res.json([{ message: "Donation Camp created!" }]);
  }
});



router.get("/report/:id", async (req, res) => {
  let bank_id = req.params.id;
  var queryString = `select blood_group,quantity 
                    from blood_bank bank inner join blood_bank_storage storage on bank.bank_code=storage.bank_code 
                    where bank.bank_code=${bank_id}`;

  let result = await query(queryString);
  if (result.length == 0) {
    // res.status(404).send('Blood Bank with given id does not exists');
    res.json([]);
    return;
  }
  res.send(result);
});

module.exports = router;
