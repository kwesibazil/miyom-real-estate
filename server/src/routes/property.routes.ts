import express from 'express';
import {upload} from '../configs/multer.config';
import controller from '../controllers/property.controller';
import { propertyMiddleware } from '../middleware/index.middleware';

const router = express.Router();

router.get('/', propertyMiddleware.findAll, controller.findAllProperty);
router.post('/create', propertyMiddleware.create, controller.createProperty);
router.put('/update', propertyMiddleware.update, controller.updateProperty);


router.get('/id/:id', propertyMiddleware.searchId, controller.findPropertyByStringOrId);
router.get('/properties/:investorId', propertyMiddleware.findAllProperties, controller.findAllInvestorsProperty);
router.get('/investor/:investorId', propertyMiddleware.findAllProperties, controller.findAllInvestorPropertyAdmin);

router.get('/search/:search', propertyMiddleware.searchTitle, controller.findPropertyByStringOrId);
router.post('/upload', propertyMiddleware.upload, upload.array('upload'), controller.uploadPropertyResource);    //missing validation;

export default router;



