import "./index.scss";

class Dog {
  constructor() {
    this.apiUrl = "https://dog.ceo/api";
    this.imgElement = document.querySelector("img");
    this.backgroundElement = document.querySelector(
      ".featured-dog__background"
    );
    this.titleElement = document.querySelector(".tiles");
    this.spinnerElement = document.querySelector(".spinner");

    this.init();
  }

  showSpinner() {
    this.spinnerElement.classList.add("spinner--visible");
  }

  hideSpinner() {
    this.spinnerElement.classList.remove("spinner--visible");
  }

  getAllDogs() {
    return fetch(`${this.apiUrl}/breeds/list/all`)
      .then((resp) => resp.json())
      .then((data) => {
        return data.message;
      });
  }

  getRandomImage() {
    this.showSpinner();
    return fetch(`${this.apiUrl}/breeds/image/random`)
      .then((resp) => resp.json())
      .then((data) => {
        return data.message;
      });
  }

  getRandomImageByBreed(breed) {
    return fetch(`${this.apiUrl}/breed/${breed}/images/random`)
      .then((resp) => resp.json())
      .then((data) => {
        return data.message;
      });
  }

  showImageWhenReady(src) {
    this.imgElement.setAttribute("src", src);
    this.backgroundElement.style.background = `url("${src}")`;
  }

  showAllBreeds() {
    this.getAllDogs().then((breeds) => {
      for (const breed in breeds) {
        if (breeds[breed].length === 0) {
          this.addBreed(breed);
        } else {
          for (const subBreed of breeds[breed]) {
            this.addBreed(breed, subBreed);
          }
        }
      }
    });
  }

  addBreed(breed, subbreed) {
    let name;
    let type;

    if (typeof subbreed === "undefined") {
      name = breed;
      type = breed;
    } else {
      name = `${breed} ${subbreed}`;
      type = `${breed}/${subbreed}`;
    }

    const title = document.createElement("div");
    title.classList.add("tiles__tile");

    const titleContent = document.createElement("div");
    titleContent.classList.add("tiles__tile-content");

    titleContent.innerText = name;
    titleContent.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      this.showSpinner();
      this.getRandomImageByBreed(type).then((src) => {
        this.showImageWhenReady(src);
        this.hideSpinner();
      });
    });

    title.appendChild(titleContent);
    this.titleElement.appendChild(title);
  }

  init() {
    this.showSpinner();
    this.getRandomImage().then((src) => {
      this.showImageWhenReady(src);
      this.hideSpinner();
    });

    this.showAllBreeds();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Dog();
});
