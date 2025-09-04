
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StablishmentContext } from '../context/StablishmentContext'
import Swal from 'sweetalert2'
import { SportFieldStep1 } from './addSportFieldSteps/SportFieldStep1'
import { SportFieldStep2 } from './addSportFieldSteps/SportFieldStep2'

export const AddSportFieldPage = () => {
    const { id } = useParams()
    const { stablishments } = useContext(StablishmentContext)

    const [stablishment, setStablishment] = useState({})

    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        name : "" ,
        price : "" ,
        reservationDuration : "" ,
        sport : "",
        
    })
    
    const [sportFieldId, setSportFieldId] = useState("");
    
    
    useEffect(() => {
        
        const allStablishments = stablishments.all
       
        const found = allStablishments.find((s) => s.id == id)
        console.log("found: ", found)
        if (found){
            setStablishment(found)
        }else{
            Swal.fire({
                title: "Error",
                text: `Error al buscar el establecimento con id: ${id}`,
                icon: "error"
            })
        }
        
    },[id, stablishments])
  
    switch(step){
        case 1:
            return <SportFieldStep1 stablishment={stablishment} formData={formData} setFormData={setFormData} onNext={()=> setStep(2)} setSportFieldId={setSportFieldId} />
        
        case 2:
            return <SportFieldStep2 stablishment={stablishment} sportFieldId={sportFieldId} onBack={() => setStep(1)} />
    }
  
}