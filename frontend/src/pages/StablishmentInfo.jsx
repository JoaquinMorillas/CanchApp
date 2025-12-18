import { useApi } from '../context/AxiosInstance'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapComponent } from '../Component/MapComponent'
import { SportCardComponent } from '../Component/SportCardComponent'
import { sportsInfo } from '../data/sportsInfo'
import { OpinionComponent } from '../Component/OpinionComponent'
import Swal from 'sweetalert2'
import withReactContent from "sweetalert2-react-content";

import { LeftArrowComponent } from '../Component/LeftArrowComponent'
import { AuthContext } from '../context/AuthContext'
import { LoadingContext } from '../context/LoadingContext'
import { WhatsappButtonComponent } from '../Component/WhatsappButtonComponent'

export const StablishmentInfo = () => {
    /* used States */
    const api = useApi()
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const {startLoading, stopLoading} = useContext(LoadingContext)

    const [stablishment, setStablishment] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages]= useState([])
    const [city, setCity]= useState("")
    const [street, setStreet] = useState("")
    const [number, setNumber] = useState("")
    const [sports, setSports] = useState([])
    const [telephoneNumber, setTelephoneNumber] = useState("")
    const [amenities, setAmenities] = useState([])
    const [policies, setPolicies] = useState([])
    const [ratings, setRatings] = useState([])
    const [sportFieldsNames, setSportFieldsNames] = useState([])
    const [lon, setLon] = useState("")
    const [lat, setLat] = useState("")
    const MySwal = withReactContent(Swal);

    const baseURL = "http://localhost:8080"

    const handleRate = async () => {
        if(!user){
            Swal.fire({
                title:"Registrate en Canchapp",
                text:`Para poder puntuar debes registrarte.
                 Puedes hacerlo usando los botones situados
                 en la parte superior derecha.`,
                 icon:"warning",
                 showCloseButton:true


            })
            return
        }
        const response = await MySwal.fire({
            title: "¡Puntua este local!",
            html: 
            <>  
            <div>
                <label htmlFor="swal-rating">Puntuacion:</label>
                <input id="swal-rating" type="number" min="1" max="5" placeholder="5" class="swal2-input" />
            </div>
            <div>
                <textarea id="swal-comment" class="swal2-textarea" placeholder="Contanos tu opinion!"></textarea>
            </div>
            </>,
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText:"Cancelar",
            confirmButtonText: "Confirmar",
            preConfirm: () => {
                const rating = document.getElementById("swal-rating").value
                const opinion = document.getElementById("swal-comment").value
                return {rating, opinion}
            }

        })
        if(response.isConfirmed){
            const {rating, opinion} = response.value
            if(rating == null || rating==""){
                Swal.fire({
                    title: "Error",
                    text: "Es necesario poner una puntacion",
                    icon: "error"
                })
            return
            }
            
            try{
                startLoading()
                const apiResponse = await api.post(`rating/rate/${id}`, {"value":rating, "opinion":opinion})
                const data = apiResponse.data
                Swal.fire({
                    title:"Muchas Gracias por tu puntuacion",
                    text:`Has puesto un puntaje de ${data.value} al establecimiento`,
                    icon:"success",
                    showCloseButton:true,
                    cancelButtonText:"Continuar"
                })
                const prevStablishment = stablishment
                const newNumberOfRatings = prevStablishment.numberOfRatings + 1
                const newSumOfRatings = prevStablishment.sumOfRatings + data.value
                const newAverageRating = newSumOfRatings/newNumberOfRatings
                setStablishment({...prevStablishment,
                    ratings:[...ratings, data],
                    numberOfRatings:newNumberOfRatings,
                    sumOfRatings: newSumOfRatings,
                    averageRating: newAverageRating
                })
                setRatings([...ratings, data])
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                });
            }finally{
                stopLoading()
            }
            
        }
    }

    const RatingDisplay = (rating) => {
  
    const getImage = (index) => {
        if (rating >= index + 1) return "/full-ball1.png";
        if (rating >= index + 0.5) return "/half-ball1.png";
        return "/empty-ball1.png";
    };
    return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <img
          key={i}
          src={getImage(i)}
          alt="rating ball"
          style={{ width: "25px", height: "25px" }}
        />
      ))}
     <span
        className="badge"
        style={{
            marginLeft: "6px",
            fontSize: "1.5rem",
            backgroundColor: "var(--bs-secondary)"
        }}
        >
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
     
    /* fetch the stablishment and set the states */
    useEffect(() => {
        const fetchStablishment = async () =>{
            const response = await api.get(`/stablishment/${id}`)
            const gettedStablishment = response.data
            setStablishment(gettedStablishment)
            setName(gettedStablishment.name)
            setDescription(gettedStablishment.description)
            setImages(gettedStablishment.images)
            setCity(gettedStablishment.city)
            setStreet(gettedStablishment.street)
            setNumber(gettedStablishment.number)
            setSports(gettedStablishment.sports)
            setSportFieldsNames(gettedStablishment.sportFieldsNames)
            setAmenities(gettedStablishment.amenities)
            setPolicies(gettedStablishment.policies)
            setRatings(gettedStablishment.ratings)
            setTelephoneNumber(gettedStablishment.telephoneNumber)
            
        }
        

        if(!stablishment){
            fetchStablishment()
            
        }
     
    },[id, stablishment])

    /* used for getting the map for the given address */
    useEffect(() => {
        const geocodeAddress = async (street, number, city) => {
            const address = `${street} ${number} ${city}`
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

            try{
                const response =  await fetch(url, {
                headers: { 'User-Agent': 'canchApp (joaquimmorillasarce@gmail.com)' } 
                });
                const data = await response.json();
                if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLat(parseFloat(lat))
                setLon(parseFloat(lon))
                }
            }catch(err){
            console.error(err)
            }
        }
           if(stablishment){
            geocodeAddress(street, number, city)
        }
    },[stablishment, street, number, city])
  return ( 
    <>  
    <WhatsappButtonComponent telephoneNumber={telephoneNumber} userName={user?.firstName} stablishmentName={name}/>
    <div style={{maxWidth:"95%", margin:"0 auto", backgroundColor:"var(--bs-light)"}}>

        <LeftArrowComponent />
        <h3 className='text-left mb-2 pt-3 ps-2'>{name}</h3>
        <div className='d-flex align-items-center mb-5'>{stablishment?.averageRating 
            && <><h5 className='me-3 ps-2'>Puntuacion:</h5>
            
            {RatingDisplay(stablishment.averageRating)}
            </>}
            <button className='btn btn-lg btn-primary ms-5'
            onClick={() => handleRate()}>
                Puntuar Establecimiento
            </button>
        </div>
        <h5 className='text-left mb-3 ps-2'>{description}</h5>

        <div className='container-fluid'
        style={{backgroundColor:"var(--bs-light)"}}>
            <div className='row g-2'>
                <div className='col-12 col-md-6'
                style={{border:"1px solid var(--bs-border-color)"}}>
                    <h6 className='text-center p-3'>Ubicacion:</h6>
                    <h5 className='text-center fw-bold'>{street}, {number}, {city} </h5>
                    
                    {lat && lon ? (

                    <MapComponent lat={lat} lon={lon} zoom={16} height={'250px'} width={'95%'} popUp={`${street}, ${number}`}>

                    </MapComponent>
                    ) : (<div>Mapa no Disponible</div> )}
                </div >
                    <div className="col-12 col-md-6 mt-2"
                    style={{border:"1px solid var(--bs-border-color)"}}>
                    <h5 className="text-center mb-2 p-3">Deportes:</h5>
                    <div className="row g-2 justify-content-center mb-2">
                        {sports && sports.length > 0 ? (
                        sports.map((sport, index) => {
                            
                            return (
                            <div key={index} className="col-6 col-sm-4 col-md-6 col-lg-4 ">
                                <SportCardComponent sport={sport} buttonText='Reservar Ahora' link={`/establecimientos/${id}/${sport.name}/reservar`}></SportCardComponent>
                            </div>
                            );
                        })
                        ) : (
                        <p>Sin Deportes</p>
                        )}
                    </div>
                    </div>
            </div>

        </div>

        {amenities && amenities.length > 0 && (
            <div className="container-fluid mt-5 mb-5"
            style={{backgroundColor:"var(--bs-light)", border:"1px solid var(--bs-border-color)"
            }}>
                <h5 className='text-center pt-3'>Prestaciones:</h5>
                <div className='row m-3'>

                    {amenities.map((amenity, idx) => (
                        <div key={idx} 
                        className='col-3 d-flex align-items-center justify-content-evenly mb-2'>
                        <img src={amenity.iconUrl} alt={amenity.name}
                            title={amenity.name}
                             />
                        <p>{amenity.name}</p>
                        </div>

                    ))}
                </div>
            </div>
        )}
        {policies.length > 0 ? (
             <div className="container-fluid mt-5 mb-5"
            style={{backgroundColor:"var(--bs-light)", border:"1px solid var(--bs-border-color)"
            }}>
                <h5 className='text-center pt-3'>Politicas:</h5>
                <div className='container'>
                    <div className='row d-flex align-items-center justify-content-center'
                    style={{border:"1px solid var(--bs-border-color)"}}>
                    {policies.map((policy, idx) =>(
                        <div className='col-3 m-2' key={idx}
                        style={{border:"1px solid black", width:"300px", height:"150px"}}>
                            <div className='row text-center'>
                                <strong>{policy.title}</strong>
                            </div>
                            <div className='row text-center p-2'>
                                {policy.description}
                            </div>
                        </div>
                    ))}

                    </div>
                </div>
            </div>    
        ):(
            <div className="mt-5 mb-5"
            style={{backgroundColor:"var(--bs-light)", border:"1px solid var(--bs-border-color)"}}>
                 <h3 className='text-center'>Sin Politicas</h3>
            </div>
        )}

        {ratings.length > 0 ? (
            <>
                <div className="container-fluid mt-5 mb-5"
            style={{backgroundColor:"var(--bs-light)", border:"1px solid var(--bs-border-color)"
            }}>
                <h5 className='text-center pt-3'>Puntuaciones:</h5>
                {ratings.map((rating, idx) => (
                    <div key={idx}>
                        <OpinionComponent rating={rating}/>
                    </div>
                ))}
            </div>
            </>
        ):(
            <div className="mt-5 mb-5"
            style={{backgroundColor:"var(--bs-light)", border:"1px solid var(--bs-border-color)"}}>
                <h4 className='text-center'>Este establecimiento todavia no tiene Puntuaciones</h4>
            </div>
        )}
        {images && images.length > 0 ? (
        
        <div className="container-fluid mt-5 mb-5"
        style={{backgroundColor:"var(--bs-light)",border:"1px solid var(--bs-border-color)"
        }}>
            <h5 className='text-center p-3'>Galeria de Imagenes:</h5>
            <div className="row g-2">
                
                <div className="col-12 col-md-6">
                <img
                    src={images[0].imageUrl}
                    alt="Main"
                    className="img-fluid w-100 h-100 object-fit-cover"
                    style={{ minHeight: "300px" }}
                />
                </div>

                
                <div className="col-12 col-md-6 position-relative">
                    <div className="row g-2">
                        {images.map((i) => (
                            <div className="col-6">
                                <img src={i.imageUrl} alt="" className="img-fluid w-100 h-100 object-fit-cover" />
                            </div>
                        ))}
                
                    </div>
                        
                         <span
                            className="btn btn-dark btn-sm position-absolute bottom-0 end-0 m-2"
                            style={{ fontSize: "0.85rem", cursor:"pointer" }}
                            onClick={() => setShowModal(true)}
                            >
                             Ver más
                         </span>
                </div>
            </div>
        </div>
        ):(
            <h6>Sin imagenes</h6>
        )}

        {/* Modal */}
        <div   className={`modal fade ${showModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>

            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content bg-dark">
                    <div className="modal-header border-0">
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowModal(false)}
                    ></button>
                    </div>
                    <div className="modal-body">
                    {/* Bootstrap Carousel */}
                    <div
                        id="imagesCarousel"
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner">
                        {images.map((img, idx) => (
                            <div
                            key={idx}
                            className={`carousel-item ${idx === 0 ? "active" : ""}`}
                            >
                            <img
                                src={img.imageUrl}
                                className="d-block w-100"
                                alt=""
                                style={{ objectFit: "contain", maxHeight: "90vh" }}
                            />
                            </div>
                        ))}
                        </div>
                        <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#imagesCarousel"
                        data-bs-slide="prev"
                        >
                        <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#imagesCarousel"
                        data-bs-slide="next"
                        >
                        <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    </>
  )
}
