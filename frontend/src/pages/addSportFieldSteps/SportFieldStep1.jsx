import { useApi } from '../../context/AxiosInstance'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'
import { FormFieldComponent } from '../../Component/FormFieldComponent'
import { useFormValidations } from '../../hooks/useFormValidations'

const validators = {
  name: (v) => {
    if(!v) return "El nombre es obligatorio"
    return ""
  },
  price: (v) => {
    if(!v) return "El precio es obligatorio"
    if(v == 0) return "el precio  no puede ser 0"
    if(v < 0) return "El precio no puede negativo"
    return ""

  },
  hours: (v) => {
    if(!v) return "las horas son obligatorias"
    if(v < 0) return "las horas no pueden ser negativas"
    return ""
  },
  minutes: (v) => {
    if(!v) return "los minutos son obligatorios"
    if(v < 0) return "los minutos no pueden ser negativos"
    return ""
  },
  sport: (v) => {
    if(!v) return "el deporte es obligatorio"
    return ""
  }

}

export const SportFieldStep1 = ({stablishment, formData, setFormData, onNext, setSportFieldId}) => {

  /* Used states for this step*/
  const api = useApi()
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [sports, setSports] = useState([])
  const {errors, handleBlur} = useFormValidations(validators)
  
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
        const res = await api.post("/sport_field/save", payload);

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
    api.get("/sport").then((res)=>setSports(res.data));
    
  },[]) 

  return (
    <>
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
        <h1 className='text-center'>Agregar Cancha para "{stablishment.name}"</h1>
        <h4 className='text-center'>Primer Paso:</h4>
        <h5 className='text-center'>Datos de la cancha</h5>

        {/* Name input*/}
        <FormFieldComponent 
          label="Nombre de la cancha"
          type='text'
          value={formData.name}
          onBlur={() => handleBlur("name", formData.name)}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="Ej. Cancha 1"
          error={errors.name}
        />


        {/* price input*/}
        <FormFieldComponent 
          label="Precio"          
          type='number'
          value={formData.price}
          onBlur={() => handleBlur("price", formData.price)}
          onChange={e => setFormData({...formData, price: e.target.value})}
          placeholder="10.000"
          error={errors.price}
          step="500"
          min="0"
        />

        {/* Duration input*/}
        <FormFieldComponent 
          label="Duracion(Horas)"          
          type='number'
          value={hours}
          onBlur={() => handleBlur("hours", hours)}
          onChange={e => setHours(e.target.value)}
          placeholder="horas"
          error={errors.hours}
          step="1"
          min="0"
        />

        <FormFieldComponent 
          label="Duracion(Minutos)"          
          type='number'
          value={minutes}
          onBlur={() => handleBlur("minutes", minutes)}
          onChange={e => setMinutes(e.target.value)}
          placeholder="Minutos"
          error={errors.minutes}
          step="1"
          min="0"
        />
      

        {/* Sport input*/}
        <FormFieldComponent 
          label="Deporte"          
          as="select"
          value={formData.sport}
          onBlur={() => handleBlur("sport", formData.sport)}
          onChange={e => setFormData({...formData, sportName: e.target.value})}
          placeholder="Fútbol"
          error={errors.sport}
        >
          <option key={"default"} value={""}>Seleccione un deporte</option>
            {sports.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
        </FormFieldComponent>
        
        

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
