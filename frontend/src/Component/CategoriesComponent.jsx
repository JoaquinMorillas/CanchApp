import React, { useEffect, useRef, useState } from 'react'
import { SportCardComponent } from './SportCardComponent'
import { sportsInfo } from '../data/sportsInfo'
import { useApi } from '../context/AxiosInstance'

export const CategoriesComponent = () => {
  const api = useApi()
  const [sports, setSports] = useState([])
  const[shuffledSports, setShuffeledSports] = useState([])
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 300;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const shuffleSports = (sports) =>{
    return [...sports].sort(() => Math.random() - 0.5)
  };
  
  useEffect(() => {
    const getSports = async() => {
      const response = await api.get("/sport")
      const gettedSports = response.data
      setSports(gettedSports)
      setShuffeledSports(shuffleSports(gettedSports))
    }
    if(sports.length == 0){
      getSports()
    }
  }, [])


  return (
    <>
     <div className="position-relative">
      <button 
        className="btn btn-outline-primary position-absolute top-50 start-0 translate-middle-y z-1"
        onClick={() => scroll('left')}
      >
        &lt;
      </button>

      <h3 className='text-center'>Buscar por categoria</h3>
        

        <div
          className="d-flex overflow-auto gap-3 px-5"
          ref={scrollRef}
          style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
        >
          {shuffledSports.map((sport, index) => (
            <div className="col" key={index}> 
            <SportCardComponent 
            width='250px'
            sport={sport}
            link={`/establecimientos/buscar/${sport.name}`}/>
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
