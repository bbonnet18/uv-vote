import './App.css';
import { useState,useEffect } from 'react';


function Countdown() {

    const[quarterInfo, setQuarterInfo] = useState({});
    // This function calculates the current quarter and the number of days left in it.
    // It uses the current date to determine which quarter it is and how many days are left
    useEffect(() => {
        const currentQuarter = getQuarterInfo();
        setQuarterInfo(currentQuarter);
    }, []);


    // This component is used to display a countdown or a message when voting is closed.
    // It can be used to show a message to users after the voting period has ended. 

  function getQuarterInfo(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const quarters = [
        { q: 1, start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
        { q: 2, start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
        { q: 3, start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
        { q: 4, start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
    ];

    const currentQuarter = quarters.find(q => date >= q.start && date <= q.end);
    const daysLeft = Math.ceil((currentQuarter.end - date) / (1000 * 60 * 60 * 24));

    return {
        quarter: currentQuarter,
        daysLeftInQuarter: daysLeft
    };
  }
    return (
        <div className='countdown'>
           <div>Days Left to Vote in Q{quarterInfo.quarter?.q}:</div> 
           <div className='count'>{quarterInfo.daysLeftInQuarter}</div>
        </div>
    );
}

export default Countdown;