// Verifica que haya sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
};

module.exports = { isAuthenticated };
