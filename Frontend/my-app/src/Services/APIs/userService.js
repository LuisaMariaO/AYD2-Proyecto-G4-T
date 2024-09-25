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