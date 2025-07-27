---
title: "Compilar programas con make"
date: "2010-03-23"
categories: 
  - "software"
---

Una de las buenas (mejores) costumbres que puede uno tener como programador es la organización. Escribir nuestro programa de forma lógica y ordenada es una ventaja cuando hay que buscar un fallo o se quiere mejorar una parte en concreto. Si además tenemos un conjunto de funciones y procedimientos que se utilizan de forma habitual, merece la pena escribirlos en un fichero fuente separado del resto del programa, al que se le llama módulo o unit. Por ejemplo, yo suelo utilizar un módulo que programé en una ocasión para manejar ficheros en Pascal y que contiene las operaciones más habituales (enlazar, crear, borrar, abrir, cerrar, comprobar si está vacío...); así no necesito volver a programarlo cada vez, sino que lo utilizo directamente. 

Los módulos en Pascal se compilan con:  
```
$ gpc --extended-pascal -c fichero_modulo.pas
```
También podría haber llamado al compilador con la directiva automake sobre el fichero fuente del programa en sí. Esto compila todos los módulos necesarios y el programa principal de forma automática:  
```
$ gpc --extended-pascal --automake programa.pas
```

Sin embargo, puede darnos problemas si trabajamos con varios modulos que se importan entre sí o si exportan varias interfaces cada uno, etc. Hay una forma de hacerlo, y obtener tambien otros beneficios, que es usando "_make_". Debería estar instalado en cualquier distribución tipo Debian (por ejemplo, en Ubuntu), pero sino, bastaría con hacer:  
```
$ sudo apt-get install make
```
"_Make_" es un programa que buscará un fichero llamado "_GNUmake_", "_makefile_" o "_Makefile_" en el directorio en el que lo ejecutemos (sin olvidar que en GNU/Linux se distinguen nombres de fichero con mayúsculas y minúsculas). Cuando lo encuentre, seguirá las órdenes que estén escritas en su interior.

Visto en un ejemplo: en mi directorio "_/pas_" tengo tres archivos de codigo fuente en Pascal y quiero utilizar "_make_" para compilar más rápidamente los dos módulos y el programa principal. Voy a crear un nuevo fichero con el nombre "_makefile_", y lo abro con un editor como puede ser gEdit. En el interior del fichero crearé además dos órdenes básicas: la de compilación, como ya dije, y una orden que borre todo salvo los codigos fuente y me deje el directorio tal y como estaba. Las líneas con el signo # al comienzo son comentarios. Mi fichero "_makefile_" contendrá lo siguiente:  
```
# La orden compilar compilará los archivos que recibe
# Aquí recibe dos modulos y el programa principal
compilar: modulo1.pas modulo2.pas programa.pas
    @echo "Comenzando compilación…"
    # Se compilan los dos modulos por orden
    gpc --extended-pascal -c modulo1.pas
    gpc --extended-pascal -c modulo2.pas
    # Se compila el programa principal
    gpc --extended-pascal programa.pas
    @echo "Compilación terminada…"

# La orden limpiar elimina los ficheros .out, .gpi, .o
limpiar:
    @echo "Limpiando directorio"
    rm *.out
    rm *.gpi
    rm *.o
    @echo "Directorio limpio"
```

Hay algo que me gustaría comentar dentro de este simple código para _makefile_. Los verbos "_compilar_" y "_limpiar_" funcionan como parte del comando make.  
Al comando "_make compilar_" le especificamos los archivos que necesita y ejecuta las líneas que hay justo bajo él (que deben estar tabuladas, por cierto).  
Lo mismo para "_make limpiar_" salvo que este último no necesita unos archivos concretos. Dicho eso solo queda aclarar que ahora podremos hacer:  
```
$ make compilar
$ make limpiar
```

La primera instrucción hará la compilación tal y como si lo escribiésemos a mano y si ejecutamos la segunda, borrará los archivos que se generan, dejando el directorio tan solo con los archivos _.pas_. Make es muy polivalente y podremos utilizarlo con otros compiladores y tambien para automatizar otras tareas. Hay mucha más información en http://es.wikipedia.org/wiki/Make