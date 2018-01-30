module.exports = function(app, passport, jwtOptions) {
  require('./account')(app, passport, jwtOptions);
  require('./feed')(app, passport);
  require('./feedback')(app, passport);
  require('./config')(app, passport);
  require('./favorites')(app, passport);
  require('./moderator')(app, passport);
};