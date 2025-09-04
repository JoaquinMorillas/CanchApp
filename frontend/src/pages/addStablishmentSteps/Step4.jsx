import React from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import { useContext, useState } from 'react';
import { StablishmentContext } from '../../context/StablishmentContext';

export const Step4 = ({ formData, onBack }) => {
    const { addStablishment } = useContext(StablishmentContext) 
    const [error, setError] = useState(null);

    /* upload the stablishment to the backend*/
    const handleSubmit = async () => {
    try {
      await addStablishment(formData);
      Swal.fire("Éxito", "Establecimiento agregado", "success");
    } catch (error) {
      setError(error.response.data);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.response?.data || error.message,
        icon: "error"
      });
    }
  };

  return (
    <>
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>


      <div className="mt-4">
        <h4 className="mb-4">PASO 4: </h4>
        <h5 className="mb-4">Confirmacion de datos</h5>
        
        <pre>
          <label label className="col-sm-4 col-form-label">Id del Dueño: </label>
          <span className="col-sm-8">{formData.ownerId}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Nombre del Establecimiento: </label>
           <span className="col-sm-8">{formData.name}</span>
          <br />
          <label label className="col-sm-4 col-form-label">País: </label>
           <span className="col-sm-8">{formData.country}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Provincia/Estado:</label>
           <span className="col-sm-8">{formData.province}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Cuidad: </label>
           <span className="col-sm-8">{formData.city}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Codigo Postal: </label>
           <span className="col-sm-8">{formData.postalCode}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Calle: </label>
           <span className="col-sm-8">{formData.street}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Numeracion: </label>
           <span className="col-sm-8">{formData.number}</span>
          <br />
          <label label className="col-sm-4 col-form-label">Cantidad de imagenes: </label>
           <span className="col-sm-8">{formData.files.length}</span>
          <br />
        </pre>
      </div>
      <div className="d-flex justify-content-center gap-3 mt-4">

        <button className="btn btn-danger" onClick={onBack}>Atras</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Confirmar</button>
      </div>
    </div>
      
    </>
  );
}
