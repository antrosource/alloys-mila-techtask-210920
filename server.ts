import * as fs from "fs";

import type { IRecipe, I_Ingredient } from "./kitchen";

import Kitchen from "./kitchen";
import fastifyServer from "fastify";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

async function readDataFiles() {
    const ingredientsFile = await readFile("./data/ingredients.json");
    const recipesFile = await readFile("./data/recipes.json");

    const ingredientsObject = JSON.parse(ingredientsFile.toString());
    const recipesObject = JSON.parse(recipesFile.toString());

    let recipes: IRecipe[] = [];
    let ingredients: I_Ingredient[] = [];

    if (Array.isArray(ingredientsObject.ingredients)) {
        ingredientsObject.ingredients.forEach((item: any) => {
            const ingredient = {
                title: item.title,
                bestBefore: new Date(item["best-before"]),
                bestBeforeIndex: 0,
                useBy: new Date(item["use-by"]),
            };
            ingredients.push(ingredient);
        });
    } else {
        throw new Error("Bad ingredients file found");
    }

    if (Array.isArray(recipesObject.recipes)) {
        recipesObject.recipes.forEach((item: any) => {
            const recipe: IRecipe = {
                title: item.title,
                ingredients: item.ingredients,
                pastBestBefore: false,
                bestBeforeIndex: 0,
            };
            recipes.push(recipe);
        });
    } else {
        throw new Error("Bad recipes file found");
    }

    return { recipes, ingredients };
}

const fastify = fastifyServer({
    logger: true,
});

fastify.get("/lunch", async (_, reply) => {
    const data = await readDataFiles();
    const k = new Kitchen(data.ingredients, data.recipes, new Date());

    reply.type("application/json").code(200);
    return { recipes: k.recommendARecipe().available.map((r) => r.title) };
});

const PORT = process.env.PORT || 3000;

fastify.listen(PORT as number, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});
