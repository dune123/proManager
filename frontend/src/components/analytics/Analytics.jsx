import React, { useEffect, useState } from 'react'
import styles from "./Analytics.module.css"
import { GoDotFill } from "react-icons/go";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Analytics = () => {
  const [status,setStatus]=useState([])
  const [priority,setPriority]=useState([])
  const [dueDate,setDueDate]=useState(null)
  const token=window.localStorage.getItem("token")

  const getStatusandPriority=async()=>{
    try {
      const res=await axios.get("http://localhost:3000/api/task/getanalytics",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if(res.status===200){
          setStatus(res.data.resultforstatus)
          setPriority(res.data.resultforpriority)
          setDueDate(res.data.numberofDuedate)
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(()=>{
    getStatusandPriority()
  },[])

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
        <h2>Analytics</h2>
        <div className={styles.bottomContainer}>
          <div className={styles.leftCont}>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>Backlog Task</p>
              </div>
                <p>{status.Backlog}</p>
              </div>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>Completed Tasks</p>
              </div>
                <p>{status.
                  Done}</p>
              </div>
              <div className={styles.eachPortion}>
                <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>In Progress Tasks</p>
              </div>
                <p>{status.Inprogress}</p>
              </div>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>To-do Tasks</p>
              </div>
                <p>{status.Todo}</p>
              </div>
          </div>
          <div className={styles.rightCont}>
          <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>Low Priority</p>
              </div>
                <p>{priority.low}</p>
              </div>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>Moderate Priority</p>
              </div>
                <p>{priority.moderate}</p>
              </div>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>High Priority</p>
              </div>
                <p>{priority.high}</p>
              </div>
              <div className={styles.eachPortion}>
              <div className={styles.lefty}>
                <GoDotFill style={{color:"#90C4CC"}}/>
                <p>Due Date Tasks</p>
              </div>
                <p>{dueDate}</p>
              </div>
          </div>  
        </div>
    </div>
  )
}

export default Analytics