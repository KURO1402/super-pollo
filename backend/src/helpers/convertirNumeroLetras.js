function numeroALetras(num) {
    const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    const miles = ['', 'MIL', 'DOS MIL', 'TRES MIL', 'CUATRO MIL', 'CINCO MIL', 'SEIS MIL', 'SIETE MIL', 'OCHO MIL', 'NUEVE MIL'];

    // Función para convertir número a letras
    function convertir(num) {
        if (num === 0) return 'CERO';
        if (num === 100) return 'CIEN';

        let texto = '';
        const c = Math.floor(num / 100);
        const d = Math.floor((num % 100) / 10);
        const u = num % 10;

        // Miles
        if (Math.floor(num / 1000) > 0) {
            texto += miles[Math.floor(num / 1000)] + ' ';
            num %= 1000; // Restamos los miles ya convertidos
        }

        // Centenas
        if (Math.floor(num / 100) > 0) {
            texto += centenas[Math.floor(num / 100)] + ' ';
            num %= 100; // Restamos las centenas ya convertidas
        }

        // Decenas
        if (num >= 20) {
            texto += decenas[Math.floor(num / 10)] + ' ';
            num %= 10; // Restamos las decenas ya convertidas
        } else if (num >= 10) {
            texto += especiales[num - 10] + ' ';
            num = 0;
        }

        // Unidades (No agregamos "Y" si es un número entre 1 y 9)
        if (num > 0) {
            if (d > 0) {
                texto += 'Y ' + unidades[num] + ' ';
            } else {
                texto += unidades[num] + ' ';
            }
        }

        return texto.trim();
    }

    const entero = Math.floor(num);
    const decimales = Math.round((num - entero) * 100);

    // Manejo de los decimales
    return `SON ${convertir(entero)} CON ${decimales.toString().padStart(2, '0')}/100 SOLES`;
}