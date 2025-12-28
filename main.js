const express = require('express');
const mysql2 = require('mysql2');

const app = express();
const port = 4000;


app.use(express.json())

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'retail_store',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log("Error connected to DB ❌");
  } else {
    console.log("Connected to DB ✅");
  }
});


// question 2:-
// -------------

app.post('/add/category', (req, res)=>{
  console.log("🔥 /add/category route hit");
      const query = `
      ALTER TABLE products
      ADD COLUMN category VARCHAR(100)
    `;

    db.execute(query, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          res.status(500).json({message: "Column already exists ⚠️"});
        } else {
          res.status(500).json({message: "Error adding column ❌", Error: err.message});

        }
      } else {
          res.status(201).json({message: "Category column added successfully ✅"});
      }
    });
})


// question 3:-
// -------------

// function deletecategory(){
//         const query = `
//       ALTER TABLE products
//       DROP COLUMN category
//       `
//     db.execute(query, (err)=>{
//         if(err){
//             console.log("Error deleting column ❌", err.message);
//         }
//         else{
//             console.log("Category column deleted successfully ✅");
//         }
//     })
// }
// deletecategory();

// question 4:-
// -------------

// function updateslides(){
//         const query = `
//         ALTER TABLE supplier
//         MODIFY COLUMN contact_number VARCHAR(15)
//         `
//         db.execute(query, (err)=>{
//             if (err) {
//                 console.log("Error updating column ❌", err.message);
//             } else {
//                 console.log("Contact number column updated successfully ✅");
//             }
//         })
// }
// updateslides();


// question 5:-
// -------------

// function addAttribute(){
//         const query = `
//         ALTER TABLE products
//         MODIFY product_name NOT NULL
//         `
//         db.execute(query, (err)=>{
//           if (err) {
//             console.log("Error adding attribute ❌", err.message);
//           } else {
//             console.log("Attribute added successfully ✅");
//           }
//         })
// }

// addAttribute();

// question 6:-
// -------------

// a:-



// function addSupplier(){
//         const sql =
//         const query = `
//         INSERT INTO supplier (supplier_name, contact_number) values ('FreshFoods', '01001234567')
//         `
//         db.execute(query, (err)=>{
//           if (err ) {
//             console.log("Error adding supplier ❌", {Error: err});
//             return;
//           }else{
//             console.log("supplier added successfuly ✅");
//           }
//         })
// }

// addSupplier();



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
