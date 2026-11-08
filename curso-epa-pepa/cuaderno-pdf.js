/* Curso EPA y PEPA del CEID Cartago — «Mi cuaderno de EPA» en PDF (8-11-2026).
   Arma en el navegador, con jsPDF, un PDF en tamaño carta con una portada y las cinco páginas del cuaderno,
   a partir de lo que el docente escribió en las actividades (Curso.estado.cuaderno). No se envía nada.

   Uso: en la página, un botón #descargar-cuaderno y, si se quiere, un campo #cu-nombre para el nombre de la portada.
   Si jsPDF no está cargado (portada del curso), se carga de cdnjs al tocar el botón.
   Depende de window.Curso (curso.js). Los textos y rótulos siguen los de las sesiones (act-1.js a act-5.js). */
(function () {
  'use strict';
  var C = window.Curso;
  var boton = document.getElementById('descargar-cuaderno');
  if (!C || !boton) return;
  var est = C.estado, cu = est.cuaderno, RASGOS = C.RASGOS;
  var campoNombre = document.getElementById('cu-nombre');
  var avisoPdf = document.getElementById('cu-aviso');
  var JSPDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

  // Iguales a los de act-4.js y act-5.js.
  var PERMISOS = [
    'Informar a la rectoría o pedir su autorización',
    'Consentimiento informado de las familias (estudiantes menores de edad)',
    'Acuerdo de los propios estudiantes',
    'Consentimiento de los adultos que voy a entrevistar',
    'Autorización escrita de las familias para fotos o grabaciones'
  ];
  var DESTINOS = { foro: 'El Foro Municipal de EPA', revista: 'La revista «Voces que Transforman»', congreso: 'El Congreso Pedagógico' };
  var ZONAS = { urbana: 'Urbana', rural: 'Rural', ambas: 'Urbana y rural' };
  var PARTES = [['enfasis', 'Énfasis'], ['obstaculos', 'Obstáculos'], ['posibilidades', 'Posibilidades'], ['proyecciones', 'Proyecciones']];

  function t(v) { return String(v == null ? '' : v).trim(); }
  // Las fuentes estándar de jsPDF solo traen el juego Windows-1252: lo demás (emojis, flechas) se cambia o se quita.
  var CP1252 = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
  function limpio(s) {
    return String(s == null ? '' : s)
      .replace(/[→⇒➜]/g, '->').replace(/[←⇐]/g, '<-').replace(/[✓✔☑]/g, '(sí)').replace(/[≥]/g, '>=').replace(/[≤]/g, '<=')
      .replace(/\r/g, '').replace(/\t/g, ' ')
      .split('').filter(function (ch) {
        var c = ch.charCodeAt(0);
        return c === 10 || (c >= 32 && c <= 126) || (c >= 160 && c <= 255) || CP1252.indexOf(ch) > -1;
      }).join('').replace(/ {2,}/g, ' ').replace(/ +([.,;:!?)])/g, '$1');
  }
  function fecha(d) {
    var M = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return d.getDate() + ' de ' + M[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function lista(a) { return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }
  function nombreEPA() {
    var p3 = cu.p3 || {}, p2 = cu.p2 || {};
    return t(p3.nombre) || t(p2.nombre) || t((cu.p5 || {}).nombre) || t((cu.p4 || {}).nombre);
  }
  function estadoPagina(n) {
    var p = cu['p' + n];
    if (p && p.lista) return 'Lista';
    var algo = p && Object.keys(p).some(function (k) {
      var v = p[k]; return v && (typeof v !== 'object' || Object.keys(v).length) && t(typeof v === 'object' ? JSON.stringify(v) : v) !== '';
    });
    return algo ? 'Borrador' : 'Sin empezar';
  }

  // ---------- Nombre para la portada ----------
  if (campoNombre) {
    campoNombre.value = t(est.cuadernoNombre) || t(est.certificado && est.certificado.nombre);
    campoNombre.addEventListener('input', function () { est.cuadernoNombre = campoNombre.value; C.guardar(); });
  }
  function autor() { return t(campoNombre ? campoNombre.value : '') || t(est.cuadernoNombre) || t(est.certificado && est.certificado.nombre); }

  // ---------- Cargar jsPDF si hace falta ----------
  function conJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = JSPDF; s.async = true;
      s.onload = function () { window.jspdf && window.jspdf.jsPDF ? ok(window.jspdf.jsPDF) : mal(new Error('jsPDF')); };
      s.onerror = function () { mal(new Error('red')); };
      document.head.appendChild(s);
    });
  }

  // ---------- El documento ----------
  function armar(JsPDF) {
    var doc = new JsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var M = 20, ANCHO = W - 2 * M, ABAJO = H - 22, y = M;
    var VERDE = [23, 102, 51], NOCHE = [11, 46, 22], CLARO = [235, 252, 238], TINTA = [17, 19, 18], GRIS = [85, 91, 88];
    var quien = limpio(autor()), epa = limpio(nombreEPA()), hoy = new Date();

    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function fuente(estilo, tam) { doc.setFont('helvetica', estilo); doc.setFontSize(tam); }
    function alto(tam, lineas) { return lineas * tam * 0.3528 * 1.35; }   // pt a mm, con interlineado 1,35
    var enPagina = 0;   // página del cuaderno que se está escribiendo (0: portada)
    function nuevaHoja() {
      doc.addPage(); y = M;
      if (enPagina) {   // hoja de continuación: rótulo pequeño arriba
        fuente('bold', 8.5); color(GRIS);
        doc.text('PÁGINA ' + enPagina + ' DE 5  ·  ' + limpio(C.PAGINAS[enPagina]).toUpperCase() + ' (CONTINUACIÓN)', M, y + 3);
        y += 9;
      }
    }
    function cabe(h) { if (y + h > ABAJO) nuevaHoja(); }

    // Párrafo con salto de página; «vacio» pinta el texto en gris itálica.
    function parrafo(txt, opc) {
      opc = opc || {};
      var tam = opc.tam || 10.5, vacio = !t(txt);
      var texto = vacio ? (opc.siVacio || 'Sin escribir todavía.') : limpio(t(txt));
      fuente(vacio ? 'italic' : (opc.estilo || 'normal'), tam); color(vacio ? GRIS : (opc.color || TINTA));
      var ancho = ANCHO - (opc.sangria || 0);
      texto.split('\n').forEach(function (bloque, k) {
        var lineas = doc.splitTextToSize(bloque || ' ', ancho);
        lineas.forEach(function (ln) {
          cabe(alto(tam, 1));
          doc.text(ln, M + (opc.sangria || 0), y + tam * 0.3528);
          y += alto(tam, 1);
        });
        if (k < texto.split('\n').length - 1) y += 1;
      });
      y += opc.despues == null ? 3 : opc.despues;
    }
    function rotulo(txt) {
      cabe(alto(8.5, 1) + alto(10.5, 2));
      fuente('bold', 8.5); color(VERDE);
      doc.text(limpio(txt).toUpperCase(), M, y + 8.5 * 0.3528);
      y += alto(8.5, 1) + 0.8;
    }
    function campo(etq, valor, siVacio) { rotulo(etq); parrafo(valor, { siVacio: siVacio }); }
    function subtitulo(txt) {
      cabe(alto(13, 1) + alto(10.5, 3));
      y += 2;
      fuente('bold', 13); color(NOCHE);
      doc.text(limpio(txt), M, y + 13 * 0.3528);
      y += alto(13, 1) + 1.5;
    }
    function cabeceraPagina(n, titulo) {
      enPagina = 0; nuevaHoja(); enPagina = n;
      doc.setFillColor(CLARO[0], CLARO[1], CLARO[2]); doc.rect(0, 0, W, 34, 'F');
      doc.setFillColor(VERDE[0], VERDE[1], VERDE[2]); doc.rect(0, 34, W, 0.8, 'F');
      fuente('bold', 9); color(VERDE);
      doc.text('PÁGINA ' + n + ' DE 5  ·  ' + estadoPagina(n).toUpperCase(), M, 14);
      fuente('bold', 19); color(NOCHE);
      doc.text(limpio(titulo), M, 25);
      y = 44;
    }

    // Portada
    doc.setFillColor(NOCHE[0], NOCHE[1], NOCHE[2]); doc.rect(0, 0, W, 112, 'F');
    doc.setFillColor(VERDE[0], VERDE[1], VERDE[2]); doc.rect(M, 30, 22, 1.2, 'F');
    fuente('bold', 9); doc.setTextColor(173, 233, 185);
    doc.text('CURSO EPA Y PEPA  ·  CEID CARTAGO', M, 24);
    fuente('bold', 32); doc.setTextColor(255, 255, 255);
    doc.text('Mi cuaderno de EPA', M, 52);
    fuente('normal', 13); doc.setTextColor(212, 245, 218);
    doc.splitTextToSize('De la experiencia de aula al proyecto pedagógico alternativo', ANCHO).forEach(function (ln, k) { doc.text(ln, M, 64 + k * 6); });
    y = 128;
    rotulo('Mi experiencia');
    parrafo(epa ? '«' + epa + '»' : '', { tam: 15, estilo: 'bold', color: NOCHE, siVacio: 'Todavía no le has puesto nombre (sesiones 2 y 3).' });
    rotulo('Docente');
    parrafo(quien, { tam: 12, siVacio: 'Escribe tu nombre antes de descargar, si quieres que aparezca aquí.' });
    rotulo('Descargado el');
    parrafo(fecha(hoy), { tam: 12 });
    y += 4;
    rotulo('Contenido');
    var TIT = C.PAGINAS;
    [1, 2, 3, 4, 5].forEach(function (n) {
      var e = estadoPagina(n);
      fuente('normal', 11); color(TINTA);
      doc.text('Página ' + n + '.  ' + limpio(TIT[n]), M, y + 11 * 0.3528);
      fuente(e === 'Lista' ? 'bold' : 'italic', 10); color(e === 'Lista' ? VERDE : GRIS);
      doc.text(e, W - M, y + 11 * 0.3528, { align: 'right' });
      y += alto(11, 1) + 2.2;
      doc.setDrawColor(185, 188, 184); doc.setLineDashPattern([0.6, 0.8], 0); doc.line(M, y - 1.4, W - M, y - 1.4); doc.setLineDashPattern([], 0);
    });
    fuente('normal', 8.5); color(GRIS);
    var pie = doc.splitTextToSize('Curso autoformativo «EPA y PEPA: de la experiencia de aula al proyecto pedagógico alternativo», del Centro de Estudios e Investigaciones Docentes (CEID) de la Subdirectiva SUTEV Cartago · ceidcartago.com/curso-epa-pepa. Este cuaderno se generó en tu navegador con lo que escribiste en el curso; no se envió a ninguna parte.', ANCHO);
    pie.forEach(function (ln, k) { doc.text(ln, M, H - 30 + k * 4); });

    // Página 1
    var p1 = cu.p1 || {};
    cabeceraPagina(1, TIT[1]);
    campo('Una práctica de mi escuela que prepara solo para la prueba', p1.prueba);
    campo('Una práctica de mi escuela que forma sujetos', p1.sujetos);
    campo('En una frase: ¿qué cambiarías?', p1.cambio);

    // Página 2
    var p2 = cu.p2 || {}, r2 = p2.rasgos || {};
    cabeceraPagina(2, TIT[2]);
    campo('Mi experiencia', p2.nombre);
    campo('En una frase: ¿qué hacen y con quiénes?', p2.frase);
    subtitulo('Los rasgos que reconozco y dónde se ven');
    var marcados = Object.keys(r2).map(Number).sort(function (a, b) { return a - b; });
    if (!marcados.length) parrafo('', { siVacio: 'Todavía no marcaste rasgos.' });
    marcados.forEach(function (i) { rotulo((i + 1) + '. ' + RASGOS[i]); parrafo(r2[i], { siVacio: 'Falta el ejemplo de dónde se ve.' }); });
    var crecer2 = RASGOS.map(function (r, i) { return i; }).filter(function (i) { return marcados.indexOf(i) < 0; });
    if (marcados.length && crecer2.length) {
      rotulo('Caminos para crecer');
      parrafo(crecer2.map(function (i) { return '·  ' + (i + 1) + '. ' + RASGOS[i]; }).join('\n'));
    }

    // Página 3
    var p3 = cu.p3 || {}, r3 = p3.rasgos || {}, nar = p3.narrativa || {};
    cabeceraPagina(3, TIT[3]);
    subtitulo('Ficha de registro');
    campo('Nombre de la experiencia', p3.nombre);
    campo('Institución educativa y sede', p3.institucion);
    campo('Municipio', p3.municipio === 'Otro' ? p3.municipioOtro : p3.municipio);
    campo('Zona', ZONAS[p3.zona] || '');
    campo('Grados o nivel', p3.grados);
    campo('¿Desde cuándo?', p3.desde);
    campo('¿Quiénes participan?', p3.participan);
    campo('Origen: ¿qué problema o pregunta la hizo nacer?', p3.origen);
    campo('Propósito: ¿para qué la hacen?', p3.proposito);
    campo('Qué hacen: el proceso', p3.proceso);
    campo('Por qué así: la fundamentación', p3.fundamentacion);
    subtitulo('Ficha de análisis');
    var si = Object.keys(r3).map(Number).sort(function (a, b) { return a - b; });
    if (!si.length) parrafo('', { siVacio: 'Todavía no hay respuestas afirmativas.' });
    si.forEach(function (i) { rotulo((i + 1) + '. ' + RASGOS[i]); parrafo(r3[i], { siVacio: 'Falta el ejemplo de dónde se ve.' }); });
    var crecer3 = RASGOS.map(function (r, i) { return i; }).filter(function (i) { return si.indexOf(i) < 0; });
    if (si.length && crecer3.length) {
      rotulo('Caminos para crecer');
      parrafo(crecer3.map(function (i) { return '·  ' + (i + 1) + '. ' + RASGOS[i]; }).join('\n'));
    }
    subtitulo('Narrativa');
    PARTES.forEach(function (pt) { campo(pt[1], nar[pt[0]]); });

    // Página 4
    var p4 = cu.p4 || {};
    var per = (p4.permisosLista || []).slice().sort().map(function (i) { return PERMISOS[i]; }).filter(Boolean);
    if (t(p4.permisos)) per.push(t(p4.permisos));
    cabeceraPagina(4, TIT[4]);
    campo('Mi experiencia', t(p4.nombre) || nombreEPA());
    campo('Método', p4.metodoNombre);
    campo('Instrumento', p4.instrumentoNombre);
    campo('Mi pregunta de indagación', p4.pregunta);
    campo('¿Qué voy a observar o a preguntar?', p4.observar);
    campo('¿Cuándo y cada cuánto?', p4.cuando);
    campo('¿Cómo lo registro?', p4.registro);
    campo('¿Con quiénes?', p4.quienes);
    campo('Permisos', per.join('. '));
    var ini = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p4.inicio || '');
    if (p4.lista && ini) campo('Desde qué día', fecha(new Date(+ini[1], +ini[2] - 1, +ini[3])));

    // Página 5
    var p5 = cu.p5 || {}, ag = Array.isArray(p5.agendas) ? p5.agendas : [];
    cabeceraPagina(5, TIT[5]);
    subtitulo('Mi círculo pedagógico');
    campo('¿Cuántas personas?', p5.personas);
    campo('¿Dónde se reúnen?', p5.municipio === 'Otro' ? p5.municipioOtro : p5.municipio);
    campo('¿Cada cuánto?', p5.frecuencia);
    campo('¿Quiénes son y qué rol tiene cada uno?', p5.quienes);
    [0, 1, 2].forEach(function (k) { campo('Reunión ' + (k + 1), ag[k]); });
    subtitulo('Mi postulación');
    campo('Mi experiencia', t(p5.nombre) || nombreEPA());
    campo('La llevo a', DESTINOS[p5.destino] || '');

    // Pie y número en las hojas interiores
    var total = doc.getNumberOfPages();
    for (var k = 2; k <= total; k++) {
      doc.setPage(k);
      doc.setDrawColor(185, 188, 184); doc.line(M, H - 15, W - M, H - 15);
      fuente('normal', 8); color(GRIS);
      doc.text(limpio('Mi cuaderno de EPA' + (quien ? ' · ' + quien : '') + ' · Curso EPA y PEPA, CEID Cartago'), M, H - 10);
      doc.text(k + ' / ' + total, W - M, H - 10, { align: 'right' });
    }
    doc.setProperties({ title: 'Mi cuaderno de EPA' + (epa ? ': ' + epa : ''), subject: 'Curso EPA y PEPA del CEID Cartago', author: quien || 'Docente del curso EPA y PEPA', creator: 'ceidcartago.com/curso-epa-pepa' });
    return doc;
  }

  boton.addEventListener('click', function () {
    var antes = boton.textContent;
    boton.disabled = true; boton.textContent = 'Armando tu cuaderno…';
    if (avisoPdf) { avisoPdf.textContent = ''; avisoPdf.hidden = true; }
    conJsPDF().then(function (JsPDF) {
      armar(JsPDF).save('mi-cuaderno-de-epa.pdf');
    }).catch(function () {
      if (avisoPdf) { avisoPdf.textContent = 'No se pudo armar el PDF. Revisa tu conexión a internet e inténtalo de nuevo.'; avisoPdf.hidden = false; }
    }).then(function () { boton.disabled = false; boton.textContent = antes; });
  });
})();
