import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,

    jwt_secret: process.env.JWT_SECRET as string,
    jwt_expires_in: process.env.JWT_EXPIRES_IN as string,

    cloudinary: {
        cloud_name: process.env.CLOUD_NAME as string,
        api_key: process.env.API_KEY as string,
        api_secret: process.env.API_SECRET as string,
        url: process.env.CLOUDINARY_URL as string,
    }
}