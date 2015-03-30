$(function () {
	//Imicio conexion socket.io
	window.io = io.connect();

	//Establecer CSS y label de los botones
	$("#tablaArchivos tbody tr td button").each(function() {
		if($(this).data('acceso') === false) {
			$(this).addClass( "btn btn-danger" );
			//$(this).text('Denegar');
		}
		else {
			$(this).addClass( "btn btn-success" );
			//$(this).text('Permitir');
		}
	});

	$("#tablaArchivos tbody tr td button").on("click", function(){
		var archivo = $(this).data('archivo');
		
		console.log($(this).data('acceso'));
		if($(this).data('acceso') === true) {
			$(this).removeClass( "btn-success" ).addClass( "btn-danger" );
			$(this).data('acceso', false);
			$(this).text('Denegar');
		}
		else {
			$(this).removeClass( "btn-danger" ).addClass( "btn-success" );
			$(this).data('acceso', true);
			$(this).text('Permitir');
		}

		//Emito señal de cambio de permisos
		io.emit('change',{nombre: archivo, habilitarPermisos: $(this).data('acceso')});
	});

	//Emito señal de conexion
	io.on('connect', function(){
    	console.log('Connected to server');
  	});
});