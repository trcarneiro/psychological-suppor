import('../server/index.js').then(module => {
  const app = module.default
  module.exports = app
  exports.default = app
}).catch(err => {
  console.error('Failed to load server:', err)
  module.exports = (req, res) => res.status(500).json({ error: 'Server failed to load' })
})
