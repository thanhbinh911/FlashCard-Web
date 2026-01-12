import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DeckListPage from './pages/DeckListPage'
import DeckDetailPage from './pages/DeckDetailPage'
import StudyPage from './pages/StudyPage'
import ResultsPage from './pages/ResultsPage'
import CreateDeckPage from './pages/CreateDeckPage'

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/decks" element={<DeckListPage />} />
                    <Route path="/decks/:deckId" element={<DeckDetailPage />} />

                    {/* Protected Routes */}
                    <Route path="/decks/create" element={
                        <ProtectedRoute>
                            <CreateDeckPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/study/:deckId" element={
                        <ProtectedRoute>
                            <StudyPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/results/:sessionId" element={
                        <ProtectedRoute>
                            <ResultsPage />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
