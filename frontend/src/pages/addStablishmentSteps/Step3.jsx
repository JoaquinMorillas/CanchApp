import Swal from "sweetalert2";
import { useState, useContext } from "react";
import { useApi } from "../../context/AxiosInstance";
import { LoadingContext } from "../../context/LoadingContext";

export const Step3 = ({ formData,setFormData, onNext, onBack }) => {
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const api = useApi()
    const {startLoading, stopLoading} = useContext(LoadingContext)

    /* upload the imgages to the backend*/
    const uploadFiles = async () => {
        try{
            startLoading()
            const uploadData = new FormData();
            files.forEach(file => {
                uploadData.append("files", file);
            });
            const response = await api.post("/images/upload", uploadData);
            Swal.fire({
                title: "Éxito",
                text: "Archivos subidos correctamente",
                icon: "success"
            });
            const uploadedImages = response.data
            setFormData({ ...formData, images: uploadedImages });
            console.log(formData)
            onNext();
        } catch (error) {
            setError(error.response.data);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || error.response?.data || error.message,
                icon: "error"
            });
        } finally {
            stopLoading();
        }
    }

  return (
    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
      <h4 className="mb-4">PASO 3: </h4>
      <h5 className="mb-4">Agregar Imagenes</h5>
        {/*imagesURL input*/}
        <div class="mb-3 d-flex align-items-center">
          
            <label  className="me-3 mb-0 text-white"
            style={{  width: "250px", textAlign: "right" }}>
              Imagenes: 
            </label>
          
            <input 
            type="file"
            accept="image/*" 
            class="form-control"
            multiple
            onChange={(e) => setFiles([...e.target.files])} 
            style={{ maxWidth: "250px" }}/>

            
            {files.length > 0 && (
              files.map((file, index) => (

              <div className="text-center my-2" key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{ maxWidth: "100px", borderRadius: "8px" }}
                />
              </div>
              ))
            )}
          
        </div><div className="d-flex justify-content-center gap-3 mt-4">
          <button onClick={onBack} class="btn btn-danger ms-2">Atrás</button>

          <button onClick={uploadFiles} class="btn btn-primary">
              {uploading ? "Subiendo imagenes..." : "Agregar"}
          </button>
        </div>
    </div>
  )
}
