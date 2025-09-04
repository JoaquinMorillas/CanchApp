import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'

export const SportFieldStep1 = ({stablishment, formData, setFormData, onNext, setSportFieldId}) => {

  /* Used states for this step*/
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [sports, setSports] = useState([])
  
  /* helper function to parse the duration to feed it correclty to the backend*/
  const duration = (hours, minutes) => {
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    
    let parsedDuration = "PT";

    if(h > 0) parsedDuration += `${h}H`;
    if(m > 0) parsedDuration += `${m}M`;
    
    return parsedDuration;
  } 

  /* main function of this step it validates the form, saves the sportfield
  and navigate to the next step*/
  const validateAndNext = async () =>{
    const sportFieldDuration = duration(hours, minutes)
    
    setFormData({...formData, reservationDuration: sportFieldDuration})

    if(!formData.name){
      Swal.fire({
                title:"Error",
                text:"El Campo Nombre de la cancha es obligatorio",
                icon:"error"
              })
              return
    }
    if(!formData.price){
      Swal.fire({
                title:"Error",
                text:"El Campo Precio es obligatorio",
                icon:"error"
              })
              return
    }
    if(sportFieldDuration == "PT"){
      Swal.fire({
                title:"Error",
                text:"La duracion no puede ser 0",
                icon:"error"
              })
              return
    }

    const confirmed = await Swal.fire({
      title: "¿Desea Guardar la Cancha?",
      text: "Al aceptar la cancha va a ser guardada en el sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText:"Si, guardar la cancha.",
      cancelButtonText:"Cancelar."
    })

    if (confirmed.isConfirmed){
      const payload = { ...formData, 
          reservationDuration: sportFieldDuration,
          stablishmentId:stablishment.id }
      try{
        const res = await axios.post("http://localhost:8080/sport_field/save", payload);

        setSportFieldId(res.data.id)
       
        onNext()

      }catch(error){
        Swal.fire({
          title:"Error al guardar la cancha",
          text: error.response?.data?.message || error.response?.data || error.message,
          icon:"error"
        })
      }
    }


  }
  /* get the list of the sports supported by the backend in order to chosse one*/
  useEffect(() => {
    axios.get("http://localhost:8080/sport").then((res)=>setSports(res.data));
    
  },[]) 

  return (
    <>
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
        <h1 className='text-center'>Agregar Cancha para "{stablishment.name}"</h1>
        <h4 className='text-center'>Primer Paso:</h4>
        <h5 className='text-center'>Datos de la cancha</h5>

        {/* Name input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Nombre de la cancha: 
            </label>
          
            <input 
            type="text" 
            class="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder='Ej: Cancha 1'
            style={{ maxWidth: "250px" }}
            required/>
          
        </div>

        {/* price input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Precio de la reserva: 
            </label>
          
            <input 
            type="number"
            step="0.1"
            min= "0" 
            class="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
            placeholder='Ej. 5.50'
            style={{ maxWidth: "250px" }}
            required/>
          
        </div>

        {/* Reservation input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Duracion de la Reserva(Horas, Minutos): 
            </label>
          
            <input 
            type="number" 
            min="0"
            class="form-control"
            value={hours}
            onChange={(e) => setHours(e.target.value)} 
            placeholder='Horas'
            style={{ maxWidth: "250px" }}/>

            <input 
            type="number"
            min="0" 
            step="5"
            class="form-control"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)} 
            placeholder='minutos'
            style={{ maxWidth: "250px" }}
            required/>
          
        </div>

        {/* Sport input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Deporte de la cancha: 
            </label>
          
            <select
            type="text" 
            class="form-control"
            value={formData.sport}
            onChange={(e) => setFormData({ ...formData, sport: e.target.value })} 
            placeholder='futbol 7'
            style={{ maxWidth: "250px" }}
            >
            <option key={"default"} value={""}>Seleccione un deporte</option>
            {sports.map((s) => (
              <option key={s.name} value={s.name}>{s.label}</option>
            ))}
            </select>  
        </div>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <NavLink to = "/administracion">
            <button className='btn btn-secondary'>Atras</button>
          </NavLink>
          <button className="btn btn-primary" onClick={validateAndNext}>Siguiente</button>
        </div>


    </div>
    </>
    
  )
}
