const Audio = require('../models/audio')


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
        
        const newAudio = new Audio({
            name: req.body.name,
            audioFile: 'http://localhost:3000/uploads/1.wav'
        })

        try {
            await newAudio.save()
            res.json({status: `${newAudio.name} saved.`})

        } catch(err) {
            res.json(err)
        }
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
        //console.log(file)
        //res.send('upload')
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