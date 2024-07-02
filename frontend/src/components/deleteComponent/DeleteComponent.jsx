import React from 'react'
import styles from "./DeleteComponent.module.css"
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteComponent = ({setDeleteComp,deleteTaskId}) => {
    const token=window.localStorage.getItem('token');

    const taskId=deleteTaskId
    const deleteTask = async () => {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/task/deleteTask",
            { taskId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (res.status == 201) {
            toast.success(res.data.message);
            setDeleteComp(false);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };

      const CloseButton = ({ closeToast }) => (
        <i className="material-icons" onClick={closeToast}>
          X
        </i>);
  return (
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
            <p>Are you sure you want to Delete</p>
            <div className={styles.buttons}>
            <button className={styles.logout} onClick={()=>deleteTask(deleteTaskId)}>Yes, Delete</button>
            <button className={styles.cancel} onClick={()=>setDeleteComp(false)}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteComponent