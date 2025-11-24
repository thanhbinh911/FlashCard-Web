
import { Routes, Route } from "react-router-dom"
import FlashcardPage from "./FlashcardPage"
import Login from "./LoginPage"
import Register from "./RegisterPage"
import CreateDeckPage from "./CreateDeckPage"
import YourDeckPage from "./YourDeckPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/flashcards" element={<FlashcardPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-deck" element={<CreateDeckPage />} />
      <Route path="/your-deck" element={<YourDeckPage />} />
    </Routes>
  )
}

export default App
