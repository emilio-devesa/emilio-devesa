---
title: "Solución del examen de PD de Diciembre 2010"
date: "2010-12-20"
categories: 
  - "software"
---

**Ejercicio 1: deducir los mensajes de la compilación en el top-level**  
Una buena estrategia es difenciar claramente los dos tipos de mensajes que nos puede dar el top-level acerca de una expresión válida. Son:

```
val <nombre> : <tipo_expresion> = <valor_expresion_evaluada>
- : <tipo_expresion> = <valor_expresion_evaluada>
```

¿Como sé cuando se muestran unos u otros? Bien, la respuesta es sencilla: después de una definición con let siempre nos encontraremos el primer caso, y el segundo se corresponderá con la evaluación de resultados (y en definitiva solo se diferencian en la palabra "val" y el nombre asignado antes de los dos puntos). Por ejemplo:

```
# let five _ = 5;;
val five : 'a -> int = <fun>
```

Y por la contra:

```
# mx3 1, mx3 1 2, mx3 1 2 3;;
- : (int -> int -> int) * (int -> int) * int = (<fun>, <fun>, 3)
```

En el primer caso estamos tomando el valor 5 y asignandoselo a una función "five" que reciba cualquier cosa "\_" (comodín). En la segunda instrucción vemos tres expresiones separadas por comas, es decir, tres miembros de una tupla. En esta, el primer miembro es:

```
mx3 1
```

Como se ve en la definición previa, _mx3_ es una función de tipo `'a -> a' -> 'a -> 'a`, que devuelve el valor máximo de 3 valores dados. Como es una función de "Curry", se puede aplicar a menos parametros de los esperados, y se produce como resultado otra funcion que tendrá un parámetro menos (y que de usarse, tomará como primero el parámetro que le hayamos impuesto). Así, `mx3 1` es una función que devolverá el máximo de dos valores y 1; por lo que su tipo es:

```
int -> int -> int
```

Donde el último "int" se refiere ya a la imagen de la función. El segundo miembro de la tupla se comporta de forma similar.

El tercer miembro de la tupla es la función mx3 aplicada a los enteros 1, 2 y 3. Obviamente su máximo es 3. El tipo de la tupla entonces se corresponde con el que ya he puesto arriba:

```
- : (int -> int -> int) * (int -> int) * int = (<fun>, <fun>, 3)
```

Dónde se ven claramente los miembros de la tupla separados por el símbolo asterisco.

Es obligado hacer una pequeña aclaración: una definición local se evalúa como una expresión, por ejemplo:

```
# let x = 2 in x;;
```

Produce como resultado:

```
- : int = 2
```

Porque realmente, dado el carácter local de la definición, el mensaje principal de la sentencia es lo que venga a continuación de "`in`", por lo que en este caso se está simplemente invocando al valor representado por la letra "`x`", que puntualmente (localmente) es el número entero 2.

Por supuesto una sentencia puede conducir a una excepción, que se denotan de la siguiente manera (no aparece ninguna en este examen):

```
Exception: <Constructor_excepcion> "<mensaje_o_nombre>".
```

Por ejemplo:

```
Exception: Invalid_argument "mi_funcion".
```

Aunque no todos los constructores de excepciones aceptan un mensaje, como pasa con "Division_by_zero".

Dado que este ejercicio se puede corregir simplemente usando el top-level, pasaré al siguiente.

**Ejercicio 2: reescribir dos funciones sin usar definiciones locales ni sentencias "if...then...else"**  
Lo más importante para reescribir una función es entender bien el propósito de la original para poder hacer correctamente nuestra versión. Vamos con la primera:

```
# let f x = let (x,y) = x in x;;
```

En esta expresión, lo primero que encontramos es que asociamos a la letra f una función que opera sobre un parámetro x. ¿Que ocurre en el "let...in"? Comenzamos por la parte "in". En ella simplemente se devuelve el valor de la x. En la definición local sin embargo, vemos que encajamos en un par (x,y) el valor de la x. Por lo tanto, la x ha de ser un par. Si de el par (x,y) devolvemos la x, estamos simplemente definiendo una función f que dado un par, devuelve su primera componente. Podemos reescribirla así:

```
# let f (a, _) = a;;
```

Por supuesto los tipos coinciden y se expresan con valores 'a y 'b, pues no sabemos por qué tipo de elementos estará construido el par:

```
val f : 'a * 'b -> 'a = <fun> 
```

De esta forma evitamos el uso de las definiciones locales.

En el segundo caso nos encontramos con esta función:

```
let n x g = if g x then true else false;;
```

Lo gracioso es que para eliminar la sentencia condicional "if...then...else" de esta expresión habrá que hacer precisamente eso. La explicación es muy sencilla: Imaginemos una expresión como la siguiente:

```
# 2 = 5;;
- : bool = false
```

Es una comparación. El resultado de una comparación obviamente solo puede ser verdadero o falso. 2 no es 5, por lo que aquí el resultado sería falso. En la instrucción del examen, estamos creando una función n que recibe un parámetro x y otro parámetro g. Por lo que podemos ver, g es otra función ya que luego se aplica a x tras el if. Según esto, g x ha de producir un resultado booleano ya de por sí, por lo que utilizar el if para establecer que es verdadero si al evaluarlo lo fue, o que será falso si al evaluarlo lo fué, es caer en una terrible redundancia. Es mucho más simple así, comparando si ha conducido a un resultado verdadero:

```
# let n x g = (g x) = true;;
```

Y por supuesto su tipo es:

```
val n : 'a -> ('a -> bool) -> bool = <fun>
```

Esto es, dado un valor 'a y una función que se aplica a 'a y retorna valores booleanos, nuestra función "n" devolverá tambien su resultado booleano.

**Ejercicio 3: Indicar el tipo de dos funciones**

```
# let rec sorted = function
	[] | [_] -> true
	| x::y::z  -> x <= y && sorted (y::z);;
```

De nuevo tenemos que entender bien qué nos dicen las funciones. La función "sorted" trabaja aparentemente con una lista y devuelve aparentemente valores booleanos (esto lo podemos apreciar a simple vista en la segunda linea del código). Por lo tanto, parece lógico que su tipo sea:

```
val sorted : 'a list -> bool = <fun>
```

El problema viene en el tipo de la lista. Dado que las operaciones que vemos en la ultima linea (es decir, la operación comparativa "menor o igual que": `<=`) se pueden aplicar a varios tipos de datos (por ejemplo, a char o a int) tendremos que decantarnos porque sea una 'a list, ya que a priori no podremos concretar más.

```
# let rec merge l1 l2 = match (l1,l2) with
	(l, []) | ([], l)  -> l
	| (h1::t1, h2::t2) -> if h1 <= h2 then h1 :: merge t1 l2
					  else h2 :: merge l1 t2;;
```

Ahora tenemos ante nosotros una función que parte de dos listas l1 y l2. En principio, la unica operación que encontramos es la igualdad en la sentencia condicional, por lo que de nuevo no podemos preveer su tipo concreto, pero si sabemos que ambas deben almacenar elementos del mismo tipo para que la comparación pueda ser viable. Es decir, las dos listas que son parámetros de la función serán de tipo 'a list. falta por ver el resultado. En la primera regla vemos que se devuelve una de ellas, por lo tanto su tipo de salida ha de ser el mismo que el de entrada:

```
val merge : 'a list -> 'a list > 'a list = <fun>
```

La primera de las funciones es la que verifica si los elementos de una lista están ordenados. Trabaja de forma recursiva: una lista estará ordenada si es vacía, si solo tiene un elemento o si el primero es menor o igual que el segundo y el resto de la lista tambien está ordenada.

La segunda, mezcla dos listas ordenadas en una sola lista ordenada de la siguiente forma: Si una de las dos listas está vacía, el resultado será inequívocamente la otra, pues ya es en sí una lista ordenadad. Si ambas contienen elementos, se compondrá una lista que comienza con el menor de ellos y con el resultado de mezclar el resto de esa y la otra completa. Obivamente esta composición no tendrá lugar mientras no se hayan compuesto los ultimos elementos.

¿Podemos redefinirlas de forma recursiva terminal? Por supuesto que podemos. Como siempre, la estrategia es delegar la recursividad en una función interna definida localmente donde coloquemos un parámetro extra en el que llevar el resultado temporalmente. Las dos soluciones que yo he encontrado son:

```
# let sorted l = 
	let rec sorted maximo li = match li with
		[]   -> true
		| h::t -> if maximo <= h
			  then sorted h t
			  else false
	in sorted (List.hd l) l;;
```

Mi función sorted utiliza un parámetro "máximo" que va almacenando el máximo de una lista y otro "li" que es la lista que falta por comprobar. Comienza tomando como máximo el valor de la cabeza de la lista "l" y la propia lista "l", que es la que yo quiero comprobar. En cada paso, se comprobará si el máximo es menor o igual que el primer elemento de la lista. Si lo es, comprobaremos la cola tomando como máximo el elemento h.

```
# let merge l1 l2 =
	let rec merge l1 l2 lf = match (l1, l2) with
		(l,[]) | ([], l) -> lf @ l
		| (h1::t1, h2::t2) -> if h1 <= h2
					then merge t1 l2 (lf@[h1])
					else merge l1 t2 (lf@[h2])
	in merge l1 l2 [];;
```

La función merge me ha dado algo más de trabajo. Por supuesto, utilizaré el parámetro "lf" para ir componiendo una "lista final" de la siguiente forma. En el caso de que una de las dos listas sea vacía, compondré lo que haya en la lista final con lo que quede de la otra. En el caso de que ambas tengan elementos, el menor de las cabezas debe ser compuesto con la lista final y la función merge invocada para lo que reste de esa lista, la otra completa y llevando ya la lista resultante como parámetro "lf", sin tener que dejar pendiente ninguna operación. Obviamente mi "lista final" debe estar vacía al inicio.

**Ejercicio 4: Definir la función "es\_perfecto" para un árbol binario**  
Dado un tipo árbol binario "bitree" de la forma:

```
# type bitree = Empty | Node of bitree * bitree;;
```

Un arbol binario será perfecto si tiene 0 o 2 hijos, pero no si solo tiene 1. Tenemos que aprovecharnos de la naturaleza recursiva de un árbol para que juege en nuestro favor. Mi solución ha sido la siguiente: En primer lugar, desechamos los casos base verdaderos: un árbol vacío (`Empty`) o el nodo que no tenga hijos, es decir `Node (Empty,Empty)`. En ambas situaciones, un arbol es perfecto. Desechados estos primeros casos, nos centramos en el arbol que tiene solo uno de sus hijos, que nos conduce a un resultado "false". Por ultimo, para el arbol que tenga dos subárboles hijos (`i` y `d`) habrá que evaluar si son árboles perfectos ambos hijos.

```
# let rec es_perfecto = function
	Empty		  | Node (Empty, Empty) -> true
	| Node (Empty, _) | Node (_, Empty)	-> false
	| Node (i, d)	-> es_perfecto i && es_perfecto d;;
```

El examen se puede encontrar [aquí](http://carpanta.dc.fi.udc.es/staff/molineli/PD/10-11/Examen.pdf).
