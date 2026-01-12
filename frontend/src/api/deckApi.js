import api from './api'

export const deckApi = {
    // Get all decks (public + user's own if authenticated)
    getDecks: async () => {
        const response = await api.get('/decks')
        return response.data
    },

    // Get only public decks (for non-authenticated users / popular decks section)
    getPublicDecks: async () => {
        const response = await api.get('/decks/public')
        return response.data
    },

    // Get only the current user's decks
    getMyDecks: async () => {
        const response = await api.get('/decks/my')
        return response.data
    },

    // Search decks by keyword
    searchDecks: async (keyword) => {
        const response = await api.get('/decks/search', {
            params: { keyword }
        })
        return response.data
    },

    // Get single deck by ID
    getDeck: async (deckId) => {
        const response = await api.get(`/decks/${deckId}`)
        return response.data
    },

    // Create new deck with flashcards
    createDeck: async (deckData) => {
        const response = await api.post('/decks', deckData)
        return response.data
    },

    // Update deck
    updateDeck: async (deckId, deckData) => {
        const response = await api.put(`/decks/${deckId}`, deckData)
        return response.data
    },

    // Delete deck
    deleteDeck: async (deckId) => {
        const response = await api.delete(`/decks/${deckId}`)
        return response.data
    },

    // Update deck visibility only
    updateVisibility: async (deckId, publicDeck) => {
        const response = await api.patch(`/decks/${deckId}/visibility`, { publicDeck })
        return response.data
    },
}

export default deckApi
