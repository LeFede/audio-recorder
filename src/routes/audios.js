const { Router } = require('express')
const router = Router()


const audioController = require('../controllers/audioController')

router.get('/', audioController.getAll)
router.post('/', audioController.create)
router.delete('/delete/', audioController.deleteAll)
router.get('/:id', audioController.getAudioById, audioController.getById)
router.patch('/:id', audioController.getAudioById, audioController.updateById)
router.delete('/delete/:id', audioController.getAudioById, audioController.deleteById)




router.post('/upload', audioController.upload)



router.put('/uploadS3', audioController.uploadS3)

module.exports = router