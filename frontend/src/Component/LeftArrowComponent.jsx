import React from 'react'
import { useNavigate } from 'react-router-dom'
 

export const LeftArrowComponent = () => {
    const navigate = useNavigate()
  return (
    <div className="position-fixed top-10 end-0 m-3"
      style={{ cursor: "pointer", zIndex:"1000"}}
      onClick={() => navigate(-1)}>
        <img src="/public/icons8-left-arrow-100.png" alt="go back" />
    </div>
  )
}
