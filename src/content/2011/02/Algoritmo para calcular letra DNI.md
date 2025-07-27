---
title: "Algoritmo para calcular letra DNI"
date: "2011-02-03"
categories: 
  - "software"
---

Un ejercicio muy clásico de casi cualquier curso de programación en español es que, dado un número NIF, calculemos la letra del DNI de esa persona.

**El algoritmo**  
Basicamente se parte de una cadena de caracteres conocida que es la siguiente: "TRWAGMYFPDXBNJZSQVHLCKE". Su longitud es de 23 caracteres. Supongamos el DNI número 12341234. Si calculamos el resto de la división de ese número entre 23, obtenemos el número 9. La letra en la novena posición de nuestra cadena de caracteres es la letra "D" (comenzando a numerar por el cero).

**Implementación en Pascal**  
Es muy sencillo: solo necesitamos dos constantes para la cadena y para el numero 23. En una variable leemos el número que introduce el usuario y mostramos simplemente la letra en la posición que sea el resultado del módulo. Solo hay una ligera complicación, Pascal comienza a numerar las letras de un string con el número 1, así que habrá que sumar 1 tambien al resto de la división... La función que extrae un caracter de un string es "substr" y se utiliza:

```
substr (cadena_de_caracteres, posicion_inicial, numero_de_caracteres_extraidos)
```

Estrictamente devuelve otro string, porque podríamos extraer más de un caracter aumentando el valor del tercer parámetro, pero en nuestro caso nos es indiferente...

```
program dni (input, output);

const
	cadena = 'TRWAGMYFPDXBNJZSQVHLCKE';
	modulo = 23;

var
	nif: integer;

begin
	write ('Introduzca su NIF: ');
	readln (nif);
	writeln ('La letra de su DNI es: ', substr (cadena, (nif mod 23) + 1, 1) );
end.
```

**Implementación en Ocaml**  
Con una función podemos resolver todo el problema. Para proteger el string, lo definiremos de forma local. Por seguir la notación habitual de Ocaml, la he llamado "dni\_of\_int"...

```
let dni_of_int x = let letras = "TRWAGMYFPDXBNJZSQVHLCKE"
	in letras.[(x mod 23)];;
```

**Implementación en Java**  
La implementación en Java se parece mucho a la de Pascal, solamente modificando un par de cosas relativas a la sintaxis y la entrada de datos. Tambien será muy similar a la de otros lenguajes como C, C++, C#...
```
import java.util.Scanner;

class Dni {
	static final String cadena = "TRWAGMYFPDXBNJZSQVHLCKE";
	static final int modulo = 23;

	public static void main (String[] args){
		Scanner input = new Scanner(System.in);
		System.out.print ("Escriba su NIF: ");
		int nif = input.nextInt();
		System.out.println ("La letra de su DNI es: "+(cadena.charAt(nif % modulo)));
	}

}
```

**Implementación en Python**  
La primera línea simplemente sirve (bajo sistemas Unix como Linux o MacOS) para indicar la ruta donde el ordenador puede encontrar el intérprete de Python que corra el programa. Si alguna vez has programado un script para bash, sabrás que se les suele llamar "[bangs](http://en.wikipedia.org/wiki/Shebang_\(Unix\))" a este tipo de líneas. No tiene más explicación, puedes tomarlo como algo mecánico.

Importaremos la librería _sys_ para poder leer argumentos de la consola. La función _LetraDNI_ recibe un nif y, como se ve en el return, devuelve la letra del string "letra" que corresponda con la operación mod _%_. En el _main_ se lanza esa función para el primer argumento leido en la consola (_sys.argv[1]_) que se tiene que convertir en un entero, de ahí que se le aplique la conversión a entero _int_.

Por último, nos encontramos el boilerplate. Sencillamente es un mecanismo de python para identificar el main y por ahora podemos tomarlo como algo mecánico como la linea "bang".

```
#!/usr/bin/python3 -tt

# Importamos una libreria para tomar los argumentos
import sys

# Funcion que devuelve la letra DNI del NIF
def LetraDNI (nif):
	letra = 'TRWAGMYFPDXBNJZSQVHLCKE'
	return letra[(nif % 23)]

# Main del programa
def main ():
	print (LetraDNI(int(sys.argv[1])))

# Standard boilerplate
if __name__ == '__main__':
	main()
```

Para ejecutarlo, le otorgamos permiso de ejecución y lo lanzamos así:

```
$ chmod +x dni.py
$ ./dni.py 12341234
```
