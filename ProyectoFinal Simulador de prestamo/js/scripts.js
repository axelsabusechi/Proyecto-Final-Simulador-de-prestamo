const monto = document.getElementById('monto');
const moneda = document.getElementById('moneda');
const plazo = document.getElementById('plazo');
const btnSimular = document.getElementById('simular');
const grilla = document.querySelector('#grilla tbody');
const plazointereses = []

monto.value = localStorage.getItem('monto');

class PlazoInteres {
    constructor(id, interes) {
        this.id = id;
        this.interes = parseFloat(interes);
    }
}

function buscarInteres(plazo) {
    for (const item of plazointereses) {
        if (plazo == item.id) {
            return item.interes;
        }
    }
}

const leer_plazos = async () => {
    const resp = await fetch('js/plazos.json')
    const data = await resp.json()

    data.forEach((post) => {
        const option = document.createElement('option');
        option.innerHTML = `
            ${post.id}
        `
        plazo.append(option);
        plazointereses.push(new PlazoInteres(post.id, post.interes));
    })
}

const leer_monedas = async () => {
    const resp = await fetch('js/monedas.json')
    const data = await resp.json()

    data.forEach((post) => {
        const option = document.createElement('option');
        option.innerHTML = `
            ${post.nombre}
        `
        moneda.append(option);
    })
}

leer_plazos()
leer_monedas()


btnSimular.onclick = () => {
    const interes = 1.5

    if (monto.value == '' || monto.value == 0 || plazo.value == '' || plazo.value == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Los valores no pueden ser vacíos o cero'
        })

        return false;
    }

    if (monto.value >= 2000000) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El monto no puede exceder los 2.000.000'
        })

        return false;
    }

    calcularCuota(monto.value, plazo.value);
}


function calcularCuota(monto, plazo) {
    let pagoIntereses = 0, pagoCapital = 0, cuota = 0, interes = 0;

    //Grabo el dato del monto en el localStorage
    localStorage.clear()
    localStorage.setItem('monto', monto);

    while (grilla.firstChild) {
        grilla.removeChild(grilla.firstChild);
    }

    interes = buscarInteres(plazo);
    cuota = monto * (Math.pow(1 + interes / 100, plazo) * interes / 100) / (Math.pow(1 + interes / 100, plazo) - 1);

    const cabgrilla = document.createElement('tr');
    cabgrilla.innerHTML =
        `<th scope="col">N° Cuota</th>
    <th scope="col">Monto Cuota</th>
    <th scope="col">Capital</th>
    <th scope="col">Interes</th>
    <th scope="col">Capital Adeudado</th>`;
    grilla.appendChild(cabgrilla);

    for (let i = 1; i <= plazo; i++) {
        pagoIntereses = parseFloat(monto * (interes / 100));
        pagoCapital = cuota - pagoIntereses;
        monto = parseFloat(monto - pagoCapital);

        const fila = document.createElement('tr');
        fila.innerHTML = `
                    <th scope="row">${i}</th>
                    <td>${cuota.toFixed(2)}</td>
                    <td>${pagoCapital.toFixed(2)}</td>
                    <td>${pagoIntereses.toFixed(2)}</td>
                    <td>${monto.toFixed(2)}</td>
                `;

        grilla.appendChild(fila);
    }
}

