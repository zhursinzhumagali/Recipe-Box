const BACKEND = "http://localhost:3000";

const USER_ID = 1;

async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("Cannot reach the server. Is it running?");
  }

  if (!response.ok) {
    let message = "Server error";
    try {
      const data = await response.json();
      if (data.error) {
        message = data.error;
      }
    } catch (error) { }
    throw new Error(message);
  }

  return response.json();
}

function postJson(url, body) {
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function recipesUrl(options) {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.category) params.set("category", options.category);
  if (options.page) params.set("page", options.page);
  if (options.limit) params.set("limit", options.limit);
  return BACKEND + "/recipes?" + params.toString();
}

function escapeHtml(text) {
  if (text === null || text === undefined) {
    return "";
  }
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function placeholder(title, height, radius) {
  const letter = escapeHtml(
    String(title || "?")
      .charAt(0)
      .toUpperCase(),
  );
  return (
    '<div style="height:' +
    height +
    "px;background:var(--accent);color:#fff;" +
    "display:flex;align-items:center;justify-content:center;font-size:64px;" +
    "font-weight:700;border-radius:" +
    radius +
    'px">' +
    letter +
    "</div>"
  );
}

function photo(recipe, height, radius) {
  const url = recipe.imageUrl || recipe.image_url;
  if (!url) {
    return placeholder(recipe.title, height, radius);
  }
  return (
    '<img src="' +
    escapeHtml(url) +
    '" alt="' +
    escapeHtml(recipe.title) +
    '" loading="lazy" style="display:block;width:100%;height:' +
    height +
    "px;object-fit:cover;border-radius:" +
    radius +
    'px">'
  );
}

function ratingText(avg) {
  if (avg === null || avg === undefined) {
    return "No ratings yet";
  }
  return avg + " / 5";
}

let chosenIds = [];

async function getChosen() {
  const data = await request(BACKEND + "/favorites?user_id=" + USER_ID);

  chosenIds = [];
  for (let i = 0; i < data.favorites.length; i++) {
    chosenIds.push(data.favorites[i].id);
  }
  return data.favorites;
}

async function loadChosenIds() {
  try {
    await getChosen();
  } catch (error) {
    console.error("Could not load favorites:", error);
  }
}

function isChosen(id) {
  return chosenIds.includes(id);
}

async function toggleChosen(recipe) {
  const wasChosen = isChosen(recipe.id);

  if (wasChosen) {
    await request(BACKEND + "/favorites/" + recipe.id + "?user_id=" + USER_ID, {
      method: "DELETE",
    });
  } else {
    await postJson(BACKEND + "/favorites", {
      user_id: USER_ID,
      recipe_id: recipe.id,
    });
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
            ${photo(recipe, 190, 0)}
        </a>
        <div class="card-body">
            <h3><a href="recipe.html?id=${recipe.id}">${escapeHtml(recipe.title)}</a></h3>
            <p class="desc">${escapeHtml(recipe.description)}</p>
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
      alert("Could not update favorites: " + error.message);
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
    const data = await request(recipesUrl({ page: 1, limit: 50 }));
    await loadChosenIds();

    if (data.recipes.length === 0) {
      status.textContent = "No recipes yet";
      return;
    }

    status.remove();
    showRecipes(grid, data.recipes);
  } catch (error) {
    status.textContent = "Failed to load recipes: " + error.message;
  }
}

function loadSearch() {
  const inp = document.getElementById("inp");
  const res = document.getElementById("result");
  const ready = loadChosenIds();
  let timer;

  async function search() {
    const value = inp.value.trim();
    if (value === "") {
      res.innerHTML = "";
      return;
    }

    try {
      const data = await request(recipesUrl({ search: value, limit: 50 }));
      await ready;

      if (inp.value.trim() !== value) return;

      if (data.recipes.length === 0) {
        res.innerHTML = '<p class="status">Nothing found</p>';
        return;
      }
      showRecipes(res, data.recipes);
    } catch (error) {
      res.innerHTML =
        '<p class="status">Loading error: ' +
        escapeHtml(error.message) +
        "</p>";
    }
  }

  inp.addEventListener("input", function () {
    clearTimeout(timer);
    res.innerHTML = "";
    timer = setTimeout(search, 300);
  });
}

async function loadChosen() {
  const grid = document.getElementById("recipes");
  const status = document.getElementById("status");

  let list;
  try {
    list = await getChosen();
  } catch (error) {
    grid.innerHTML = "";
    status.style.display = "block";
    status.textContent = "Failed to load favorites: " + error.message;
    return;
  }

  grid.innerHTML = "";

  if (list.length === 0) {
    status.style.display = "block";
    status.innerHTML =
      'Nothing here yet. Click “Save” on a recipe on the <a href="main.html">home page</a>.';
  } else {
    status.style.display = "none";
    showRecipes(grid, list, loadChosen);
  }
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

async function getRandomRecipeId() {
  const data = await request(recipesUrl({ limit: 50 }));
  if (data.recipes.length === 0) {
    return null;
  }
  const number = Math.floor(Math.random() * data.recipes.length);
  return data.recipes[number].id;
}

async function loadComments(recipeId) {
  const list = document.getElementById("comments-list");

  try {
    const data = await request(BACKEND + "/recipes/" + recipeId + "/comments");

    if (data.comments.length === 0) {
      list.innerHTML =
        '<p class="status" style="padding:12px 0">No comments yet</p>';
      return;
    }

    let html = "";
    for (let i = 0; i < data.comments.length; i++) {
      const comment = data.comments[i];
      html +=
        '<p style="margin-bottom:12px"><b>' +
        escapeHtml(comment.author) +
        "</b> " +
        '<span style="color:var(--muted);font-size:12px">' +
        formatDate(comment.created_at) +
        "</span><br>" +
        escapeHtml(comment.text) +
        "</p>";
    }
    list.innerHTML = html;
  } catch (error) {
    list.innerHTML =
      '<p class="status" style="padding:12px 0">Failed to load comments: ' +
      escapeHtml(error.message) +
      "</p>";
  }
}

async function loadRecipe() {
  const box = document.getElementById("recipe");

  showFact();
  document.getElementById("fact-btn").addEventListener("click", showFact);

  try {
    let id = window.location.search.split("id=")[1];
    if (id === undefined) {
      id = await getRandomRecipeId();
      if (id === null) {
        box.innerHTML = '<p class="status">No recipes yet</p>';
        return;
      }
    }

    const recipe = await request(BACKEND + "/recipes/" + id);

    let about = "";
    if (recipe.description) {
      about =
        '<div class="panel"><h3>Description</h3><p>' +
        escapeHtml(recipe.description) +
        "</p></div>";
    }

    let category = "";
    if (recipe.category) {
      category = '<span class="tag">' + escapeHtml(recipe.category) + "</span>";
    }

    let ingredientsHtml = "";
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      let items = "";
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const item = recipe.ingredients[i];
        const name = typeof item === "string" ? item : item.name;
        const amount = typeof item === "string" || !item.amount ? "" : " — " + item.amount;
        items += "<li>" + escapeHtml(name + amount) + "</li>";
      }
      ingredientsHtml =
        '<div class="panel"><h3>Ingredients</h3><ul style="padding-left:20px">' +
        items +
        "</ul></div>";
    }

    let stepsHtml = "";
    if (Array.isArray(recipe.steps)) {
      let items = "";
      for (let i = 0; i < recipe.steps.length; i++) {
        items += '<li style="margin-bottom:6px">' + escapeHtml(recipe.steps[i]) + "</li>";
      }
      stepsHtml = '<ol style="padding-left:20px">' + items + "</ol>";
    } else {
      stepsHtml = "<p>" + escapeHtml(recipe.steps) + "</p>";
    }

    box.innerHTML = `
            <div class="recipe-top">
                ${photo(recipe, 260, 18)}
                <div>
                    <h2>${escapeHtml(recipe.title)}</h2>
                    <div class="tags">
                        ${category}
                        <span class="tag">Added ${formatDate(recipe.created_at)}</span>
                    </div>
                    <p class="rating" id="rating-line" style="margin-top:12px">${ratingText(recipe.avg_rating)}</p>
                    <div class="actions">
                        <button class="btn" id="save-btn"></button>
                        <a class="btn ghost" style="text-decoration:none" href="recipe.html">Random</a>
                    </div>
                </div>
            </div>
            ${about}
            ${ingredientsHtml}
            <div class="panel"><h3>Instructions</h3>${stepsHtml}</div>
            <div class="panel">
                <h3>Rate this recipe</h3>
                <div class="actions" id="rate-buttons" style="margin-top:0">
                    <button class="btn ghost">1</button>
                    <button class="btn ghost">2</button>
                    <button class="btn ghost">3</button>
                    <button class="btn ghost">4</button>
                    <button class="btn ghost">5</button>
                </div>
                <p id="rate-msg" style="margin-top:10px;color:var(--muted)"></p>
            </div>
            <div class="panel">
                <h3>Comments</h3>
                <div id="comments-list"></div>
                <textarea id="comment-text" rows="3" placeholder="Write a comment..." style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:12px;font:inherit;margin-top:12px"></textarea>
                <div class="actions">
                    <button class="btn" id="comment-btn">Send</button>
                </div>
            </div>
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
        alert("Could not update favorites: " + error.message);
        return;
      }
      btn.classList.toggle("saved");
      if (btn.classList.contains("saved")) {
        btn.textContent = "Saved";
      } else {
        btn.textContent = "Save";
      }
    });

    const rateButtons = document.querySelectorAll("#rate-buttons button");
    for (let i = 0; i < rateButtons.length; i++) {
      rateButtons[i].addEventListener("click", async function () {
        const message = document.getElementById("rate-msg");
        try {
          await postJson(BACKEND + "/recipes/" + recipe.id + "/rating", {
            user_id: USER_ID,
            value: i + 1,
          });
          const fresh = await request(BACKEND + "/recipes/" + recipe.id);
          document.getElementById("rating-line").textContent = ratingText(
            fresh.avg_rating,
          );
          message.textContent =
            "Thanks! You rated this recipe " + (i + 1) + " / 5.";
        } catch (error) {
          message.textContent = "Could not save the rating: " + error.message;
        }
      });
    }

    loadComments(recipe.id);

    document
      .getElementById("comment-btn")
      .addEventListener("click", async function () {
        const field = document.getElementById("comment-text");
        const text = field.value.trim();
        if (text === "") return;

        try {
          await postJson(BACKEND + "/recipes/" + recipe.id + "/comments", {
            user_id: USER_ID,
            text: text,
          });
          field.value = "";
          await loadComments(recipe.id);
        } catch (error) {
          alert("Could not send the comment: " + error.message);
        }
      });
  } catch (error) {
    box.innerHTML =
      '<p class="status">Failed to load recipe: ' +
      escapeHtml(error.message) +
      "</p>";
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
