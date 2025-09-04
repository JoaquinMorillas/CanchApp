
import axios from 'axios'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'

export const Step1 = ({ formData, setFormData, onNext}) => {
    
    /* main function it validates the fields and navigates to the next step*/
    const validateAndNext = async () => {
      if(!formData.ownerId){
        Swal.fire({
          title:"Error",
          text:"El Campo id del dueño es obligatorio",
          icon:"error"
        })
        return
      }
      if(!formData.name){
        Swal.fire({
          title:"Error",
          text:"El Campo nombre del establecimiento es obligatorio",
          icon:"error"
        })
        return
      }
      try{

            const owner =  await axios.get(`http://localhost:8080/user/${formData.ownerId}`)
            const name = await axios.get(`http://localhost:8080/stablishment/name/${formData.name}`)
     
            onNext();
        } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.message || error.response?.data || error.message,
              icon: "error"
            })
        }

    }

    return (
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
      <h1 className='text-center'>Agregar Establicimiento</h1>
      <h4 className="mb-4">PASO 1:</h4>
      <h5 className="mb-4">Datos del Establecimiento</h5>
        {/* Owner id input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Id de Dueño: 
            </label>
          
            <input 
            type="number" 
            class="form-control"
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} 
            placeholder='Ej: 1'
            style={{ maxWidth: "250px" }}/>
          
        </div>

        {/*Name input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0"
            style={{  width: "250px", textAlign: "right" }}>
              Nombre del Establecimiento: 
            </label>
          
            <input 
            type="text" 
            class="form-control"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value })} 
            placeholder='Ej: Canchas Cacho'
            style={{ maxWidth: "250px" }}/>
          
        </div>
        <div className="d-flex justify-content-center mt-4 gap-3">
          <NavLink to = "/administracion">
            <button className='btn btn-danger'>Atras</button>
          </NavLink>
          <button className="btn btn-primary" onClick={validateAndNext}>Siguiente</button>
        </div>
    </div>
  )
}
