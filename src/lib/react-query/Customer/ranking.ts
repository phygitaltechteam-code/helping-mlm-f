

const LAKH = 100_000;
const CRORE = 10_000_000;

export type Rank = {
  label: string;
  type: 'star' | 'text';
  starCount?: number;
  gradient: string;
  glow: string;
  textColor: string;
  emoji?: string;
};

export function getCustomerRank(directTeam: number, totalEarning: number): Rank {
  // Earning-based ranks (higher priority once earned)
  if (totalEarning >= 5 * CRORE)
    return { label: 'Crown Ambassador', type: 'text', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', glow: 'rgba(168,85,247,0.6)', textColor: '#fff', emoji: '👑🌟' };
  if (totalEarning >= 4 * CRORE)
    return { label: 'Crown Diamond', type: 'text', gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6,#a5b4fc)', glow: 'rgba(59,130,246,0.6)', textColor: '#fff', emoji: '💎👑' };
  if (totalEarning >= 3 * CRORE)
    return { label: 'Royal Diamond', type: 'text', gradient: 'linear-gradient(135deg,#134e4a,#0d9488,#5eead4)', glow: 'rgba(13,148,136,0.55)', textColor: '#fff', emoji: '💎🏆' };
  if (totalEarning >= 2 * CRORE)
    return { label: 'Blue Diamond', type: 'text', gradient: 'linear-gradient(135deg,#1d4ed8,#60a5fa,#93c5fd)', glow: 'rgba(96,165,250,0.55)', textColor: '#fff', emoji: '🔷💎' };
  if (totalEarning >= 1 * CRORE)
    return { label: 'Diamond', type: 'text', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8,#e0f2fe)', glow: 'rgba(56,189,248,0.5)', textColor: '#0c4a6e', emoji: '💎' };
  if (totalEarning >= 75 * LAKH)
    return { label: 'Emerald', type: 'text', gradient: 'linear-gradient(135deg,#065f46,#10b981,#6ee7b7)', glow: 'rgba(16,185,129,0.5)', textColor: '#fff', emoji: '💚' };
  if (totalEarning >= 50 * LAKH)
    return { label: 'Sapphire', type: 'text', gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb,#93c5fd)', glow: 'rgba(37,99,235,0.5)', textColor: '#fff', emoji: '💙' };
  if (totalEarning >= 25 * LAKH)
    return { label: 'Ruby', type: 'text', gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626,#fca5a5)', glow: 'rgba(220,38,38,0.5)', textColor: '#fff', emoji: '❤️‍🔥' };
  if (totalEarning >= 15 * LAKH)
    return { label: 'Pearl', type: 'text', gradient: 'linear-gradient(135deg,#e2e8f0,#cbd5e1,#f8fafc)', glow: 'rgba(203,213,225,0.6)', textColor: '#334155', emoji: '🤍' };
  if (totalEarning >= 10 * LAKH)
    return { label: 'Platinum', type: 'text', gradient: 'linear-gradient(135deg,#374151,#6b7280,#d1d5db)', glow: 'rgba(107,114,128,0.5)', textColor: '#fff', emoji: '🪨' };
  if (totalEarning >= 5 * LAKH)
    return { label: 'Gold', type: 'text', gradient: 'linear-gradient(135deg,#92400e,#f59e0b,#fde68a)', glow: 'rgba(245,158,11,0.55)', textColor: '#78350f', emoji: '🥇' };
  if (totalEarning >= 1 * LAKH)
    return { label: 'Silver', type: 'text', gradient: 'linear-gradient(135deg,#475569,#94a3b8,#e2e8f0)', glow: 'rgba(148,163,184,0.5)', textColor: '#1e293b', emoji: '🥈' };
  // Tree-based ranks
  if (directTeam >= 25)
    return { label: 'Double Star', type: 'star', starCount: 2, gradient: 'linear-gradient(135deg,#78350f,#d97706,#fde68a)', glow: 'rgba(217,119,6,0.55)', textColor: '#78350f', emoji: '⭐⭐' };
  if (directTeam >= 5)
    return { label: 'Star', type: 'star', starCount: 1, gradient: 'linear-gradient(135deg,#b45309,#f59e0b,#fef3c7)', glow: 'rgba(245,158,11,0.45)', textColor: '#92400e', emoji: '⭐' };
  // No rank yet
  return { label: 'Member', type: 'text', gradient: 'linear-gradient(135deg,#374151,#6b7280,#d1d5db)', glow: 'rgba(107,114,128,0.3)', textColor: '#fff', emoji: '👤' };
}

/**
 * Returns a styled badge string for table display (JSX).
 * Use this in table Cell renderers.
 */
export function getRankLabel(directTeam: number, totalEarning: number): string {
  const rank = getCustomerRank(directTeam, totalEarning);
  if (rank.emoji) return `${rank.emoji} ${rank.label}`;
  return rank.label;
}