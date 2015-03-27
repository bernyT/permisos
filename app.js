var express = require('express'),
	app = express(),
	swig = require('swig'),
	io = require('socket.io').listen(app.listen(3000, function () {
		var host = '192.168.1.99';
		console.log('Aplicacion escuchando %s',host);
	}));
const fs = require('fs');
var async = require("async");


//Configuracion
// View engine
app.engine('html', swig.renderFile );
app.set('view engine', 'html');
app.set('views', './app/views');

app.use( express.static('./public') );



app.get('/', function (req, res) {
	path = __dirname;

	var archivo = function (nombre, permiso, css, texto) { 
		this.nombre = nombre;
		this.permiso = permiso; 
		this.classCss = css;
		this.texto = texto;
	};

	async.waterfall([
		function(callback){
			fs.readdir(path, callback)
		},
		function(files, callback) {
			var archivos = new Array;
			files.forEach(function(file) {
				var a1 = new archivo();
				fs.stat(file, function(error, stats) {
					a1.nombre = file;
					if (stats['mode'] === 33279) {
						a1.permiso = true;
						a1.classCss = 'btn btn-success';
						a1.texto = "Permitir";
						console.log(file+' '+stats['mode']);
					}
					else {
						a1.permiso = false;
						a1.classCss = 'btn  btn-danger';
						a1.texto = "Denegar";
						console.log(file + ' ' + 'permiso denegado');
					}

					archivos.push(a1);
				});
			});

			callback(null, archivos);
		},
		function (files, callback) {
			callback(null,files);
		}
		], function(error, files) {
			//console.log('files '+files);
			res.render('permisos', {archivos : files});		
		});
				
		//console.log("ARCHIVOS "+archivos[0]);
		//permiso 777 es igual a mode =33279,
		//console.log(files);
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