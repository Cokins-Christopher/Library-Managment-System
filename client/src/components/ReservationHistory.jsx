import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ReservationHistory() {
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const userID = location.pathname.split("/")[2];

  useEffect(() => {
    fetchReservationHistory();
  }, [userID]);

  const fetchReservationHistory = async () => {
    try {
      const historyResponse = await axios.get(
        `http://localhost:8900/reservation-history/${userID}`
      );
      const reservationHistory = historyResponse.data;

      if (reservationHistory.length === 0) {
        // No history records found
        setHistory(null);
        return;
      }

      const historyDetails = await Promise.all(
        reservationHistory.map((historyItem) =>
          axios
            .get(`http://localhost:8900/books/${historyItem.BookID}`)
            .then((res) => ({
              ...res.data,
              DateReserved: historyItem.DateReserved,
              DateReturned: historyItem.DateReturned || "Not returned yet",
            }))
        )
      );
      setHistory(historyDetails);
    } catch (error) {
      console.error("Error fetching reservation history", error);
    }
  };

  if (history.length === 0) {
    return <div>No History in Library Records</div>;
  }

  return (
    <div className="reservation-history-container">
      <h2>Reservation History</h2>
      <table className="reservation-history-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date Reserved</th>
            <th>Date Returned</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.Title}</td>
              <td>{item.Author}</td>
              <td>
                {item.DateReserved &&
                !isNaN(new Date(item.DateReserved).getTime())
                  ? new Date(item.DateReserved).toISOString().split("T")[0]
                  : "N/A"}
              </td>
              <td>
                {item.DateReturned &&
                !isNaN(new Date(item.DateReturned).getTime())
                  ? new Date(item.DateReturned).toISOString().split("T")[0]
                  : "Not Returned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationHistory;
