//import { useAuth } from "../contexts/AuthContext";


const url = "https://booking-saas-backend.onrender.com"

export const setAccessToken = (token) => {
    accessToken = token;
};


export const apiFetch = async (url, options = {}, accessToken) => {
    const makeRequest = async () => {
        return fetch(url, {
            ...options,
            headers:{
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            },
            credentials:"include"
        })
    }

    const response = await makeRequest();

    if(response.status === 401){
        const refreshResponse = await fetch(url + "/auth/refresh-token", {
            method:"POST",
            credentials: "include"
        })
        if(refreshResponse.ok){
            const data = await refreshResponse.json()
            accessToken = data.accessToken;
    
            response = await makeRequest();

        } else{
            console.log("session expired")
        }
    }

    return response;
}

export const deleteService = async (serviceId, accessToken) => {
    const formatedUrl = `${url}/auth/deleteService/${serviceId}`;
    const requestOptions = {method:"DELETE", headers:{"Content-Type":"application/json"}, credentials:"include"}
    try{
        const res = await apiFetch(formatedUrl, requestOptions, accessToken )
        const {success, message} = await res.json()
        

        return {success, message}

    } catch(error){
        return error
    }
}

export const createService = async (service, accessToken) => {
    const formatedUrl = `${url}/auth/createService/`;
     const options = {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        name:service.name,
        duration: service.duration
      }),
      credentials:"include"
    }
    try{
        const res = await apiFetch(formatedUrl, options, accessToken)
        const {data, message, success} = await res.json()
        
        return {
            ok:res.ok, 
            status:res.status, 
            data,
            message,
            success
        }
    } catch(error){
        return error
    }


}

export const getServices = async (userId, accessToken) => {
    const formatedUrl = `${url}/auth/getServices/${userId}`
    const options = {
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        //"Authorization": "Bearer " + localStorage.getItem("token")
      }
    };
    const res = await apiFetch(formatedUrl,options, accessToken)
    
    const data = await res.json();
    
    return data.services;
    if(!res.ok){
      // Handle HTTP errors (404, 500, etc.)
      throw new Error(res.message || 'Something went wrong');
    }

    
}

export const createAppointment = async (appointment, accessToken) => {
    const url = `${url}/auth/createAppointment`
    const options = {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(appointment),
        Authorization: "Bearer " + accessToken,
        credentials:"include"
    }
    const res = await apiFetch(url, options, accessToken)
    const data = await res.json()
    return data
}

export const getAppointments = async (userId, accessToken) =>{
     const url = `${url}/auth/getApointmentsById/${userId}`
    const options = {
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        //"Authorization": "Bearer " + localStorage.getItem("token")
        credentials:"include"
    }
    };
    const res = await apiFetch(url,options, accessToken)
    
    const data = await res.json();
    if(data.appointments){
        return data.appointments;

    } else{
        return [];
    }
    if(!res.ok){
      // Handle HTTP errors (404, 500, etc.)
      throw new Error(res.message || 'Something went wrong');
    }
} 

export const deleteAppointment = async (appointmentId, accessToken) => {
    const url = `${url}/auth/deleteAppointment/${appointmentId}`
    const options = {
        method:"DELETE",  
        headers:{
            "Content-Type": "application/json",
            //"Authorization": "Bearer " + localStorage.getItem("token")
            credentials:"include"
        }
    }

    const res = await apiFetch(url, options, accessToken)
    if(res.ok){
        const data = await res.json()
        return data
    }
    
    return data;
}