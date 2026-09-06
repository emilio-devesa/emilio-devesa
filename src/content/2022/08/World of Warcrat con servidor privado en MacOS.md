---
title: "World of Warcraft con servidor privado (en MacOS)"
date: "2022-08-25"
categories: 
  - "videojuegos"
---

[![](images/costasur.png)](images/costasur-full.png)

Hace un par de años que Apple retiró de MacOS el soporte para aplicaciones de 32-bit. A estas alturas, salvo que utilices aplicaciones muy antiguas y abandonadas, esto no debería ser un problema, pero sí que existen algunos programas que ya no podrás ejecutar en versiones nuevas del SO. Una de ellas es el antiguo cliente de [World of Warcraft](../../../2007/02/world-of-warcraft/) pero podemos utilizar la aplicación de Windows a través de traducción de librerías.

**Actualización 09/2026:** El método descrito anteriormente para ejecutar el cliente en MacOS solo funcionaba en procesadores Intel. Ahora he incluido tamnbién un apartado donde describo como ejecutarlo en procesadores Apple Silicon y lo he comprobado en mi [MacBook Air M5](../../../2026/07/macbook-air-m5/) con las betas de MacOS 27 Golden Gate.

**Cliente en Macs con procesador Apple Silicon**  
Para procesadores M1, M2, M3 o superiores, [WoWSilicon](https://wowsilicon.github.io/) ofrece compatibilidad nativa y fluida con la arquitectura ARM64. Basta con descargar la aplicación desde su repositorio oficial en GitHub, moverla a Aplicaciones y asignarle la carpeta del cliente de World of Warcraft que contiene el archivo Wow.exe durante su primer inicio para gestionar el rendimiento gráfico sin emuladores pesados. El programa parcheará el ejecutable de WoW y podrás jugar sin mayores problemas.

![](images/wowsilicon.png)

En las siguientes capturas se puede ver la configuración que a mi me ha dado mejor resultado. He podido poner los gráficos al máximo y podría incluso seleccionar una resolución mayor, pero 1280x800 es un ajuste con el que me encuentro bastante cómodo.

![](images/wowsilicon-config-1.png)

![](images/wowsilicon-config-2.png)

![](images/wowsilicon-config-3.png)


**Cliente en Macs con procesador Intel**  
En primer lugar instalamos Winery. Puedes descargarlo manualmente desde https://github.com/Gcenx/WineskinServer/releases aunque yo prefiero hacerlo con Homebrew, con lo que también se instalarán sus actualizaciones de forma automatizada: 
```
$ brew install --cask --no-quarantine gcenx/wine/wineskin
``` 
El flag `--no-quarantine` evitará tener que insistirle (botón derecho/abrir) a MacOS para abrir la aplicación.

![](images/winery-assets.png) 

Si has optado por descargarlo manualmente, lo encontrarás bajo el apartado de Assets comprimido con extensión .txz, y una vez lo hayamos bajado y desempaquetado, tendremos la aplicación tal y cómo se puede ver en esta imagen: 

![](images/winery-app.png) 

Puedes arrastrarla por ejemplo a tu carpeta de Aplicaciones. Ejecútala y te encontrarás con algo muy similar a esto:

![](images/winery-main.png)

En primer lugar pulsa la flecha de refrescar y a continuación en el símbolo "+" para comprobar qué motores nuevos puede haber disponibles y escoger el más reciente. Al momento de escribir esto, el más nuevo es WS11WineCX64Bit21.2.0. Este nombre no nos dice nada, pero el número de versión es el más alto. Confirmamos que lo queremos descargar e instalar:

![](images/winery-engines.png) ![](images/winery-engine-install.png)

Una vez que tenemos nuestro motor de traducción, ya podemos crear la envoltura. Hacemos click en "Create New Blank Wrapper" y le damos un nombre, por ejemplo "World of Warcraft". Este paso le tomará un poco de tiempo a la máquina ya que tiene que configurar una versión específica de Wine con el motor de traducción que le hemos indicado. Una vez esté listo, haz clic en "View wrapper in Finder".

![](images/wrapper.png) 

La ventana que se abre contiene lo que será la supuesta aplicación pero por ahora está vacía. Haz clic con el botón derecho sobre ella y elige "Mostrar contenido del paquete". Ahora ejecuta la app Wineskin que hay dentro y selecciona "Install Software":

![](images/wineskin.png)

![](images/wineskin-folder-executable.png)

Ahora podemos escoger si copiar o mover toda la carpeta con el juego (para Windows). Yo voy a escoger copiar, seleccionaré el directorio donde están todos los archivos del juego y confirmaré cual es el archivo que lanza la aplicación (que en este caso es "Wow.exe")

![](images/wineskin-choose-exe.png) 

Se puede toquetear alguna cosa más, como el icono de la aplicación, por ejemplo, pero en principio no es necesario hacer nada extra para conseguir que el juego funcione bajo macOS.

![](images/wow_app.jpeg)

**Servidor**  
También puedes tener tu servidor privado con soporte hasta la versión 3.3.5a (Wrath of the Lich King) en Windows, MacOS o Linux. Empezaremos instalando [Docker](https://www.docker.com), ya sea descargándolo de la web oficial o, como en mi caso, a través de Homebrew:
```
$ brew install --cask docker
```
A continuación, descargaremos el software [azerothcore](https://github.com/azerothcore/acore-docker/archive/refs/heads/master.zip), una implementación hecha mediante ingeniería inversa del servidor de juego que correrá como un contenedor, lo que hará mucho más fácil tanto la instalación de todas las herramientas necesarias como su actualización y mantenimiento. Descomprimimos sus contenidos donde no nos estorben, entramos al directorio mediante la terminal y obtenemos la última versión de los paquetes necesarios:
```
$ docker compose pull
``` 
Una vez que este proceso haya concluido, lo cual depende principalmente de la velocidad de la conexión a internet, importaremos a las bases de datos del servidor todos los datos del juego.
```
$ docker compose up ac-db-import
``` 
Y el siguiente paso consiste en arrancar el contenedor del servidor:
```
$ docker compose up -d
```
El servidor ya está funcionando pero necesitamos un usuario con el que poder autenticarnos. Para ello, vamos a conectarnos al proceso del servidor a través de una terminal. Para saber el nombre del proceso, introducimos:
```
$ docker compose ps
```
En mi caso existe un proceso llamado `acore-docker-ac-worldserver-1` al que me puedo conectar con la siguiente orden:
```
$ docker attach acore-docker-ac-worldserver-1
``` 
El simbolo del terminal cambiará a _AC>_. Crear el usuario es tan fácil como:
```
AC> account create USUARIO CONTRASEÑA 
AC> account set gmlevel USUARIO 3 -1
``` 
Donde USUARIO y CONTRASEÑA serán tus credenciales para conectarte al servidor y le habremos dado permisos de GM. Puedes desconectar la terminal del servidor pulsando seguidas las combinaciones de teclas Ctrl+P y Ctrl+Q.

![](images/account-1.png)

**Configurar el cliente**  
Entramos en la carpeta del juego (de nuevo, clic derecho sobre la app, escogemos "Mostrar contenido del paquete", y navegamos a la ruta `drive_c/Program Files/WoW) y abrimos el archivo _realmlist.wtf_ con un editor de texto plano. Borramos todo lo que pone y escribimos simplemente:
```
set realmlist logon.chromiecraft.com
```
Si juegas desde el mismo ordenador donde tienes el servidor, puedes referirte a él como "localhost" y si es desde otra máquina de tu red local, incluso puedes utilizar el nombre de host (por ejemplo, en mi caso, "MacBook-Pro").

![](images/realmlist-config-1.png)

Más info:  
- https://www.chromiecraft.com/es/como-instalar-un-servidor-de-wow-en-tu-computadora/
- https://www.azerothcore.org/wiki/install-with-docker