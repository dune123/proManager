import React, { useEffect, useState } from 'react';
import styles from "./Dashboard.module.css";
import { GoPeople } from 'react-icons/go';
import { IoIosLogOut } from "react-icons/io";
import { FiDatabase } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";
import { LuLayout } from "react-icons/lu";
import Board from '../../components/board/Board';
import Analytics from '../../components/analytics/Analytics';
import Setting from '../../components/settings/Setting';
import { useAsyncError } from 'react-router-dom';
import LogoutComponents from '../../components/logoutComponent/LogoutComponents';

const Dashboard = () => {
    const [selectedCategory, setSelectedCategory] = useState("board");
    const [logoutComp,setLogoutComp]=useState(false);

    const selectCat = (category) => {
        if(selectedCategory!==null){
        document.getElementById(selectedCategory).style.backgroundColor="white"
        }
        setSelectedCategory(category);
    }

    const getBackgroundColor = (category) => {
        return selectedCategory === category ? "rgba(67, 145, 237, 0.1)" : "none";
    }

    return (
        <>
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.upperContainer}>
                    <img className={styles.Prologo} src="./siteLogo.png" alt="Site Logo" />
                    <div className={styles.sidebarItems}>
                        <div 
                            className={styles.board} 
                            id="board" 
                            onClick={() => selectCat("board")} 
                            style={{ backgroundColor: getBackgroundColor("board") }}
                        >
                            <LuLayout className={styles.boardlogo} />
                            <p>Board</p>
                        </div>
                        <div 
                            className={styles.board} 
                            id="analytics" 
                            onClick={() => selectCat("analytics")} 
                            style={{ backgroundColor: getBackgroundColor("analytics") }}
                        >
                            <FiDatabase className={styles.analyticslogo} />
                            <p>Analytics</p>
                        </div>
                        <div 
                            className={styles.board} 
                            id="settings" 
                            onClick={() => selectCat("settings")} 
                            style={{ backgroundColor: getBackgroundColor("settings") }}
                        >
                            <MdOutlineSettings className={styles.settinglogo} />
                            <p>Setting</p>
                        </div>
                    </div>
                </div>
                <div className={styles.logout}>
                    <IoIosLogOut className={styles.logIcon} />
                    <p onClick={()=>setLogoutComp(true)}>Logout</p>
                </div>
            </div>
            <div className={styles.rightContainer}>
                {selectedCategory === "board" && <Board />}
                {selectedCategory === "analytics" && <Analytics />}
                {selectedCategory === "settings" && <Setting />}
            </div>
        </div>
        {
            logoutComp&&<LogoutComponents setLogoutComp={setLogoutComp}/>
        }
        </>
    );
}

export default Dashboard;
