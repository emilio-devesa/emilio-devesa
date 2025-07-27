---
title: "Examen de Programación ETIX Septiembre 2010"
date: "2010-09-12"
categories: 
  - "software"
---

Este viernes me examiné de esta asignatura, y la prueba me pareció muy fácil. El apartado de escribir código fue, en palabras del propio profesor, trivial:

_El método de la suma de sucesivos impares permite calcular el cuadrado de un numero n de la siguiente manera:  
1 = 1^2 = 1  
1+3 = 2^2 = 4  
1+3+5 = 3^2 = 9  
1+3+5+7 = 4^2 = 16  
1+3+5+7+9 = 5^2 = 25  
...  
Implemente la funcion cuadrado para calcular, de forma NO RECURSIVA y utilizando el método de la suma de sucesivos impares, el cuadrado de un numero entero n >= 0 dado._

Lo primero en lo que me fijé fue en que para calcular el cuadrado de 2, sumo los dos primeros números impares (comenzando en 1); para calcular el cuadrado de 3, sumo los tres primeros impares; etc.

Comenzamos planteando la función, sus condiciones y el caso base, calcular el cuadrado de 0, numero para el que no hay que realizar sumas. Como precaución, aprovecharemos también para escribir la última instrucción antes de que se nos olvide, la que asigna el valor del resultado a la función. 
```
function cuadrado (n: integer): integer;
{ Objetivo: Calcula el cuadrado de n mediante la suma de sucesivos numeros impares.
  PreCD: n >= 0 
  PosCD: resultado >= 0
}
var resultado: integer;
begin
  if n = 0
  then resultado := 0
  else begin
    ...
  end;
  cuadrado := resultado;
end;
```

Con esto planteado, utilizaré una variable llamada "impar" que comience con valor 1 y un bucle en el que en cada paso, impar aumente su valor en 2 para que me dé esa sucesión de numeros impares. 
```
function cuadrado (n: integer): integer; 
{ Objetivo: Calcula el cuadrado de n mediante la suma de sucesivos numeros impares. 
  PreCD: n >= 0 
  PosCD: resultado >= 0 
} 
var resultado, impar, i: integer; 
begin   
  if n = 0   
  then resultado := 0   
  else begin     
    impar := 1;     
    for i := 1 to n do begin       
      impar := impar + 2;     
    end;   
  end;   
  cuadrado := resultado; 
end;
```

El caso mas simple de este bucle es el caso n = 1, en el que solo se realiza una iteración. En este caso, necesitamos tan que el resultado comience en 0 y se le sume ese 1: 
```
function cuadrado (n: integer): integer; 
{ Objetivo: Calcula el cuadrado de n mediante la suma de sucesivos numeros impares.
  PreCD: n >= 0
  PosCD: resultado >= 0
}
var resultado, impar, i: integer;
begin
  if n = 0
  then resultado := 0
  else begin
      impar := 1;
      resultado := 0;
      for i := 1 to n do begin
      resultado := resultado + impar;
      impar := impar + 2;
    end;
  end;
  cuadrado := resultado;
end;
```

Y así queda completa esta función. No obstante, se puede entender de otra forma matemáticamente más eficiente: la suma de los elementos de una progresión aritmética de diferencia d = 2. La fórmula matemática que calcula la suma de n términos de una progresión aritmética de diferencia d es:  
`Sn = (a1 + an) * n/2`  
Por lo tanto, utilizando una variable an en nuestra función, podemos resolver el problema de forma totalmente inmediata:  
```
function cuadrado (n: integer): integer;
{ Objetivo: Calcula el cuadrado de n mediante la suma de los elementos de una sucesión de numeros impares.
  PreCD: n >= 0 
  PosCD: resultado >= 0
}
var an: integer;
begin
  an := 2*n - 1;
  cuadrado := (1 + an) * n / 2;
end;
```

O incluso en una sola línea:  
```
function cuadrado (n: integer): integer;
{ Objetivo: Calcula el cuadrado de n mediante la suma de los elementos de una sucesión de numeros impares. 
  PreCD: n >= 0 
  PosCD: resultado >= 0 
}
begin
  cuadrado := (1 + (2*n - 1)) * n / 2;
end;
```

Y obviamente la operación: `(1 + (2*n - 1)) * n / 2` se simplifica como: `2n * n / 2` que resulta en: `n * n`; es decir, la forma natural de calcular el cuadrado de un número.
