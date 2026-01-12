import './LoadingSpinner.css'

function LoadingSpinner({ size = 'md', text = '' }) {
    const sizeClass = `spinner-${size}`

    return (
        <div className="loading-wrapper">
            <div className={`spinner ${sizeClass}`}></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    )
}

export default LoadingSpinner
