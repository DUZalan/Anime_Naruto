let animek = [];
let tablaElemek = [];
let kartyak = []

async function adatok() {
  const x = await fetch("https://api.jikan.moe/v4/anime?q=naruto");
  const y = await x.json();

  konzolKiir(y.data)

  return y.data
}

const konzolKiir = (adat) => {
  console.log(adat)
}

async function carouselMegjelen() {
  animek = await adatok()
  const carousel = document.getElementById("carouselTart");

  carousel.innerHTML = "";

  for (let i = 0; i < animek.length; i++) {
    carousel.innerHTML += `
      <div class="carousel-item ${i === 0 ? "active" : ""}">

        <a title="Megnyitás" target="_blank" href="${animek[i].images.webp.large_image_url}">

        <img src="${animek[i].images.webp.large_image_url}" class="carousel-img img-fluid">

        </a>
      </div>
    `
  }
  carouselTabla(0);

  document.getElementById("carousel").addEventListener("slid.bs.carousel", function (event) {
    carouselTabla(event.to)
    });
}

function carouselTabla(elem) {
  const animeElem = animek[elem];

  document.getElementById("listaCim").innerText = animeElem.title;
  document.getElementById("mufaj").innerText = animeElem.genres.map(mufajok => mufajok.name).join(", ")
  document.getElementById("epizodszam").innerText = animeElem.episodes || "Ismeretlen"
  document.getElementById("animeHossz").innerText = animeElem.duration || "Ismeretlen"
  document.getElementById("ertekeles").innerText = animeElem.score || "N/A"
  document.getElementById("korhatar").innerText = animeElem.rating || "N/A"
  document.getElementById("aktualisErdek").innerText = animeElem.background || "Nincs érdekesség"
}

async function kartya() {
  kartyak = await adatok()
  
  const doboz = document.getElementById("doboz")
  doboz.innerHTML = "";

  for (let i = 0; i < kartyak.length; i++) {
    doboz.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="doboz kartya h-100" onclick="modal(${i})">

          <img src="${kartyak[i].images.webp.image_url}" class="doboz-img-top img-fluid">

          <div>
            <h5 style="font-weight: bolder;">${kartyak[i].title}</h5>
            <p>

            <i>${kartyak[i].synopsis ? kartyak[i].synopsis.substring(0, 100)+"...":"Nincs leírás"}</i>

            </p>
            
          </div>
        </div>

      </div>
    `
  }
}

async function statisztika() {
  const anime = await adatok();

  Plotly.newPlot("statTabla", [{
    x: anime.map(a => a.title),
    y: anime.map(a => a.score),
    type: "bar"
  }]);

Plotly.newPlot("statTabla", [
  {
    y: anime.map(a => a.score),
    mode: "markers",
    type: "scatter",
    text: anime.map(a => a.title)
  }
], {
  title: "Animék száma és IMDb értékelés",
  xaxis: { title: "Animék száma" },
  yaxis: { title: "Értékelés" }
});
}

function modal(elem) {
  const anime = kartyak[elem];

  document.getElementById("modalCim").innerText = anime.title;
  document.getElementById("modalKep").src = anime.images.webp.large_image_url;

  let sz = anime.synopsis || "Nincs leírás";
  sz = sz.replace("[Written by MAL Rewrite]", "");
  document.getElementById("modalLeiras").innerText = sz

  const modal = new bootstrap.Modal(document.getElementById("kartyaModal"));
  modal.show();
}

async function keresoTabla() {
  osszesAdat = await adatok();
  tablaRajzol(osszesAdat);
}

async function tablaRajzol(listaElem) {
  const tabla = document.getElementById("keresoTabla");
  tabla.innerHTML = ""

  for (let i = 0; i < listaElem.length; i++) {
    tabla.innerHTML += `
      <tr>
        <td><i>${listaElem[i].title}</i></td>
        <td>${listaElem[i].year || "?"}</td>
        <td>${listaElem[i].studios.map(s => s.name).join(", ")}</td>
        <td>${listaElem[i].source}</td>
        <td><b>${listaElem[i].score || "N/A"}</b></td>
        <td>#${listaElem[i].rank || "-"}</td>
      </tr>
      `
  }
}

const bemenet = document.getElementById("kbemenet");
let hibaUzenet = document.getElementById("hibaUzenet");

if (bemenet) {
  bemenet.addEventListener("input", function () {
    const keresettAdat = bemenet.value.toLowerCase();
    const keresett = osszesAdat.filter(anime => anime.title.toLowerCase().includes(keresettAdat));
    tablaRajzol(keresett)

    if (keresett.length === 0) {
      hibaUzenet.style.display = "block";
    } 
    else {
      hibaUzenet.style.display = "none"
    }
  });
}



