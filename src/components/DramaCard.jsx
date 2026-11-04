
import { useState } from "react"
function DramaCard({drama, isFavorite, onToggleFavorite}) {
  const [imageError, setImageError] = useState(false)
  return (
    <article className="drama-card">
      <div className="drama-card-poster">
        {drama.poster && !imageError ? (
          <img 
            src={drama.poster}
            alt={`Pôster de ${drama.title}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>Pôster de {drama.title}</span>
          )}
      </div>

      <div className="drama-card-info">
        <span className="drama-card-genre">
          {drama.genre}
        </span>

        <h3>{drama.title}</h3>

        <p className="drama-card-year">
          {drama.year}
        </p>

        <span className="drama-card-rating">
          ★ {drama.rating.toFixed(1)}
        </span>

        <button 
        type="button"
        className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(drama.id)}
        >
          {isFavorite ? '♥ Favoritado' : '♡ Adicionar à minha lista'}
        </button>

      </div>
    </article>
  )
}

export default DramaCard
