function getDatabase() {
    fetch("getCategories.php")
        .then((response) => response.json())
        .then((response) => {
            const nav = document.getElementById("category-list");
            nav.innerHTML = response.data.map(category => `
                <li><a>${category.strCategory}</a></li>
            `).join('');
        }).catch((error) => {

        });
}

getDatabase();
