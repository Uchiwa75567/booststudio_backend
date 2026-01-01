import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  adminId?: string;
}

// Simple session storage (in production, use Redis or similar)
const activeSessions = new Map<string, { adminId: string; expiresAt: number }>();

export const generateToken = (adminId: string): string => {
  const token = `${adminId}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { adminId, expiresAt });
  return token;
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ success: false, message: 'Non autorisé - Token manquant' });
      return;
    }

    const session = activeSessions.get(token);
    
    if (!session) {
      res.status(401).json({ success: false, message: 'Non autorisé - Session invalide' });
      return;
    }

    if (session.expiresAt < Date.now()) {
      activeSessions.delete(token);
      res.status(401).json({ success: false, message: 'Non autorisé - Session expirée' });
      return;
    }

    req.adminId = session.adminId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Non autorisé' });
  }
};

export const revokeToken = (token: string): void => {
  activeSessions.delete(token);
};