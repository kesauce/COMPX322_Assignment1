/**
 * Grabs the selected categories from the database
 */
function getDatabase() {
    fetch("getCategories.php")
        .then((response) => response.json())
        .then((response) => {
            const categoryList = document.getElementById("category-list");
            categoryList.innerHTML = response.data
                .map(
                    (category) => `
                <li onClick=getFood("${category.strCategory}")><a>${category.strCategory}</a></li>
            `,
                )
                .join("");
        })
        .catch((error) => {
            console.error(`An error has occurred: ${error}`);
        });
}

/**
 * Grabs the meals in a given category and displays it.
 * @param {String} category 
 */
function getFood(category) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const foodList = document.getElementById("food-list");

            // Check if the API returned empty
            if (response.meals == null) {
                foodList.innerHTML = `<p id="error">There are no meals in this category.</p>`;
            } else {
                // Map through the original response and add the following HTML with every item, ensuring that there is no comma in between each item in the new array
                // Browser mistakes spaces in meal names as the end of an attribute - need to encode and decode it safely
                foodList.innerHTML = response.meals
                    .map(
                        (meal) => `
                    <div onClick=getRecipe("${encodeURIComponent(meal.strMeal)}") class="meal-container">
                        <h1>${meal.strMeal}</h1>
                        <img src="${meal.strMealThumb}">
                    </div>
            `,
                    )
                    .join("");
            }
        })
        .catch((error) => {
            console.error(`An error has occurred: ${error}`);
        });
}

/**
 * Grab the recipe of a given meal and display it.
 * @param {String} food 
 */
function getRecipe(food) {
    // Decode the food and make the fetch request
    const decodedFood = decodeURIComponent(food); 
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${decodedFood}`;

    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const recipe = document.getElementById("recipe");
            const meal = response.meals[0];
            let ingredientList = [];

            // Grab all the ingredients if it's not null
            for (let i = 1; i <= 20; i++){
                let ingredientKey = `strIngredient${i}`;
                let measureKey = `strMeasure${i}`;

                if (meal[measureKey] == null || meal[ingredientKey] == null || meal[measureKey] == "" || meal[ingredientKey] == "") continue;

                ingredientList.push(`<li>${meal[measureKey]} ${meal[ingredientKey]}</li>`);
            };

            // Format the instructions
            let instructions = `<p>${meal.strInstructions}</p>`;

            recipe.innerHTML = `
                <h2>Ingredients</h2>
                <ul>
                ${ingredientList.join('')}
                </ul>
                <h2>Instructions</h2>
                ${instructions}
            `;
        })
        .catch((error) => {
            console.error(`An error has occurred: ${error}`);
        });
}

getDatabase();
