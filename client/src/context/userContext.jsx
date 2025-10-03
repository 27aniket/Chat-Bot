import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { server } from "../main";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  //  Login User
  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  //  Verify OTP
  async function verifyUser(otp, navigate) {
    const verifyToken = localStorage.getItem("verifyToken");
    if (!verifyToken) return toast.error("No verification token found");

    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/verify`,
        { otp  , verifyToken},
       
      );

      toast.success(data.message);
      localStorage.clear();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Fetch Authenticated User
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("Fetch user failed:", error.response?.data || error.message);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  //  Logout
  const logoutHandler = (navigate) => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser({});
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        verifyUser,
        fetchUser,
        logoutHandler,
        btnLoading,
        isAuth,
        setIsAuth,
        user,
        loading,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
