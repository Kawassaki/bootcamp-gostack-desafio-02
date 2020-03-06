import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

// Create an user - No Token necessary
routes.post('/user', UserController.store);
// Create an session - No Token necessary
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
// All requests below needs to inform a token

routes.put('/user', authMiddleware, UserController.update);

routes.post('/recipient', authMiddleware, RecipientController.store);
routes.put('/recipient', authMiddleware, RecipientController.update);

export default routes;
