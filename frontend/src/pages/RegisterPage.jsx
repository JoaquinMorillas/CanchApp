import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { useApi } from '../context/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { InputComponent } from '../Component/InputComponent'
import { FormFieldComponent } from '../Component/FormFieldComponent'
import { useFormValidations } from '../hooks/useFormValidations'

export const RegisterPage = () => {
    const validators = {
        firstName: (v) => {
            if(!v.trim()) return "El nombre es obligatorio"
            return ""
        },
        lastName: (v) => {
            if(!v.trim()) return "El apellido es obligatorio"
            return ""
        },
        email: (v) => {
            if(!v) return "El correo electrónico es obligatorio"
            if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) return "El correo electrónico no es valido"
            return ""
        },
        password: (v) => {
            if(!(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(v))) return "La contraseña debe tener 8 caracteres, tener un número, una mayúscula y un caracter especial"
            if(!v) return "La contraseña es obligatoria"
            return ""
        },
        confirmPassword: (v) => {
            if(v!==password) return "La contraseña no coincide con la anterior"
            return ""
        }
    }
    const {register} = useContext(AuthContext)
    const {errors, handleBlur} = useFormValidations(validators)
    const navigate = useNavigate()
    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    
    
    const handleRegister = async () => {
        if(!firstName){
            Swal.fire({
                title:"error",
                text:"Se requiere un nombre",
                icon:"error",
                showCloseButton:true
            })
            return
        }
         if(!lastName){
            Swal.fire({
                title:"error",
                text:"Se requiere un apellido",
                icon:"error",
                showCloseButton:true
            })
            return
        }
         if(!password){
            Swal.fire({
                title:"error",
                text:"Se requiere una contraseña",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(!confirmPassword){
            Swal.fire({
                title:"error",
                text:"Se requiere una contraseña",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        if(!emailRegex.test(email)){
            Swal.fire({
                title:"error",
                text:`el correo ${email} no es valido`,
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(password !== confirmPassword){
            
            Swal.fire({
                title:"Error",
                text:"La contraseña no coincide con la confirmacion de contraseña",
                icon:"error",
                showCloseButton:true
            })
            return
                    
        }
        
        const response = await register(firstName, lastName, email, password)
        if(response){
            setTimeout(() => {
                navigate("/")
            },10)
        }
    
    }
      return (
        <>
        <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h4 className="mb-4 text-center">Registrarse en solo 1 paso:</h4>
            <div className='container'>
                <div className='row'>
                    <div className='col-8'>
                        <FormFieldComponent
                        label="Nombre"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        error={errors.firstName}
                        onBlur={() => handleBlur("firstName", firstName)}
                        />
                        
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <FormFieldComponent
                        label="Apellido"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        error={errors.lastName}
                        onBlur={() => handleBlur("lastName", lastName)}
                        />
                       
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <FormFieldComponent
                        label="Correo Electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={errors.email}
                        onBlur={() => handleBlur("email", email)}
                        />
                      
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <FormFieldComponent
                        label="Contraseña"
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={errors.password}
                        onBlur={() => handleBlur("password", password)}
                        />

                
                    </div>
                    <div className='col-4'>
                        <img src={isPasswordVisible ? "icons8-visible-32.png" : "icons8-ojo-cerrado-32.png"} 
                    alt="visible/no visible"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{cursor: "pointer", marginLeft: "8px" }} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <FormFieldComponent
                        label="Confirmar Contraseña"
                        type={isConfirmVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                        />
                        
                    </div>
                    <div className='col-4'>
                        <img src={isConfirmVisible ? "icons8-visible-32.png" : "icons8-ojo-cerrado-32.png"} 
                    alt="visible/no visible"
                    onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                    style={{cursor: "pointer", marginLeft: "8px" }} />
                    </div>
                </div>

            </div>
            <div className='d-flex justify-content-center'>

            <button className='btn btn-lg'
            style={{background:"var(--bs-warning)"}}
              onClick={() => handleRegister()}
            >
             Registrarse
            </button>
          </div>
        </div>
        </>
  )
}
