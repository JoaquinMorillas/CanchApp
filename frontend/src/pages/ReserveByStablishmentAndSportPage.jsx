import { useApi } from '../context/AxiosInstance';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import "dayjs/locale/es"
import { LoadingContext } from '../context/LoadingContext';
import Calendar from 'react-calendar'
import "react-calendar/dist/Calendar.css"
import { StablishmentContext } from '../context/StablishmentContext';

export const ReserveByStablishmentAndSportPage = () => {
  /* used States */
  const api = useApi()
  const baseUrl = "http://localhost:8080"
  const params = useParams()
  const {stablishments} = useContext(StablishmentContext)
  const {startLoading, stopLoading} = useContext(LoadingContext)
  
  const [sportFields, setSportFields] = useState([])
  const [sportFieldsSlots, setSportFieldsSlots] = useState([])
  const [date, setDate] = useState(new Date())
  const [showSportFields, setShowSportFields] = useState(false)
  const stablishment = stablishments.all.filter((s) => s.id == params.id)
  /* handle the confirm reservation */
      const handleConfirmReservation = async(reservation) => {
          const confirm = await Swal.fire({
              title:"Atencion",
              text: `¿Estas seguro que quieres reservar esta cancha?`,
              icon: "question",
              showCancelButton:true,
              showConfirmButton:true
          })
  
          if(confirm.isConfirmed){
              try{
                  startLoading()
                  const response = await api.put(`/reservation/confirm/${reservation.id}`)
                  const data = response.data
                  Swal.fire({
                      title:"Exito",
                      text:"¡Ya reservaste tu cancha!",
                      icon:"success",
                      showCloseButton:true
                  })
                  const newSlotState = sportFieldsSlots.map((s) => s.id === reservation.id ? s={...s, available:false} : s)
                  console.log(newSlotState)
                  setSportFieldsSlots(newSlotState)
              }catch(error){
                  Swal.fire({
                      title: "Error",
                      text: error.response?.data?.message || error.response?.data || error.message,
                      icon: "error"
                  })
              }finally{
                stopLoading()
              }
          }
      }
  /* format the date from "YYYY-MM-DD" to "dddd D [de] MMMM"*/
  const formatDate = (date) => {
          return dayjs(date).locale('es').format('dddd D [de] MMMM');
      }

      /* fetch the reservations for the sportField */
  useEffect(() => {

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
        startLoading()
        const formattedDate = date.toISOString().split("T")[0]
  
        const allResponses = await Promise.all( /* awaits for all the sportFields to fetch their slots */
              sportFields.map( (sportField) => {
                return api.get(`/reservation/sport-field/${sportField.id}/slots?date=${formattedDate}`)
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
      }finally{
        stopLoading()
      }
    }
    searchSlots()
  },[date])

  /* fetchs the sportFields for the given sport and stablishment */
  useEffect(() => {
    const fetchData = async () => {
      try{
        startLoading()
        const response = await api.get(`/sport_field/stablishment/${params.id}/${params.sport}`)
        const gettedSportFields = response.data
        setSportFields(gettedSportFields)
        
      }catch(error){
        console.error(error)
      }finally{
        stopLoading()
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
      <h2 className='text-center'>{stablishment.name}</h2>
      <h3 className='text-center'>¿En que Fecha quieres jugar?</h3>
      
         {/* 
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
         */}
         <div className="d-flex justify-content-center">
            <Calendar onChange={setDate} value={date}/> 
         </div>
     
      
        
        <div class="container">
          <h3 className='text-center m-3'>Disponibilidades para el dia {formatDate(date)}</h3>
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
                                <button className={`btn ${slot.available == false ? 'btn-danger' : 'btn-success'} mb-2 w-100`}
                                onClick={() => handleConfirmReservation(slot)}>
                                  {slot.startTime.slice(0,5)} - {slot.finishTime.slice(0,5)} 
                                  <p> {slot.available == true ? "Disponible" : "No Disponible"}</p> 
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
      
    </div>
    </>
  )
}
