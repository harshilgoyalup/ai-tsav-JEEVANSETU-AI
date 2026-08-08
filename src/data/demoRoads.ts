// FloodGuard AI — Demo Data: Blocked Roads

import type { BlockedRoad } from '../types';

export const demoBlockedRoads: BlockedRoad[] = [
  { id: 'br-01', road_name: 'Ferozepur Road (near Clock Tower)', latitude: 30.8955, longitude: 75.8430, severity: 'CRITICAL', status: 'CONFIRMED', reported_at: new Date(Date.now() - 3600000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-02', road_name: 'GT Road (Jagraon Bridge)', latitude: 30.9060, longitude: 75.8350, severity: 'CRITICAL', status: 'CONFIRMED', reported_at: new Date(Date.now() - 7200000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-03', road_name: 'Pakhowal Road Underpass', latitude: 30.8910, longitude: 75.8260, severity: 'HIGH', status: 'CONFIRMED', reported_at: new Date(Date.now() - 5400000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-04', road_name: 'Dugri Phase-II Road', latitude: 30.8760, longitude: 75.8370, severity: 'HIGH', status: 'CONFIRMED', reported_at: new Date(Date.now() - 1800000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-05', road_name: 'Gill Road (South)', latitude: 30.8830, longitude: 75.8480, severity: 'HIGH', status: 'REPORTED', reported_at: new Date(Date.now() - 900000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-06', road_name: 'BRS Nagar Main Road', latitude: 30.8860, longitude: 75.8880, severity: 'MEDIUM', status: 'CONFIRMED', reported_at: new Date(Date.now() - 4500000).toISOString(), source: 'SIMULATED' },
  { id: 'br-07', road_name: 'Haibowal Kalan Road', latitude: 30.9260, longitude: 75.8340, severity: 'MEDIUM', status: 'REPORTED', reported_at: new Date(Date.now() - 2700000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-08', road_name: 'Sherpur Chowk', latitude: 30.9340, longitude: 75.8470, severity: 'LOW', status: 'REPORTED', reported_at: new Date(Date.now() - 600000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-09', road_name: 'Jamalpur Colony Road', latitude: 30.9090, longitude: 75.8160, severity: 'HIGH', status: 'CONFIRMED', reported_at: new Date(Date.now() - 3000000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-10', road_name: 'Shimlapuri Bypass', latitude: 30.9310, longitude: 75.8610, severity: 'MEDIUM', status: 'REPORTED', reported_at: new Date(Date.now() - 1200000).toISOString(), source: 'SIMULATED' },
  { id: 'br-11', road_name: 'Civil Lines Crossing', latitude: 30.9130, longitude: 75.8540, severity: 'HIGH', status: 'CONFIRMED', reported_at: new Date(Date.now() - 6000000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-12', road_name: 'Model Town Extension Road', latitude: 30.9190, longitude: 75.8690, severity: 'LOW', status: 'REPORTED', reported_at: new Date(Date.now() - 300000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-13', road_name: 'Focal Point Road-4', latitude: 30.8810, longitude: 75.8290, severity: 'CRITICAL', status: 'CONFIRMED', reported_at: new Date(Date.now() - 4800000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-14', road_name: 'Giaspura Industrial Link', latitude: 30.8670, longitude: 75.8660, severity: 'MEDIUM', status: 'CONFIRMED', reported_at: new Date(Date.now() - 2100000).toISOString(), source: 'SIMULATED' },
  { id: 'br-15', road_name: 'Ludhiana-Chandigarh Road', latitude: 30.9380, longitude: 75.8520, severity: 'LOW', status: 'REPORTED', reported_at: new Date(Date.now() - 150000).toISOString(), source: 'USER_REPORTED' },
  { id: 'br-16', road_name: 'Sarabha Nagar Market Road', latitude: 30.9040, longitude: 75.8790, severity: 'LOW', status: 'CLEARED', reported_at: new Date(Date.now() - 8000000).toISOString(), source: 'CONFIRMED' },
  { id: 'br-17', road_name: 'Ferozepur Road (South End)', latitude: 30.8880, longitude: 75.8400, severity: 'HIGH', status: 'CONFIRMED', reported_at: new Date(Date.now() - 3300000).toISOString(), source: 'USER_REPORTED' },
];
