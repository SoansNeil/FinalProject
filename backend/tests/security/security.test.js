import request from 'supertest';
import User from '../../src/models/User.js';
import { generateToken, verifyToken } from '../../src/utils/generateToken.js';
import app from '../../src/server.js';
import bcryptjs from 'bcryptjs';

describe('Security Tests', () => {
  describe('Password Security', () => {
    test('should hash passwords with bcrypt', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      expect(userWithPassword.password).not.toBe('password123');
      expect(userWithPassword.password.length).toBeGreaterThan(20); // bcrypt hash is ~60 chars
    });

    test('should not return password in user responses', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.body.user.password).toBeUndefined();
    });

    test('should salt passwords with different salts', async () => {
      const user1 = await User.create({
        firstName: 'User',
        lastName: 'One',
        email: 'user1@example.com',
        password: 'password123',
      });

      const user2 = await User.create({
        firstName: 'User',
        lastName: 'Two',
        email: 'user2@example.com',
        password: 'password123',
      });

      const user1WithPassword = await User.findById(user1._id).select(
        '+password'
      );
      const user2WithPassword = await User.findById(user2._id).select(
        '+password'
      );

      expect(user1WithPassword.password).not.toBe(user2WithPassword.password);
    });
  });

  describe('JWT Security', () => {
    test('should generate valid JWT tokens', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    test('should include userId in token payload', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(userId);
    });

    test('should reject tampered tokens', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const tamperedToken = token.slice(0, -5) + 'XXXXX';

      const decoded = verifyToken(tamperedToken);
      expect(decoded).toBeNull();
    });

    test('should set token expiration', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const decoded = verifyToken(token);

      expect(decoded.exp).toBeDefined();
    });
  });

  describe('SQL/NoSQL Injection Prevention', () => {
    test('should handle email with special characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: "test'; drop table users; --@example.com",
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.statusCode).toBe(500);
      const usersCount = await User.countDocuments();
      expect(usersCount).toBe(0);
    });

    test('should safely handle query injection attempts', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $ne: null },
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Email Uniqueness & Validation', () => {
    test('should enforce email uniqueness', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toContain('already registered');
    });

    test('should handle case-insensitive email uniqueness', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'JOHN@EXAMPLE.COM',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.statusCode).toBe(409);
    });

    test('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('Timestamp Handling', () => {
    test('should set createdAt timestamp on registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

      const user = await User.findOne({ email: 'john@example.com' });
      expect(user.createdAt).toBeDefined();
      expect(user.createdAt instanceof Date).toBe(true);
    });

    test('should set lastLogin on login', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userBefore = await User.findOne({ email: 'john@example.com' });
      const loginBefore = userBefore.lastLogin;

      await new Promise((resolve) => setTimeout(resolve, 100));

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      const userAfter = await User.findOne({ email: 'john@example.com' });
      expect(userAfter.lastLogin).not.toEqual(loginBefore);
    });
  });

  describe('Error Message Security', () => {
    test('should not expose database errors', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.body.message).toBe('Invalid email or password.');
      expect(res.body.message).not.toMatch(/cast|duplicate|validation/i);
    });

    test('should provide same error message for non-existent user', async () => {
      const res1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      const res2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(res1.body.message).toBe(res2.body.message);
    });
  });

  describe('Input Sanitization', () => {
    test('should trim whitespace from firstName', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: '  John  ',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

      const user = await User.findOne({ email: 'john@example.com' });
      expect(user.firstName).toBe('John');
    });

    test('should convert email to lowercase', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'JOHN@EXAMPLE.COM',
          password: 'password123',
          confirmPassword: 'password123',
        });

      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeDefined();
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('Protected Routes', () => {
    test('should reject requests without token', async () => {
      const res = await request(app).get('/api/favorite-teams');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject requests with malformed Authorization header', async () => {
      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', 'InvalidFormat token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should allow valid token', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const token = generateToken(user._id);

      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    test('should not allow user to access other user data with different token', async () => {
      const user1 = await User.create({
        firstName: 'User',
        lastName: 'One',
        email: 'user1@example.com',
        password: 'password123',
      });

      const user2 = await User.create({
        firstName: 'User',
        lastName: 'Two',
        email: 'user2@example.com',
        password: 'password123',
      });

      user1.favoriteTeams.push({
        teamId: 'team1',
        teamName: 'Team One',
        addedAt: new Date(),
      });
      await user1.save();

      const token2 = generateToken(user2._id);

      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', `Bearer ${token2}`);

      expect(res.body.data).toEqual([]);
    });
  });

  describe('CORS Security', () => {
    test('should include CORS headers in response', async () => {
      const res = await request(app).get('/health');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
