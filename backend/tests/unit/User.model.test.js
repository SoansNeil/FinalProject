import User from '../../src/models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).not.toBe('password123'); // Should be hashed
      expect(user.favoriteTeams).toEqual([]);
      expect(user.recentSearches).toEqual([]);
    });

    test('should fail without required fields', async () => {
      await expect(
        User.create({
          firstName: 'John',
          // Missing lastName, email, password
        })
      ).rejects.toThrow();
    });

    test('should fail with invalid email', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow();
    });

    test('should fail with short password', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: '123',
        })
      ).rejects.toThrow();
    });

    test('should enforce email uniqueness', async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      await expect(
        User.create({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('Password Methods', () => {
    test('should hash password before saving', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      expect(userWithPassword.password).not.toBe('password123');
    });

    test('should compare password correctly', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await userWithPassword.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Favorite Teams', () => {
    test('should add favorite team', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      user.favoriteTeams.push({
        teamId: 'team1',
        teamName: 'Team One',
        addedAt: new Date(),
      });
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.favoriteTeams).toHaveLength(1);
      expect(updatedUser.favoriteTeams[0].teamName).toBe('Team One');
    });

    test('should handle multiple favorite teams', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      user.favoriteTeams = [
        { teamId: 'team1', teamName: 'Team One', addedAt: new Date() },
        { teamId: 'team2', teamName: 'Team Two', addedAt: new Date() },
      ];
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.favoriteTeams).toHaveLength(2);
    });
  });

  describe('Recent Searches', () => {
    test('should add search to history', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      user.recentSearches.push({
        query: 'Manchester United',
        searchedAt: new Date(),
      });
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.recentSearches).toHaveLength(1);
      expect(updatedUser.recentSearches[0].query).toBe('Manchester United');
    });

    test('should handle multiple searches', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      user.recentSearches = [
        { query: 'Manchester United', searchedAt: new Date() },
        { query: 'Liverpool', searchedAt: new Date() },
        { query: 'Arsenal', searchedAt: new Date() },
      ];
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.recentSearches).toHaveLength(3);
    });
  });

  describe('User Serialization', () => {
    test('toJSON should exclude password', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const jsonUser = user.toJSON();
      expect(jsonUser.password).toBeUndefined();
      expect(jsonUser.firstName).toBe('John');
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt and updatedAt', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });
  });
});
