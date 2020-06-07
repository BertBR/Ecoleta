import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';
import Validations from './utils/validations';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

const validations = new Validations();

routes.get('/items', itemsController.index);

routes.post('/points', upload.single('image'), validations.createPoint(), pointsController.create);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
