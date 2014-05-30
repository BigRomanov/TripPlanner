exports.index = function(req, res){
  res.render('index', {  title: 'Trip Planner',
    user: req.user 
  });
};