import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { MapComponent } from './MapComponent'

export const StablishmentCardComponent = ( { stablishment }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)

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
        <img src={stablishment.images && stablishment.images.length > 0
            ? stablishment.images[0].imageUrl
            : "/src/assets/genericPlaceHolder.jpeg"
        }
         class="card-img-top mt-3" 
         alt={stablishment.name} 
         style={{
          width: "100%", 
          height: "180px", 
          objectFit: "scale-down"
        }}/>
        <div className="card-body d-flex flex-column justify-content-between">
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
