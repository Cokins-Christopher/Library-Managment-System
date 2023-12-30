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
app.get("/users/:userID", (req, res) => {
  const userID = req.params.userID;
  const query =
    "SELECT FirstName, LastName, Email, Username, IsAdmin FROM Users WHERE UserID = ?";

  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user data" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(result[0]); // Assuming userID is unique and only one record will be returned
  });
});
app.get("/reservation-history/:userID", (req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT rh.HistoryID, rh.BookID, rh.DateReserved, rh.DateReturned
    FROM ReservationHistory rh
    WHERE rh.UserID = ?`;

  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching reservation history",
      });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No reservation history found for this user" });
    }
    return res.json(result);
  });
});
app.get("/books/:bookID", (req, res) => {
  const bookID = req.params.bookID;
  const query = `
    SELECT BookID, Title, Author, PublicationYear, Availability
    FROM Books
    WHERE BookID = ?`;

  db.query(query, [bookID], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching book details" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(result[0]); // Assuming bookID is unique and only one record will be returned
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
app.put("/users/:userID", (req, res) => {
  const userID = req.params.userID;
  const { FirstName, LastName, Email, Username, UserPassword } = req.body;

  const query =
    "UPDATE Users SET FirstName = ?, LastName = ?, Email = ?, Username = ?, UserPassword = ? WHERE UserID = ?";

  db.query(
    query,
    [FirstName, LastName, Email, Username, UserPassword, userID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while updating user data" });
      }
      return res.json({ message: "User updated successfully" });
    }
  );
});
app.put("/reservation-history/:reservationID", (req, res) => {
  const reservationID = req.params.reservationID;
  const { DateReturned } = req.body;
  const query = `
    UPDATE ReservationHistory
    SET DateReturned = ?
    WHERE ReservationID = ?`;

  db.query(query, [DateReturned, reservationID], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error updating reservation history" });
    }
    return res
      .status(200)
      .json({ message: "Reservation history updated successfully" });
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
      // Return the ReservationID in the response
      reservationData.ReservationID = result.insertId;
      res.json(reservationData);
    }
  });
});

app.post("/reservation-history", (req, res) => {
  const { UserID, BookID, DateReserved } = req.body;

  // Get the ReservationID based on UserID and BookID from the Reservations table
  const getReservationIDQuery = `
    SELECT ReservationID
    FROM Reservations
    WHERE UserID = ? AND BookID = ?`;

  db.query(getReservationIDQuery, [UserID, BookID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error retrieving ReservationID" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No active reservation found for this user and book" });
    }

    const ReservationID = result[0].ReservationID;

    // Now, insert the record into the ReservationHistory table with all the fields
    const insertHistoryQuery = `
      INSERT INTO ReservationHistory (ReservationID, UserID, BookID, DateReserved)
      VALUES (?, ?, ?, ?)`;

    db.query(
      insertHistoryQuery,
      [ReservationID, UserID, BookID, DateReserved],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Error adding to reservation history" });
        }
        return res
          .status(201)
          .json({ message: "Reservation history updated successfully" });
      }
    );
  });
});
// Endpoint to handle the admin request
app.post("/request-admin/:userID", (req, res) => {
  const userID = req.params.userID;

  // You might want to add authentication here to check if the user is valid

  const query = "UPDATE Users SET RequestAdmin = TRUE WHERE UserID = ?";

  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error processing your request" });
    }
    return res.status(200).json({ message: "Admin request sent successfully" });
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
  const { email, password } = req.body;
  const query =
    "SELECT UserID, IsAdmin FROM Users WHERE Email = ? AND UserPassword = ?";

  db.query(query, [email, password], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ status: "Error", message: "An error occurred" });
    }
    if (data.length > 0) {
      const user = data[0];
      return res.json({
        status: "Success",
        userID: user.UserID,
        isAdmin: user.IsAdmin,
      });
    } else {
      return res.json({ status: "Failed", message: "Invalid credentials" });
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

app.get("/admin-requests", (req, res) => {
  const query = "SELECT UserID, Username FROM Users WHERE RequestAdmin = TRUE";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching admin requests");
    } else {
      res.json(results);
    }
  });
});

app.post("/handle-admin-request", (req, res) => {
  const { userID, approve } = req.body;
  let updateQuery;

  if (approve) {
    updateQuery =
      "UPDATE Users SET IsAdmin = TRUE, RequestAdmin = FALSE WHERE UserID = ?";
  } else {
    updateQuery = "UPDATE Users SET RequestAdmin = FALSE WHERE UserID = ?";
  }

  db.query(updateQuery, [userID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error processing admin request");
    } else {
      res.send("Admin request processed successfully");
    }
  });
});

app.listen(8900, () => {
  console.log("connect to backend!");
});
