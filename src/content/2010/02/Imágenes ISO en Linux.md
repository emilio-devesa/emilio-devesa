---
title: "Imágenes ISO en Linux"
date: "2010-02-27"
categories: 
  - "software"
---

En Ubuntu (y GNU/Linux en general) disponemos de unos comandos para crear y manejar archivos de imagen de disco (archivos por lo general en formato ISO) desde el terminal. Aquí van un par de ejemplos: 

### Crear archivo ISO con la imagen de un CD/DVD

En primer lugar suponemos que la ruta al disco es _/dev/cdrom_ (es normal que sea así). Basta con teclear:  
```
$ sudo umount /dev/cdrom $ dd if=/dev/cdrom of=archivo.iso bs=1024
``` 
Esto creará el archivo _archivo.iso_ en el directorio actual.

### Crear archivo ISO con la imagen de una carpeta

Supongo que _/ruta\_de\_carpeta/_ es donde tengo almacenado lo que quiero incorporar a la ISO.  
```
$ mkisofs -o archivo.iso /ruta_de_carpeta/
```
Con esto, todo el contenido de _/ruta\_de\_carpeta/_ se vuelca a _archivo.iso_.  
Sin más parámetros, se renombrarán los arhivos con nombres largos a archivos de 8 caracteres de nombre y 3 carateres de extensión como máximo para cumplir los estándares básicos en cuanto a longitud de nombres de archivo. Por ejemplo: _Instalador.out_ sería _Instalad.out_  
En cambio, la mayoría de sistemas son capaces de entender los discos grabados fuera del estándar, con nombres largos de archivo. Si queremos que nuestra ISO los respete y no los renombre, el comando se convierte en:  
```
$ mkisofs -JR -o imagen.iso /ruta_de_carpeta/
```
Las opciones implicadas aquí son -J (de [_Joliet_](http://es.wikipedia.org/wiki/Joliet)) y -R (de [_Rock Ridge_](http://es.wikipedia.org/wiki/Rock_Ridge)) que permiten el uso de nombres largos manteniendo la compatibilidad. 

### Grabar un archivo ISO

Lo más sencillo es hacerlo de forma gráfica, haciendo clic con el botón derecho sobre él y pulsar "_Grabar al disco_". 

### Montar un archivo ISO en un directorio
Se puede hacer de esta forma:
```
$ sudo mkdir /media/dir_montaje/`  
$ sudo modprobe loop`  
$ sudo mount archivo.iso /media/dir_montaje/ -t iso9660 -o loop
```
Esto crea un directorio llamado _dir\_montaje_ y monta la imagen de _archivo.iso_ en ese lugar. Y por último, para desmontar el archivo de imagen...  
```
$ sudo umount /media/dir_montaje/
```