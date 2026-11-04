/* Sesión 1 — «Dos columnas»: diez prácticas para ubicar y comparar con la lectura del CEID,
   y la página 1 del cuaderno («Mi escuela en dos columnas»). Usa window.Curso (curso.js). */
(function () {
  'use strict';
  var C = window.Curso, s = C.sesion, esc = C.esc;
  var p1 = C.pagina(1);
  s.columnas = s.columnas || {};
  function $(id) { return document.getElementById(id); }

  var ETQ = { prueba: 'Prepara solo para la prueba', sujetos: 'Forma sujetos', depende: 'Depende de cómo se haga' };

  // Diez prácticas con la lectura del CEID: «prueba», «sujetos» o «depende» (ambigua), con su idea de la cartilla.
  var PRACTICAS = [
    { t: 'Viernes de cuadernillo', d: 'Cada viernes, de 9.º a 11.º, la jornada se dedica a responder preguntas tipo Saber. El puntaje de cada curso se publica en la cartelera.', l: 'prueba',
      e: 'La prueba ocupa el tiempo de las clases y el puntaje se vuelve la meta. Es lo que advierte la cartilla: las evaluaciones estandarizadas «condicionan el currículo a los parámetros y reglas que ellas evalúan» (p. 21).' },
    { t: 'La quebrada de la vereda', d: 'Los estudiantes de 7.º averiguan con sus familias por qué se está secando la quebrada, miden el caudal y presentan propuestas a la junta de acción comunal.', l: 'sujetos',
      e: 'Une el saber de la escuela con el de la comunidad y pone a los estudiantes a actuar sobre su territorio. La cartilla propone un currículo capaz de «integrar el conocimiento escolar con el conocimiento popular», con «los proyectos de aula» como una de sus formas (p. 33).' },
    { t: 'Asamblea de curso', d: 'Cada mes el curso se reúne en asamblea: revisa la convivencia, propone actividades y vota los acuerdos que su representante lleva al consejo estudiantil.', l: 'sujetos',
      e: 'Los estudiantes participan y deciden. La cartilla pide fortalecer el gobierno escolar y el consejo estudiantil «en el marco de la participación con capacidad de decisión» (p. 30).' },
    { t: 'Un simulacro que se conversa', d: 'Después de un simulacro tipo Saber, la docente revisa con el curso las preguntas más falladas, discuten por qué y eligen un tema para estudiarlo a fondo.', l: 'depende',
      e: 'Aquí el simulacro sirve para pensar y decidir con los estudiantes, cerca de lo que la cartilla llama «evaluar para aprender» (p. 34). Si solo sirviera para entrenar respuestas y subir el puntaje, iría en la primera columna.' },
    { t: 'Menos artes en 11.º', d: 'En el segundo semestre de grado 11 se recortan las horas de artes y de educación física para reforzar las áreas que evalúa la prueba.', l: 'prueba',
      e: 'Se recorta lo que la prueba no mide. La cartilla pide un currículo que eduque también «en las artes y la cultura, la recreación y el deporte» (p. 31).' },
    { t: 'Tabletas con plataforma', d: 'La institución recibió tabletas con una plataforma de ejercicios, y los estudiantes la usan en la clase de matemáticas.', l: 'depende',
      e: 'La tecnología no decide sola. La cartilla critica su uso «al servicio del modelo de la educación por competencias» y propone usarla «como medio de exploración para la comunicación, la innovación y la creatividad» (p. 24). Depende de lo que se haga con ella.' },
    { t: 'Un debate con datos', d: 'En sociales, los estudiantes comparan dos noticias opuestas sobre el arreglo de la vía a la vereda, buscan datos y debaten qué le propondrían al concejo municipal.', l: 'sujetos',
      e: 'Leen su realidad con argumentos y toman posición. Para la cartilla, la intención del currículo es «la formación de personas críticas, con capacidad para comprender el devenir de la historia» (p. 32).' },
    { t: 'Planeación al pie de la prueba', d: 'Las planeaciones se arman copiando estándares e indicadores, y los temas que no salen en la prueba se dejan para cuando haya tiempo.', l: 'prueba',
      e: 'Lo que se enseña lo decide lo que se mide, y el maestro queda como quien llena un formato. La cartilla describe cómo el Estado fue «reemplazando contenidos y objetos de conocimiento por competencias, estándares, desempeños e indicadores de logro» (p. 16).' },
    { t: 'El plan de mejoramiento', d: 'Con los resultados de la prueba, el consejo académico arma el plan de mejoramiento del año.', l: 'depende',
      e: 'Si el plan solo busca subir el puntaje, manda la prueba. Si los docentes leen esos resultados junto con la vida de sus estudiantes, puede servir a la escuela. La cartilla critica los programas que desconocen «las realidades socio-educativas y económicas de los estudiantes» (p. 23).' },
    { t: 'La lista de los que perdieron', d: 'Al cierre del periodo se lee en voz alta la lista de quienes perdieron, y el boletín solo trae la nota, sin decir qué mejorar.', l: 'prueba',
      e: 'Evaluar se vuelve clasificar y sancionar, la misma lógica de una prueba que solo ordena puntajes. Para la cartilla, la evaluación «no puede ser sancionatoria ni clasificatoria» (p. 34).' }
  ];

  // ---------- Paso 1: ubicar las diez prácticas ----------
  var caja = $('practicas');
  PRACTICAS.forEach(function (pr, i) {
    var d = document.createElement('div');
    d.className = 'practica'; d.dataset.i = i;
    d.setAttribute('role', 'group'); d.setAttribute('aria-labelledby', 'pr-t-' + i);
    d.innerHTML = '<span class="n">Práctica ' + (i + 1) + '</span><h4 id="pr-t-' + i + '">' + esc(pr.t) + '</h4><p>' + esc(pr.d) + '</p>' +
      '<div class="col-op">' + ['prueba', 'sujetos'].map(function (k) {
        return '<label class="op-' + k + '"><input type="radio" name="pr-' + i + '" value="' + k + '"' + (s.columnas[i] === k ? ' checked' : '') + '><span>' + ETQ[k] + '</span></label>';
      }).join('') + '</div><div class="det"></div>';
    caja.appendChild(d);
  });

  function pintarOpciones() {
    caja.querySelectorAll('.col-op label').forEach(function (l) { l.classList.toggle('elegida', l.querySelector('input').checked); });
  }
  function pintarColumnas() {
    var html = ['prueba', 'sujetos'].map(function (k) {
      var items = PRACTICAS.map(function (pr, i) { return i; }).filter(function (i) { return s.columnas[i] === k; });
      return '<div class="c-' + k + '"><h4><span class="mono">Tu columna ' + (k === 'prueba' ? '1' : '2') + ' · ' + items.length + '</span>' + ETQ[k] + '</h4>' +
        (items.length ? '<ul>' + items.map(function (i) { return '<li>' + esc(PRACTICAS[i].t) + '</li>'; }).join('') + '</ul>' : '<p class="vacia">Todavía vacía.</p>') + '</div>';
    }).join('');
    var faltan = sinUbicar();
    $('dos-col').innerHTML = html;
    $('sin-ubicar').textContent = faltan ? 'Sin ubicar: ' + faltan + ' de ' + PRACTICAS.length : 'Ubicaste las ' + PRACTICAS.length + ' prácticas.';
  }
  function sinUbicar() { return PRACTICAS.filter(function (pr, i) { return !s.columnas[i]; }).length; }

  function comparar(desplazar) {
    var out = $('comparacion-col'), faltan = sinUbicar();
    if (faltan) {
      out.innerHTML = '<div class="aviso neutro">Te ' + (faltan === 1 ? 'falta 1 práctica' : 'faltan ' + faltan + ' prácticas') + ' por ubicar. Elige una columna en cada tarjeta y vuelve a comparar.</div>';
      if (desplazar) C.suave(out, 'nearest');
      return;
    }
    var claras = 0, coinciden = 0;
    caja.querySelectorAll('.practica').forEach(function (d) {
      var i = +d.dataset.i, pr = PRACTICAS[i], mia = s.columnas[i], nota;
      d.className = 'practica l-' + pr.l;
      if (pr.l === 'depende') nota = 'la pusiste en «' + ETQ[mia] + '», y se puede defender';
      else {
        claras++;
        if (mia === pr.l) { coinciden++; nota = 'coincides'; } else nota = 'tú la pusiste en «' + ETQ[mia] + '»';
      }
      d.querySelector('.det').innerHTML = '<span class="veredicto">Lectura del CEID: ' + ETQ[pr.l] + ' · ' + esc(nota) + '</span>' + esc(pr.e);
    });
    var ambiguas = PRACTICAS.length - claras;
    out.innerHTML = '<div class="aviso">Coincidiste con la lectura del CEID en <b>' + coinciden + ' de ' + claras + '</b> prácticas claras. Las otras ' + ambiguas +
      ' <b>dependen de cómo se hagan</b>: un simulacro, una plataforma o un plan de mejoramiento pueden servir solo a la prueba o a la formación. Esa es la pregunta que el PEPA le hace a cada práctica: <b>¿para qué y para quién?</b></div>';
    s.columnasComparadas = true; C.guardar();
    if (desplazar) C.suave(out, 'nearest');
  }

  caja.addEventListener('change', function (e) {
    var tarjeta = e.target.closest('.practica');
    if (!tarjeta) return;
    s.columnas[+tarjeta.dataset.i] = e.target.value;
    C.guardar(); pintarOpciones(); pintarColumnas();
    if (s.columnasComparadas) comparar(false);
  });
  $('comparar-col').addEventListener('click', function () { comparar(true); });
  pintarOpciones(); pintarColumnas();
  if (s.columnasComparadas) comparar(false);

  // ---------- Paso 2: la escuela propia (página 1 del cuaderno) ----------
  var CAMPOS = { prueba: $('col-prueba'), sujetos: $('col-sujetos'), cambio: $('col-cambio') };
  var mostrado = false;
  Object.keys(CAMPOS).forEach(function (k) {
    var el = CAMPOS[k];
    el.value = p1[k] || '';
    C.contador(el);
    el.addEventListener('input', function () { p1[k] = el.value; C.contador(el); C.guardar(); });
    // Si la página ya se mostró, se actualiza al salir del campo (no en cada tecla, para no saturar el lector de pantalla).
    el.addEventListener('change', function () { if (mostrado) resultado(false); });
  });
  function listo() { return (p1.prueba || '').trim().length >= 15 && (p1.sujetos || '').trim().length >= 15; }
  function resultado(desplazar) {
    var out = $('resultado');
    if (!listo()) {
      out.innerHTML = '<div class="aviso neutro">Para ver tu página 1, describe una práctica en cada columna: una o dos frases, de al menos 15 caracteres cada una.</div>';
      if (desplazar) C.suave(out, 'nearest');
      return;
    }
    var cambio = (p1.cambio || '').trim();
    out.innerHTML = '<div class="resultado"><span class="mono">Página 1 de tu cuaderno · lista</span>' +
      '<h4>Mi escuela en dos columnas. <span class="it">Ya la miras con los ojos del PEPA.</span></h4>' +
      '<div class="res-cols"><div><span class="mono">Columna 1 · ' + ETQ.prueba + '</span><p>' + esc(p1.prueba.trim()) + '</p></div>' +
      '<div><span class="mono">Columna 2 · ' + ETQ.sujetos + '</span><p>' + esc(p1.sujetos.trim()) + '</p></div></div>' +
      (cambio ? '<p class="cambio"><b>Lo que cambiaría:</b> ' + esc(cambio) + '</p>' : '<p>Te falta la frase de lo que cambiarías. Escríbela cuando la tengas: se guarda sola.</p>') +
      '<p>Para la cartilla, la escuela es «el territorio de empoderamiento del PEPA» (p. 29). La práctica de tu segunda columna puede ser el comienzo de una EPA: en la sesión 2 la vas a mirar con la lupa de los nueve rasgos.</p></div>';
    p1.lista = p1.lista || new Date().toISOString(); C.guardar();
    C.marcarMomento('hacer');
    mostrado = true;
    if (desplazar) C.suave(out, 'nearest');
  }
  $('ver-resultado').addEventListener('click', function () { resultado(true); });
  if (p1.lista) resultado(false);
})();
