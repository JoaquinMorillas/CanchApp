import React from 'react'
import { Link } from 'react-router-dom'

export const StablishmentCardComponent = ( { stablishment }) => {

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
            <h5 className="card-title">{stablishment.name}</h5>
            <Link to={`/establecimientos/${stablishment.id}`}>
              <button 
                  className="btn btn-primary btn-lg mt-2 align-self-center">
                  Reservar cancha
              </button>
            </Link>
        </div>
    </div>

    </>
  )
}
