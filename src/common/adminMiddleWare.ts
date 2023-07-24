
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'

@Injectable()

export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const validateToken = jwt.verify(token, 'jwtSecret')
            if (validateToken) {
                next();
            }
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

