import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { StablishmentContext } from '../context/StablishmentContext';
import { StablishmentCardComponent } from './StablishmentCardComponent';

export const RecomendationsComponent = () => {
    const { stablishments }  = useContext(StablishmentContext);
    
    const [shuffledStablishments, setShuffledStablishments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const totalItemsPerPage = 10


    
  const shuffleStablishments = () =>{ 
    return [...stablishments.all].sort(() => Math.random() - 0.5)
  }
 
  useEffect(() => {
    
    setShuffledStablishments(shuffleStablishments())
    

  }, [stablishments.all])

  const totalPages = Math.ceil(shuffledStablishments.length / totalItemsPerPage)
  const startIndex = (currentPage - 1) * totalItemsPerPage
  const endIndex = startIndex + totalItemsPerPage
  const currentItems = shuffledStablishments.slice(startIndex,endIndex)
   

  
  return (
    <>
      <h3 className='text-center'>Recomendaciones</h3>
     
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {currentItems.map((stablishment, index) => (
            <div className="col" key={index}> 
              <StablishmentCardComponent
              stablishment={stablishment} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1  && (
          <div className='d-flex justify-content-center m-4'>
            <nav>
              <ul className='pagination'>
                <li className={`page-item ${currentPage == 1 ? "disabled" : ""}`}>
                  <button className='page-link'
                  disabled={currentPage == 1}
                  onClick={() => setCurrentPage(currentPage-1)}>
                    Anterior
                  </button>
                </li>
                {[...Array(totalPages)].map((_ , i) => (
                  <li key={i}
                  className={`page-item ${currentPage ==  i + 1 ? "active" : ""}`}>
                    <button className='page-link'
                    onClick={() => setCurrentPage(i+1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage == totalPages ? "disabled" : ""}`}>
                  <button className='page-link'
                  disabled={currentPage == totalPages}
                  onClick={() => setCurrentPage(currentPage +1)}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>

          </div>
        )}
      </div>
       
      
    </>
  )
}
