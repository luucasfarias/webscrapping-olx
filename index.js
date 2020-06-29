const cron = require('node-cron');
const wscrapping = require('./src/scrapping');
const sendmail = require('./src/sendmail');
 
cron.schedule('* * * * *', () => {
  console.log('Executando verificação de 1 em 1 minuto');
  wscrapping.main();
  sendmail.main();
});