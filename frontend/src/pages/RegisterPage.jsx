import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { useApi } from '../context/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { InputComponent } from '../Component/InputComponent'

export const RegisterPage = () => {
    const {register} = useContext(AuthContext)
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
                text:"Se nececita agreagar un nombre",
                icon:"error",
                showCloseButton:true
            })
            return
        }
         if(!lastName){
            Swal.fire({
                title:"error",
                text:"Se nececita agreagar un apellido",
                icon:"error",
                showCloseButton:true
            })
            return
        }
         if(!password){
            Swal.fire({
                title:"error",
                text:"Se nececita agreagar una contraseña",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(!confirmPassword){
            Swal.fire({
                title:"error",
                text:"Se nececita agreagar una contraseña",
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
                        <InputComponent label="Nombre"type="text" value={firstName} setValue={setFirstName}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <InputComponent label="Apellido" type="text" value={lastName} setValue={setLastName}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <InputComponent label="Email" type="text" value={email} setValue={setEmail}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <InputComponent label="contraseña" type={isPasswordVisible ? "text" : "password"} value={password} setValue={setPassword}/>
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
                        <InputComponent label="Confirmar Contraseña" type={isConfirmVisible ? "text" : "password"} value={confirmPassword} setValue={setConfirmPassword}/>
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
