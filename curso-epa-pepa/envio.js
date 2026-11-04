/* Envío de los datos de la constancia al CEID (Google Apps Script), con reintento.
   El paquete se guarda en el navegador solo mientras está pendiente; al enviarse se borran los datos personales
   y queda el registro de la constancia (código, nombre y fecha). Usa window.Curso y window.CURSO_CONFIG. */
(function () {
  'use strict';
  var C = window.Curso, cfg = window.CURSO_CONFIG || {};

  function enviar(paquete) {
    if (!cfg.urlScript) return Promise.resolve('sin-url');
    if (!navigator.onLine) return Promise.resolve('sin-red');
    // Apps Script no responde a CORS: se envía como texto plano y sin leer la respuesta (no-cors).
    return fetch(cfg.urlScript, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(paquete) })
      .then(function () { return 'enviado'; }, function () { return 'sin-red'; });
  }

  function reintentar() {
    var cert = C.estado.certificado;
    if (!cert || !cert.pendiente) return Promise.resolve(cert ? cert.envio : null);
    return enviar(cert.pendiente).then(function (r) {
      cert.envio = r;
      if (r === 'enviado') { cert.enviado = new Date().toISOString(); delete cert.pendiente; }
      C.guardar();
      document.dispatchEvent(new CustomEvent('curso:envio', { detail: r }));
      return r;
    });
  }

  window.CursoEnvio = { enviar: enviar, reintentar: reintentar };
  // Si quedó algo pendiente de una visita anterior, se intenta al abrir la página y al volver la conexión.
  reintentar();
  window.addEventListener('online', reintentar);
})();
