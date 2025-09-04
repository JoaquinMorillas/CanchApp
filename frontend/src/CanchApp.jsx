import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { HeaderComponent } from './Component/HeaderComponent'
import { FooterComponent } from './Component/FooterComponent'
import { AddStablishmentPage } from './pages/AddStablishmentPage'
import { StablishmentProvider } from './context/StablishmentProvider'
import { AdministrationPage } from './pages/AdministrationPage'
import { AddSportFieldPage } from './pages/AddSportFieldPage'
import { EditStablishment } from './pages/EditStablishment'
import { EditSportFieldPage } from './pages/EditSportFieldPage'
import { EditAvailability } from './pages/EditAvailability'
import { AddAvailability } from './pages/AddAvailability'
import { NotFoundPage } from './pages/NotFoundPage'
import { StablishmentInfo } from './pages/StablishmentInfo'
import { AddReservations } from './pages/AddReservations'
import { AddAvailabilities } from './pages/AddAvailabilities'
import { ReserveByStablishmentAndSportPage} from './pages/ReserveByStablishmentAndSportPage'
import { SearchStablishmentsBySport } from './pages/SearchStablishmentsBySport'
import { ReserveByCitySportAndDate } from './pages/ReserveByCitySportAndDate'

export const CanchApp = () =>{
    
    return(
        <>
        <StablishmentProvider>
            <HeaderComponent />
                
                    <Routes>
                        <Route path="/agregar_establecimiento" element={<AddStablishmentPage />} />
                        <Route path="administracion" element={<AdministrationPage />}/>
                        <Route path='/establecimientos/:id/agregar_cancha' element={<AddSportFieldPage />} />
                        <Route path='/establecimientos/editar/:id' element={<EditStablishment />} />
                        <Route path='/canchas/editar/:id' element={<EditSportFieldPage />} />
                        <Route path='/canchas/editar/disponibilidad/:id' element={<EditAvailability />} />
                        <Route path='/canchas/editar/:id/crear_disponibilidad/:day' element={<AddAvailability />} />
                        <Route path='/canchas/editar/:id/crear_disponibilidades' element={<AddAvailabilities />} />
                        <Route path='/canchas/editar/:id/crear_reservas' element={<AddReservations />} />
                        <Route path='/establecimientos/:id' element={<StablishmentInfo />} />
                        <Route path='/establecimiento/:id/:sport/reservar' element={<ReserveByStablishmentAndSportPage />} />
                        <Route path='/establecimientos/buscar/:sport' element={<SearchStablishmentsBySport />} />
                        <Route path='/canchas/reservar/:sport/:city/:date' element={<ReserveByCitySportAndDate />} />
                        
                        <Route path='/' element={<HomePage />} />  
                        <Route path='*' element={<NotFoundPage />} /> 
                    </Routes>
                
                <FooterComponent />
        </StablishmentProvider>
        </>
        
    )
}