
import { createContext, useEffect, useState } from "react";
import {jwtDecode }from "jwt-decode"
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    
    const navigate = useNavigate()
    const baseUrl = "http://localhost:8080"
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    /*
    For developing the refreshToken is set on localStorage. but
    for production there has to be changed to a HTTP cookie usigng
    HTTPS 
    */
   
    const login = async (email, password) => {
        try{
            const response = await axios.post(baseUrl +"/auth/login",
                {   
                    "email" :email, 
                    "password" : password},
                
            )
            const gettedAccessToken = response.data.accessToken
            const gettedRefreshToken = response.data.refreshToken
            setToken(gettedAccessToken)
            localStorage.setItem("accessToken", gettedAccessToken)
            localStorage.setItem("refreshToken", gettedRefreshToken)
            const decoded = jwtDecode(gettedAccessToken)
            setUser({
                id: decoded.userId,
                email: decoded.sub,
                roles: decoded.roles,
                firstName: decoded.firstName,
                lastName : decoded.lastName  
            })
            
            return true    
        }catch(error){
            if(error.response?.status === 401){
                await Swal.fire({
                    title:"Credenciales Incorrectas",
                    text:"El correo o la contraseña son incorrectos",
                    icon: "error",
                    showCloseButton:true
                })
                return false
            }
            Swal.fire({
                title:"Error al intentat acceder",
                text:error.response?.data?.message || error.response?.data || error.message,
                icon:"error",
                showCloseButton:true
            })
            return false
        }   
    }

    const register = async (name, lastName, email, password) => {
        try{
            const response = await axios.post(baseUrl + "/auth/register", 
                {name, lastName, email, password})
            const gettedAccessToken = response.data.accessToken
            const gettedRefreshToken = response.data.refreshToken
            localStorage.setItem("accessToken", gettedAccessToken)
            localStorage.setItem("refreshToken", gettedRefreshToken)
            setToken(gettedAccessToken)
            const decoded = jwtDecode(gettedAccessToken)
            setUser({
                id: decoded.userId,
                email: decoded.sub,
                roles: decoded.roles,
                firstName: decoded.firstName,
                lastName : decoded.lastName  
            })
            return true
        }catch(error){
            Swal.fire({
                title:"Error al intentar registrarse",
                text:error.response?.data?.message || error.response?.data || error.message,
                icon:"error"
            })
            return false
        }
    }

    const logOut = async () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/")
    }

    /* this will run on reload or setUp, if a refresh token is
     saved in HTTP cookie(for production) or LocalStorage(for development) 
     the refresh endpoint will send a new
     accessToken and the user will be setted,
     if not the user and token are setted to null
    */
    useEffect(() => {
        const refresh = async () => {
            if(!localStorage.getItem("refreshToken")){
                return
            }
            try{

                const response = await axios.post(baseUrl + "/auth/refresh", 
                    {"refreshToken" : localStorage.getItem("refreshToken")})
    
                const gettedToken = response.data.accessToken
                const gettedRefreshToken = response.data.refreshToken
                localStorage.setItem("accessToken", gettedToken)
                localStorage.setItem("refreshToken", gettedRefreshToken)
                setToken(gettedToken)
                const decoded = jwtDecode(gettedToken)
                setUser({
                    id: decoded.userId,
                    email: decoded.sub,
                    roles: decoded.roles,
                    firstName: decoded.firstName,
                    lastName : decoded.lastName                    
                })
            }catch{
                setToken(null)
                setUser(null)
            }
        }
        refresh()
    },[])

    return(
        <AuthContext.Provider value={{setToken, token, user, login, register, logOut}}>
            {children}
        </AuthContext.Provider>            
    )

}