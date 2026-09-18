import React from 'react'

export const FormFieldComponent = ({label, 
    type="text", 
    as="input", 
    value, 
    error, 
    placeholder, 
    onChange, 
    onBlur, 
    rows, 
    children, 
    disabled =false,
    ...props }) => {

  const Tag = as
        
  return (
    <div className='mb-3 d-flex align-items-center'>
        <label className="me-3 mb-0" style={{ width: "250px", textAlign: "right" }}>
            {label}
        </label>
        <div style={{ maxWidth: "250px", width: "100%" }}>
            <Tag
                type={as === "input" ? type : undefined}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                {...props}
            >
                {children}
            </Tag>
            
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    </div>
  )
}
