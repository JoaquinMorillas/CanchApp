import React, { useEffect, useState } from 'react'
import { useApi } from '../context/AxiosInstance'
import { InputComponent } from '../Component/InputComponent'
import Swal from 'sweetalert2'
import { LoadingContext } from '../context/LoadingContext'

export const EditSportsPage = () => {
  
    const api = useApi()
    const {startLoading, stopLoading} = useContext(LoadingContext)
    const [sports, setSports] = useState([])

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [icon, setIcon] = useState(null)

    const [enableEdit, setEnableEdit] = useState(null)

    const [editName, setEditName] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [editIcon, setEditIcon] = useState(null)
  
  
    useEffect(() => {
        const fetchSports = async() => {
            const response = await api.get("/sport")
            const gettedSports = response.data
            setSports(gettedSports)
        }

        
        fetchSports()
        
    },[])


    const handleSaveSport = async () => {
        const confirm = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro de querer guardar el deporte ${name}?`,
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true

        })

        if(confirm.isConfirmed){
            try{
                startLoading()
                const uploadData = new FormData();  
                uploadData.append("files", icon);;
                const iconResponse = await api.post("/images/upload", uploadData);
                const sentIconUrl = iconResponse.data[0].imageUrl

                const sentSport = {
                    name,
                    category,
                    "imgUrl" : sentIconUrl
                }
                const response = await api.post("/sport/save",
                    sentSport, {headers: {"Content-Type": "application/json"}}
                )
                const savedSport = response.data
                setSports([...sports, savedSport])


                Swal.fire({
                    title:"Exito",
                    text:`El establecimiento ${savedSport.name} ha sido agregado con exito`,
                    icon:"success",
                    showCloseButton:true
                })

                setCategory("")
                setIcon(null)
                setName("")

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
  
    const handleDelete = async (id) => {
        const sport = sports.find((s) => s.id === id)
        const confirm = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro de querer ELIMINAR el deporte "${sport.name}"? Si lo eliminas se ELIMINARAN todas la canchas en que se practique este deporte.`,
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true
        })

        if (confirm.isConfirmed){
            try{
                startLoading()
                const response = await api.delete(`/sport/delete/${id}`)
                const msg = response.data
                setSports(sports.filter((s) => s.id !== id))
                
                Swal.fire({
                    title:"Exito",
                    text:msg,
                    icon:"success",
                    showCloseButton:true
                })
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }finally{
                stopLoading()
            }
        }
    }

    const handleEdit = async (sport) => {
       
        const confirm = await Swal.fire({
            title:"Atencion",
            text: `¿Estas seguro de querer Editar el deporte "${sport.name}"?`,
            icon:"question",
            showConfirmButton:true,
            showCancelButton:true
        })

        if(confirm.isConfirmed){
            let sentSport = {}
            if(editIcon){

                const uploadData = new FormData();  
                uploadData.append("files", editIcon);
                const iconResponse = await api.post("/images/upload", uploadData);
                const sentIconUrl = iconResponse.data[0].imageUrl
                sentSport = {
                    "name" : editName,
                    "category" : editCategory,
                    "imgUrl" : sentIconUrl || null
                }
            }else{
                sentSport = {
                    "name" : editName,
                    "category" : editCategory,
                    "imgUrl" : null
                }
            }

            try{
                startLoading()
                const response = await api.put(`/sport/update/${sport.id}`, sentSport)
                const updatedSport = response.data
                setSports(sports.map((s) => s.id === updatedSport.id ? updatedSport : s))
                setEditCategory("")
                setEditIcon(null)
                setEditName("")
                setEnableEdit(null)
                Swal.fire({
                    
                    title:"Exito",
                    text:"El deporte ha sido editado con exito",
                    icon:"success",
                    showCloseButton:true
                
                })
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                })
            }finally{
                stopLoading()
            }
        }
    }

    return (
    <>
        <div>
            <h3 className='text-center'>Deportes:</h3>
            <table className="table table-striped table-hover">
                <thead style={{ position: 'sticky',
                    top: 55,
                    zIndex: 2,
                    backgroundColor: 'var(--bs-light)', }}>
                    <tr>
                    <th scope="col" className='text-center'>Nombre</th>
                    <th scope="col" className='text-center'>Categoria</th>
                    <th scope="col" className='text-center'>Icono</th>
                    <th scope='col' className='text-center'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sports.map((sport, idx) => (
                        <tr key={idx}>
                            <td className='text-center'>
                                {sport.name}
                            </td>
                            <td className='text-center'>
                                {sport.category}
                            </td>
                            <td className='text-center'>
                               <img src={sport.imgUrl} alt="" 
                               style={{width:"75px", height:"75px"}}/> 
                            </td>
                            <td className='text-center'>
                                <div>
                                    <button className='btn btn-danger me-2'
                                    onClick={() => handleDelete(sport.id)}
                                    >Eliminar
                                    </button>
                                    <button className='btn btn-secondary'
                                    onClick={() => setEnableEdit(sport)}
                                    >Editar
                                    </button>
                                </div>
                            </td>
                            {enableEdit?.name == sport.name && (
                                    <td>
                                    <div className="text-dark p-4 rounded"> 
                                        
                                        <h5 className='text-center'>Editar Deporte: </h5>
        
                                        <div className='container'>
                                            <div className='row align-items-center'>
                                                <div className='col-12'>
                                                    <InputComponent label='Nombre' type='text' value={editName} setValue={setEditName}/>
                                                </div>
                                            </div>
                                            <div className='row align-items-center'>
                                                <div className='col-12'>
                                                    <InputComponent label='Categoria' type='text' value={editCategory} setValue={setEditCategory}/>
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
                                                    onClick={() => handleEdit(sport)}>
                                                        Confirmar
                                                    </button>
                                                     <button className='btn btn-danger btn-lg ms-2'
                                                    onClick={() => {setEnableEdit(null), setEditIcon(null), setEditName(""), setEditCategory("")}}>
                                                        Cancelar
                                                    </button>
                                                                    </div>
        
                                            </div>
                                        </div>
                                        
                                        </div>
                                </td>)}
                        </tr>
                    ))}
                </tbody>
            
            </table>
        </div>

        <div className="text-dark p-4 rounded" 
                style={{ backgroundColor: '#F8F9FA',  maxWidth: '800px', margin: '0 auto' }}>
                    
                    <h5 className='text-center'>Agregar Deporte: </h5>
        
                    <div className='container'>
                        <div className='row align-items-center'>
                            <div className='col-12'>
                                <InputComponent label='Nombre' type='text' value={name} setValue={setName}/>
                            </div>
                        </div>
                        <div className='row align-items-center'>
                            <div className='col-12'>
                                <InputComponent label='Categoria' type='text' value={category} setValue={setCategory}/>
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
                                onClick={() => handleSaveSport()}>
                                    Agregar
                                </button>
                            </div>
        
                        </div>
                    </div>
            </div>    
    </>
  )
}
