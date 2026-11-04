/* Configuración de la constancia del curso EPA y PEPA.
   urlScript: dirección de la aplicación web de Google Apps Script que Alvaro publicó desde su cuenta
   (ver ../apps-script/LEEME.md). Recibe los datos de cada constancia (envio.js) y responde a la
   verificación por código (verificar.html). Si estuviera vacía, la constancia se genera igual y el
   envío queda pendiente en el navegador del docente. */
window.CURSO_CONFIG = {
  urlScript: 'https://script.google.com/macros/s/AKfycby3BRkJO7DXtefBGg3nPDrf7GY8S5uLFSXLaSCrzwuRi8I6nyDnjdZzGlGv6NYoCZGuXw/exec',
  urlVerificar: 'https://ceidcartago.com/verificar.html',
  firma: 'firma.png',
  firmante: 'Alvaro Cardenas Orozco',
  cargo: 'Secretario del CEID · Subdirectiva SUTEV Cartago',
  curso: 'EPA y PEPA: de la experiencia de aula al proyecto pedagógico alternativo',
  horas: 5,
  ciudad: 'Cartago, Valle del Cauca'
};
