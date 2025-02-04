import { translate } from "@vitalets/google-translate-api";
import fs from 'fs';

// Leer el archivo JSON
const data = fs.readFileSync('games-details.json', 'utf-8');
const games = JSON.parse(data);

// Traducirlo
async function translateJSON(games) {
  const translatedData = { ...games };

  if (typeof translatedData.description === "string") {
    try {
      const res = await translate(translatedData.description, { to: "es" });
      translatedData.description = res.text;
    } catch (error) {
      console.error("Error al traducir description:", error);
    }
  }

  if (Array.isArray(translatedData.categories)) {
    for (let i = 0; i < translatedData.categories.length; i++) {
      if (typeof translatedData.categories[i] === "string") {
        try {
          const res = await translate(translatedData.categories[i], {
            to: "es",
          });
          translatedData.categories[i] = res.text;
        } catch (error) {
          console.error(`Error al traducir category en índice ${i}:`, error);
        }
      }
    }
  }
  
    fs.writeFileSync('games-details-translated.json', JSON.stringify(translatedGames, null, 2));
    console.log('¡Traducción completada!');

  return translatedData;
}


translateJSON(games);
