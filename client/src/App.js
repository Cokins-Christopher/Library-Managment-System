import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Admin from "./pages/Admin";
import Signup from "./pages/Singup";
import Home from "./pages/Home";
import Reservation from "./pages/Reservations"
import Account from "./pages/Account";
import UpdateInfo from "./pages/UpdateInfo";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books/:id" element={<Books />} />
          <Route path="/admin/:id" element={<Admin />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/reservations/:id" element={<Reservation />} />
          <Route path="/account/:id" element={<Account />} />
          <Route path="/update-info/:id" element={<UpdateInfo/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
