import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TaskShare.module.css";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskShare = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  const getTask = async () => {
    try {
        const res = await axios.get(`https://promanagerbakend-2.onrender.com/api/task/getTaskWithoutId/${taskId}`);

      if (res.status === 201) {
        console.log(res.data)
        setTask(res.data.task);
      } else {
        console.log(res.data)
        toast.error(res.data.message || "Failed to fetch task");
      }
    } catch (error) {
        console.log(error)
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

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
      <div className={styles.navbar}>
        <img src="/siteLogo.png" alt="Site Logo" />
      </div>
      <div className={styles.container}>
        {task ? (
          <>
            <div className={styles.topCont}>
              <GoDotFill
                style={{ fontSize: "0.8rem" }}
                className={`${styles.dot} ${
                  task.priority === "high"
                    ? styles.dotHigh
                    : task.priority === "moderate"
                    ? styles.dotModerate
                    : styles.dotLow
                }`}
              />
              <p>{task.priority} priority</p>
            </div>
            <div className={styles.middleCont}>
              <p>Checklist ({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</p>
              <div className={styles.checklistCont}>
                {task.checklist.map((item, index) => (
                  <div className={styles.eachChecklist} key={item._id}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      className={styles.checked}
                      readOnly
                    />
                    <input
                      type="text"
                      value={item.description}
                      className={styles.description}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.bottomCont}>
              <p>Due Date</p>
              <div className={styles.dueDate}>
                {formatDate(task.dueDate)}
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default TaskShare;
