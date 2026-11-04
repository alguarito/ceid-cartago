/* Constancia del curso EPA y PEPA: requisitos, datos del docente, PDF en el navegador y envío al CEID.
   Decisiones de Alvaro (3 y 4-11-2026): sin base de datos; datos que pide el formulario; firma de Alvaro;
   al correo llegan los datos, el código, los puntajes y la ficha de registro; código y QR para verificar;
   la ficha de la sesión 3 se vuelve a revisar al generar la constancia.
   Usa window.Curso (curso.js), window.CURSO_CONFIG (config.js), window.CursoEnvio (envio.js), jsPDF y qrcode-generator. */
(function () {
  'use strict';
  var C = window.Curso, cfg = window.CURSO_CONFIG, est = C.estado, esc = C.esc;
  var $ = function (id) { return document.getElementById(id); };
  var t = function (v) { return String(v == null ? '' : v).trim(); };

  var DOCENTE_DE = ['Preescolar', 'Básica primaria', 'Matemáticas', 'Ciencias naturales', 'Física', 'Química', 'Ciencias sociales',
    'Lenguaje', 'Inglés', 'Tecnología e informática', 'Educación artística', 'Educación física', 'Ética y valores', 'Religión',
    'Filosofía', 'Media técnica', 'Orientación escolar', 'Directivo docente', 'Otro'];
  var TITULOS = ['Normalista superior', 'Licenciatura', 'Profesional (no licenciado)', 'Especialización', 'Maestría', 'Doctorado', 'Otro'];
  var GENEROS = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'];
  var MUNICIPIOS = C.MUNICIPIOS.concat(['Otro']);
  var PARTES = [['enfasis', 'Énfasis'], ['obstaculos', 'Obstáculos'], ['posibilidades', 'Posibilidades'], ['proyecciones', 'Proyecciones']];

  // ---------- Requisitos ----------
  // Misma regla de act-3.js para la ficha de registro, revisada otra vez al emitir la constancia.
  function fichaFaltan(p) {
    var f = [];
    if (!p) return ['la ficha de registro de la sesión 3'];
    if (!t(p.nombre)) f.push('el nombre de la experiencia');
    if (!t(p.institucion)) f.push('la institución');
    if (!t(p.municipio) || (p.municipio === 'Otro' && !t(p.municipioOtro))) f.push('el municipio');
    if (!t(p.origen)) f.push('el origen');
    if (!t(p.proposito)) f.push('el propósito');
    if (!t(p.proceso)) f.push('qué hacen (el proceso)');
    if (!p.rasgos || !Object.keys(p.rasgos).length) f.push('al menos un rasgo con respuesta «Sí» en la ficha de análisis');
    var n = PARTES.filter(function (pt) { return t(p.narrativa && p.narrativa[pt[0]]).length >= 40; }).length;
    if (n < 2) f.push('al menos dos partes de la narrativa (40 caracteres o más cada una)');
    return f;
  }
  function requisitos() {
    var N = [1, 2, 3, 4, 5];
    var sinSesion = N.filter(function (n) { return !C.sesionCompleta(n); });
    var sinQuiz = N.filter(function (n) { var x = est.sesiones[n]; return !(x && x.cuestionario); });
    var p3 = C.leerPagina(3), ficha = fichaFaltan(p3);
    var enlaces = function (a) { return a.map(function (n) { return '<a href="sesion-' + n + '.html">' + n + '</a>'; }).join(', '); };
    var items = [
      [!sinSesion.length, 'Completar las 5 sesiones', sinSesion.length ? 'Falta' + (sinSesion.length > 1 ? 'n las sesiones ' : ' la sesión ') + enlaces(sinSesion) + '.' : ''],
      [!sinQuiz.length, 'Aprobar los 5 cuestionarios (4 de 5 preguntas)', sinQuiz.length ? 'Falta' + (sinQuiz.length > 1 ? 'n los de las sesiones ' : ' el de la sesión ') + enlaces(sinQuiz) + '.' : ''],
      [!ficha.length, 'Ficha de registro de tu EPA con su contenido (sesión 3)', ficha.length ? 'En la <a href="sesion-3.html#hacer">ficha</a> falta: ' + esc(ficha.join('; ')) + '.' : '']
    ];
    $('lista-req').innerHTML = items.map(function (it) {
      return '<li class="' + (it[0] ? 'ok' : '') + '"><span>' + it[1] + (it[2] ? '<br><small>' + it[2] + '</small>' : '') + '</span></li>';
    }).join('');
    var ok = items.every(function (it) { return it[0]; });
    var e = $('estado-req');
    e.textContent = ok ? 'Cumplidos' : 'Pendientes'; e.className = 'estado pill ' + (ok ? 'pill-verde' : 'pill-line');
    $('form-cert').classList.toggle('form-bloqueado', !ok);
    $('form-cert').setAttribute('aria-disabled', !ok);
    return ok;
  }

  // ---------- Formulario ----------
  function opciones(sel, lista) { $(sel).innerHTML = '<option value="">Elige una opción</option>' + lista.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join(''); }
  opciones('d-municipio', MUNICIPIOS); opciones('d-docente', DOCENTE_DE); opciones('d-titulo', TITULOS); opciones('d-genero', GENEROS);
  function otro(sel, campo) { $(campo).hidden = $(sel).value !== 'Otro'; }
  $('d-municipio').addEventListener('change', function () { otro('d-municipio', 'campo-otro-mun'); });
  $('d-docente').addEventListener('change', function () { otro('d-docente', 'campo-otro-doc'); });
  // Se precargan la institución y el municipio de la ficha; se pueden cambiar.
  var p3 = C.leerPagina(3) || {};
  if (t(p3.institucion)) $('d-institucion').value = p3.institucion;
  if (t(p3.municipio) && MUNICIPIOS.indexOf(p3.municipio) > -1) {
    $('d-municipio').value = p3.municipio; otro('d-municipio', 'campo-otro-mun');
    if (p3.municipio === 'Otro') $('d-municipio-otro').value = p3.municipioOtro || '';
  }

  function celularLimpio(v) { return String(v).replace(/[\s\-().]/g, '').replace(/^\+?57/, ''); }
  function validar() {
    var errores = [];
    document.querySelectorAll('.campo.error').forEach(function (c) { c.classList.remove('error'); var m = c.querySelector('.msj-error'); if (m) m.remove(); });
    function mal(id, msj) {
      var c = $(id).closest('.campo'); c.classList.add('error');
      var m = document.createElement('span'); m.className = 'msj-error'; m.textContent = msj; c.appendChild(m);
      errores.push(id);
    }
    if (t($('d-nombre').value).split(/\s+/).length < 2) mal('d-nombre', 'Escribe tu nombre y al menos un apellido.');
    if (t($('d-institucion').value).length < 4) mal('d-institucion', 'Escribe el nombre de tu institución.');
    if (!$('d-municipio').value) mal('d-municipio', 'Elige tu ciudad o municipio.');
    else if ($('d-municipio').value === 'Otro' && !t($('d-municipio-otro').value)) mal('d-municipio-otro', 'Escribe tu ciudad o municipio.');
    if (!$('d-docente').value) mal('d-docente', 'Elige de qué eres docente.');
    else if ($('d-docente').value === 'Otro' && !t($('d-docente-otro').value)) mal('d-docente-otro', 'Escribe de qué eres docente.');
    if (!$('d-titulo').value) mal('d-titulo', 'Elige tu último título.');
    var edad = +$('d-edad').value;
    if (!(edad >= 18 && edad <= 80)) mal('d-edad', 'Escribe tu edad en años (entre 18 y 80).');
    if (!$('d-genero').value) mal('d-genero', 'Elige una opción.');
    if (!/^3\d{9}$/.test(celularLimpio($('d-celular').value))) mal('d-celular', 'Escribe un celular colombiano de 10 dígitos que empiece por 3.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t($('d-correo').value))) mal('d-correo', 'Escribe un correo válido.');
    var caja = $('errores-form');
    if (!$('d-autoriza').checked) { caja.innerHTML = '<div class="aviso neutro">Para generar la constancia necesitamos tu autorización para tratar tus datos.</div>'; errores.push('d-autoriza'); }
    else caja.innerHTML = errores.length ? '<div class="aviso neutro">Revisa los campos marcados.</div>' : '';
    if (errores.length) { var primero = $(errores[0]); if (primero) primero.focus(); }
    return !errores.length;
  }

  // ---------- Código ----------
  function nuevoCodigo() {
    var ab = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = new Uint32Array(6), s = '';
    crypto.getRandomValues(r);
    for (var i = 0; i < 6; i++) s += ab[r[i] % ab.length];
    return 'CEID-EPA-' + new Date().getFullYear() + '-' + s;
  }
  function fechaLarga(iso) { return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)); }

  // ---------- Dibujo de la constancia (A4 horizontal a 300 ppp) ----------
  var ANCHO = 3508, ALTO = 2480, M = 300, TINTA = '#111312', TINTA2 = '#3d4240', GRIS = '#555b58', VERDE = '#0F8841', VERDE7 = '#176633';
  function cargarImagen(src) {
    return new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; });
  }
  function fuentes() {
    return Promise.all(['600 80px "Instrument Sans"', '400 80px "Instrument Sans"', 'italic 400 80px "Instrument Serif"', '500 40px "JetBrains Mono"']
      .map(function (f) { return document.fonts.load(f); })).catch(function () {});
  }
  function lineas(ctx, texto, ancho) {
    var palabras = texto.split(' '), out = [], l = '';
    palabras.forEach(function (p) { var prueba = l ? l + ' ' + p : p; if (ctx.measureText(prueba).width > ancho && l) { out.push(l); l = p; } else l = prueba; });
    if (l) out.push(l);
    return out;
  }
  function parrafo(ctx, texto, x, y, ancho, alto) { lineas(ctx, texto, ancho).forEach(function (l, i) { ctx.fillText(l, x, y + i * alto); }); return lineas(ctx, texto, ancho).length; }

  function dibujar(c) {
    return Promise.all([fuentes(), cargarImagen('../assets/logo-sutev.png'), cargarImagen(cfg.firma)]).then(function (r) {
      var logo = r[1], firma = r[2];
      var lienzo = document.createElement('canvas'); lienzo.width = ANCHO; lienzo.height = ALTO;
      var ctx = lienzo.getContext('2d');
      ctx.fillStyle = '#fbfaf7'; ctx.fillRect(0, 0, ANCHO, ALTO);
      ctx.textBaseline = 'alphabetic';
      var util = ANCHO - 2 * M;

      // Encabezado: sello, marca y código
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(M + 105, 330, 105, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#e2e1db'; ctx.lineWidth = 3; ctx.stroke();
      if (logo) { var lw = 170, lh = lw * logo.height / logo.width; ctx.drawImage(logo, M + 105 - lw / 2, 330 - lh / 2, lw, lh); }
      ctx.fillStyle = TINTA; ctx.font = '600 66px "Instrument Sans"'; ctx.fillText('CEID Cartago', M + 250, 318);
      ctx.fillStyle = GRIS; ctx.font = '400 44px "Instrument Sans"'; ctx.fillText('Subdirectiva SUTEV Cartago', M + 250, 380);
      ctx.textAlign = 'right'; ctx.fillStyle = GRIS; ctx.font = '500 38px "JetBrains Mono"';
      ctx.fillText('CONSTANCIA · ' + c.codigo, ANCHO - M, 318);
      ctx.fillText('Curso autoformativo · ' + cfg.horas + ' horas', ANCHO - M, 380);
      ctx.textAlign = 'left';
      ctx.fillStyle = TINTA; ctx.fillRect(M, 520, util, 4);

      // Cuerpo
      var y = 690;
      ctx.fillStyle = TINTA2; ctx.font = '400 58px "Instrument Sans"';
      y += 74 * parrafo(ctx, 'El Centro de Estudios e Investigaciones Docentes, CEID, de la Subdirectiva SUTEV Cartago hace constar que', M, y, util, 74);
      var tam = 220; ctx.font = '600 ' + tam + 'px "Instrument Sans"';
      while (ctx.measureText(c.nombre).width > util && tam > 110) { tam -= 6; ctx.font = '600 ' + tam + 'px "Instrument Sans"'; }
      ctx.fillStyle = TINTA; y += tam * 0.92; ctx.fillText(c.nombre, M - 6, y);
      y += 130; ctx.fillStyle = TINTA2; ctx.font = '400 58px "Instrument Sans"'; ctx.fillText('participó en y completó el curso autoformativo', M, y);
      y += 128; ctx.fillStyle = VERDE7; ctx.font = 'italic 400 104px "Instrument Serif"';
      y += 108 * (parrafo(ctx, cfg.curso, M, y, util, 108) - 1);
      y += 110; ctx.fillStyle = TINTA2; ctx.font = '400 58px "Instrument Sans"';
      var cierre = 'con una intensidad de ' + cfg.horas + ' horas, en cinco sesiones, y sistematizó la experiencia pedagógica «' + c.epa + '».';
      y += 74 * parrafo(ctx, cierre, M, y, util, 74);

      // Frase reflexiva elegida por Alvaro (4-11-2026): cita verificada de la cartilla del PEPA, p. 53.
      var yf = Math.min(Math.max(y + 120, 1520), 1690);
      ctx.fillStyle = VERDE; ctx.fillRect(M, yf - 56, 6, 112);
      ctx.fillStyle = TINTA; ctx.font = 'italic 400 66px "Instrument Serif"';
      ctx.fillText('«Toda EPA es susceptible de avanzar y potenciarse».', M + 36, yf);
      ctx.fillStyle = GRIS; ctx.font = '500 30px "JetBrains Mono"';
      ctx.fillText('Cartilla del PEPA, FECODE-CEID, p. 53', M + 36, yf + 50);

      // Pie: firma, fecha y QR
      var base = 2150;
      if (firma) {
        var fh = 250, fw = fh * firma.width / firma.height;
        if (fw > 900) { fw = 900; fh = fw * firma.height / firma.width; }
        ctx.drawImage(firma, M, base - 70 - fh, fw, fh);
      }
      ctx.fillStyle = TINTA; ctx.fillRect(M, base - 60, 900, 3);
      ctx.font = '600 50px "Instrument Sans"'; ctx.fillText(cfg.firmante, M, base);
      ctx.fillStyle = GRIS; ctx.font = '400 40px "Instrument Sans"'; ctx.fillText(cfg.cargo, M, base + 58);
      ctx.fillStyle = TINTA2; ctx.font = '400 44px "Instrument Sans"';
      ctx.fillText('Expedida en ' + cfg.ciudad + ',', M + 1080, base - 6);
      ctx.fillText('el ' + fechaLarga(c.fecha) + '.', M + 1080, base + 52);

      var qr = qrcode(0, 'M'); qr.addData(cfg.urlVerificar + '?codigo=' + c.codigo); qr.make();
      var n = qr.getModuleCount(), lado = 330, celda = lado / n, qx = ANCHO - M - lado, qy = base - 380;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(qx - 20, qy - 20, lado + 40, lado + 40);
      ctx.fillStyle = TINTA;
      for (var fi = 0; fi < n; fi++) for (var co = 0; co < n; co++) if (qr.isDark(fi, co)) ctx.fillRect(Math.floor(qx + co * celda), Math.floor(qy + fi * celda), Math.ceil(celda), Math.ceil(celda));
      ctx.textAlign = 'right'; ctx.fillStyle = GRIS; ctx.font = '500 30px "JetBrains Mono"';
      ctx.fillText('Verifica en ceidcartago.com/verificar', ANCHO - M, base + 4);
      ctx.fillText(c.codigo, ANCHO - M, base + 52);
      ctx.textAlign = 'left';

      // Franja verde inferior
      ctx.fillStyle = VERDE; ctx.fillRect(0, ALTO - 110, ANCHO, 110);
      ctx.fillStyle = '#ffffff'; ctx.font = '500 36px "JetBrains Mono"';
      ctx.fillText('ceidcartago.com · CEID · Subdirectiva SUTEV Cartago', M, ALTO - 44);
      // Leyenda exigida para la educación informal (Decreto 1075 de 2015, art. 2.6.6.8; decisión de Alvaro, 4-11-2026).
      ctx.textAlign = 'right'; ctx.fillText('Educación informal. No conduce a título alguno.', ANCHO - M, ALTO - 44); ctx.textAlign = 'left';
      return lienzo;
    });
  }

  function pdf(lienzo, c) {
    var doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.addImage(lienzo.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);
    doc.setProperties({ title: 'Constancia del curso EPA y PEPA · ' + c.nombre, subject: cfg.curso, author: 'CEID Cartago · Subdirectiva SUTEV Cartago', creator: 'ceidcartago.com' });
    doc.save('Constancia-' + c.codigo + '.pdf');
  }

  // ---------- Paquete para el correo ----------
  function paquete(datos, c) {
    var f = C.leerPagina(3) || {};
    var puntajes = {};
    [1, 2, 3, 4, 5].forEach(function (n) { var x = est.sesiones[n]; puntajes['Sesión ' + n] = x && x.cuestionario ? x.cuestionario.puntos + ' / 5' : 'sin aprobar'; });
    return {
      web: datos.web, codigo: c.codigo, fecha: c.fecha, nombre: datos.nombre, institucion: datos.institucion, municipio: datos.municipio,
      docenteDe: datos.docenteDe, titulo: datos.titulo, edad: datos.edad, genero: datos.genero, celular: datos.celular, correo: datos.correo,
      autoriza: true, contacto: datos.contacto, cuestionarios: puntajes,
      ficha: {
        nombre: f.nombre, institucion: f.institucion, municipio: f.municipio === 'Otro' ? f.municipioOtro : f.municipio,
        zona: { urbana: 'Urbana', rural: 'Rural', ambas: 'Urbana y rural' }[f.zona] || '', grados: f.grados, desde: f.desde, participan: f.participan,
        origen: f.origen, proposito: f.proposito, proceso: f.proceso, fundamentacion: f.fundamentacion,
        rasgos: Object.keys(f.rasgos || {}).map(function (i) { return { rasgo: C.RASGOS[i], evidencia: f.rasgos[i] }; }),
        narrativa: PARTES.map(function (pt) { return { parte: pt[1], texto: (f.narrativa || {})[pt[0]] || '' }; })
      }
    };
  }

  // ---------- Resultado y envío ----------
  function pintarEnvio(r) {
    var caja = $('estado-envio'), cert = est.certificado;
    if (!cert) return;
    var txt = {
      enviado: ['aviso envio-ok', 'Tus datos y tu ficha se enviaron al CEID Cartago. Cuando el CEID la revise y la apruebe, tu constancia se podrá verificar en ceidcartago.com/verificar.'],
      'sin-red': ['aviso neutro', 'No hay conexión. Tu constancia ya está generada; tus datos se enviarán al CEID solos la próxima vez que abras el curso con internet.'],
      'sin-url': ['aviso neutro', 'Prototipo: el envío al CEID todavía no está activo (falta publicar el Apps Script). Tu constancia ya está generada y los datos quedan guardados en este navegador para enviarse cuando se active.']
    }[r || cert.envio] || ['aviso neutro', 'Enviando tus datos al CEID…'];
    caja.innerHTML = '<div class="' + txt[0] + '">' + txt[1] + '</div>';
  }
  var lienzoActual = null;
  function mostrar(c, lienzo) {
    lienzoActual = lienzo;
    $('resultado-cert').hidden = false;
    $('codigo-cert').textContent = c.codigo;
    $('vista-cert').src = lienzo.toDataURL('image/jpeg', 0.75);
    pintarEnvio();
  }
  $('descargar-cert').addEventListener('click', function () {
    var c = est.certificado; if (!c) return;
    (lienzoActual ? Promise.resolve(lienzoActual) : dibujar(c)).then(function (l) { pdf(l, c); });
  });
  document.addEventListener('curso:envio', function (e) { pintarEnvio(e.detail); });

  $('form-cert').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!requisitos() || !validar()) return;
    var otroDe = function (sel, txt) { return $(sel).value === 'Otro' ? t($(txt).value) : $(sel).value; };
    var datos = {
      web: $('d-web').value, nombre: t($('d-nombre').value).replace(/\s+/g, ' '), institucion: t($('d-institucion').value),
      municipio: otroDe('d-municipio', 'd-municipio-otro'), docenteDe: otroDe('d-docente', 'd-docente-otro'), titulo: $('d-titulo').value,
      edad: +$('d-edad').value, genero: $('d-genero').value, celular: celularLimpio($('d-celular').value), correo: t($('d-correo').value),
      contacto: $('d-contacto').checked
    };
    var previo = est.certificado;
    var c = { codigo: previo && previo.nombre === datos.nombre ? previo.codigo : nuevoCodigo(), fecha: new Date().toISOString(), nombre: datos.nombre, epa: t((C.leerPagina(3) || {}).nombre) };
    var boton = $('generar-cert'); boton.disabled = true; boton.textContent = 'Generando…';
    dibujar(c).then(function (lienzo) {
      est.certificado = { codigo: c.codigo, fecha: c.fecha, nombre: c.nombre, epa: c.epa, envio: 'pendiente', pendiente: paquete(datos, c) };
      C.guardar();
      mostrar(c, lienzo);
      pdf(lienzo, c);
      C.suave($('resultado-cert'));
      return window.CursoEnvio.reintentar();
    }).then(pintarEnvio).finally(function () { boton.disabled = false; boton.textContent = 'Generar mi constancia'; });
  });

  // ---------- Al abrir ----------
  requisitos();
  if (est.certificado) {
    $('d-nombre').value = est.certificado.nombre;
    dibujar(est.certificado).then(function (l) { mostrar(est.certificado, l); });
  }
  document.addEventListener('curso:cambio', requisitos);
})();
