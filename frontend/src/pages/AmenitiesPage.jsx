import React, { useEffect, useState } from 'react'
import { InputComponent } from '../Component/InputComponent'
import { useApi } from '../context/AxiosInstance'
import Swal from 'sweetalert2'

export const AmenitiesPage = () => {

    const api = useApi()

    const [amenities, setAmenities] = useState([])
    const [name, setName] = useState("")
    const [icon, setIcon] = useState(null)
    const [enableEdit , setEnableEdit] = useState(null)

    const [editName, setEditName] = useState("")
    const [editIcon, setEditIcon] = useState(null)

    const handleSave = async () => {
        if(!name) {
            await Swal.fire({
                title: "Error",
                text: "Debe ingresar un nombre",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(!icon){
            await Swal.fire({
                title: "Error",
                text: "Debe ingresar un icono",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        const confirm = await Swal.fire({
            title: "¡Atencion!",
            text:`Estas seguro que quires guardar la caracteristica ${name} ?`,
            icon: "question",
            showCancelButton:true,
            showConfirmButton:true
        })
        if(confirm.isConfirmed){
            try{
                const response = await api.post("/amenity/save",{name, icon},
                    {headers: { "Content-Type": "multipart/form-data" }}
                )
                const savedAmentity = response.data
                setAmenities([...amenities, savedAmentity])
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                });
            }
        }
    }

    const handleDelete = async (amenity) => {
        const confirm = await Swal.fire({
            title: "¡Atencion!",
            text:`Estas seguro que quires eliminar la caracteristica ${amenity.name} ?`,
            icon: "question",
            showCancelButton:true,
            showConfirmButton:true
        })

        if (confirm.isConfirmed){
            try{
                await api.delete(`/amenity/delete/${amenity.name}`)
                setAmenities(amenities.filter((a) => a.name != amenity.name))
                 Swal.fire({
                    title:"Exito",
                    text:"La caractetistica fue eliminada de forma correcta",
                    icon:"success",
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

    useEffect(() => {
        const getAmenities = async() => {
            try{
                const response = await api.get("/amenity/all")
                const gettedAmenities = response.data
                setAmenities(gettedAmenities)
               
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                });
            }
        }
        getAmenities()
    },[])

  return (
    <>
    {amenities.length > 0 ? (

        <div>
            <h3 className='text-center'>Prestaciones:</h3>
            <table className="table table-striped table-hover">
            <thead style={{ position: 'sticky',
                top: 55,
                zIndex: 2,
                backgroundColor: 'var(--bs-light)', }}>
                <tr>
                <th scope="col" className='text-center'>Nombre</th>
                <th scope="col" className='text-center'>Icono</th>
                <th scope='col' className='text-center'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {amenities.map((amenity, idx) => (
                    <tr key={idx}>
                        <th scope='row' className='text-center'>{amenity.name}</th>
                        <td className='text-center'>
                            <img src={amenity.iconUrl} alt="icono" />
                        </td>
                        <td className='text-center'>
                            <div>
                                <button className='btn btn-danger me-2'
                                onClick={() => handleDelete(amenity)}
                                >Eliminar
                                </button>
                                <button className='btn btn-secondary'
                                onClick={() => setEnableEdit(amenity)}
                                >Editar
                                </button>
                            </div>
                        </td>
                        {enableEdit?.name == amenity.name && (
                            <td>
                            <div className="text-dark p-4 rounded" 
                            style={{ backgroundColor: '#F8F9FA',  maxWidth: '800px', margin: '0 auto' }}>
                        
                                <h5 className='text-center'>Editar prestacion: </h5>

                                <div className='container'>
                                    <div className='row align-items-center'>
                                        <div className='col-12'>
                                            <InputComponent label='nombre' type='text' value={editName} setValue={setEditName}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center'>
                                        <div class="col-auto text-start">
                            
                                            <label  className="me-3 mb-0"
                                            style={{  width: "200px", textAlign: "right" }}>
                                            Imagen: 
                                            </label>
                                        </div>

                                        <div className='col-auto'> 
                                            <input 
                                            type="file"
                                            accept="image/*" 
                                            class="form-control"
                                            onChange={(e) => setEditIcon(e.target.files[0])} 
                                            style={{ maxWidth: "250px" }}/>

                                        </div>
                                            {editIcon && (
                                                <>
                                                
                                                    <div className="col-auto">
                                                        <img
                                                        src={URL.createObjectURL(editIcon)}
                                                        alt="preview"
                                                        style={{ maxWidth: "100px", borderRadius: "8px" }}
                                                        />
                                                    </div>
                                                    <div className='col-auto'>
                                                        <button className='btn btn-danger'>Eliminar</button>
                                                    </div>
                                                </>
                                            )}

                                    </div>
                                    <div className='row align-items-center mt-2'>
                                        <div className='col-12 text-center mt-2'>
                                            <button className='btn btn-primary btn-lg'
                                            onClick={() => handleEdit()}>
                                                Confirmar
                                            </button>
                                             <button className='btn btn-danger btn-lg ms-2'
                                            onClick={() => {setEnableEdit(null), setEditIcon(null), setEditName("")}}>
                                                Cancelar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                </div>
                            </td>                
                        )}
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    ):(
        <h3 className='text-center'>No hay Prestaciones guardadas</h3>
    )}
    <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '800px', margin: '0 auto' }}>
            
            <h5 className='text-center'>Agregar prestacion: </h5>

            <div className='container'>
                <div className='row align-items-center'>
                    <div className='col-12'>
                        <InputComponent label='nombre' type='text' value={name} setValue={setName}/>
                    </div>
                </div>
                <div className='row align-items-center'>
                    <div class="col-auto text-start">
        
                        <label  className="me-3 mb-0"
                        style={{  width: "200px", textAlign: "right" }}>
                        Imagen: 
                        </label>
                    </div>

                    <div className='col-auto'> 
                        <input 
                        type="file"
                        accept="image/*" 
                        class="form-control"
                        onChange={(e) => setIcon(e.target.files[0])} 
                        style={{ maxWidth: "250px" }}/>

                    </div>
                        {icon && (
                            <>
                            
                                <div className="col-auto">
                                    <img
                                    src={URL.createObjectURL(icon)}
                                    alt="preview"
                                    style={{ maxWidth: "100px", borderRadius: "8px" }}
                                    />
                                </div>
                                <div className='col-auto'>
                                    <button className='btn btn-danger'>Eliminar</button>
                                </div>
                            </>
                        )}

                </div>
                <div className='row align-items-center mt-2'>
                    <div className='col-12 text-center mt-2'>
                        <button className='btn btn-primary btn-lg'
                        onClick={() => handleSave()}>
                            Agregar
                        </button>
                    </div>

                </div>
            </div>
    </div>
    </>
  )
}
