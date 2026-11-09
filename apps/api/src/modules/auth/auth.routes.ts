import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { validate } from '../../common/middleware/validate';
import { authenticate } from '../../common/middleware/authenticate';
import { registerSchema, loginSchema } from '@ecommerce/shared';
import { BadRequestError, UnauthorizedError } from '../../common/errors/AppError';

export const authRoutes = Router();

// In-memory or database user repository fallback
const users: any[] = [
  {
    id: 'usr-admin-1',
    name: 'Maison Master Admin',
    email: 'admin@aurelia.com',
    passwordHash: bcrypt.hashSync('AdminPass123!', 10),
    role: 'admin',
    emailVerifiedAt: new Date().toISOString(),
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-cust-1',
    name: 'Lady Genevieve Vance',
    email: 'genevieve.vance@luxurymail.com',
    passwordHash: bcrypt.hashSync('ClientPass123!', 10),
    role: 'customer',
    emailVerifiedAt: new Date().toISOString(),
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
];

const refreshTokens = new Map<string, string>(); // tokenHash -> userId

// POST /auth/register
authRoutes.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return next(new BadRequestError('Email is already registered in the clientele'));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      passwordHash,
      role: 'customer',
      emailVerifiedAt: new Date().toISOString(),
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.ACCESS_TTL }
    );

    const refreshToken = jwt.sign(
      { id: newUser.id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    refreshTokens.set(refreshToken, newUser.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...userSafe } = newUser;
    res.status(201).json({
      data: {
        user: userSafe,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
authRoutes.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return next(new UnauthorizedError('Invalid credentials'));
    }

    if (user.isBlocked) {
      return next(new UnauthorizedError('This account has been locked. Contact concierge.'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new UnauthorizedError('Invalid credentials'));
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.ACCESS_TTL }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    refreshTokens.set(refreshToken, user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...userSafe } = user;
    res.json({
      data: {
        user: userSafe,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
authRoutes.post('/refresh', (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return next(new UnauthorizedError('Invalid or expired refresh token'));
  }

  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as { id: string };
    const user = users.find((u) => u.id === decoded.id);

    if (!user || user.isBlocked) {
      refreshTokens.delete(refreshToken);
      return next(new UnauthorizedError('User session is invalid'));
    }

    // Refresh token rotation
    refreshTokens.delete(refreshToken);
    const newRefreshToken = jwt.sign(
      { id: user.id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    refreshTokens.set(newRefreshToken, user.id);

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.ACCESS_TTL }
    );

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    next(new UnauthorizedError('Refresh token expired'));
  }
});

// POST /auth/logout
authRoutes.post('/logout', (req, res) => {
  const refreshToken = req.cookies?.refresh_token;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  res.clearCookie('refresh_token');
  res.json({ data: { message: 'Signed out successfully' } });
});

// GET /auth/me
authRoutes.get('/me', authenticate, (req, res, next) => {
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    return next(new UnauthorizedError());
  }
  const { passwordHash: _, ...userSafe } = user;
  res.json({ data: userSafe });
});
