// FloodGuard AI — Demo Data: Alerts
// ALL data is SIMULATED for demonstration purposes.

import type { Alert } from '../types';

export const demoAlerts: Alert[] = [
  {
    id: 'alert-01',
    zone_id: 'zone-b07',
    severity: 'CRITICAL',
    target_audience: ['Residents', 'Hospitals', 'Rescue Teams'],
    message: 'CRITICAL FLOOD WARNING — Zone B-07 (Ferozepur Road). Flood risk at 89%. Avoid low-lying roads. Emergency teams maintaining access to DMC Hospital. Residents advised to move to higher ground.',
    status: 'DISPATCHED',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'alert-02',
    zone_id: 'zone-a03',
    severity: 'WARNING',
    target_audience: ['Residents', 'Schools'],
    message: 'FLOOD WARNING — Zone A-03 (Civil Lines). Risk level HIGH at 72%. Schools advised to prepare evacuation protocols. Avoid unnecessary travel.',
    status: 'DISPATCHED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert-03',
    zone_id: 'zone-g09',
    severity: 'WARNING',
    target_audience: ['Residents', 'Traffic Authorities'],
    message: 'FLOOD WARNING — Zone G-09 (BRS Nagar). Multiple roads affected. Traffic authorities rerouting vehicles. Residents should stay indoors.',
    status: 'DISPATCHED',
    created_at: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'alert-04',
    zone_id: 'zone-c04',
    severity: 'WARNING',
    target_audience: ['Residents'],
    message: 'FLOOD WATCH — Zone C-04 (Dugri). Water levels rising steadily. Residents in low-lying areas should prepare for possible evacuation.',
    status: 'DISPATCHED',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'alert-05',
    zone_id: 'zone-e02',
    severity: 'WATCH',
    target_audience: ['Residents'],
    message: 'FLOOD WATCH — Zone E-02 (Model Town). Moderate rainfall continuing. No immediate danger but situation being monitored.',
    status: 'DISPATCHED',
    created_at: new Date(Date.now() - 9000000).toISOString(),
  },
];
