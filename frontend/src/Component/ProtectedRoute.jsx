import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { Unauthorized } from '../pages/Unauthorized'


export const ProtectedRoute = ({authRoles}) => {
    const {user} = useContext(AuthContext)

    if(!user){
        return <Unauthorized />
    }

    const isAuthorized = user.roles.some(r => authRoles.includes(r))
    return isAuthorized ? <Outlet /> : <Unauthorized />
  
}
