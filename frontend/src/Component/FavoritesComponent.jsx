import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { StablishmentCardComponent } from './StablishmentCardComponent'
import { StablishmentContext } from '../context/StablishmentContext'

export const FavoritesComponent = () => {
    const {user} = useContext(AuthContext)
    const [favoritesStablishments, setFavoritesStablishments] = useState([])
    const {stablishments} = useContext(StablishmentContext)
    const allStablishments = stablishments.all
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        const {current} = scrollRef
        const scrollAmount = 300

        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    useEffect(() => {
        if (!user?.favorites?.length || !allStablishments?.length) return;
        const favorites = allStablishments.filter(s => user.favorites.includes(s.id))
        setFavoritesStablishments(favorites)
    },[user.favorites, allStablishments])
    return(
        <>

            <div className="position-relative">
                  <button 
                    className="btn btn-outline-primary position-absolute top-50 start-0 translate-middle-y z-1"
                    onClick={() => scroll('left')}
                  >
                    &lt;
                  </button>
            
                  <h3 className='text-center'>Mis Favoritos</h3>
            
            
                    <div
                      className="d-flex overflow-auto gap-3 px-5"
                      ref={scrollRef}
                      style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
                    >
                      {favoritesStablishments.map((s) => (
                        <div key={s.id} style={{ flex: "0 0 250px" }}>
                            <StablishmentCardComponent key={s.id} stablishment={s} />
                        </div>
                      ))}
                    </div>
                     <button 
                    className="btn btn-outline-primary position-absolute top-50 end-0 translate-middle-y z-1"
                    onClick={() => scroll('right')}
                  >
                    &gt;
                  </button>
                 </div>
        </>
    )
}
