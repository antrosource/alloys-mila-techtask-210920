export interface I_Ingredient {
    title: string;
    bestBefore: Date;
    bestBeforeIndex?: number;
    useBy: Date;
}
class Kitchen {
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

}
