var express = require('express'),
	app = express(),
	swig = require('swig');
const fs = require('fs');
	
//Configuracion
// View engine
app.engine('html', swig.renderFile );
app.set('view engine', 'html');
app.set('views', './app/views');

app.use( express.static('./public') );

app.get('/', function (req, res) {
	path = __dirname;

	fs.readdir(path, function(error, files) {
		files.forEach(function(file) {
			fs.stat(file, function(error, stats) {
				if (stats['mode'] === 33279) {
					console.log(file+' '+stats['mode']);
				}
			});
		});
		
		//permiso 777 es igual a mode =33279,
		//console.log(files);
		res.render('permisos', {archivos : files});	
	});
});

var server = app.listen(3000, function () {

  var host = '192.168.1.99'
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})