import { items } from './utils.js'

//on affiche tous les items dynamiquement , en récupérant leurs données via items

function displayItems(items){
    document.getElementById("items").innerHTML = items
    .map((item) => {
      const { _id, imageUrl, altTxt, name, description } = item;
      return `
         <a href="./product.html?id=${_id}">
         <article>
               <img src="${imageUrl}" alt="${altTxt}">
               <h3 class="productName">${name}</h3>
               <p class="productDescription">${description}</p>
             </article>
         </a>
         `;
    })
    .join(" ");
}
displayItems(items)