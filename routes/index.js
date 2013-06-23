exports.index = function(req, res){
    res.render('index', { title: 'Match-System', user: req.user});
};
