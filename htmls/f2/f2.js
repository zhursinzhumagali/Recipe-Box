const API = "https://dummyjson.com/recipes";

function getChosen() {
  const saved = localStorage.getItem("chosen");
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function isChosen(id) {
  const list = getChosen();
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return true;
    }
  }
  return false;
}

function toggleChosen(recipe) {
  const list = getChosen();
  const newList = [];
  let found = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === recipe.id) {
      found = true;
    } else {
      newList.push(list[i]);
    }
  }

  if (found === false) {
    newList.push(recipe);
  }

  localStorage.setItem("chosen", JSON.stringify(newList));
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
                <span class="tag">${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин</span>
            </div>
            <div class="rating">⭐ ${recipe.rating} <span>(${recipe.reviewCount} отзывов)</span></div>
            <p class="desc">${recipe.instructions[0]}</p>
            <button class="btn"></button>
        </div>
    `;

  const btn = card.querySelector("button");

  if (isChosen(recipe.id)) {
    btn.textContent = "✓ Сохранено";
    btn.classList.add("saved");
  } else {
    btn.textContent = "♡ Сохранить";
  }

  btn.addEventListener("click", function () {
    toggleChosen(recipe);
    btn.classList.toggle("saved");

    if (btn.classList.contains("saved")) {
      btn.textContent = "✓ Сохранено";
    } else {
      btn.textContent = "♡ Сохранить";
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
    status.remove();
    showRecipes(grid, data.recipes);
  } catch (error) {
    status.textContent = "Не удалось загрузить рецепты";
  }
}

// ===== search.html: поиск =====

function loadSearch() {
  const inp = document.getElementById("inp");
  const res = document.getElementById("result");

  inp.addEventListener("input", async function () {
    const value = inp.value.toLowerCase();
    res.innerHTML = "";
    if (value.trim() === "") return;

    try {
      const response = await fetch(API + "/search?q=" + value);
      const data = await response.json();

      if (inp.value.toLowerCase() !== value) return;

      if (data.recipes.length === 0) {
        res.innerHTML = '<p class="status">Ничего не найдено</p>';
        return;
      }
      showRecipes(res, data.recipes);
    } catch (error) {
      res.innerHTML = '<p class="status">Ошибка загрузки</p>';
    }
  });
}

function loadChosen() {
  const grid = document.getElementById("recipes");
  const status = document.getElementById("status");

  const list = getChosen();
  grid.innerHTML = "";

  if (list.length === 0) {
    status.style.display = "block";
    status.innerHTML =
      'Пока пусто. Нажмите «Сохранить» у рецепта на <a href="main.html">главной</a>.';
  } else {
    status.style.display = "none";
    showRecipes(grid, list, loadChosen);
  }
}

const facts = [
  "Соль — один из самых древних консервантов: ею пользовались ещё в Древнем Египте.",
  "Мёд практически не портится: съедобный мёд находили в гробницах возрастом более 3000 лет.",
  "Помидор — это ягода, а клубника — нет (с точки зрения ботаники).",
  "Слово «паста» по-итальянски означает «тесто».",
  "Красный перец чили острый из-за капсаицина, а птицы его остроты не чувствуют.",
  "Шафран — самая дорогая специя: для 1 кг нужно около 150 000 цветков крокуса.",
  "Свёкла даёт такой насыщенный цвет из-за пигмента бетанина.",
  "Круассан появился не во Франции, а в Австрии.",
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
                        <span class="tag">${recipe.servings} порций</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                        <span class="tag">${recipe.caloriesPerServing} ккал</span>
                    </div>
                    <p class="rating" style="margin-top:12px">⭐ ${recipe.rating} <span>(${recipe.reviewCount} отзывов)</span></p>
                    <p>Подготовка: ${recipe.prepTimeMinutes} мин, готовка: ${recipe.cookTimeMinutes} мин</p>
                    <div class="actions">
                        <button class="btn" id="save-btn"></button>
                        <a class="btn ghost" style="text-decoration:none" href="recipe.html">🎲 Случайный</a>
                    </div>
                </div>
            </div>
            <div class="panel"><h3>Ингредиенты</h3><ul>${ingredients}</ul></div>
            <div class="panel"><h3>Приготовление</h3><ol>${steps}</ol></div>
        `;

    const btn = document.getElementById("save-btn");
    if (isChosen(recipe.id)) {
      btn.textContent = "✓ Сохранено";
      btn.classList.add("saved");
    } else {
      btn.textContent = "♡ Сохранить";
    }
    btn.addEventListener("click", function () {
      toggleChosen(recipe);
      btn.classList.toggle("saved");
      if (btn.classList.contains("saved")) {
        btn.textContent = "✓ Сохранено";
      } else {
        btn.textContent = "♡ Сохранить";
      }
    });
  } catch (error) {
    box.innerHTML = '<p class="status">Не удалось загрузить рецепт</p>';
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
