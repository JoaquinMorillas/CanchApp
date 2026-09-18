import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { InputComponent } from '../Component/InputComponent'
import {useApi} from '../context/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useFormValidations } from '../hooks/useFormValidations'
import { FormFieldComponent } from '../Component/FormFieldComponent'

const validators = {
  email: (v) => {
    if(!v) return "El correo electrónico es obligatorio"
    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) return "El correo electrónico no es valido"
    return ""
  },
  password: (v) => {
    if(!v) return "La contraseña es obligatoria"
    return ""
  }

}

export const LoginPage = () => {
  const {user, setUser, token, setToken, login, logOut} = useContext(AuthContext)
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const api = useApi()
  const navigate = useNavigate()
  const {errors, handleBlur} = useFormValidations(validators)

  const handleLogIn = async() => {
    if(!email){
      await Swal.fire({
        title: "Error",
        text: "Debe ingresar un correo electrónico",
        icon:"error",
        showCloseButton:true
      })
      return
    }
    if(!password){
      await Swal.fire({
        title: "Error",
        text: "Debe ingresar una contraseña",
        icon:"error",
        showCloseButton:true
      })
      return
    }
   const success = await login(email, password)
   if(success){
    navigate(-1)
   }
  }

  return (
    <>
    {user ? (
      <div>
        <h3>Ya se encuentra registrado como {user.email}</h3>
        <h4>¿Quieres cerrar sesion?</h4>
        <button className='btn btn-danger' onClick={() => logOut()}>cerrar sesion</button>
      </div>
    ):(
     <div className="text-dark p-4 rounded" 
      style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
        <h4 className="mb-4 text-center">Inicio de Sesion:</h4>
        <div className='container'>
          <div className='row'>
            <div className='col-8'>
              <FormFieldComponent 
              label="Correo Electronico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => handleBlur("email", email)}
              error={errors.email}
              />
              
            </div>
            <div className='row'>

              <div className='col-8'>
                <FormFieldComponent 
                label="Contraseña"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                onBlur={() => handleBlur("password", password)}
                />
                

              </div>
              <div className='col-4'>
                
                  <img src={isVisible ? "icons8-visible-32.png" : "icons8-ojo-cerrado-32.png"} 
                  alt="visible/no visible"
                  onClick={() => setIsVisible(!isVisible)}
                  style={{cursor: "pointer", marginLeft: "8px" }} />
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center'>

            <button className='btn btn-lg'
            style={{background:"var(--bs-warning)"}}
              onClick={() => handleLogIn()}
            >
              Inciar Sesion
            </button>
          </div>
        </div>
          
          
      </div>
    )}
    </>
  )
}
