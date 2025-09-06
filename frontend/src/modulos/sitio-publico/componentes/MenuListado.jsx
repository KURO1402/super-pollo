import polloCuarto from "../../../assets/imagenes/CuartodePollo.png";
import TarjetaProducto from "./TarjetaProducto";

// Datos de ejemplo para los productos
const productos = [
  {
    id: 1,
    nombre: "1/4 de Pollo a la Brasa",
    descripcion: "Papas + Cremas + Ensalada Fresca",
    precio: "S/14.00",
    imagen: polloCuarto,
  },
  {
    id: 2,
    nombre: "Producto 2",
    descripcion: "Papas + Cremas + Ensalada Fresca",
    precio: "S/14.00",
    imagen: polloCuarto,
  },
  {
    id: 3,
    nombre: "Producto 3",
    descripcion: "Papas + Cremas + Ensalada Fresca",
    precio: "S/14.00",
    imagen: polloCuarto,
  },
  {
    id: 4,
    nombre: "Producto 4",
    descripcion: "Papas + Cremas + Ensalada Fresca",
    precio: "S/14.00",
    imagen: polloCuarto,
  },
  {
    id: 5,
    nombre: "Producto 5",
    descripcion: "Papas + Cremas + Ensalada Fresca",
    precio: "S/14.00",
    imagen: polloCuarto,
  },
];

const MenuListado = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/*Se mapea el array de productos para generar las tarjetas*/} 
      {productos.map((prod) => (
        // se usa el spread operator para pasar todas las props de una vez
        <TarjetaProducto key={prod.id} {...prod} />
      ))}
    </div>
  );
}

export default MenuListado;