const cheerio = require('cheerio');
const fs = require('fs')

const filters = {
    prijs: 1200,
    kilometerTeller: 150000,
    bouwjaar: null,
}

const baseUrl = "https://www.schadeautos.nl/nl/zoek/schade/personenautos/1/1/0/0/0/0/1/";


async function scrapePage(pageNum) {
    const allResults = []

    const res = await fetch(`${baseUrl}${pageNum}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const voertuigen = $('[data-href^="/nl/schade/personenautos/"]')
    if (voertuigen.length === 0) return "geen voertuigen meer";

    voertuigen.each((_, el) => {
        const priceElement = $(el).find(".price")
        const priceLabel = $(el).find('.label .label-price')
        if(priceElement.length === 0 && priceLabel.length === 0){
            return
        }


        let detailsvehicule = $(el).find('.details')
        
        
        let details = {
            name: (`${$(el).find('h2 a').text()} - ${$(el).find('.model-type').text().replaceAll(',', ' ')}`).replace(/\r?\n|\r/g, ' ').trim(),
            price: priceElement.length === 0 ? verAmerikaanseerder(priceLabel.text().trim().split(' ')[1]) : verAmerikaanseerder(priceElement.text().split(' ')[1]),
            bouwjaar: verAmerikaanseerder(detailsvehicule.find("[title='1ste toelating']").text()),
            brandstof: detailsvehicule.find("[title=brandstof]").text().trim() || 'N/A',
            kilometerTeller: verAmerikaanseerder(detailsvehicule.find("[title=tellerstand]").text()),
            link: `www.schadeautos.nl${$(el).attr("data-href")}`,
        }


        if(details.price <= filters.prijs && details.kilometerTeller <= filters.kilometerTeller ){
            allResults.push(details)
        }
    });
  return allResults;
}

function verAmerikaanseerder(string){
    return Number(string.replace(/\./g, "").replace(",", "."))
}



(async () => {
    let page = 0
    let allegegevens = []
    
    while (page < 600) {
        const resultaten = await scrapePage(page)
        allegegevens.push(...resultaten)
        console.log(`Pagina ${Number(page + 1)} verwerkt`)
        page++
    }
    
    const headers = Object.keys(allegegevens[0]).join(',') + '\n';
    const csv = allegegevens.map(obj => Object.values(obj).map(arrayOfValues => `"${arrayOfValues}"`).join(',')).join('\n')
    
    fs.writeFileSync('waggies.csv', headers + csv)

})();
