---
title: "Descargar una web completa"
date: "2022-08-24"
categories: 
  - "software"
---

Existe una forma que permite descargar toda una web a una carpeta almacenada de forma local a través del comando wget. En MacOS este comando no viene de serie así que lo instalé a través de Homebrew:
``` 
$ brew install wget
``` 
En muchas distribuciones de Linux, sin embargo, viene ya con el sistema operativo. Y ahora para descargar toda una web: 
```
$ wget \ --recursive \ --no-clobber \ --page-requisites \ --html-extension \ --convert-links \ --restrict-file-names=windows \ --domains www.mipagina.com \ --no-parent \ http://www.mipagina.com/subdirectorio/html/
```
Donde las opciones son: 
```
--recursive: descargar la página web completa. 

--domains www.mipagina.com: no descargar nada que no pertenezca a este dominio. 

--no-parent: no seguir enlaces fuera de la ruta /subdirectorio/html/. 

--page-requisites: descargar todos los recursos necesarios (imágenes, CSS, etc.) 

--html-extension: guardar archivos con extensión .html 

--convert-links: modificar todos los enlaces para que funcionen de forma local. 

--restrict-file-names=windows: modificar nombres de ficheros para que funcionen correctamente bajo Windows (si éste es tu SO). 

--no-clobber: no sobreescribir archivos existentes (por si se corta la descarga y vuelves a ejecutar el comando, para que no baje cosas que ya tienes).
```