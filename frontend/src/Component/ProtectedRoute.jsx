import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'


export const ProtectedRoute = ({authRoles}) => {
    const {user} = useContext(AuthContext)

    if(!user){
        return <Navigate to="/no_autorizado" replace></Navigate>
    }

    const isAuthorized = user.roles.some(r => authRoles.includes(r))
    return isAuthorized ? <Outlet /> : <Navigate to="/no_autorizado" replace />
  
}
