import api from './api'

export const authApi = {
    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', {
            currentPassword,
            newPassword
        })
        return response.data
    },
}

export default authApi
