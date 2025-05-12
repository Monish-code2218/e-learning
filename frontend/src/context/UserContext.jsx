import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const server = "http://localhost:5000";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/signin`, {
        email,
        password,
      });

      toast.success(data.message || "Successfully signed in! Welcome back!");
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      if (error.response) {
        toast.error(error.response.data.message || "Sign in failed. Please check your credentials.");
      } else if (error.request) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }

  async function registerUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/signup`, {
        email,
        password,
      });

      toast.success(data.message || "Registration successful! Please check your email for verification.");
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      setBtnLoading(false);
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed. Please try again with different credentials.");
      } else if (error.request) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message || "Email verified successfully! You can now login.");
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`${server}/users`, {
        headers: {
          token: token,
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem("token");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,

        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
