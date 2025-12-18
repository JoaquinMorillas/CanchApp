import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Avatar from '@mui/material/Avatar'
import { LoadingContext } from '../context/LoadingContext'
import { InputComponent } from '../Component/InputComponent'
import { useApi } from '../context/AxiosInstance'
import { StablishmentContext } from '../context/StablishmentContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const UserInfoPage = () => {
    const api = useApi()
    const navigate = useNavigate()
    const {startLoading, stopLoading} = useContext(LoadingContext)
    const {stablishments} = useContext(StablishmentContext)
    const allStablishments = stablishments.all
    const {user, deleteFavorite} = useContext(AuthContext)
    const [reservations, setReservations] = useState([])
    const [sortedReservations, setSortedReservations] = useState([]) 
    const [ownedStablishments, setOwnedStablishments] = useState([])
    const [favorites, setFavorites] = useState([])
     
    const [currentReservationPage, setCurrentReservationPage] = useState(1)
    const totalItemsPerPage = 5
    const totalReservationPages = Math.ceil(sortedReservations.length/totalItemsPerPage)
    const startIndex = (currentReservationPage - 1) * totalItemsPerPage
    const endIndex = startIndex + totalItemsPerPage
    const currentReservations = sortedReservations.slice(startIndex,endIndex)


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

  const handleTableClick = (id) => {
    navigate(`/establecimientos/${id}`)
  }

  const handleDeleteFavorite = async(id) => {
    const confirm = await Swal.fire({
      title:"Atencion",
      text:"¿Estas seguro que quieres quitar el establecimento de tus favoritos?",
      icon:"question",
      showConfirmButton:true,
      showCancelButton:true
    })
    if(confirm.isConfirmed){
      startLoading()
      await api.post(`/user/${user.id}/favorites/delete/${id}`)
      deleteFavorite(id)

      setFavorites((allStablishments.filter(stablishment => user.favorites.includes(stablishment.id))))
      stopLoading()
    }
  }
  
  const handleCancelReservation = async (reservation) => {
    const confirm = await Swal.fire({
      title:"Atencion",
      text:"¿Estas seguro que quieres cancelar esta reserva?",
      icon:"question",
      showConfirmButton:true,
      showCancelButton:true
    })
    if(confirm.isConfirmed){
      try{
        startLoading()
        const response = await api.put(`/reservation/cancel/${reservation.id}`)
        const canceledReservation = response.data
        setReservations(prev => (
          prev.map((reservation) => reservation.id == canceledReservation.id 
          ? {...reservation, reservationStatus : "CANCELED"}
          : reservation)
        ))
        setSortedReservations(prev => (
          prev.map((reservation) => reservation.id == canceledReservation.id 
          ? {...reservation, reservationStatus : "CANCELLED"}
          : reservation)
        ))
      }catch(error){
        Swal.fire({
          title:"Error al buscar las reservas",
          text:error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
      }finally{
        stopLoading()
      }
    }
  }
  useEffect(() => {
    const getReservations = async () => {
      try{
        startLoading()
        const response = await api.get(`/reservation/user/${user.id}`)
        const gettedReservations = response.data
        setReservations(gettedReservations)
        setSortedReservations(gettedReservations.sort((a,b) => {
          const firstDate = new Date(a.reservationDate)
          const secondDate = new Date(b.reservationDate)
          return(secondDate - firstDate)
        }))
      }catch(error){
        Swal.fire({
          title:"Error al buscar las reservas",
          text:error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
      }finally{
        stopLoading()
      }
    }
    const getStablishments = async () => {
      try{
        startLoading()
        const response = await api.get(`/stablishment/user/${user.id}`)
        const gettedStablishments = response.data
        setOwnedStablishments(gettedStablishments)
      }catch(error){
        Swal.fire({
          title:"Error al buscar los establecimientos",
          text:error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
    }finally{
      stopLoading()
    }
  }
    
    getReservations()
    getStablishments()
  }, [])

  useEffect(() => {
    const favoritesIds = user.favorites || []
    setFavorites((allStablishments.filter(stablishment => favoritesIds.includes(stablishment.id))))
  },[user?.favorites, allStablishments])

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
              <tbody style={{ minHeight: `${58 * totalItemsPerPage}px` }}>
                {currentReservations.map((reservation) => (
                  <tr key={reservation.id}
                  >
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
                    <td className='text-center'
                    style={{ backgroundColor: reservation.reservationStatus == "CONFIRMED" 
                  ? "var(--bs-primary)" 
                  : reservation.reservationStatus == "CANCELLED" ? "var(--bs-danger)" : "var(--bs-warning)"}}>
                      {reservation.reservationStatus == "CONFIRMED" 
                      ? "CONFIRMADA"
                      : reservation.reservationStatus == "FULLFILED" ? "COMPLETADA" : "CANCELADA"}
                    </td>
                    <td>

                    {reservation.reservationStatus == "CONFIRMED" && (
                      <button className="btn btn-danger m-auto"
                      onClick={() => handleCancelReservation(reservation)}>
                        Cancelar Reserva
                      </button>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/*Pagination Control*/}
            <nav>
                <ul className='pagination justify-content-center m-3'>
                  <li className={`page-item ${currentReservationPage == 1 ? "disabled" : ""}`}>
                    <button className='page-link'
                    onClick={() => setCurrentReservationPage(prev => prev -1)}>
                      Anterior
                    </button>
                  </li>
                  {Array.from({length : totalReservationPages}).map((_, index) => (
                    <li className={`page-item ${currentReservationPage == index+1 ? "disabled" : ""}`}>
                      <button className='page-link'
                      onClick={() => setCurrentReservationPage(index+1)}>
                        {index +1 }
                      </button>
                      
                    </li>
                  ))}
                  <li className={`page-item ${currentReservationPage == totalReservationPages ? "disabled" : ""}`}>
                    <button className='page-link'
                    onClick={() => setCurrentReservationPage(prev => prev +1)}>
                      Siguiente
                    </button>

                  </li>
                </ul>
            </nav> 
        </div>
        ):(
            <h3>Todavia No tienes ninguna Reserva...Explora la pagina de incio para comenzar a jugar!</h3>
          )}


        {favorites.length > 0 ? (
          <div className='d-flex flex-column align-items-center'>
            <h4 className='mt-3 mb-3 text-center'>Mis Establecimientos Favoritos:</h4>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  
                  <th scope="col" className='text-center'>Nombre</th>
                  <th scope="col" className='text-center'>Dirección</th>
                  <th scope='col' className='text-center'>Deportes</th>
                  
                  <th scope='col' className='text-center'>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((stablishment) => (
                 
                  <tr key={stablishment.id} 
                  onClick={() => handleTableClick(stablishment.id)}
                  style={{cursor:"pointer"}}>
                    
                   
                    
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
                            {sport.name}
                          </span>
                        ))
                      ) : (
                        "--"
                      )}
                    </td>
                    
                    <td className='text-center'>
                      <button className='btn btn-danger btn-sm'
                      style={{height:"50%", width:"75%", margin:"0 auto"}}
                      onClick={e => {e.stopPropagation(); handleDeleteFavorite(stablishment.id)}}>
                        Eliminar de Favoritos
                        </button>
                    </td>
                  </tr>
              
                ))}
              </tbody>

              </table>
          </div>       
        ):(
        <h3>Todavia No tienes ningun Favorito...Explora la pagina de incio para comenzar a jugar!</h3>
        )}
        {ownedStablishments.length > 0 &&(
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
                {ownedStablishments.map((stablishment) => (
                  <tr key={stablishment.id}
                  onClick={() => handleTableClick(stablishment.id)}
                  style={{cursor:"pointer"}}>
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
                            {sport.name}
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
