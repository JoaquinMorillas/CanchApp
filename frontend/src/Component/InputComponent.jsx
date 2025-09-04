import React from 'react'

export const InputComponent = ({label="", type, value, setValue, disabled=false}) => {

  const renderInput = () => {
    switch (type) {
      case "checkbox":
        return (
          <div className="form-check d-flex align-items-center" style={{ width: "250px", minHeight: "38px" }}>
                  <input
                      className="form-check-input"
                      type="checkbox"
                      id={label}
                      checked={value}
                      onChange={(e) => setValue(e.target.checked)}
                      disabled={disabled}
                  />
                  <label className="form-check-label ms-2 mb-0" htmlFor="isAvailable">
                      {value ? "Disponible" : "No Disponible"}
                  </label>
                  
                </div>
        )
        case "Number" : {
          return (
             <input 
                    type="Number" 
                    class="form-control"
                    value={value}
                    step="0.1"
                    min="0"
                    onChange={(e) => setValue(e.target.value)} 
                    disabled={disabled}
                    style={{ maxWidth: "250px" }}
                    />
          )
        }
    
      default:
        return (
          <input 
                    type={type} 
                    class="form-control"
                    value={value}
                    onChange={(e) => setValue(e.target.value)} 
                    disabled={disabled}
                    style={{ maxWidth: "250px" }}
                    />
        )
        
    }
  }
  return (
    
        <div class="d-flex align-items-center mb-3">
              <label className="me-3 mb-0 d-flex align-items-center justify-content-end" 
              style={{ width: "250px", textAlign: "right"}}>
                  {label}:
              </label>
          
            {renderInput()}
    </div>
  )
}
