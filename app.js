var express = require('express'),
	app = express(),
	swig = require('swig'),
	io = require('socket.io').listen(app.listen(3000, function () {
		var host = '192.168.1.99';
		console.log('Aplicacion escuchando %s',host);
	}));

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

//Recivo señal de conexion
io.sockets.on('connection', function(socket) {

	//Recivo señal de "change"
	socket.on('change', function(archivo) {
		console.log(archivo);
		fs.chmod(archivo['nombre'], 0777);
	});
});

/*
CUNADO NO SE USABA SOCKET.IO
var server = app.listen(3000, function () {

  var host = '192.168.1.99'
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})*/