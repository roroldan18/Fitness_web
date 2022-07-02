# The Project - EN

## Run Project

1. First you need to install all the dependencies not only in frontend folder but also in backend folder, with "npm install" in the terminal. Check all the dependencies install correctly.
2. Check the config.ts file in backend folder - in order to write your own credentials.
3. Then you need to run the backend with "npm run dev". In MAC you will not have any problem,  but in Windows you need to change the package.json script, instead of "export" you need to write "set".
If everything is OK, you will see 3 messages:
    -  The server running.
    -  A test DB: 1+1.
    -  A confirmation of your DB connection. 
4. Open another terminal (keep the Back running) - go to Frontend folder in terminal. And write: "npm run start"
5. Note: This is a sketch of the Front and the Back, and it is adapted in order to be public. All the function may not be working well if you do not create the DB or adapt it to your project.


### Description
For major Fitness company:
A Web Page with session functionality was requested for instructors who can access through a portal, where they can access the material they acquired and which is assigned for the Administrator.
They also have the possibility to access the audio and video material, as well as using a search engine to access certain tracks.

On the other hand, the Administrator can create new users, create new instructors, assign material to them, create new courses, create news that only logged-in users can access, and disable all of these.
Each modification of these will be notified via email.

#### Frontend Technologies
The frontend was developed with ReactJs. React-bootstrap was used for design together with Bootstrap and Sass.
Redux was used to manage the information throughout the entire application.

#### Backend Technologies
NodeJs and Express technology was used for the backend. JWT was used for the Token. Bcrypt was used for key encryption.
The database used is MySQL and Sequelize was used to handle the requests in the code.
The Nodemailer package was used to handle the emails.



# Proyecto de página web - ES

## Ejecutar el proyecto

1. Primero, debes instalar todas las dependencias tanto dentro de la carpeta de frontend como de backend con su correspondiente "npm install" en la terminal. Chequear que las dependencias se hayan instalado correctamente
2. Debes revisar el archivo config.js de la carpeta de Backend para agregar tus credenciales.
3. Luego, debes correr "npm run dev" en tu terminal. Si estás en MAC no tendrás mayor problema, pero si estás en Windows tendrás que modificar el archivo package.json en la sección de script donde dice "export" modificarlo por "set".
Si todo está OK, obtendrás 3 mensajes que garantizan que el backend está corriendo:
    -  El servidor corriendo.
    -  Un test de la DB: 1+1.
    -  Una confirmación de conexión de la DB. 
4. Abir otra terminal (con el backend corriendo) posicionado en la carpeta frontend y escribir: "npm run start"
5. Aclaracion: Este es un proyecto maquetado de el Front y el Back y está adaptado para que el mismo sea público, ya que el original se mantiene privado. Si bien está bastante completo, es posible que todas las funcionalidades no estén optimizadas. Para ello deberás adaptar tu proyecto y tu database al mismo.

### Descripción del proyecto
Para importante compañía de Fitness:
Se solicitó una página web con funcionalidad de sesiones para instructores que puedan acceder mediante un portal, al material que adquirieron y les asignó al administrador.
Tienen la posibilidad de acceder al material de audio y video, así como tambien mediante un buscador acceder a determinados tracks.

Por otro lado, el administrador puede crear usuarios nuevos, crear instructores, asignarles material, crear nuevos cursos, crear novedades que puedan acceder sólo los usuarios logueados, deshabilitar todos estos.
A su vez, cada modificación de estos serán notificados vía email.

#### Tecnologías de Frontend
El frontend está desarrollado con ReactJs, se utilizó react-bootstrap para el diseño junto con bootstrap y sass. 
Se utilizó Redux para manejar el estado a traves de toda la aplicación.

#### Tecnologías de Backend
Para el backend se utilizó la tecnología de NodeJs y express. Se utilizó JWT. Bcrypt para el encriptado de claves.
La base de datos usada es MySQL y se utilizó Sequelize para manejar las peticiones.
Se utilizó el paquete Nodemailer para el manejo de los emails.

