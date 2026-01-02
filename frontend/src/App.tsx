
import { Routes, Route } from "react-router-dom"
import FlashcardPage from "./home/FlashcardPage"
import Login from "./login/LoginPage"
import Register from "./login/RegisterPage"
import CreateDeckPage from "./deck/CreateDeckPage"
import YourDeckPage from "./deck/YourDeckPage"
import DeckPage from "./deck/DeckPage"
import AddCardPage from "./flashcard/AddCardPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/flashcards" element={<FlashcardPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-deck" element={<CreateDeckPage />} />
      <Route path="/your-deck" element={<YourDeckPage />} />
      <Route path="/decks/:deckId/:deckTitle" element={<DeckPage  />} />
      <Route path="/decks/:deckId/:deckTitle/add-flashcard" element={<AddCardPage  />} />
    </Routes>
  )
}

export default App