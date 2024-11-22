import type { Request, Response } from 'express';
import type { LoginInput } from '../schema/auth.schema';

export async function loginController(
    req: Request<{}, {}, LoginInput>,
    res: Response
) {
    try {
        const { email, password } = req.body;
        const prisma = req.prisma;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return
        }

        const hashPassword = await Bun.password.hash(password);
        const isSame = await Bun.password.verify(password, hashPassword);

        if (!isSame) {
            res.status(401).json({ message: 'Invalid credentials' });
            return
        }

        res.status(200).json({ message: 'Login successful' });

        return
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
