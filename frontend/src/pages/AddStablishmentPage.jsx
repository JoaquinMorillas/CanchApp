

import { useState } from 'react'


import { Step1 } from './addStablishmentSteps/Step1'
import { Step2 } from './addStablishmentSteps/Step2'
import { Step3 } from './addStablishmentSteps/Step3'
import { Step4 } from './addStablishmentSteps/Step4'

export const AddStablishmentPage = () => {

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerId: "",
    name: "",
    country: "",
    city: "",
    postalCode: "",
    street: "",
    number: "",
    province: "",
    files: []
  });


  switch(step){
  case 1:
    return <Step1 formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />;
  case 2:
    return <Step2 formData={formData} setFormData={setFormData} onBack={() => setStep(1)} onNext={() => setStep(3)} />;
  case 3:
    return <Step3 formData={formData} setFormData={setFormData} onBack={() => setStep(2)} onNext={() => setStep(4)} />;
  case 4:
    return <Step4 formData={formData} onBack={() => setStep(3)} />;
  default:
    return null;
}
}
