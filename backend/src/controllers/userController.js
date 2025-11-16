import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.',
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, profilePicture } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Validation
    if (firstName && firstName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name must be at least 2 characters long.',
      });
    }

    if (lastName && lastName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Last name must be at least 2 characters long.',
      });
    }

    if (firstName && firstName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'First name cannot exceed 50 characters.',
      });
    }

    if (lastName && lastName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Last name cannot exceed 50 characters.',
      });
    }

    // Email validation
    if (email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      // Check if email is already used by another user
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email is already in use.',
        });
      }
    }

    // Track changes
    const changes = [];

    if (firstName && firstName.trim() !== user.firstName) {
      changes.push({
        fieldName: 'firstName',
        oldValue: user.firstName,
        newValue: firstName.trim(),
        changedAt: new Date(),
        canRevert: true,
      });
      user.firstName = firstName.trim();
    }

    if (lastName && lastName.trim() !== user.lastName) {
      changes.push({
        fieldName: 'lastName',
        oldValue: user.lastName,
        newValue: lastName.trim(),
        changedAt: new Date(),
        canRevert: true,
      });
      user.lastName = lastName.trim();
    }

    if (email && email.toLowerCase() !== user.email) {
      changes.push({
        fieldName: 'email',
        oldValue: user.email,
        newValue: email.toLowerCase(),
        changedAt: new Date(),
        canRevert: true,
      });
      user.email = email.toLowerCase();
    }

    if (profilePicture !== undefined && profilePicture !== user.profilePicture) {
      changes.push({
        fieldName: 'profilePicture',
        oldValue: user.profilePicture || 'none',
        newValue: profilePicture || 'none',
        changedAt: new Date(),
        canRevert: true,
      });
      user.profilePicture = profilePicture;
    }

    // Add changes to history
    if (changes.length > 0) {
      user.changeHistory = [...user.changeHistory, ...changes];
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: user,
      changes: changes,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};

export const getChangeHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('changeHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Filter out changes older than 24 hours for revert functionality
    const now = new Date();
    const history = user.changeHistory.map((change) => {
      const changedAt = new Date(change.changedAt);
      const hoursAgo = (now - changedAt) / (1000 * 60 * 60);
      return {
        ...change,
        canRevert: hoursAgo < 24,
        hoursAgo: Math.floor(hoursAgo),
      };
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get change history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch change history.',
    });
  }
};

export const revertProfileChange = async (req, res) => {
  try {
    const { changeId } = req.body;

    if (!changeId) {
      return res.status(400).json({
        success: false,
        message: 'Change ID is required.',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Find the change
    const changeIndex = user.changeHistory.findIndex(
      (c) => c._id.toString() === changeId
    );

    if (changeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Change not found.',
      });
    }

    const change = user.changeHistory[changeIndex];

    // Check if change can be reverted (within 24 hours)
    const now = new Date();
    const changedAt = new Date(change.changedAt);
    const hoursAgo = (now - changedAt) / (1000 * 60 * 60);

    if (hoursAgo >= 24) {
      return res.status(400).json({
        success: false,
        message: 'This change cannot be reverted (24-hour window expired).',
      });
    }

    // Revert the change
    user[change.fieldName] = change.oldValue;

    // Mark as reverted
    change.canRevert = false;

    // Add revert entry to history
    user.changeHistory.push({
      fieldName: change.fieldName,
      oldValue: change.newValue,
      newValue: change.oldValue,
      changedAt: new Date(),
      canRevert: true,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Change reverted successfully!',
      data: user,
    });
  } catch (error) {
    console.error('Revert change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to revert change.',
    });
  }
};
