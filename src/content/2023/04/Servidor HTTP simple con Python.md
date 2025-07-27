---
title: "Servidor HTTP simple con Python"
date: "2023-04-05"
categories: 
  - "software"
---

Si necesitas disponer de forma rápida de un servidor http, puedes recurrir a Python. En versiones antiguas:
```
$ sudo python -m SimpleHTTPServer 8000
```
Pero estas alturas lo más probable es que estés usando una versión de Python superior a la 3.0, de modo que el comando es:
```
$ python3 -m http.server 8000
```
Donde 8000 es el puerto que desees emplear y también el que lanza por defecto el comando si no especificas otro. Ahora bien, un truco muy útil que puedes añadir a este comando es especificar qué directorio funcionará como raíz del servidor, por ejemplo un subdirectorio de mi carpeta personal llamado "web":
```
$ python -m http.server -d ~/web
```
Y por último, será útil poder dejar este comando corriendo por detrás sin que esto bloquee la terminal, para lo que añadiremos un símbolo & al final. La terminal nos dirá el número de proceso, por ejemplo el 1463, por lo que más adelante podremos terminarlo con: 
```
$ kill 1463
```
Es un poco farragoso el hecho de que los mensajes de estado que va mostrando el servidor se entremezclan con el texto del shell, pero siendo una solución tan sencilla e inmediata, que funciona a las mil maravillas, vale la pena conocerla para echar mano de ella cuando necesitemos algo rápido y simple.