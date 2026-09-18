import React, { useState } from 'react'

export const useFormValidations = (validators) => {
  const [errors, setErrors] = useState({})

  const validateField = (field,value) => {
    const rule = validators[field]
    return rule ? rule(value) : ""
  }

  const validateAll = (formData) => {
    const newErrors = {}
    Object.keys(validators).forEach(field => {
        newErrors[field] = validateField(field, formData[field])
    })
    setErrors(newErrors)
    return Object.values(newErrors).every(msg => msg === "")
  }

  const handleBlur = (field, value) => {
    setErrors(prev => ({...prev, [field]: validateField(field, value)}))
    console.log(value)
    console.log(errors)
  }

  return {errors,validateAll, handleBlur}
}
