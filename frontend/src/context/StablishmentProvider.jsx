import axios from 'axios';
import React, { useEffect, useReducer } from 'react'
import Swal from 'sweetalert2';
import { StablishmentContext } from './StablishmentContext';

export const StablishmentProvider = ({ children }) => { 

    const initialState = {
        all: [],
        filtered: [],
        loading: false,
        error: null
    };
    
    const baseURL = "http://localhost:8080/stablishment"

    const stablishmentReducer = (state, action) => {
        switch(action.type){
            case "Fetch" :
                return {
                    ...state,
                    all: action.payload,
                    filtered : action.payload,
                    loading: false,
                    error: null
                };
            case "Add" : 
                return {
                    ...state,
                    all: [...state.all, action.payload],
                    filtered: [...state.filtered, action.payload],
                    loading: false,
                    error: null
                };
            
            case "Delete" :
                return {
                    ...state,
                    all : state.all.filter((s) => s.id !== action.payload),
                    filtered: state.filtered.filter((s) => s.id !== action.payload),
                    loading: false,
                    error: null
                }

            case "Update" :
                return {
                    ...state,
                    all: state.all.map((s) => s.id === action.payload.id ? action.payload : s),
                    filtered: state.filtered.map((s) => s.id === action.payload.id ? action.payload : s),
                    loading: false,
                    error: null
                }

            case "FilterByCity":
                return {
                    ...state,
                    all: [...state.all],
                    filtered: state.all.filter((s) => s.city === action.payload.city),
                    loading: false,
                    error: null
                }
            
            case "FilterBySport":
                return {
                    ...state,
                    all: [...state.all],
                    filtered: state.all.filter((s) => 
                        s.sports.some(sport => action.payload.sports.includes(sport)))
                }
            default:
                console.warn("Unknown action type:", action.type);
                return state;
        }
    }

    const [stablishments, dispatch] = useReducer(stablishmentReducer, initialState);

    const fetchStablishments = async () =>{
        try{
            const res = await axios.get(baseURL + "/all")
            const action = {
                type: "Fetch",
                payload: res.data
            }
            dispatch(action)
        }catch (error){
            Swal.fire({
                title: error,
                text: error.message,
                icon:"error"
            }
            )
        }
    }

    const addStablishment = async (data) => {
    
        const res = await axios.post(baseURL + "/save", data)
        const action = {
             type : "Add",
             payload: res.data
        }
        dispatch(action)
        return(res.data)
        
    }
    const updateStablishment = async (data, id) =>{
        
            const res = await axios.put(baseURL + "/update/" + id, data)
            const action = {
                type: "Update",
                payload: res.data
            }
            dispatch(action)
            return res.data

    }

    const deleteStablishment = async (id) =>{
        const res = await axios.delete(baseURL + "/" + id)
        const action = {
            type: "Delete",
            payload: id
        }
        dispatch(action)
        return res.data
    }
    useEffect(() =>{
        
        fetchStablishments();
        console.log("stablishments from context: ", stablishments)
        

    }, [])

 
    return(
        <StablishmentContext.Provider value={{ stablishments, fetchStablishments, addStablishment, updateStablishment, deleteStablishment }}>
            {children}
        </StablishmentContext.Provider>
    
    )
}
