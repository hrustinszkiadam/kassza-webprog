class Termek {
   constructor(id, nev, ar, img) {
      this.id = id;
      this.nev = nev[0].toUpperCase() + nev.slice(1).toLowerCase();
      this.ar = ar;
      this.img = img;
      this.mennyiseg = 0;
   }

   build() {
      return `<input type="image" name="termek-${this.id}" alt="${this.nev}" src="./img/${this.img}" class="col-1 img-fluid"></input>`;
   }

   buildKosar() {
      return `<li class="col-4 d-inline-block"><img class="col-3 img-fluid" src="./img/${this.img}" alt="${this.nev}"/><label><span>${this.nev}</span><br>Mennyiség: <input type="number" name="termek-${this.id}" value="0"></input><p>Ár/db: ${this.ar} FT  | <span id="termek-${this.id}-ar"></span></p></label></li>`;
   }
}

//#region INIT
const termekekForm = document.querySelector("#termekek");

const kosarForm = document.querySelector("#kosar");
const kosarLista = document.querySelector("#kosar-lista");
const vegOsszegText = document.querySelector("#vegosszeg");

const termekek = [];
const kosar = [];

document.addEventListener("DOMContentLoaded", async () => {
   await getTermekek();
   kosarForm.style.display = "none";
});
//#endregion

const getTermekek = () => {
   fetch('./termekek.json')
      .then(response => response.json())
      .then(data => {
         data.forEach(termek => {
            termekek.push(new Termek(termek.id, termek.nev, termek.ar, termek.img));        
         });
         termekek.forEach(termek => {
            termekekForm.innerHTML += termek.build();
         });
      });
};

const addToKosar = (termek) => {
   if(!kosar.includes(termek)) {
      kosar.push(termek);
      kosarLista.innerHTML += termek.buildKosar();
   }
   updateTermek(termek, 1);
};

const updateTermek = (termek, mennyisegIncrement = 0) => {
   termek.mennyiseg = parseInt(kosarLista.querySelector(`input[name="termek-${termek.id}"]`).value) + mennyisegIncrement;
   updateKosar();
}

const updateKosar = () => {
   kosar.forEach(termek => {
      kosarLista.querySelector(`input[name="termek-${termek.id}"]`).value = termek.mennyiseg;
      kosarLista.querySelector(`#termek-${termek.id}-ar`).innerHTML = `Összesen: ${termek.mennyiseg * termek.ar} Ft`;
   });
};

const clearKosar = () => {
   kosar.forEach(termek => {
      termek.mennyiseg = 0;
   });
   kosar.splice(0, kosar.length);

   kosarLista.innerHTML = "";
   kosarForm.reset();
};

const getVegosszeg = () => kosar.reduce((sum, termek) => sum + termek.mennyiseg * termek.ar, 0);

//click on item
termekekForm.addEventListener("click", (event) => {
   if (event.target.type === "image") {
      event.preventDefault();

      addToKosar(termekek.find(termek => `termek-${termek.id}` === event.target.name));

      kosarForm.style.display = kosarForm.style.display === "none" ? "block" : null;
      vegOsszegText.innerHTML = "Kosár tartalma:";
   }
});

//updated quantity in the cartForm (not by clicking on the item)
kosarForm.addEventListener("change", (event) => {
   if (event.target.type === "number") {
      event.preventDefault();

      updateTermek(termekek.find(termek => `termek-${termek.id}` === event.target.name));
   }
});

//payment
kosarForm.addEventListener("submit", (event) => {
   event.preventDefault();
   
   vegOsszegText.innerHTML = `Fizetendő összeg: ${getVegosszeg()} Ft`;
   kosarForm.style.display = "none";
   clearKosar();
});