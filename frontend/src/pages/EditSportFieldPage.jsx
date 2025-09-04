import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import { InputComponent } from '../Component/InputComponent'

export const EditSportFieldPage = () => {
    /* Used Params */
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [SportField, setSportField] = useState(null)

    const [name, setName] = useState("")
    const [disableName, setDisableName] = useState(true)

    const [price, setPrice] = useState("")
    const [disablePrice, setDisablePrice] = useState(true)

    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [disableDuration, setDisableDuration] = useState(true)

    const [availabilites, setAvailabilities] = useState([])

    /* Used for render the day in spanish */
    const daysOfWeek = [
        {key:"MONDAY", label:"Lunes"},
        {key:"TUESDAY", label:"Martes"},
        {key:"WEDNESDAY", label:"Miercoles"},
        {key:"THURSDAY", label:"Jueves"},
        {key:"FRIDAY", label:"Viernes"},
        {key:"SATURDAY", label:"Sabado"},
        {key:"SUNDAY", label:"Domingo"}
    ]

    /*Used for extract the hours and minutes from the backend response displayed as eg.
    PT1H30M for 1 hour 30 minutes */
    const parseDuration = (duration) =>{
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;

        return{hours, minutes}
    }

    /* used for creating the duration string to send to the backend */
    const getDuration = (hours, minutes) => {
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
    
        let parsedDuration = "PT";

        if(h > 0) parsedDuration += `${h}H`;
        if(m > 0) parsedDuration += `${m}M`;
    
        return parsedDuration;
    } 

    /* Main function it saves the changes and navigate back */
    const saveChanges = async () => {
        const confirmed = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro que quieres guardar los cambios?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
        })

        if(confirmed.isConfirmed){
            const duration = getDuration(hours, minutes)

            const formData = {
                name: name,
                price: price,
                reservationDuration: duration
            }

            try{
                const response = axios.put(`http://localhost:8080/sport_field/update/${id}`, formData)
                const updatedSportField = response.data
                setSportField(updatedSportField)

                Swal.fire({
                    title:"Éxito", 
                    text: `La cancha ha sido actualizada de forma exitosa`, 
                    icon: "success",
                    timer:"2000",
                    showConfirmButton:false
                });

                setTimeout(() =>{
                    navigate(-1)
                },2000)

            }catch(error){
               Swal.fire({
                   title: "Error",
                   text: error.response?.data?.message || error.response?.data || error.message,
                   icon: "error"
                   }); 
            }
        }
    }

    /* Used for delete permanently an availability from the backend */
    const handleDeleteAvailability = async (id) =>{
        const confirmed = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro que quieres eliminar la disponibilidad?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
        })
        if(confirmed.isConfirmed){

            try{
                await axios.delete(`http://localhost:8080/availability/delete/${id}`)
                const updatedAvailabilites = availabilites.filter((a) => a.id != id)
                setAvailabilities(updatedAvailabilites)

            }catch(error){
                Swal.fire({
                   title: "Error",
                   text: error.response?.data?.message || error.response?.data || error.message,
                   icon: "error"
                   });
            }
        }
        
    }

    /* fetch the sportField and set the states */
    useEffect(() => {
        const fetchSportField = async (id) =>{
            const response = await axios.get(`http://localhost:8080/sport_field/${id}`)
            const gettedSportField = response.data

            const availabilitesResponse = await axios.get(`http://localhost:8080/availability/sportField/${id}`)
            const gettedAvailabilites = availabilitesResponse.data

            setSportField(gettedSportField)
            setName(gettedSportField.name)
            setPrice(gettedSportField.price)
            const { hours, minutes } =parseDuration(gettedSportField.reservationDuration)
            setHours(hours)
            setMinutes(minutes)
            setAvailabilities(gettedAvailabilites)
        }
        if(!SportField){
            fetchSportField(id)
            
        }
    },[id, SportField])
  return (
    <>
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h3 className='text-center'>Editar Cancha: {name}</h3>

        {/* Name Input */}
        <div className='container'>
            <div className='row mb-3'>
                <div className='col-8'>
                    <InputComponent label="Nombre de la cancha" type="text" value={name} setValue={setName} disabled={disableName}/>
                </div>
                <div className='col-4'>
                    <button className={`btn ${disableName ? 'btn-info' : 'btn-danger'} mb-3`}
                        onClick={() => setDisableName(!disableName)}>
                            {disableName ? "Editar" : "Confirmar"}         
                    </button>
                </div>
            </div>

        </div>
        
        {/* Price Input */}
        <div className='container'>
            <div className='row mb-3'>
                <div className='col-8'>
                    <InputComponent label='Precio de la Cancha' type="Number" value={price} setValue={setPrice} disabled={disablePrice}/>
                </div>
                <div className='col-4'>
                    <button className={`btn ${disablePrice ? 'btn-info' : 'btn-danger'} mb-3`}
                    onClick={() => setDisablePrice(!disablePrice)}>
                        {disablePrice ? "Editar" : "Confirmar"}         
                    </button> 
                </div>
            </div>
        </div>
        
        {/* Reservation input*/}
        <div className='container'>
            <div className='row mb-3'>
                <div className='col-3'>
                    <label  className="mt-2"
                    style={{  width: "250px", textAlign: "left" }}>
                    Duracion de la Reserva: 
                    </label>
                </div>
                <div className='col-3'>
                    <InputComponent label="Horas" type="Number" value={hours} setValue={setHours} disabled={disableDuration}/>
                </div>
                <div className='col-3'>
                    <InputComponent label='Minutos' type="Number" value={minutes} setValue={setMinutes} disabled={disableDuration}/>
                </div>
                <div className='col-3'>
                    <button className={`btn ${disableDuration ? 'btn-info' : 'btn-danger'} mb-3`}
                    onClick={() => setDisableDuration(!disableDuration)}>
                        {disableDuration ? "Editar" : "Confirmar"}         
                    </button> 
                </div>
            </div>

        </div>

        
        
        <div className="mb-3 d-flex justify-content-center">
            <button className='btn btn-lg btn-primary' onClick={() => saveChanges()}>
                Guardar Cambios

            </button>

        </div>

        {/* Availabilites table*/}
        <h3 className='text-center mb-5 mt-5'>Disponibilidades: </h3>
        <div class="mb-3 d-flex align-items-center">
            {availabilites && availabilites.length > 0 ? (
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center align-middle">Día</th>
                            <th scope="col" className="text-center align-middle">Horario de Apertura</th>
                            <th scope="col" className="text-center align-middle">Horario de Cierre</th>
                            <th scope="col" className="text-center align-middle">Habilitado</th>
                            <th scope="col" className="text-center align-middle">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                       {daysOfWeek.map((day) => {
                        const availability = availabilites?.find((a) => a.dayOfWeek==day.key)
                            return(
                                <tr key={day.key}>
                                    <td className="text-center align-middle">
                                        {day.label}
                                    </td>
                                    <td className="text-center align-middle">
                                        {availability ? availability.beginingTime : "Sin asignar"}
                                    </td>
                                    <td className="text-center align-middle">
                                        {availability ? availability.endingTime : "Sin asignar"}
                                    </td>
                                    <td className="text-center align-middle">
                                        {availability ? (availability.active ? "Si" : "No") : "Sin asignar"}
                                    </td>
                                    <td>
                                        {availability ? (

                                            <div className="d-flex justify-content-center gap-2">
                                                <NavLink to={`/canchas/editar/disponibilidad/${availability.id}`}>

                                                    <button className='btn btn-info'>Editar</button>
                                                </NavLink>
                                                
                                                <button className='btn btn-danger' 
                                                    onClick={() => handleDeleteAvailability(availability.id)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        ):(
                                            <NavLink to={`/canchas/editar/${id}/crear_disponibilidad/${day.key}`}>

                                                <button className='btn btn-success'>Agregar</button>
                                            </NavLink>
                                        )}
                                    </td>

                                </tr>
                            )
                       }
                       )}
                    </tbody>
                </table>
            ):(
                <>
                    <div className='mb-3 d-flex flex-column justify-content-center '>
                    <h4 className="text-center mt-4 align-self-center">No se Encuentran Disponibilidades</h4>
                    <br />
                    <NavLink to={`/canchas/editar/${id}/crear_disponibilidades`}>
                        <button className='btn btn-primary btn-lg align-self-center'>
                            Crear Disponibilidades
                        </button>
                    </NavLink>
                    </div>
                </>
            )}
        </div>
    </div>
    </>

  )
}

