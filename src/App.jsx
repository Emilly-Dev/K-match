import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import DramaCard from './components/DramaCard'
import {useEffect, useState} from 'react'
import SearchBar from './components/SearchBar'
import {getKdramas} from './tmdb'


const genreNames = {
    10759: 'Ação e aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    10762: 'Infantil',
    9648: 'Mistério',
    10764: 'Reality',
    10765: 'Ficção científica e fantasia',
    10766: 'Novela',
    10767: 'Talk show',
    10768: 'Guerra e política',
    37: 'Faroeste',
}

function App() {
  // 1- Estados
  const [dramas, setDramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [favoriteDramas, setFavoriteDramas] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('k-match-favorites')
      const parsedFavorites = savedFavorites 
        ? JSON.parse(savedFavorites) 
        : []

        return parsedFavorites.filter(
          (item) => item && typeof item === 'object' && item.id
        )

    } catch {
      return []
    }
  })

  const favoriteIds = favoriteDramas.map((drama) => drama.id)
  const [sortBy, setSortBy] = useState('rating')

  // Buscar dados da API 
  useEffect(() => {
    async function carregarDramas() {
      try {
        setLoading(true)

        const data = await getKdramas({
          genre: selectedGenre === "Todos"
          ? undefined
          : selectedGenre
        })

        const listaDeFilmes = data.results || data

        // Mapeia o padrão do TMDB para as propriedades que o <DramaCard /> já usa
        const dramasFormatados = listaDeFilmes.map((item) => ({
          id: item.id,
          title: item.name || item.title, // Séries usam 'name', filmes usam 'title'
          year: item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : 'N/A',

          genre: (item.genre_ids || [])
          .map((id) => genreNames[id])
          .filter(Boolean)
          .join(', ') || 'Não informado',

          rating: item.vote_average
          ? parseFloat(item.vote_average.toFixed(1))
          : 0,

          poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://placehold.co/500x750',
        }))

        setDramas(dramasFormatados)
      } catch (error) {
        console.error("Erro ao buscar doramas da API:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDramas()
  }, [selectedGenre])

  useEffect(() => {
    localStorage.setItem(
      'k-match-favorites',
      JSON.stringify(favoriteDramas)
    )
  }, [favoriteDramas])
  
  // 2 - Função para adicionar e remover favoritos
  function toggleFavorite(dramaId) {
    setFavoriteDramas((currentFavorites) => {
      
      const alreadyFavorite = currentFavorites.some(
          (drama) => drama.id === dramaId
      )

      if (alreadyFavorite) {
        return currentFavorites.filter(
          (drama) => drama.id !==dramaId
        )
      }

      const dramaToAdd = dramas.find(
        (drama) => drama.id === dramaId
      )

      if (!dramaToAdd) {
        return currentFavorites
      }

      return [...currentFavorites, dramaToAdd]

    })
  }

  // 3 - Filtro do catálogo
  const filteredDramas = dramas.filter((drama) => {
    const matchesTitle = drama.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())

      return matchesTitle
  })

  .sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    if (sortBy === 'newest') {
      return b.year - a.year 
    }
    if (sortBy === 'oldest') {
      return a.year - b.year
    }
    return 0
  })



  return (
    <main>
      <Header />
      <Hero />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
      />

      <div className="sort-control">
        <label htmlFor="sort-drama">Ordenar por:</label>
        <select 
          id="sort-drama"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="rating">Melhor avaliação</option>
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
        </select>
      </div>

      <section className="drama-section" id="catalago">
        <h2>K-dramas para descobrir</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>Carregando K-dramas dinâmicos do TMDB...</p>
        ) : (
          <div className="drama-grid">
            {filteredDramas.map((drama) => (
              <DramaCard 
                key={drama.id} 
                drama={drama}
                isFavorite={favoriteIds.includes(drama.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}

            {filteredDramas.length === 0 && (
              <p>Nenhum K-drama encontrado.</p>
            )}
          </div>
        )}
      </section>

      {/* Lista */}
      <section className="drama-section">
        <h2>Minha lista</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>Carregando lista...</p>
        ) : favoriteDramas.length === 0 ? (
          <p>Você ainda não favoritou nenhum K-drama.</p>
        ) : (
          <div className="drama-grid">
            {favoriteDramas.map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
