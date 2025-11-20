
import { Routes, Route } from "react-router-dom"
import FlashcardPage from "./FlashcardPage"
import Login from "./LoginPage"
import Register from "./RegisterPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/flashcards" element={<FlashcardPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App