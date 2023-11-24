class Termek {
   constructor(id, nev, ar, img) {
      this.id = id;
      this.nev = nev.toLowerCase();
      this.ar = ar;
      this.img = img;
      this.mennyiseg = 0;
   }
   build() {
      return `<input type="image" name="termek-${this.id}" alt="${this.nev}" src="./img/${this.img}" class="col-1 img-fluid"></input>`;
   }
}

//#region Variables
const termekekForm = document.querySelector("#termekek");

const kosarForm = document.querySelector("#kosar");
const kosarLista = document.querySelector("#kosar-lista");
const vegOsszegText = document.querySelector("#vegosszeg");

const termekek = [];
const kosar = [];
let vegOsszeg = 0;
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

kosarForm.style.display = "none";
getTermekek();

const getKosarMennyiseg =  termek => parseInt(kosarLista.querySelector(`input[name="termek-${termek.id}"]`).value);
const updateKosarAr = termek => kosarLista.querySelector(`#termek-${termek.id}-ar`).innerHTML = `Összesen: ${termek.mennyiseg * termek.ar} Ft`;

const addToKosar = (termek) => {
   if(!kosar.includes(termek)) {
      kosar.push(termek);
      kosarLista.innerHTML += `<li class="col-4 d-inline-block"><img class="col-3 img-fluid" src="./img/${termek.img}" alt="${termek.nev}"/><label>Mennyiség: <input type="number" name="termek-${termek.id}" value="0"></input><p>Ár/db: ${termek.ar} FT  | <span id="termek-${termek.id}-ar"></span></p></label></li>`;
   }

   termek.mennyiseg = getKosarMennyiseg(termek) + 1;
   kosar.forEach(termek => {
      kosarLista.querySelector(`input[name="termek-${termek.id}"]`).value = termek.mennyiseg;
      updateKosarAr(termek);
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

kosarForm.addEventListener("change", (event) => {
   if (event.target.type === "number") {
      event.preventDefault();

      kosar.forEach(termek => {
         if (event.target.name === `termek-${termek.id}`) {
            termek.mennyiseg = getKosarMennyiseg(termek);
            updateKosarAr(termek);
         }
      });
   }
});

termekekForm.addEventListener("click", (event) => {
   if (event.target.type === "image") {
      event.preventDefault();

      if(kosarForm.style.display === "none") kosarForm.style.display = "block";
      vegOsszegText.innerHTML = "Kosár tartalma:";

      addToKosar(termekek.find(termek => `termek-${termek.id}` === event.target.name));
   }
});

kosarForm.addEventListener("submit", (event) => {
   event.preventDefault();

   kosar.forEach(termek => {
      vegOsszeg += termek.ar * termek.mennyiseg;
   });
   vegOsszegText.innerHTML = `Fizetendő összeg: ${vegOsszeg} Ft`;
   vegOsszeg = 0;
   
   kosarForm.style.display = "none";
   clearKosar();
});