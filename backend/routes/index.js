module.exports = (router) => {
  router.prefix('/api');
  router.use('/cards', require('./cards'));
}
