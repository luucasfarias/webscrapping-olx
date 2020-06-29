/**
 * Objetivo: Fazer web scrapping para monitorar os valores de iphone no OLX
 * 
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const siteTarget = 'https://ma.olx.com.br/regiao-de-sao-luis/celulares/iphone';

const data = [];

const dataRaw = async () => {
  try {
    const response = await axios.get(siteTarget);
    return response.data;
  } catch (error) {
    console.log('Erro ao extrair dados brutos da pagina', error);
  }
}

const listLinks = async () => {
  const htmlPage = await dataRaw();
  const $ = await cheerio.load(htmlPage);
  $('.sc-1fcmfeb-2').contents().each(function(i, link){
    data[i] = $(link).attr('href');
  });

  return data;
}

const getData = async (page) => {
  try {
    const response = await axios.get(page);
    const html = response.data;
    const $ = await cheerio.load(html);
    let nameProduct =$('#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.heHIon > h1').text();
    let priceProduct =$('#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.cpscHx > div.h3us20-5.kXGTwk > div > div.sc-jTzLTM.sc-ksYbfQ.WCwBE > div.sc-jTzLTM.sc-ksYbfQ.sc-12l420o-0.chjgRM > h2').text();
    let initAds =$('#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-1oq8jzc-0.drrPdv').text();
    let codAds =$('#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-16iz3i7-0.fxfcRz').text();
    const result = `
      <h3>Nome produto: ${nameProduct}</h3>
      <h4>Valor produto: ${priceProduct}</h4>
      <h4>${initAds}</h4>
      <h4>${codAds}</h4>
      <h4><a href="${page}">Acessar produto</a></h4>
      <br>
    `

    recordToHTML(result);
    
  } catch (error) {
    console.log('Erro ao coletar dados', error);
  }
}

const recordToHTML = async (result) => {
  fs.writeFileSync('./index.html', result, {flag: 'a+'}, function(error) {
    if (error) {
      console.log('Erro na geração do html', error);
    }
  })
}

const showData = async () => {
  const links = await listLinks();
  links.map(function (linkChildren) {
    getData(linkChildren);
  })
}

exports.main = async () => {
  await showData();
}
