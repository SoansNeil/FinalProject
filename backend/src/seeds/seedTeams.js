import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team.js';

dotenv.config();

const seedTeams = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/soccer-teams-mapper'
    );

    // Clear existing teams
    await Team.deleteMany({});

    // Sample teams from different regions
    const teams = [
      // Europe
      {
        teamId: 'man-utd',
        teamName: 'Manchester United',
        country: 'England',
        region: 'Europe',
        latitude: 53.4631,
        longitude: -2.2913,
        league: 'Premier League',
        founded: 1878,
        stadium: 'Old Trafford',
        recentPerformance: { wins: 18, draws: 5, losses: 7, goals: 67, goalsAgainst: 38 },
      },
      {
        teamId: 'liverpool',
        teamName: 'Liverpool FC',
        country: 'England',
        region: 'Europe',
        latitude: 53.431,
        longitude: -2.9608,
        league: 'Premier League',
        founded: 1892,
        stadium: 'Anfield',
        recentPerformance: { wins: 20, draws: 4, losses: 6, goals: 72, goalsAgainst: 35 },
      },
      {
        teamId: 'real-madrid',
        teamName: 'Real Madrid',
        country: 'Spain',
        region: 'Europe',
        latitude: 40.4531,
        longitude: -3.6883,
        league: 'La Liga',
        founded: 1902,
        stadium: 'Santiago Bernabéu',
        recentPerformance: { wins: 22, draws: 3, losses: 5, goals: 78, goalsAgainst: 28 },
      },
      {
        teamId: 'barcelona',
        teamName: 'FC Barcelona',
        country: 'Spain',
        region: 'Europe',
        latitude: 41.3815,
        longitude: 2.122,
        league: 'La Liga',
        founded: 1899,
        stadium: 'Camp Nou',
        recentPerformance: { wins: 19, draws: 5, losses: 6, goals: 70, goalsAgainst: 32 },
      },
      {
        teamId: 'psg',
        teamName: 'Paris Saint-Germain',
        country: 'France',
        region: 'Europe',
        latitude: 48.8416,
        longitude: 2.4534,
        league: 'Ligue 1',
        founded: 1970,
        stadium: 'Parc des Princes',
        recentPerformance: { wins: 21, draws: 4, losses: 5, goals: 75, goalsAgainst: 30 },
      },
      {
        teamId: 'juventus',
        teamName: 'Juventus',
        country: 'Italy',
        region: 'Europe',
        latitude: 45.1095,
        longitude: 7.6385,
        league: 'Serie A',
        founded: 1897,
        stadium: 'Allianz Stadium',
        recentPerformance: { wins: 18, draws: 6, losses: 6, goals: 65, goalsAgainst: 34 },
      },
      {
        teamId: 'bayern-munich',
        teamName: 'Bayern Munich',
        country: 'Germany',
        region: 'Europe',
        latitude: 48.2188,
        longitude: 11.6247,
        league: 'Bundesliga',
        founded: 1900,
        stadium: 'Allianz Arena',
        recentPerformance: { wins: 23, draws: 2, losses: 5, goals: 82, goalsAgainst: 25 },
      },

      // South America
      {
        teamId: 'flamengo',
        teamName: 'Flamengo',
        country: 'Brazil',
        region: 'South America',
        latitude: -22.9068,
        longitude: -43.1729,
        league: 'Campeonato Brasileiro',
        founded: 1895,
        stadium: 'Estádio Nilton Santos',
        recentPerformance: { wins: 20, draws: 5, losses: 5, goals: 68, goalsAgainst: 32 },
      },
      {
        teamId: 'santos',
        teamName: 'Santos FC',
        country: 'Brazil',
        region: 'South America',
        latitude: -23.9625,
        longitude: -46.2637,
        league: 'Campeonato Brasileiro',
        founded: 1912,
        stadium: 'Vila Belmiro',
        recentPerformance: { wins: 17, draws: 6, losses: 7, goals: 60, goalsAgainst: 38 },
      },
      {
        teamId: 'boca-juniors',
        teamName: 'Boca Juniors',
        country: 'Argentina',
        region: 'South America',
        latitude: -34.6349,
        longitude: -58.2647,
        league: 'Primera División',
        founded: 1905,
        stadium: 'La Bombonera',
        recentPerformance: { wins: 19, draws: 4, losses: 7, goals: 66, goalsAgainst: 35 },
      },
      {
        teamId: 'river-plate',
        teamName: 'River Plate',
        country: 'Argentina',
        region: 'South America',
        latitude: -34.6026,
        longitude: -58.4594,
        league: 'Primera División',
        founded: 1901,
        stadium: 'Monumental Stadium',
        recentPerformance: { wins: 21, draws: 3, losses: 6, goals: 74, goalsAgainst: 30 },
      },

      // Asia
      {
        teamId: 'al-hilal',
        teamName: 'Al-Hilal',
        country: 'Saudi Arabia',
        region: 'Asia',
        latitude: 24.7928,
        longitude: 46.6753,
        league: 'Saudi Pro League',
        founded: 1957,
        stadium: 'King Fahd Stadium',
        recentPerformance: { wins: 22, draws: 2, losses: 6, goals: 79, goalsAgainst: 28 },
      },
      {
        teamId: 'manchester-city-asia',
        teamName: 'Manchester City Asia',
        country: 'China',
        region: 'Asia',
        latitude: 39.9042,
        longitude: 116.4074,
        league: 'Chinese Super League',
        founded: 2020,
        stadium: 'Beijing Stadium',
        recentPerformance: { wins: 16, draws: 5, losses: 9, goals: 55, goalsAgainst: 42 },
      },
      {
        teamId: 'tokyo-fc',
        teamName: 'FC Tokyo',
        country: 'Japan',
        region: 'Asia',
        latitude: 35.6762,
        longitude: 139.7674,
        league: 'J-League',
        founded: 1991,
        stadium: 'Tokyo Stadium',
        recentPerformance: { wins: 15, draws: 7, losses: 8, goals: 52, goalsAgainst: 40 },
      },

      // Africa
      {
        teamId: 'kaizer-chiefs',
        teamName: 'Kaizer Chiefs',
        country: 'South Africa',
        region: 'Africa',
        latitude: -26.2023,
        longitude: 28.0397,
        league: 'Premier Soccer League',
        founded: 1970,
        stadium: 'FNB Stadium',
        recentPerformance: { wins: 16, draws: 6, losses: 8, goals: 54, goalsAgainst: 36 },
      },
      {
        teamId: 'al-ahly',
        teamName: 'Al Ahly',
        country: 'Egypt',
        region: 'Africa',
        latitude: 30.0444,
        longitude: 31.2357,
        league: 'Egyptian Premier League',
        founded: 1924,
        stadium: 'Cairo International Stadium',
        recentPerformance: { wins: 20, draws: 4, losses: 6, goals: 70, goalsAgainst: 32 },
      },

      // North America
      {
        teamId: 'la-galaxy',
        teamName: 'LA Galaxy',
        country: 'USA',
        region: 'North America',
        latitude: 34.0195,
        longitude: -118.2519,
        league: 'MLS',
        founded: 1994,
        stadium: 'Dignity Health Sports Park',
        recentPerformance: { wins: 14, draws: 8, losses: 8, goals: 48, goalsAgainst: 40 },
      },
      {
        teamId: 'toronto-fc',
        teamName: 'Toronto FC',
        country: 'Canada',
        region: 'North America',
        latitude: 43.6632,
        longitude: -79.3957,
        league: 'MLS',
        founded: 2006,
        stadium: 'BMO Field',
        recentPerformance: { wins: 13, draws: 7, losses: 10, goals: 45, goalsAgainst: 42 },
      },
    ];

    await Team.insertMany(teams);
    console.log('✅ Teams seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding teams:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedTeams();
