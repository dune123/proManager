import React, { useState } from 'react';
import styles from './Dropdown.module.css'; 
import { FaAngleDown } from "react-icons/fa6";

const Dropdown = ({boardUser,setSelectedEmail,selectedEmail,setTask}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (email) => {
    setSelectedEmail(email);
    setTask((prevFormValues) => ({
      ...prevFormValues,
      assigned: email
    }));
    setIsOpen(false);
  };

  const getInitials = (email) => {
    if (email) {
        return email.slice(0, 2).toUpperCase();
    }
    return null;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        <input 
          type="text" 
          value={selectedEmail} 
          placeholder=""
        />
        <span className={styles.dropdownArrow}><FaAngleDown/></span>
      </div>
      {isOpen && (
        <div className={styles.dropdownList}>
          {boardUser.map((data, index) => (
            <div key={index} className={styles.dropdownItem} onClick={() => handleSelect(data.email)}>
              <span className={styles.dropdownAvatar}>{getInitials(data.email)}</span>
              <span className={styles.dropdownEmail}>{data.email}</span>
              <button className={styles.assignButton}>Assign</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
