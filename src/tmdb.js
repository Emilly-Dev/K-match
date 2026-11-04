
export async function getKdramas({ page = 1, genre } = {}) {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (genre) {
    params.set('genre', genre);
  }

  const response = await fetch(`/api/dramas?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os K-dramas.');
  }

  return response.json();
}
