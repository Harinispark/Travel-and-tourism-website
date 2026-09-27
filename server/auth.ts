import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbEngine, User, AuditLog } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'prompt_travels_jwt_secret_key_production_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: 'customer' | 'staff' | 'admin';
  };
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = undefined;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }
  next();
}

export function requireRole(...allowedRoles: Array<'customer' | 'staff' | 'admin'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Access denied. Requires role: ${allowedRoles.join(' or ')}` });
      return;
    }
    next();
  };
}

export function logAuditEvent(
  req: AuthRequest,
  action: string,
  targetEntity: string,
  targetId: string,
  details: string
) {
  const audit: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: req.user?.id || 'anonymous',
    userName: req.user?.name || 'Anonymous User',
    role: req.user?.role || 'guest',
    action,
    targetEntity,
    targetId,
    details,
    ipAddress: req.ip || req.socket.remoteAddress,
    createdAt: new Date().toISOString(),
  };

  dbEngine.db.audit_logs.unshift(audit);
  if (dbEngine.db.audit_logs.length > 500) {
    dbEngine.db.audit_logs = dbEngine.db.audit_logs.slice(0, 500);
  }
  dbEngine.persist();
}
