import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { LoadingContext } from '../context/LoadingContext'
import { useApi } from '../context/AxiosInstance'
import Calendar from 'react-calendar'
import "react-calendar/dist/Calendar.css"
import { icon } from 'leaflet'
import Swal from 'sweetalert2'
import { SportFieldReservationCardComponent } from '../Component/SportFieldReservationCardComponent'


export const AdminReservations = () => {
    const {user} = useContext(AuthContext)
    const {startLoading, stopLoading} = useContext(LoadingContext)
    const api = useApi()
    const [currentDate, setCurrentDate] = useState(new Date())
    

    const [userStablishments, setUserStablishments] = useState([])
    const [selectedStablishment, setSelectedStablishment] = useState(null)
    const [selectedSportFields, setSelectedSportFields] = useState([])
    const [selectedReservations, setSelectedReservations] = useState({})
    const [selectedSlots, setSelectedSlots] = useState({})

    const getRowClass = (status) => {
        switch (status) {
            case "CONFIRMED":
            return "table-success";  
            case "CANCELLED":
            return "table-danger";    
            case "FULLFILED":
            return "table-warning";   
            default:
            return "";
        }
        };

    const handleCancelReservation = async(reservation)=>{
        const confirm = await Swal.fire({
            title: "¡Atencion!",
            text:`Estas seguro que quires CANCELAR la reserva?`,
            icon: "warning",
            showCancelButton:true,
            showConfirmButton:true
        })
        if(confirm.isConfirmed){
            try{
                startLoading()
                const response = await api.put(`/reservation/cancel/${reservation.id}`)
                const data = response.data
                setSelectedReservations(prev => {
                    const copy = { ...prev }

                    copy[reservation.sportFieldId] = copy[reservation.sportFieldId].map(r =>
                        r.id === data.id ? data : r
                    )

                    return copy
                    })
                Swal.fire({
                    title:"Exito",
                    text:`La Reserva n° ${data.id} ha sido cancelada`,
                    icon:"succes",
                    showCloseButton:true
                })
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
        const fetchUserStablishments = async () => {
            try{
                startLoading()
                const response = await api.get(`stablishment/user/${user.id}`)
                const gettedStablishments = response.data
                setUserStablishments(gettedStablishments)
            }catch(error){
                console.error(error)
            }finally{
                stopLoading()
            }
        }
        fetchUserStablishments()
    },[])

    useEffect(() => {
        const fetchSportFields = async () => {
            try{
                startLoading()
                const response = await api.get(`/sport_field/stablishment/${selectedStablishment.id}`)
                const gettedSportFields = response.data
                setSelectedSportFields(gettedSportFields)
            }catch(error){
                console.error(error)
            }finally{
                stopLoading()
            }
        }

        fetchSportFields()
    }, [selectedStablishment])

    useEffect(() => {
        const fetchReservations = async () => {
            const date = currentDate.toISOString().split("T")[0]

            try{
                startLoading()
                const results = await Promise.all(
                    selectedSportFields.map(async (sportField) => {
                        const response = await api.get(`/reservation/sport-field/${sportField.id}?date=${date}`)
                        const freeSlots = await api.get(`/reservation/sport-field/${sportField.id}/slots?date=${date}`)

                        return {
                            sportFieldId: sportField.id,
                            reservations: response.data,
                            slots: freeSlots.data.filter((s)=> s.available == true)
                        }
                    }
                
                    ))
                    

                const reservationMap = {}
                results.forEach(r => {
                    reservationMap[r.sportFieldId] = r.reservations
                })

                const slotsMap = {}
                results.forEach(r => {
                    slotsMap[r.sportFieldId] = r.slots
                })

                setSelectedReservations(reservationMap)
                setSelectedSlots(slotsMap)

            }catch(error){
                console.error(error)
            }finally{
                stopLoading()
            }
        }
        

        fetchReservations()
    },[selectedSportFields, currentDate])
  return (
    <>
    <div className='d-flex flex-column' 
    style={{maxWidth:"90%", backgroundColor:"var(--bs-light)",
      margin:"0 auto"
    }}>

        <h2 className='text-center'>Hola {user.firstName}</h2>
        <h3 className='text-center'>Mis Establecimientos: </h3>
        <div className='d-flex justify-content-evenly flex-wrap'>
            {userStablishments?.map((stablishment) => (
                <button className='btn btn-lg btn-primary m-3' 
                key={stablishment.id}
                onClick={() => setSelectedStablishment(stablishment)}>
                    {stablishment.name}
                </button>
            ))}
        </div>

        {selectedStablishment && (
            <div>
                <h3 className='text-center'>{selectedStablishment.name}</h3>
                <div  className="d-flex justify-content-center mb-3">

                    <Calendar onChange={setCurrentDate} value={currentDate}
                    ></Calendar>
                </div>
                <h2 className='text-center'>
                   Reservas del día {currentDate.toLocaleDateString()}
                </h2>
                {selectedSportFields?.length > 0 && selectedSportFields.map((sportField) =>{
                    const reservations = selectedReservations[sportField.id] || []
                    const slots = selectedSlots[sportField.id] || []
                    return(
                        <>
                        <div className='d-flex flex-column'
                        style={{maxWith:"80%", margin:"0 auto"}}>
                            
                            <SportFieldReservationCardComponent 
                            
                            key={sportField.id}
                            sportField={sportField}
                            reservations={reservations}
                            slots={slots}
                            handleCancelReservation={handleCancelReservation}
                            getRowClass={getRowClass}
                        />
                        </div>
                        </>
                        
                    )
                })}
            </div>
        )}
    </div>
    
    </>
  )
}
