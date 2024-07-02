import React, { useState } from 'react';
import styles from "./Login.module.css";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoginstatus }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()
  const [formvalues,setFormvalues]=useState({
    email:"",
    password:""
  })
  const [errors,setErrors] = useState({});
  const [fieldError, setFieldError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlesumbit=async(e)=>{
    e.preventDefault();
    if(!formvalues.email&&!formvalues.password){
        setFieldError("this field is required");
    }
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", formvalues);
      if (res.status === 201) {
        navigate("/dashboard");
        toast.success("user logged in successfully");
        window.localStorage.setItem("userId", res.data.userId);
        window.localStorage.setItem("username", res.data.username);
        window.localStorage.setItem("token", res.data.token);
        window.localStorage.setItem("email",res.data.email);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.field) {
        setErrors({ [error.response.data.field]: error.response.data.message });
      } else {
        toast.error(error.response.data.message);
      }
    }
  }

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );
  return (
    <div className={styles.container}>
    <ToastContainer
              style={{ height: "7vh", width: "30vw" }}
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              closeButton={CloseButton}
            />
      <h2>Login</h2>
      <form>
        <div className={styles.inputContainer}>
          <div className={styles.TopCont}>
          <AiOutlineMail className={styles.icon} />
          <input type="email" 
          placeholder='Email' 
          className={styles.inputField} 
          onChange={
            (e)=>setFormvalues((prev)=>({
              ...prev,
              email:e.target.value
            }))
          }
          value={formvalues.email}
          />
          </div>
          {(fieldError||errors.email) && <div className={styles.error}>{errors.email||fieldError}</div>}
        </div>
        <div className={styles.inputContainer}>
        <div className={styles.TopCont}>
          <CiLock className={styles.icon} />
          <input 
          type={showPassword ? 'text' : 'password'} placeholder='Password' 
          className={styles.inputField} 
          onChange={
            (e)=>setFormvalues((prev)=>({
              ...prev,
              password:e.target.value
            }))
          }
          value={formvalues.password}
          />
          </div>
          {showPassword ? (
            <IoEyeOutline className={styles.eyeIcon} onClick={togglePasswordVisibility} />
          ) : (
            <IoEyeOffOutline className={styles.eyeIcon} onClick={togglePasswordVisibility} />
          )}
          {(fieldError||errors.password) && <div className={styles.error}>{errors.password||fieldError}</div>}
        </div>
      </form>
      <button className={styles.loginButton} onClick={handlesumbit}>Log in</button>
      <p>Have no account yet?</p>
      <button className={styles.registerButton} onClick={() => setLoginstatus(false)}>Register</button>
    </div>
  );
};

export default Login;

