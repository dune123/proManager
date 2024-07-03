import React from 'react'
import styles from "./FinalCard.module.css"

const FinalCard = ({email,setAddBoardUser}) => {
  return (
    <div className={styles.superContainer}>
        <div className={styles.container}>
            <h2>{email} added to board</h2>
            <button onClick={()=>setAddBoardUser(false)}>Okay,got it</button>
        </div>
    </div>
  )
}

export default FinalCard