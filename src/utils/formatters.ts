// FloodGuard AI — Utility Formatters

import type { RiskLevel } from '../types';

/**
 * Format a date as relative time (e.g., "2 min ago").
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Format time as HH:MM AM/PM.
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a number with comma separators.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

/**
 * Get color classes for a risk level.
 */
export function riskColorClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'text-green-400';
    case 'MEDIUM': return 'text-amber-400';
    case 'HIGH': return 'text-orange-400';
    case 'CRITICAL': return 'text-red-400';
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-500/15 border-green-500/30';
    case 'MEDIUM': return 'bg-amber-500/15 border-amber-500/30';
    case 'HIGH': return 'bg-orange-500/15 border-orange-500/30';
    case 'CRITICAL': return 'bg-red-500/15 border-red-500/30';
  }
}

export function riskDotClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-400';
    case 'MEDIUM': return 'bg-amber-400';
    case 'HIGH': return 'bg-orange-400';
    case 'CRITICAL': return 'bg-red-400';
  }
}

export function severityLabel(level: string): string {
  switch (level) {
    case 'CRITICAL': return '🔴 CRITICAL';
    case 'HIGH': return '🟠 HIGH';
    case 'WARNING': return '🟠 WARNING';
    case 'MEDIUM': return '🟡 MEDIUM';
    case 'WATCH': return '🟡 WATCH';
    case 'LOW': return '🟢 LOW';
    case 'RESOLVED': return '✅ RESOLVED';
    default: return level;
  }
}
