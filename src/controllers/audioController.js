const Audio = require('../models/audio')
const path = require('path')

require('dotenv').config()

const fs = require('fs');
const AWS = require('aws-sdk');
const audio = require('../models/audio');


const audioController = {



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

        // const doesAudioExist = await Audio.find({name: name})

        // if (doesAudioExist)
        //     return console.log('Audio already exists')
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        });

        const filePath =  path.join(__dirname, `../public/uploads/${name}.wav`)

        const fileContent = fs.readFileSync(filePath);

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${name}.wav`, // Name in S3
            Body: fileContent
        };



        // Uploading files to the bucket
        s3.upload(params, async function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            
            const newAudio = new Audio({
                name: name,
                audioFile: data.Location
            })

            try {
                await newAudio.save()
                res.json({status: `${newAudio.name} saved.`})

                // Delete file on
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            } catch(err) {
                res.json(err)
            }


        });
        
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

    async findBySearch (req, res) {

        try {
            const foundAudios = await Audio.find({"name": {$regex : req.params.search}})
            res.json(foundAudios)
        } catch(err) {

        }
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