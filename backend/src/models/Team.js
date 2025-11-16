import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    league: { type: String, default: 'Unknown' },
    founded: { type: Number, default: null },
    logo: { type: String, default: null },
    stadium: { type: String, default: null },
    description: { type: String, default: null },
    recentPerformance: {
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Index for location queries
teamSchema.index({ country: 1, region: 1 });
teamSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model('Team', teamSchema);
