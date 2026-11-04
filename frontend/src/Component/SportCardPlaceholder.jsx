import React from 'react'

export const SportCardPlaceholder = () => {
  return (
    
        <div className="card" aria-hidden="true"
        style={{
          width: "100%", 
          height: "350px",
          objectFit: "contain"
        }}>
            <div className="placeholder-glow">
                <span className="placeholder col-12" style={{ height: "180px" }}></span>
            </div>
        <div className="card-body d-flex flex-column justify-content-between" >
            <h5 className="card-title placeholder-glow d-flex flex-column justify-content-between">
            <span className="placeholder col-6 align-self-center"></span>
            </h5>
            <p className="card-text placeholder-glow ">
            
            </p>
            <a className="btn btn-lg mt-2 align-self-center disabled placeholder col-6" aria-disabled="true"
            style={{ backgroundColor: "var(--bs-dark)", color: "var(--bs-light)" }}></a>
        </div>
        </div>
    
    
  )
}
