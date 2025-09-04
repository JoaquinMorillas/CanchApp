import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { InputComponent } from '../Component/InputComponent'

export const EditAvailability = () => {
    /*Used States */
    const { id } = useParams()
    const navigate = useNavigate()
    const [availability, setAvailability] = useState(null)

    const [beginingTime, setBeginingTime] = useState("")
    const [disableBeginingTime , setDisableBeginingTime] = useState(true)

    const [endingTime, setEndingTime] = useState("")
    const [disableEndingTime , setDisableEndingTime] = useState(true)

    const [isActive, setIsActive] = useState(true)
    const [disableIsActive , setDisableIsActive] = useState(true)

    const [day, setDay] = useState("")

    /* Used for render the days in spanish */
    const daysOfWeek = {
        "MONDAY" : "Lunes",
        "TUESDAY" : "Martes",
        "WEDNESDAY" : "Miercoles",
        "THURSDAY" : "Jueves",
        "FRIDAY" : "Viernes",
        "SATURDAY" : "Sabado",
        "SUNDAY" : "Domingo"
    }
    /* Main Function, saves the changes and navigate back to the EditSportField Page */
    const saveChanges = async () =>{
        const confirmed = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro que quieres guardar los cambios?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
        })
        const formData = {
            beginingTime : beginingTime,
            endingTime : endingTime,
            active : isActive
        }
        if(confirmed.isConfirmed){
            try{

                const response = await axios.put(`http://localhost:8080/availability/update/${id}`, formData)
                const updatedAvailability = response.data
                setAvailability(updatedAvailability)

                Swal.fire({
                    title:"Éxito", 
                    text: `La disponibilidad ha sido actualizada de forma exitosa`, 
                    icon: "success",
                    timer:"2000",
                    showConfirmButton:false
                })

                setTimeout(() => {
                    navigate(`/canchas/editar/${updatedAvailability.sportFieldId}`)
                }, 2000)

            }catch(error){
                 Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                    }); 
            }

        }
    }
    /* fetches the current availability */
    useEffect(() => {
        const fetchAvailability = async () =>{
            try{

                const response = await axios.get(`http://localhost:8080/availability/${id}`)
                const serchedAvailability = response.data

                setAvailability(serchedAvailability)
                setBeginingTime(serchedAvailability.beginingTime)
                setEndingTime(serchedAvailability.endingTime)
                setIsActive(serchedAvailability.active)
                setDay(serchedAvailability.dayOfWeek)

            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                    });
            }
        }

        if(!availability){
            fetchAvailability()
        }
    }, [id, availability])
  return (
    <>
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h3 className='text-center'>Editar Disponibilidad {daysOfWeek[day]}:</h3>

        {/* BeginingTime Input */}
        <div className='container'>

            <div className='row d-flex justify-content-center '>
                <div className='col-3' >
                    <InputComponent label='Desde' type="time" value={beginingTime} setValue={setBeginingTime} disabled={disableBeginingTime}/>
                </div>
                <div className='col-3 mb-5' >
                    <button className={`btn ${disableBeginingTime ? 'btn-info' : 'btn-danger'} mo-3`}
                    onClick={() => setDisableBeginingTime(!disableBeginingTime)}>
                        {disableBeginingTime ? "Editar" : "Confirmar"}         
                    </button>
                </div>
            </div>
            

            {/* EndingTime Input */}

            <div className='row d-flex justify-content-center '>
                <div className='col-3' >
                    <InputComponent label='Hasta' type="time" value={endingTime} setValue={setEndingTime} disabled={disableEndingTime}/>
                </div>
                <div className='col-3 mb-5' >
                    <button className={`btn ${disableEndingTime ? 'btn-info' : 'btn-danger'} mo-3`}
                    onClick={() => setDisableEndingTime(!disableEndingTime)}>
                        {disableEndingTime ? "Editar" : "Confirmar"}         
                    </button>
                </div>
            </div>
            


            <div className='row d-flex justify-content-center '>
                <div className='col-3 me-5' >
                    <InputComponent label='Disponible' type="checkbox" value={isActive} setValue={setIsActive} disabled={disableIsActive}/>
                </div>
                <div className='col-3 mb-5' >
                    <button className={`btn ${disableIsActive ? 'btn-info' : 'btn-danger'} mr-5`}
                    onClick={() => setDisableIsActive(!disableIsActive)}>
                        {disableIsActive? "Editar" : "Confirmar"}         
                    </button>
                </div>
            </div>
        </div>
        
        <div className="mb-3 d-flex justify-content-center">
            <button className='btn btn-lg btn-primary mt-5' onClick={() => saveChanges()}>
                Guardar Cambios

            </button>

        </div>

    </div>
    </>
  )
}
