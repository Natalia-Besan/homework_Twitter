const postsContainer = document.getElementById("posts");

async function displayPosts(userId) {
  const res = await fetch(`https://dummyjson.com/users/${userId}`);
  const userData = await res.json();
  return userData;
}

async function formForAddPost() {
  const userId = 1;
  const { id, image } = await displayPosts(userId);
  const form = document.querySelector("form");
  const textarea = document.querySelector("textarea");
  const userImage = document.querySelector(".user_img");

  userImage.src = image;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const obj = {
      body: textarea.value,
      userId: id,
    };

    showPost(obj);
    textarea.value = "";
  });
}

async function allPosts(url, callback) {
  const res = await fetch(url);
  const data = await res.json();
  callback(data.posts);
}

async function addPost(data) {
  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const dataPost = await response.json();
  return dataPost;
}

async function showPost(data) {
  try {
    const { userId, body } = await addPost(data);
    const { image, username } = await displayPosts(userId);
    showDisplayPosts(body, 0, image, username);
  } catch (error) {
    console.log(error);
  }
}

formForAddPost();

allPosts("https://dummyjson.com/posts", (posts) => getAndShow(posts));

async function getAndShow(posts) {
  for (const post of posts) {
    const { username, image } = await displayPosts(post.userId);
    showDisplayPosts(post.body, post.reactions, image, username, post.title);
  }
}

function showDisplayPosts(body, reactions, image, username, title) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("user-post");
  postDiv.innerHTML = `
        <div class="user-img">
             <img src="${image}" alt="${username}'s image">
        </div>
        <div class="title">
            <div class="name">
                <h2>${title}</h2>
                <p>${username}</p>
            </div>
            <div class="body">
                 <p>${body}</p>
                 <div class='reactions'><img src="./img/reactions.svg" alt="">
                 <p>${reactions}</p></div>
            </div>
        </div>
        <hr>
    `;
  postsContainer.appendChild(postDiv);
}
