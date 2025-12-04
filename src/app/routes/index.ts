import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { AuthRoutes } from '../modules/auth/auth.route.js';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
    path: '/auth',
    route: AuthRoutes,
   }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;