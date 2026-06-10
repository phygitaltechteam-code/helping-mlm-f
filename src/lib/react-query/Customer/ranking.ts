

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

export function getCustomerRank(rank: string) {
  // Earning-based ranks (higher priority once earned)
  if (rank === 'Crown Ambassador')
    return { label: 'Crown Ambassador', type: 'text', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', glow: 'rgba(168,85,247,0.6)', textColor: '#fff', emoji: '👑🌟' };
  if (rank === 'Crown Diamond')
    return { label: 'Crown Diamond', type: 'text', gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6,#a5b4fc)', glow: 'rgba(59,130,246,0.6)', textColor: '#fff', emoji: '💎👑' };
  if (rank === 'Royal Diamond')
    return { label: 'Royal Diamond', type: 'text', gradient: 'linear-gradient(135deg,#134e4a,#0d9488,#5eead4)', glow: 'rgba(13,148,136,0.55)', textColor: '#fff', emoji: '💎🏆' };
  if (rank === 'Blue Diamond')
    return { label: 'Blue Diamond', type: 'text', gradient: 'linear-gradient(135deg,#1d4ed8,#60a5fa,#93c5fd)', glow: 'rgba(96,165,250,0.55)', textColor: '#fff', emoji: '🔷💎' };
  if (rank === 'Diamond')
    return { label: 'Diamond', type: 'text', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8,#e0f2fe)', glow: 'rgba(56,189,248,0.5)', textColor: '#0c4a6e', emoji: '💎' };
  if (rank === 'Emerald')
    return { label: 'Emerald', type: 'text', gradient: 'linear-gradient(135deg,#065f46,#10b981,#6ee7b7)', glow: 'rgba(16,185,129,0.5)', textColor: '#fff', emoji: '💚' };
  if (rank === 'Sapphire')
    return { label: 'Sapphire', type: 'text', gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb,#93c5fd)', glow: 'rgba(37,99,235,0.5)', textColor: '#fff', emoji: '💙' };
  if (rank === 'Ruby')
    return { label: 'Ruby', type: 'text', gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626,#fca5a5)', glow: 'rgba(220,38,38,0.5)', textColor: '#fff', emoji: '❤️‍🔥' };
  if (rank === 'Pearl')
    return { label: 'Pearl', type: 'text', gradient: 'linear-gradient(135deg,#e2e8f0,#cbd5e1,#f8fafc)', glow: 'rgba(203,213,225,0.6)', textColor: '#334155', emoji: '🤍' };
  if (rank === 'Platinum')
    return { label: 'Platinum', type: 'text', gradient: 'linear-gradient(135deg,#374151,#6b7280,#d1d5db)', glow: 'rgba(107,114,128,0.5)', textColor: '#fff', emoji: '🪨' };
  if (rank === 'Gold')
    return { label: 'Gold', type: 'text', gradient: 'linear-gradient(135deg,#92400e,#f59e0b,#fde68a)', glow: 'rgba(245,158,11,0.55)', textColor: '#78350f', emoji: '🥇' };
  if (rank === 'Silver')
    return { label: 'Silver', type: 'text', gradient: 'linear-gradient(135deg,#475569,#94a3b8,#e2e8f0)', glow: 'rgba(148,163,184,0.5)', textColor: '#1e293b', emoji: '🥈' };
  // Tree-based ranks
  if (rank === 'Double Star')
    return { label: 'Double Star', type: 'star', starCount: 2, gradient: 'linear-gradient(135deg,#78350f,#d97706,#fde68a)', glow: 'rgba(217,119,6,0.55)', textColor: '#78350f', emoji: '⭐⭐' };
  if (rank === 'Star')
    return { label: 'Star', type: 'star', starCount: 1, gradient: 'linear-gradient(135deg,#b45309,#f59e0b,#fef3c7)', glow: 'rgba(245,158,11,0.45)', textColor: '#92400e', emoji: '⭐' };
  // No rank yet
  return { label: 'Member', type: 'text', gradient: 'linear-gradient(135deg,#374151,#6b7280,#d1d5db)', glow: 'rgba(107,114,128,0.3)', textColor: '#fff', emoji: '👤' };
}

/**
 * Returns a styled badge string for table display (JSX).
 * Use this in table Cell renderers.
 */
export function getRankLabel(rank: string): string {
  const rankInfo = getCustomerRank(rank);
  if (rankInfo.emoji) return `${rankInfo.emoji} ${rankInfo.label}`;
  return rankInfo.label;
}
