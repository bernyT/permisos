var express = require('express'),
	app = express(),
	swig = require('swig'),
	io = require('socket.io').listen(app.listen(3000, function () {
		var host = '127.0.0.1';
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

	var archivo = function (nombre, etiqueta, permiso, directorio) { 
		this.nombre = nombre;
		this.etiqueta = etiqueta;
		this.permiso = permiso; 
		this.directorio = directorio;
	};

	async.waterfall([
		function(callback){
			fs.readdir(path, callback)
		},
		function(files, callback) {
			var archivos = new Array;
			
			files.forEach(function(file) {
				var a1;
				fs.stat(file, function(error, stats) {
					if(stats.isFile()) {						
						//El permiso de lectura y escritura de "otros"
						if ((stats['mode'] & 2) && (stats['mode'] & 4)) {
							a1 = new archivo(file, 'Denegar', false, false);
							console.log(file);
						}
						else {
							a1 = new archivo(file, 'Permitir', true, false);
						}
					}
					else if(stats.isDirectory()) {
						if ((stats['mode'] & 2) && (stats['mode'] & 4)) {
							a1 = new archivo(file, 'Dir. Denegar', false, true);
						}
						else {
							a1 = new archivo(file, 'Dir. Permitir', true, true);
						}
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
		if(!archivo['habilitarPermisos']) {
			console.log('change 777'+archivo);
			fs.chmod(archivo['nombre'], 0777);
		}
		else {
			console.log('change 700'+archivo);
			fs.chmod(archivo['nombre'], 0700);
		}
	});
});

/*
CUNADO NO SE USABA SOCKET.IO
var server = app.listen(3000, function () {

  var host = '192.168.1.99'
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})*/