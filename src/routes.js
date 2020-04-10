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

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/delivery/:id', DeliveryController.index);
routes.get('/delivery/:id/deliveries', DeliveryController.deliveries);
routes.put('/delivery/:id/orders/:order_id', DeliveryController.update);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
