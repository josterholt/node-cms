exports.index = function(req, res) {
	console.log('testing');
	res.render('list', { 
			foo: 'testing',
			articles: [
				{ 
					title: 'Test 1'
				}
			]
	});
}