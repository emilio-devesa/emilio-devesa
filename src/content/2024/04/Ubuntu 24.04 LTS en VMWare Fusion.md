---
title: "Ubuntu 24.04 LTS (en VMware Fusion)"
date: "2024-04-28"
categories: 
  - "software"
---

![](images/ubuntu-24.04.png)

Hoy he instalado Ubuntu 24.04 en una máquina virtual creada con VMware Fusion para programar en Linux. Ya tenía una con la versión de hace un año, pero la que acaba de salir es una LTS (Long Term Support) y además quería aprovechar para cambiar el sistema de ficheros que empleaba, de modo que me descargué la nueva ISO desde los servidores oficiales y comencé la instalación. Para esta nueva versión he seleccionado el sistema [Btrfs](https://en.wikipedia.org/wiki/Btrfs), que permite copias sin consumo de tiempo y snapshots del disco automáticos. Son dos ventajas muy importantes ya que la primera ahorra tiempo y escrituras y la segunda permite restaurar el sistema a snapshots anteriores de forma muy eficaz (lo que te libera de necesitar programas específicos para esto). No he asignado demasiados recursos a esta máquina virtual pero sí que quiero señalar cómo he resuelto lo básico.

**Open-VM-tools**  
La instalación de estos paquetes te permitirá varias cosas. La primera (y más práctica) es disponer de portapapeles compartido entre tu sistema operativo anfitrión y Ubuntu. También te proporciona un mejor controlador gráfico y la posibilidad de acceder a carpetas compartidas, así que instálalos mediante:
```
user@ubuntu:~$ sudo apt-get install open-vm-tools-desktop
```
Después he creado una ruta donde se montarán las carpetas compartidas:
```
user@ubuntu:~$ sudo mkdir /mnt/hgfs
```
Es necesario entonces editar el fichero de puntos de montaje:
```
user@ubuntu:~$ sudo nano /etc/fstab
```
E incluir éstas líneas:
```
# VMWare Fusion Shared Folders
vmhgfs-fuse	/mnt/hgfs/	fuse	defaults,allow_other	0	0
```
Ahora ya podemos recargar el daemon del sistema y montar todo:
```
user@ubuntu:~$ sudo systemctl daemon-reload
user@ubuntu:~$ sudo mount /mnt/hgfs
```