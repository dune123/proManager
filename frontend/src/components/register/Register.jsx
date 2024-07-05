import React, { useState } from "react";
import styles from "./Register.module.css";
import { CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = ({ setLoginstatus }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: ""
  });
  const [errors, setErrors] = useState({});
  const [fieldError, setFieldError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (e) => {
    if(!formValues.username&&!formValues.email&&!formValues.password&&!formValues.confirmpassword){
      setFieldError("This field is required")
    }
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await axios.post("https://promanagerbakend-2.onrender.com/api/user/register", formValues);
      if (res.status === 201) {
        toast.success(res.data.message);
        setLoginstatus(true);
      } else {
        
        toast.error(res.data.message);
      }
    } catch (error) {
      
      if (error.response && error.response.data.field) {
        setErrors({ [error.response.data.field]: error.response.data.message });
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <CiUser className={styles.usersLogo} />
          <input
            placeholder="Name"
            className={styles.inputField}
            value={formValues.username}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              username: e.target.value
            }))}
          />
          </div>
          {(fieldError||errors.username) && <div className={styles.error}>{errors.username||fieldError}</div>}
        </div>
        <div className={styles.name}>
        <div className={styles.topCont}>
          <AiOutlineMail className={styles.emailLogo} />
          <input
            placeholder="Email"
            className={styles.inputField}
            value={formValues.email}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              email: e.target.value
            }))}
          />
          </div>
          {(fieldError||errors.email) && <div className={styles.error}>{errors.email||fieldError}</div>}
        </div>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <CiLock className={styles.lockLogo} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.inputField}
            value={formValues.password}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              password: e.target.value
            }))}
          />
          </div>
          {showPassword ? (
            <IoEyeOutline
              className={styles.eyeIcon}
              onClick={togglePasswordVisibility}
            />
          ) : (
            <IoEyeOffOutline
              className={styles.eyeIcon}
              onClick={togglePasswordVisibility}
            />
          )}
          {(fieldError||errors.password) && <div className={styles.error}>{errors.password||fieldError}</div>}
        </div>
        <div className={styles.name}>
        <div className={styles.topCont}>
          <CiLock className={styles.lockLogo} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={styles.inputField}
            value={formValues.confirmpassword}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              confirmpassword: e.target.value
            }))}
          />
          </div>
          {showConfirmPassword ? (
            <IoEyeOutline
              className={styles.eyeIcon}
              onClick={toggleConfirmPasswordVisibility}
            />
          ) : (
            <IoEyeOffOutline
              className={styles.eyeIcon}
              onClick={toggleConfirmPasswordVisibility}
            />
          )}
          {(fieldError||errors.confirmpassword) && <div className={styles.error}>{errors.confirmpassword||fieldError}</div>}
        </div>
        <button className={styles.register} type="submit">Register</button>
      </form>
      <p>Have an Account?</p>
      <button className={styles.Login} onClick={() => setLoginstatus(true)}>
        Log in
      </button>
    </div>
  );
};

export default Register;

