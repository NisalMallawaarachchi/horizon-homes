import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import MyListings from "./pages/MyListings";
import UpdateListing from "./pages/UpdateListing";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
