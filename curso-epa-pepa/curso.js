/* Curso EPA y PEPA del CEID Cartago — motor común de las sesiones.
   El avance se guarda en el navegador (localStorage); no hay base de datos.

   Cada página de sesión trae:
   - <body data-sesion="N">
   - los momentos (#abrir, #comprender, #ver, #hacer, #comprobar) con sus marcas [data-estado] y [data-mom];
   - los botones .entendido[data-concepto], la presentación (#d-marco, #d-pista, #d-ant, #d-sig, #d-num, #d-barra, #d-pant);
   - el banco del cuestionario en <script type="application/json" id="banco"> (lista de {p, o, c, e, pag});
   - su actividad en act-N.js, que usa window.Curso.

   Estructura guardada (clave «ceid-curso-epa-pepa»):
   { curso, sesiones: { "1": { momentos, conceptos, diapositiva, cuestionario, intentos, completa } … },
     cuaderno: { p1: {…, lista}, p2: {…}, … }, actualizado } */
(function () {
  'use strict';
  var CLAVE = 'ceid-curso-epa-pepa';
  var MOMENTOS = ['abrir', 'comprender', 'ver', 'hacer', 'comprobar'];
  var SESION = document.body.dataset.sesion;

  var RASGOS = [
    'Los sujetos en el centro', 'Otras racionalidades', 'Se funda en la pedagogía',
    'Procesos dialógicos', 'Conocimiento científico y humanístico', 'Democracia y convivencia',
    'Investigar la propia práctica', 'El estudiante como sujeto crítico', 'El maestro como intelectual'
  ];
  var PAGINAS = {
    1: 'Mi escuela en dos columnas', 2: 'Los rasgos de mi práctica', 3: 'Ficha de registro y narrativa',
    4: 'Mi plan de profundización', 5: 'Mi círculo y mi postulación'
  };

  // ---------- Estado ----------
  var hayAlmacen = true, estado;
  try { estado = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { hayAlmacen = false; estado = {}; }
  estado.curso = 'epa-pepa';
  estado.sesiones = estado.sesiones || {};
  estado.cuaderno = estado.cuaderno || {};
  var s = SESION ? (estado.sesiones[SESION] = estado.sesiones[SESION] || {}) : null;
  if (s) { s.momentos = s.momentos || {}; s.conceptos = s.conceptos || {}; }

  var aviso = document.getElementById('guardado');
  function avisar(t, alerta) { if (!aviso) return; aviso.textContent = t; aviso.classList.toggle('alerta', !!alerta); }
  var tGuardar;
  function guardar() {
    // Aviso para las actividades que repintan algo cuando cambia el avance (por ejemplo, el cierre del curso).
    document.dispatchEvent(new CustomEvent('curso:cambio'));
    clearTimeout(tGuardar);
    tGuardar = setTimeout(function () {
      estado.actualizado = new Date().toISOString();
      try {
        localStorage.setItem(CLAVE, JSON.stringify(estado));
        var h = new Date();
        avisar('Guardado ' + String(h.getHours()).padStart(2, '0') + ':' + String(h.getMinutes()).padStart(2, '0'));
      } catch (e) { avisar('Este navegador no deja guardar: usa «Guardar una copia de mi avance»', true); }
    }, 300);
  }
  if (!hayAlmacen) avisar('Este navegador no deja guardar: usa «Guardar una copia de mi avance»', true);

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function suave(el, bloque) { if (el) el.scrollIntoView({ behavior: 'smooth', block: bloque || 'start' }); }
  function sesionCompleta(n) { var x = estado.sesiones[n]; return !!(x && x.completa); }
  function paginaLista(n) { var p = estado.cuaderno['p' + n]; return !!(p && p.lista); }

  // ---------- Momentos y barra de sesiones ----------
  function marcarMomento(m) {
    if (!s) return;
    if (!s.momentos[m]) { s.momentos[m] = new Date().toISOString(); guardar(); }
    pintarMomentos();
  }
  function pintarPasos() {
    document.querySelectorAll('.pasos [data-sesion]').forEach(function (el) {
      el.classList.toggle('hecho', sesionCompleta(el.dataset.sesion));
    });
  }
  function pintarMomentos() {
    if (!s) { pintarPasos(); return; }
    MOMENTOS.forEach(function (m) {
      var hecho = !!s.momentos[m];
      document.querySelectorAll('[data-estado="' + m + '"]').forEach(function (el) {
        el.textContent = hecho ? 'Hecho' : 'Pendiente';
        el.className = 'estado pill ' + (hecho ? 'pill-claro' : 'pill-line');
      });
      document.querySelectorAll('[data-mom="' + m + '"]').forEach(function (el) { el.className = 'pill ' + (hecho ? 'pill-claro' : 'pill-line'); });
    });
    var completa = MOMENTOS.every(function (m) { return s.momentos[m]; });
    if (completa && !s.completa) { s.completa = new Date().toISOString(); guardar(); }
    var est = $('estado-sesion');
    if (est) { est.textContent = completa ? 'Sesión ' + SESION + ' completa' : 'Sesión en curso'; est.className = 'estado pill ' + (completa ? 'pill-verde' : 'pill-line'); }
    pintarPasos();
  }
  if ($('empezar')) $('empezar').addEventListener('click', function () { marcarMomento('abrir'); suave($('comprender')); });

  // ---------- Conceptos ----------
  var botones = document.querySelectorAll('.entendido');
  function pintarConceptos() {
    botones.forEach(function (b) { var ok = !!(s && s.conceptos[b.dataset.concepto]); b.setAttribute('aria-pressed', ok); b.textContent = ok ? 'Entendido ✓' : 'Entendido'; });
  }
  botones.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.concepto;
      s.conceptos[k] = s.conceptos[k] ? false : new Date().toISOString();
      guardar(); pintarConceptos();
      var todos = Array.prototype.every.call(botones, function (x) { return s.conceptos[x.dataset.concepto]; });
      if (todos) marcarMomento('comprender');
    });
  });

  // ---------- Presentación ----------
  var pista = $('d-pista'), marco = $('d-marco');
  if (pista && marco) {
    var diapos = pista.children.length, actual = 0;
    var irA = function (i) {
      actual = Math.max(0, Math.min(diapos - 1, i));
      pista.style.transform = 'translateX(' + (-100 * actual) + '%)';
      $('d-num').textContent = (actual + 1) + ' / ' + diapos;
      $('d-barra').style.width = ((actual + 1) / diapos * 100) + '%';
      $('d-ant').disabled = actual === 0;
      $('d-sig').disabled = actual === diapos - 1;
      Array.prototype.forEach.call(pista.children, function (d, k) { d.setAttribute('aria-hidden', k !== actual); });
      s.diapositiva = Math.max(s.diapositiva || 0, actual + 1);
      guardar();
      if (actual === diapos - 1) marcarMomento('ver');
    };
    $('d-ant').addEventListener('click', function () { irA(actual - 1); });
    $('d-sig').addEventListener('click', function () { irA(actual + 1); });
    marco.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { irA(actual + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { irA(actual - 1); e.preventDefault(); }
    });
    var x0 = null;
    marco.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    marco.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) irA(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    $('d-pant').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (marco.requestFullscreen) marco.requestFullscreen();
    });
    irA(Math.max(0, (s.diapositiva || 1) - 1));
  }

  // ---------- Cuestionario ----------
  var quiz = $('quiz'), bancoEl = $('banco');
  if (quiz && bancoEl) {
    var BANCO = JSON.parse(bancoEl.textContent);
    var barajar = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var cerrar = function (r) {
      var puntos = Object.keys(r).filter(function (k) { return r[k]; }).length, ok = puntos >= 4;
      var m = document.createElement('div');
      m.className = 'marcador' + (ok ? ' ok' : '');
      m.innerHTML = '<strong>' + puntos + ' / 5</strong><p>' + (ok ? 'Aprobaste el cuestionario de la sesión ' + SESION + '.' : (puntos === 3 ? 'Te faltó una. ' : 'Vale la pena repasar los conceptos y la presentación. ') + 'Puedes intentarlo otra vez con otras preguntas.') + '</p>' +
        '<button class="btn ' + (ok ? 'btn-paper' : 'btn-verde') + '" type="button">' + (ok ? 'Practicar otra vez' : 'Intentar otra vez') + '</button>';
      m.querySelector('button').addEventListener('click', function () { nuevoIntento(); suave(quiz); });
      quiz.appendChild(m);
      s.intentos = (s.intentos || 0) + 1;
      if (ok && (!s.cuestionario || puntos >= s.cuestionario.puntos)) s.cuestionario = { puntos: puntos, fecha: new Date().toISOString() };
      guardar();
      if (ok) marcarMomento('comprobar');
    };
    var nuevoIntento = function () {
      var elegidas = barajar(BANCO.map(function (q, i) { return i; })).slice(0, 5), respuestas = {};
      quiz.innerHTML = '';
      elegidas.forEach(function (qi, n) {
        var q = BANCO[qi], f = document.createElement('div');
        f.className = 'preg-q';
        f.innerHTML = '<fieldset><legend><span class="mono">Pregunta ' + (n + 1) + ' de 5</span>' + esc(q.p) + '</legend><div class="opciones">' +
          q.o.map(function (o, k) { return '<label class="opcion"><input type="radio" name="q' + n + '" value="' + k + '"><span>' + esc(o) + '</span></label>'; }).join('') +
          '</div><div class="explica" aria-live="polite"></div></fieldset>';
        f.addEventListener('change', function (e) {
          var k = +e.target.value; respuestas[n] = k === q.c;
          f.querySelectorAll('input').forEach(function (inp) { inp.disabled = true; });
          f.querySelectorAll('.opcion').forEach(function (op, idx) { if (idx === q.c) op.classList.add('correcta'); else if (idx === k) op.classList.add('incorrecta'); });
          f.querySelector('.explica').innerHTML = '<b>' + (k === q.c ? 'Correcto.' : 'No es esa.') + '</b> ' + esc(q.e) +
            (q.pag ? ' <span class="mono">' + esc(q.fuente || 'Cartilla') + (String(q.pag).indexOf('-') > -1 ? ', pp. ' : ', p. ') + esc(q.pag) + '</span>' : q.fuente ? ' <span class="mono">' + esc(q.fuente) + '</span>' : '');
          if (Object.keys(respuestas).length === 5) cerrar(respuestas);
        });
        quiz.appendChild(f);
      });
    };
    if (s.cuestionario) {
      quiz.innerHTML = '<div class="marcador ok"><strong>' + s.cuestionario.puntos + ' / 5</strong><p>Ya aprobaste este cuestionario. Si quieres, practica con otras preguntas.</p><button class="btn btn-paper" type="button">Practicar otra vez</button></div>';
      quiz.querySelector('button').addEventListener('click', nuevoIntento);
    } else nuevoIntento();
  }

  // ---------- Cuaderno ----------
  function pintarCuaderno() {
    var caja = $('cuaderno-est');
    if (!caja) return;
    var filas = Object.keys(PAGINAS).map(function (n) {
      var p = estado.cuaderno['p' + n], lista = paginaLista(n);
      var borrador = !lista && !!p && Object.keys(p).some(function (k) {
        var v = p[k]; return v && (typeof v !== 'object' || Object.keys(v).length) && String(v).trim() !== '';
      });
      return '<li class="' + (lista ? 'lista' : '') + '"><span class="mono">Pág. ' + n + '</span> ' + esc(PAGINAS[n]) +
        '<span class="cu-est">' + (lista ? 'Lista' : borrador ? 'Borrador' : '—') + '</span></li>';
    }).join('');
    caja.innerHTML = '<ol class="cuaderno-lista">' + filas + '</ol>';
  }

  // ---------- Copia del avance ----------
  if ($('exportar')) $('exportar').addEventListener('click', function () {
    var b = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'mi-avance-curso-epa-pepa.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  if ($('importar')) $('importar').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var lector = new FileReader();
    lector.onload = function () {
      try {
        var d = JSON.parse(lector.result);
        if (d.curso !== 'epa-pepa' || typeof d.sesiones !== 'object') throw new Error('archivo');
        localStorage.setItem(CLAVE, JSON.stringify(d));
        location.reload();
      } catch (err) { avisar('Ese archivo no es una copia del avance de este curso', true); }
    };
    lector.readAsText(f);
  });

  // API para las actividades de cada sesión (act-N.js)
  window.Curso = {
    estado: estado, sesion: s, numero: SESION, RASGOS: RASGOS, PAGINAS: PAGINAS,
    guardar: function () { guardar(); pintarCuaderno(); },
    marcarMomento: marcarMomento, esc: esc, suave: suave,
    pagina: function (n) { return (estado.cuaderno['p' + n] = estado.cuaderno['p' + n] || {}); },
    leerPagina: function (n) { return estado.cuaderno['p' + n] || null; },  // sin crearla vacía
    MUNICIPIOS: ['Cartago', 'Ansermanuevo', 'Alcalá', 'Ulloa', 'El Águila', 'El Cairo', 'Argelia', 'Toro'],
    paginaLista: paginaLista, sesionCompleta: sesionCompleta,
    contador: function (el) {
      var c = document.querySelector('.contador[data-para="' + el.id + '"]');
      if (c) c.textContent = el.value.length + ' / ' + el.maxLength;
    }
  };

  pintarConceptos(); pintarMomentos(); pintarCuaderno();
})();
