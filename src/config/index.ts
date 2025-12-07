import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    solt_round:process.env.SOLTROUND,
    jwt_access_secret:process.env.JWT_ACCESS_SECRET as string,
    jwt_access_expires:process.env.JWT_ACCESS_EXPIRES!,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET!,
    jwt_refresh_expire:process.env.JWT_REFRESH_EXPIRES!,
    express_session_secret:process.env.EXPRESS_SESSION_SECRET!,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL!,
    ADMIN_PASS:process.env.ADMIN_PASS!,
}