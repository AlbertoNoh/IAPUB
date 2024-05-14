#Prompt 1

Quiero tener la capacidad de añadir candidatos al sistema ATS, Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

1. Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador. 
2. Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral. 
3. Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos. 
4. Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX. 
5. Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema. 
6 Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema. 
6.Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

usalo como contexto y usalo en las preguntas que realizare posteriormente


#prompt 2
Iniciemos con el frontend
usa @frontend usa antd y agregar un layout para inicializar un dashboard y usa axios para los servicios api
1. Agrega en el menu una opcion "candidatos", y agrega el componente para incorporar el listado
2. Agregar una nueva vista con el listado de los candidatos(llama al endpoint de listado) y usa como columnas los datos de los candidatos, la tabla contara con 2 acciones, editar y eliminar.
3. Agrega un boton para mostrar un formulario e ingresar los datos del candidato.
4. al editar obten los datos del candidato por su id y presenta los datos en el modal
5. A eliminar llama al endpoint de eliminacion y pasales el id del candidato, si el eliminado es exitoso refresca la tabla

Empecemos agregando el layout, proporciona el comando para instalar antd y el codigo basico del layout ademas de lo indicado en el punto 1, despues seguiremos con los demas puntos



#prompt 3
ok, ahora continuemos con el punto 2
para una nueva vista para el listado de los candidatos.
Realiza un refactor para volver el layout un componente padre


#prompt 4
ok, continuemos con el puntos 2
agregando el api service para el endpoint de listado
tabla con el listado de candidatos
esto en el componente @Candidates.tsx 




#prompt 5
Ahora continuemos con el punto 3, agregando el modal para los datos del candidato

#prompt 6
Continuemos con el punto 3, se requiere enviar el contenido en un form data, ademas sera posible adjuntar de manera opcional un archivo .pdf  o .docx (document) usando @api.ts 



#prompt 7
Ahora continuemos con el punto 4
al editar se obtendria los datos del candidato por su id para llenar el fomulario de edicion.
si el candidato cuenta con un archivo agregar el link para visualizar el otra pestaña.



#prompt 8
ok. ahora agrega la implementacion para editar


#prompt 9
Ok, ahora continuemos con el punto 5, para la accion eliminar



#prompt 10
Modificar el layout para que el menu sea horizontal y responsivo



 