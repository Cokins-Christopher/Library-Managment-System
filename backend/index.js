import cors from "cors";
import express from "express";
import mysql from "mysql";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "cs5330",
  password: "",
  database: "library",
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json("error is here");
    return res.json(data);
  });
});

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id; // Extracting the book ID from the request parameters
  const sqlQuery = "SELECT * FROM books WHERE BookID = ?"; // Assuming 'id' is the column name for book ID in your database

  db.query(sqlQuery, [bookId], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the book details" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(data[0]); // Assuming that book IDs are unique and only one record will be returned
  });
});

app.get("/reservations", (req, res) => {
  let sql = "SELECT * FROM Reservations";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error occurred while fetching reservations");
    } else {
      res.json(results);
    }
  });
});

app.get("/reservations/:userId", (req, res) => {
  const userId = req.params.userId;

  // Assuming the 'user_id' column in your 'Reservations' table holds the ID of the user who made the reservation
  let sql = "SELECT * FROM Reservations WHERE UserID = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("Server error occurred while fetching reservations for the user");
    } else {
      res.json(results);
    }
  });
});

app.put("/books/:bookID", (req, res) => {
  const bookID = req.params.bookID;
  const bookUpdate = req.body;

  // Construct the SQL query
  const q = `UPDATE Books SET ? WHERE BookID = ?`;

  // Execute the query
  db.query(q, [bookUpdate, bookID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send("Book updated successfully");
    }
  });
});

app.post("/reservations", (req, res) => {
  let reservationData = req.body;

  // Construct the SQL query
  let q = `INSERT INTO Reservations SET ?`;

  // Execute the query
  db.query(q, reservationData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send("Reservation added successfully");
    }
  });
});

app.post("/signup", (req, res) => {
  const q =
    "INSERT INTO Users (`FirstName`, `LastName`, `Email`, `Username`, `UserPassword`) VALUES (?)";
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.username,
    req.body.password,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/users", (req, res) => {
  const q = "SELECT * FROM Users WHERE `Email` = ? AND `UserPassword` = ?";
  const values = [req.body.email, req.body.password];
  db.query(q, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      const userID = data[0].UserID;
      return res.json({ status: "Success", userID: userID });
    } else {
      return res.json("Failed");
    }
  });
});

app.delete("/reservations/:reservationID", (req, res) => {
  const reservationID = req.params.reservationID;

  const q = "DELETE FROM Reservations WHERE ReservationID = ?";

  db.query(q, [reservationID], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("Server error occurred while deleting the reservation");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Reservation not found");
    }

    return res.send("Reservation deleted successfully");
  });
});

app.listen(8900, () => {
  console.log("connect to backend!");
});
