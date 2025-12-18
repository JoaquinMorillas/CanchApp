import {  createContext, useEffect, useState } from "react";

export const LoadingContext = createContext()

export const LoadingProvider = ({children}) =>{

    const [loading, setLoading] = useState(false)

    const startLoading = () => {
        setLoading(true)
    }

    const stopLoading = () => {
        setLoading(false)
    }

    useEffect(() => {
        document.body.style.cursor = loading ? "wait" : "default"
        return () =>{
            document.body.style.cursor = "default"
        } 
    },[loading])

    return (
        <LoadingContext.Provider value={{loading, startLoading, stopLoading}}>
            {children}
        </LoadingContext.Provider>
    )
}