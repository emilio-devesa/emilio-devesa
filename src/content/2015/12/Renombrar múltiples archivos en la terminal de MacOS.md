---
title: "Renombrando muchos archivos en la terminal de OS X"
date: "2015-12-09"
categories: 
  - "software"
---

Este script permite reombrar múltiples archivos con determinada extensión (por ejemplo .txt a .rtf) en la terminal de MacOS:
```
#!/bin/sh
for i in *.txt; do
  j=`echo $i | sed 's/txt/rtf/'`
  mv $i $j
done
```
En la linea de "for" debes poner la extensión original, y en la linea de "sed" debes poner la original y la nueva sin los puntos.