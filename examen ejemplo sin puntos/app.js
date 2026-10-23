const elementoPregunta = document.querySelector("#pregunta");
const elementoOpciones = document.querySelector("#opciones");
const elementoProgreso = document.querySelector("#progreso");
const elementoResultado = document.querySelector("#resultado");
const elementoPuntaje = document.querySelector("#puntaje");
const botonResponder = document.querySelector("#btn-responder");
const botonSiguiente = document.querySelector("#btn-siguiente");

let preguntas = [];
let indiceActual = 0;
let opcionSeleccionada = null;
let puntaje = 0;

async function iniciarQuiz() {
  try {
    const respuesta = await fetch("preguntas.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar preguntas.json");
    }

    const todasLasPreguntas = await respuesta.json();

    if (!Array.isArray(todasLasPreguntas) || todasLasPreguntas.length === 0) {
      throw new Error("El archivo no contiene preguntas.");
    }

    preguntas = seleccionarPreguntas(todasLasPreguntas, 10);
    mostrarPregunta();
  } catch (error) {
    elementoPregunta.textContent = "No se pudieron cargar las preguntas.";
    console.error(error);
  }
}

function mostrarPregunta() {
  const preguntaActual = preguntas[indiceActual];

  elementoProgreso.textContent = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
  elementoPregunta.textContent = preguntaActual.pregunta;
  elementoResultado.textContent = "";
  elementoOpciones.replaceChildren();

  opcionSeleccionada = null;
  botonResponder.disabled = true;
  botonResponder.hidden = false;
  botonSiguiente.hidden = true;

  preguntaActual.opciones.forEach((texto, indice) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = texto;

    boton.addEventListener("click", () => {
      opcionSeleccionada = indice;

      document.querySelectorAll(".opcion").forEach((opcion) => {
        opcion.classList.remove("seleccionada");
      });

      boton.classList.add("seleccionada");
      botonResponder.disabled = false;
    });

    elementoOpciones.appendChild(boton);
  });

  elementoPuntaje.textContent = `respondidas bien: ${puntaje}`;
}

botonResponder.addEventListener("click", () => {
  if (opcionSeleccionada === null) return;

  const correcta = preguntas[indiceActual].correcta;
  const botonesOpciones = document.querySelectorAll(".opcion");

  botonesOpciones.forEach((boton, indice) => {
    boton.disabled = true;

    if (indice === correcta) {
      boton.classList.add("correcta");
    }
  });

  if (opcionSeleccionada === correcta) {
    puntaje++;
    elementoResultado.textContent = "¡Correcto!";
  } else {
    botonesOpciones[opcionSeleccionada].classList.add("incorrecta");
    elementoResultado.textContent = `Incorrecto. La respuesta correcta es: ${preguntas[indiceActual].opciones[correcta]}`;
  }

  elementoPuntaje.textContent = `respondidas bien: ${puntaje}`;
  botonResponder.disabled = true;
  botonResponder.hidden = true;
  botonSiguiente.hidden = false;

  if (indiceActual === preguntas.length - 1) {
    botonSiguiente.textContent = "Ver resultado";
  }
});

botonSiguiente.addEventListener("click", () => {
  indiceActual++;

  if (indiceActual < preguntas.length) {
    mostrarPregunta();
  } else {
    elementoProgreso.textContent = "Quiz terminado";
    elementoPregunta.textContent = `respuestas correctas ${puntaje} de ${preguntas.length}.`;
    elementoOpciones.replaceChildren();
    elementoResultado.textContent = "";
    elementoPuntaje.textContent = "";
    botonResponder.hidden = true;
    botonSiguiente.hidden = true;
  }
});

function seleccionarPreguntas(preguntas, cantidad = 10) {
  const barajadas = [...preguntas];

  // Barajado de Fisher–Yates
  for (let i = barajadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [barajadas[i], barajadas[j]] = [barajadas[j], barajadas[i]];
  }

  return barajadas.slice(0, cantidad);
}

// Al iniciar el cuestionario:
//const preguntasSeleccionadas = seleccionarPreguntas(preguntasJSON, 10);

iniciarQuiz();
