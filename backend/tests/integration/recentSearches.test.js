import request from 'supertest';
import User from '../../src/models/User.js';
import { generateToken } from '../../src/utils/generateToken.js';
import app from '../../src/server.js';

describe('Recent Searches Integration Tests', () => {
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

  describe('GET /api/recent-searches', () => {
    test('should get recent searches for authenticated user', async () => {
      const user = await User.findById(userId);
      user.recentSearches = [
        { query: 'Manchester United', searchedAt: new Date() },
      ];
      await user.save();

      const res = await request(app)
        .get('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].query).toBe('Manchester United');
    });

    test('should return empty array if no recent searches', async () => {
      const res = await request(app)
        .get('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    test('should return searches sorted by most recent first', async () => {
      const user = await User.findById(userId);
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');

      user.recentSearches = [
        { query: 'Search 1', searchedAt: date1 },
        { query: 'Search 2', searchedAt: date2 },
      ];
      await user.save();

      const res = await request(app)
        .get('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.data[0].query).toBe('Search 2');
      expect(res.body.data[1].query).toBe('Search 1');
    });

    test('should fail without token', async () => {
      const res = await request(app).get('/api/recent-searches');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/recent-searches', () => {
    test('should add search to history', async () => {
      const res = await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: 'Manchester United',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].query).toBe('Manchester United');
    });

    test('should fail with empty query', async () => {
      const res = await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: '',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should fail with missing query', async () => {
      const res = await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should not add duplicate searches', async () => {
      await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: 'Manchester United',
        });

      const res = await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: 'manchester united',
        });

      const user = await User.findById(userId);
      expect(user.recentSearches).toHaveLength(1);
    });

    test('should limit searches to 20 entries', async () => {
      const user = await User.findById(userId);

      for (let i = 0; i < 25; i++) {
        user.recentSearches.push({
          query: `Search ${i}`,
          searchedAt: new Date(),
        });
      }
      await user.save();

      const res = await request(app)
        .post('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: 'New Search',
        });

      expect(res.body.data).toHaveLength(20);
    });

    test('should fail without token', async () => {
      const res = await request(app)
        .post('/api/recent-searches')
        .send({
          query: 'Manchester United',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/recent-searches', () => {
    beforeEach(async () => {
      const user = await User.findById(userId);
      user.recentSearches = [
        { query: 'Manchester United', searchedAt: new Date() },
        { query: 'Liverpool', searchedAt: new Date() },
      ];
      await user.save();
    });

    test('should clear all search history', async () => {
      const res = await request(app)
        .delete('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    test('should update user in database', async () => {
      await request(app)
        .delete('/api/recent-searches')
        .set('Authorization', `Bearer ${token}`);

      const user = await User.findById(userId);
      expect(user.recentSearches).toEqual([]);
    });

    test('should fail without token', async () => {
      const res = await request(app).delete('/api/recent-searches');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
