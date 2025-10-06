import axios from "axios"
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import Swal from "sweetalert2";

export const useApi = () => {

    const {token, setToken, logOut} = useContext(AuthContext)
    const baseURL = "http://localhost:8080"
    
    //creation of a axios instance in order to send the JWT with all the requests made
    const api = axios.create({
        baseURL : baseURL,
        withCredentials: true
    })
    
    //add token to the header authoritation if exists
    api.interceptors.request.use((config) => {
        const currentToken = localStorage.getItem("accessToken")
        if(currentToken){
            config.headers.Authorization = `Bearer ${currentToken}`
        }
        return config
    })
    
    //if the token is expired try to refresh it
    api.interceptors.response.use(response => response,
        async (error) => {
            const originalReq = error.config

            if (error.response?.status === 401 && 
                !originalReq._retry &&
                originalReq.url !== "/auth/refresh")
                {
                    error.config._retry = true
                    try{

                        const response = await api.post("/auth/refresh", 
                            {refreshToken : localStorage.getItem("refreshToken")})

                        localStorage.setItem("accessToken", response.data.accessToken)
                        localStorage.setItem("refreshToken", response.data.refreshToken)
                        const gettedToken = response.data.accessToken
                        setToken(gettedToken)
                        error.config.headers.Authorization = `Bearer ${gettedToken}`

                        return api(error.config)
                    }catch{
                        Swal.fire({
                            title:"Error",
                            text:"Hubo un error, el sistema va a cerrar sesion",
                            icon:"error",
                            showCloseButton:true
                        })
                        logOut()
                        return Promise.reject(error)
                    }
            }

            return Promise.reject(error)
        }
    )

    return api
}
