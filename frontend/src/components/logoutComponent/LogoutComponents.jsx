import React from 'react'
import styles from "./LogoutComponents.module.css"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LogoutComponents = ({setLogoutComp}) => {
    const username=window.localStorage.getItem("username")
    const token=window.localStorage.getItem("token")
    const navigate=useNavigate();

    const logout=async()=>{
        try {
            const res=await axios.post("http://localhost:3000/api/user/logout",{username},{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            if(res.status==201){
                window.localStorage.setItem("userId", res.data.userId);
                window.localStorage.setItem("username", res.data.username);
                window.localStorage.setItem("token", res.data.token);
                window.localStorage.setItem("email",res.data.email);
                navigate("/")
            }
            else{
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                toast.error(error.response.data.message);
              } else {
                toast.error('An unexpected error occurred. Please try again later.');
              }
        }
    }
  return (
    <div className={styles.superContainer}>
        <div className={styles.container}>
            <p>Are you sure you want to logout</p>
            <div className={styles.buttons}>
            <button className={styles.logout} onClick={logout}>Yes, Logout</button>
            <button className={styles.cancel} onClick={()=>setLogoutComp(false)}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default LogoutComponents