const express = require('express');
const { addRequest, grapRequestSender, receivedRequests, requestsMade, deleteRequest, rejectRequest } = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

const requestRouter = express.Router();

requestRouter.post('/request', authMiddleware, addRequest);
requestRouter.get('/requestSender', grapRequestSender);
requestRouter.get('/requests', authMiddleware, receivedRequests)
requestRouter.get('/requestsMade', authMiddleware, requestsMade)
requestRouter.delete('/request', authMiddleware, deleteRequest)
requestRouter.delete('/rejectRequest', rejectRequest)

module.exports = requestRouter