import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Avatar from '@mui/material/Avatar'
import { InputComponent } from '../Component/InputComponent'
import { useApi } from '../context/AxiosInstance'

export const UserInfoPage = () => {
    const api = useApi()
    const {user, logOut} = useContext(AuthContext)
    const [reservations, setReservations] = useState([])
    const [stablishments, setStablishments] = useState([])
    
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month -1, day)
      const monthToReturn = String(date.getMonth() +1).padStart(2,"0")
      const dayToReturn = String(date.getDate()).padStart(2, "0")
      const name = Intl.DateTimeFormat("es-Es",{weekday: "long"}).format(date)

      return name.toUpperCase() +" " + dayToReturn + "-" + monthToReturn
    }
    const initials = (user) => {
  
      const firstName = user.firstName
      const firstChar = firstName.charAt(0).toUpperCase()
      const lastName = user.lastName
      const secondChar = lastName.charAt(0).toUpperCase()
      
      return firstChar+secondChar
  }

  
  useEffect(() => {
    const getReservations = async () => {
      try{
        const response = await api.get(`/reservation/user/${user.id}`)
        const gettedReservations = response.data
        setReservations(gettedReservations)
      }catch(error){
        Swal.fire({
          title:"Error al buscar las reservas",
          text:error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
      }
    }
    const getStablishments = async () => {
      try{
        const response = await api.get(`/stablishment/user/${user.id}`)
        const gettedStablishments = response.data
        setStablishments(gettedStablishments)
      }catch(error){
        Swal.fire({
          title:"Error al buscar los establecimientos",
          text:error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
    }
  }
    getReservations()
    getStablishments()
  }, [])

  return (
    <>
      <div className='d-flex flex-column align-items-center'
      style={{backgroundColor: "var(--bs-light)", maxWidth: "80%",
      border:"1px solid var(--bs-border-color)",
      borderRadius:"3%",
      margin:"0 auto",
      padding:"1rem"}}>
        <div className='container'>

          <div className='row justify-content-center align-items-center'>
            <div className='col-12'>
              <h3 className='text-center'> 
                Bienvenido {user.firstName.toUpperCase()} 
              </h3>
            </div>

            <div className='row justify-content-center align-items-center'>
              <div className='col-12 text-center'>
                <Avatar className="mx-auto mb-3 mt-3"
                  style={{ backgroundColor: 'var(--bs-warning)',}}
                  >
                    {initials(user)}
                  </Avatar>
              </div>
            </div>

            <div className='row justify-content-center align-items-center'>
              <div className='col-12'>
                <h4 className='text-xl-center mb-5'>Informacion Personal: </h4>
              </div>
            </div>

             <div className='row justify-content-center align-items-center'>
              <div className='col-md-7 mx-auto'>
                <InputComponent label='Nombre' disabled={true} value={user.firstName.toUpperCase()}></InputComponent>
              </div>
             </div>

             <div className='row justify-content-center align-items-center'>
              <div className='col-md-7 mx-auto'>
                <InputComponent label='Apellido' disabled={true} value={user.lastName.toUpperCase()}></InputComponent>
              </div>
             </div>

             <div className='row justify-content-center align-items-center'>
              <div className='col-md-7 mx-auto'>
                <InputComponent label='Email' disabled={true} value={user.email.toUpperCase()}></InputComponent>
              </div>
             </div>

             <div className='row justify-content-center align-items-center'>
              <div className='col-md-7 mx-auto'>
                <InputComponent label='Rol' disabled={true} 
                value={user.roles == "ROLE_ADMIN" ? "ADMINISTRADOR" : user.roles == "ROLE_OWNER" ? "DUEÑO" : "JUGADOR"}>

                </InputComponent>
              </div>
             </div>

          </div>  
        </div>
      
        {reservations.length > 0 ?(
          <div className='d-flex flex-column align-items-center'>
            <h4 className='mt-3 mb-3 text-center'>Mis Reservas:</h4>

            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th scope="col" className='text-center'>Id de Reserva</th>
                  <th scope="col" className='text-center'>Establecimiento</th>
                  <th scope="col" className='text-center'>Cancha</th>
                  <th scope='col' className='text-center'>Día</th>
                  <th scope='col' className='text-center'>Horario de entrada</th>
                  <th scope='col' className='text-center'>Estado de Reserva</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <th className='text-center'>
                      {reservation.id}
                    </th>
                    <td className='text-center'>
                      {reservation.stablishmentName}
                    </td>
                    <td className='text-center'>
                      {reservation.sportFieldName}
                    </td>
                    <td className='text-center'> 
                      {formatDate(reservation.reservationDate)}
                    </td>
                    <td className='text-center'>
                      {reservation.beginingHour.slice(0,5)} hs
                    </td>
                    <td className='text-center'>
                      {reservation.reservationStatus == "CONFIRMED" ? "Confirmado"
                      : "Cancelado"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table> 
        </div>
        ):(
            <h3>Todavia No tienes ninguna Reserva...Explora la pagina de incio para comenzar a jugar!</h3>
          )}
        {stablishments.length > 0 &&(
          <div className='d-flex flex-column align-items-center'>
            <h4 className='mt-3 mb-3 text-center'>Mis Establecimientos:</h4>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th scope="col" className='text-center'>Id de Establecimiento</th>
                  <th scope="col" className='text-center'>Nombre</th>
                  <th scope="col" className='text-center'>Dirección</th>
                  <th scope='col' className='text-center'>Deportes</th>
                  <th scope='col' className='text-center'>Cantidad de canchas</th>
                </tr>
              </thead>
              <tbody>
                {stablishments.map((stablishment) => (
                  <tr key={stablishment.id}>
                    <th className='text-center'>
                      {stablishment.id}
                    </th>
                    <td className='text-center'>
                      {stablishment.name}
                    </td>
                    <td className='text-center'>
                      {stablishment.street.toUpperCase()} {stablishment.number} {stablishment.city.toUpperCase()}
                    </td>
                    <td className='text-center'>
                      {stablishment.sports.length > 0 ? (
                        stablishment.sports.map((sport, index) => (
                          <span key={index} className="badge bg-primary me-1">
                            {sport}
                          </span>
                        ))
                      ) : (
                        "--"
                      )}
                    </td>
                    <td className='text-center'>
                      {stablishment.sportFieldsNames.length}
                    </td>
                  </tr>
                ))}
              </tbody>

              </table>
          </div>    
        )}
      </div>

    </>
  )
}
