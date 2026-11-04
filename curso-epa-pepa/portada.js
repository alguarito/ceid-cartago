/* Portada del curso: estado de las 5 sesiones, botón «Continuar» y requisitos de la constancia. Usa window.Curso. */
(function () {
  'use strict';
  var C = window.Curso, est = C.estado, N = [1, 2, 3, 4, 5];
  function empezada(n) { var x = est.sesiones[n]; return !!(x && x.momentos && Object.keys(x.momentos).length); }
  var siguiente = N.filter(function (n) { return !C.sesionCompleta(n); })[0];

  document.querySelectorAll('.ses').forEach(function (a) {
    var n = +a.dataset.ses, p = a.querySelector('.ses-est');
    if (C.sesionCompleta(n)) { p.textContent = 'Completa'; p.className = 'ses-est pill pill-claro'; a.classList.add('completa'); }
    else if (empezada(n)) { p.textContent = 'En curso'; p.className = 'ses-est pill pill-verde'; }
    if (n === siguiente && (empezada(n) || N.some(empezada))) a.classList.add('actual');
  });

  var boton = document.getElementById('continuar');
  if (!siguiente) { boton.textContent = 'Repasar el curso'; boton.href = 'sesion-1.html'; }
  else if (N.some(empezada)) { boton.textContent = 'Continuar: sesión ' + siguiente; boton.href = 'sesion-' + siguiente + '.html'; }

  var cumple = {
    sesiones: N.every(C.sesionCompleta),
    cuestionarios: N.every(function (n) { var x = est.sesiones[n]; return !!(x && x.cuestionario); }),
    ficha: C.paginaLista(3)
  };
  document.querySelectorAll('#requisitos [data-req]').forEach(function (li) { li.classList.toggle('ok', !!cumple[li.dataset.req]); });
  var c = document.getElementById('cert-est'), ir = document.getElementById('ir-cert');
  if (est.certificado) {
    c.className = 'aviso cert-est';
    c.textContent = 'Ya generaste tu constancia (' + est.certificado.codigo + '). Puedes volver a descargarla.';
    ir.textContent = 'Ver mi constancia'; ir.className = 'btn btn-verde';
  } else if (cumple.sesiones && cumple.cuestionarios && cumple.ficha) {
    c.className = 'aviso cert-est';
    c.textContent = 'Cumpliste los tres requisitos. Ya puedes generar tu constancia.';
    ir.textContent = 'Obtener mi constancia'; ir.className = 'btn btn-verde';
  }
})();
