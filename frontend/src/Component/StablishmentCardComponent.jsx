import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { MapComponent } from './MapComponent'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { useApi } from '../context/AxiosInstance'
import {jwtDecode }from "jwt-decode"
import { ShareComponent } from './ShareComponent'


export const StablishmentCardComponent = ( { stablishment }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const {user, setUser} = useContext(AuthContext)
  const api = useApi()

  

  const handleAddFavorite = async () => {
    if (!user){
      Swal.fire({
        title:"¡Aun no estas Registrado!",
        text:"Para añidir un favorito debes registrarte",
        icon:"warning",
        showCloseButton:true
      })
      return
    }
    setUser({...user, favorites:[...user.favorites, stablishment.id]})
    
     try{
      await api.post(`/user/${user.id}/favorites/${stablishment.id}`);
      setUser({...user, favorites:[...user.favorites, stablishment.id]})
     }catch(error){
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.response?.data || error.message,
        icon: "error"
        });
     }
    
  }

  const handleDeleteFavorite = async() => {
    const confirm = await Swal.fire({
      title:"Atencion",
      text:"¿Estas seguro que quieres quitar el establecimento de tus favoritos?",
      icon:"question",
      showConfirmButton:true,
      showCancelButton:true
    })

    if(confirm.isConfirmed){
      await api.post(`/user/${user.id}/favorites/delete/${stablishment.id}`)
      setUser({...user, favorites:user.favorites.filter((id) => id !== stablishment.id)})
    }
      
  }

  const RatingDisplay = (rating) => {
  
  const getImage = (index) => {
    if (rating >= index + 1) return "/full-ball.png";
    if (rating >= index + 0.5) return "/half-ball.png";
    return "/empty-ball.png";
  };

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <img
          key={i}
          src={getImage(i)}
          alt=""
          style={{ width: "25px", height: "25px" }}
        />
      ))}
      <span className="badge"
      style={{ marginLeft: "6px", fontSize: "0.9rem",
        backgroundColor:"var(--bs-secondary)"
       }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

  useEffect(() => {
    if (!showDetails) return
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
        geocodeAddress(stablishment.street, stablishment.number, stablishment.city)
  },[showDetails])

  

  return (
    <>
    <div className="card text-center d-flex flex-column justify-content-between h-100">
        <div className='position-relative'
         style={{
            width: "80%",
            height: "180px",
            backgroundColor: "#f8f9fa",
            overflow: "hidden",
            borderRadius: "10px",
            margin: "0 auto"
          }}>
            
          <img src={stablishment.images && stablishment.images.length > 0
              ? stablishment.images[0].imageUrl
              : "/src/assets/genericPlaceHolder.jpeg"
          }
          class="card-img-top" 
          alt={stablishment.name} 
          style={{
            width: "100%", 
            height: "180px", 
            objectFit: "scale-down",
            borderRadius: "10px",
            
          }}/>
          <button className='position-absolute'
          title='Compartir'
          onClick={() => setShowShare(!showShare)}
          
            style={{
              top: "10px",
              right: "40px",
              backgroundColor: "white",
              borderRadius: "50%",
              border: "none",
              width: "25px",
              height: "25px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              
            }}
          >
            <img src="/share-icon(1).png" alt="compartir" 
            style={{ width: "25px", height: "25px" }}/>
          </button>

          <button className="position-absolute"
            title="Añadir a Favoritos"
            onClick= {user && user.favorites?.some(id => id == stablishment.id)
              ?() => handleDeleteFavorite()
              :() => handleAddFavorite()
            }
            style={{
              top: "10px",
              right: "10px",
              backgroundColor: "white",
              borderRadius: "50%",
              border: "none",
              width: "25px",
              height: "25px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              
            }}
            >
            
            <img src={user && user.favorites?.some(id => id == stablishment.id) 
            ? '/icons8-estrella-50(1).png'
            :'/icons8-estrella-50.png'}
            style={{ width: "25px", height: "25px" }}>
            </img>
          </button>
        </div>
        
        {showShare && (
          <ShareComponent stablishment={stablishment} onClose={() => setShowShare(false)}/>
        )}
        <div className="card-body d-flex flex-column justify-content-between">
            {stablishment?.averageRating && (

              <div className="d-flex align-items-center justify-content-center mb-2">
              
                {RatingDisplay(stablishment.averageRating)}
                
              </div>
            )}
            <h3 className="card-title mb-3">{stablishment.name}</h3>
            <div className=' text-center'>

              <button className='btn btn-sm btn-outline-secondary mb-3'
                onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Ocultar" : "Mostrar Detalles"}
                </button>
            </div>
            {showDetails && (
              <div className='container mt-3 mb-3'
              >
                <div className='row'>
                  {/*amenity col*/}
                  <div className='col-12 me-1'
                  style={{backgroundColor: "var(--bs-light)"}}>

                    <h6 className='text-center mt-3'>Prestaciones:</h6>
                    <div className='row'>
                      {stablishment.amenities.length > 0 && (
                        stablishment.amenities.map((amenity,idx) => (
                          <div key={idx} className="col-3 d-flex align-items-center  justify-content-evenly mb-2">
                            
                            <img src={amenity.iconUrl} alt={amenity.name}
                            title={amenity.name}
                             />

                          </div>

                        )
                        ))}
                  </div>
                </div>
                <div className='container me-3'
                style={{backgroundColor: "var(--bs-light)"}}>
                        <h6 className='text-center m-3'>
                          Direccion: {stablishment.street}
                          , {stablishment.number}
                          , {stablishment.city}
                        </h6>
                  <div className='row'>

                      <div className='col-12 me-1'>
                        {console.log("coords:", lat, lon)}
                      {lat && lon && lat !== NaN && lon !== NaN ? (
                        <MapComponent lat={lat} lon={lon} zoom={16} height={'150px'} width={'95%'} popUp={`${stablishment.street}, ${stablishment.number}`}>

                        </MapComponent>
                      ):(<p>...Cargando Mapa </p>
                      )}
                    </div>
                  </div>  
                </div>

                </div>
              </div>
            )}
            <Link to={`/establecimientos/${stablishment.id}`}>
              <button 
                  className="btn btn-lg mt-2 align-self-center"
                  style={{ backgroundColor: "var(--bs-dark)", color: "var(--bs-light)" }}>
                  Reservar cancha
              </button>
            </Link>
        </div>
    </div>

    </>
  )
}
