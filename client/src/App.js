import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Book from "./pages/Book";
import User from "./pages/User";
import Admin from "./pages/Admin";
import Signup from "./pages/Singup";
import Home from "./pages/Home";
import Reservation from "./pages/Reservations"
import Account from "./pages/Account";
import "./App.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books/:id" element={<Books />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/reservations/:id" element={<Reservation />} />
          <Route path="/account/:id" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
