import express from 'express';
import cors from 'cors';
import prisma from './lib/db';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const router = express.Router();


declare global {
    namespace Express {
        interface Request {
            prisma: typeof prisma;
        }
    }
}

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

const routePath = join(__dirname, 'routes');
const routes = readdirSync(routePath);
routes.forEach(async (file) => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const path = file.split('.route.')[0];
        const route = await import(join(routePath, file));
        const apiPath = path.replaceAll(".route.ts", "").replaceAll(".ts", "");
        router.use(`/${apiPath}`, route.default);
    }
});

app.use('/api/v1', router);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const HOST = process.env.HOST || '0.0.0.0';


app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});
