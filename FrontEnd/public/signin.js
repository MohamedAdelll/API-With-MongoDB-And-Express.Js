const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const formSignin = document.querySelector(".sign-in--form");
const formSignup = document.querySelector(".sign-up--form");
const noNetworkCard = document.querySelector("#no-network");

function showErrorComponent(msg) {
  console.log("zeb");
  noNetworkCard.classList.remove("hide-left");
  noNetworkCard.querySelector(".error-message").textContent = msg;
}
document
  .querySelector("#close--no-network")
  .addEventListener("click", () => noNetworkCard.classList.add("hide-left"));

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

if (document.cookie.split("; ").some((key) => key.startsWith("jwt_sent")))
  window.location.href = "https://localhost:8080/home";

formSignin.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(this).entries());
  const formDataJson = JSON.stringify(formData);
  const data = await fetch("https://localhost:8080/api/v1/user/signin", {
    method: "POST",
    body: formDataJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  if (response.status === "success") {
    window.location.href = "https://localhost:8080/home";
  } else {
    showErrorComponent(response.message);
  }
});

formSignup.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(this).entries());
  const formDataJson = JSON.stringify(formData);
  const data = await fetch("https://localhost:8080/api/v1/user/signup", {
    method: "POST",
    body: formDataJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  console.log(response, !response.status === "success");
  if (!(response.status === "success")) showErrorComponent(response.message);
  if (response.status === "success") {
    this.querySelectorAll("input").forEach((element) => {
      element.value = "";
    });
    // window.location.href = "https://localhost:8080/";
  }
});
