$(function () {
	//Imicio conexion socket.io
	window.io = io.connect();

	$("#tablaArchivos tbody tr td button").on("click", function(){
		var archivo = $(this).data('archivo');
		//Emito señal de cambio de permisos
		io.emit('change',{nombre: archivo, habilitarPermisos: true});
	});

	//Emito señal de conexion
	io.on('connect', function(){
    	console.log('Connected to server');
  	});
});