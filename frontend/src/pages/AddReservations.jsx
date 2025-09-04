import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Swal from 'sweetalert2';
import { InputComponent } from '../Component/InputComponent';

export const AddReservations = () => {
    /* Used States*/
    const baseUrl = "http://localhost:8080"
    const { id } = useParams()
    const navigate = useNavigate()
    const [sportField, setSportField] = useState(null)
    const [name, setName] = useState("")
    const [availabilities, setAvailabilities] = useState([])

    const [beginingDate , setBeginingDate] = useState("")
    const [endingDate, setEndingDate] = useState("")

    const [specialDate, setSpecialDate] = useState("")
    const [specialDates, setSpecialDates] = useState([])

    const [specialDateBeginingTime, setSpecialDateBeginingTime] = useState("")
    const [specialDateEndingTime, setSpecialDateEndingTime] = useState("")
    const [specialDateIsAvailable, setSpecialDateIsAvailable] = useState(true)

    /*Used for showing the day in spanish */
    const daysOfWeek = [
        {key:"MONDAY", label:"Lunes"},
        {key:"TUESDAY", label:"Martes"},
        {key:"WEDNESDAY", label:"Miercoles"},
        {key:"THURSDAY", label:"Jueves"},
        {key:"FRIDAY", label:"Viernes"},
        {key:"SATURDAY", label:"Sabado"},
        {key:"SUNDAY", label:"Domingo"}
    ]
    /* used to send the day in the way the backend wants(English and uppercase)*/
    const dateToDayOfWeek = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {weekday: "long" }).toUpperCase()
    }

    /* Add a special date on the state*/
    const handleAddSpecialDate = () => {
        if(!specialDate){
            Swal.fire
        }
        if(!(specialDateBeginingTime < specialDateEndingTime)){
            Swal.fire({
                title: "Error",
                text: `El horario de finalizacion (${specialDateEndingTime}) debe ser posterior al de inicio (${specialDateBeginingTime})`,
                icon: "error"
            })
            return
        }
        const formattedDate = specialDate.toISOString().split("T")[0]

        const specialDateToSave = {
            sportFieldId: id,
            specificDate: formattedDate,
            beginingTime : specialDateBeginingTime,
            endingTime : specialDateEndingTime,
            dayOfWeek : dateToDayOfWeek(specialDate),
            active: specialDateIsAvailable
        }
        
        setSpecialDates([...specialDates, specialDateToSave])
        setSpecialDate("")
        setSpecialDateBeginingTime("")
        setSpecialDateEndingTime("")
        setSpecialDateIsAvailable(true)
    }

    /* delete a special date of the state*/
    const handleDeleteSpecialDate = (date) => {
        setSpecialDates(specialDates.filter((d) => d.specificDate != date.specificDate))
    }
    /*Saves the specials dates on the backend it is passed on the main function*/
    const saveSpecialDates = async () => {
        if(!specialDates.length > 0){
            return
        }
        specialDates.map(async (date) => {
            try{
                const response = await axios.post(`${baseUrl}/availability/save`, date)
                
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }
        })
    }
    /* main function. it validates the date range and saves all the reservations including the special dates*/
    const handleSubmitReservations = async () => {
        if(!endingDate || !beginingDate){
            Swal.fire({
                title: "Error",
                text: `El rango de fechas es obligatorio`,
                icon: "error"
            })
            return
        }
        if(beginingDate>endingDate){
             Swal.fire({
                title: "Error",
                text: `La fecha de inicio: ${beginingDate} debe ser anterior a la fecha de finalizacion: ${endingDate}`,
                icon: "error"
            })
            return
        }
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
                await saveSpecialDates()
                const formattedBegining = beginingDate.toISOString().split("T")[0]
                const formattedEnding = endingDate.toISOString().split("T")[0]

                const response = await axios.post(`${baseUrl}/reservation/generate-slots?sportFieldId=${id}&startDate=${formattedBegining}&endDate=${formattedEnding}`)
                const data = response.data
                Swal.fire({
                    title:"Éxito", 
                    text: `Se crearon ${data.length} nuevas reservas`, 
                    icon: "success",
                    timer:"2000",
                    showConfirmButton:false
                })
                setTimeout(() => {
                    navigate(-1)
                },2000)

            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }
        }


    }
    /* fetches the sportField and set name state*/
    useEffect(() => {
        const fetchSportsField = async () => {
            const response = await axios.get(baseUrl + `/sport_field/${id}`)
            const gettedSportField = response.data

            setSportField(gettedSportField)
            /*setReservationDuration(gettedSportField.reservationDuration)
            setSport(gettedSportField.sport)*/
            setName(gettedSportField.name)
        }
        if(!sportField){
            fetchSportsField()
        }
    },[id, sportField])

    /*fetch the availabilities for the given sportfield and set the state */
    useEffect(() => {
        const fetchAvailabilities = async () => {
            
            const response = await axios.get(baseUrl + `/availability/sportField/${id}`)
            const gettedAvailabilities = response.data

            setAvailabilities(gettedAvailabilities)
        }

        if(availabilities.length == 0){
            fetchAvailabilities()
        }
    },[id, availabilities.length])
  return (
    <>
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '900px', margin: '0 auto' }}>

        <h1 className='text-center'>cancha: {name}</h1>
        <h4 className='text-center'>disponibilidades:</h4>
        <div class="d-flex justify-content-center">

            <table className="table justify-center" style={{width:"80%"}}>
                <thead>
                    <tr>
                        <th scope='col' className="text-center align-middle">Día</th>
                        <th scope='col' className="text-center align-middle">Hora de Apertura</th>
                        <th scope='col' className="text-center align-middle">Hora de Cierre</th>
                    </tr>
                </thead>
                <tbody>
                    {daysOfWeek.map((day) => {
                        const avialability = availabilities.find((a) => a.dayOfWeek == day.key)
                        return(
                            <tr key={day.key}>
                                <td className='text-center'>
                                    {day.label}
                                </td>
                                <td className='text-center'>
                                    {avialability ? avialability.beginingTime : "Sin Asignar"}
                                </td>
                                <td className='text-center'>
                                    {avialability ? avialability.endingTime : "Sing Asignar"}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
                
        <h4 className='text-center'>Seleccionar el rango de fechas:</h4>
        
        <div className='d-flex justify-content-center'>
            <div class="row justify-content-center">
                <div class="col  d-flex align-items-center">
                    <label className='form-label mb-0 me-2'>Desde: </label>
                    <DatePicker
                        className='form-control'
                        selected={beginingDate}
                        onChange={date => setBeginingDate(date)}
                        placeholderText='Seleccioná una fecha'
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}  
                    />
                </div>
                <div class="col d-flex align-items-center">
                <label className='form-label mb-0 me-2'>Hasta: </label>
                <DatePicker
                        className='form-control'
                        selected={endingDate}
                        onChange={date => setEndingDate(date)}
                        placeholderText='Seleccioná una fecha'
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}  
                    />
                </div>
            </div>
        </div>

        <h4 className='text-center mt-5'>Selecciona Si tienes alguna fecha especial: </h4>
        <div class="row align-items-center justify-content-center">
            <div class="col-auto mb-3 d-flex align-items-center">
                <label className='me-3 mb-0  '>Fecha: </label>
               <DatePicker
                    className='form-control'
                    selected={specialDate}
                    onChange={date => setSpecialDate(date)}
                    placeholderText='Seleccioná una fecha'
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}  
                />
            </div>
            <div className='col-4'>
                <InputComponent label="Desde" type="time" value={specialDateBeginingTime} setValue={setSpecialDateBeginingTime}/>
            </div>
            <div className='col-4'>
               <InputComponent label="Hasta" type="time" value={specialDateEndingTime} setValue={setSpecialDateEndingTime}/>
            </div>

                
        </div>
            <div class="row justify-content-center m-3 g-3">
                <div className='col-auto d-flex align-items-center'>
                <InputComponent label="Disponible" type="checkbox" value={specialDateIsAvailable} setValue={setSpecialDateIsAvailable}/>
                
            </div>
            <button className='btn btn-primary btn-lg mb-5'
            onClick={() => handleAddSpecialDate()}>
                Agregar Fecha Especial
            </button>
        </div>

        <h4 className='text-center'>Lista de Fechas especiales:</h4>
        <div class="d-flex justify-content-center">

            {specialDates.length > 0 ? (
                    <table className="table justify-center" style={{width:"80%"}}>
                        <thead>
                            <tr>
                                <th scope='col' className="text-center align-middle">Fecha</th>
                                <th scope='col' className="text-center align-middle">Hora de Apertura</th>
                                <th scope='col' className="text-center align-middle">Hora de Cierre</th>
                                <th scope='col' className="text-center align-middle">Disponible</th>
                                <th scope='col' className="text-center align-middle">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specialDates.map((date, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>
                                            {date.specificDate}
                                        </td>
                                        <td className='text-center'>
                                            {date.beginingTime}
                                        </td>
                                        <td className='text-center'>
                                            {date.endingTime}
                                        </td>
                                        <td className='text-center'>
                                            {date.active ? "Disponible" : "NO Disponible"}
                                        </td>
                                        <td>
                                            <button className='btn btn-danger'
                                            onClick={() => handleDeleteSpecialDate(date)}>
                                                Eliminar
                                            </button>
                                        </td>   
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    
                ):("No hay fechas especiales guardadas")}
        </div>
        <div className='row justify-content-center m-3 g-3'>
            <button className='btn btn-primary btn-lg mt-5' onClick={() => handleSubmitReservations()}>
                Crear Reservas
            </button>
        </div>
    </div>
        
    </>
  )
}
