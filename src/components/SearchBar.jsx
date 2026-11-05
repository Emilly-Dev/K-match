function SearchBar({
    searchTerm,
    onSearchChange,
    selectedGenre,
    onGenreChange
}) {
    return (
        <div className="search-bar">
            <label htmlFor="drama-search">
                Buscar K-drama
            </label>

            <input
            id="drama-search" 
            type="search" 
            placeholder="Digite o título de um drama"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            />

            <label htmlFor="genre-filter">
                Filtrar por gênero
            </label>

            <select 
            id="genre-filter"
            className="genre-filter"
            value={selectedGenre}
            onChange={(event) => onGenreChange(event.target.value)}
            >
            <option value="Todos">Todos os gêneros</option>
            <option value="10759">Ação e aventura</option>
            <option value="16">Animação</option>
            <option value="35">Comédia</option>
            <option value="80">Crime</option>
            <option value="99">Documentário</option>
            <option value="18">Drama</option>
            <option value="10751">Família</option>
            <option value="10762">Infantil</option>
            <option value="9648">Mistério</option>
            <option value="10764">Reality</option>
            <option value="10765">Ficção científica e fantasia</option>
            <option value="10766">Novela</option>
            <option value="10767">Talk show</option>
            <option value="10768">Guerra e política</option>
            <option value="37">Faroeste</option>
            </select>

        </div>
    )
}

export default SearchBar