
const USERS_KEY = 'medicareUsers'
const CURRENT_USER_KEY = 'medicareCurrentUser'

// Get all registered users

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

// Register new user

export const registerUser = (userData) => {

  const users = getUsers()

  // Check duplicate email

  const existingUser = users.find(
    user => user.email.toLowerCase() === userData.email.toLowerCase()
  )

  if (existingUser) {
    throw new Error('Email is already registered.')
  }

  const newUser = {
    id: crypto.randomUUID(),
    ...userData,
    role: userData.role,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)

  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return newUser
}

// Login user

export const loginUser = (email, password, role) => {

  const users = getUsers()

  const user = users.find(
    item =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password &&
      item.role === role
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const { password: savedPassword, ...safeUser } = user

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(safeUser)
  )

  return safeUser
}

// Get currently logged-in user

export const getCurrentUser = () => {
  return JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY) || 'null'
  )
}

// Logout

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
}
