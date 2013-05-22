exports.index = function(req, res) {
	res.render('list', { 
		articles: req.models.article.find()
	});
}