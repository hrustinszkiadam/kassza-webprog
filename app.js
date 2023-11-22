class Termek {
   constructor(nev, ar, img) {
      this.nev = nev.toLowerCase();
      this.ar = ar;
      this.img = img;
      this.mennyiseg = 0;
   }
   build() {
      return `<input type="image" name="${this.nev}" alt="${this.nev}" src="./img/${this.img}" class="col-1 img-fluid"></input>`;
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
            termekek.push(new Termek(termek.nev, termek.ar, termek.img));            
         });
         termekek.forEach(termek => {
            termekekForm.innerHTML += termek.build();
         });
      });
};

kosarForm.style.display = "none";
getTermekek();

const getKosarMennyiseg =  termek => parseInt(kosarLista.querySelector(`input[name="${termek.nev}"]`).value);

const addToKosar = (termek) => {
   if(!kosar.includes(termek)) {
      kosar.push(termek);
      kosarLista.innerHTML += `<li class="col-4 d-inline-block"><img class="col-3 img-fluid" src="./img/${termek.img}" alt="${termek.nev}"/><label>Mennyiség: <input type="number" name="${termek.nev}" value="0"></input></label></li>`;
   }

   termek.mennyiseg = getKosarMennyiseg(termek) + 1;
   kosar.forEach(termek => {
      kosarLista.querySelector(`input[name="${termek.nev}"]`).value = termek.mennyiseg;
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

termekekForm.addEventListener("click", (event) => {
   if (event.target.type === "image") {
      event.preventDefault();

      if(kosarForm.style.display === "none") kosarForm.style.display = "block";
      vegOsszegText.innerHTML = "Kosár tartalma:";

      addToKosar(termekek.find(termek => termek.nev === event.target.name));

   }
});

kosarForm.addEventListener("submit", (event) => {
   event.preventDefault();

   kosar.forEach(termek => {
      vegOsszeg += termek.ar * getKosarMennyiseg(termek);
   });
   vegOsszegText.innerHTML = `Fizetendő összeg: ${vegOsszeg} Ft`;
   
   vegOsszeg = 0;
   kosarForm.style.display = "none";
   clearKosar();
});