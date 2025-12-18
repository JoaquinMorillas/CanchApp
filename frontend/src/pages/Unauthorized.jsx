import React from 'react'
import {Link} from 'react-router-dom'

export const Unauthorized = () => {
  return (
    <div>
      <h1 className='text-center'>Ups...</h1>
      <h2 className='text-center'>Para poder acceder a esta sección debes estar loggeado</h2>
      <div className='d-flex align-itmes-center justify-content-center m-5'>

        <Link to="/login">
          <button className='btn btn-primary btn-lg'>Prueba iniciando sesion</button>
        </Link>
      </div>
      
    </div>
  )
}
