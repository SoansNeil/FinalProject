import request from 'supertest';
import User from '../../src/models/User.js';
import { generateToken } from '../../src/utils/generateToken.js';
import app from '../../src/server.js';

describe('Favorite Teams Integration Tests', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    userId = user._id;
    token = generateToken(userId);
  });

  describe('GET /api/favorite-teams', () => {
    test('should get favorite teams for authenticated user', async () => {
      const user = await User.findById(userId);
      user.favoriteTeams = [
        { teamId: 'team1', teamName: 'Team One', addedAt: new Date() },
      ];
      await user.save();

      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].teamName).toBe('Team One');
    });

    test('should return empty array if no favorite teams', async () => {
      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    test('should fail without token', async () => {
      const res = await request(app).get('/api/favorite-teams');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/favorite-teams')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/favorite-teams', () => {
    test('should add team to favorites', async () => {
      const res = await request(app)
        .post('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamId: 'team1',
          teamName: 'Manchester United',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].teamName).toBe('Manchester United');
    });

    test('should fail with missing teamId', async () => {
      const res = await request(app)
        .post('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamName: 'Manchester United',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should fail with missing teamName', async () => {
      const res = await request(app)
        .post('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamId: 'team1',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should prevent duplicate favorites', async () => {
      await request(app)
        .post('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamId: 'team1',
          teamName: 'Manchester United',
        });

      const res = await request(app)
        .post('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamId: 'team1',
          teamName: 'Manchester United',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already in your favorites');
    });

    test('should fail without token', async () => {
      const res = await request(app)
        .post('/api/favorite-teams')
        .send({
          teamId: 'team1',
          teamName: 'Manchester United',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/favorite-teams', () => {
    beforeEach(async () => {
      const user = await User.findById(userId);
      user.favoriteTeams = [
        { teamId: 'team1', teamName: 'Team One', addedAt: new Date() },
        { teamId: 'team2', teamName: 'Team Two', addedAt: new Date() },
      ];
      await user.save();
    });

    test('should remove team from favorites', async () => {
      const res = await request(app)
        .delete('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          teamId: 'team1',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].teamId).toBe('team2');
    });

    test('should fail with missing teamId', async () => {
      const res = await request(app)
        .delete('/api/favorite-teams')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should fail without token', async () => {
      const res = await request(app)
        .delete('/api/favorite-teams')
        .send({
          teamId: 'team1',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
