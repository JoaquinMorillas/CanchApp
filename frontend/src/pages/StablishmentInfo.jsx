import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapComponent } from '../Component/MapComponent'
import { SportCardComponent } from '../Component/SportCardComponent'
import { sportsInfo } from '../data/sportsInfo'

import { LeftArrowComponent } from '../Component/LeftArrowComponent'

export const StablishmentInfo = () => {
    /* used States */
    const { id } = useParams()

    const [stablishment, setStablishment] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages]= useState([])
    const [city, setCity]= useState("")
    const [street, setStreet] = useState("")
    const [number, setNumber] = useState("")
    const [sports, setSports] = useState([])
    const [sportFieldsNames, setSportFieldsNames] = useState([])
    const [lon, setLon] = useState("")
    const [lat, setLat] = useState("")

    const baseURL = "http://localhost:8080"

     
    /* fetch the stablishment and set the states */
    useEffect(() => {
        const fetchStablishment = async () =>{
            const response = await axios.get(baseURL + `/stablishment/${id}`)
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
        <LeftArrowComponent />
        <h3 className='text-left mb-5'>{name}</h3>
        <h5 className='text-left mb-3'>{description}</h5>

        <div className='container-fluid'>
            <div className='row g-2'>
                <div className='col-12 col-md-6'>
                    <h6 className='text-center'>Ubicacion:</h6>
                    <h5 className='text-center fw-bold'>{street}, {number}, {city} </h5>
                    
                    {lat && lon ? (

                    <MapComponent lat={lat} lon={lon} zoom={16} height={'250px'} width={'95%'} popUp={`${street}, ${number}`}>

                    </MapComponent>
                    ) : (<div>Mapa no Disponible</div> )}
                </div>
                    <div className="col-12 col-md-6">
                    <h5 className="text-center mb-2">Deportes:</h5>
                    <div className="row g-2 justify-content-center">
                        {sports && sports.length > 0 ? (
                        sports.map((s, index) => {
                            const sport = sportsInfo.find((sp) => sp.id === s);
                            return (
                            <div key={index} className="col-6 col-sm-4 col-md-6 col-lg-4 ">
                                <SportCardComponent sport={sport} buttonText='Reservar Ahora' link={`/establecimiento/${id}/${sport.id}/reservar`}></SportCardComponent>
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
        
        {images && images.length > 0 ? (
        
        <div className="container-fluid mt-5 mb-5">
            <h5 className='text-center'>Galeria de Imagenes:</h5>
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
    </>
  )
}
