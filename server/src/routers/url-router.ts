import express from 'express'
import urlController from '../controllers/url-controller'
import authMiddleware from '../middlewares/auth-middleware'

const router = express.Router()

router.get('/retrieve/:shortUrl', urlController.retrieve)
router.post('/shorten', authMiddleware.verifyToken, urlController.shorten)
router.get('/list', [authMiddleware.verifyToken, authMiddleware.requireAuth], urlController.list)
router.put('/update/:shortUrl', [authMiddleware.verifyToken, authMiddleware.requireAuth], urlController.update)
router.delete('/delete/:shortUrl', [authMiddleware.verifyToken, authMiddleware.requireAuth], urlController.deleteUrl)

export default router