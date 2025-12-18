import React, { useContext, useEffect, useState } from 'react'
import { useApi } from '../context/AxiosInstance'
import Swal from 'sweetalert2'
import { LoadingContext } from '../context/LoadingContext'

export const AdminUsers = () => {
  const api = useApi()
  const {startLoading, stopLoading} = useContext(LoadingContext)
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [owners, setOwners] = useState([])
  const [players, setPlayers] = useState([])

  const changeRole = async (userId, newRol) => {
    const confirmed = await Swal.fire({
      title: "¡Atencion!",
      text:`Estas seguro que quires cambiar el rol del usuario n° ${userId} a ${newRol} ?`,
      icon: "warning",
      showCancelButton:true,
      showConfirmButton:true

    })
    if(confirmed.isConfirmed){
      try{
        startLoading()
        await api.put(`/user/update/${userId}`, {"role" : newRol})
        
        Swal.fire({
          title:"Exito",
          text: `El usuario n° ${userId} ahora es ${newRol}`,
          icon:"success",
          showCloseButton:true
        })
        const response = await api.get("/user/all")
        const gettedUsers = response.data
        setUsers(gettedUsers)
        setAdmins(gettedUsers.filter(u => u.role == "ADMIN"))
        setOwners(gettedUsers.filter(u => u.role == "OWNER"))
        setPlayers(gettedUsers.filter(u => u.role == "USER"))
      }catch(error){
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || error.response?.data || error.message,
            icon: "error"
            });
        }finally{
          stopLoading()
        }
      }

    }
  

  useEffect(() => {
    const getUsers = async () => {
      try{
        startLoading()
        const response = await api.get("/user/all")
        const gettedUsers = response.data
        setUsers(gettedUsers)
        setAdmins(gettedUsers.filter(u => u.role == "ADMIN"))
        setOwners(gettedUsers.filter(u => u.role == "OWNER"))
        setPlayers(gettedUsers.filter(u => u.role == "USER"))
      }catch(error){
        Swal.fire({
          title: "error",
          text: error.response?.data?.message || error.response?.data || error.message,
          icon: "error"
        })
      }finally{
        stopLoading()
      }
      
      
    }
    getUsers()
  },[])
  return (
    <>
    <h2 className='text-center'>Listas de usuarios:</h2>
    <h3 className='text-left ps-3'>Administradores:</h3>
    {admins.length > 0 ? (
        <table className="table table-striped table-hover">
            <thead style={{ 
              backgroundColor: 'var(--bs-light)' }}>
                <tr>
                  <th scope="col" className='text-center'>id</th>
                  <th scope="col" className='text-center'>Nombre</th>
                  <th scope="col" className='text-center'>Apellido</th>
                  <th scope="col" className='text-center'>Email</th>
                  <th scope="col" className='text-center'>Rol</th>
                  <th scope="col" className='text-center'>Cantidad de establecimientos</th>
                  <th scope="col" className='text-center'>Cantidad de reservas</th>
                  <th scope="col" className='text-center'>Cambiar Rol</th>

                </tr>
              </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <th scope= "row" className='text-center'>{admin.id}</th>

                      <td className='text-center'>
                        {admin.name}
                      </td>
                      <td className='text-center'>
                        {admin.lastName}
                      </td>
                      <td className='text-center'>
                        {admin.email}
                      </td>
                      <td className='text-center'>
                        {admin.role}
                      </td>
                      <td className='text-center'>
                        {admin.stablishments?.length || 0}
                      </td>
                      <td className='text-center'>
                        {admin.reservations?.length || 0}
                      </td>
                      <td>
                        <div className='d-flex justify-content-center'>
                          <button className='btn btn-danger m-2' 
                          onClick={() => changeRole(admin.id, "USER")}>
                            Cambiar a "Jugador"
                            </button>
                          <button className='btn btn-danger m-2'
                          onClick={() => changeRole(admin.id, "OWNER")}>
                            Cambiar a "Dueño"
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

        </table>
      
    ):(
      <div>
        no hay administradores
      </div>
    )}
    <h3 className='text-left ps-3'>Dueños:</h3>
    {owners.length > 0 ? (
      <table className="table table-striped table-hover">
        <thead style={{ 
            backgroundColor: 'var(--bs-light)' }}>
          <tr>
            <th scope='col' className='text-center'>id</th>
            <th scope="col" className='text-center'>Nombre</th>
            <th scope="col" className='text-center'>Apellido</th>
            <th scope="col" className='text-center'>Email</th>
            <th scope="col" className='text-center'>Rol</th>
            <th scope="col" className='text-center'>Cantidad de establecimientos</th>
            <th scope="col" className='text-center'>Cambiar Rol</th>
          </tr>
        </thead>
        <tbody>
            {owners.map(owner => (
              <tr key={owner.id}>
                <th scope='row' className='text-center'>{owner.id}</th>
                <td className='text-center'>
                  {owner.name}
                </td>
                <td className='text-center'>
                  {owner.lastName}
                </td>
                <td className='text-center'>
                  {owner.email}
                </td>
                <td className='text-center'>
                  {owner.role}
                </td>
                <td className='text-center'> 
                  {owner.stablishments?.length || 0}
                </td>
                <td className='d-flex justify-content-center'>
                  <button className='btn btn-danger m-2'
                  onClick={() => changeRole(owner.id , "ADMIN")}>
                    Cambiar a "Administrador"
                    </button>
                  <button className='btn btn-danger m-2'
                  onClick={() => changeRole(owner.id, "USER")}>
                    Cambiar a "Jugador"
                    </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ):(
      <div>
        no hay dueños
      </div>
    )}
    <h3 className='text-left ps-3'>Jugadores:</h3>
    <table className="table table-striped table-hover">
      <thead tyle={{ 
            backgroundColor: 'var(--bs-light)' }}>
        <tr>
          <th scope='col' className='text-center'>id</th>
          <th scope="col" className='text-center'>Nombre</th>
          <th scope="col" className='text-center'>Apellido</th>
          <th scope="col" className='text-center'>Email</th>
          <th scope="col" className='text-center'>Rol</th>
          <th scope="col" className='text-center'>Cantidad de reservas</th>
          <th scope="col" className='text-center'>Cambiar Rol</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => (
          <tr key={player.it}>
            <th scope='row' className='text-center'>{player.id}</th>
            <td className='text-center'>
              {player.name}
            </td>
            <td className='text-center'>
              {player.lastName}
            </td>
            <td className='text-center'>
              {player.email}
            </td>
            <td className='text-center'>
              {player.role}
            </td>
            <td className='text-center'>
              {player.reservations?.length || 0}
            </td>
            <td className='d-flex justify-content-center'> 
              <button className='btn btn-danger m-2' 
              onClick={() => changeRole(player.id, "ADMIN")}>
                Cambiar a "Administrador"
                </button>
              <button className='btn btn-danger m-2'
              onClick={() => changeRole(player.id, "OWNER")}>
                Cambiar a "Dueño"
                </button>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
    </>
  )
}
