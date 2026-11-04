/* Sesión 5 — «Arma tu círculo» (página 5 del cuaderno: «Mi círculo y mi postulación») y cierre del curso.
   Usa window.Curso (curso.js). Todo lo de la actividad se guarda en Curso.pagina(5):
   { personas, municipio, municipioOtro, quienes, frecuencia, agendas: [3], nombre, destino, lista } */
(function () {
  'use strict';
  var C = window.Curso, esc = C.esc;
  var p5 = C.pagina(5);
  var cuaderno = C.estado.cuaderno;
  var WA = 'https://wa.me/573206324740?text=';
  var DESTINOS = {
    foro: { a: 'al Foro Municipal de EPA', para: 'para el Foro Municipal de EPA' },
    revista: { a: 'a la revista «Voces que Transforman»', para: 'para la revista «Voces que Transforman»' },
    congreso: { a: 'al Congreso Pedagógico', para: 'para el Congreso Pedagógico' }
  };
  var SESIONES = { 1: 'El PEPA', 2: 'Las EPA', 3: 'Sistematizar', 4: 'Profundizar', 5: 'Círculos' };
  var NS = [1, 2, 3, 4, 5];

  function $(id) { return document.getElementById(id); }
  function valorRadio(name) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }
  function marcarRadio(name, v) { document.querySelectorAll('input[name="' + name + '"]').forEach(function (r) { r.checked = r.value === v; }); }
  function minuscula(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : ''; }
  function unir(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }
  function enlaceWA(t) { return WA + encodeURIComponent(t); }

  var personas = $('c-personas'), municipio = $('c-municipio'), otro = $('c-otro'), campoOtro = $('campo-otro'),
    quienes = $('c-quienes'), nombre = $('c-nombre'), agendas = [$('ag-1'), $('ag-2'), $('ag-3')];

  // Nombre de la experiencia en el cuaderno (página 3 o 2). Se lee sin Curso.pagina(n) para no crear páginas vacías.
  function nombreCuaderno() {
    var p3 = cuaderno.p3, p2 = cuaderno.p2;
    if (p3 && String(p3.nombre || '').trim()) return { t: String(p3.nombre).trim(), pag: 3 };
    if (p2 && String(p2.nombre || '').trim()) return { t: String(p2.nombre).trim(), pag: 2 };
    return null;
  }
  function municipioTexto() { return municipio.value === 'Otro' ? otro.value.trim() : municipio.value; }
  function verOtro() { campoOtro.hidden = municipio.value !== 'Otro'; }
  function numPersonas() { var k = parseInt(personas.value, 10); return k > 0 ? k : 0; }

  // ---------- Restaurar lo guardado ----------
  personas.value = p5.personas || '';
  municipio.value = p5.municipio || '';
  otro.value = p5.municipioOtro || '';
  quienes.value = p5.quienes || '';
  if (Array.isArray(p5.agendas)) agendas.forEach(function (ta, i) { if (typeof p5.agendas[i] === 'string') ta.value = p5.agendas[i]; });
  var deCuaderno = nombreCuaderno();
  if (typeof p5.nombre === 'string') nombre.value = p5.nombre;
  else if (deCuaderno) {
    nombre.value = deCuaderno.t;
    $('nombre-origen').textContent = 'Lo tomamos de la página ' + deCuaderno.pag + ' de tu cuaderno. Puedes ajustarlo.';
  }
  marcarRadio('c-frecuencia', p5.frecuencia);
  marcarRadio('c-destino', p5.destino);
  verOtro();
  [quienes, nombre].concat(agendas).forEach(function (el) { C.contador(el); });

  // ---------- Mensaje para el CEID ----------
  function mensaje() {
    var d = DESTINOS[p5.destino];
    if (!d) return '';
    var n = nombre.value.trim(), m = municipioTexto(), f = valorRadio('c-frecuencia'), k = numPersonas();
    // Saludo como el de los demás botones del sitio; el municipio es donde se reúne el círculo (decisión de Alvaro, 3-11).
    var t = 'Hola, Alvaro. Vengo del curso EPA y PEPA del CEID Cartago. ';
    t += n ? 'Mi experiencia se llama «' + n + '» y quiero llevarla ' + d.a + '. ' : 'Quiero llevar mi experiencia pedagógica ' + d.a + '. ';
    t += '¿Cuáles son los pasos?';
    if (k > 1 || f || m) t += ' También estoy armando un círculo pedagógico' + (k > 1 ? ' de ' + k + ' personas' : '') +
      (m || f ? ' que se reunirá' + (m ? ' en ' + m : '') + (f ? ' ' + minuscula(f) : '') : '') + '.';
    return t;
  }
  function pintarWA() {
    var caja = $('wa-caja'), t = mensaje();
    if (!t) { caja.innerHTML = ''; return; }
    caja.innerHTML = '<div class="aviso wa"><span class="mono">El mensaje que se abrirá en WhatsApp</span><p class="wa-texto">' + esc(t) + '</p></div>' +
      '<div class="acciones"><a class="btn btn-line" href="' + esc(enlaceWA(t)) + '" target="_blank" rel="noopener">Escribir al CEID por WhatsApp</a></div>' +
      '<p class="ayuda-s5">WhatsApp abre el mensaje ya escrito, dirigido al CEID Cartago. Puedes cambiarlo antes de enviarlo.</p>';
  }

  // ---------- Página 5: cuándo queda lista ----------
  function faltantes() {
    var f = [];
    if (!municipioTexto()) f.push(municipio.value === 'Otro' ? 'el nombre del municipio' : 'el municipio');
    if (!valorRadio('c-frecuencia')) f.push('cada cuánto se reúnen');
    var cortas = agendas.filter(function (ta) { return ta.value.trim().length < 15; }).length;
    if (cortas) f.push(cortas === 1 ? 'completar una agenda (al menos una frase)' : 'completar ' + cortas + ' agendas (al menos una frase cada una)');
    if (!DESTINOS[p5.destino]) f.push('elegir el espacio para tu EPA');
    return f;
  }
  function resultado(desplazar) {
    var caja = $('resultado'), f = faltantes();
    if (f.length) {
      caja.innerHTML = '<div class="aviso neutro">Para cerrar la página 5 de tu cuaderno te falta: ' + esc(unir(f)) + '.</div>';
      if (desplazar) C.suave(caja, 'nearest');
      return;
    }
    var d = DESTINOS[p5.destino], k = numPersonas(), q = quienes.value.trim(), t = mensaje();
    p5.agendas = agendas.map(function (ta) { return ta.value; });
    caja.innerHTML = '<div class="resultado"><span class="mono">Página 5 de tu cuaderno · lista</span>' +
      '<h4>Tu círculo se reunirá en ' + esc(municipioTexto()) + ' ' + esc(minuscula(valorRadio('c-frecuencia'))) + '. <span class="it">Tu EPA va ' + esc(d.para) + '.</span></h4>' +
      (k > 1 || q ? '<p>' + (k > 1 ? 'Serán ' + k + ' personas. ' : '') + esc(q) + '</p>' : '') +
      '<p>Sus tres primeras agendas:</p><ol>' + agendas.map(function (ta) { return '<li>' + esc(ta.value.trim()) + '</li>'; }).join('') + '</ol>' +
      '<p><b>Tu siguiente paso:</b> convoca la primera reunión y escribe al CEID para llevar tu EPA ' + esc(d.a) + '. El mensaje ya está escrito.</p>' +
      '<div class="acciones"><a class="btn btn-paper" href="' + esc(enlaceWA(t)) + '" target="_blank" rel="noopener">Escribir al CEID por WhatsApp</a></div></div>';
    p5.lista = p5.lista || new Date().toISOString(); C.guardar();
    C.marcarMomento('hacer');
    pintarFin();
    if (desplazar) C.suave(caja, 'nearest');
  }

  function cambio() { C.guardar(); pintarWA(); if (p5.lista) resultado(false); }
  personas.addEventListener('input', function () { p5.personas = numPersonas() || ''; cambio(); });
  municipio.addEventListener('change', function () { p5.municipio = municipio.value; verOtro(); if (municipio.value === 'Otro') otro.focus(); cambio(); });
  otro.addEventListener('input', function () { p5.municipioOtro = otro.value; cambio(); });
  quienes.addEventListener('input', function () { p5.quienes = quienes.value; C.contador(quienes); cambio(); });
  nombre.addEventListener('input', function () { p5.nombre = nombre.value; C.contador(nombre); cambio(); });
  agendas.forEach(function (ta) {
    ta.addEventListener('input', function () { p5.agendas = agendas.map(function (x) { return x.value; }); C.contador(ta); cambio(); });
  });
  $('frecuencias').addEventListener('change', function () { p5.frecuencia = valorRadio('c-frecuencia'); cambio(); });
  $('destinos').addEventListener('change', function () { p5.destino = valorRadio('c-destino'); cambio(); });
  $('ver-plan').addEventListener('click', function () { resultado(true); });

  // ---------- Cierre del curso: qué falta, o «Terminaste el curso» ----------
  function pintarFin() {
    var caja = $('fin-curso');
    if (!caja) return;
    var sesOk = NS.map(function (n) { return C.sesionCompleta(n); });
    var pagOk = NS.map(function (n) { return C.paginaLista(n); });
    var todo = sesOk.every(Boolean) && pagOk.every(Boolean);
    var t = todo ? mensaje() : '';
    var firma = sesOk.join() + '|' + pagOk.join() + '|' + t;
    if (caja.dataset.firma === firma) return;
    caja.dataset.firma = firma;
    caja.classList.toggle('ok', todo);
    if (todo) {
      var d = DESTINOS[p5.destino];
      caja.innerHTML = '<span class="mono">Curso EPA y PEPA · 5 sesiones · 5 horas</span>' +
        '<h3>Terminaste el curso. <span class="it">Tu EPA ya tiene con quién y dónde.</span></h3>' +
        '<p>Reconociste tu práctica como EPA, la pusiste por escrito, planeaste cómo estudiarla y decidiste con quién y dónde llevarla. Las cinco páginas de tu cuaderno están listas.</p>' +
        '<p>La cartilla dice que uno de los grandes desafíos del PEPA es</p>' +
        '<blockquote class="cita">«rescatar el saber del maestro(a), reivindicar y revalorar su trayectoria, su experiencia y las importantes contribuciones que modestamente hace en las instituciones educativas».<cite>FECODE-CEID, cartilla del PEPA, p. 8</cite></blockquote>' +
        '<p>Eso es lo que hiciste con tu experiencia en estas cinco sesiones.</p>' +
        '<p><b>Tu siguiente paso:</b> convoca la primera reunión de tu círculo' + (d ? ' y escribe al CEID para llevar tu EPA ' + esc(d.a) : '') + '.</p>' +
        (d ? '<div class="acciones"><a class="btn btn-paper" href="' + esc(enlaceWA(t)) + '" target="_blank" rel="noopener">Escribir al CEID por WhatsApp</a></div>' : '');
      return;
    }
    var fs = NS.filter(function (n, i) { return !sesOk[i]; }), fp = NS.filter(function (n, i) { return !pagOk[i]; }), partes = [];
    if (fs.length) partes.push((fs.length === 1 ? 'la sesión ' : 'las sesiones ') + unir(fs.map(String)));
    if (fp.length) partes.push((fp.length === 1 ? 'la página ' : 'las páginas ') + unir(fp.map(String)) + ' del cuaderno');
    caja.innerHTML = '<span class="mono">Cierre del curso</span>' +
      '<h3>Así va tu <span class="it">curso</span></h3>' +
      '<p>Para terminar el curso te ' + (fs.length + fp.length === 1 ? 'falta ' : 'faltan ') + esc(unir(partes)) + '. Cuando todo esté listo, este recuadro se pone verde.</p>' +
      '<div class="fin-cols"><div><h4>Sesiones</h4><ul class="fin-lista">' + NS.map(function (n, i) {
        return '<li class="' + (sesOk[i] ? 'ok' : '') + '"><span class="mono">' + n + '</span>' +
          (sesOk[i] || n === 5 ? '<span>' + esc(SESIONES[n]) + '</span>' : '<a href="sesion-' + n + '.html">' + esc(SESIONES[n]) + '</a>') +
          '<span class="est">' + (sesOk[i] ? 'Completa' : 'Pendiente') + '</span></li>';
      }).join('') + '</ul></div>' +
      '<div><h4>Páginas del cuaderno</h4><ul class="fin-lista">' + NS.map(function (n, i) {
        return '<li class="' + (pagOk[i] ? 'ok' : '') + '"><span class="mono">Pág. ' + n + '</span><span>' + esc(C.PAGINAS[n]) + '</span>' +
          '<span class="est">' + (pagOk[i] ? 'Lista' : 'Falta') + '</span></li>';
      }).join('') + '</ul></div></div>' +
      '<p class="ayuda-s5">Una sesión queda completa cuando haces sus cinco momentos, con el cuestionario aprobado. Si estudiaste en otro teléfono o computador, usa «Recuperar mi avance».</p>';
  }
  // curso.js no avisa cuando cambia el avance: se repinta el cierre después de cada interacción (solo si algo cambió).
  var tFin;
  function programarFin() { clearTimeout(tFin); tFin = setTimeout(pintarFin, 80); }
  ['click', 'change', 'keyup', 'touchend'].forEach(function (ev) { document.addEventListener(ev, programarFin, true); });

  pintarWA();
  if (p5.lista) resultado(false);
  pintarFin();
})();
