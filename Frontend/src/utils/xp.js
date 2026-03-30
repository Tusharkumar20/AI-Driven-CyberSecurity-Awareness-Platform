import { auth } from '../config/firebase'

export const awardXP = async (amount) => {
  try {
    const token = await auth.currentUser.getIdToken(true)
    const res = await fetch('http://localhost:3000/api/profile/xp', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ xp: amount })
    })
    const data = await res.json()
    return data.xp
  } catch (err) {
    console.error('Failed to award XP:', err)
  }
}