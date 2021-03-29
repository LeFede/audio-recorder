const Audio = require('../models/audio')
const path = require('path')



const fs = require('fs');
const AWS = require('aws-sdk');
const audio = require('../models/audio');

// async function uploadFile (fileName, name) {
//     // Read content from the file

//     const s3 = new AWS.S3({
//         accessKeyId: 'AKIAV6T2XWCCRVCNTYP6',
//         secretAccessKey: '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'
//     });

//     const fileContent = fs.readFileSync(fileName);

//     // Setting up S3 upload parameters
//     const params = {
//         Bucket: 'audios-react',
//         Key: name, // File name you want to save as in S3
//         Body: fileContent
//     };

//     // Uploading files to the bucket
//     s3.upload(params, function(err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(`File uploaded successfully. ${data.Location}`);
        
//     });

// }


const audioController = {



    async uploadS3 (req, res) {
        console.log(__dirname)
        uploadFile(path.join(__dirname, '../public/uploads/2.png'))
    
    },


    async getAll (req, res) {
        try {
            const allAudios = await Audio.find()
            res.json(allAudios)
        } catch(err) {
            res.json(err)
        }
    
    },

    async getById (req, res) {
        res.json(res.audio)
    },

    async create (req, res) {
 
        const {name, audioFile} = req.body
        
        const s3 = new AWS.S3({
            accessKeyId: 'AKIAV6T2XWCCRVCNTYP6',
            secretAccessKey: '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'
        });

        const fileContent = fs.readFileSync( path.join(__dirname, `../public/uploads/${name}.wav`));

        // Setting up S3 upload parameters
        const params = {
            Bucket: 'audios-react',
            Key: `${name}.wav`, // File name you want to save as in S3
            Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(params, async function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            


            try {

                // const location = await uploadFile(path.join(__dirname, `../public/uploads/${name}.wav`), `${name}.wav`)
                console.log(data.Location)
    
                const newAudio = await new Audio({
                    name: name,
                    audioFile: data.Location
                })
    
    
                await newAudio.save()
                res.json({status: `${newAudio.name} saved.`})
    
    
    
            } catch(err) {
                res.json(err)
            }


        });
        // path.join(__dirname, `../public/uploads/${name}.wav`), `${name}.wav`

        //const {name, audioFile} = req.body
        //console.log(req.body)
        //let file = await new File([audioFile], "uwu2.wav")

        //console.log(file)




        
    },

    async deleteAll (req, res) {
        try {
            await Audio.deleteMany({})
            res.json({message: 'Dropped all audios.'})
        } catch(err) {
            res.json(err)
        }
    },

    async deleteById (req, res) {
        res.audio.remove()
        res.json({message: `${res.audio.name} removed.`})
    },

    async updateById (req, res) {
        if (req.body.name == null) return

        let newname = req.body.name
        let lastname = res.audio.name

        res.audio.name = newname

        try {
            const updatedAudio = await res.audio.save()
            res.json({message: `${lastname} changed to ${updatedAudio.name}.`})
        } catch (err) {
            res.json(err)
        }
    },

    async upload (req, res) {
        //const {file, body} = req
        //res.send('upload')






        //console.log(file)
        //const uploadAudio = new Audio({
            //name: req.body.name,
            //audioFile: req.file
        //})

    },


    async getAudioById (req, res, next) {
        let audio

        try {
            audio = await Audio.findById(req.params.id)
            if (audio == null) { return res.status(404).json( {message: 'Can\'t find audio'})}
            
        } catch(err) {
            res.json(err)
        }

        res.audio = audio
        next()
    }
}

module.exports = audioController