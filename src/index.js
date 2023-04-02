let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Render all the toys from the server
  function renderToys(toys) {
    toys.forEach((toy) => {
      renderToy(toy);
    });
  }

  // Render a single toy
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    const toyName = document.createElement("h2");
    toyName.innerText = toy.name;

    const toyImg = document.createElement("img");
    toyImg.src = toy.image;
    toyImg.className = "toy-avatar";

    const toyLikes = document.createElement("p");
    toyLikes.innerText = `${toy.likes} likes`;

    const likeBtn = document.createElement("button");
    likeBtn.innerText = "Like <3";
    likeBtn.className = "like-btn";
    likeBtn.addEventListener("click", () => {
      likeToy(toy, toyLikes);
    });

    toyCard.appendChild(toyName);
    toyCard.appendChild(toyImg);
    toyCard.appendChild(toyLikes);
    toyCard.appendChild(likeBtn);

    toyCollection.appendChild(toyCard);
  }

  // Add a new toy to the server and render it on the page
  function addNewToy(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;

    const toyData = {
      name: name,
      image: image,
      likes: likes,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((response) => response.json())
      .then((newToy) => {
        renderToy(newToy);
      });

    event.target.reset();
  }

  // Increase the like count of a toy in the server and update the like count on the page
  function likeToy(toy, toyLikes) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        toyLikes.innerText = `${updatedToy.likes} likes`;
      });
  }

  // Load all the toys from the server when the page is loaded
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      renderToys(toys);
    });

  // Add a new toy to the server and render it on the page when the form is submitted
  toyForm.addEventListener("submit", addNewToy);
});

