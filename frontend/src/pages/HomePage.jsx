import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { sessionApi } from '../api/sessionApi'
import { deckApi } from '../api/deckApi'
import LoadingSpinner from '../components/LoadingSpinner'
import './HomePage.css'

function HomePage() {
    const { isAuthenticated } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [abandoningId, setAbandoningId] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef(null)

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Fetch unfinished timed sessions when authenticated
    const { data: unfinishedSessions, isLoading: sessionsLoading } = useQuery({
        queryKey: ['unfinished-sessions'],
        queryFn: () => sessionApi.getUnfinishedSessions(),
        enabled: isAuthenticated,
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    // Fetch user's own decks for authenticated users, public decks for non-authenticated
    const { data: recentDecks, isLoading: decksLoading } = useQuery({
        queryKey: ['decks', isAuthenticated ? 'my' : 'public'],
        queryFn: () => isAuthenticated ? deckApi.getMyDecks() : deckApi.getPublicDecks(),
    })

    // Search decks as user types
    const { data: searchResults, isLoading: searchLoading } = useQuery({
        queryKey: ['search-decks', debouncedSearch],
        queryFn: () => deckApi.searchDecks(debouncedSearch),
        enabled: debouncedSearch.length >= 2,
        staleTime: 30000,
    })

    // Abandon session mutation
    const abandonMutation = useMutation({
        mutationFn: (sessionId) => sessionApi.abandonSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries(['unfinished-sessions'])
            setAbandoningId(null)
        },
        onError: (err) => {
            console.error('Failed to abandon session:', err)
            setAbandoningId(null)
        },
    })

    const handleAbandon = (sessionId) => {
        if (window.confirm('Are you sure you want to abandon this session? Your progress will be lost.')) {
            setAbandoningId(sessionId)
            abandonMutation.mutate(sessionId)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setShowDropdown(false)
        if (searchQuery.trim()) {
            navigate(`/decks?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/decks')
        }
    }

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value)
        setShowDropdown(e.target.value.length >= 2)
    }

    const handleSelectDeck = (deckId) => {
        setShowDropdown(false)
        setSearchQuery('')
        navigate(`/decks/${deckId}`)
    }

    const formatTimeRemaining = (seconds) => {
        if (!seconds) return 'No limit'
        const mins = Math.floor(seconds / 60)
        return `${mins} min`
    }

    // Get the most recent decks (first 4)
    const displayDecks = recentDecks?.slice(0, 4) || []

    const hasUnfinishedSessions = !sessionsLoading && unfinishedSessions && unfinishedSessions.length > 0

    return (
        <div className="home-page">
            {/* Hero Section with Search */}
            <section className="hero">
                <div className="container hero-content">
                    <h1 className="hero-title">
                        Master Anything with <span className="text-gradient">Flashcards</span>
                    </h1>
                    <p className="hero-description">
                        Create, study, and master any subject with our intelligent flashcard system.
                    </p>

                    {/* Search Bar - Centered with Dropdown */}
                    <div className="search-wrapper" ref={searchRef}>
                        <form className="hero-search" onSubmit={handleSearch}>
                            <div className="search-container">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search decks..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                                />
                                <button type="submit" className="btn btn-primary">
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Search Dropdown */}
                        {showDropdown && (
                            <div className="search-dropdown">
                                {searchLoading && (
                                    <div className="search-dropdown-loading">
                                        Searching...
                                    </div>
                                )}
                                {!searchLoading && searchResults && searchResults.length > 0 && (
                                    <>
                                        {searchResults.slice(0, 6).map((deck) => (
                                            <div
                                                key={deck.id}
                                                className="search-dropdown-item"
                                                onClick={() => handleSelectDeck(deck.id)}
                                            >
                                                <div className="search-item-title">
                                                    {deck.title}
                                                    {deck.publicDeck && <span className="badge badge-sm">Public</span>}
                                                </div>
                                                <div className="search-item-meta">
                                                    <span className="search-item-author">by {deck.ownerUsername}</span>
                                                    <span className="search-item-cards">{deck.flashcardCount} cards</span>
                                                </div>
                                            </div>
                                        ))}
                                        {searchResults.length > 6 && (
                                            <div
                                                className="search-dropdown-more"
                                                onClick={handleSearch}
                                            >
                                                View all {searchResults.length} results →
                                            </div>
                                        )}
                                    </>
                                )}
                                {!searchLoading && searchResults && searchResults.length === 0 && (
                                    <div className="search-dropdown-empty">
                                        No decks found for "{debouncedSearch}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/decks/create" className="btn btn-secondary">
                                + Create Deck
                            </Link>
                        ) : (
                            <Link to="/register" className="btn btn-secondary">
                                Get Started Free
                            </Link>
                        )}
                    </div>
                </div>
                <div className="hero-glow"></div>
            </section>

            {/* Unfinished Sessions - Only show if there are sessions */}
            {hasUnfinishedSessions && (
                <section className="unfinished-sessions">
                    <div className="container">
                        <h2 className="section-title">
                            <span className="title-icon">⏱️</span>
                            Continue Your Sessions
                        </h2>
                        <div className="sessions-grid">
                            {unfinishedSessions.map((session) => (
                                <div key={session.sessionId} className="session-card">
                                    <div className="session-card-header">
                                        <h3 className="session-deck-title">{session.deckTitle}</h3>
                                        <span className="session-mode badge">{session.sessionMode || 'REGULAR'}</span>
                                    </div>
                                    <div className="session-card-body">
                                        <div className="session-stat">
                                            <span className="stat-label">Time</span>
                                            <span className="stat-value time">{formatTimeRemaining(session.timeLimitSeconds)}</span>
                                        </div>
                                        <div className="session-stat">
                                            <span className="stat-label">Cards</span>
                                            <span className="stat-value">{session.totalCards}</span>
                                        </div>
                                    </div>
                                    <div className="session-card-actions">
                                        <Link
                                            to={`/study/${session.deckId}?resume=${session.sessionId}`}
                                            className="btn btn-primary"
                                        >
                                            Resume
                                        </Link>
                                        <button
                                            className="btn btn-ghost btn-danger-text"
                                            onClick={() => handleAbandon(session.sessionId)}
                                            disabled={abandoningId === session.sessionId}
                                        >
                                            {abandoningId === session.sessionId ? '...' : 'Abandon'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Decks Section */}
            <section className="recent-decks">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">📚</span>
                            {isAuthenticated ? 'Your Recent Decks' : 'Popular Decks'}
                        </h2>
                        <Link to="/decks" className="btn btn-ghost">
                            View All →
                        </Link>
                    </div>

                    {decksLoading && <LoadingSpinner size="md" text="Loading decks..." />}

                    {!decksLoading && displayDecks.length === 0 && (
                        <div className="no-decks">
                            <p>No decks yet.</p>
                            {isAuthenticated && (
                                <Link to="/decks/create" className="btn btn-primary">
                                    Create Your First Deck
                                </Link>
                            )}
                        </div>
                    )}

                    {!decksLoading && displayDecks.length > 0 && (
                        <div className="decks-grid">
                            {displayDecks.map((deck) => (
                                <Link key={deck.id} to={`/decks/${deck.id}`} className="deck-card">
                                    <div className="deck-card-header">
                                        <h3 className="deck-title">{deck.title}</h3>
                                        {deck.publicDeck && <span className="badge badge-success">Public</span>}
                                    </div>
                                    <p className="deck-description">{deck.description || 'No description'}</p>
                                    <div className="deck-meta">
                                        <span>📇 {deck.flashcardCount || 0} cards</span>
                                        <span>👤 {deck.ownerUsername}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title text-center">Why Choose FlashcardWeb?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Multiple Study Modes</h3>
                            <p>Fill-in-the-blank, multiple choice, or review mode.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI-Powered Quizzes</h3>
                            <p>Smart multiple choice options for effective learning.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Track Progress</h3>
                            <p>See scores and track improvement over time.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌐</div>
                            <h3>Share & Discover</h3>
                            <p>Make decks public or browse community content.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Only for non-authenticated users */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-card">
                            <h2>Ready to Start Learning?</h2>
                            <p>Join thousands of learners mastering new skills every day.</p>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default HomePage
