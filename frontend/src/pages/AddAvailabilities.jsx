import {useState} from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

export const AddAvailabilities = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    /* States for the 7 days */
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


    /*Checks if the given times are valid meaning the bigining time is before the ending time */
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
    /* the form that will be uploaded */
    const availabilities = [
        {
        sportFieldId : id,
        dayOfWeek: "MONDAY",
        beginingTime: mondayBegining,
        endingTime: mondayEnding,
        specificDate: null,
        active: isMondayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "TUESDAY",
        beginingTime: tuesdayBegining,
        endingTime: tuesdayEnding,
        specificDate: null,
        active: isTuesdayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "WEDNESDAY",
        beginingTime: wednesdayBegining,
        endingTime: wednesdayEnding,
        specificDate: null,
        active: isWednesdayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "THURSDAY",
        beginingTime: thursdayBegining,
        endingTime: thursdayEnding,
        specificDate: null,
        active: isThursdayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "FRIDAY",
        beginingTime: fridayBegining,
        endingTime: fridayEnding,
        specificDate: null,
        active: isFridayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "SATURDAY",
        beginingTime: saturdayBegining,
        endingTime: saturdayEnding,
        specificDate: null,
        active: isSaturdayActive
        },
        {
        sportFieldId : id,
        dayOfWeek: "SUNDAY",
        beginingTime: sundayBegining,
        endingTime: sundayEnding,
        specificDate: null,
        active: isSundayActive
        }
    ]

    /* helper function to save each individual availability,
    it is pass on the handle submit for every active day*/
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
    /* main function of the page it uploads the form and create the availabilities*/
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
            
            const savePromises = activeAvailabilities.map((a) => saveAvailability(a))
            
            await Promise.all(savePromises) /* awaits for all the availabilites to be handled before contiue*/

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
            
            <h5 className='text-center'>Horarios Disponibles: </h5>

            {/* Monday*/}
            
            <h4 className="text-center">Lunes</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={mondayBegining}
                onChange={(e) => setMondayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={mondayEnding}
                onChange={(e) => setMondayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="mondayAvailable"
                        checked={isMondayActive}
                        onChange={(e) => setIsMondayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* Tuesday*/}
            
            <h4 className="text-center">Martes</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={tuesdayBegining}
                onChange={(e) => setTuesdayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={tuesdayEnding}
                onChange={(e) => setTuesdayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="TuesdayAvailable"
                        checked={isTuesdayActive}
                        onChange={(e) => setIsTuesdayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* Wede*/}
            
            <h4 className="text-center">Miercoles</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={wednesdayBegining}
                onChange={(e) => setWednesdayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={wednesdayEnding}
                onChange={(e) => setWednesdayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="WednesdayAvailable"
                        checked={isWednesdayActive}
                        onChange={(e) => setIsWednesdayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* thurdsday */}
            
            <h4 className="text-center">Jueves</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={thursdayBegining}
                onChange={(e) => setThursdayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={thursdayEnding}
                onChange={(e) => setThursdayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="ThurdsdayAvailable"
                        checked={isThursdayActive}
                        onChange={(e) => setIsThursdayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* Friday */}
            
            <h4 className="text-center">Viernes</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={fridayBegining}
                onChange={(e) => setFridayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={fridayEnding}
                onChange={(e) => setFridayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="fridayAvailable"
                        checked={isFridayActive}
                        onChange={(e) => setIsFridayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* saturday */}
            
            <h4 className="text-center">Sabado</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={saturdayBegining}
                onChange={(e) => setSaturdayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={saturdayEnding}
                onChange={(e) => setSaturdayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="SaturdayAvailable"
                        checked={isSaturdayActive}
                        onChange={(e) => setIsSaturdayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            {/* Sunday */}
            
            <h4 className="text-center">Domingo</h4>
            

            <div class="mb-5 d-flex align-items-center gap-2">
                
            
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Desde: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={sundayBegining}
                onChange={(e) => setSundayBegining(e.target.value)} 
                placeholder='Ej: 10:00'
                style={{ maxWidth: "250px" }}
                required/>
          
                <label  className="me-3 mb-0"
                style={{  width: "250px", textAlign: "right" }}>
                Hasta: 
                </label>
            
                <input 
                type="time" 
                class="form-control"
                value={sundayEnding}
                onChange={(e) => setSundayEnding(e.target.value)} 
                placeholder='Ej: 23:00'
                style={{ maxWidth: "250px" }}
                required/>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="SundayAvailable"
                        checked={isSundayActive}
                        onChange={(e) => setIsSundayActive(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Disponible
                    </label>
                    
                </div>
          
            </div>

            <div className="d-flex justify-content-center mt-4 gap-3">
                
                <NavLink to={`/canchas/editar/${id}`}>
                    <button className='btn btn-secondary'>Atras</button>    
                </NavLink>
                
                <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
            </div>
        </div>

        
    </>
  )
}
