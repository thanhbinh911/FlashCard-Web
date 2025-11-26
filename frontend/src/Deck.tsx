import React, { useEffect, useState } from 'react'
import type { Deck } from './model/deckModel'

interface DeckProps {
  deck: Deck
}

const Deck = ( {deck} : DeckProps) => {

  const [click, setClick] = React.useState(false)
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
      className={`deck ${click ? 'clicked' : ''}`} 
      style={{height: height}}
      onClick={() => setClick(!click)}
      ref={deckEl}
    >
      <h2>{deck.title}</h2>
      
    </div>
  )
}

export default Deck

