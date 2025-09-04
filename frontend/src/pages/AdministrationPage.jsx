import React, { useContext, useEffect, useState } from 'react'
import { StablishmentContext } from '../context/StablishmentContext'
import { NavLink, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'


export const AdministrationPage = () => {
  const { stablishments, deleteStablishment } = useContext(StablishmentContext)
  const [isMobile, setIsMobile] = useState(false)

  const [allStablishments, setAllStablishments] = useState([])

  /*deletes the stablishment from the backend */
  const handleDelete = async (stablishment) => {
    const confirmed = await Swal.fire({
      title:"Atencion",
      text:`¿Estas seguro que quieres eliminar el establecimento ${stablishment.name}?`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Aceptar",
      cancelButtonText:"Cancelar"
    })
    if(confirmed.isConfirmed){
      try{
        await deleteStablishment(stablishment.id)
        const updatedStablishments = allStablishments.filter((s) => s.id != stablishment.id)
        setAllStablishments(updatedStablishments)

        Swal.fire({
          title:"Exito",
          text:`El Establecimento ${stablishment.name} ha sido eliminado`,
          icon:"success",
          timer:"2000",
          showCloseButton:true
        })
      }catch(error){
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || error.response?.data || error.message,
          icon: "error"
          });
      }
    }
  }
  /* fetch the stablishments*/
  useEffect(() =>{
    setAllStablishments(stablishments.all)

  }, [stablishments])
  /* checks if the page is been entered from a mobile device*/
  useEffect(() =>{
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile){
    return (
      <>
      <div>
        <h2>Acceso no permitido desde dispositivos móviles o Tablets</h2>
        <p>Por favor, accedé desde una computadora de escritorio.</p>
      </div>
      </>
    )
  }
  return (
    <>
    

      <h1 className='text-center'>Administracion</h1>

      <div className='container-fluid d-flex justify-content-center'>
        <NavLink to="/agregar_establecimiento">
          <button className='btn btn-primary mb-5 btn-lg'>Agregar Estableciminto</button>
        </NavLink>
      </div>

      <h3 className='text-left'> Establecimientos: </h3>

      <div>
        <table class="table table-striped table-hover">
          <thead style={{ position: 'sticky',
            top: 55,
            zIndex: 2,
            backgroundColor: '#f8f9fa', }}>
            <tr>
              <th scope="col" className='text-center'>id</th>
              <th scope="col" className='text-center'>Nombre</th>
              <th scope="col" className='text-center'>Cuidad</th>
              <th scope="col" className='text-center'>Deportes</th>
              <th scope="col" className='text-center'>Cantidad de canchas</th>
              <th scope='col' className='text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allStablishments.map((stablishment) => (
            <tr key={stablishment.id}>
              <th scope='row'>{stablishment.id }</th>
              <td>
                {stablishment.name}
              </td>
              <td>
                {stablishment.city}
              </td>
              <td>
                {stablishment.sports.length > 0 ? (
                  stablishment.sports.map((sport, index) => (
                    <span key={index} className="badge bg-primary me-1">
                      {sport}
                    </span>
                  ))
                ) : (
                  "--"
                )}
              </td> 
              <td>
                {stablishment.sportFieldsNames ? stablishment.sportFieldsNames.length : 0}
              </td>
              <td>
                <div>
                  <Link to={`/establecimientos/${stablishment.id}/agregar_cancha`}>
                    <button className='btn btn-success m-2'>Agregar cancha</button>
                  </Link>
                  <Link to={`/establecimientos/editar/${stablishment.id}`}>
                    <button className='btn btn-info m-2'>Editar</button>
                  </Link>
                  <button className='btn btn-danger m-2' onClick={()=> handleDelete(stablishment)}>Eliminar</button>
                </div>
              </td>
            </tr>
            ))}
            
          </tbody>
      </table>
      </div>
    
    </>
  )
}
