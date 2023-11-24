const { readdir } = require("fs").promises

export async function getRandomBackground() {

    const backgrounds = await readdir("./public/backgrounds")
    return backgrounds[Math.floor(Math.random() * backgrounds.length)]
}