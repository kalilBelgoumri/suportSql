const express = require("express");
const connection = require("./db-config");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3002;

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + connection.threadId);
  }
});

app.use(express.json());

// route GET

app.get("/categories", (req, res) => {
  connection.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

//route POST

app.post("/categories", (req, res) => {
  const { title } = req.body;
  connection.query(
    "INSERT INTO categories (title) VALUES (?)",
    [title],
    (err) => {
      if (err) {
        res.status(500).send("Error saving the category");
      } else {
        res.status(201).send("Catégorie created !");
      }
    }
  );
});

// app.post("/articles", (req, res) => {
//   const { name, size,  } = req.body;
//   const db = connection.promise();
//   let validationErrors = null;
//   db.query("SELECT * FROM beer WHERE name = ?", [name])
//     .then(([result]) => {
//       if (result[0]) return Promise.reject("DUPLICATE_EMAIL");
//       validationErrors = Joi.object({
//         name: Joi.string().max(80).required(),
//         size: Joi.number().integer().min(25).required(),
//       }).validate({ name, size }, { abortEarly: false }).error;
//       if (validationErrors) return Promise.reject("INVALID_DATA");
//       return db.query("INSERT INTO beer (name, size) VALUES (?, ?)", [
//         name,
//         size,
//       ]);
//     })
//     .then(([{ insertId }]) => {
//       res.status(201).json({ id: insertId, name, size });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err === "DUPLICATE_NAME")
//         res.status(409).json({ message: "This beer is already use" });
//       else if (err === "INVALID_DATA")
//         res.status(422).json({ validationErrors });
//       else res.status(500).send("Error saving the user");
//     });
// });

//route DELETE

app.delete("/categories/:id", (req, res) => {
  connection.query(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).setDefaultEncoding("Error category deleting !");
      } else {
        if (result.affectedRows) res.status(200).send("Yeah it's deleted !");
        else res.status(400).send("category not found");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
