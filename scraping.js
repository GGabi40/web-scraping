import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

// Scrape cada pagina
async function scrapeGameDetails(gameURL) {
    if (!gameURL) {
        console.log('URL inválido o no definido.');
        return;
    }

    const { data } = await axios.get(gameURL);
    const $ = cheerio.load(data);

    const description = $('.gamedesc').text().trim();
    const iframeCode = $('#embedTextAreaId').text().trim();

    const categories = [];
    $('.filters li a').each((_, element) => {
        categories.push($(element).text().trim());
    });

    const author = $('#companyLinkId').text().trim();

    return { description, iframeCode, categories, author };
}

// Scrape principal
async function scrapeGames() {
    const url = 'https://gamemonetize.com/'
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let id = 0;
    let games = [];
    let gameDetailsList = [];

    $('a.game-link').each((_, element) => {
        id++;
        const title = $(element).find(".game-card__title").text().trim();
        const image = $(element).attr("data-image");
        const video = $(element).attr("data-src");
        const link = `https://gamemonetize.com${$(element).attr("href")}`;

        games.push({
            id,
            title,
            image,
            video,
            link
        });
    });

    // agarra los detalles
    for (let game of games) {
        console.log(`🕵️ Scrapeando: ${game.title}`)
        const gameDetails = await scrapeGameDetails(game.link);


        gameDetailsList.push({
            id: game.id,
            title: game.title,
            author: gameDetails.author,
            image: game.image,
            video: game.video,
            description: gameDetails.description,
            iframeCode: gameDetails.iframeCode,
            categories: gameDetails.categories
        });
    }

    // Guardar en un JSON
    fs.writeFileSync("games-details.json", JSON.stringify(gameDetailsList, null, 2));
    console.log("✅ Scraping completado. JSON generado.");
};

scrapeGames();
