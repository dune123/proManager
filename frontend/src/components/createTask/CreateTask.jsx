import React, { useEffect, useState } from "react";
import styles from "./CreateTask.module.css";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import Dropdown from "./subComponents/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const createTask = ({ setAddTask }) => {
  const token=window.localStorage.getItem("token");
  const userId=window.localStorage.getItem("userId");
  const email=window.localStorage.getItem("email");
  const [duedate, setDuedate] = useState(null);
  const [filter, setFilter] = useState("This Week");
  const [boardUser,setBoardUser] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(email);

  const [formValues, setformValues] = useState({
    title: "",
    priority: "",
    assignTo: selectedEmail,
    checklist: [{checked:"",description:""}],
    dueDate: null,
  });

  const getBoardUser=async()=>{
    try {
        const res=await axios.get("http://localhost:3000/api/user/getBoardUser",{
            headers: {
          Authorization: `Bearer ${token}`,
        }
        })
        if(res.status==200){
            setBoardUser(res.data.allBoardUsers)
        }
        else{
            toast.error(error.data.message)
        }
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }

  useEffect(()=>{
    getBoardUser()
  },[])


  const selectPriority=(priority)=>{
    if(formValues.priority){
      const previousComponent=document.getElementById(formValues.priority);
      if(previousComponent){
        previousComponent.style.backgroundColor="white"
      }
    }
    setformValues((prev)=>({
      ...prev,
      priority:priority
    }))
    const newComponent = document.getElementById(priority);
    if (newComponent) {
      newComponent.style.backgroundColor = "#EEECEC";
    }
  }

//console.log karke dekhna hain isse
  const addNewItemForChecklist=()=>{
        const newChecklistItem={id:formValues.checklist.length,checked:false,description:""}

        setformValues((prevVal)=>({
            ...prevVal,
            checklist:[...prevVal.checklist,newChecklistItem]
        }))
      }
 const deleteItemFromCheclist=(index)=>{
    setformValues((prevVal)=>({ 
        ...prevVal,
        checklist:prevVal.checklist.filter((_,idx)=>idx!==index)
    }))
 }

 //to change the formvalue checklist
 const handleChecklistChange = (index, event) => {
  const { name, value, type, checked } = event.target;
  const newChecklist = [...formValues.checklist];
  newChecklist[index] = {
    ...newChecklist[index],
    [name]: type === "checkbox" ? checked : value,
  };
  setformValues({
    ...formValues,
    checklist: newChecklist,
  });
};

 const addTask=async()=>{
    try {
      const res=await axios.post("http://localhost:3000/api/task/createTask",formValues,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if(res.status==201){
         toast.success(res.data.message)
         setAddTask(false);
      }
      else{
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
 }

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
          <input placeholder="Enter the task" value={formValues.title} onChange={(e)=>setformValues({...formValues,title:e.target.value})}/>
        </div>
        <div className={styles.selectPriority}>
          <label>
            Select Priority <span style={{ color: "red" }}>*</span>
          </label>
          <div className={styles.rightside}>
            <div className={styles.highPriority} id="high" onClick={()=>selectPriority("high")}>
              <GoDotFill style={{ color: "#FF2473" }}/>
              <p>HIGH PRIORITY</p>
            </div>
            <div className={styles.moderatePriority} id="moderate" onClick={()=>selectPriority("moderate")} >
              <GoDotFill style={{ color: "#18B0FF" }}/>
              <p>MODERATE PRIORITY</p>
            </div>
            <div className={styles.lowPriority} id="low" onClick={()=>selectPriority("low")}>
              <GoDotFill style={{ color: "#63C05B" }} />
              <p>LOW PRIORITY</p>
            </div>
          </div>
        </div> 
      <div className={styles.assignTo}>
      {/*Dropdown check */}
            <p>Assign To</p>
            <Dropdown boardUser={boardUser} setSelectedEmail={setSelectedEmail}
              selectedEmail={selectedEmail}
            />
      </div>  
        <div className={styles.checklist}>
        <div className={styles.fullChecklist}>
        {formValues.checklist.map((data, index) => (
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
                onClick={() => deleteItemFromCheclist(index)}
                style={{color:"red",cursor:"pointer"}}
              />
            </div>
          ))}
          </div>
          <div className={styles.addChecklist} onClick={addNewItemForChecklist}>+ Add New</div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.leftside}>
            <DatePicker placeholderText="Select due date" selected={formValues.dueDate} onChange={(date) => setformValues({ ...formValues, dueDate: date })} className={styles.dueDate}/>
          </div>
          <div className={styles.rightside}>
            <button className={styles.cancelBtn} onClick={() => setAddTask(false)}>cancel</button>
            <button className={styles.saveBtn} onClick={addTask}>save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default createTask;
