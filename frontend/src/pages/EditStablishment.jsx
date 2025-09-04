import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import { StablishmentContext } from '../context/StablishmentContext'
import Swal from 'sweetalert2'
import axios from 'axios'
import { InputComponent } from '../Component/InputComponent'

export const EditStablishment = () => {

    /* used States */
    const { id } = useParams()
    const { stablishments, updateStablishment } = useContext(StablishmentContext)
    const [stablishment, setStablishment] = useState(null)
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [enableName, setEnableName] = useState(true)

    const [street, setStreet] = useState("")
    const [enableStreet, setEnableStreet] = useState(true)

    const [number, setNumber] = useState("")
    const [enableNumber, setEnableNumber] = useState(true)

    const [images, setImages] = useState([])

    const [files, setFiles] = useState([])
    

    const [sportFields, setSportFields] = useState([])

    /* main function, saves the changes and navigate back to administation panel */
    const saveChanges = async () =>{
        try{
            
            const uploadForm = new FormData();
            files.forEach((file) =>{
                uploadForm.append("files", file)
            })
            
            let newUpdatedImages = []
            if(files.length > 0){

                const response = await axios.post("http://localhost:8080/images/upload", uploadForm)
                newUpdatedImages = response.data
            }
            
            const updatedImages = [...newUpdatedImages, ...stablishment.images]
            setImages(updatedImages);

            const formData = {

                name: name,
                street: street,
                number: number,
                images: updatedImages
            }
            
            
            const response = await updateStablishment(formData, id)
            
            Swal.fire({
                title:"Éxito", 
                text: `El Establecimiento ${response.name} ha sido editado correctamente`, 
                icon: "success",
                timer:"2000",
                showConfirmButton:false}
                );

            setFiles([])

            setTimeout(()=>{
                navigate("/administracion")
            },2000)

        } catch (error) {
             Swal.fire({
               title: "Error",
               text: error.response?.data?.message || error.response?.data || error.message,
               icon: "error"
             });

        }
    }

    /* deletes permanently the sportField from the backend */
    const handleDeleteSportField = async (sportField) =>{
        const confirmed = await Swal.fire({
            title:"Atencion",
            text:`¿Estas seguro que quieres eliminar la cancha: ${sportField.name}?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
        })

        if(confirmed.isConfirmed){
            try{
                await axios.delete(`http://localhost:8080/sport_field/delete/${sportField.id}`)
                const updatedSportsFields = sportFields.filter((s) => s.id != sportField.id)
                setSportFields(updatedSportsFields)
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                    });
            }
        }
    }

    /* delets the image permanently from the backend */
    const handleDeletePhoto = async (image) =>{

            const confirmed = await Swal.fire({
                title:"Atencion",
                text: "¿Estas seguro que quieres borrar la imagen?",
                icon:"warning",
                showCancelButton:true,
                confirmButtonText:"Aceptar",
                cancelButtonText:"Cancelar"
            })
            if(confirmed.isConfirmed){

                try{
                    await axios.delete(`http://localhost:8080/images/delete/${image.publicId}`)
                    const updatedImages = images.filter((i)=> i.publicId != image.publicId)
                    setImages(updatedImages)
        
                    const formData = {
        
                        name: name,
                        street: street,
                        number: number,
                        images: updatedImages
                    }
        
                    console.log("updatedForm: ", formData)
        
                    await updateStablishment(formData, id)
        
                    Swal.fire({
                        title:"Éxito", 
                        text: `La imagen ha sido borrada de forma Exitosa`, 
                        icon: "success",
                        timer:"2000",
                        showConfirmButton:false}
                        );
        
                }catch (error) {
                    Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                    });
        
                }
            }
        }

    /* parse the duration sent by the backend to retrive the hours and minutes */
    const parseDuration = (duration) =>{
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        if (!match) return "Duración inválida";

        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;

        let result = "";

        if (hours > 0) {
            result += `${hours} hora${hours > 1 ? "s" : ""}`;
        }

        if (minutes > 0) {
            if (result.length > 0) result += " ";
            result += `${minutes} minuto${minutes > 1 ? "s" : ""}`;
        }

        return result || "0 minutos";

        
    } 
    /* fetch the stablishments and set the states */
    useEffect(() =>{
        if (!stablishments || !Array.isArray(stablishments.all)) return;
        const found = stablishments.all.find((s) => s.id == id)
        if(!found){
            Swal.fire({
                title:"Error",
                text:`No se encontro el establecimiento con id: ${id}`,
                icon:"error"
            })
        }else{
            setStablishment(found)
            setName(found.name)
            setStreet(found.street)
            setNumber(found.number)
            setImages(found.images)
        }
        
    }, [id, stablishments])

    /* fecth the sportfields assigned to the stablishment and set the states */
    useEffect(() =>{
        const fetchSportsFields = async () =>{
            try{

                const response = await axios.get(`http://localhost:8080/sport_field/stablishment/${id}`)
                const gettedSportFields = response.data
                setSportFields(gettedSportFields)
            }catch(error){
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                    });
            }
        }

        if(id){
            fetchSportsFields()
        }
    },[id])
  return (
    <> 
    {stablishment ? (

        <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h3 className='text-center'>Editar Establecimiento: {stablishment.name}</h3>

             {/*Name input*/}
             <div className='container'>
                <div className='row mb-3'>
                    <div className='col-9'>
                        <InputComponent label='Nombre' type="text" value={name} setValue={setName} disabled={enableName}/>
                    </div>
                    <div className='col-3'>
                        <button className={`btn ${enableName ? 'btn-info' : 'btn-danger'} mb-3`}
                        onClick={() => setEnableName(!enableName)}>
                            {enableName ? "Editar" : "Confirmar"}
                        </button>
                    </div>
                </div>

             </div>
            
            {/*Street input*/}
            <div className='container'>
                <div className='row mb-3'>
                    <div className='col-9'>
                        <InputComponent label='Calle' type="text" value={street} setValue={setStreet} disabled={enableStreet} />
                    </div>
                    <div className='col-3'>
                        <button className={`btn ${enableStreet ? 'btn-info' : 'btn-danger'} mb-3`}
                        onClick={() => setEnableStreet(!enableStreet)}>
                            {enableStreet ? "Editar" : "Confirmar"}
                        </button>
                    </div>
                </div>

            </div>
            

             {/*Number input*/}
             <div className='container'>
                <div className='row mb-3'>
                    <div className='col-9'>
                        <InputComponent label='Numberacion' type="text" value={number} setValue={setNumber} disabled={enableNumber}/>
                    </div>
                    <div className='col-3'>
                        <button className={`btn ${enableNumber ? 'btn-info' : 'btn-danger'} mb-3`}
                        onClick={() => setEnableNumber(!enableNumber)}>
                            {enableNumber ? "Editar" : "Confirmar"}
                        </button>
                    </div>
                </div>

             </div>
            
            {/* images */}
            <div className="mb-3">
            <h5 className="text-center">Fotos del Establecimiento</h5>

            {stablishment.images && stablishment.images.length > 0 ? (
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                {stablishment.images.map((image, index) => (
                    <div key={index} className="border rounded p-2 text-center">
                    <img
                        src={image.imageUrl}
                        alt={`Foto ${index + 1}`}
                        style={{ width: "150px", height: "auto", objectFit: "cover" }}
                    />
                    <button
                        className="btn btn-sm btn-danger m-2"
                        onClick={() => handleDeletePhoto(image)}
                    >
                        Eliminar
                    </button>
                    </div>
                ))}
                </div>
            ) : (
                <h6 className="text-center mt-2">El establecimiento no tiene imágenes.</h6>
            )}
            </div>

            {/*Upload images*/}
            <h5 className="mb-4">Agregar Imagenes</h5>
            <div className="mb-3 d-flex align-items-center">
            
                <label  className="me-3 mb-0 text-white"
                style={{  width: "250px", textAlign: "right" }}>
                Imagenes: 
                </label>
            
                <input 
                type="file"
                accept="image/*" 
                class="form-control"
                multiple
                onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} 
                style={{ maxWidth: "250px" }}/>

                
                {files.length > 0 && (
                files.map((image, index) => (

                <div className="text-center my-2" key={index}>
                    {image instanceof File ? (
                        <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        style={{ maxWidth: "100px", borderRadius: "8px" }}
                        />
                    ) : (
                        <div>Imagen no válida</div>
                    )}
                </div>
                ))
                )}
            

            <button className='btn btn-danger' onClick={() => setFiles([])}>
                Cancelar
            </button>
            </div>

            <div className="mb-3 d-flex justify-content-center">
                <button className='btn btn-lg btn-primary mt-5' onClick={saveChanges}>
                    Guardar Cambios

                </button>

            </div>
        </div>
    ):(
         <div className="text-center mt-4">Cargando...</div>
    )}
        <div className="text-dark p-4 rounded" 
        style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
            <h3 className='text-center'>Canchas:</h3>

            {sportFields && sportFields.length > 0 ? (
                <>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                
                                <th scope="col" className="text-center align-middle">Nombre</th>
                                <th scope="col" className="text-center align-middle">Precio</th>
                                <th scope="col" className="text-center align-middle">Duracion</th>
                                <th scope="col" className="text-center align-middle">Deporte</th>
                                <th scope='col' className="text-center align-middle">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>

                        {sportFields.map((s) =>(
                            <tr key={s.id}>
                                
                                    <td className="text-center align-middle">
                                        {s.name}
                                    </td>
                                    <td className="text-center align-middle">
                                        {s.price}
                                    </td>
                                    <td className="text-center align-middle">
                                        {parseDuration(s.reservationDuration)}
                                    </td>
                                    <td className="text-center align-middle">
                                        {s.sport}
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <NavLink to={`/canchas/editar/${s.id}/crear_reservas`}>
                                                <button className='btn btn-warning'>Agregar Reservas</button>
                                            </NavLink>
                                            <NavLink to={`/canchas/editar/${s.id}`}>
                                                <button className='btn btn-info' style={{height:"100%"}}>Editar</button>
                                            </NavLink>
                                            <button className='btn btn-danger btn' onClick={() => handleDeleteSportField(s)}>Eliminar</button>
                                        </div>
                                        
                                    </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="mb-3 d-flex justify-content-center">
                        <NavLink to={`/establecimientos/${id}/agregar_cancha`}>
                            <button className='btn btn-primary btn-lg m-3'>
                                Agregar Cancha
                            </button>
                        </NavLink>    
                    </div>
                </>
            ):(
                <>
                    <div className="text-center mt-4">No se Encuentran Canchas</div>
                    <div className="mb-3 d-flex justify-content-center">
                            <NavLink to={`/establecimientos/${id}/agregar_cancha`}>
                                <button className='btn btn-primary btn-lg m-3'>
                                    Agregar Cancha
                                </button>
                            </NavLink>    
                        </div>
                </>
            )}
        </div>    
    </>
    )
}
