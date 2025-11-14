import { SearcherComponent } from "../Component/SearcherComponent"
import { CategoriesComponent } from "../Component/CategoriesComponent"
import { RecomendationsComponent } from "../Component/RecomendationsComponent"
import { FavoritesComponent } from "../Component/FavoritesComponent"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
export const HomePage = () =>{
    const {user} = useContext(AuthContext)
    
    return(
        <>
        <div style={{backgroundColor: "#E6F4EA"}}>

        <SearcherComponent />
        <br />
        {user?.favorites.length > 0 && (<FavoritesComponent />)}
        <br />
        <CategoriesComponent />
        <br />
        <RecomendationsComponent />
        </div>
         
    </>
    )
}