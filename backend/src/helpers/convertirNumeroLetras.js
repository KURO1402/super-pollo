function numeroALetras(num) {
  const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertir(num) {
    if (num === 0) return 'CERO';
    if (num === 100) return 'CIEN';
    if (num === 1000) return 'MIL';

    let texto = '';

    if (num > 99) {
      const c = Math.floor(num / 100);
      texto += centenas[c] + ' ';
      num %= 100;
    }

    if (num >= 10 && num < 20) {
      texto += especiales[num - 10];
    } else if (num >= 20) {
      const d = Math.floor(num / 10);
      const u = num % 10;
      if (num >= 21 && num <= 29) {
        texto += 'VEINTI' + unidades[u].toLowerCase();
      } else {
        texto += decenas[d];
        if (u > 0) texto += ' Y ' + unidades[u];
      }
    } else if (num > 0) {
      texto += unidades[num];
    }

    return texto.trim().toUpperCase();
  }

  const entero = Math.floor(num);
  const decimales = Math.round((num - entero) * 100);

  let textoEntero = '';

  if (entero >= 1000) {
    const miles = Math.floor(entero / 1000);
    const resto = entero % 1000;
    if (miles === 1) textoEntero += 'MIL ';
    else textoEntero += convertir(miles) + ' MIL ';
    if (resto > 0) textoEntero += convertir(resto);
  } else {
    textoEntero = convertir(entero);
  }

  return `SON ${textoEntero.trim()} CON ${decimales.toString().padStart(2, '0')}/100 SOLES`;
}

module.exports = numeroALetras;