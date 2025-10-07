// Catálogo temporal de productos
const productos = [
  {
    idProducto: 1,
    nombreProducto: "Pollo a la brasa entero",
    descripcionProducto: "Pollo entero sazonado al estilo tradicional, cocinado a la brasa.",
    imagen: "https://mi-polleria.com/imagenes/pollo_entero.jpg",
    unidad: "unidad",
    precio: 35.00,
    estado: "activo"
  },
  {
    idProducto: 2,
    nombreProducto: "1/2 Pollo a la brasa",
    descripcionProducto: "Media porción de pollo a la brasa con el mismo sabor clásico.",
    imagen: "https://mi-polleria.com/imagenes/medio_pollo.jpg",
    unidad: "unidad",
    precio: 20.00,
    estado: "activo"
  },
  {
    idProducto: 3,
    nombreProducto: "Presas adicionales",
    descripcionProducto: "Presas adicionales de pollo (pierna, ala, pechuga) cocinadas a la brasa.",
    imagen: "https://mi-polleria.com/imagenes/presas.jpg",
    unidad: "pieza",
    precio: 6.00,
    estado: "activo"
  },
  {
    idProducto: 4,
    nombreProducto: "Papas fritas familiares",
    descripcionProducto: "Papas fritas crocantes tamaño familiar, ideal para compartir.",
    imagen: "https://mi-polleria.com/imagenes/papas_familiares.jpg",
    unidad: "porción",
    precio: 8.00,
    estado: "activo"
  },
  {
    idProducto: 5,
    nombreProducto: "Ensalada fresca",
    descripcionProducto: "Ensalada de lechuga, tomate y zanahoria con vinagreta.",
    imagen: "https://mi-polleria.com/imagenes/ensalada.jpg",
    unidad: "porción",
    precio: 5.00,
    estado: "activo"
  },
  {
    idProducto: 6,
    nombreProducto: "Gaseosa 1.5L",
    descripcionProducto: "Botella de gaseosa de 1.5 litros (varios sabores disponibles).",
    imagen: "https://mi-polleria.com/imagenes/gaseosa.jpg",
    unidad: "botella",
    precio: 7.00,
    estado: "activo"
  },
  {
    idProducto: 7,
    nombreProducto: "Combo familiar",
    descripcionProducto: "1 Pollo entero + papas grandes + ensalada + gaseosa 1.5L.",
    imagen: "https://mi-polleria.com/imagenes/combo_familiar.jpg",
    unidad: "combo",
    precio: 48.00,
    estado: "activo"
  }
];

module.exports = { productos };