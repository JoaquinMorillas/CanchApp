import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import "dayjs/locale/es"

export const ReserveByStablishmentAndSportPage = () => {
  /* used States */
  const baseUrl = "http://localhost:8080"
  const params = useParams()
  
  const [sportFields, setSportFields] = useState([])
  const [sportFieldsSlots, setSportFieldsSlots] = useState([])
  const [date, setDate] = useState("")
  const [showSportFields, setShowSportFields] = useState(false)

  /* format the date from "YYYY-MM-DD" to "dddd D [de] MMMM"*/
  const formatDate = (date) => {
          return dayjs(date).locale('es').format('dddd D [de] MMMM');
      }

      /* fetch the reservations for the sportField */
  const searchSlots = async () => {
    if(!date){ /* checks if the date was inputted */
      Swal.fire({
        title: "Error",
        text: "Seleccionar una fecha",
        icon: "error"
      })
      return
    }

    try{
      const formattedDate = date.toISOString().split("T")[0]

      const allResponses = await Promise.all( /* awaits for all the sportFields to fetch their slots */
            sportFields.map( (sportField) => {
              return axios.get(`${baseUrl}/reservation/sport-field/${sportField.id}?date=${formattedDate}`)
    }))

        const gettedSlots = allResponses
        .map((response) => response.data)
        .flat()


        setSportFieldsSlots(gettedSlots)
        
        

        if(gettedSlots.length == 0){ /* if no slot is found for the date shows a msg to the user to try another date */
          Swal.fire({
            title: "¡Aviso!",
            text: `No se encontraron disponibilidades para el dia ${formattedDate}, intenta con otro dia `,
            icon:"info",
            showCloseButton:true
          })
          return
        }
        setShowSportFields(true)
      }catch(error){
       Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.response?.data || error.message,
        icon: "error"
        })
    }
  }

  /* fetchs the sportFields for the given sport and stablishment */
  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await axios.get(`${baseUrl}/sport_field/stablishment/${params.id}/${params.sport}`)
        const gettedSportFields = response.data
        setSportFields(gettedSportFields)
        
      }catch(error){
        console.error(error)
      }
    }

    if(sportFields.length === 0){
      fetchData()
      
    }
  },[params, sportFields])
  return (
    <>
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
    
      <h3 className='text-center'>¿En que Fecha quieres jugar?</h3>
      <div class="col  d-flex align-items-center">
          <label className='form-label mb-0 me-2'>Fecha: </label>
          <DatePicker
              className='form-control'
              selected={date}
              onChange={(e) => setDate(e)}
              placeholderText='Seleccioná una fecha'
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}  
          />
          <button className='btn btn-primary m-5 btn-lg' onClick={() => searchSlots()}>Buscar</button>
      </div>
      {showSportFields && (
        
        <div class="container">
          <h3 className='text-center'>Disponibilidades para el dia {formatDate(date)}</h3>
          <div className='row'>

            {sportFields.length > 0 ? ( 
              sportFields.map((s) => (
                <>
                <div className='card shadow-sm g-2'>
                  <div className='card-body'>
                        <h3 className='text-center'>{s.name}</h3>
                    <div key={s.id} className="row"> 
                        {sportFieldsSlots.filter((slot) =>slot.sportFieldId == s.id)
                        .map((slot) => (
                              <>
                              <div key={slot.id} className='col-6'>
                                <button className={`btn ${slot.reservationStatus == "PENDING" ? 'btn-success' : 'btn-danger'} mb-2 w-100`}>
                                  {slot.beginingHour.slice(0,5)} - {slot.finishingHour.slice(0,5)} {slot.reservationStatus != "CONFIRMED" ? "Disponible" : "No Disponible"} 
                                </button>
                              </div>
                              </>
                        ))}
                      
                    </div>
                  </div>
                </div>
                  
                </>

              ))
            ):("Sin cachas")}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
