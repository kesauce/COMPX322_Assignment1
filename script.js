// Grabs the categories from the database as soon as the HTML loads
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
        .catch((error) => {});
}

// Grabs the food using the category id
function getFood(category) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const foodList = document.getElementById("food-list");
            foodList.innerHTML = response.meals
                .map(
                    (meal) => `
                    <div class="meal-container">
                        <h1>${meal.strMeal}</h1>
                        <img src="${meal.strMealThumb}">
                    </div>
            `,
                )
                .join("");
        })
        .catch((error) => {});
}

getDatabase();

// Add a listener click event to each of the category
