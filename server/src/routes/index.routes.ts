import express from 'express'; 
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';


const router = express.Router();

router.use('/api/user', userRoutes);
router.use('/api/property',propertyRoutes);
export default router;

