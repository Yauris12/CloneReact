const noFoundMiddleware = (req, res) =>
  res.status(404).send('Ruta no existente')

export default noFoundMiddleware
