import React from 'react'
import { Link } from 'react-router-dom'

export const SportCardComponent = ( { sport, showButton = true, width="100%", height="150px", link=sport.buttonlink, buttonText="Ver más"  }) => {
  return (
    <>
    <div className="card text-center d-flex flex-column justify-content-between h-100">
        <img src={sport.imgLink}
         class="card-img-top mt-3" 
         alt={sport.title} 
         style={{
          width: width, 
          height: height,
          objectFit: "contain"
        }}/>
        <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">{sport.title}</h5>
            {showButton && (
              <Link to={link}>
                <button className="btn btn-lg mt-2 align-self-center"
                style={{ backgroundColor: "var(--bs-dark)", color: "var(--bs-light)" }}>
                  {buttonText}
                </button>
              </Link>
            )}
        </div>
    </div>

    </>
  )
}
