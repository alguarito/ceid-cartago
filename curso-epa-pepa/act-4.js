/* Sesión 4 — «¿Qué método me sirve?»: cuatro preguntas que sugieren un método, un plan de dos semanas
   y un diario de campo de 10 días hábiles para imprimir o descargar. Página 4 del cuaderno.
   Usa window.Curso (curso.js). */
(function () {
  'use strict';
  var C = window.Curso, esc = C.esc, cu = C.estado.cuaderno;
  function $(id) { return document.getElementById(id); }

  // La página 4 entra al cuaderno (Curso.pagina(4)) con lo primero que se escribe;
  // así no figura como «Borrador» por solo abrir la sesión.
  var p4 = cu.p4 || {};
  p4.respuestas = p4.respuestas || {};
  p4.permisosLista = p4.permisosLista || [];
  function guardar() { if (cu.p4 !== p4) p4 = Object.assign(C.pagina(4), p4); C.guardar(); }

  // Los cinco métodos en el orden de la cartilla (p. 54). Las descripciones son del curso.
  var ORDEN = ['socio', 'etno', 'carto', 'iap', 'coti'];
  var METODOS = {
    socio: { n: 'Investigación sociocrítica', art: 'la investigación sociocrítica', d: 'Comprender y transformar relaciones de poder y desigualdades.', instr: ['entrevista', 'diario'] },
    etno: { n: 'Etnografía', art: 'la etnografía', d: 'Describir desde adentro la cultura de un grupo.', instr: ['diario', 'entrevista'] },
    carto: { n: 'Cartografía social', art: 'la cartografía social', d: 'Mapear el territorio con la comunidad y conversar sobre él.', instr: ['diario', 'entrevista'] },
    iap: { n: 'Investigación acción participativa', art: 'la investigación acción participativa', d: 'Investigar y actuar con la comunidad para cambiar algo.', instr: ['diario', 'entrevista'] },
    coti: { n: 'Sociología de la vida cotidiana', art: 'la sociología de la vida cotidiana', d: 'Comprender las rutinas de todos los días y su sentido.', instr: ['historia', 'diario'] }
  };
  var INSTR = {
    diario: { n: 'Diario de campo', art: 'el diario de campo', d: 'Lo que observas, el mismo día, separado de lo que piensas.' },
    historia: { n: 'Historia de vida', art: 'la historia de vida', d: 'La vida de una persona contada por ella misma.' },
    entrevista: { n: 'Entrevista', art: 'la entrevista', d: 'Una conversación preparada, con preguntas abiertas.' }
  };
  // Cada opción suma puntos a uno o dos métodos (máximo posible: 8 por método) y aporta una razón.
  var PREGS = [
    { id: 'q1', p: '¿Qué quieres comprender de tu experiencia?', o: [
      { t: 'El territorio: los lugares, caminos y recursos que rodean la escuela y cómo se relacionan con ella', m: { carto: 3 }, por: 'quieres comprender el territorio y sus relaciones con la escuela' },
      { t: 'Cómo cambiar una situación concreta junto con la comunidad', m: { iap: 3 }, por: 'quieres transformar una situación junto con la comunidad' },
      { t: 'La cultura de mi aula: rutinas, normas no escritas y formas de participar', m: { etno: 3 }, por: 'quieres comprender la cultura de tu aula' },
      { t: 'La vida diaria de mis estudiantes fuera del colegio', m: { coti: 3 }, por: 'quieres comprender la vida diaria de tus estudiantes' },
      { t: 'Quién decide, quién queda por fuera y por qué', m: { socio: 3 }, por: 'quieres comprender las relaciones de poder en tu escuela' }
    ] },
    { id: 'q2', p: '¿Qué te gustaría lograr al terminar?', o: [
      { t: 'Describir con detalle cómo se vive la experiencia por dentro', m: { etno: 2 }, por: 'quieres describir cómo se vive la experiencia por dentro' },
      { t: 'Entender las rutinas de todos los días que parecen normales', m: { coti: 2 }, por: 'quieres entender las rutinas que parecen normales' },
      { t: 'Que la comunidad y yo cambiemos algo juntos', m: { iap: 2 }, por: 'esperas cambiar algo junto con la comunidad' },
      { t: 'Hacer visible una desigualdad para discutirla y transformarla', m: { socio: 2 }, por: 'quieres hacer visible una desigualdad para transformarla' },
      { t: 'Tener un mapa o una memoria del lugar donde está la escuela', m: { carto: 2 }, por: 'quieres un mapa o una memoria del lugar' }
    ] },
    { id: 'q3', p: '¿Con quiénes vas a investigar?', o: [
      { t: 'Con familias, vecinos o sabedores de la comunidad', m: { carto: 1, iap: 1 }, por: 'vas a trabajar con la comunidad' },
      { t: 'Con mis estudiantes, dentro del aula', m: { etno: 1 }, por: 'vas a trabajar con tus estudiantes en el aula' },
      { t: 'Con mis estudiantes, a partir de lo que viven fuera del colegio', m: { coti: 1 }, por: 'te interesa lo que tus estudiantes viven fuera del colegio' },
      { t: 'Con colegas y directivos de mi institución', m: { socio: 1 }, por: 'vas a trabajar con colegas y directivos' }
    ] },
    { id: 'q4', p: '¿Cómo te gustaría recoger la información?', o: [
      { t: 'Observando y escribiendo cada día', m: { etno: 2 }, por: 'prefieres observar y escribir cada día' },
      { t: 'Haciendo recorridos y dibujando mapas con otros', m: { carto: 2 }, por: 'prefieres recorrer y dibujar el territorio con otros' },
      { t: 'Conversando con las personas sobre su día a día y su historia', m: { coti: 2 }, por: 'prefieres conversar sobre el día a día y la historia de las personas' },
      { t: 'Reuniéndonos para decidir y actuar en grupo', m: { iap: 2 }, por: 'prefieres decidir y actuar en grupo' },
      { t: 'Analizando normas, decisiones y quién participa en ellas', m: { socio: 2 }, por: 'prefieres analizar normas y decisiones' }
    ] }
  ];
  var PERMISOS = [
    'Informar a la rectoría o pedir su autorización',
    'Consentimiento informado de las familias (estudiantes menores de edad)',
    'Acuerdo de los propios estudiantes',
    'Consentimiento de los adultos que voy a entrevistar',
    'Autorización escrita de las familias para fotos o grabaciones'
  ];
  var CAMPOS = { pregunta: 'plan-pregunta', observar: 'plan-observar', cuando: 'plan-cuando', registro: 'plan-registro', quienes: 'plan-quienes', permisos: 'plan-permisos' };
  var PLAN = ['observar', 'cuando', 'registro', 'quienes', 'permisos'];

  function lista(a) { return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }
  function frase(t) { return (t || '').trim().length >= 15; }  // un campo cuenta con 15 caracteres o más

  // ---------- La experiencia: nombre traído de las sesiones 3 o 2 (sin crear esas páginas) ----------
  var origen = null;
  [3, 2].some(function (n) { var x = cu['p' + n]; if (x && (x.nombre || '').trim()) { origen = { t: x.nombre.trim(), s: n }; return true; } return false; });
  function nombre() { return origen ? origen.t : (p4.nombre || '').trim(); }
  var mi = $('mi-exp');
  if (origen) {
    mi.innerHTML = '<p class="aviso neutro">Tu experiencia: <b>«' + esc(origen.t) + '»</b>, como la nombraste en la sesión ' + origen.s + '. Hoy diseñas cómo investigarla.</p>';
  } else {
    mi.innerHTML = '<div class="campo"><label for="exp-nombre4">¿Cómo se llama tu experiencia?</label><span class="ayuda">No encontramos el nombre de tu experiencia en este navegador (se escribe en la sesión 2). Escríbelo aquí o recupera tu avance al final de la página.</span>' +
      '<input type="text" id="exp-nombre4" maxlength="90" placeholder="Por ejemplo: La huerta que nos enseña a medir"><span class="contador" data-para="exp-nombre4"></span></div>';
    var en = $('exp-nombre4');
    en.value = p4.nombre || ''; C.contador(en);
    en.addEventListener('input', function () { p4.nombre = en.value; C.contador(en); guardar(); });
    en.addEventListener('change', refrescar);
  }

  // ---------- Paso 1: cuatro preguntas ----------
  var cajaP = $('preguntas-metodo');
  PREGS.forEach(function (q, n) {
    var f = document.createElement('fieldset');
    f.className = 'pq';
    f.innerHTML = '<legend><span class="mono">Pregunta ' + (n + 1) + ' de ' + PREGS.length + '</span>' + esc(q.p) + '</legend><div class="opciones">' +
      q.o.map(function (o, k) { return '<label class="opcion"><input type="radio" name="' + q.id + '" value="' + k + '"' + (p4.respuestas[q.id] === k ? ' checked' : '') + '><span>' + esc(o.t) + '</span></label>'; }).join('') + '</div>';
    f.addEventListener('change', function (e) { p4.respuestas[q.id] = +e.target.value; sugerir(); guardar(); });
    cajaP.appendChild(f);
  });

  function calcular() {
    var puntos = {}, porques = {};
    ORDEN.forEach(function (m) { puntos[m] = 0; porques[m] = []; });
    PREGS.forEach(function (q) {
      var k = p4.respuestas[q.id];
      if (k == null) return;
      var o = q.o[k];
      Object.keys(o.m).forEach(function (m) { puntos[m] += o.m[m]; porques[m].push(o.por); });
    });
    // Empates: primero el método de la pregunta 1 (lo que se quiere comprender), luego el orden de la cartilla.
    var q1 = p4.respuestas.q1 != null ? Object.keys(PREGS[0].o[p4.respuestas.q1].m)[0] : null;
    var orden = ORDEN.slice().sort(function (a, b) {
      return (puntos[b] - puntos[a]) || ((b === q1) - (a === q1)) || (ORDEN.indexOf(a) - ORDEN.indexOf(b));
    });
    var sug = [orden[0]];
    if (puntos[orden[1]] > 0 && puntos[orden[1]] >= puntos[orden[0]] - 1) sug.push(orden[1]);
    return { sug: sug, porques: porques };
  }

  function sugerir() {
    var caja = $('sugerencia');
    var hechas = PREGS.filter(function (q) { return p4.respuestas[q.id] != null; }).length;
    if (hechas < PREGS.length) {
      caja.innerHTML = hechas ? '<div class="aviso neutro">Responde las cuatro preguntas para ver la sugerencia. Llevas ' + hechas + ' de 4.</div>' : '';
      return;
    }
    var r = calcular();
    p4.sugeridos = r.sug;
    if (!p4.metodoManual) ponerMetodo(r.sug[0]);
    marcarSugeridos();
    var html = '<div class="aviso"><span class="mono">Sugerencia</span><p>Te sugerimos <b>' + esc(METODOS[r.sug[0]].art) + '</b>, porque ' + esc(lista(r.porques[r.sug[0]])) + '.</p>';
    if (r.sug[1]) html += '<p>También te puede servir <b>' + esc(METODOS[r.sug[1]].art) + '</b>, porque ' + esc(lista(r.porques[r.sug[1]])) + '.</p>';
    html += '<p>' + (p4.metodoManual
      ? 'En el paso 2 elegiste ' + esc(METODOS[p4.metodo].art) + '. Puedes mantenerlo o cambiarlo.'
      : 'Ya quedó marcada en el paso 2. Si otro método te convence más, cámbialo allí.') + '</p></div>';
    caja.innerHTML = html;
  }

  // ---------- Paso 2: método, instrumento y plan ----------
  var cajaM = $('op-metodo'), cajaI = $('op-instr'), cajaPer = $('op-permisos');
  cajaM.innerHTML = ORDEN.map(function (m) {
    var x = METODOS[m];
    return '<label class="opcion" data-k="' + m + '"><input type="radio" name="metodo" value="' + m + '"' + (p4.metodo === m ? ' checked' : '') + '><span><b>' + esc(x.n) + '</b><em class="sug" hidden>Sugerido</em><small>' + esc(x.d) + '</small></span></label>';
  }).join('');
  cajaI.innerHTML = Object.keys(INSTR).map(function (k) {
    var x = INSTR[k];
    return '<label class="opcion" data-k="' + k + '"><input type="radio" name="instrumento" value="' + k + '"' + (p4.instrumento === k ? ' checked' : '') + '><span><b>' + esc(x.n) + '</b><em class="sug" hidden>Va bien con tu método</em><small>' + esc(x.d) + '</small></span></label>';
  }).join('');
  cajaPer.innerHTML = PERMISOS.map(function (t, i) {
    return '<label class="opcion"><input type="checkbox" value="' + i + '"' + (p4.permisosLista.indexOf(i) > -1 ? ' checked' : '') + '><span>' + esc(t) + '</span></label>';
  }).join('');

  function ponerMetodo(m) {
    p4.metodo = m; p4.metodoNombre = METODOS[m].n;
    var r = cajaM.querySelector('input[value="' + m + '"]');
    if (r) r.checked = true;
    marcarInstr();
  }
  function marcarSugeridos() {
    var sug = p4.sugeridos || [];
    cajaM.querySelectorAll('.opcion').forEach(function (l) { l.querySelector('.sug').hidden = sug.indexOf(l.dataset.k) < 0; });
  }
  function marcarInstr() {
    var ok = p4.metodo ? METODOS[p4.metodo].instr : [];
    cajaI.querySelectorAll('.opcion').forEach(function (l) { l.querySelector('.sug').hidden = ok.indexOf(l.dataset.k) < 0; });
  }
  cajaM.addEventListener('change', function (e) {
    p4.metodoManual = true; ponerMetodo(e.target.value);
    if (p4.sugeridos) sugerir();
    guardar(); refrescar();
  });
  cajaI.addEventListener('change', function (e) {
    p4.instrumento = e.target.value; p4.instrumentoNombre = INSTR[p4.instrumento].n;
    guardar(); refrescar();
  });
  cajaPer.addEventListener('change', function () {
    p4.permisosLista = Array.prototype.map.call(cajaPer.querySelectorAll('input:checked'), function (x) { return +x.value; });
    guardar();
  });
  Object.keys(CAMPOS).forEach(function (k) {
    var el = $(CAMPOS[k]);
    el.value = p4[k] || ''; C.contador(el);
    el.addEventListener('input', function () { p4[k] = el.value; C.contador(el); guardar(); });
    el.addEventListener('change', refrescar);
  });

  // ---------- Paso 3: fechas y diario de campo ----------
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function leer(t) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function habiles(desde) {
    var d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate()), r = [];
    while (r.length < 10) { var w = d.getDay(); if (w > 0 && w < 6) r.push(new Date(d.getTime())); d.setDate(d.getDate() + 1); }
    return r;
  }
  function largo(d) { return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); }
  function corto(d) { return DIAS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3); }
  var inicio = $('plan-inicio');
  inicio.value = p4.inicio || iso(new Date());
  inicio.addEventListener('change', function () { if (leer(inicio.value)) { p4.inicio = inicio.value; guardar(); refrescar(); } });
  function dias() { return habiles(leer(inicio.value) || leer(p4.inicio) || new Date()); }

  function llenos() { return PLAN.filter(function (k) { return frase(p4[k]); }).length; }
  function faltan() {
    var f = [];
    if (!p4.metodo) f.push('elegir el método');
    if (!p4.instrumento) f.push('elegir el instrumento');
    if (!frase(p4.pregunta)) f.push('escribir tu pregunta de indagación en una frase completa');
    var n = llenos();
    if (n < 3) f.push('completar al menos tres campos del plan con una frase (llevas ' + n + ' de 3)');
    return f;
  }

  var cajaR = $('resultado');
  function resultado(desplazar, pedido) {
    var f = faltan();
    if (f.length) {
      cajaR.innerHTML = (pedido || p4.lista) ? '<div class="aviso neutro">Para armar tu diario falta: ' + esc(lista(f)) + '.</div>' : '';
      if (pedido && desplazar) C.suave(cajaR, 'nearest');
      return;
    }
    var ds = dias(), m = METODOS[p4.metodo], i = INSTR[p4.instrumento], nom = nombre();
    p4.inicio = iso(ds[0]); inicio.value = p4.inicio;
    cajaR.innerHTML = '<div class="resultado"><span class="mono">Página 4 de tu cuaderno · lista</span>' +
      '<h4>' + (nom ? '«' + esc(nom) + '»' : 'Tu experiencia') + ' entra en la etapa 2. <span class="it">Ya tienes un plan para investigarla.</span></h4>' +
      '<p>Vas a trabajar con ' + esc(m.art) + ' y ' + esc(i.art) + '. Tu pregunta: «' + esc(p4.pregunta.trim()) + '».</p>' +
      '<p>Tus diez días hábiles van del ' + largo(ds[0]) + ' al ' + largo(ds[9]) + '. Tu diario trae el plan, los diez días y un cierre para leer lo que registraste.</p>' +
      '<div class="crecer">' + ds.map(function (d, k) { return '<span>' + (k + 1) + ' · ' + corto(d) + '</span>'; }).join('') + '</div>' +
      '<div class="acciones"><button class="btn btn-paper" type="button" data-accion="imprimir">Imprimir mi diario</button>' +
      '<button class="btn btn-paper" type="button" data-accion="html">Descargar en HTML</button>' +
      '<button class="btn btn-paper" type="button" data-accion="txt">Descargar en texto</button></div>' +
      '<p class="nota" id="nota-diario" aria-live="polite"></p>' +
      '<p>En la sesión 5 llevarás tu experiencia y este plan a un círculo pedagógico.</p></div>';
    p4.lista = p4.lista || new Date().toISOString();
    guardar();
    C.marcarMomento('hacer');
    if (desplazar) C.suave(cajaR, 'nearest');
  }
  function refrescar() { if (p4.lista) resultado(false, false); }
  $('generar').addEventListener('click', function () { resultado(true, true); });

  // ---------- El diario de campo (HTML para imprimir o descargar, y texto sencillo) ----------
  function filasPlan() {
    var per = p4.permisosLista.slice().sort().map(function (i) { return PERMISOS[i]; });
    var txtPer = (p4.permisos || '').trim();
    return [
      ['Experiencia', nombre() || '(sin nombre)'],
      ['Método', METODOS[p4.metodo].n],
      ['Instrumento', INSTR[p4.instrumento].n],
      ['Pregunta de indagación', (p4.pregunta || '').trim()],
      ['Qué voy a observar o a preguntar', (p4.observar || '').trim()],
      ['Cuándo y cada cuánto', (p4.cuando || '').trim()],
      ['Cómo lo registro', (p4.registro || '').trim()],
      ['Con quiénes', (p4.quienes || '').trim()],
      ['Permisos', per.concat(txtPer ? [txtPer] : []).join('. ')]
    ];
  }
  var RECUERDA = [
    'Ten los permisos firmados antes de observar, entrevistar o grabar.',
    'Escribe el mismo día, mientras lo recuerdas bien.',
    'Separa lo que viste y oíste de lo que piensas de ello.',
    'Usa solo nombres de pila y nunca pongas nombres de estudiantes en los nombres de los archivos.',
    'Guarda el diario en un lugar seguro: son datos personales (Ley 1581 de 2012).'
  ];
  var CIERRE = ['¿Qué se repitió?', '¿Qué me sorprendió?', '¿Qué puedo responder hoy a mi pregunta?', '¿Qué nueva pregunta tengo?'];
  var PIE = 'Curso EPA y PEPA · CEID Cartago · Página 4 del cuaderno: Mi plan de profundización';

  function diarioHTML() {
    var ds = dias();
    var br = function (t) { return esc(t).replace(/\n/g, '<br>'); };
    var lineas = function (n) { var s = ''; for (var k = 0; k < n; k++) s += '<i></i>'; return '<div class="lineas">' + s + '</div>'; };
    var css = '@page{size:A4;margin:14mm 16mm}*{box-sizing:border-box}' +
      'body{margin:0 auto;max-width:178mm;font:10.5pt/1.45 Georgia,"Times New Roman",serif;color:#111312;background:#fff}' +
      '@media screen{body{padding:12mm 6mm}}' +
      '.sup{margin:0 0 2mm;font:8.5pt/1.3 ui-monospace,Menlo,Consolas,monospace;color:#176633}' +
      'h1{margin:0;font:600 26pt/1.05 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:-.02em}' +
      '.sub{margin:2mm 0 0;font:11pt/1.4 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#3d4240}' +
      'table{width:100%;margin:5mm 0;border-collapse:collapse}' +
      'th,td{padding:2mm 2.5mm;border-bottom:1px solid #b9bcb8;text-align:left;vertical-align:top}' +
      'th{width:32%;font:600 9pt/1.35 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
      '.recuerda{margin:0;padding:3mm 4mm;border-left:3px solid #0F8841;background:#EBFCEE;font-size:9.5pt}' +
      '.recuerda ul{margin:1.5mm 0 0;padding-left:5mm}' +
      '.dia,.cierre{margin-top:6mm;padding-top:3mm;border-top:2px solid #111312;break-inside:avoid;page-break-inside:avoid}' +
      '.dia:nth-of-type(odd){break-before:page;page-break-before:always}' +
      'h2{margin:0;font:600 13pt/1.2 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
      'h2 span{display:block;margin-bottom:1mm;font:8.5pt ui-monospace,Menlo,Consolas,monospace;color:#176633}' +
      'h3{margin:2.5mm 0 0;font:600 9.5pt/1.3 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
      '.guia{margin:0;font-size:8.5pt;color:#555b58}' +
      '.dato{display:flex;gap:2mm;margin:2mm 0 0;font:9.5pt/1.3 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
      '.dato i{flex:1;border-bottom:1px solid #b9bcb8}' +
      '.lineas i{display:block;height:6.2mm;border-bottom:1px solid #b9bcb8}' +
      '.pie{margin-top:8mm;font:8pt ui-monospace,Menlo,Consolas,monospace;color:#555b58}' +
      '.no-imprimir{margin:0 0 6mm;padding:3mm 4mm;border-radius:3mm;background:#f1f0ec;font:9.5pt/1.4 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
      '@media print{.no-imprimir{display:none}}';
    var dias10 = ds.map(function (d, k) {
      return '<section class="dia"><h2><span>Día ' + (k + 1) + ' de 10</span>' + esc(largo(d)) + '</h2>' +
        '<p class="dato">Lugar y hora: <i></i></p><p class="dato">Quiénes participaron (solo nombres de pila): <i></i></p>' +
        '<h3>Lo que observé o pregunté</h3><p class="guia">Hechos y palabras textuales, entre comillas.</p>' + lineas(6) +
        '<h3>Lo que pienso de lo que vi</h3><p class="guia">Tus interpretaciones, dudas y relaciones con tu pregunta.</p>' + lineas(3) +
        '<h3>Para la próxima vez</h3>' + lineas(2) + '</section>';
    }).join('');
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Diario de campo · Curso EPA y PEPA</title><style>' + css + '</style></head><body>' +
      '<p class="no-imprimir">Para imprimir, usa Ctrl+P (Cmd+P en Mac) o el menú Archivo &gt; Imprimir. También puedes llenarlo en el computador y guardarlo como PDF.</p>' +
      '<p class="sup">' + esc(PIE) + '</p><h1>Diario de campo</h1>' +
      '<p class="sub">' + (nombre() ? '«' + esc(nombre()) + '» · ' : '') + 'del ' + esc(largo(ds[0])) + ' al ' + esc(largo(ds[9])) + '</p>' +
      '<table>' + filasPlan().map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + br(r[1] || '—') + '</td></tr>'; }).join('') + '</table>' +
      '<div class="recuerda"><b>Antes de empezar</b><ul>' + RECUERDA.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      dias10 +
      '<section class="cierre"><h2><span>Al cerrar las dos semanas</span>Leo mi diario completo</h2>' +
      CIERRE.map(function (t) { return '<h3>' + esc(t) + '</h3>' + lineas(3); }).join('') + '</section>' +
      '<p class="pie">' + esc(PIE) + '</p></body></html>';
  }

  function diarioTexto() {
    var ds = dias(), raya = '______________________________________________________________', sep = '==============================================================';
    var L = ['DIARIO DE CAMPO', PIE, (nombre() ? '«' + nombre() + '» · ' : '') + 'del ' + largo(ds[0]) + ' al ' + largo(ds[9]), '', 'MI PLAN'];
    filasPlan().forEach(function (r) { L.push(r[0] + ': ' + (r[1] || '—').replace(/\s*\n\s*/g, ' ')); });
    L.push('', 'ANTES DE EMPEZAR');
    RECUERDA.forEach(function (t) { L.push('- ' + t); });
    ds.forEach(function (d, k) {
      L.push('', sep, 'DÍA ' + (k + 1) + ' DE 10 · ' + largo(d), sep,
        'Lugar y hora: ' + raya.slice(14), 'Quiénes participaron (solo nombres de pila): ' + raya.slice(44), '',
        'Lo que observé o pregunté (hechos y palabras textuales, entre comillas):', raya, raya, raya, raya, raya, raya, '',
        'Lo que pienso de lo que vi (interpretaciones, dudas, relaciones con mi pregunta):', raya, raya, raya, '',
        'Para la próxima vez:', raya, raya);
    });
    L.push('', sep, 'AL CERRAR LAS DOS SEMANAS: LEO MI DIARIO COMPLETO', sep);
    CIERRE.forEach(function (t) { L.push('', t, raya, raya, raya); });
    return '﻿' + L.join('\r\n') + '\r\n';
  }

  function bajar(contenido, tipo, archivo) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    a.download = archivo;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function nota(t) { var n = $('nota-diario'); if (n) n.textContent = t; }
  cajaR.addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b || faltan().length) return;
    var acc = b.dataset.accion;
    if (acc === 'html') { bajar(diarioHTML(), 'text/html;charset=utf-8', 'diario-de-campo-curso-epa-pepa.html'); nota('Descargaste tu diario en HTML. Ábrelo con el navegador para leerlo o imprimirlo.'); }
    else if (acc === 'txt') { bajar(diarioTexto(), 'text/plain;charset=utf-8', 'diario-de-campo-curso-epa-pepa.txt'); nota('Descargaste tu diario en texto sencillo. Se abre con cualquier editor de texto.'); }
    else if (acc === 'imprimir') {
      var w = window.open('', '_blank');
      if (!w) { nota('Tu navegador bloqueó la ventana para imprimir. Descarga el diario en HTML, ábrelo e imprímelo desde ahí.'); return; }
      w.document.open(); w.document.write(diarioHTML()); w.document.close();
      w.focus();
      setTimeout(function () { w.print(); }, 400);
      nota('Se abrió tu diario en otra pestaña con la ventana de impresión. También puedes guardarlo como PDF.');
    }
  });

  // ---------- Restaurar al recargar ----------
  marcarInstr();
  sugerir();
  marcarSugeridos();
  if (p4.lista) resultado(false, false);
})();
