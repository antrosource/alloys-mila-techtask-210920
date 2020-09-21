import Kitchen from "./kitchen";

describe("The Kitchen", function () {
    describe("<loadIngredients>", function () {
        it("test all recipes expired", () => {
            const ingredients = [
                {
                    title: "Sausage",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Hotdog Bun",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Ketchup",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
            ];

            const now = new Date("2021-04-25");
            const res = Kitchen.loadIngredients(ingredients, now);
            expect(res.expired).toHaveLength(3);
        });

        it("test no recipe expired", () => {
            const ingredients = [
                {
                    title: "Sausage",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Hotdog Bun",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Ketchup",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
            ];

            const now = new Date("2021-01-25");
            const res = Kitchen.loadIngredients(ingredients, now);
            expect(res.expired).toHaveLength(0);
        });

        it("test a few recipes expired", () => {
            const ingredients = [
                {
                    title: "Sausage",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-01-27"),
                },
                {
                    title: "Hotdog Bun",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-02-27"),
                },
                {
                    title: "Ketchup",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
            ];

            const now = new Date("2021-02-30");
            const res = Kitchen.loadIngredients(ingredients, now);
            expect(res.expired).toHaveLength(2);
            expect(Object.keys(res.useful)).toHaveLength(1);
            expect(res.useful["Ketchup"]).toEqual({
                title: "Ketchup",
                bestBefore: new Date("2021-03-25"),
                useBy: new Date("2021-03-27"),
                bestBeforeIndex:
                    new Date("2021-03-25").getTime() - now.getTime(),
            });
        });
    });

    describe("<prepareRecipes>", function () {
        it("prepares recipes from ingredients", () => {
            const ingredients = [
                {
                    title: "Sausage",
                    bestBefore: new Date("2021-01-25"),
                    useBy: new Date("2021-01-27"),
                },
                {
                    title: "Hotdog Bun",
                    bestBefore: new Date("2021-02-25"),
                    useBy: new Date("2021-02-27"),
                },
                {
                    title: "Ketchup",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Cheese",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Bread",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
            ];

            const recipes = [
                {
                    title: "Random 1",
                    ingredients: ["Sausage", "Hotdog Bun", "Cheese"],
                    pastBestBefore: false,
                    bestBeforeIndex: 0,
                },
                {
                    title: "Random 2",
                    ingredients: ["Ketchup", "Bread", "Cheese"],
                    pastBestBefore: false,
                    bestBeforeIndex: 0,
                },
            ];

            const now = new Date("2021-02-30");
            const kitchen = new Kitchen(ingredients, recipes, now);
            const results = kitchen.recommendARecipe();
            expect(results.nonAvailable).toHaveLength(1);
            expect(results.nonAvailable[0]).toStrictEqual({
                title: "Random 1",
                ingredients: ["Sausage", "Hotdog Bun", "Cheese"],
                pastBestBefore: false,
                bestBeforeIndex: 0,
            });

            expect(results.available).toHaveLength(1);
            expect(results.available[0]).toStrictEqual({
                title: "Random 2",
                ingredients: ["Ketchup", "Bread", "Cheese"],
                pastBestBefore: false,
                bestBeforeIndex: 5961600000,
            });
        });

        it("sorts recipes correctly", () => {
            const ingredients = [
                {
                    title: "Sausage",
                    bestBefore: new Date("2021-01-25"),
                    useBy: new Date("2021-01-27"),
                },
                {
                    title: "Hotdog Bun",
                    bestBefore: new Date("2021-02-25"),
                    useBy: new Date("2021-02-27"),
                },
                {
                    title: "Ketchup",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Cheese",
                    bestBefore: new Date("2021-03-25"),
                    useBy: new Date("2021-03-27"),
                },
                {
                    title: "Bread",
                    bestBefore: new Date("2021-01-08"),
                    useBy: new Date("2021-01-10"),
                },
            ];

            const recipes = [
                {
                    title: "Random 1",
                    ingredients: ["Ketchup", "Bread", "Cheese"],
                    pastBestBefore: false,
                    bestBeforeIndex: 0,
                },
                {
                    title: "Random 3",
                    ingredients: ["Bread", "Cheese"],
                    pastBestBefore: false,
                    bestBeforeIndex: 0,
                },
                {
                    title: "Random 2",
                    ingredients: ["Sausage", "Hotdog Bun", "Cheese"],
                    pastBestBefore: false,
                    bestBeforeIndex: 0,
                },
            ];

            const now = new Date("2021-01-09");
            const kitchen = new Kitchen(ingredients, recipes, now);
            const results = kitchen.recommendARecipe();
            expect(results.available).toHaveLength(3);
            expect(results.nonAvailable).toHaveLength(0);
            expect(results.available[0].title).toBe("Random 2");
            expect(results.available[0].pastBestBefore).toBe(false);
            expect(results.available[1].pastBestBefore).toBe(true);
        });
    });
});
