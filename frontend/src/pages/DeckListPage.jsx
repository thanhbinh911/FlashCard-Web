import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { deckApi } from '../api/deckApi'
import { useAuth } from '../context/AuthContext'
import DeckCard from '../components/DeckCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './DeckListPage.css'

function DeckListPage() {
    const { isAuthenticated } = useAuth()
    const [searchParams] = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [searchKeyword, setSearchKeyword] = useState(initialSearch)
    const [debouncedKeyword, setDebouncedKeyword] = useState(initialSearch)

    // Update search when URL params change
    useEffect(() => {
        const urlSearch = searchParams.get('search') || ''
        setSearchKeyword(urlSearch)
        setDebouncedKeyword(urlSearch)
    }, [searchParams])

    // Debounce search
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchKeyword(value)

        // Simple debounce
        clearTimeout(window.searchTimeout)
        window.searchTimeout = setTimeout(() => {
            setDebouncedKeyword(value)
        }, 300)
    }

    // Fetch decks with React Query
    const { data: decks, isLoading, error } = useQuery({
        queryKey: ['decks', isAuthenticated, debouncedKeyword],
        queryFn: () => debouncedKeyword
            ? deckApi.searchDecks(debouncedKeyword)
            : deckApi.getDecks(),
    })

    return (
        <div className="deck-list-page page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Explore Decks</h1>
                        <p>Browse and study from our collection of flashcard decks</p>
                    </div>
                </div>

                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search decks by title or description..."
                        value={searchKeyword}
                        onChange={handleSearchChange}
                    />
                </div>

                {isLoading && (
                    <LoadingSpinner size="lg" text="Loading decks..." />
                )}

                {error && (
                    <div className="alert alert-error">
                        Failed to load decks. Please try again.
                    </div>
                )}

                {decks && decks.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">📚</span>
                        <h3>No decks found</h3>
                        <p>
                            {debouncedKeyword
                                ? `No decks match "${debouncedKeyword}". Try a different search.`
                                : 'Be the first to create a deck!'}
                        </p>
                    </div>
                )}

                {decks && decks.length > 0 && (
                    <div className="deck-grid">
                        {decks.map(deck => (
                            <DeckCard key={deck.id} deck={deck} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeckListPage
