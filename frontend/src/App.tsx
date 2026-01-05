
import { Routes, Route } from "react-router-dom"
import FlashcardPage from "./home/FlashcardPage"
import Login from "./login/LoginPage"
import Register from "./login/RegisterPage"
import CreateDeckPage from "./deck/CreateDeckPage"
import YourDeckPage from "./deck/YourDeckPage"
import DeckPage from "./deck/DeckPage"
import AddCardPage from "./flashcard/AddCardPage"
import AccountPage from "./home/AccountPage"
import ChangePasswordPage from "./login/ChangePasswordPage"
import CreateSessionPage from "./session/CreateSessionPage"
import ActiveSessionPage from "./session/ActiveSessionPage"
import SessionStudyPage from "./session/SessionStudyPage"
import SessionSummaryPage from "./session/SessionSummaryPage"

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
      <Route path="/account" element={<AccountPage/>}/>
      <Route path="/change-password" element={<ChangePasswordPage/>}/>
      <Route path="/create-session" element={<CreateSessionPage/>}/>
      <Route path="/active-session" element={<ActiveSessionPage/>}/>
      <Route path="/study-session/:sessionId/:deckTitle/:deckId" element={<SessionStudyPage/>}/>
      <Route path="/session/:sessionId/summary" element={<SessionSummaryPage/>}/>"
    </Routes>
  )
}

export default App