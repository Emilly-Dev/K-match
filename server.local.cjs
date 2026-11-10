
const http = require('node:http')
const { URL } = require('node:url')

const PORT = 3001

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname !== '/api/dramas') {
    res.writeHead(404)
    res.end('Rota não encontrada')
    return
  }

  req.query = Object.fromEntries(url.searchParams)

  res.status = (code) => ({
    json: (data) => {
      res.writeHead(code, {
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify(data))
    },
  })

  try {
    const { default: handler } = await import('./api/dramas.js')
    await handler(req, res)
  } catch (error) {
    console.error('Erro no servidor local:', error)

    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify({
        error: 'Erro interno no servidor local',
      }))
    } else if (!res.writableEnded) {
      res.end()
    }
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API local: http://localhost:${PORT}`)
})
