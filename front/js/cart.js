import { items, getCart } from "./utils.js";
// import { getCart } from "./getCart.js"
//affichage des éléments du panier
//on récupère les données manquantes du panier ( prix , image , txt alt , nom )
// grace à getDetails qui trouve dans items l'item avec la meme id que l'item en cours d'examen dans .map
// on return le tout sous forme d'html, avec les données dynamiquements intégrées
// merci les templates literals

function displayCart(itemCart) {
  document.getElementById("cart__items").innerHTML = itemCart
    .map((item) => {
      const { id, color, quantity } = item;
      const getDetails = items.find((a) => a._id === item.id);
      const { imageUrl, altTxt, name, price } = getDetails;
      return `
        <article class="cart__item" data-id="${id}" data-color="${color}">
        <div class="cart__item__img">
          <img src="${imageUrl}" alt="${altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${name}</h2>
            <p>${color}</p>
            <p class="itemPrice">${price * quantity} Euros</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input data-id="${id}" data-color="${color}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
        `;
    })
    .join(" ");
}

// on met à jour le panier si l'utilisateur modifie la quantité
//on place un event listener sur le parent des éléments générés dynamiquement,
//on précise qu'on veut trigger la function uniquement sur le target event est l'input quantity
//si c'est le cas , on ajuste sa valeur en fonction de l'input value en s'assurant de modifier le bon item
// en checkant ses data_id et data_color
// on sauvegarde les changement dans le local storage
//on rerender le panier et le prix total

document.getElementById("cart__items").addEventListener("change", updateCart);
function updateCart(event) {
  if (event.target.nodeName.toLowerCase() !== "input") {
    return;
  }
  const itemId = event.target.dataset.id;
  const itemColor = event.target.dataset.color;
  const cart = getCart().map((item) => {
    if (item.id === itemId && item.color === itemColor) {
      return { ...item, quantity: parseInt(event.target.value) };
    } else {
      return { ...item };
    }
  });
  localStorage.setItem("aCart", JSON.stringify(cart));
  displayCart(getCart());
  displayTotalCost();
}

// meme chose pour la suppression d'un item,
// event listener sur le parent,
// qui ne trigger que si le target event possède la class deleteItem
// si c'est le cas , on s'assure de supprimer le bon item , en checkant ses dataid et datacolor
// on sauvegarde les changements dans le localstorage
// on rerender le panier

document.getElementById("cart__items").addEventListener("click", deleteItem);
function deleteItem(event) {
  const parentElement = event.target.closest("section > article");
  const parentElement__dataId = parentElement.getAttribute("data-id");
  const parentElement__dataColor = parentElement.getAttribute("data-color");
  if (!event.target.classList.contains("deleteItem")) {
    return;
  }
  const filtered = getCart().filter(
    (item) =>
      (item.id && item.color) !==
      (parentElement__dataId && parentElement__dataColor)
  );
  localStorage.setItem("aCart", JSON.stringify(filtered));
  displayCart(getCart());
  displayTotalCost();
}

// on calcule le prix total du panier
// en mapant a travers le panier
// on récupère la quantité de l'objet, on récupère son prix,
// on multiplie le prix par la quantity,
// on incrémente le nombre total d'objet,
// on affiche les données.
function displayTotalCost() {
  let itemQuantity = 0;
  let totalPrice = 0;
  getCart().map((item) => {
    itemQuantity += item.quantity;
    const itemId = item.id;
    const itemPrice = items.find((item) => itemId === item._id).price;
    totalPrice += item.quantity * itemPrice;
  });
  document.getElementById(
    "totalQuantity"
  ).parentElement.innerHTML = `Total (<span id="totalQuantity">${itemQuantity}</span> ${
    itemQuantity > 1 ? "articles" : "article"
  }) : <span id="totalPrice">${totalPrice}</span> €`;
}

displayCart(getCart());
displayTotalCost();

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const adress = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const submitBtn = document.getElementById("order");
submitBtn.addEventListener("click", sendOrder);

let emailRegExp = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);
let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let adressRegExp = new RegExp("[[a-zA-Zàâäéèêëïîôöùûüç0-9 ,'-]+$");

firstName.addEventListener("keyup", validateName);
lastName.addEventListener("keyup", validateName);
city.addEventListener("keyup", validateName);
adress.addEventListener("keyup", validateAdress);

//on check la validité des données saisies dans le formulaire, elles doivent
//etre conforme aux exigences des regex
function validateAdress() {
  if (!adressRegExp.test(adress.value)) {
    document.getElementById("addressErrorMsg").innerText =
      "Entrez une adresse valide";
  } else {
    document.getElementById("addressErrorMsg").innerText = "";
  }
}
function validateName(e) {
  if (!nameRegExp.test(e.target.value)) {
    e.target.nextElementSibling.innerText =
      "Veuillez entrer une valeur correcte";
  } else {
    e.target.nextElementSibling.innerText = "";
  }
}
email.addEventListener("keyup", validateEmail);
function validateEmail() {
  if (!emailRegExp.test(email.value)) {
    document.getElementById("emailErrorMsg").innerText =
      "Entrez un email valide";
  } else {
    document.getElementById("emailErrorMsg").innerText = "";
  }
}

//on s'assure que tous les elements du formulaire sont valides
function checkForm() {
  if (
    nameRegExp.test(firstName.value) &&
    nameRegExp.test(lastName.value) &&
    nameRegExp.test(city.value) &&
    adressRegExp.test(adress.value) &&
    emailRegExp.test(email.value)
  ) {
    return true;
  } else {
    return false;
  }
}
//on envoie la requete a l'api
//on recupere le numuéro de commande et on redirige vers la page confirmation
async function sendOrder(e) {
  e.preventDefault();
  const idProducts = getCart().map((item) => item.id);
  console.log(idProducts);
  if (!checkForm()) {
    window.alert("complete form please");
  }
  if (idProducts.length === 0) {
    window.alert("ajoutez au moins un produit au panier pour commander svp");
  } else {
    let res = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: adress.value,
          city: city.value,
          email: email.value,
        },
        products: idProducts,
      }),
    });
    let data = await res.json();
    localStorage.clear();
    window.location.replace(
      `http://127.0.0.1:5501/front/html/confirmation.html?id=${data.orderId}`
    );
  }
}

export { displayCart };
