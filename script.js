const MAP_WIDTH = 31;
const MAP_HEIGHT = 21;
const TILE_SIZE = 16;

let firstGenerationWasGenerated = false;
let currentGeneration = null;

function generateButtonOnClick() {
    if (currentGeneration === null) {
        document.getElementById("generate_button").innerHTML = "Generate Next Generation";

        var generateNext5GenerationsButton = document.createElement("button");
        generateNext5GenerationsButton.id = "generate_next_5_generations";
        generateNext5GenerationsButton.innerHTML = "Generate 5 Next Generations";
        generateNext5GenerationsButton.onclick = function () {
            for (let i = 0; i < 5; i++) {
                currentGeneration = MapEvolutionist.generateNextGeneration(currentGeneration);
            }
            clearCanvasContainer();
            currentGeneration.forEach(entity => {
                let canvas = createCanvas();
                entity.setCanvas(canvas);
                entity.draw();
            });
        };
        document.getElementById("generate_buttons").appendChild(generateNext5GenerationsButton);

        var generateNext20GenerationsButton = document.createElement("button");
        generateNext20GenerationsButton.id = "generate_next_20_generations";
        generateNext20GenerationsButton.innerHTML = "Generate 20 Next Generations";
        generateNext20GenerationsButton.onclick = function () {
            for (let i = 0; i < 20; i++) {
                currentGeneration = MapEvolutionist.generateNextGeneration(currentGeneration);
            }
            clearCanvasContainer();
            currentGeneration.forEach(entity => {
                let canvas = createCanvas();
                entity.setCanvas(canvas);
                entity.draw();
            });
        };
        document.getElementById("generate_buttons").appendChild(generateNext20GenerationsButton);

        var generateNext100GenerationsButton = document.createElement("button");
        generateNext100GenerationsButton.id = "generate_next_100_generations";
        generateNext100GenerationsButton.innerHTML = "Generate 100 Next Generations";
        generateNext100GenerationsButton.onclick = function () {
            for (let i = 0; i < 100; i++) {
                currentGeneration = MapEvolutionist.generateNextGeneration(currentGeneration);
            }
            clearCanvasContainer();
            currentGeneration.forEach(entity => {
                let canvas = createCanvas();
                entity.setCanvas(canvas);
                entity.draw();
            });
        };
        document.getElementById("generate_buttons").appendChild(generateNext100GenerationsButton);

        currentGeneration = MapEvolutionist.generateFirstGeneration(10);
        currentGeneration.forEach(entity => {
            let canvas = createCanvas();
            entity.setCanvas(canvas);
            entity.draw();
        });
    }
    else {
        currentGeneration = MapEvolutionist.generateNextGeneration(currentGeneration);
        clearCanvasContainer();
        currentGeneration.forEach(entity => {
            let canvas = createCanvas();
            entity.setCanvas(canvas);
            entity.draw();
        });
    }
}
document.getElementById("generate_button").onclick = generateButtonOnClick;

MapEvaluator.showPriorities();