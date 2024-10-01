* RECORDAR AGREGAR EL .ENV
* NO SUBIR NODE_MODULES

## Correr programa
```
npm install
npm run start
```

## Ejemplo envio de fotos
Guardar la foto en el bucket, retorna la URL, guardar la URL en el campo foto de la base de datos
### Uso función
```javascript
const image = req.body.foto;
    const fileName = 'prueba.jpeg'
    subirImagenBase64(image, fileName, 'Fotos_Perfil')
        .then(url => {
            return res.status(200).json({ "success": url });
        })
        .catch(err => {
            console.error('Error al subir la imagen:', err);
            return res.status(200).json({ "error": err });
        });
```
body json
```json
{
    "foto":"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAY...."
}
```