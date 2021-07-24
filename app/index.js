import "./index.scss";

class Dog {
  constructor() {
    this.apiUrl = "https://dog.ceo/api";
    this.imgElement = document.querySelector("img");
    this.backgroundElement = document.querySelector(
      ".featured-dog__background"
    );
    this.titleElement = document.querySelector(".tiles");
    this.selectElement = document.querySelector("select");
    this.spinnerElement = document.querySelector(".spinner");
    this.activeDogElement = document.querySelector(".container__active-dog");

    this.init();
  }
  activeDog = null;
  status = null;

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
        return data;
      });
  }

  getRandomImage() {
    this.showSpinner();
    return fetch(`${this.apiUrl}/breeds/image/random`)
      .then((resp) => resp.json())
      .then((data) => {
        this.status = data.status;
        return data;
      });
  }

  changeImageOnClick() {
    if (this.activeDog === null) {
      return this.getRandomImage().then(({ message }) => {
        this.showImageWhenReady(message);
        this.hideSpinner();
      });
    }
    this.getRandomImageByBreed(this.activeDog).then(({ message }) => {
      this.showImageWhenReady(message);
      this.hideSpinner();
    });
  }

  getNewRandomImage() {
    this.imgElement.addEventListener("click", () => this.changeImageOnClick());
  }

  getRandomImageByBreed(breed) {
    return fetch(`${this.apiUrl}/breed/${breed}/images/random`)
      .then((resp) => resp.json())
      .then((data) => {
        this.status = data.status;
        return data;
      });
  }

  showImageWhenReady(src) {
    this.imgElement.setAttribute("src", src);
    this.backgroundElement.style.background = `url("${src}")`;
  }

  showAllBreeds() {
    this.getAllDogs().then(({ message }) => {
      for (const breed in message) {
        if (message[breed].length === 0) {
          this.addBreed(breed);
        } else {
          for (const subBreed of message[breed]) {
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

    const option = document.createElement("option");
    option.innerText = name;
    option.setAttribute("value", type);
    this.selectElement.appendChild(option);
  }

  addEventListenerToSelectElement() {
    this.selectElement.addEventListener("change", (e) => {
      this.activeDog = e.target.value;
      this.activeDogElement.innerHTML = `<p>Actual selecter dog: ${this.activeDog
        .replace("/", " ")
        .toUpperCase()
        .bold()}. Click on image to load new image</p>`;

      this.showSpinner();

      this.getRandomImageByBreed(this.activeDog).then(({ message }) => {
        if (this.status !== "error") {
          this.showImageWhenReady(message);
          this.hideSpinner();
        } else {
          this.activeDogElement.innerHTML = `<p>Something went wrong - try to select another breed</p>`;
        }
      });
    });
  }

  init() {
    this.showSpinner();
    this.getRandomImage().then(({ message }) => {
      this.showImageWhenReady(message);
      this.hideSpinner();
    });
    this.getNewRandomImage();

    this.showAllBreeds();
    this.addEventListenerToSelectElement();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Dog();
});
