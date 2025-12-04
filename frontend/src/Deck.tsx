import React, { useEffect, useState } from 'react'
import type { deck} from './model/deckModel'
import { useNavigate } from 'react-router-dom'

interface DeckProps {
  deck: deck
}

const Deck = ( {deck} : DeckProps) => {
  const navigate = useNavigate()
  const [height, setHeight] = useState<number>(100)

  const deckEl = React.useRef<HTMLDivElement | null>(null)

  function setDeckHeight() {
    const deckHeight = deckEl.current?.getBoundingClientRect().height
    setHeight(deckHeight || 100)
  }

  useEffect(() => {
    window.addEventListener('resize', setDeckHeight)
    return () => window.removeEventListener('resize', setDeckHeight)
  }, [])

  return (
    <div 
      className="deck" 
      style={{height: height}}
      onClick={() => {
          navigate(`/decks/${deck.id}`)
      }}
      ref={deckEl}
    >
      <h2>{deck.title}</h2>
    </div>
  )
}


export default Deck

