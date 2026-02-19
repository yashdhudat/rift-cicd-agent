export function generateBranchName(team, leader) {
  const clean = (str) =>
    str.toUpperCase().trim().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
  return `${clean(team)}_${clean(leader)}_AI_Fix`
}

export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

export function formatTimestamp(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour12: false })
}

export function calcScore(commits, timeTakenMs) {
  const base = 100
  const speedBonus = timeTakenMs < 5 * 60 * 1000 ? 10 : 0
  const over = Math.max(0, commits - 20)
  const penalty = over * 2
  return { base, speedBonus, penalty, total: base + speedBonus - penalty, commits }
}