import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { TravelRoutes } from '../modules/travel/travel.route.js';
import { ReviewRoutes } from '../modules/rating/review.route.js';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
    path: '/auth',
    route: AuthRoutes,
   },
   {
       path: '/travel',
       route: TravelRoutes,
   },
    {
       path: '/reviews',
       route: ReviewRoutes,
   }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;