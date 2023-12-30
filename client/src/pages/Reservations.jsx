import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";

function Reservations() {
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const userID = location.pathname.split("/")[2];

  useEffect(() => {
    fetchReservedBooks();
  }, [userID]);

  const fetchReservedBooks = async () => {
    try {
      const reservationResponse = await axios.get(
        `http://localhost:8900/reservations/${userID}`
      );
      const reservations = reservationResponse.data;

      const bookDetails = await Promise.all(
        reservations.map((reservation) =>
          axios
            .get(`http://localhost:8900/books/${reservation.BookID}`)
            .then((res) => ({
              ...res.data,
              ReservationID: reservation.ReservationID,
            }))
        )
      );
      setBooks(bookDetails);
    } catch (error) {
      console.error("Error fetching reserved books", error);
    }
  };

  const handleFinish = async (bookID, reservationID) => {
    try {
      const returnDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
      // Update the reservation history to mark the book as returned
      await axios.put(
        `http://localhost:8900/reservation-history/${reservationID}`,
        {
          DateReturned: returnDate,
        }
      );
      // Remove the reservation
      await axios.delete(`http://localhost:8900/reservations/${reservationID}`);

      // Update the book's availability
      await axios.put(`http://localhost:8900/books/${bookID}`, {
        Availability: true,
      });

      // Fetch the updated list of reserved books
      fetchReservedBooks();
    } catch (error) {
      console.error("Error updating reservation and book availability", error);
    }
  };

  if (books.length === 0) {
    return (
      <div className="reservations-container">
        <Navbar />
        <h2>You Have No Outstanding Reservations!</h2>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <Navbar />
      <h2>Reserved Books</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.Title}</td>
              <td>{book.Author}</td>
              <td>
                <button
                  onClick={() => handleFinish(book.BookID, book.ReservationID)}
                >
                  Finished
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reservations;
