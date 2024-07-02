import React, { useState } from 'react'
import styles from "./Setting.module.css"
import { CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const username=window.localStorage.getItem("username")
  const email=window.localStorage.getItem("email")
  const token=window.localStorage.getItem("token")
  const [formValues,setFormValues]=useState({
    oldPassword:"",
    newPassword:""
  })

  const navigate=useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const updatePassword = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/user/changePassword", formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 201) {
        toast.success(res.data.message);
        navigate("/")
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  console.log(formValues)
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
      <h3>Settings</h3>
      <div className={styles.subContainer}>
        <form>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <CiUser className={styles.usersLogo} />
          <input
            placeholder="Name"
            className={styles.inputField}
            value={username}
          />
          </div>
          {/*(fieldError||errors.username) && <div className={styles.error}>{errors.username||fieldError}</div>*/}
        </div>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <AiOutlineMail className={styles.usersLogo} />
          <input
            placeholder="Email"
            className={styles.inputField}
            value={email}
          />
          </div>
          {/*(fieldError||errors.username) && <div className={styles.error}>{errors.username||fieldError}</div>*/}
        </div>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <CiLock className={styles.usersLogo} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.inputField}
            value={formValues.oldPassword}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              oldPassword: e.target.value
            }))}
          />
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
          </div>
          {/*(fieldError||errors.username) && <div className={styles.error}>{errors.username||fieldError}</div>*/}
        </div>
        <div className={styles.name}>
          <div className={styles.topCont}>
          <CiLock className={styles.usersLogo} />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.inputField}
            value={formValues.newPassword}
            onChange={(e) => setFormValues((prev) => ({
              ...prev,
              newPassword: e.target.value
            }))}
          />
          {showNewPassword ? (
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
          </div>
          {/*(fieldError||errors.username) && <div className={styles.error}>{errors.username||fieldError}</div>*/}
        </div>
        </form>
        <button className={styles.Update} onClick={updatePassword}>
          Update
      </button>
      </div>    
    </div>
  )
}

export default Setting