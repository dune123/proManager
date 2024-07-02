import React, { useEffect, useState } from "react";
import styles from "./editComponent.module.css";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import DatePicker from "react-datepicker";
import Dropdown from "../editComponent/subComponents/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditComponents = ({ editTask,setIseditable }) => {
  const token=window.localStorage.getItem("token");
  const userId=window.localStorage.getItem("userId");
  const email=window.localStorage.getItem("email");
  const [boardUser,setBoardUser]=useState([])
  const [selectedEmail, setSelectedEmail] = useState(email);
  const [task, setTask] = useState(null);

  const getTask = async () => {
    try {
        const res = await axios.get(`https://promanagerbakend-2.onrender.com/api/task/getTaskWithoutId/${editTask}`);

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
  const getBoardUse=async()=>{
    try {
        const res=await axios.get("https://promanagerbakend-2.onrender.com/api/user/getBoardUser",{
            headers: {
          Authorization: `Bearer ${token}`,
        }
        })
        if(res.status==200){
            console.log(res.data.allBoardUsers)
            setBoardUser(res.data.allBoardUsers)
        }
        else{
            toast.error(error.data.message)
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
    }
  }

  useEffect(()=>{
    getTask()
    getBoardUse()
  },[editTask])

  const handleChecklistChange = (index, event) => {
    const { name, value, checked } = event.target;
    const newChecklist = [...task.checklist];
    if (name === "checked") {
      newChecklist[index].checked = checked;
    } else {
      newChecklist[index].description = value;
    }
    setTask({ ...task, checklist: newChecklist });
  };

  const deleteItemFromChecklist = (index) => {
    const newChecklist = [...task.checklist];
    newChecklist.splice(index, 1);
    setTask({ ...task, checklist: newChecklist });
  };

  const addNewItemForChecklist = () => {
    const newChecklist = [...task.checklist, { description: '', checked: false }];
    setTask({ ...task, checklist: newChecklist });
  };

  const selectPriority=(priority)=>{
    if(task.priority){
      const previousComponent=document.getElementById(task.priority);
      if(previousComponent){
        previousComponent.style.backgroundColor="white"
      }
    }
    setTask((prev)=>({
      ...prev,
      priority:priority
    }))
    const newComponent = document.getElementById(priority);
    if (newComponent) {
      newComponent.style.backgroundColor = "#EEECEC";
    }
  };

  const editThisTask = async () => {
    try {
      const res = await axios.put(
        `https://promanagerbakend-2.onrender.com/api/task/editTask/${editTask}`,
        { task },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 200) {
        toast.success(res.data.message);
        setIseditable(false); // Close the edit modal
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
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
      <div className={styles.Title}>
        <label>
          Title <span style={{ color: "red" }}>*</span>
        </label>
        <input placeholder="Enter the task" value={task?.taskName || ''} onChange={(e) => setTask({ ...task, taskName: e.target.value })} />
      </div>
      <div className={styles.selectPriority}>
        <label>
          Select Priority <span style={{ color: "red" }}>*</span>
        </label>
        <div className={styles.rightside}>
          <div className={styles.highPriority} id="high" onClick={() => selectPriority("high")} style={{backgroundColor:`${task?.priority==="high"?"#EEECEC":"none"}`}}>
            <GoDotFill style={{ color: "#FF2473" }} />
            <p>HIGH PRIORITY</p>
          </div>
          <div className={styles.moderatePriority} id="moderate" onClick={() => selectPriority("moderate")} style={{backgroundColor:`${task?.priority==="moderate"?"#EEECEC":"none"}`}}>
            <GoDotFill style={{ color: "#18B0FF" }} />
            <p>MODERATE PRIORITY</p>
          </div>
          <div className={styles.lowPriority} id="low" onClick={() => selectPriority("low")} style={{backgroundColor:`${task?.priority==="low"?"#EEECEC":"none"}`}}>
            <GoDotFill style={{ color: "#63C05B" }} />
            <p>LOW PRIORITY</p>
          </div>
        </div>
      </div>
      <div className={styles.assignTo}>
        <p>Assign To</p>
        <Dropdown boardUser={boardUser} setSelectedEmail={setSelectedEmail} selectedEmail={selectedEmail} setTask={setTask}/>
      </div>
      <div className={styles.checklist}>
        <div className={styles.fullChecklist}>
          {task?.checklist?.map((data, index) => (
            <div className={styles.eachChecklist} key={index}>
              <input
                type="checkbox"
                name="checked"
                checked={data.checked}
                onChange={(event) => handleChecklistChange(index, event)}
              />
              <input
                type="text"
                name="description"
                value={data.description}
                className={styles.description}
                onChange={(event) => handleChecklistChange(index, event)}
              />
              <MdDelete
                type="button"
                onClick={() => deleteItemFromChecklist(index)}
                style={{ color: "red", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
        <div className={styles.addChecklist} onClick={addNewItemForChecklist}>+ Add New</div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.leftside}>
          <DatePicker
            placeholderText="Select due date"
            selected={task?.dueDate ? new Date(task.dueDate) : null}
            onChange={(date) => setTask({ ...task, dueDate: date })}
            className={styles.dueDate}
          />
        </div>
        <div className={styles.rightside}>
          <button className={styles.cancelBtn} onClick={() => setIseditable(false)}>Cancel</button>
          <button className={styles.saveBtn} onClick={editThisTask}>Edit</button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EditComponents;
