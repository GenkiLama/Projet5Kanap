import { items } from "./utils.js";
import { getCurrentId, getCart } from "./data.js";
// import { getCart } from './getCart.js';

const colorInput = document.getElementById("colors");
const quantityInput = document.getElementById("quantity");
quantityInput.setAttribute("value", 1);
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", addItemToCart);
const itemId = getCurrentId();

//on se trouve sur la page d'un objet , la fonction getData le sait et nous renvoie ses données
// on les traite et on les affiche

function displayItem(item) {
  const { altTxt, colors, description, imageUrl, name, price } = item;
  document.getElementsByTagName("title")[0].innerText = name;
  document.getElementsByClassName(
    "item__img"
  )[0].innerHTML = `<img src="${imageUrl}" alt="${altTxt}">`;
  document.getElementById("title").innerText = name;
  document.getElementById("price").innerText = price;
  document.getElementById("description").innerText = description;
  const colorOptions = colors
    .map((color) => {
      return `<option value="${color}">${color}</option>`;
    })
    .join(" ");
  document.getElementById(
    "colors"
  ).innerHTML = `<option value="">--SVP, choisissez une couleur --</option> ${colorOptions}`;
}
displayItem(items);

//on ajoute un item au panier
//on récupère les données de l'objet dans un objet type,
// on s'assure que l'utilisateur a bien choisi une couleur, sinon on l'averti
//on vérifie que l'objet n'est pas déja présent dans le panier en checkant son id et sa couleur,
// si il y est deja , on incrémente la quantité voulue
//si il n'y est pas déja on l'y place avec toutes ses données
//on sauvegarde dans localstorage

function addItemToCart() {
  let myItem = {
    id: itemId,
    color: colorInput.value,
    quantity: parseInt(quantityInput.value),
  };
  const { id, color , quantity } = myItem
  if (!myItem.color || myItem.quantity <= 0) {
    window.alert("pick a color and a quantity please");
  } else {
    const cart = getCart()
    const existingItem = cart.find(
      (item) => item.id == id && item.color == color
    );
    if (existingItem) {
      existingItem.quantity = parseInt(existingItem.quantity);
      existingItem.quantity += quantity;
    } else {
      cart.push(myItem);
    }
    localStorage.setItem("aCart", JSON.stringify(cart));
    addToCartBtn.innerText = 'Produit ajouté au panier'
  }
}
