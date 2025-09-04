import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';

export const MapComponent = ({lat, lon, zoom, height = "400px", width = "100%", popUp="Ubicacion Estimada"}) => {
  const center = [parseFloat(lat), parseFloat(lon)]

  const Recenter = ({ center, zoom }) => {
      const map = useMap()
      map.setView(center, zoom)
      return null
  
  }

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: height, width: width }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
         <Marker position={[lat, lon]}>
          <Popup>{popUp}</Popup>
        </Marker>
        <Recenter center={center} zoom={zoom} />
      </MapContainer>
    </>
  );
};