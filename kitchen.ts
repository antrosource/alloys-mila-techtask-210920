export interface I_Ingredient {
    title: string;
    bestBefore: Date;
    bestBeforeIndex?: number;
    useBy: Date;
}

export interface IRecipe {
    title: string;
    ingredients: string[];
    bestBeforeIndex: number;
    pastBestBefore: boolean;
}

type KitchenIngredients = {
    useful: { [key: string]: I_Ingredient };
    expired: I_Ingredient[];
};

type KitchenRecipes = {
    available: IRecipe[];
    nonAvailable: IRecipe[];
};

class Kitchen {
    ingredients: KitchenIngredients;
    recipes: KitchenRecipes;

    static loadIngredients(ingredients: I_Ingredient[], now: Date) {
        const useful: { [key: string]: I_Ingredient } = {};
        const expired: I_Ingredient[] = [];

        ingredients.forEach((i) => {
            // Check for expired products
            if (i.useBy.getTime() < now.getTime()) {
                expired.push(i);
            } else {
                // For products that are not expired
                // Calculate how far they are from the best before date
                i.bestBeforeIndex = i.bestBefore.getTime() - now.getTime();
                useful[i.title] = i;
            }
        });

        return { useful, expired };
    }

    static prepareRecipes(
        kitchenIngredients: KitchenIngredients,
        recipes: IRecipe[]
    ) {
        const available: IRecipe[] = [];
        const nonAvailable: IRecipe[] = [];

        recipes.forEach((recipeItem) => {
            const ingredients = recipeItem.ingredients;
            let ingredientsBestBeforeIndex = 0; // sum(...bestBeforeIndex of ingredients)

            for (let item of ingredients) {
                const itemDetails = kitchenIngredients.useful[item];
                if (!itemDetails) {
                    // An ingredient is missing we cannot work with this recipe
                    nonAvailable.push(recipeItem);
                    return;
                } else {
                    if (itemDetails.bestBeforeIndex == undefined) {
                        throw new Error(
                            `failed to prepare recipes: bestBefore index for ${item} has not been calculated`
                        );
                    }
                    if (itemDetails.bestBeforeIndex < 0) {
                        recipeItem.pastBestBefore = true;
                    }
                    ingredientsBestBeforeIndex += itemDetails.bestBeforeIndex;
                }
            }

            recipeItem.bestBeforeIndex = ingredientsBestBeforeIndex;
            available.push(recipeItem);
        });

        return { available, nonAvailable };
    }

    constructor(ingredients: I_Ingredient[], recipes: IRecipe[], now: Date) {
        this.ingredients = Kitchen.loadIngredients(ingredients, now);
        this.recipes = Kitchen.prepareRecipes(this.ingredients, recipes);
        this.recipes.available.sort((a, b) => {
            if (a.pastBestBefore === true && b.pastBestBefore === true) {
                const aIndex = a.bestBeforeIndex;
                const bIndex = b.bestBeforeIndex;
                if (aIndex < bIndex) {
                    return 1;
                }
                if (aIndex > bIndex) {
                    return -1;
                }
                return 0;
            }

            if (a.pastBestBefore === true && b.pastBestBefore === false) {
                return 1;
            }

            if (a.pastBestBefore === false && b.pastBestBefore === true) {
                return -1;
            }

            return 0;
        });
    }

    recommendARecipe() {
        return this.recipes;
    }
}

export default Kitchen;
