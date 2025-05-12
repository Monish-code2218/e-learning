import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import { LectureProvider } from "./context/LectureContext"; // ✅ Import LectureProvider
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import Lecture from "./pages/lecture/lecture/Lecture";
import Payment from "./components/Payment";

const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <LectureProvider> {/* ✅ Wrap entire Routes with LectureProvider */}
            <Header isAuth={isAuth} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route
                path="/account"
                element={isAuth ? <Account user={user} /> : <Login />}
              />
              <Route path="/login" element={isAuth ? <Home /> : <Login />} />
              <Route
                path="/register"
                element={isAuth ? <Home /> : <Register />}
              />
              <Route
                path="/course/:id"
                element={isAuth ? <CourseDescription user={user} /> : <Login />}
              />
              <Route
                path="/payment/:id"
                element={isAuth ? <Payment user={user} /> : <Login />}
              />
              <Route
                path="/payment-success/:id"
                element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
              />
              <Route
                path="/:id/dashboard"
                element={isAuth ? <Dashbord user={user} /> : <Login />}
              />
              <Route
                path="/course/study/:id"
                element={isAuth ? <CourseStudy user={user} /> : <Login />}
              />
              <Route
                path="/course/lecture/:id"
                element={isAuth ? <Lecture user={user} /> : <Login />}
              />

              // Remove or comment out any admin-specific routes or components
              // Ensure only user-level routes are available
            </Routes>
            <Footer />
          </LectureProvider>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
