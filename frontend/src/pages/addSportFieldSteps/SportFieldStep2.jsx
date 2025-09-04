import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { InputComponent } from "../../Component/InputComponent"



export const SportFieldStep2 = ({stablishment, onBack, sportFieldId}) => {
    
    /* States used in this step*/
    const navigate = useNavigate()
    const [mondayBegining, setMondayBegining] = useState("")
    const [mondayEnding, setMondayEnding] = useState("")
    const [isMondayActive, setIsMondayActive] = useState(true)
    
    const [tuesdayBegining, setTuesdayBegining] = useState("")
    const [tuesdayEnding, setTuesdayEnding] = useState("")
    const [isTuesdayActive, setIsTuesdayActive] = useState(true)

    const [wednesdayBegining, setWednesdayBegining] = useState("")
    const [wednesdayEnding, setWednesdayEnding] = useState("")
    const [isWednesdayActive, setIsWednesdayActive] = useState(true)

    const [thursdayBegining, setThursdayBegining] = useState("")
    const [thursdayEnding, setThursdayEnding] = useState("")
    const [isThursdayActive, setIsThursdayActive] = useState(true)

    const [fridayBegining, setFridayBegining] = useState("")
    const [fridayEnding, setFridayEnding] = useState("")
    const [isFridayActive, setIsFridayActive] = useState(true)

    const [saturdayBegining, setSaturdayBegining] = useState("")
    const [saturdayEnding, setSaturdayEnding] = useState("")
    const [isSaturdayActive, setIsSaturdayActive] = useState(true)

    const [sundayBegining, setSundayBegining] = useState("")
    const [sundayEnding, setSundayEnding] = useState("")
    const [isSundayActive, setIsSundayActive] = useState(true)

    /*  helper function it validates the duration of the reservation*/
    const isValidTimeRange = (beginingTime, endingTime) => {
        if(!beginingTime || !endingTime){
            Swal.fire({
                title: "Error",
                text: "Los campos de horarios son obligatorios",
                icon: "error"
            })
            return false
        }else{
            const [beginingH, beginingM] = beginingTime.split(":").map(Number)
            const [endingH, endingM] = endingTime.split(":").map(Number)

            return endingH * 60 + endingM > beginingH * 60 + beginingM  
        }
    }
    /* form that will be uploaded*/
    const availabilities = [
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "MONDAY",
        beginingTime: mondayBegining,
        endingTime: mondayEnding,
        specificDate: null,
        active: isMondayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "TUESDAY",
        beginingTime: tuesdayBegining,
        endingTime: tuesdayEnding,
        specificDate: null,
        active: isTuesdayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "WEDNESDAY",
        beginingTime: wednesdayBegining,
        endingTime: wednesdayEnding,
        specificDate: null,
        active: isWednesdayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "THURSDAY",
        beginingTime: thursdayBegining,
        endingTime: thursdayEnding,
        specificDate: null,
        active: isThursdayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "FRIDAY",
        beginingTime: fridayBegining,
        endingTime: fridayEnding,
        specificDate: null,
        active: isFridayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "SATURDAY",
        beginingTime: saturdayBegining,
        endingTime: saturdayEnding,
        specificDate: null,
        active: isSaturdayActive
        },
        {
        sportFieldId : sportFieldId,
        dayOfWeek: "SUNDAY",
        beginingTime: sundayBegining,
        endingTime: sundayEnding,
        specificDate: null,
        active: isSundayActive
        }
    ]

    /* helper function it saves the availability on the backend
    on the main funcion this one will run for every active day*/
    const saveAvailability = async (availability) => {
        try{

            const res = await axios.post("http://localhost:8080/availability/save", availability)
        }catch(error){
            Swal.fire({
                title:"Error al guardar los horarios",
                text:error.response?.data?.message || error.response?.data || error.message,
                icon:"error"
            })
        }
    }

    /* main function of this step it saves the availabilities for all the active days*/
    const handleSubmit = async () => {
        try{
            const activeAvailabilities = availabilities.filter((a) => a.active)
            const hasInvalidTimes = activeAvailabilities.some(
                (a) => !isValidTimeRange(a.beginingTime, a.endingTime))
            if (hasInvalidTimes){
                Swal.fire({
                    title:"error",
                    text:"El horario de incio debe ser anterior al horario de finalizacion",
                    icon:"error"
                })
                return
            }
            console.log("availabilites sent: ", activeAvailabilities)
            const savePromises = activeAvailabilities.map((a) => saveAvailability(a))
            await Promise.all(savePromises)

            Swal.fire({
                title:"Exito",
                text:"Horarios Guardados Correctamente",
                icon:"success",
                timer:"2000",
                showConfirmButton:false

            })
            setTimeout(() => {
                navigate("/administracion")
            },2000)

        }catch(error){
            console.error(error)
        }
        
    }
    return (
    <>
        <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h1 className='text-center'>Agregar Cancha para "{stablishment.name}"</h1>
            <h4 className='text-center'>Segundo Paso:</h4>
            <h5 className='text-center'>Horarios Disponibles: </h5>

            {/* Monday*/}
            
            <h4 className="text-center">Lunes</h4>
            <div className="row">
                <div className="col-3">

                <InputComponent label="Desde" type="time" value={mondayBegining} setValue={setMondayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={mondayEnding} setValue={setMondayEnding} />

                </div>
                <div className="col-3">

                    <InputComponent label="Disponible" type="checkbox" value={isMondayActive} setValue={setIsMondayActive}/>
                </div>
            </div>
          
            

            {/* Tuesday*/}
            
            <h4 className="text-center">Martes</h4>
            
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={tuesdayBegining} setValue={setTuesdayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={tuesdayEnding} setValue={setTuesdayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isTuesdayActive} setValue={setIsTuesdayActive}/>
                </div>
            </div>
    

            {/* Wede*/}
            
            <h4 className="text-center">Miercoles</h4>
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={wednesdayBegining} setValue={setWednesdayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={wednesdayEnding} setValue={setWednesdayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isWednesdayActive} setValue={setIsWednesdayActive}/>
                </div>
            </div>

            

            {/* thurdsday */}
            
            <h4 className="text-center">Jueves</h4>
            
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={thursdayBegining} setValue={setThursdayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={thursdayEnding} setValue={setThursdayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isThursdayActive} setValue={setIsThursdayActive}/>
                </div>
            </div>

        
            {/* Friday */}
            
            <h4 className="text-center">Viernes</h4>
            
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={fridayBegining} setValue={setFridayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={fridayEnding} setValue={setFridayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isFridayActive} setValue={setIsFridayActive}/>
                </div>
            </div>

            {/* saturday */}
            
            <h4 className="text-center">Sabado</h4>
            
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={saturdayBegining} setValue={setSaturdayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={saturdayEnding} setValue={setSaturdayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isSaturdayActive} setValue={setIsSaturdayActive}/>
                </div>
            </div>
            
            {/* Sunday */}
            
            <h4 className="text-center">Domingo</h4>
            
            <div className="row">
                <div className="col-3">
                    <InputComponent label="Desde" type="time" value={sundayBegining} setValue={setSundayBegining}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Hasta" type="time" value={sundayEnding} setValue={setSundayEnding}/>
                </div>
                <div className="col-3">
                    <InputComponent label="Disponible" type="checkbox" value={isSundayActive} setValue={setIsSundayActive}/>
                </div>
            </div>
            

            <div className="d-flex justify-content-center mt-4 gap-3">
                
                <button className='btn btn-secondary' onClick={onBack}>Atras</button>
                
                <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
            </div>
        </div>

        
    </>
  )
}
