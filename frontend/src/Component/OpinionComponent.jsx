import React from 'react'
import dayjs from 'dayjs';
import "dayjs/locale/es"
import Avatar from '@mui/material/Avatar'

export const OpinionComponent = ({rating}) => {
    const {userName,value,date,opinion } = rating
     

    /* format the date from "YYYY-MM-DD" to "dddd D [de] MMMM"*/
    const formatDate = (date) => {
        return dayjs(date).locale('es').format('D [/] MM [/] YYYY');
    }

    

  return (
    <div className='d-flex mb-5'> 
        <div className="d-flex flex-column align-items-start gap-1"
        style={{width:"80%", 
            margin:"0 auto",
            border:"1px solid var(--bs-border-color)"}}>
             <div className="d-flex align-items-center w-100 gap-2">

                <Avatar className='ms-1'
                style={{ backgroundColor: 'var(--bs-warning)', 
                    marginTop:"15px",
                    marginBottom:"15px",
                    }}>
                    {userName[0].toUpperCase()}
                </Avatar>
                <span className='me-auto'>{userName.toUpperCase()}</span>
                <span className='me-auto'>Puntuacion: {Array.from({length:value}).map((_,idx) => (
                    <img key={idx} src="/full-ball1.png" alt="" 
                    style={{ width: "25px", height: "25px"}}/>
                ))}</span>
                <span className='ms-auto me-1'>{formatDate(date)}</span>        
             </div>
            {opinion && (
                <div className='w-80 ms-auto me-auto'>
                    <h5 className='text-center mb-3'>{opinion}</h5>
                </div>   
                )}
        </div>
    </div>
  )
}
