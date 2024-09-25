require('dotenv').config();
const AWS = require('aws-sdk')

const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_KEYID,
    secretAccessKey: process.env.AWS_ACCESSKEY,
    region: process.env.AWS_REGION
});

function subirImagenBase64(data, nombreArchivo, carpeta) {
    const buffer = Buffer.from(data, 'base64'); //decoding picture
    const params = {
        Bucket: 'qnave-ayd2',
        Key: `${carpeta}/${nombreArchivo}`,
        Body: buffer,
        ContentType: 'image/jpeg'
    };
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}

function subirPDFBase64(data, nombreArchivo, carpeta) {
    const buffer = Buffer.from(data, 'base64'); //decoding picture
    const params = {
        Bucket: 'qnave-ayd2',
        Key: `${carpeta}/${nombreArchivo}`,
        Body: buffer,
        ContentType: 'application/pdf'
    };
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}


module.exports = { subirImagenBase64, subirPDFBase64 };