// Usar lodash con import pq eso dijo el profe.
import _ from "lodash";

// Ejercicios Faciles.
// 1. Devolver el arreglo inverso (este es un ejemplo con spread).
const numeros = [1, 2, 3, 4, 5];
const resultado1 = _.reverse([...numeros]); // spread operator
console.log("Ejercicio 1. ", resultado1);

// 2. Eliminar los falsy values (son todos los falsos en caso de booleanos como 0 y 1, false y true, etc.)
const valores = [0, "Hola", false, 42, "", null, "Mundo", undefined, NaN, true];
const resultado2 = _.compact(valores);
console.log("Ejercicio 2. ", resultado2);

// 3. Unir arreglos sin duplicados.
const array1 = [1, 2, 3];
const array2 = [3, 4, 5];
const resultado3 = _.union(array1, array2);
console.log("Ejercicio 3. ", resultado3);

// Ejercicios Medios.
// 4. Contar cuántas veces aparece cada palabra en el array.
const palabras = ["hola", "mundo", "hola", "javascript", "mundo", "hola"];
const resultado4 = _.countBy(palabras);
console.log("Ejercicio 4. ", resultado4);

// 5. Encontrar la diferencia.
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [3, 4, 5, 6, 7];
const resultado5 = _.difference(arr1, arr2);
console.log("Ejercicio 5. ", resultado5);

// 6. Dado un arreglo con nombres y edades, ordénalos por edad de menor a mayor.
const personas = [
  { nombre: "Ana", edad: 25 },
  { nombre: "Luis", edad: 22 },
  { nombre: "Juan", edad: 30 },
];
const resultado6 = _.sortBy(personas, ["edad"]);
console.log("Ejercicio 6. ", resultado6);

// 7. Valores unicos que no se repiten - (No devolver el 2, 4 y 6 en el array().
const numerosRepetidos = [1, 2, 2, 3, 4, 4, 5, 6, 6, 7];
const conteo = _.countBy(numerosRepetidos); // frecuencia de cada número
const resultado7 = _.keys(_.pickBy(conteo, (valor) => valor === 1)).map(Number); // keys de los que solo aparecen una vez en type number.
console.log("Ejercicio 7. ", resultado7); // aquí se usa pickBy para seleccionar de manera dinámica.

// 8. Dividir un arrelo e n grupos dado un número n.
const n = 3;
const elementos = ["a", "b", "c", "d", "e", "f", "g", "h"];
const resultado8 = _.chunk(elementos, n);
console.log("Ejercicio 8. ", resultado8);

// 9. Retornar las Keys en mayus. (Se puede hacer _.toUpper(key) o key.toUpperCase())
const persona = { nombre: "Carlos", apellido: "Pérez", edad: 28 };
const resultado9 = _.mapKeys(persona, (valor, key) => _.toUpper(key));
console.log("Ejercicio 9. ", resultado9);

// Ejercicios Difíciles MUAJAJA.
// 10. Aplanar un arreglo profundamente.
const anidado = [1, [2, [3, [4, 5]]], 6];
const resultado10 = _.flattenDeep(anidado);
console.log("Ejercicio 10. ", resultado10);

// 11. Encontrar la Intersección de Múltiples Arreglos
const lista1 = [1, 2, 3, 4, 5];
const lista2 = [3, 4, 5, 6, 7];
const lista3 = [5, 6, 7, 8, 9];
const resultado11 = _.intersection(lista1, lista2, lista3);
console.log("Ejercicio 11. ", resultado11);

// 12. Arupar los objetos según el valor de la key dada.
const clave = "curso";
const estudiantes = [
  { nombre: "Mario", curso: "Matemáticas" },
  { nombre: "Lucía", curso: "Historia" },
  { nombre: "Juan", curso: "Matemáticas" },
  { nombre: "Elena", curso: "Historia" },
];
const resultado12 = _.groupBy(estudiantes, clave);
console.log("Ejercicio 12. ", resultado12);
