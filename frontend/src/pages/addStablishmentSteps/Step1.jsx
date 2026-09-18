
import { useApi } from '../../context/AxiosInstance'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'
import { FormFieldComponent } from '../../Component/FormFieldComponent'
import { useFormValidations } from '../../hooks/useFormValidations'

const validators = {
  ownerId: (v) => {
    if(!v) return "El id del dueño es obligatorio"
    if(Number(v) <= 0) return "El número debe ser positivo"
    return ""
  },
  name: (v) => {
    if(!v || v.trim().length === 0) return "El nombre es obligatorio"
    return ""
  },
  telephoneNumber: (v) => {
    if (!v) return 'El teléfono es obligatorio'
    if (!/^\d{8,15}$/.test(v)) return 'Ingresá solo números, entre 8 y 15 dígitos'
    return ''
  },
  description: (v) => {
    if (!v || v.trim().length < 30) return 'La descripción es obligatoria y debe tener al menos 30 caracteres'
    return ''
  }
}
export const Step1 = ({ formData, setFormData, onNext}) => {
    
    const api = useApi()
    const { errors, handleBlur, validateAll } = useFormValidations(validators)
    const [amenities, setAmenities] = useState([])
    const [selectedAmenities , setSelectedAmenities] = useState([])

    const [policies, setPolicies] = useState([])
    const [selectedPolicies, setSelectedPolicies] = useState([])

    useEffect(() => {
      const getAmenities = async () => {
        try{
          const response = await api.get("/amenity/all")
          const gettedAmenities = response.data
          setAmenities(gettedAmenities)
        }catch(error){
          Swal.fire({
              title: "Error",
              text: error.response?.data?.message || error.response?.data || error.message,
              icon: "error"
            })
        }
        
      }
      const getPolicies = async () => {
        try{
          const response = await api.get("/policy/all")
          const gettedPolicies = response.data
          setPolicies(gettedPolicies)
        }catch(error){
          Swal.fire({
              title: "Error",
              text: error.response?.data?.message || error.response?.data || error.message,
              icon: "error"
            })
        }
      }
      getAmenities()
      getPolicies()
    },[])
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

            const owner =  await api.get(`/user/${formData.ownerId}`)
            const name = await api.get(`stablishment/name/${formData.name}`)
     
            onNext();
        } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.message || error.response?.data || error.message,
              icon: "error"
            })
        }

    }

    useEffect(() => {
      console.log(selectedAmenities)
    },[selectedAmenities])

    return (
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
      <h1 className='text-center'>Agregar Establicimiento</h1>
      <h4 className="mb-4">PASO 1:</h4>
      <h5 className="mb-4">Datos del Establecimiento</h5>
        {/* Owner id input*/}
        <FormFieldComponent
          label="Id del dueño"
          type="number"
          value={formData.ownerId}
          onChange={e => setFormData({...formData, ownerId: e.target.value})}
          onBlur={() => handleBlur("ownerId", formData.ownerId)}
          placeholder="Ej. 1"
          error={errors.ownerId}
        />

        {/*Name input*/}
        <FormFieldComponent
          label="Nombre del establecimiento"
          type='text'
          value={formData.name}
          onChange={e => setFormData({...formData, name:e.target.value})}
          onBlur={() => handleBlur("name", formData.name)}
          placeholder="Canchas de Fútbol"
          error={errors.name}
        />
        {/*Phone input*/}
        <FormFieldComponent
          label="Número de telefono"
          value={formData.telephoneNumber}
          placeholder={15123123}
          type='text'
          onChange={e => setFormData({...formData, telephoneNumber: e.target.value})}
          onBlur={() => handleBlur("telephoneNumber", formData.telephoneNumber)}
          error={errors.telephoneNumber}
        />
        {/*Description input*/}
        <FormFieldComponent
          label="Descripción"
          value={formData.description} 
          placeholder="Descripcion del lugar"
          as='textarea'
          onChange={e => setFormData({...formData, description: e.target.value})}
          onBlur={() => handleBlur("description", formData.description)}
          error={errors.description}
        />

        {/* amenities inputs*/}
        <h5 className='text-center'>Seleccione las caracteristicas</h5>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th scope="col" className='text-center'>Nombre</th>
              <th scope="col" className='text-center'>Icono</th>
              <th scope='col' className='text-center'>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {amenities?.length > 0 && 
              amenities.map((amenity, idx) => {
                const isChecked = selectedAmenities.some((a) => a.name == amenity.name)
                
                const handleChck = (e) =>{
                  if (e.target.checked){
                    setSelectedAmenities([...selectedAmenities, amenity])
                    setFormData({...formData, amenities: selectedAmenities})
                  }else{
                    setSelectedAmenities(selectedAmenities.filter((a) => a.name != amenity.name))
                    setFormData({...formData, amenities: selectedAmenities})
                  }
              }
              
                return(

                <tr key={idx}>
                  <th className='text-center'>{amenity.name}</th>
                  <td className='text-center'>
                    <img src={amenity.iconUrl} alt="icon" />
                  </td>
                  <td className='text-center'>
                    <input type="checkbox"
                    checked={isChecked}
                    onChange={handleChck} />

                  </td>
                </tr>
                )

              })
            }
          </tbody>

        </table>

        {/* policies inputs*/}
        <h5 className='text-center'>Seleccione las politicas</h5>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th scope="col" className='text-center'>Titulo</th>
              <th scope="col" className='text-center'>Descripción</th>
              <th scope='col' className='text-center'>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy,idx) => {
              const isChecked = selectedPolicies.some((p) => p.id == policy.id)
              
              const handleCheck = (e) => {
                if(e.target.checked){
                  setSelectedPolicies([...selectedPolicies, policy])
                  setFormData({...formData, policies:selectedPolicies})
                }else{
                  setSelectedPolicies(selectedPolicies.filter((p) => p.id!==policy.id))
                  setFormData({...formData, policies:selectedPolicies})
                }
              }

              return(
                <tr key={idx}>
                  <td className='text-center'>
                    {policy.title}
                  </td>
                  <td className='text-center'>
                    {policy.description}
                  </td>
                  <td>
                    <input type="checkbox"
                    checked={isChecked}
                    onChange={handleCheck} />
                  </td>
                </tr>
              )
            })}
          </tbody>
          </table>
        <div className="d-flex justify-content-center mt-4 gap-3">
          <NavLink to = "/administracion">
            <button className='btn btn-danger'>Atras</button>
          </NavLink>
          <button className="btn btn-primary" onClick={validateAndNext}>Siguiente</button>
        </div>

    </div>
  )
}
