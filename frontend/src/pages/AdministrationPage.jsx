import React, { useContext, useEffect, useState } from 'react'
import { StablishmentContext } from '../context/StablishmentContext'
import { NavLink, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useApi } from '../context/AxiosInstance'
import { AuthContext } from '../context/AuthContext'
import { LoadingContext } from '../context/LoadingContext'


export const AdministrationPage = () => {
  const {user} = useContext(AuthContext)
  const api = useApi()
  const {startLoading, stopLoading} = useContext(LoadingContext)
  const { stablishments, deleteStablishment } = useContext(StablishmentContext)
  const [isMobile, setIsMobile] = useState(false)

  const [allStablishments, setAllStablishments] = useState([])
  
  /* activate the stablisment from the backend */

  const handleActivation = async (stablishment) => {
    const confirmed = await Swal.fire({
      title:"Atencion",
      text:`¿Estas seguro que quieres restaurar el establecimento ${stablishment.name}?`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Aceptar",
      cancelButtonText:"Cancelar"
    })
    if(confirmed.isConfirmed){
      try{
        startLoading()
        await api.put(`/stablishment/activate/${stablishment.id}`)
        setAllStablishments(
          allStablishments.map((s) => 
            s.id == stablishment.id ? {...s, active : true} : s))
      }catch(error){
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || error.response?.data || error.message,
          icon: "error"
          });
      }finally{
        stopLoading()
      }
    }
  }
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
        startLoading()
        await deleteStablishment(stablishment.id)
        //const updatedStablishments = allStablishments.filter((s) => s.id != stablishment.id)
        setAllStablishments(
          allStablishments.map((s) => 
          s.id === stablishment.id ? {...s, active:false}: s))

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
      }finally{
        stopLoading()
      }
    }
  }
  /* fetch the stablishments*/
  useEffect(() =>{
    const fetchStablishmentByOwner = async () => {
      try{
        startLoading()
        const response = await api.get(`stablishment/user/${user.id}`)
        const gettedStablishments = response.data
        setAllStablishments(gettedStablishments)
      }catch(error){
        console.error(error)
      }finally{
        stopLoading()
      }
    }
    if(user.roles == "ROLE_ADMIN"){
      setAllStablishments(stablishments.all)
    }
    else{
      fetchStablishmentByOwner()
    }

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
    
    <div className='d-flex flex-column' 
    style={{maxWidth:"90%", backgroundColor:"var(--bs-light)",
      margin:"0 auto"
    }}>

        <h1 className='text-center'>Administracion</h1>

        {user.roles == "ROLE_ADMIN" && (
          <div className='container-fluid d-flex justify-content-center'>
          <NavLink to="/administracion/usuarios">
            <button className='btn btn-primary mb-5 btn-lg'>Administrar Usuarios</button>
          </NavLink>
          <NavLink to="/administracion/caracteristicas">
            <button className='btn btn-primary ms-5 btn-lg'>Administrar caracteristicas</button>
          </NavLink>
          <NavLink to="/administracion/politicas">
            <button className='btn btn-primary ms-5 btn-lg'>Administrar politicas</button>
          </NavLink>
          
          <NavLink to="/administracion/agregar_establecimiento">
            <button className='btn btn-primary ms-5 btn-lg'>Agregar Establecimiento</button>
          </NavLink>

          <NavLink to="/administracion/deportes">
              <button className='btn btn-primary ms-5 btn-lg'>Administrar Deportes</button>
            </NavLink>

          <NavLink to="/administracion/reservas">
              <button className='btn btn-primary ms-5 btn-lg'>Administrar Reservas</button>
            </NavLink>
          
        </div>
        )}

        {user.roles == "ROLE_OWNER" && (
          <NavLink to="/administracion/reservas">
              <button className='btn btn-primary ms-5 btn-lg'>Administrar Reservas</button>
            </NavLink>
        )}

        <h3 className='text-center mb-5'> Establecimientos: </h3>

        <div style={{margin:"10px", border:" 1px solid var(--bs-border-color)"}}>
          <table className="table table-striped table-hover">
            <thead style={{ position: 'sticky',
              top: 55,
              zIndex: 2,
              backgroundColor: 'var(--bs-light)', }}>
              <tr>
                <th scope="col" className='text-center'>id</th>
                <th scope="col" className='text-center'>Nombre</th>
                <th scope="col" className='text-center'>Cuidad</th>
                <th scope="col" className='text-center'>Deportes</th>
                <th scope="col" className='text-center'>Cantidad de canchas</th>
                <th scope="col" className='text-center'>Cantidad de prestaciones</th>
                <th scope='col' className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allStablishments?.map((stablishment) => (
              <tr key={stablishment.id} className={stablishment.active ? "" : "custom-row"}>
                <th scope='row' className='text-center'>{stablishment.id }</th>
                <td className='text-center'>
                  {stablishment.name}
                </td>
                <td className='text-center'>
                  {stablishment.city}
                </td> 
                <td className='text-center'>
                  {stablishment.sports.length > 0 ? (
                    stablishment.sports.map((sport, index) => (
                      <span key={index} className="badge bg-primary me-1">
                        {sport.name}
                      </span>
                    ))
                  ) : (
                    "--"
                  )}
                </td> 
                <td className='text-center'>
                  {stablishment.sportFieldsNames ? stablishment.sportFieldsNames.length : 0}
                </td>
                <td className='text-center'>

                  {stablishment.amenities ? stablishment.amenities.length : 0}
                </td>
                <td>{stablishment.active ? (

                  <div>
                    <Link to={`/administracion/establecimientos/${stablishment.id}/agregar_cancha`}>
                      <button className='btn btn-success m-2'>Agregar cancha</button>
                    </Link>
                    <Link to={`/administracion/establecimientos/editar/${stablishment.id}`}>
                      <button className='btn btn-info m-2'>Editar</button>
                    </Link>
                    <button className='btn btn-danger m-2' onClick={()=> handleDelete(stablishment)}>Eliminar</button>
                  </div>
                ): (<button className='btn btn-info m-2' onClick={()=> handleActivation(stablishment)}>Restaurar</button>)}
                </td>
              </tr>
              ))}
              
            </tbody>
        </table>
        </div>
    </div>
    
    </>
  )
}
