const express = require('express');
const mysql2 = require('mysql2');

const app = express();
const port = 3000;


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

app.delete('/delete/category', (req, res)=>{
          const query = `
      ALTER TABLE products
      DROP COLUMN category
      `
    db.execute(query, (err)=>{
      if (err) {
          res.status(500).json({message: "Error deleting column ❌", Error: err.message});
      } else {
          res.json({message: "Category column deleted successfully ✅"});
      }
    })
})

// question 4:-
// -------------

app.patch('/update/supplier', (req, res)=>{
          const query = `
        ALTER TABLE supplier
        MODIFY COLUMN contact_number VARCHAR(15)
        `
        db.execute(query, (err)=>{
        if (err){
          res.status(500).json({message: "Error updated column ❌", Error: err.message});
        }
        else {
          res.json({message: "supplier updated successfully ✅"});
      }
        })
}
)

// question 5:-
// -------------

app.patch('/update/contact_number', (req, res)=>{
          const query = `
          ALTER TABLE products
          MODIFY COLUMN product_name TEXT NOT NULL;
        `
        db.execute(query, (err)=>{
        if (err){
          res.status(500).json({message: "Error updated column ❌", Error: err.message});
        }
        else {
          res.json({message: "products updated successfully ✅"});
      }
        })
})

// question 6:-
// -------------

// a:-
app.post('/add/supplier', (req, res)=>{
  const query = `
  INSERT INTO supplier (supplier_name, contact_number) values ('FreshFoods', '01001234567')
        `
        db.execute(query, (err)=>{
        if (err){
          res.status(500).json({message: "Error added column ❌", Error: err.message});
        }
        else {
          res.status(201).json({message: "supplier added successfully ✅"});
      }
        })
})

// b:-
app.post("/add/product/:supplierID", (req,res)=>{
  const { supplierID } = req.params;
  const { productname, price, quantity} = req.body;
  if (!productname || !price || !quantity) {
    console.log(productname, price, quantity);
    
    return res.status(400).json({message: "Missing required fields ❌"});
  }
  const query = `
    INSERT INTO PRODUCTS (product_name, price, 	Stock_Quantity, supplier_id) VALUES (?, ?, ?, ?);
  `

  db.execute(query, [productname, price, quantity, supplierID], (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error adding product ❌", Error: err.message});
    }
      res.status(201).json({message: "Product added successfully ✅", result,  });
    })
})
// c:-
app.post("/add/sale/:productID", (req,res)=>{
  const { productID } = req.params;
  const { quantitySold, saleDate} = req.body;
  if (!quantitySold || !saleDate) {
    console.log(quantitySold, saleDate);    
    return res.status(400).json({message: "Missing required fields ❌"});
  }
  const query = `
    INSERT INTO sales (quantity_sold, sale_date, product__id) VALUES (?, ?, ?);
  `

  db.execute(query, [quantitySold, saleDate, productID], (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error adding sale ❌", Error: err.message});
    }
      res.status(201).json({message: "Sale added successfully ✅", result});
    })
})

// question 7:-
// -------------
app.patch("/product/price/:productID", (req,res)=>{ 
  const { productID } = req.params;
  const {price} = req.body;
  console.log(price);
  if (!price) {
    return res.status(400).json({message: "Missing required fields ❌"});
  }
  const query = `
    UPDATE PRODUCTS SET price = ? where product_id = ?;
  `

  db.execute(query, [price, productID], (err, result, fields)=>{ 
    if (err) {
      return res.status(500).json({message: "Error updated product ❌", Error: err.message});
    }
      res.status(201).json({message: "Product updated successfully ✅", result});
    })
})

// question 8:-
// -------------
app.delete("/product/:productID", (req,res)=>{ 
  const { productID } = req.params;
  if (!productID) {
    return res.status(400).json({message: "Missing required params❌"});
  }
  const query = `
    DELETE FROM PRODUCTS WHERE product_id = ?;
  `

  db.execute(query, [productID], (err, result, fields)=>{ 
    if (err) {
      return res.status(500).json({message: "Error updated product ❌", Error: err.message});
    }
      res.status(201).json({message: "Product updated successfully ✅", result});
    })
})

// question 9:-
// -------------
app.get('/totalQuantity', (req, res) => {
  const query = `
    SELECT SUM(quantity_sold) AS total_quantity_sold FROM sales;
    `
    db.execute(query, (err, result, fields)=>{
      if (err) {
        return res.status(500).json({message: "Error fetching total quantity ❌", Error: err.message});
      }
      res.json({message: "Total quantity fetched successfuly ✅", totalQuantity: result[0].total_quantity_sold});
    })
})

// question 10:-
// -------------

app.get("/highestStock", (req,res)=>{
  const query = `
    SELECT product_name, stock_quantity FROM products 
    ORDER BY stock_quantity DESC
    LIMIT 1;
  `
  db.execute(query, (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error fetching highest stock ❌", Error: err.message});
    }
    res.json({message: "Highest stock fetched successfuly ✅", product: result[0].product_name, high_Stock_Quantity: result[0].stock_quantity})
  })
})

// question 11:-
// -------------

app.get("/supplier/{:searchbyname}", (req,res)=>{
  const { searchbyname } = req.params;
  console.log(searchbyname);
  
  if (!searchbyname) {
    return res.status(400).json({message: "Missing required params"});
  }
  const query = `
  SELECT * FROM supplier
  WHERE supplier_name LIKE ?;
  `
  db.execute(query, [`%${searchbyname}%`], (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error fetching supplier ❌", Error: err.message});
    }
    if (result.length == []) {
      return res.status(404).json({message: "No supplier found with the given name ❌"});
    }      
    res.json({message: "supplier fetched successfuly ✅", suppliers: result})
  })
})

// question 12:-
// -------------

app.get("/sales/checksold", (req,res)=>{
  const query = `
    SELECT product__id, quantity_sold as sold FROM sales
    where quantity_sold = 0;
  `
  db.execute(query, (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error fetching sales ❌", Error: err.message});
    }
    if (result.length == []) {
      return res.status(404).json({message: "No sold items found ❌"});
    }
    res.json({message: "products that are not sold fetched successfuly ✅", sold: result[0]})
  })
})

// question 13:-
// -------------

app.get("/sales", (req,res)=>{
  const query = `
    SELECT product_name ,sales.*
    FROM sales
    JOIN products
    ON sales.product__id = products.product_id;
    `
    db.execute(query, (err, result, fields)=>{
      if (err) {
        return res.status(500).json({message: "Error fetching sales ❌", Error: err.message});
      }
      if (result.length == []) {
        return res.status(404).json({message: "No sales found ❌"});
      }
      res.json({message: "sales fetched successfuly ✅", sales: result[0]})
    })
})

// question 14:-
// -------------

app.post("/users/admin", (req,res)=>{
  const createUserQuery = `
    CREATE USER IF NOT EXISTS 'store_manager'@'localhost' 
    IDENTIFIED BY '123456';
  `
  const grantQuery = `
    GRANT SELECT, INSERT, UPDATE
    ON retail_store.*
    TO 'store_manager'@'localhost';
  `
  db.execute(createUserQuery, (err, result, fields)=>{
    if (err) {
      return res.status(500).json({message: "Error creating user ❌", Error: err.message});
    } else {
      db.execute(grantQuery, (err, result, fields)=>{
        if (err) {
          return res.status(500).json({message: "Error granting privileges ❌", Error: err.message});
        } else {
          res.status(201).json({message: "User created and privileges granted successfully ✅", result});
        }
      })
    }
  })
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
