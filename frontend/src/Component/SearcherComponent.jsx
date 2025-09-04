import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

registerLocale("es", es)
setDefaultLocale("es")

export const SearcherComponent = () => {
  const navigate = useNavigate()
    const [sports, setSports] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCity, setSelectedCity] = useState("");
    const [selectedSport, setSelectedSport] = useState("")
    const [selectedSportValue, setSelectedSportValue] = useState("")
    const [selectedDate, setDate] = useState(null);

    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredSports, setFilteredSports] = useState([]);

    const [showCitiesSuggestions, setShowCitiesSuggestions] = useState(false);
    const [showSportsSuggestions, setShowSportsSuggestions] = useState(false);

    const baseUrl = "http://localhost:8080"

    const handleSearch = () => {
      if(!selectedCity){
        Swal.fire({
          title:"Introduzca una ciudad",
          icon:"error",
          showCloseButton:true
        })
        return
      }
      if(!selectedSport){
        Swal.fire({
          title:"Introduzca una deporte",
          icon:"error",
          showCloseButton:true
        })
        return
      }
      if(!selectedDate){
        Swal.fire({
          title:"Introduzca una fecha",
          icon:"error",
          showCloseButton:true
        })
        return
      }
      const formattedDate = selectedDate.toISOString().split("T")[0]
      navigate(`canchas/reservar/${selectedSportValue}/${selectedCity}/${formattedDate}`)
    }

    useEffect(()=>{
        axios.get(baseUrl + "/address/cities").then((res)=> setCities(res.data));
        axios.get(baseUrl + "/sport").then((res) => setSports(res.data))
    }, [])

    useEffect(() =>{
      setFilteredCities(
        cities.filter((c)=>
        c.toLowerCase().startsWith(selectedCity.toLowerCase()))
      )
    }, [selectedCity])

    useEffect(() =>{
      setFilteredSports(
        sports.filter((s) =>
        s.label.toLowerCase().startsWith(selectedSport.toLowerCase()))
      )
    }, [selectedSport])

  return (
    <>
      <div className='container-fluid my-1 p-3 border rounded shadow align-items-center'
      style={{ "backgroundColor" : "var(--bs-primary)"}}>
        <h4 className='mb-3'>¿A que vas a jugar hoy?</h4>
        <div className="row g-3 align-items-end">
          {/* city input*/}
          <div className='col-md-4 mb-3 position-relative'>
            <label className='form-label m-3'>Cuidad: </label>
            <input 
            type="text"
            value={selectedCity}
            placeholder='Ej. Rio cuarto'
            onFocus={() => setShowCitiesSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCitiesSuggestions(false), 500)}
            onChange={(e) => setSelectedCity(e.target.value)} />

            {selectedCity && filteredCities.length > 0 && showCitiesSuggestions &&(
            <ul className="list-group position-absolute w-40 z-1000"
            style={{ "zIndex" : "1005"}}>
              {filteredCities.map((city, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
          </div>

          {/* sportInput*/}
          <div className='col-md-4 mb-3 position-relative'>
            <label className='form-label m-3'>Deporte: </label>
            <input 
            type="text"
            value={selectedSport}
            placeholder='Ej. futbol 7'
            onChange={(e) => setSelectedSport(e.target.value)} 
            onFocus={() => setShowSportsSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSportsSuggestions(false), 500)}
            />

            {selectedSport && filteredSports.length > 0 && showSportsSuggestions &&(
            <ul className="list-group position-absolute w-40 z-3"
            style={{zIndex : "1005"}}>
              {filteredSports.map((sport, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => {setSelectedSport(sport.label);
                                setSelectedSportValue(sport.name);
                              console.log(selectedSportValue)}}
                >
                  {sport.label}
                </li>
              ))}
            </ul>
          )}
          </div>

          {/* Date input*/}
          <div className='col-md-4 mb-3'>
            <label className='form-label m-3'>Fecha: </label>
            <DatePicker
              className='form-control'
              selected={selectedDate}
              onChange={date => setDate(date)}
              placeholderText='Seleccioná una fecha'
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}  
            />

          </div>
          {/* TODO: ADD the button funcionality*/}
          <div className="col-12 text-center mt-3"> 
            <button className='btn btn-warning w-30 w-lg-auto btn-lg'
            onClick={()=> handleSearch()}> Buscar</button>
          </div>
        </div>
      </div>

    </>
  )
}
