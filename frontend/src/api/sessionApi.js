import api from './api'

export const sessionApi = {
    // Start new study session
    startSession: async (sessionData) => {
        const response = await api.post('/sessions/start', sessionData)
        return response.data
    },

    // Resume existing session
    resumeSession: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/resume`)
        return response.data
    },

    // Get active session (if any)
    getActiveSession: async () => {
        const response = await api.get('/sessions/active')
        return response.data
    },

    // Get session questions
    getSessionQuestions: async (sessionId) => {
        const response = await api.get(`/sessions/${sessionId}/questions`)
        return response.data
    },

    // Save progress (remaining time)
    saveProgress: async (sessionId, remainingSeconds) => {
        const response = await api.post(`/sessions/${sessionId}/save-progress`, {
            remainingSeconds
        })
        return response.data
    },

    // Finish session with answers
    finishSession: async (sessionId, answers) => {
        const response = await api.post(`/sessions/${sessionId}/finish`, { answers })
        return response.data
    },

    // Abandon session
    abandonSession: async (sessionId) => {
        const response = await api.delete(`/sessions/${sessionId}/abandon`)
        return response.data
    },

    // Get session summary (results)
    getSessionSummary: async (sessionId) => {
        const response = await api.get(`/sessions/${sessionId}/summary`)
        return response.data
    },

    // Get all unfinished timed sessions (non-practice mode)
    getUnfinishedSessions: async () => {
        const response = await api.get('/sessions/unfinished')
        return response.data
    },
}

export default sessionApi
