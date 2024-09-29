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

export const registroUsuario = async(nombre, fecha_nacimiento, genero, correo, celular, password) =>{
    const { data } = await instance.post("/usuario/registro", {nombre: nombre, fecha_nacimiento: fecha_nacimiento, genero: genero, correo: correo, celular: celular, password: password})
    return data
}

export const verificarCuenta = async(username) =>{
    const { data } = await instance.post("/usuario/verificar", {username: username})
    return data
}

export const cambiarContrasenaUsuario = async (username, password) =>{
    const { data } = await instance.post("/usuario/cambiarContrasena", {username: username, password: password})
    return data
}

export const loginUsuario = async(user, password) =>{
    const { data } = await instance.post("/usuario/login", { user: user, password: password})
    return data
}

export const reportarProblemaUsuario = async(descripcion, fecha, nombre_conductor, placa, username) =>{
    const { data } = await instance.post("/usuario/reportarProblema", {username: username, descripcion: descripcion, fecha: fecha, nombre_conductor: nombre_conductor, placa: placa})
    return data
}

export const solicitarViaje = async(usuario_id, inicio, fin) =>{
    const { data } = await instance.post("/usuario/solicitarViaje", {usuario_id: usuario_id, inicio: inicio, fin: fin})
    return data
}

export const obtenerViajesPendientes = async(usuario_id) =>{
    const { data } = await instance.post("/usuario/getViajesPendientes", {usuario_id: usuario_id})
    return data
}

