import { useState, useEffect } from "react";
import styles from "./Board.module.css";
import { GoPeople } from "react-icons/go";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTask from "../createTask/CreateTask";
import AddBoardUser from "../addboarduser/AddBoardUser";
import EditComponents from "../editComponent/EditComponent";
import DeleteComponent from "../deleteComponent/DeleteComponent";

const Board = () => {
  const [filter, setFilter] = useState("This Week");
  const [iseditable, setIseditable] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteComp, setDeleteComp] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [checklistVisibility, setChecklistVisibility] = useState({});
  const [doneArray, setDoneArray] = useState([]);
  const [todoArray, setTodoArray] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [inProgressArray, setInProgressArray] = useState([]);
  const [backlogArray, setBacklogArray] = useState([]);
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);
  const [today, setToday] = useState(null);
  const [addTask, setAddTask] = useState(false);
  const [addBoardUsercont, setAddBoardUsercont] = useState(false);
  const token = window.localStorage.getItem("token");
  const loggedIn = window.localStorage.getItem("email");
  const username = window.localStorage.getItem("username");

  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    let daySuffix;
    if (day % 10 === 1 && day !== 11) {
      daySuffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      daySuffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      daySuffix = "rd";
    } else {
      daySuffix = "th";
    }

    return `${day}${daySuffix} ${month}, ${year}`;
  };

  useEffect(() => {
    setToday(getFormattedDate());
  }, []);

  const toggleDropdown = (taskId) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const toggleChecklist = (taskId) => {
    setChecklistVisibility((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const fullToggleDropdown = () => {
    setChecklistVisibility({});
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  useEffect(() => {
    getAllTask();
  }, [filter]);

  const getAllTask = async () => {
    try {
      const res = await axios.get(
        `https://promanagerbakend-2.onrender.com/api/task/getTask/${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        const tasks = res.data.tasks;
        console.log(tasks);
        setTodoArray(tasks["To Do"] || []);
        setInProgressArray(tasks["In Progress"] || []);
        setDoneArray(tasks["Done"] || []);
        setBacklogArray(tasks["Backlog"] || []);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllTask();
  }, []);

  const getInitials = (email) => {
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return null;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleedit = (taskId) => {
    setEditTask(taskId);
    setIseditable(true);
  };

  const handleDelete = (taskId) => {
    setDeleteComp(true);
    setDeleteTaskId(taskId);
  };

  const changeStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.post(
        "https://promanagerbakend-2.onrender.com/api/task/changeStatus",
        {
          taskId,
          newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 201) {
        toast.success(res.data.message);
        getAllTask();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const changeChecked = async (taskId, checklistItemId, isChecked) => {
    try {
      const res = await axios.post(
        `https://promanagerbakend-2.onrender.com/api/task/changeChecked/${taskId}`,
        { checklistItemId, isChecked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 201) {
        getAllTask();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const renderTask = (task) => (
    <div className={styles.eachBox} key={task._id}>
      <div className={styles.TopCont}>
        <div className={styles.TopContLeft}>
          <GoDotFill
            style={{ fontSize: "1.1rem" }}
            className={`${styles.dot} ${
              task.priority === "high"
                ? styles.dotHigh
                : task.priority === "moderate"
                ? styles.dotModerate
                : styles.dotLow
            }`}
          />
          <p>{task.priority} priority</p>
          {task.assigned != loggedIn ? (
            <div className={styles.initialEmail}>
              {getInitials(task.assigned)}
            </div>
          ) : null}
        </div>
        <div className={styles.TopContRight}>
          <span onClick={() => toggleDropdown(task._id)}>...</span>
          {isOpen[task._id] && (
            <div className={styles.itemBox}>
              <p onClick={() => handleedit(task._id)}>Edit</p>
              <p
                onClick={() => shareTask(task._id)}
                style={{ cursor: "pointer" }}
              >
                Share
              </p>
              <p
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.MiddleCont}>
        <h3>{task.taskName}</h3>
      </div>
      <div className={styles.BottomCont}>
        <div className={styles.BottomTopCont}>
          <div className={styles.ChecklistCnt}>Checklist({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</div>
          <button onClick={() => toggleChecklist(task._id)}>
            {checklistVisibility[task._id] ? (
              <IoIosArrowDown />
            ) : (
              <IoIosArrowUp />
            )}
          </button>
        </div>
        {checklistVisibility[task._id] && (
          <div className={styles.checklist}>
            {task.checklist.map((item) => (
              <div className={styles.eachChecklist} key={item._id}>
                <input
                  type="checkbox"
                  style={{ cursor: "pointer" }}
                  checked={item.checked}
                  onChange={(e) =>
                    changeChecked(task._id, item._id, e.target.checked)
                  }
                />
                <label>{item.description}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        <div
          className={styles.date}
          style={{
            opacity: `${task.dueDate === null ? 0 : 1}`,
            backgroundColor: `${
              task.status === "Done"?"#63C05B":
              new Date(task.dueDate) <= Date.now()
                ? "red"
                : "#EEECEC"
            }`,
            color: `${task.status === "Done" ? "white" : "inherit"}`, 
          }}
        >
          {formatDate(task.dueDate)}
        </div>
        <div className={styles.StatusButton}>
          <button
            style={{ display: `${task.status === "In Progress" && "none"}` }}
            onClick={() => changeStatus(task._id, "In Progress")}
          >
            PROGRESS
          </button>
          <button
            style={{ display: `${task.status === "To Do" && "none"}` }}
            onClick={() => changeStatus(task._id, "To Do")}
          >
            TO-DO
          </button>
          <button
            style={{ display: `${task.status === "Done" && "none"}` }}
            onClick={() => changeStatus(task._id, "Done")}
          >
            DONE
          </button>
          <button
            style={{ display: `${task.status === "Backlog" && "none"}` }}
            onClick={() => changeStatus(task._id, "Backlog")}
          >
            BACKLOG
          </button>
        </div>
      </div>
    </div>
  );

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  const shareTask = async (taskId) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const link=`${protocol}//${host}/taskUnique/${taskId}`
    navigator.clipboard.writeText(link)
    toast.success("Link Copied on clipboard");
  };
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
      <div className={styles.topContainer}>
        <h2>Welcome! {username}</h2>
        <h3>{today}</h3>
      </div>
      <div className={styles.middleContainer}>
        <div className={styles.midLeftCont}>
          <h2>Board</h2>
          <button
            className={styles.addpeople}
            onClick={() => setAddBoardUsercont(true)}
          >
            <GoPeople /> Add People
          </button>
        </div>
        <div className={styles.datefilter}>
          <select
            value={filter}
            onChange={handleFilterChange}
            className={styles.dropdown}
          >
            <option value="This Week">This Week</option>
            <option value="Today">Today</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>
      <div className={styles.BottomContainer}>
        <div className={styles.eachStatusContainer}>
          <div className={styles.TopContainer}>
            <p>Backlog</p>
            <div className={styles.Topleft}>
              <img
                src="/Group.png"
                className={styles.icon}
                onClick={fullToggleDropdown}
              />
            </div>
          </div>
          <div className={styles.BottomCont}>
            {backlogArray && backlogArray.map((task) => renderTask(task))}
          </div>
        </div>
        <div className={styles.eachStatusContainer}>
          <div className={styles.TopContainer}>
            <p>To Do</p>
            <div className={styles.Topleft}>
              <p className={styles.add} onClick={() => setAddTask(true)}>
                +
              </p>
              <img
                src="/Group.png"
                className={styles.icon}
                onClick={fullToggleDropdown}
              />
            </div>
          </div>
          <div className={styles.BottomCont}>
            {todoArray && todoArray.map((task) => renderTask(task))}
          </div>
        </div>
        <div className={styles.eachStatusContainer}>
          <div className={styles.TopContainer}>
            <p>In Progress</p>
            <div className={styles.Topleft}>
              <img
                src="/Group.png"
                className={styles.icon}
                onClick={fullToggleDropdown}
              />
            </div>
          </div>
          <div className={styles.BottomCont}>
            {inProgressArray && inProgressArray.map((task) => renderTask(task))}
          </div>
        </div>
        <div className={styles.eachStatusContainer}>
          <div className={styles.TopContainer}>
            <p>Done</p>
            <div className={styles.Topleft}>
              <img
                src="/Group.png"
                className={styles.icon}
                onClick={fullToggleDropdown}
              />
            </div>
          </div>
          <div className={styles.BottomCont}>
            {doneArray && doneArray.map((task) => renderTask(task))}
          </div>
        </div>
      </div>
      {addTask && <CreateTask setAddTask={setAddTask} />}
      {addBoardUsercont && (
        <AddBoardUser setAddBoardUser={setAddBoardUsercont} />
      )}
      {iseditable && (
        <EditComponents editTask={editTask} setIseditable={setIseditable} />
      )}
      {deleteComp && (
        <DeleteComponent
          setDeleteComp={setDeleteComp}
          deleteTaskId={deleteTaskId}
        />
      )}
    </div>
  );
};

export default Board;
