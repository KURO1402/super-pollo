import { create } from "zustand";

// se crea y exporta el estado global para las ventas
export const useVentaEstadoGlobal = create((set, get) => ({ // set para actualizar el estado y get para acceder
    detalle: [], // array donde se guardan los productos agregados a la venta
    cantidades: {}, // objeto donde se guardan las cantidades de cada producto

    // Nueva función para actualizar la cantidad directamente
    setCantidad: (id, cantidad) => set((state) => ({
        cantidades: {
            ...state.cantidades,
            [id]: cantidad,
        }
    })),

    // función para actualizar cantidad de un producto en el detalle
    actualizarCantidad: (id, nuevaCantidad) => set((state) => ({
        detalle: state.detalle.map((item) => 
            item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        )
    })),

    // funcion para agregar un producto al detalle de la venta
    agregarProducto: (producto) => {
        const { detalle, cantidades } = get(); // obtenemos el detalle y las cantidades del estado
        const cantidad = cantidades[producto.id] || 1; // obtenemos la cantidad del producto, si no existe es 1
        const productoExistente = detalle.find(item => item.id === producto.id); // buscamos si el producto ya existe en el detalle
        // si existe, actualizamos la cantidad
        if (productoExistente) {
            set({
                detalle: detalle.map((item) => // actualizamos el detalle
                item.id === producto.id // si el id del item es igual al id del producto
                    ? { ...item, cantidad: item.cantidad + cantidad } // aumentamos la cantidad
                    : item // si no, mantenemos el item igual
                ),
            })
        } else { // caso contrario lo agregamos al detalle
            set({ detalle: [...detalle, { ...producto, cantidad }] }); // si no existe, lo agregamos al detalle con la cantidad
        }
        set ({ cantidades: { ...cantidades, [producto.id]: 0 } }); // actualizamos la cantidad del producto en el objeto cantidades
    },                                      // una vez agregado al detalle, la cantidad vuelve a 0
    
    // funcion para remover un producto del detalle de la venta
    removerProducto : (id) => set((state) =>({ // recibe el id del producto, actualiza el estado
        detalle: state.detalle.filter((item) => item.id !== id) // filtramos el detalle para eliminar el producto con el id recibido
    })), // se uda filter para recorrer el array y devolver un nuevo array sin el producto eliminado

    // funcion para limpiar el detalle de la venta
    limpiarVenta: () => set({
        detalle: [],
        cantidades: {}
    }),

    // funcion para calcular el subtotal de la venta
    subtotal: () => {
        const {detalle } = get(); // obtenemos el detalle del estado
        return detalle.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0); // suma precio x cantidad de cada producto
    }, // reduce es una función que permite reducir un array a un solo valor

    // funcion para calcular el impuesto de la venta
    impuesto: () => get().subtotal() * 0.18, // el impuesto es el 18% del subtotal
    // funcion para calcular el total de la venta
    total: () => get().subtotal() + get().impuesto(), // el total es el subtotal + el impuesto
}))