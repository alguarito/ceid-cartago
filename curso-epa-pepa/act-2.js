/* Sesión 2 — «Lupa de rasgos»: ejemplo resuelto con «Sendero interactivo» y página 2 del cuaderno.
   Usa window.Curso (curso.js). */
(function () {
  'use strict';
  var C = window.Curso, s = C.sesion, esc = C.esc, RASGOS = C.RASGOS;
  var p2 = C.pagina(2);
  p2.rasgos = p2.rasgos || {};

  // Lectura del CEID del fragmento de «Sendero interactivo»: aparece, implícito o no aparece, con su evidencia.
  var LECTURA = [
    ['aparece', 'Participan estudiantes de todos los grados, docentes, padres de familia, vecinos del barrio Santa Ana y miembros de la comunidad.'],
    ['aparece', 'El aprendizaje se vuelve «más humano, más participativo»; se cultivan la cooperación, la responsabilidad y el sentido de pertenencia.'],
    ['implicito', 'Hay una idea de cómo se aprende («del contacto directo con el entorno»), aunque el fragmento no la nombra como pedagogía.'],
    ['aparece', 'Los estudiantes «observan, preguntan, experimentan y dialogan con docentes, familias y sabedores locales».'],
    ['aparece', 'Procesos ecológicos reales (lombricultura, plantas nativas) unidos a «la cultura y la memoria de las comunidades».'],
    ['aparece', '«Docentes, estudiantes y comunidad decidieron convertir esa dificultad en una oportunidad pedagógica».'],
    ['no', 'El fragmento no cuenta cómo se registra y se analiza la práctica. Ahí está el camino para crecer: sistematizarla (sesión 3).'],
    ['aparece', 'Los estudiantes comprenden que el ambiente es «el espacio donde viven, crecen y construyen su futuro».'],
    ['no', 'No aparece de forma explícita en el fragmento. Escribir y publicar la experiencia, como se hizo en la revista, es una forma de ejercerlo.']
  ];

  // ---------- Paso 1: ejemplo resuelto ----------
  var cajaEj = document.getElementById('marcas-ejemplo');
  s.lupaEjemplo = s.lupaEjemplo || [];
  RASGOS.forEach(function (r, i) {
    var l = document.createElement('label');
    l.className = 'marca'; l.dataset.i = i;
    l.innerHTML = '<input type="checkbox" value="' + i + '"' + (s.lupaEjemplo.indexOf(i) > -1 ? ' checked' : '') + '><span>' + (i + 1) + '. ' + esc(r) + '<small class="det"></small></span>';
    cajaEj.appendChild(l);
  });
  function comparar(desplazar) {
    var aciertos = 0;
    cajaEj.querySelectorAll('.marca').forEach(function (l) {
      var i = +l.dataset.i, lec = LECTURA[i], marcada = s.lupaEjemplo.indexOf(i) > -1;
      if (marcada === (lec[0] !== 'no')) aciertos++;
      l.className = 'marca ' + (lec[0] === 'aparece' ? 'aparece' : lec[0] === 'implicito' ? 'implicito' : 'no');
      var txt = { aparece: 'Aparece', implicito: 'Implícito', no: 'No aparece en el fragmento' }[lec[0]];
      l.querySelector('.det').innerHTML = '<span class="veredicto">Lectura del CEID: ' + txt + (marcada ? ' · tú lo marcaste' : '') + '</span>' + esc(lec[1]);
    });
    document.getElementById('comparacion').innerHTML = '<div class="aviso">Coincidiste con la lectura del CEID en <b>' + aciertos + ' de 9</b> rasgos. Fíjate en los que no aparecen: no le restan valor a la experiencia, son <b>caminos para crecer</b>. Y basta uno para que sea una EPA.</div>';
    s.lupaComparada = true; C.guardar();
    if (desplazar) C.suave(document.getElementById('comparacion'), 'nearest');
  }
  cajaEj.addEventListener('change', function () {
    s.lupaEjemplo = Array.prototype.map.call(cajaEj.querySelectorAll('input:checked'), function (x) { return +x.value; });
    C.guardar();
    if (s.lupaComparada) comparar(false);
  });
  document.getElementById('comparar').addEventListener('click', function () { comparar(true); });
  if (s.lupaComparada) comparar(false);

  // ---------- Paso 2: la práctica propia (página 2 del cuaderno) ----------
  var nombre = document.getElementById('exp-nombre'), frase = document.getElementById('exp-frase');
  nombre.value = p2.nombre || ''; frase.value = p2.frase || '';
  [nombre, frase].forEach(function (el) {
    C.contador(el);
    el.addEventListener('input', function () { p2[el === nombre ? 'nombre' : 'frase'] = el.value; C.contador(el); C.guardar(); });
  });
  var cajaMia = document.getElementById('mis-rasgos');
  RASGOS.forEach(function (r, i) {
    var tiene = Object.prototype.hasOwnProperty.call(p2.rasgos, i);
    var d = document.createElement('div');
    d.className = 'mi-rasgo' + (tiene ? ' activo' : '');
    d.innerHTML = '<label><input type="checkbox" value="' + i + '"' + (tiene ? ' checked' : '') + '><span><b>' + (i + 1) + '. ' + esc(r) + '</b></span></label>' +
      '<div class="ev"><label class="ayuda" for="ev-' + i + '">¿Dónde se ve en tu práctica?</label><textarea id="ev-' + i + '" maxlength="280" placeholder="Un ejemplo concreto: qué pasa, con quiénes, cuándo."></textarea></div>';
    var ta = d.querySelector('textarea');
    ta.value = tiene ? p2.rasgos[i] : '';
    d.querySelector('input').addEventListener('change', function (e) {
      if (e.target.checked) { p2.rasgos[i] = ta.value; d.classList.add('activo'); ta.focus(); }
      else { delete p2.rasgos[i]; d.classList.remove('activo'); }
      C.guardar();
    });
    ta.addEventListener('input', function () { p2.rasgos[i] = ta.value; C.guardar(); });
    cajaMia.appendChild(d);
  });
  function resultado(desplazar) {
    var marcados = Object.keys(p2.rasgos).map(Number).sort(function (a, b) { return a - b; });
    var conEjemplo = marcados.filter(function (i) { return (p2.rasgos[i] || '').trim().length >= 15; });
    var caja = document.getElementById('resultado');
    if (!(p2.nombre || '').trim() || conEjemplo.length === 0) {
      caja.innerHTML = '<div class="aviso neutro">Para ver el resultado, escribe el nombre de tu experiencia y marca al menos un rasgo con un ejemplo de dónde se ve (una o dos frases).</div>';
      return;
    }
    var faltan = RASGOS.map(function (r, i) { return i; }).filter(function (i) { return marcados.indexOf(i) < 0; });
    caja.innerHTML = '<div class="resultado"><span class="mono">Página 2 de tu cuaderno · lista</span>' +
      '<h4>«' + esc(p2.nombre.trim()) + '» muestra ' + conEjemplo.length + (conEjemplo.length === 1 ? ' rasgo' : ' rasgos') + '. <span class="it">Es una EPA en construcción.</span></h4>' +
      '<p>La cartilla lo dice así: basta una respuesta afirmativa, porque toda EPA puede avanzar y potenciarse (p. 53). ' +
      (faltan.length ? 'Estos rasgos son caminos para que tu experiencia crezca:' : 'Reconociste los nueve rasgos: en la sesión 3 los vas a poner por escrito.') + '</p>' +
      (faltan.length ? '<div class="crecer">' + faltan.map(function (i) { return '<span>' + (i + 1) + '. ' + esc(RASGOS[i]) + '</span>'; }).join('') + '</div>' : '') +
      '<p>En la sesión 3 convertirás esta página en la ficha de registro de tu EPA.</p></div>';
    p2.lista = p2.lista || new Date().toISOString(); C.guardar();
    C.marcarMomento('hacer');
    if (desplazar) C.suave(caja, 'nearest');
  }
  document.getElementById('ver-resultado').addEventListener('click', function () { resultado(true); });
  if (p2.lista) resultado(false);
})();
