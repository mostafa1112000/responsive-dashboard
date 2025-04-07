let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePost(post) {
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function renderPosts() {
    const container = document.getElementById("postsContainer");
    if (!container) return;

    container.innerHTML = "";
    const isFavoritesPage = window.location.pathname.includes("favorite");

    posts.forEach((post, index) => {
        if (isFavoritesPage && !post.isFavorite) return;

        const card = document.createElement("div");
        card.className = "card m-2";
        card.style.width = "18rem";
        card.innerHTML = `
      <img src="${post.image}" class="card-img-top" alt="post image">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.content}</p>
        <button class="btn btn-danger btn-sm" onclick="deletePost(${index})">Delete</button>
        <button class="btn btn-warning btn-sm" onclick="editPost(${index})">Edit</button>
        <button class="btn btn-success btn-sm" onclick="toggleFavorite(${index})">
          ${post.isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    `;
        container.appendChild(card);
    });
}

function deletePost(index) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function editPost(index) {
    const newTitle = prompt("Edit title", posts[index].title);
    const newContent = prompt("Edit content", posts[index].content);
    if (newTitle && newContent) {
        posts[index].title = newTitle;
        posts[index].content = newContent;
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    }
}

function toggleFavorite(index) {
    posts[index].isFavorite = !posts[index].isFavorite;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("postForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const file = document.getElementById("imageInput").files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function() {
                    const imageData = reader.result;
                    const post = {
                        id: Date.now(),
                        title,
                        content,
                        image: imageData,
                        isFavorite: false,
                    };
                    savePost(post);
                    form.reset();
                };
                reader.readAsDataURL(file);
            } else {
                const post = {
                    id: Date.now(),
                    title,
                    content,
                    image: "../images/post.png",
                    isFavorite: false,
                };
                savePost(post);
                form.reset();
            }
        });
    }

    renderPosts();
});