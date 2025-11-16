import Team from '../models/Team.js';

export const getTeamsForMap = async (req, res) => {
  try {
    const teams = await Team.find({}).select(
      'teamId teamName country region latitude longitude league logo'
    );

    if (!teams || teams.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No teams found',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Get teams for map error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teams for map.',
    });
  }
};

export const getTeamsByRegion = async (req, res) => {
  try {
    const { country, region } = req.query;

    let query = {};
    if (country) {
      query.country = country;
    }
    if (region) {
      query.region = region;
    }

    const teams = await Team.find(query);

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Get teams by region error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teams by region.',
    });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({ teamId });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Get team by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team.',
    });
  }
};

export const getAllRegions = async (req, res) => {
  try {
    const regions = await Team.aggregate([
      {
        $group: {
          _id: {
            country: '$country',
            region: '$region',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.country': 1,
          '_id.region': 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error('Get all regions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch regions.',
    });
  }
};
