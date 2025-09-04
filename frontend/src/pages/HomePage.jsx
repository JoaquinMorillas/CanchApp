import { SearcherComponent } from "../Component/SearcherComponent"
import { CategoriesComponent } from "../Component/CategoriesComponent"
import { RecomendationsComponent } from "../Component/RecomendationsComponent"
export const HomePage = () =>{
    
    return(
        <>
        <div style={{backgroundColor: "#E6F4EA"}}>

        <SearcherComponent />
        <br />
        <CategoriesComponent />
        <br />
        <RecomendationsComponent />
        </div>
         
    </>
    )
}