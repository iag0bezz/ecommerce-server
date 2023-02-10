import { DepartmentAllController } from 'controller/department/all/DepartmentAllController';
import { Router } from 'express';

const departmentRoutes = Router();

departmentRoutes.get('/', new DepartmentAllController().handle);

export { departmentRoutes };
