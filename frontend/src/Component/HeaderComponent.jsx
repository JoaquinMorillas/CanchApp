import React from 'react'
import { Link } from 'react-router-dom'

export const HeaderComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg bd-navbar sticky-top bg --bs-secondary"
    style={{ "backgroundColor": "var(--bs-success)" }} >
        <div className="container-fluid">
          <Link to={"/"}>
            <img src="/icons8-deportes-color-96.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
          </Link>
            
            
            <span className='fw bold'>
              CanchApp{" "}
              <span className='d-none d-md-inline'>
                | Juga más, busca menos
              </span>
            </span>
             
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
              <button className="btn btn-warning w-30 w-lg-auto">Registrarse</button>
              <button className="btn btn-primary w-100 w-lg-auto">Iniciar Sesión</button>
            </div>
          </div>
        </div>
        
        
    </nav>
  )
}