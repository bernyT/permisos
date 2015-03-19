$(function () {
	//Imicio conexion socket.io
	window.io = io.connect();

	$("#tablaArchivos tbody tr td button").on("click", function(){
		var archivo = $(this).data('archivo');
		
		console.log($(this).data('acceso'));
		if($(this).data('acceso') === true) {
			$(this).removeClass( "btn-success" ).addClass( "btn-danger" );
			$(this).data('acceso', false);
			$(this).text('Denegar');
			console.log("ACESSOS");
		}
		else {
			$(this).removeClass( "btn-danger" ).addClass( "btn-success" );
			$(this).data('acceso', true);
			$(this).text('Permitir');
			console.log("SIN ACCESO");
		}

		//Emito señal de cambio de permisos
		io.emit('change',{nombre: archivo, habilitarPermisos: true});
	});

	//Emito señal de conexion
	io.on('connect', function(){
    	console.log('Connected to server');
  	});
});