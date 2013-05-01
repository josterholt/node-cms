exports.index = function(req, res) {
	req.models.article.create([{
		title: 'Test Article',
		body: 'Testing',
		published: true
	}]);
	res.render('list', {});
}