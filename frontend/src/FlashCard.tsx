import React, { useEffect, useRef } from 'react'
import type { Flashcard } from './model/cardModel'

interface FlashCardProps {
  flashcard: Flashcard
}

const FlashCard = ({ flashcard }: FlashCardProps) => {

  const [flip, setFlip] = React.useState(false)
  const [height, setHeight] = React.useState<number>(100)



  const frontEl = useRef<HTMLDivElement | null>(null)
  const backEl = useRef<HTMLDivElement | null>(null)


  function setMaxHeight() {
    const frontHeight = frontEl.current?.getBoundingClientRect().height
    const backHeight = backEl.current?.getBoundingClientRect().height
    setHeight(Math.max(frontHeight || 0, backHeight || 0, 100))
  }

  useEffect(() => {
    setMaxHeight()
  }, [flashcard.question, flashcard.answer, flashcard.options])
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight)
    return () => window.removeEventListener('resize', setMaxHeight)
  }, [])

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className='front' ref={frontEl}>
        <h2>{flashcard.question}</h2>
        <div className='flashcard-options'>
          {flashcard.options.map((option,index) => 
            <p className='card-option' key={`card${index}`}>{option}</p>)}
        </div>
      </div>
      <div className='back' ref={backEl}>{flashcard.answer}</div>
    </div>
  )
}

export default FlashCard