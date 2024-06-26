import { doFetch } from "./utils/doFetch.mjs";
import { API_RAINYDAYS_PRODUCTS } from "./constant.mjs";
import { updateCartIcon} from "./utils/updateCartIcon.mjs";
import { alertUser} from "./utils/errorHandler.mjs";

document.addEventListener("DOMContentLoaded", () => {
  updateCartIcon();
});


function scrollDownButton (){
  const targetSection = document.querySelector(".all-jackets");
  if(targetSection){
    targetSection.scrollIntoView({behavior: "smooth"});
  } else {
    alertUser("Sorry, we could not find this page right now, please reload the page");
  }
}

document.addEventListener ("DOMContentLoaded", () => {
  const shopNowButton = document.querySelector("#shop-now");
  if(shopNowButton){
    shopNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      scrollDownButton();
    });
  } else {
    alertUser("Sorry, something went wrong, please reload the page");
  }
});

function generateRainydaysProductHtml(product) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "product";

  const productLink = document.createElement ("a");
  productLink.href = `./product/index.html?id=${product.id}`;

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;
  img.className = "jacket_img";
  productLink.appendChild(img);

  const productTitle = document.createElement("p");
  productTitle.textContent = product.title;
  productTitle.className = "product-title";

  const productDescription = document.createElement ("p");
  productDescription.textContent = product.description;
  productDescription.className = "product-description";

  const productPrice = document.createElement("p");
  productPrice.textContent = `NOK ${product.price}`;
  productPrice.className = "product-price";

  containerDiv.appendChild(productLink);
  containerDiv.appendChild(productTitle);
  containerDiv.appendChild(productDescription);
  containerDiv.appendChild(productPrice);

  return containerDiv;
}

async function displayRainydaysProducts(products, genderSelection) {
  const displayContainer = document.querySelector("#display-container");
  displayContainer.innerHTML = "";
  let filteredProducts = products;


    //Checking that products is not null to avoid null pointer expection 
  if (filteredProducts != undefined) {
    if (genderSelection === "Female" || genderSelection === "Male") {
        filteredProducts = products.filter(product => product.gender === genderSelection); 
    }
  
    filteredProducts.forEach((product) => {
        const rainydaysHtml = generateRainydaysProductHtml(product);
        displayContainer.appendChild(rainydaysHtml);
    });
  } else {
    alertUser("Failed to retrieve product information, please reload the page");
  }
}

async function main() {
  try {
    const rainydaysProducts = await doFetch(API_RAINYDAYS_PRODUCTS);
    displayRainydaysProducts(rainydaysProducts);

    const select = document.querySelector("#gender");
    if(select) {
      select.addEventListener("change", function() {
        displayRainydaysProducts(rainydaysProducts, select.value);
    });
    } else {
      alertUser("Could not find the gender selection element, please reload the page")
    }
  } catch (error) {
    alertUser("An error occurred while loading the products, please reload the page")
  }
}
  
  main();


