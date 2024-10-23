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