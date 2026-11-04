/* Sesión 3 — «Ficha guiada»: ficha de registro, ficha de análisis y narrativa (página 3 del cuaderno).
   Usa window.Curso (curso.js). Trae de la página 2 el nombre y los rasgos con su evidencia, sin modificarla.

   Página 3 guardada en Curso.pagina(3):
   { nombre, institucion, municipio, municipioOtro, zona, grados, desde, participan, origen, proposito, proceso, fundamentacion,
     rasgos: { índice: evidencia } (respuestas «Sí»), todaviaNo: [índices] (respuestas «Todavía no»),
     narrativa: { enfasis, obstaculos, posibilidades, proyecciones }, traidoDeP2, lista } */
(function () {
  'use strict';
  var C = window.Curso, esc = C.esc, RASGOS = C.RASGOS;
  var p2 = (C.leerPagina ? C.leerPagina(2) : C.estado.cuaderno.p2) || {}, r2 = p2.rasgos || {};   // solo lectura: no crea la página 2
  var p3 = C.pagina(3);
  p3.rasgos = p3.rasgos || {};
  p3.todaviaNo = p3.todaviaNo || [];
  p3.narrativa = p3.narrativa || {};

  function $(id) { return document.getElementById(id); }
  function tiene(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function t(v) { return String(v == null ? '' : v).trim(); }
  function parrafos(v) { return esc(t(v)).replace(/\n+/g, '<br>'); }

  // Preguntas de la ficha de análisis: los nueve rasgos de la sesión 2 en forma de sí o no.
  var PREGUNTAS = [
    '¿Tu experiencia parte de quiénes son tus estudiantes y de dónde vienen?',
    '¿Valora algo más que el resultado: el cuidado, la belleza, los afectos, la conversación?',
    '¿Puedes explicar por qué enseñas así, qué idea de cómo se aprende hay detrás?',
    '¿Se aprende conversando: estudiantes, docentes y comunidad preguntan, escuchan y construyen juntos?',
    '¿Circulan saberes de las ciencias o las humanidades, no solo lo que pide la prueba?',
    '¿Tus estudiantes deciden algo en esta experiencia?',
    '¿Registras lo que pasa y lo vuelves a pensar para mejorarlo?',
    '¿Tus estudiantes leen críticamente su entorno y su lugar en la sociedad?',
    '¿Te reconoces, con esta experiencia, como alguien que produce conocimiento?'
  ];
  var PARTES = [['enfasis', 'Énfasis'], ['obstaculos', 'Obstáculos'], ['posibilidades', 'Posibilidades'], ['proyecciones', 'Proyecciones']];
  var CAMPOS = ['nombre', 'institucion', 'municipioOtro', 'grados', 'desde', 'participan', 'origen', 'proposito', 'proceso', 'fundamentacion'];

  // ---------- Lo que viene de la sesión 2 ----------
  // Se copia una sola vez por campo: lo que el docente ya respondió o borró en la página 3 no se vuelve a llenar.
  var traidos = 0, copiado = false;
  if (p3.nombre === undefined && t(p2.nombre)) { p3.nombre = p2.nombre; copiado = true; }
  RASGOS.forEach(function (r, i) {
    if (tiene(p3.rasgos, i) || p3.todaviaNo.indexOf(i) > -1) return;   // ya respondido en la página 3
    // Los rasgos no marcados en la sesión 2 llegan sin respuesta: el docente decide aquí (decisión de Alvaro, 3-11).
    if (tiene(r2, i)) { p3.rasgos[i] = r2[i]; traidos++; copiado = true; }
  });
  if (traidos) p3.traidoDeP2 = p3.traidoDeP2 || new Date().toISOString();
  if (copiado) C.guardar();

  if (t(p2.frase)) {
    var fr = $('frase-p2');
    fr.innerHTML = '<b>Lo que escribiste en la sesión 2:</b> ' + esc(t(p2.frase)) + ' Puedes partir de ahí.';
    fr.hidden = false;
  }
  if (p3.traidoDeP2) {
    var tr = $('traido-p2');
    tr.innerHTML = '<b>Viene de tu página 2:</b> los rasgos que marcaste en la lupa de la sesión 2 y sus ejemplos ya están aquí. Revísalos y mejóralos.';
    tr.hidden = false;
  }

  // ---------- Contadores ----------
  function contar(el) {
    C.contador(el);
    if (!el.classList.contains('con-palabras')) return;
    var c = document.querySelector('.contador[data-para="' + el.id + '"]');
    var n = (el.value.match(/\S+/g) || []).length;
    if (c) c.textContent = n + (n === 1 ? ' palabra · ' : ' palabras · ') + el.value.length + ' / ' + el.maxLength;
  }

  // ---------- Paso 2: ficha de registro ----------
  CAMPOS.forEach(function (k) {
    var el = $('f-' + k);
    if (!el) return;
    el.value = p3[k] || '';
    contar(el);
    el.addEventListener('input', function () { p3[k] = el.value; contar(el); cambio(); });
  });
  var muni = $('f-municipio'), campoOtro = $('campo-otro');
  muni.value = p3.municipio || '';
  if (muni.value !== (p3.municipio || '')) muni.value = '';   // un valor guardado que ya no está en la lista
  campoOtro.hidden = muni.value !== 'Otro';
  muni.addEventListener('change', function () {
    p3.municipio = muni.value;
    campoOtro.hidden = muni.value !== 'Otro';
    if (muni.value === 'Otro') $('f-municipioOtro').focus();
    cambio();
  });
  document.querySelectorAll('input[name="f-zona"]').forEach(function (r) {
    r.checked = p3.zona === r.value;
    r.addEventListener('change', function () { if (r.checked) { p3.zona = r.value; cambio(); } });
  });

  // ---------- Paso 3: ficha de análisis ----------
  var cajaAn = $('analisis');
  function pintarCuenta() {
    var si = Object.keys(p3.rasgos).length, no = p3.todaviaNo.length, sin = 9 - si - no;
    $('an-cuenta').textContent = si + (si === 1 ? ' respuesta afirmativa' : ' respuestas afirmativas') + ' · ' +
      no + ' «todavía no»' + (sin > 0 ? ' · ' + sin + ' sin responder' : '');
  }
  RASGOS.forEach(function (r, i) {
    var si = tiene(p3.rasgos, i), no = p3.todaviaNo.indexOf(i) > -1;
    var f = document.createElement('fieldset');
    f.className = 'mi-rasgo an-rasgo' + (si ? ' activo' : '');
    f.id = 'an-' + i;
    f.innerHTML = '<legend><span class="mono">Rasgo ' + (i + 1) + ' · ' + esc(r) + '</span>' + esc(PREGUNTAS[i]) + '</legend>' +
      '<div class="sino">' +
        '<label><input type="radio" name="an-r' + i + '" value="si"' + (si ? ' checked' : '') + '><span>Sí</span></label>' +
        '<label><input type="radio" name="an-r' + i + '" value="no"' + (no ? ' checked' : '') + '><span>Todavía no</span></label>' +
      '</div>' +
      '<div class="ev"><label class="ayuda" for="an-ev-' + i + '">¿Dónde se ve? Un ejemplo concreto: qué pasa, con quiénes, cuándo.</label>' +
        '<div class="inicios"><span class="mono">Para empezar:</span><button type="button" class="inicio" data-para="an-ev-' + i + '">Se ve cuando…</button></div>' +
        '<textarea id="an-ev-' + i + '" maxlength="280" placeholder="Por ejemplo: Se ve cuando los estudiantes…"></textarea>' +
        '<span class="contador" data-para="an-ev-' + i + '"></span></div>';
    var ta = f.querySelector('textarea');
    ta.value = si ? (p3.rasgos[i] || '') : '';
    f.addEventListener('change', function (e) {
      if (e.target.type !== 'radio') return;
      var k = p3.todaviaNo.indexOf(i);
      if (e.target.value === 'si') {
        p3.rasgos[i] = ta.value;
        if (k > -1) p3.todaviaNo.splice(k, 1);
        f.classList.add('activo');
      } else {
        delete p3.rasgos[i];
        if (k < 0) p3.todaviaNo.push(i);
        f.classList.remove('activo');
      }
      pintarCuenta(); cambio();
    });
    ta.addEventListener('input', function () { p3.rasgos[i] = ta.value; contar(ta); cambio(); });
    cajaAn.appendChild(f);
    contar(ta);
  });
  pintarCuenta();

  // ---------- Paso 4: narrativa ----------
  PARTES.forEach(function (pt) {
    var el = $('nar-' + pt[0]);
    el.value = p3.narrativa[pt[0]] || '';
    contar(el);
    el.addEventListener('input', function () { p3.narrativa[pt[0]] = el.value; contar(el); cambio(); });
  });

  // ---------- Frases para empezar ----------
  $('hacer').addEventListener('click', function (e) {
    var b = e.target.closest('.inicio');
    if (!b) return;
    var el = $(b.dataset.para);
    if (!el) return;
    var frase = b.textContent.replace(/…$/, '').trim() + ' ';
    var previo = el.value.replace(/\s+$/, '');
    var nuevo = previo ? previo + (/[.!?…:]$/.test(previo) ? ' ' : '. ') + frase : frase;
    if (nuevo.length > el.maxLength) { el.focus(); return; }
    el.value = nuevo;
    el.focus();
    el.setSelectionRange(nuevo.length, nuevo.length);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // ---------- Revisión: cuándo queda lista ----------
  function faltan() {
    var f = [];
    if (!t(p3.nombre)) f.push(['f-nombre', 'el nombre de la experiencia']);
    if (!t(p3.institucion)) f.push(['f-institucion', 'la institución educativa']);
    if (!p3.municipio) f.push(['f-municipio', 'el municipio']);
    else if (p3.municipio === 'Otro' && !t(p3.municipioOtro)) f.push(['f-municipioOtro', 'el nombre del municipio (elegiste «Otro»)']);
    if (!t(p3.origen)) f.push(['f-origen', 'el origen: qué problema o pregunta la hizo nacer']);
    if (!t(p3.proposito)) f.push(['f-proposito', 'el propósito: para qué la hacen']);
    if (!t(p3.proceso)) f.push(['f-proceso', 'qué hacen: el proceso']);
    if (!Object.keys(p3.rasgos).length) f.push(['an-0', 'al menos un «Sí» en la ficha de análisis']);
    var cortas = PARTES.filter(function (pt) { return t(p3.narrativa[pt[0]]).length < 40; });
    var hechas = PARTES.length - cortas.length;
    if (hechas < 2) {
      var n = 2 - hechas;
      f.push(['nar-' + cortas[0][0], (n === 1 ? 'una parte más' : 'dos partes') + ' de la narrativa con al menos 40 caracteres' +
        (hechas ? ' (ya tienes lista la de ' + PARTES.filter(function (pt) { return cortas.indexOf(pt) < 0; })[0][1].toLowerCase() + ')' : '')]);
    }
    return f;
  }

  function municipioTxt() { return p3.municipio === 'Otro' ? t(p3.municipioOtro) : t(p3.municipio); }

  function fichaDoc() {
    var fila = function (etq, v, ancho) {
      return '<div' + (ancho ? ' class="ancho"' : '') + '><dt>' + etq + '</dt><dd>' + (t(v) ? parrafos(v) : '<span class="no-dice">Sin escribir todavía.</span>') + '</dd></div>';
    };
    var si = Object.keys(p3.rasgos).map(Number).sort(function (a, b) { return a - b; });
    var crecer = RASGOS.map(function (r, i) { return i; }).filter(function (i) { return si.indexOf(i) < 0; });
    return '<div class="ficha-doc" id="ficha-doc">' +
      '<span class="mono">Mi cuaderno de EPA · Página 3 · Ficha de registro y narrativa</span>' +
      '<h4>Ficha de registro</h4><dl class="ficha-ej">' +
        fila('Nombre de la experiencia', p3.nombre) + fila('Institución', p3.institucion) + fila('Municipio', municipioTxt()) +
        fila('Zona', { urbana: 'Urbana', rural: 'Rural', ambas: 'Urbana y rural' }[p3.zona] || '') + fila('Grados o nivel', p3.grados) + fila('Desde cuándo', p3.desde) +
        fila('Quiénes participan', p3.participan, true) + fila('Origen', p3.origen, true) + fila('Propósito', p3.proposito, true) +
        fila('Qué hacen (el proceso)', p3.proceso, true) + fila('Por qué así (la fundamentación)', p3.fundamentacion, true) +
      '</dl>' +
      '<h4>Ficha de análisis</h4><ul class="doc-rasgos">' +
        si.map(function (i) { return '<li><b>' + (i + 1) + '. ' + esc(RASGOS[i]) + '.</b> ' + (t(p3.rasgos[i]) ? parrafos(p3.rasgos[i]) : '<span class="no-dice">Falta el ejemplo de dónde se ve.</span>') + '</li>'; }).join('') +
      '</ul>' +
      (crecer.length ? '<p class="doc-crecer"><b>Caminos para crecer:</b> ' + crecer.map(function (i) { return (i + 1) + '. ' + esc(RASGOS[i]); }).join(' · ') + '</p>' : '') +
      '<h4>Narrativa</h4>' +
        PARTES.map(function (pt) { return '<h5>' + pt[1] + '</h5><p>' + (t(p3.narrativa[pt[0]]) ? parrafos(p3.narrativa[pt[0]]) : '<span class="no-dice">Sin escribir todavía.</span>') + '</p>'; }).join('') +
      '</div>';
  }

  var mostrado = false;
  function revisar(desplazar) {
    var caja = $('resultado-3'), f = faltan();
    mostrado = true;
    if (f.length) {
      // Una ficha que ya estuvo lista no deja de estarlo si luego se borra algo (decisión de Alvaro, 3-11).
      caja.innerHTML = '<div class="aviso neutro"><b>' + (p3.lista ? 'Tu ficha ya quedó lista, pero ahora están vacíos:' : 'Para dejar lista tu ficha, falta:') + '</b><ul class="faltan">' +
        f.map(function (x) { return '<li><a href="#' + x[0] + '" data-ir="' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('') +
        '</ul><p>Lo demás ya quedó guardado. Toca cada punto para ir al campo.</p></div>';
    } else {
      var abierto = !!($('ficha-ver') && $('ficha-ver').open);
      var si = Object.keys(p3.rasgos).length;
      var partes = PARTES.filter(function (pt) { return t(p3.narrativa[pt[0]]).length >= 40; }).length;
      p3.lista = p3.lista || new Date().toISOString();
      C.guardar();
      C.marcarMomento('hacer');
      caja.innerHTML = '<div class="resultado"><span class="mono">Página 3 de tu cuaderno · lista</span>' +
        '<h4>«' + esc(t(p3.nombre)) + '» ya está <span class="it">por escrito</span>.</h4>' +
        '<p>Tu ficha tiene contexto, propósito y proceso; ' + si + (si === 1 ? ' rasgo con respuesta afirmativa' : ' rasgos con respuesta afirmativa') +
        ', y ' + partes + ' de las 4 partes de la narrativa. La cartilla llama a la ficha de registro «un primer paso para el reconocimiento de las EPA» (p. 53).</p>' +
        '<p>Esta es la ficha que se pedirá para la constancia. Puedes seguir mejorándola cuando quieras: los cambios se guardan solos. En la sesión 4 vas a profundizar en ella.</p></div>' +
        '<details class="ficha-ver" id="ficha-ver"' + (abierto ? ' open' : '') + '><summary>Ver mi ficha completa</summary>' + fichaDoc() + '</details>';
    }
    if (desplazar) C.suave(caja, 'nearest');
  }

  $('resultado-3').addEventListener('click', function (e) {
    var a = e.target.closest('[data-ir]');
    if (!a) return;
    var el = $(a.dataset.ir);
    if (!el) return;
    e.preventDefault();
    if (el.tagName === 'FIELDSET') el = el.querySelector('input') || el;
    C.suave(el, 'center');
    if (el.focus) el.focus({ preventScroll: true });
  });

  // Cada cambio se guarda; si la revisión ya está a la vista, se actualiza sola.
  var tRev;
  function cambio() {
    C.guardar();
    if (!mostrado) return;
    clearTimeout(tRev);
    tRev = setTimeout(function () { revisar(false); }, 700);
  }

  $('revisar').addEventListener('click', function () { revisar(true); });
  if (p3.lista) revisar(false);
})();
