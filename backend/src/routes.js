import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import ProblemController from './app/controllers/ProblemController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/sent', DeliveryController.sent);
routes.put('/deliveries/:order_id', DeliveryController.update);

routes.post('/deliveries/:id/problems', ProblemController.create);

routes.use(authMiddleware);

routes.get('/deliveries/problems', ProblemController.index);
routes.get('/deliveries/:id/problems', ProblemController.problems);
routes.delete('/problem/:id/cancel-delivery', ProblemController.delete);

routes.post('/recipients', RecipientController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
