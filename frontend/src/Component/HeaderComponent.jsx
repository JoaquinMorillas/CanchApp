import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import Avatar from '@mui/material/Avatar'

export const HeaderComponent = () => {
  const {user, logOut} = useContext(AuthContext)
  const navigate = useNavigate()
  const [openOptions, setOpenOptions] = useState(false)

  const initials = (user) => {
    
    const firstName = user.firstName
    const firstChar = firstName.charAt(0).toUpperCase()
    const lastName = user.lastName
    const secondChar = lastName.charAt(0).toUpperCase()
    
    return firstChar+secondChar
  }

  const handleLogOut = async () => {
    const confirmed = await Swal.fire({
      title:"Atencion",
      text: `¿Estas seguro que quieres cerrar sesion?`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Aceptar",
      cancelButtonText:"Cancelar"
    })

    if (confirmed.isConfirmed){
      await logOut()
      setTimeout(() => {
        navigate("/")
      },10)
    }
  }
  return (
    <nav className="navbar navbar-expand-lg bd-navbar sticky-top"
  style={{ backgroundColor: "var(--bs-primary)", color:"var(--bs-dark)"}}>
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
          {user ? (

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0 align-items-end">
              
              {user && ((user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_OWNER")) && (
                <Link to={"/administracion"}>
                  <button className='btn btn-secondary w-30 w-lg-auto'>Administracion</button>
                </Link>
              ))}
                <Avatar className='ms-3 me-3' 
                style={{ backgroundColor: 'var(--bs-warning)', cursor:"pointer"}}
                onClick = {() => setOpenOptions(!openOptions)}
                >{initials(user)}
                </Avatar>
              
                </div>
              {/* 
              
              <button className="btn  w-100 w-lg-auto" onClick={() => handleLogOut()}
                style={{background: "var(--bs-secondary)", color:"var(--bs-light)"}}>
                  Cerrar Sesión</button>
              */}
              {openOptions && (
                <div className="dropdown-menu show mt-5"
                style={{backgroundColor:"var(--bs-light)",
                  position: "absolute",
                  top: "20%",
                  right: "0",
                  minWidth: "200px",
                  zIndex: 1050,
                }}>
                  <button
                  className='dropdown-item mb-2 disabled'
                  >
                    <Avatar>
                      {initials(user)}
                    </Avatar>
                    <span> {user.email}</span>
                  </button>
                    <Link
                      to={"/perfil"}
                      className="dropdown-item mb-2"
                      onClick={() => setOpenOptions(!openOptions)}
                    >
                      Ir a Perfil
                    </Link>
                    <button
                      className="dropdown-item mb-2"
                      onClick={handleLogOut}
                      
                    >
                      Cerrar Sesión
                    </button>
                    <button
                    className='dropdown-item btn btn-close text-center mt-2'
                    aria-label='Close'
                    onClick={() => setOpenOptions(!openOptions)}
                    style={{margin: "0 auto"}}>
                    </button>
                </div>
              )}
          </div> 
          ) : (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
              <Link to={"/register"}>
                <button className="btn btn-warning w-30 w-lg-auto">Registrarse</button>
              </Link>
              <Link to={"/login"}>
                <button className="btn btn-primary w-100 w-lg-auto">Iniciar Sesión</button>
              </Link>
            </div>
          </div>
          )}
        </div>
        
        
    </nav>
  )
}