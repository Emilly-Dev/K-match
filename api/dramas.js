
const TMDB_URL = 'https://api.themoviedb.org/3';

export default async function handler(req, res) {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: 'Token do TMDB não configurado.',
    });
  }

  const { page = '1', genre } = req.query;

  const params = new URLSearchParams({
    language: 'pt-BR',
    page: String(page),
    sort_by: 'popularity.desc',
    with_origin_country: 'KR',
  });

  if (genre) {
    params.set('with_genres', genre);
  }

  try {
    const response = await fetch(
      `${TMDB_URL}/discover/tv?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Não foi possível buscar os K-dramas.',
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao conectar com o TMDB.',
    });
  }
}
