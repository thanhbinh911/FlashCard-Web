import api from './api'

export const flashcardApi = {
    // Get all flashcards in a deck
    getFlashcards: async (deckId) => {
        const response = await api.get(`/decks/${deckId}/flashcards`)
        return response.data
    },

    // Get single flashcard
    getFlashcard: async (deckId, flashcardId) => {
        const response = await api.get(`/decks/${deckId}/flashcards/${flashcardId}`)
        return response.data
    },

    // Create new flashcard
    createFlashcard: async (deckId, flashcardData) => {
        const response = await api.post(`/decks/${deckId}/flashcards`, flashcardData)
        return response.data
    },

    // Update flashcard
    updateFlashcard: async (deckId, flashcardId, flashcardData) => {
        const response = await api.put(
            `/decks/${deckId}/flashcards/${flashcardId}`,
            flashcardData
        )
        return response.data
    },

    // Delete flashcard
    deleteFlashcard: async (deckId, flashcardId) => {
        const response = await api.delete(`/decks/${deckId}/flashcards/${flashcardId}`)
        return response.data
    },
}

export default flashcardApi
