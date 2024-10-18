const platno = document.getElementById('bludisteCanvas');
const ctx = platno.getContext('2d');
const velikostBunky = 20;
let bludiste, sirka, vyska;

function generovatBludiste(s, v) {
    sirka = s; vyska = v;
    platno.width = sirka * velikostBunky;
    platno.height = vyska * velikostBunky;
    bludiste = vytvorMriz(sirka, vyska);

    const zasobnik = [{x: 0, y: 0}];
    bludiste[0][0].navstiveno = true;

    while (zasobnik.length > 0) {
        const {x, y} = zasobnik.pop();
        const sousedi = ziskatNenavstiveneSousedy(x, y);
        if (sousedi.length > 0) {
            zasobnik.push({x, y});
            const {nx, ny} = sousedi[Math.floor(Math.random() * sousedi.length)];
            odstranitZed(x, y, nx, ny);
            bludiste[ny][nx].navstiveno = true;
            zasobnik.push({x: nx, y: ny});
        }
    }
    vykreslitBludiste();
}

function resitBludiste() {
    const fronta = [{x: 0, y: 0, cesta: []}], navstiveno = Array(vyska).fill().map(() => Array(sirka).fill(false));
    navstiveno[0][0] = true;

    while (fronta.length > 0) {
        const {x, y, cesta} = fronta.shift();
        if (x === sirka - 1 && y === vyska - 1) {
            vykreslitCestu([...cesta, {x, y}]);
            return;
        }
        ziskatPruchoziSousedy(x, y).forEach(({nx, ny}) => {
            if (!navstiveno[ny][nx]) {
                navstiveno[ny][nx] = true;
                fronta.push({x: nx, y: ny, cesta: [...cesta, {x, y}]});
            }
        });
    }
}

function vytvorMriz(s, v) {
    return Array.from({length: v}, () => Array.from({length: s}, () => ({navstiveno: false, zdi: {nahore: true, vpravo: true, dole: true, vlevo: true}})));
}

function ziskatNenavstiveneSousedy(x, y) {
    const sousedi = [];
    if (y > 0 && !bludiste[y - 1][x].navstiveno) sousedi.push({nx: x, ny: y - 1});
    if (x > 0 && !bludiste[y][x - 1].navstiveno) sousedi.push({nx: x - 1, ny: y});
    if (y < vyska - 1 && !bludiste[y + 1][x].navstiveno) sousedi.push({nx: x, ny: y + 1});
    if (x < sirka - 1 && !bludiste[y][x + 1].navstiveno) sousedi.push({nx: x + 1, ny: y});
    return sousedi;
}

function ziskatPruchoziSousedy(x, y) {
    const sousedi = [];
    if (!bludiste[y][x].zdi.nahore && y > 0) sousedi.push({nx: x, ny: y - 1});
    if (!bludiste[y][x].zdi.vpravo && x < sirka - 1) sousedi.push({nx: x + 1, ny: y});
    if (!bludiste[y][x].zdi.dole && y < vyska - 1) sousedi.push({nx: x, ny: y + 1});
    if (!bludiste[y][x].zdi.vlevo && x > 0) sousedi.push({nx: x - 1, ny: y});
    return sousedi;
}

function odstranitZed(x1, y1, x2, y2) {
    if (x1 === x2 && y1 > y2) { bludiste[y1][x1].zdi.nahore = false; bludiste[y2][x2].zdi.dole = false; }
    else if (x1 === x2 && y1 < y2) { bludiste[y1][x1].zdi.dole = false; bludiste[y2][x2].zdi.nahore = false; }
    else if (y1 === y2 && x1 > x2) { bludiste[y1][x1].zdi.vlevo = false; bludiste[y2][x2].zdi.vpravo = false; }
    else if (y1 === y2 && x1 < x2) { bludiste[y1][x1].zdi.vpravo = false; bludiste[y2][x2].zdi.vlevo = false; }
}

function vykreslitBludiste() {
    ctx.clearRect(0, 0, platno.width, platno.height);
    for (let y = 0; y < vyska; y++) {
        for (let x = 0; x < sirka; x++) {
            const bunka = bludiste[y][x];
            const px = x * velikostBunky;
            const py = y * velikostBunky;
            if (bunka.zdi.nahore) ctx.strokeRect(px, py, velikostBunky, 0);
            if (bunka.zdi.vpravo) ctx.strokeRect(px + velikostBunky, py, 0, velikostBunky);
            if (bunka.zdi.dole) ctx.strokeRect(px, py + velikostBunky, velikostBunky, 0);
            if (bunka.zdi.vlevo) ctx.strokeRect(px, py, 0, velikostBunky);
        }
    }
}

function vykreslitCestu(cesta) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    let i = 0;
    const interval = setInterval(() => {
        if (i < cesta.length) {
            const {x, y} = cesta[i];
            ctx.lineTo(x * velikostBunky + velikostBunky / 2, y * velikostBunky + velikostBunky / 2);
            ctx.stroke();
            i++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

document.getElementById('generovat').addEventListener('click', () => {
    const sirka = parseInt(document.getElementById('sirka').value);
    const vyska = parseInt(document.getElementById('vyska').value);
    generovatBludiste(sirka, vyska);
});

document.getElementById('resit').addEventListener('click', resitBludiste);
