import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapComponent } from "../../Component/MapComponent";


export const Step2 =  ( { formData, setFormData, onNext, onBack} ) => {

    /* used States*/
    const [lat, setLat] = useState("0.0")
    const [lon, setLon] = useState("0.0")
    const [zoom, setZoom] = useState(2)
 
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null);

    /* fetch the countries for the option menu*/
    useEffect(() => {
      fetch('data/countries.json')
        .then((response) => response.json())
        .then((data) => setCountries(data))
        .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    /* helper function to get the lat and lon to pass to the map component*/
    const geocodeAddress = async (street, number, city, province, country ) => {
      
      const fullAddress = `${street} ${number}, ${city}, ${province}, ${country}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;

      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'canchApp (joaquimmorillasarce@gmail.com)' } 
        });
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setLat(parseFloat(lat))
          setLon(parseFloat(lon))
          setZoom(16)
          }
      }catch(err){
        console.error(err)
      }
    }
    /* updates the geolocalization everytime the country, province, city or number changes*/
    useEffect(() => {
      geocodeAddress(formData.street, formData.number, formData.city, formData.province, formData.country)
    },[formData.street, formData.number, formData.city, formData.province, formData.country])
    
    /* main function it validates that the address is unique on the backend and continues*/
    const validateAndNext = async () => {
    
        try {
            const address = await axios.get(`http://localhost:8080/address/exists/${formData.country}/${formData.city}/${formData.street}/${formData.number}`);
    
            onNext();
    
        } catch (error) {
                setError(error.response.data);
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || error.response?.data || error.message,
                    icon: "error"
                });
            }
    }

    /* enables the province input and update the map when is populated*/
  const handleCountryChange = async (e) => {
    const selectedCode = e.target.value;
    setFormData({ ...formData, country: selectedCode, province: '', city: '' });

    const country = countries.find((c) => c.name == selectedCode)
    
    setLat(country.latitude)
    setLon(country.longitude)
    setZoom(4)
    

    const stateData = await fetch("/data/states.json").then((res) => res.json());
    const filteredRegions = stateData.filter((s) => s.country_name === selectedCode);
    setRegions(filteredRegions);
    
  };
  /* enables the city input and update the map when is populated*/
  const handleRegionChange = async (e) => {
    const selectedRegion = e.target.value;
    setFormData({ ...formData, province: selectedRegion, city: '' });
    const province = regions.find((s) => s.name == selectedRegion)
    setLat(province.latitude)
    setLon(province.longitude)
    setZoom(6)

    const citiesData = await fetch("/data/cities.json").then((res) => res.json());
    const filteredCities = citiesData.filter((c) => c.state_name === selectedRegion);
    setCities(filteredCities);
  };
  /* updates the map when is populated*/
  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
    const city = cities.find((c) => c.name = e.target.value)
    setLat(city.latitude)
    setLon(city.longitude)
    setZoom(9)
  };

  return (

    <div className="text-dark p-4 rounded" 
    style={{ backgroundColor: '#F8F9FA',  maxWidth: '700px', margin: '0 auto' }}>
      <h4 className="mb-4">PASO 2: </h4>
      <h5 className="mb-4">Dirección</h5>

      {/* Country */}
      <div className="mb-3 row align-items-center">
        <label label className="col-sm-4 col-form-label">País</label>
        <div className="col-sm-8">
          <select className="form-select" value={formData.country} onChange={handleCountryChange}>
            <option value="">Seleccione un país</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Province */}
        <div className="mb-3 row align-items-center">
          <label label className="col-sm-4 col-form-label">Provincia / Estado</label>
        <div className="col-sm-8">
          <select className="form-select" value={formData.province} onChange={handleRegionChange} disabled={!regions.length}>
            <option value="">Seleccione una provincia</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* City */}
     <div className="mb-3 row align-items-center">
          <label label className="col-sm-4 col-form-label">Ciudad</label>
        <div className="col-sm-8">
          <select className="form-select" value={formData.city} onChange={handleCityChange} disabled={!cities.length}>
            <option value="">Seleccione una ciudad</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Postal Code */}
     <div className="mb-3 row align-items-center">
          <label label className="col-sm-4 col-form-label">Código Postal</label>
        <div className="col-sm-8">
          <input className="form-control"
          type="text" 
          value={formData.postalCode} 
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} 
          disabled={!cities.length}
          placeholder="Código Postal" />
        </div>
      </div>

      {/* Street */}
        <div className="mb-3 row align-items-center">
          <label label className="col-sm-4 col-form-label">Calle</label>
        <div className="col-sm-8">
          <input className="form-control" 
          type="text" 
          value={formData.street} 
          onChange={(e) => setFormData({ ...formData, street: e.target.value })} 
          disabled={!cities.length} 
          placeholder="Calle" />
        </div>
      </div>


      {/* Number */}
      <div className="mb-3 row align-items-center">
          <label label className="col-sm-4 col-form-label">Número</label>
        <div className="col-sm-8">
          <input className="form-control"
            type="text" 
           value={formData.number} 
           onChange={(e) => setFormData({ ...formData, number: e.target.value })} 
           disabled={!cities.length}
           placeholder="Número" />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
        <button className="btn btn-danger" onClick={onBack}>Atrás</button>
        <button className="btn btn-primary" onClick={validateAndNext}>Siguiente</button>
      </div>

      <MapComponent lat={lat} lon={lon} zoom={zoom}/>
    </div>
  );
}
