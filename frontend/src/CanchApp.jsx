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
import { AuthContext, AuthProvider } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UserInfoPage } from './pages/UserInfoPage'
import { AdminUsers } from './pages/AdminUsers'
import { ProtectedRoute } from './Component/ProtectedRoute'
import { Unauthorized } from './pages/Unauthorized'
import { AmenitiesPage } from './pages/AmenitiesPage'

export const CanchApp = () =>{
    
    return(
        <>
        <AuthProvider>
        
            <StablishmentProvider>
                <HeaderComponent />
                        
                        <Routes>
                            {/* Protected Routes for ADMIN or OWNER*/}
                            <Route element={<ProtectedRoute authRoles={["ROLE_ADMIN", "ROLE_OWNER"]}/>}>
                                <Route path="/administracion" element={<AdministrationPage />}/>
                                <Route path="/administracion/agregar_establecimiento" element={<AddStablishmentPage />} />
                                <Route path='/administracion/establecimientos/:id/agregar_cancha' element={<AddSportFieldPage />} />
                                <Route path='/administracion/establecimientos/editar/:id' element={<EditStablishment />} />
                                <Route path='/administracion/canchas/editar/:id' element={<EditSportFieldPage />} />
                                <Route path='/administracion/canchas/editar/disponibilidad/:id' element={<EditAvailability />} />
                                <Route path='/administracion/canchas/editar/:id/crear_disponibilidad/:day' element={<AddAvailability />} />
                                <Route path='/administracion/canchas/editar/:id/crear_disponibilidades' element={<AddAvailabilities />} />
                                <Route path='/administracion/canchas/editar/:id/crear_reservas' element={<AddReservations />} />
                                <Route path='administracion/caracteristicas' element={<AmenitiesPage />}/>
                            </Route>
                            {/* Protected Routes for ADMIN*/}
                            <Route element={<ProtectedRoute authRoles={["ROLE_ADMIN"]}/>}>
                                <Route path='/administracion/usuarios' element={<AdminUsers />}/>
                            </Route>
                            
                            {/* Protected Routes for anyone registered*/}
                            <Route element={<ProtectedRoute authRoles={["ROLE_ADMIN", "ROLE_OWNER", "ROLE_USER"]}/>}>
                                <Route path='/perfil' element={<UserInfoPage />}/>
                            </Route>
                            {/*Public Routes*/}
                            <Route path='/establecimientos/:id' element={<StablishmentInfo />} />
                            <Route path='/establecimientos/:id/:sport/reservar' element={<ReserveByStablishmentAndSportPage />} />
                            <Route path='/establecimientos/buscar/:sport' element={<SearchStablishmentsBySport />} />
                            <Route path='/canchas/reservar/:sport/:city/:date' element={<ReserveByCitySportAndDate />} />
                            
                            <Route path='/' element={<HomePage />} /> 
                            <Route path='/login' element={<LoginPage />} /> 
                            <Route path='/register' element={<RegisterPage />}/>
                            
                            <Route path='*' element={<NotFoundPage />} /> 
                            <Route path='/no_autorizado' element={<Unauthorized />}/>
                        </Routes>
                    
                    <FooterComponent />
            </StablishmentProvider>
        </AuthProvider>
        </>
        
    )
}