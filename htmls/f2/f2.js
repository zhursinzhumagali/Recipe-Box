const API = "https://dummyjson.com/recipes";

const BACKEND = "http://localhost:3000";

const USER_ID = 1;

let chosenIds = [];

async function getChosenIds() {
  const response = await fetch(BACKEND + "/favorites/" + USER_ID);
  if (!response.ok) {
    throw new Error("Server error");
  }

  const rows = await response.json();
  chosenIds = [];
  for (let i = 0; i < rows.length; i++) {
    chosenIds.push(rows[i].recipe_id);
  }
  return chosenIds;
}

async function loadChosenIds() {
  try {
    await getChosenIds();
  } catch (error) {
    console.error("Could not load favorites:", error);
  }
}

function isChosen(id) {
  return chosenIds.includes(id);
}

async function toggleChosen(recipe) {
  const wasChosen = isChosen(recipe.id);
  let response;

  if (wasChosen) {
    response = await fetch(
      BACKEND + "/favorites/" + USER_ID + "/" + recipe.id,
      {
        method: "DELETE",
      },
    );
  } else {
    response = await fetch(BACKEND + "/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: USER_ID, recipe_id: recipe.id }),
    });
  }

  if (!response.ok) {
    throw new Error("Server error");
  }

  if (wasChosen) {
    const newIds = [];
    for (let i = 0; i < chosenIds.length; i++) {
      if (chosenIds[i] !== recipe.id) {
        newIds.push(chosenIds[i]);
      }
    }
    chosenIds = newIds;
  } else {
    chosenIds.push(recipe.id);
  }
}

function createCard(recipe, afterClick) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
        <a href="recipe.html?id=${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.name}">
        </a>
        <div class="card-body">
            <h3><a href="recipe.html?id=${recipe.id}">${recipe.name}</a></h3>
            <div class="tags">
                <span class="tag">${recipe.cuisine}</span>
                <span class="tag">${recipe.difficulty}</span>
                <span class="tag">${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            </div>
            <div class="rating">${recipe.rating} <span>(${recipe.reviewCount} reviews)</span></div>
            <p class="desc">${recipe.instructions[0]}</p>
            <button class="btn"></button>
        </div>
    `;

  const btn = card.querySelector("button");

  if (isChosen(recipe.id)) {
    btn.textContent = "Saved";
    btn.classList.add("saved");
  } else {
    btn.textContent = "Save";
  }

  btn.addEventListener("click", async function () {
    try {
      await toggleChosen(recipe);
    } catch (error) {
      alert("Could not update favorites. Is the server running?");
      return;
    }
    btn.classList.toggle("saved");

    if (btn.classList.contains("saved")) {
      btn.textContent = "Saved";
    } else {
      btn.textContent = "Save";
    }

    if (afterClick) {
      afterClick();
    }
  });

  return card;
}

function showRecipes(container, list, afterClick) {
  container.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    container.appendChild(createCard(list[i], afterClick));
  }
}

async function loadMain() {
  const grid = document.getElementById("recipes");
  const status = document.getElementById("status");

  try {
    const response = await fetch(API + "?limit=50");
    const data = await response.json();
    await loadChosenIds();
    status.remove();
    showRecipes(grid, data.recipes);
  } catch (error) {
    status.textContent = "Failed to load recipes";
  }
}

function loadSearch() {
  const inp = document.getElementById("inp");
  const res = document.getElementById("result");
  const ready = loadChosenIds();

  inp.addEventListener("input", async function () {
    const value = inp.value.toLowerCase();
    res.innerHTML = "";
    if (value.trim() === "") return;

    try {
      const response = await fetch(API + "/search?q=" + value);
      const data = await response.json();
      await ready;

      if (inp.value.toLowerCase() !== value) return;

      if (data.recipes.length === 0) {
        res.innerHTML = '<p class="status">Nothing found</p>';
        return;
      }
      showRecipes(res, data.recipes);
    } catch (error) {
      res.innerHTML = '<p class="status">Loading error</p>';
    }
  });
}

async function loadChosen() {
  const grid = document.getElementById("recipes");
  const status = document.getElementById("status");

  let ids;
  try {
    ids = await getChosenIds();
  } catch (error) {
    grid.innerHTML = "";
    status.style.display = "block";
    status.textContent = "Failed to load favorites. Is the server running?";
    return;
  }

  grid.innerHTML = "";

  if (ids.length === 0) {
    status.style.display = "block";
    status.innerHTML =
      'Nothing here yet. Click “Save” on a recipe on the <a href="main.html">home page</a>.';
    return;
  }

  let list;
  try {
    list = await Promise.all(
      ids.map(function (id) {
        return fetch(API + "/" + id).then(function (response) {
          return response.json();
        });
      }),
    );
  } catch (error) {
    status.style.display = "block";
    status.textContent = "Failed to load recipes";
    return;
  }

  list = list.filter(function (recipe) {
    return recipe.id !== undefined;
  });

  status.style.display = "none";
  showRecipes(grid, list, loadChosen);
}

const facts = [
  "Salt is one of the oldest preservatives: it was already used in Ancient Egypt.",
  "Honey almost never spoils: edible honey has been found in tombs over 3,000 years old.",
  "Botanically speaking, a tomato is a berry, but a strawberry is not.",
  'The Italian word "pasta" means "dough".',
  "Chili peppers are hot because of capsaicin, but birds cannot feel its heat.",
  "Saffron is the most expensive spice: about 150,000 crocus flowers are needed for 1 kg.",
  "Beets get their intense color from a pigment called betanin.",
  "The croissant did not originate in France, but in Austria.",
];

function showFact() {
  const number = Math.floor(Math.random() * facts.length);
  document.getElementById("fact").textContent = facts[number];
}

async function loadRecipe() {
  const box = document.getElementById("recipe");

  showFact();
  document.getElementById("fact-btn").addEventListener("click", showFact);

  let id = window.location.search.split("id=")[1];
  if (id === undefined) {
    id = Math.floor(Math.random() * 50) + 1;
  }

  try {
    const response = await fetch(API + "/" + id);
    const recipe = await response.json();

    let ingredients = "";
    for (let i = 0; i < recipe.ingredients.length; i++) {
      ingredients += "<li>" + recipe.ingredients[i] + "</li>";
    }

    let steps = "";
    for (let i = 0; i < recipe.instructions.length; i++) {
      steps += "<li>" + recipe.instructions[i] + "</li>";
    }

    box.innerHTML = `
            <div class="recipe-top">
                <img src="${recipe.image}" alt="${recipe.name}">
                <div>
                    <h2>${recipe.name}</h2>
                    <div class="tags">
                        <span class="tag">${recipe.cuisine}</span>
                        <span class="tag">${recipe.difficulty}</span>
                        <span class="tag">${recipe.servings} servings</span>
                        <span class="tag">${recipe.caloriesPerServing} kcal</span>
                    </div>
                    <p class="rating" style="margin-top:12px">${recipe.rating} <span>(${recipe.reviewCount} reviews)</span></p>
                    <p>Prep: ${recipe.prepTimeMinutes} min, cook: ${recipe.cookTimeMinutes} min</p>
                    <div class="actions">
                        <button class="btn" id="save-btn"></button>
                        <a class="btn ghost" style="text-decoration:none" href="recipe.html">🎲 Random</a>
                    </div>
                </div>
            </div>
            <div class="panel"><h3>Ingredients</h3><ul>${ingredients}</ul></div>
            <div class="panel"><h3>Instructions</h3><ol>${steps}</ol></div>
        `;

    await loadChosenIds();

    const btn = document.getElementById("save-btn");
    if (isChosen(recipe.id)) {
      btn.textContent = "Saved";
      btn.classList.add("saved");
    } else {
      btn.textContent = "Save";
    }
    btn.addEventListener("click", async function () {
      try {
        await toggleChosen(recipe);
      } catch (error) {
        alert("Could not update favorites. Is the server running?");
        return;
      }
      btn.classList.toggle("saved");
      if (btn.classList.contains("saved")) {
        btn.textContent = "Saved";
      } else {
        btn.textContent = "Save";
      }
    });
  } catch (error) {
    box.innerHTML = '<p class="status">Failed to load recipe</p>';
  }
}

const page = document.body.getAttribute("data-page");

if (page === "main") {
  loadMain();
}
if (page === "search") {
  loadSearch();
}
if (page === "chosen") {
  loadChosen();
}
if (page === "recipe") {
  loadRecipe();
}
