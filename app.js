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

//ROUTES CATEGORIES

// GET
app.get("/categories", (req, res) => {
  connection.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

// POST
app.post("/categories", (req, res) => {
  const { title } = req.body;
  connection.query(
    "INSERT INTO categories (title) VALUES (?)",
    [title],
    (err) => {
      if (err) {
        res.status(500).send("Error saving the category");
      } else {
        res.status(201).send("Categorie created !");
      }
    }
  );
});

// PATCH
app.patch("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  connection
    .query("SELECT * FROM categories WHERE id = ?")
    .then(([results]) => {
      existingCategory = results[0];
      if (!existingCategory) return Promise.reject("CATEGORY_NOT_FOUND");
      return connection.query("UPDATE categories SET ? WHERE id = ?", [
        req.body,
        category_id,
      ]);
    })
    .then(() => {
      res.status(200).json({ ...existingCategory, ...req.title });
    })
    .catch((err) => {
      console.error(err);
      if (err === "CATEGORY_NOT_FOUND")
        res.status(404).send(`Category with id ${category_id} not found`);
      else res.status(500).send("Error updating a category.");
    });
});

// DELETE
app.delete("/categories/:id", (req, res) => {
  connection.query(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error category deleting !");
      } else {
        if (result.affectedRows) res.status(200).send("Yeah it's deleted !");
        else res.status(404).send("category not found");
      }
    }
  );
});

// ROUTES ARTICLES

// GET
app.get("/articles", (req, res) => {
  connection.query("SELECT * FROM articles", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result).send("Hello");
    }
  });
});

// POST
app.post("/articles", (req, res) => {
  const { title, author, content, category_id } = req.body;
  connection.query(
    "INSERT INTO articles (title, author, content, category_id) VALUES (? , ? , ?, ?)",
    [title, author, content, category_id],
    (err) => {
      if (err) {
        res.status(500).send("Error saving the article");
      } else {
        res.status(201).send("Article created !");
      }
    }
  );
});

// PATCH
app.patch("/articles/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  connection
    .query("SELECT * FROM articles WHERE id = ?")
    .then(([results]) => {
      existingArticle = results[0];
      if (!existingArticle) return Promise.reject("ARTICLE_NOT_FOUND");
      return connection.query("UPDATE articles SET ? WHERE id = ?", [
        req.body,
        id,
      ]);
    })
    .then(() => {
      res.status(200).json({ ...existingArticle, ...req.body
    })
    .catch((err) => {
      console.error(err);
      if (err === "ARTICLE_NOT_FOUND")
        res.status(404).send(`Article with id ${id} not found`);
      else res.status(500).send("Error updating an articles.");
    })
    });
});

//DELETE
app.delete("/articles/:id", (req, res) => {
  connection.query(
    "DELETE FROM articles WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error article deleting !");
      } else {
        if (result.affectedRows) res.status(200).send("Yeah it's deleted !");
        else res.status(404).send("article not found");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});