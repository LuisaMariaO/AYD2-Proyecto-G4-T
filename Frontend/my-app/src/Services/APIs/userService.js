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

export const recuperarContrasenaUsuario = async(username) =>{
    const { data } = await instance.post("/usuario/solicitudCambiarContrasena", {username: username})
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

export const cancelarViaje = async(viaje_id, tiempo_espera, no_conductor, otro, comentario, usuario_id) =>{
    const { data } = await instance.post("/usuario/cancelarViaje", {viaje_id: viaje_id, tiempo_espera: tiempo_espera, no_conductor: no_conductor, otro: otro, comentario: comentario, usuario_id: usuario_id})
    return data
}

export const obtenerInformacionUsuario = async(userId) =>{
    const { data } = await instance.get("/usuario/getUsuario/"+userId)
    return data
}

export const actualizarUsuario = async(userId, nombre, fecha_nacimiento, genero, celular, correo, password) => {
    const { data } = await instance.post("/usuario/updateUsuario", {userId: userId, nombre: nombre, fecha_nacimiento, fecha_nacimiento, genero: genero, celular:celular, correo:correo, password:password})
    return data
}

export const obtenerCalificacionConductor = async(conductor_id) =>{
    const { data } = await instance.get("/usuario/getCalificacionConductor/"+conductor_id)
    console.log(data)
    return data
}

export const calificarViaje = async(viaje_id, calificacion, comentario) =>{
    const { data } = await instance.post("/usuario/calificarViaje", {viaje_id: viaje_id, calificacion: calificacion, comentario: comentario})
    return data
}

export const guardarUbicacion = async (user_id, nombre, zona) =>{
    const { data } = await instance.post("/usuario/guardarUbicacion",{usuario_id:user_id, nombre:nombre, zona:zona })
    return data
}
