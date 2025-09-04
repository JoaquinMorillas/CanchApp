import axios from 'axios'
import React, {  useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { InputComponent } from '../Component/InputComponent'

export const AddAvailability = () => {

    /*Used states*/
    const { id, day } = useParams()
    
    const navigate = useNavigate()
    const [availability, setAvailability] = useState(null)

    const [beginingTime, setBeginingTime] = useState("")
    

    const [endingTime, setEndingTime] = useState("")
    

    const [isActive, setIsActive] = useState(true)
    
    /* used for showing the day in spanish*/
    const dayTranslation = {
      "MONDAY" : "Lunes",
      "TUESDAY" : "Martes",
      "WEDNESDAY": "Miercoles",
      "THURSDAY": "Jueves",
      "FRIDAY": "Viernes",
      "SATURDAY": "Sabado",
      "SUNDAY": "Domingo"
    }
    /* Main function it saves the availability and navigates back*/
    const saveChanges = async () =>{
      const confirmed = await Swal.fire({
        title:"Atencion",
            text: `¿Estas seguro que quieres guardar los cambios?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
      })

      if(confirmed.isConfirmed){
        try{

          const formData = {
            sportFieldId: id,
            dayOfWeek: day,
            beginingTime: beginingTime,
            endingTime: endingTime,
            specificDate: null,
            active: isActive
          }
          const response = await axios.post("http://localhost:8080/availability/save", formData)
          const newAvailability = response.data
          setAvailability(newAvailability)
  
          Swal.fire({
            title:"Éxito", 
            text: `La Disponibilidad ha sido creada de  forma exitosa`, 
            icon: "success",
            timer:"2000",
            showConfirmButton:false
          })
  
          setTimeout(() => {
            navigate(`/canchas/editar/${id}`)
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
  return (
    <>
      <div className="text-dark p-4 rounded" 
          style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
              <h3 className='text-center'>Agregar Disponibilidad día {dayTranslation[day]}:</h3>

          {/* BeginingTime Input */}
          <InputComponent label="Desde" type="time" value={beginingTime} setValue={setBeginingTime}/>

          {/* EndingTime Input */}
          <InputComponent label="Hasta" type="time" value={endingTime} setValue={setEndingTime}/>
          
          {/* isActive Input */}
          <InputComponent label="Disponible" type="checkbox" value={isActive} setValue={setIsActive}/>
          

          <div className="mb-3 d-flex justify-content-center">
              <button className='btn btn-lg btn-primary mt-5' onClick={() => saveChanges()}>
                  Guardar Cambios
              </button>

          </div>

      </div>
    </>
  )
}
