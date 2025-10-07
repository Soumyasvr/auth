import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();



export const AppProvider = (props) => {

    axios.defaults.withCredentials = true;  

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendURL + "/api/user/data");
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch(error){
            toast.error(error.message);
        }
    }

    const getAuthState = async () =>{
        try {
            const {data} = await axios.get(backendURL + "/api/auth/is-auth");
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    
    const value = {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    useEffect(() => {
        getAuthState();
    }, [])
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}