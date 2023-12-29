import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const location = useLocation();
  const userID = location.pathname.split("/")[2];

  const getReservationStatus = (bookID) => {
    
    return null;
  };

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8900/books");
        setBooks(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await axios.get("http://localhost:8900/books");
        setBooks(booksRes.data);

        const reservationsRes = await axios.get(
          "http://localhost:8900/reservations"
        );
        setReservations(reservationsRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleReserve = async (bookID) => {
    try {
      const bookUpdate = {
        Availability: false,
      };

      // Update the book's availability on the server
      await axios.put(`http://localhost:8900/books/${bookID}`, bookUpdate);

      // Prepare the reservation data
      const reservationData = {
        UserID: userID,
        BookID: bookID,
        ReservationDate: new Date().toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      };

      // Add a reservation entry
      await axios.post("http://localhost:8900/reservations", reservationData);

      // Update the books state to reflect the change in availability
      setBooks(
        books.map((book) => {
          if (book.BookID === bookID) {
            return { ...book, Availability: false };
          }
          return book;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>All Books</h1>
      <table>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.BookID}>
              <td>
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={book.Title}
                    style={{ width: "100px" }}
                  />
                )}
              </td>
              <td>{book.Title}</td>
              <td>{book.Author}</td>
              <td>{book.PublicationYear}</td>
              <td>{book.Availability ? "Available" : "Not Available"}</td>
              <td>
                {book.Availability ? (
                  <button
                    className="reserve"
                    onClick={() => handleReserve(book.BookID)}
                  >
                    Reserve
                  </button>
                ) : (
                  getReservationStatus(book.BookID)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
