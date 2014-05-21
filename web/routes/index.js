
/*
 * GET home page.
 */
exports.home =  function(req, res){
  res.render('index', {
    title: 'Trip Planner',
    user: req.user
  });
};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};