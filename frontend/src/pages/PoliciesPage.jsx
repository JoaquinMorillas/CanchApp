import React, { useEffect, useState } from 'react'
import { useApi } from '../context/AxiosInstance'
import { InputComponent } from '../Component/InputComponent'
import Swal from 'sweetalert2'

export const PoliciesPage = () => {
    const api = useApi()
    const [policies, setPolicies] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    const [enableEdit, setEnableEdit] = useState(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const handleSave = async () => {
        if(!title){
            Swal.fire({
                title:"Error",
                text:"Debe ingresar un titulo",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(!description){
            Swal.fire({
                title:"Error",
                text:"Debe ingresar una descripcion",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        const confirm = await Swal.fire({
            title:"Atencion",
            text:"¿Estas seguro que quieres agregar esta politica?",
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true
        })

        if(confirm.isConfirmed){
            try{
                const response = await api.post("/policy/save",{title, description})
                const savedPolicy = response.data
                Swal.fire({
                    title:"Exito",
                    text:`la politica ${savedPolicy.title} ha sido guardada con exito`,
                    icon:"success"
                })
                setPolicies([...policies, savedPolicy])
                setDescription("")
                setTitle("")
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }
        }
    }

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title:"Atencion",
            text:"¿Estas seguro que quieres eliminar esta politica?",
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true
        })
        if(confirm.isConfirmed){
            try{
                const response = await api.delete(`/policy/delete/${id}`)
                Swal.fire({
                    title:"Exito",
                    text: response.data,
                    icon:"success"
                })
                setPolicies(policies.filter(policy => policy.id != id))
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                });
            }
        }
    }

    const handleUpdate = async (id) => {
        if(!editTitle){
            Swal.fire({
                title:"Error",
                text:"Debe ingresar un titulo",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        if(!editDescription){
            Swal.fire({
                title:"Error",
                text:"Debe ingresar una descripcion",
                icon:"error",
                showCloseButton:true
            })
            return
        }
        const confirm = await Swal.fire({
            title:"Atencion",
            text:"¿Estas seguro que quieres editar esta politica?",
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true
        })
        if(confirm.isConfirmed){
            try{

                const response = await api.put(`policy/update/${id}`,
                    {"title": editTitle, "description": editDescription }
                )
                const updatedPolicy = response.data
                Swal.fire({
                    title:"Exito",
                    text: `la politica ${updatedPolicy.title} ha sido actualizada`,
                    icon:"success"
                    
                })
                setPolicies(prev => 
                    prev.map(p => p.id === id ? updatedPolicy : p)
                ) 
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
        const fetchPolicies = async() => {
            const response = await api.get("/policy/all")
            const gettedPolicies = response.data
            setPolicies(gettedPolicies)
        }
        if(policies.length < 1){
            fetchPolicies()
        }
    },[])
  return (
    <>
        {policies.length > 0 ? (
            <div>
                <h3 className='text-center'>Politicas:</h3>
                <table className="table table-striped table-hover">
                    <thead style={{ position: 'sticky',
                    top: 55,
                    zIndex: 2,
                    backgroundColor: 'var(--bs-light)', }}>
                    <tr>
                        <th scope="col" className='text-center'>Titulo</th>
                        <th scope="col" className='text-center'>Descripcion</th>
                        <th scope='col' className='text-center'>Acciones</th>
                    </tr>
            </thead>
            <tbody>
                {policies.map((policy,idx) => (
                    <tr key={idx}>
                        <td className='text-center'>
                            {policy.title}
                        </td>
                        <td className='text-center'>
                            {policy.description}
                        </td>
                        <td className='text-center'>
                            <div>
                                <button className='btn btn-danger m-1 p-2'
                                onClick={() => handleDelete(policy.id)}
                                >Eliminar
                                </button>
                                <button className='btn btn-secondary m-1 p-2'
                                onClick={() => setEnableEdit(policy)}
                                >Editar
                                </button>
                            </div>
                        </td>
                            {enableEdit?.id == policy.id && (
                                <div className="text-dark p-4 rounded" 
                                style={{ backgroundColor: '#F8F9FA',  maxWidth: '800px', margin: '0 auto' }}>
                                    
                                    <h5 className='text-center'>Editar politica: </h5>
                        
                                    <div className='container'>
                                        <div className='row align-items-center'>
                                            <div className='col-12'>
                                                <InputComponent label='Titulo' type='text' value={editTitle} setValue={setEditTitle}/>
                                            </div>
                                            <div className='col-12'>
                                                <InputComponent label='descripcion' type='textarea' value={editDescription} setValue={setEditDescription}/>
                                            </div>
                                        </div>
                                        <div className='row align-items-center mt-2'>
                                        <div className='col-12 text-center mt-2'>
                                            <button className='btn btn-primary btn-lg'
                                            onClick={() => handleUpdate(policy.id)}>
                                                Confirmar
                                            </button>
                                             <button className='btn btn-danger btn-lg ms-2'
                                            onClick={() => {setEnableEdit(null), setEditTitle(""), setEditDescription("")}}>
                                                Cancelar
                                            </button>
                                        </div>

                                    </div>
                                    </div>
                                </div>
                            )}
                    </tr>
                ))}
            </tbody>
            </table>
            </div>
        ):(
            <h3>No hay politicas guardadas</h3>
        )}

        <div className="text-dark p-4 rounded" 
                style={{ backgroundColor: '#F8F9FA',  maxWidth: '800px', margin: '0 auto' }}>
                    
                    <h5 className='text-center'>Agregar politica: </h5>
        
                    <div className='container'>
                        <div className='row align-items-center'>
                            <div className='col-12'>
                                <InputComponent label='Titulo' type='text' value={title} setValue={setTitle}/>
                            </div>
                            <div className='col-12'>
                                <InputComponent label='descripcion' type='text' value={description} setValue={setDescription}/>
                            </div>
                        </div>
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
    </>
  )
}
