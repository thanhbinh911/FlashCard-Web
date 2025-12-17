
import { Routes, Route } from "react-router-dom"
import FlashcardPage from "./FlashcardPage"
import Login from "./LoginPage"
import Register from "./RegisterPage"
import CreateDeckPage from "./CreateDeckPage"
import YourDeckPage from "./YourDeckPage"
import DeckPage from "./DeckPage"
import AddCardPage from "./AddCardPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/flashcards" element={<FlashcardPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-deck" element={<CreateDeckPage />} />
      <Route path="/your-deck" element={<YourDeckPage />} />
      <Route path="/decks/:deckId/:deckTitle" element={<DeckPage  />} />
      <Route path="/decks/:deckId/add-flashcard" element={<AddCardPage  />} />
    </Routes>
  )
}

export default App