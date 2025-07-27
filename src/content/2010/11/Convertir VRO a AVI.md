---
title: "Convertir VRO a AVI"
date: "2010-11-16"
categories: 
  - "software"
---

Personalmente llevaba ya unos días intentando convertir un archivo .VRO de una cámara de vídeo a un archivo .AVI que fuese más manejable. En Windows hubiese sido coser y cantar buscar cualquier herramienta de autoría de DVD, o una herramienta tipo "vro2avi" o algo similar... Sin embargo no renuncié a hacer esto en Ubuntu con software libre y un poco de paciencia. Para empezar, debemos instalar una herramienta hábil en la conversión de formatos multimedia. En este apartado el rey es _ffmpeg_. Si no lo tienes instalado, puedes introducir la siguiente orden en una shell:
```
$ sudo apt-get install ffmpeg
```
Por defecto soporta multitud de formatos, pero añadiremos una librería para poder codificar audio en mp3:
```
sudo apt-get install libavcodec-extra-52
```
Hay otras formas de habilitar la compresión mp3 en ffmpeg, pero ésta me ha parecido idónea.

Lo básico que necesitamos saber de ffmpeg es que desde la terminal tenemos que indicar el archivo de entrada (con la directiva _\-i_ de input), los parámetros y el archivo resultante. Por ejemplo:
```
$ ffmpeg -i VR_MOVIE.VRO -acodec copy -vcodec copy VR_MOVIE.MPG
```
Esta orden simplemente cambia los datos de un contenedor VRO a un contenedor MPG. Como se puede deducir de la sintaxis, el audio codificado será una copia del original, lo mismo que con el vídeo. Podemos ahondar un poco más en este apartado añadiendo directivas. Comencemos con el audio: 
```
$ ffmpeg -i VR_MOVIE.VRO -acodec libmp3lame -ac 2 -ar 48000 -ab 128k -vcodec copy VR_MOVIE.MPG
```
Como se puede ver, solo hemos variado los parámetros de la codificación de audio, y son: 
- _\-acodec libmp3lame:_ indicamos cual es el compresor de audio, en este caso mp3 
- _\-ac 2:_ indicamos el numero de canales del audio. Un solo canal es el tradicional "mono", dos canales es sonido "estéreo" y 5.1 canales es el audio envolvente de, por ejemplo, una pelicula dvd. Como el audio original solo está en estéreo, lo mantenemos así. 
- _\-ar 48000:_ Es el numero de veces que el audio es muestreado por segundo. El ratio del audio original era de 48000, pero otro valor habitual (por ejemplo el de un CD de música) es 44100 hertzios. Es el número de muestras que se toman por segundo para conformar la onda de sonido almacenada en la grabación. Lo mejor es dejarlo como en el original. 
- _\-ab 128k:_ es la calidad con la que el codec mp3 codificará la onda de sonido. Un valor aceptable puede ser 128 kilobytes (de ahí la k tras el número) aunque puede ser insuficiente para un oído bien entrenado. Mucha gente está optando por codificar a 192 kb. Tambien podemos optar por una opción intermedia como es 160k.

Ahora refinemos un poco el vídeo: 
```
$ ffmpeg -i VR_MOVIE.VRO -acodec libmp3lame -ac 2 -ar 48000 -ab 128k -vcodec mpeg4 -qscale 3 -g 300 -deinterlace -aspect 16:9 -s 512x288 -f avi VR_MOVIE.AVI
```
En este caso los parámetros del video son: 
- _\-vcodec mpeg4:_ es la implementación del estándar MPEG-4 (padre de por ejemplo divx, xvid, etc.). Hay otras opciones como _mpeg2video_ (para MPEG-2, como en un DVD), pero recomiendo MPEG-4 por su buena relación calidad/compresión y su creciente aceptación en reproductores domésticos, teléfonos móviles, etc. 
- _\-qscale 3:_ se trata de la calidad general que se busca en el video. Cuanto más alto es el número, más se comprime y peor se vé. Lo ideal es 3 o 2, reservando el 1 únicamente para casos muy concretos donde se necesite una calidad máxima. Del 3 en adelante, la pérdida de nitidez es apreciable. 
- _\-g 300:_ se trata de una opción bastante avanzada. Agrupará los fotogramas en grupos de 300 para que sea más facil comprimir los que sean similares. En cierto modo, ayuda a mejorar la imagen. No te recomiendo que modifiques este valor a no ser que estés muy seguro. 
- _\-deinterlace:_ desentrelaza las líneas del video, dando a las imagenes un aspecto más suave. 
- _\-aspect 16:9:_ aplica un [ratio de aspecto](http://es.wikipedia.org/wiki/Relaci%C3%B3n_de_aspecto) al video. Hay bastantes opciones disponibles, pero las más habituales serían 4:3 (como la televisión cuadrada de toda la vida), 16:9 (el de bastantes películas) y 16:10 (ligeramente más alto que 16:9, pero bastante común tambien). Si el video se reproduce deformado (como en mi caso), prueba a utilizar esta opción, pero omítela si se ve bien. 
- _\-s 512x288:_ sirve para cambiar el tamaño del video. Apenas tiene impacto en el tamaño del archivo, pero si reduces mucho la resolución, se verá bastante peor. Lo ideal es tratar con el original. Un dvd tiene una resolución de 720x576 píxeles, mientras que un blu-ray tiene 1280x720 (HD Ready) ó 1920x1080 (Full HD). Si por ejemplo quiero que el ancho sea de 512 pixeles, debo calcular el alto con una simple regla de tres: 
```
alto_original * nuevo_ancho / ancho_original = nuevo_alto 1080 * 512 / 1920 = 288 píxeles
```
- _\-f avi:_ fuerza que el nuevo contenedor sea un archivo avi (fíjate en que tambien hemos cambiado la extensión del archivo de salida).

Añadí alguna opción más como _\-async 1_ para mejorar la sincronización del audio con el vídeo y el resultado fué perfecto.
```
$ ffmpeg -i VR_MOVIE.VRO -acodec libmp3lame -ac 2 -ar 48000 -ab 128k -async 1 -vcodec mpeg4 -qscale 3 -g 300 -deinterlace -s 720x405 -aspect 16:9 -f avi VIDEO.AVI
```
Hay otras opciones muy interesantes y la [documentación de ffmpeg](http://www.ffmpeg.org/ffmpeg-doc.html) es excelente para consultar su funcionamiento.