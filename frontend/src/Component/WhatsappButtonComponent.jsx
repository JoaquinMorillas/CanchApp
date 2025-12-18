import React from 'react'

export const WhatsappButtonComponent = ({telephoneNumber, userName, stablishmentName}) => {
    const number = telephoneNumber.replace(/\D/g, "")
    const text = `Hola soy ${userName}, ví el establicimento "${stablishmentName}" en CanchApp y quiero hacele una consulta`
    const encodedText = encodeURIComponent(text)
    const url = `https://wa.me/${number}?text=${encodedText}`
  return (
    <div className="position-fixed end-0 m-3"
    style={{ bottom: "20px", zIndex: 10000 }}>
        <a href={url}
        target='_blank'
        rel="noopener noreferrer"
        className="btn btn-success d-flex align-items-center gap-2"
        style={{ cursor: "pointer", zIndex:"100000000"}}
        >
        <i className="bi bi-whatsapp" style={{fontSize: "1.2rem"}}></i>
            ¿Alguna Duda?
        </a>
    </div>
    
  )
}
