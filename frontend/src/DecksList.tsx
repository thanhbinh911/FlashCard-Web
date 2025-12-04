import type { deck } from './model/deckModel'
import Deck from './Deck'

// Props: list of decks to render as cards
interface DecksListProps {
  decks: deck[]
}

const DecksList = ({ decks }: DecksListProps) => {
  return (
    // Grid container for deck cards (see CSS .deck-grid)
    <div className='deck-grid'>
      {decks.map(deck => {
          return <Deck deck={deck} key={deck.id} />
        }
      )}
    </div>
  )
}

export default DecksList