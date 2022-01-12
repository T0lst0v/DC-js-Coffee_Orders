//buttons
const btnAdd = document.querySelector("#btnAdd");
const btnSearch = document.querySelector("#btnSearch");
const btnFind = document.querySelector("#btnFind");
const btnNewOrder = document.querySelector("#btnNewOrder");
const btnDisplayAll = document.querySelector("#btnDisplayAll");
const btnSubmit = document.querySelector("#btnSubmit");
//containers
const displayAllContainer = document.querySelector("#displayAllContainer");
const formAdd = document.querySelector("#formAdd");
const formSearch = document.querySelector("#formSearch");
const displayPrice = document.querySelector("#price");
//fields
const email = document.querySelector("#email");
const type = document.querySelector("#type");
const size = document.querySelector("#size");
const inputSearch = document.querySelector("#inputSearch");

const apiURL = "https://troubled-peaceful-hell.glitch.me/orders";

const pricing = {
  Black: 2,
  Cappuccino: 3,
  Latte: 3,
  Espresso: 4,
};
const sizingMult = {
  Small: 1,
  Medium: 1.25,
  Large: 1.5,
};

function receiveItems(url, callBackList) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();
  request.addEventListener("load", function () {
    let coffeeList = JSON.parse(this.responseText);
    callBackList(coffeeList);
  });
}

function sendItem(body) {
  let request = new XMLHttpRequest();
  request.open("POST", apiURL);
  request.setRequestHeader("Content-Type", "application/json");
  request.addEventListener("load", function () {
    console.log(this.responseText);
  });
  request.send(JSON.stringify(body));
}

function deleteItem(e) {
  let request = new XMLHttpRequest();
  request.addEventListener("load", function () {
    //reUploading after deleting
    displayItems(apiURL);
  });
  request.open("DELETE", `${apiURL}/${e}`);
  request.send();
}

function displayItems(url) {
  receiveItems(url, function (list) {
    let item = list.map((e) => {
      return `
        <li class="item"> 
            <h3>${e.email} </h3>
            <h4>${e.type} </h4>
            <h4>${e.size} </h4>
            <h5>$${e.price} </h5>
            <button onclick="deleteItem('${e.email}')">Delete</button>
        </li>
        `;
    });

    displayAllContainer.innerHTML = item.join("");
  });
}

//mail Validation

function validateEmail(email) {
  const ev = /\S+@\S+\.\S+/;
  return ev.test(email);
}

//calculating price
function itemPrice(a, b) {
  return pricing[a] * sizingMult[b];
}

function clearValues(e) {
  e.value = "";
}

//presenting price during selection (size need to be selected last)
size.addEventListener("change", (e) => {
  let p = itemPrice(type.value, size.value);
  displayPrice.innerText = `$${p}`;
});

// fetching and Displaying All items
btnDisplayAll.addEventListener("click", () => {
  displayItems(apiURL);
  //hide all HTML fields
  formAdd.style.display = "none";
  formSearch.style.display = "none";
});

///searching
btnFind.addEventListener("click", () => {
  s = inputSearch.value;

  if (validateEmail(s)) {
    receiveItems(`${apiURL}/${s}`, function (list) {
      if (list["email"] != undefined) {
        let email = list["email"];
        displayAllContainer.innerHTML = `
        <li class="item">
            <h3>${list["email"]} </h3>
            <h4>${list["type"]} </h4>
            <h4>${list["size"]} </h4>
            <h5>$${list["price"]} </h5>
            <button onclick="deleteItem('${email}')">Delete</button>
        </li>
        `;
      } else {
        alert("no Email was found");
      }
    });
  } else {
    alert("Enter Correct Email");
  }
});

//submitting form with Validation
btnSubmit.addEventListener("click", function () {
  if (validateEmail(email.value) && type.value != "" && size.value != "") {
    p = itemPrice(type.value, size.value);
    body = {
      email: email.value,
      type: type.value,
      size: size.value,
      price: p,
    };
    sendItem(body);
    //clearing all Fields
    clearValues(email);
    clearValues(type);
    clearValues(size);
  } else {
    alert("Please fill all Fields Correctly");
  }
});

// Display/Hide HTML fields
btnNewOrder.addEventListener("click", () => {
  console.log(formAdd);
  formSearch.style.display = "none";
  formAdd.style.display = "block";
});
// Display/Hide HTML fields
btnSearch.addEventListener("click", () => {
  console.log(formAdd);
  formAdd.style.display = "none";
  formSearch.style.display = "block";
});

// console.log(sizingMult);
// console.log(pricing);
// let val = itemPrice("Espresso", "Large");
// console.log(val);
