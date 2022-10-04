if (!document.cookie.split("; ").some((key) => key.startsWith("jwt_sent")))
  window.location.href = "https://localhost:8080/";
(async () => await getMyPosts())();

const postContainer = document.querySelector(".post-container");
const editPost = document.querySelector(".edit-post");
const deletePost = document.querySelector(".delete-post");
const textArea = document.querySelector(".textarea");
const jwtDecode = (t) => JSON.parse(window.atob(t.split(".")[1]));
const jwt = document.cookie.split("; ").at(-1).slice(9);
const payload = jwtDecode(jwt);
const nameShown = (document.querySelector("#name").textContent =
  payload.username);
const createPostButton = document.querySelector("#create-post");
const logOut = document.querySelector(".logout");
const noNetworkCard = document.querySelector("#no-network");

// const errorComponent = `
// <div id="no-network" class="flex p-4 mb-4 text-sm text-red-700 bg-red-200 rounded-lg dark:bg-red-200 opacity-95 dark:text-red-800 fixed bottom-0 left-4 z-10 hide-left transition duration-300" role="alert">
//       <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
//       <span class="sr-only">Info</span>
//       <div>
//         <span class="font-medium">Error!</span> <span class="error-message"></span>.
//       </div>
//       <svg id="close--no-network" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 inline w-5 h-5 fill-neutral-600 ml-3 cursor-pointer" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
//     </div>
// `;

function showErrorComponent(msg) {
  noNetworkCard.classList.remove("hide-left");
  noNetworkCard.querySelector(".error-message").textContent = msg;
}

const noPostComponent = `
  <div
class="flex items-center justify-center bg-white mx-auto border-2 rounded-lg w-[30%] py-4 text-gray-600"
>
<div>
  <p class="block text-center mb-4">🚫 No Posts yet! 🚫</p>
  <p class="block text-center">Add a post to start your journey</p>
</div>
</div>
`;

async function getMyPosts() {
  const data = await fetch("https://localhost:8080/api/v1/post/me");
  const response = await data.json();
  if (response.status === "success") generatePosts(response.data.posts);
  else {
    noNetworkCard.classList.remove("hide-left");
  }
}

function generatePosts(data) {
  if (data.length === 0) postContainer.innerHTML = noPostComponent;
  else {
    const HTML = data
      .map(
        (post) =>
          `
        <div data-id="${post._id}"
          class="post relative flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto max-w-md md:max-w-2xl mb-8"
          >
          <button
  id="edit-button"
  class="hidden absolute bottom-1 right-48 text-indigo-700 rounded-xl bg-slate-200 px-2 py-1"
>
  Post
</button>
          <div class="flex items-start w-[82%] px-4 py-6">
            <svg
              class="w-12 h-12 rounded-full object-cover mr-4 shadow fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
              ></path>
            </svg>
            <div class="">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 -mt-1">
                  You
                </h2>
              </div>
              <p class="text-gray-700">Created at ${post.createdAt}.</p>
              <p
                class="text mt-3 w-[25rem] text-gray-700 text-base"
              >
                ${post.text}
              </p>
              <div class="mt-4 flex items-center"></div>
            </div>
          </div>
          <div class="dropdown dropdown-end ml-auto">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="flex justify-center align-center w-[20px] rounded-full">
          <svg class="h-[-webkit-fill-available] w-full fill-current text-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z"/></svg>
          </div>
        </label>
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
          <li><button class="edit-post">✏️ Edit</button></li>
          <li><button class="delete-post">🗑️ Delete</button></li>
        </ul>
      </div>
      </div>
      `
      )
      .reverse()
      .join(" ");
    postContainer.innerHTML = HTML;
  }
}

createPostButton.addEventListener("click", async () => {
  let text = textArea.value;
  if (!text) return;
  const data = await fetch("https://localhost:8080/api/v1/post/", {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();

  if (response.status === "success") {
    await getMyPosts();
  } else {
    showErrorComponent(response.message);
  }
  textArea.value = "";
});

document.addEventListener("click", async (e) => {
  if (e.target.closest("button")?.classList.contains("edit-post")) {
    const post = e.target.closest(".post");
    post.querySelector(".text").setAttribute("contenteditable", "true");
    post.querySelector(".text").focus();
    post.querySelector("#edit-button").classList.remove("hidden");
  }
  if (e.target.id === "edit-button") {
    const post = e.target.closest(".post");
    const { id } = post.dataset;
    const text = post.querySelector(".text").textContent;
    const data = await fetch(`https://localhost:8080/api/v1/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const response = await data.json();
    post.querySelector(".text").setAttribute("contenteditable", "false");
    post.querySelector("#edit-button").classList.add("hidden");
    if (!response.status === "success") showErrorComponent(response.message);
  }
  if (e.target.closest("button")?.classList.contains("delete-post")) {
    const post = e.target.closest(".post");
    const { id } = post.dataset;
    const data = await fetch(`https://localhost:8080/api/v1/post/${id}`, {
      method: "DELETE",
    });
    // const response = await data.json();
    if (data.ok) await getMyPosts();
    const response = await data.json();
    if (!response.status === "success") showErrorComponent(response.message);
  }
});

logOut.addEventListener("click", async () => {
  await fetch("https://localhost:8080/api/v1/user/logout", {
    method: "POST",
  });
  window.location.href = "https://localhost:8080/";
});

document
  .querySelector("#close--no-network")
  .addEventListener("click", () => noNetworkCard.classList.add("hide-left"));
