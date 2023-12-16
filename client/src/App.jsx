import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { ProfileRoute, SignInRoute } from "./components/PrivateRoutes";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProfileRoute />}>
          <Route path="/Profile" element={<Profile />} />
        </Route>
        <Route element={<SignInRoute />}>
          <Route path="/Sign-in" element={<SignIn />} />
        </Route>
        <Route element={<SignInRoute />}>
          <Route path="/Sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;