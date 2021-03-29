//#region Imports
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
//#endregion

//#region  Config
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})


const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads')
}).single('audioFile'))




app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))



app.listen(process.env.DB_PORT, () => console.log('Server started'))
//#endregion

//#region Methods
function setupRouter(name) {
    app.use(`/api/${name}`, require(`./routes/${name}`))
}
//#endregion

setupRouter('audios')








