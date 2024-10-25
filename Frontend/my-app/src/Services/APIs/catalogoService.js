import axios from 'axios'

const instance = axios.create(
    {
        baseURL: 'http://localhost:9000',
        timeout: 200000,
        headers:{
            'Content-Type':'application/json'
        },
        maxContentLength: 2000000,
    }
)

export const obtenerZonas = async() =>{
    const { data } = await instance.get("/catalogos/zonas")
    return data
}

export const obtenerTarifas = async() =>{
    const { data } = await instance.get("/catalogos/tarifas")
    return data
}

export const obtenerEstadosCiviles = async() =>{
    const { data } = await instance.get("/catalogos/estado_civil")
    return data
}

export const obtenerMotivosBajas = async() =>{
    const { data } = await instance.get("/catalogos/motivos-bajas")
    return data
}

export const obtenerDestinos = async() =>{
    const { data } = await instance.get("/catalogos/destinos")
    return data
}