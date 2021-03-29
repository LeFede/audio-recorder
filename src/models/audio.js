const mongoose = require('mongoose')
const { Schema } = mongoose

const audioSchema = new Schema ({
    name: { type: String, required: true},
    date: { type: Date, required: true, default: Date.now()},
    audioFile: { type: String, required: true},
})

module.exports = mongoose.model('Audio', audioSchema) 