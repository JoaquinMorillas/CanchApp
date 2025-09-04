import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import dayjs from "dayjs";
import "dayjs/locale/es";

export const ReserveByCitySportAndDate = () => {
    /* used States */
    const baseUrl = "http://localhost:8080"
    const params = useParams()
    const [sportFields, setSportFields] = useState([])
    const [slotsBySportFields, setSlotsBySportFields] = useState({})
    const [stablishmentsBySportFields, setStablishmentsBySportFields] = useState({})
    
    /* parse the sport getted by the backend and transfoms it
    to lower case and replace the "_" to " " */
    const formatSport = (sport) => {
        return sport
            .toLowerCase()       
            .replace(/_/g, " ")     
            .replace(/\b\w/g, c => c.toUpperCase()); // capitalizes first letter of each word
    }

    /* format the date to "YYYY-MM-DD" to "dddd D [de] MMMM" */
    const formatDate = (date) => {
        return dayjs(date).locale('es').format('dddd D [de] MMMM');
    }
    
    /* fecth the sportfiedls that have the corresponding city and sport and set the state */
    useEffect(() => {
        const fetchSportFields= async () => {
            try{
                const response = await axios.get(
                    `${baseUrl}/sport_field/find?sport=${encodeURIComponent(params.sport)}&city=${encodeURIComponent(params.city)}`)
                const gettedSportFields = response.data
                setSportFields(gettedSportFields)
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }
        }
       
        fetchSportFields()
        
    
    }, [params])

    /* for each sportField fetch the reservations for the given day */
    useEffect(() =>{
        const fetchAllSlots = async () => {
            const slots = {}
            try{
                await Promise.all(
                    sportFields.map(async (sportField) => {
                        const response = await axios.get(`${baseUrl}/reservation/sport-field/${sportField.id}/slots?date=${params.date}`)
                        const data = response.data
                        slots[sportField.id] = data || []
                    })
                )
            }catch(error){
                console.error(error)
            }
            setSlotsBySportFields(slots)
        }


        if(sportFields.length > 0){
            fetchAllSlots()
        }
    },[sportFields, params.date])

    /* fetch the stablishments assigned to the sportFields */
    useEffect(() => {
        const fetchStablishments = async () => {
            const stablishments = {}
            try{
                await Promise.all(
                    sportFields.map(async (sportField) => {
                        const response = await axios.get(`${baseUrl}/stablishment/${sportField.stablishmentId}`)
                        const data = response.data
                        stablishments[sportField.id] = data
                    })
                )
                setStablishmentsBySportFields(stablishments)
            }catch(error){
                console.error(error)
            }
        }

        if(sportFields.length > 0){
            fetchStablishments()
        }

    },[sportFields])


  return (
    <> 
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '100%', margin: '0 auto' }}>
        <h3 className='text-center'>Canchas de {formatSport(params.sport)} disponibles para el día {formatDate(params.date)}</h3>
        {sportFields.length > 0 ? (
            <div className='row g-3' >
                {sportFields.map((sportField) => {
                    const slots = slotsBySportFields[sportField.id] || []
                    const stablishment = stablishmentsBySportFields[sportField.id]

                    return( 
                        <div  key={sportField.id} className='col-12 col-md-6 mb-4'>
                            <div className='card shadow-sm mb-4'>
                                <div className='card-body'>
                                        <div className='d-flex justify-content-center'>
                                            <NavLink to={stablishment ? `/establecimientos/${stablishment.id}` : "/"}> 
                                                <button className='btn btn-primary btn-lg mb-3'>
                                                    {stablishment ? stablishment.name : "Cargando..."}
                                                </button>    
                                            </NavLink>
                                        </div>
                                            <h3 className='text-center mb-3'>{sportField.name}</h3>
                                        {slots.length > 0 ? (
                                            <div className='row'>

                                                {slots.map((slot ,i) => (
                                                    <div key={i} className='col-6'>
                                                        <button className={`btn ${slot.reserved ? 'btn-danger' : 'btn-success '} mb-2 w-100`}
                                                        >
                                                            {slot.beginingTime.slice(0,5)} 
                                                            - 
                                                            {slot.endingTime.slice(0,5)}
                                                            <span className='d-block small'> {slot.reserved ? " No Disponible" : " Disponible"}</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ):(<h6 className='text-center m-auto'>
                                            Sin disponibilidades para la fecha
                                            </h6>
                                            )}
                                    </div>
                                </div>
                            </div>
                )
            })}      
            </div>
        ):("No hay canchas")}
    </div>
    </>
  )
}
