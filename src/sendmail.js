const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: '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'
    }
  })
)

const deleteReport = () => {
  try {
    fs.unlinkSync('./index.html');
    console.log('Arquivo excluido');
  } catch (error) {
    console.log('Erro ao excluir relatorio html', error);
  }
}

const sendEmail = () => {
  transporter.sendMail({
    to: 'luucasfarias21@gmail.com',
    from: 'luucasfarias21@gmail.com',
    subject: 'Monitoramento anuncios olx',
    html: ({path: './index.html'})
  })
}

exports.main = async () => {
  await sendEmail();
  await deleteReport();
}
