import React, { useState } from 'react'
import styles from "./Home.module.css"
import Login from '../../components/login/Login'
import Register from '../../components/register/Register'

const Home = () => {
  const [loginstatus,setLoginstatus]=useState(true)

  return (
    <div className={styles.fullContainer}>
        <div className={styles.rightContainer}>
          <img src="./Art.png"/>
          <h3>Welcome aboard my friend</h3>
          <p>just a couple of clicks and we start</p>
        </div>
        <div className={styles.leftContainer}>
          {
            loginstatus?<Login setLoginstatus={setLoginstatus}/>:<Register setLoginstatus={setLoginstatus}/>
          }
        </div>
    </div>
  )
}

export default Home