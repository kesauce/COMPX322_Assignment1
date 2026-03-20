/**
 * Grabs the selected categories from the database.
 */
function getDatabase() {
    fetch("getCategories.php")
        .then(
            (response) => response.json(),
            () => alert("There was an error with the response."),
        )
        .then(
            (response) => {
                // Grab the elements on the page
                const categoryList = document.getElementById("category-list");
                const categorySelect = document.getElementById("category");

                // Check if the response is empty
                if (response.data == null) {
                    categoryList.innerHTML = `There was an error with the response`;
                } else {
                    // List out the selected categories on the nav bar
                    categoryList.innerHTML = response.data
                        .map((category) => {
                            if (category.selected == 1) {
                                return `<li onClick=getFood("${encodeURIComponent(category.strCategory)}")><a>${category.strCategory}</a></li>`;
                            }
                        })
                        .join("");

                    // List out all the categories in select element
                    categorySelect.innerHTML =
                        `<option value="" disabled selected>Select a category</option>` +
                        response.data
                            .map(
                                (category) => `
                    <option value="${category.strCategory}">${category.strCategory}</option>
                `,
                            )
                            .join("");
                }
            },
            () => alert("There was an error with handling the response."),
        )
        .catch((error) => {
            console.error(`An error has occurred: ${error}`);
        });
}

/**
 * Toggle the selected property of the given category in the database.
 */
function updateDatabase() {
    // Grab the selected category and format it
    const selectValue = document.getElementById("category").value;
    const data = JSON.stringify({ category: selectValue });

    // Send it to the php file
    fetch("updateCategories.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
    })
        .then(
            (response) => response.json(),
            () => alert("There was an error with the response."),
        )
        .then(
            (data) => {
                if (data.success) {
                    // Get the database
                    getDatabase();
                } else {
                    alert("There was an error with the response.");
                }
            },
            () => alert("There was an error with handling the response."),
        );
}

/**
 * Grabs the meals in a given category and displays it.
 * @param {String} category
 */
function getFood(category) {
    const decodedCategory = decodeURIComponent(category);
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${decodedCategory}`;
    fetch(url)
        .then(
            (response) => response.json(),
            () => alert("There was an error with the response."),
        )
        .then(
            (response) => {
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
            },
            () => alert("There was an error with handling the response."),
        )
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
        .then(
            (response) => response.json(),
            () => alert("There was an error with the response."),
        )
        .then(
            (response) => {
                const recipe = document.getElementById("recipe");

                // Check if the API returned empty
                if (response.meals == null) {
                    recipe.innerHTML = `<p id="error">There is an error with the API response.</p>`;
                } else {
                    const meal = response.meals[0];
                    let ingredientList = [];

                    // Grab all the ingredients if it's not null
                    for (let i = 1; i <= 20; i++) {
                        let ingredientKey = `strIngredient${i}`;
                        let measureKey = `strMeasure${i}`;

                        if (
                            meal[measureKey] == null ||
                            meal[ingredientKey] == null ||
                            meal[measureKey] == "" ||
                            meal[ingredientKey] == ""
                        )
                            continue;

                        ingredientList.push(
                            `<li>${meal[measureKey]} ${meal[ingredientKey]}</li>`,
                        );
                    }

                    // Format the instructions
                    let instructions = `<p>${meal.strInstructions}</p>`;

                    recipe.innerHTML = `
                <h1>${decodedFood}</h1>
                <h2>Ingredients</h2>
                <ul>
                ${ingredientList.join("")}
                </ul>
                <h2>Instructions</h2>
                ${instructions}
            `;
                }
            },
            () => alert("There was an error with handling the response."),
        )
        .catch((error) => {
            console.error(`An error has occurred: ${error}`);
        });
}

// Run when HTML loads
getDatabase();
