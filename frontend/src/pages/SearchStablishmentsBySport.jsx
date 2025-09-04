import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StablishmentContext } from '../context/StablishmentContext'
import { StablishmentCardComponent } from '../Component/StablishmentCardComponent'


export const SearchStablishmentsBySport = () => {
    /* used States */
    const { sport } = useParams()
    const { stablishments } = useContext(StablishmentContext)

    const [filteredStablishments, setFilteredStablishments] = useState([])

    /* filter the stablishments to those that have a sportField for the given sport */
    useEffect(() => {
        setFilteredStablishments(stablishments.all.filter((st) => st.sports.some((sp) => sp == sport)))
        
    },[stablishments, sport])


  return (
    <>
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '1000px', margin: '0 auto' }}>
            <h3 className='text-center'>Establecimientos para jugar {sport}:</h3>
            <div className='container'>

                    {filteredStablishments.length > 0 ? (
                        <>
                        <div className='row row-cols-1 row-cols-md-2 g-4'>
                            {filteredStablishments.map((stablishment) => (
                                <div key={stablishment.id} className='col'>
                                <StablishmentCardComponent 
                                stablishment={stablishment}/>
                                </div>
                            ))}
                    </div>
                        </>
                    ):(<div className='text-center m-5'>No hay establecimientos para jugar {sport}</div>)}
            </div>
    </div>        
    </>
  )
}
