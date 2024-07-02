import React, { useState } from 'react'
import styles from "./AddBoardUser.module.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import FinalCard from './subComponent/FinalCard';


const AddBoardUser = ({setAddBoardUser}) => {
     const [email,setEmail]=useState(null)
     const [finalCardshow,setFinalCardshow]=useState(false);
     const token=window.localStorage.getItem('token')

     const addEmail=async()=>{
        try {
            const res=await axios.post("https://promanagerbakend-2.onrender.com/api/user/addBoardUser",{email},{
                headers: {
                Authorization: `Bearer ${token}`,
                }
            })
            if(res.status==200){
                setFinalCardshow(true);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
     }

     const CloseButton = ({ closeToast }) => (
        <i className="material-icons" onClick={closeToast}>
          X
        </i>
      );
  return (
    <>
    <div className={styles.superContainer}>
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
        <div className={styles.container}>
            <h2>Add people to the board </h2>
            <input 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder='Enter the email'
            />
            <div className={styles.buttons}>
            <button className={styles.cancel} onClick={()=>setAddBoardUser(false)}>cancel</button>
            <button className={styles.addemail} onClick={addEmail}>add email</button>
            </div>
        </div>
    </div>
    {
        finalCardshow&&<FinalCard setAddBoardUser={setAddBoardUser} email={email}/>
    }
    </>
  )
}

export default AddBoardUser