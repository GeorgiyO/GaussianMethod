init();

let solutionDiv = document.getElementById("solution");

let gaussianMethod = new GaussianMethod();

function getResult() {
    try {
        let result = gaussianMethod.getResult(getTables());
        printResult(result);
    } catch (e) {
        console.log("Тут в теории должно быть какое - то действие при ошибке?");
        console.log(e);
    }
}

function printResult(result) {
    solutionDiv.innerHTML = "";
    switch(result.type) {
        case "ns":
            printNoSolutions();
            break;
        case "os":
            printOneSolution(result.value);
            break;
        case "ms":
            printManySolutions(result.value);
            break;
    }
}

function printNoSolutions() {
    addTextToDiv("Нет решений для заданной системы уравнений");
}

function printOneSolution(xArray) {
    xArray.forEach((x, i) => {
        addTextToDiv("X" + (i + 1) + " = " + x);
    });
}

function printManySolutions(xArray) {
    xArray.forEach((x, i) => {
        let str = "X" + (i + 1) + " = ";
        x.xArr.forEach((x, j) => {
            str += "X" + (i + j + 2) + " * " + x + " + ";
        });
        str += x.c;
        addTextToDiv(str);
    });
}

function addTextToDiv(str) {
    let p = document.createElement("p");
    p.innerText = str;
    solutionDiv.appendChild(p);
}

function init() {
    changeTablesSize(4);
    
    let coefTrs = document.querySelectorAll("#coefficientsTable input");
    let consTrs = document.querySelectorAll("#constantsTable input");
    let coefArr = [
        [-2,  0, -1, -1],
        [-2, -1,  4,  4],
        [ 3, -1, -3,  3],
        [ 4,  4, -1, -4]
    ];
    let consArr = [
         5,
        -33,
        -3,
         35
    ];

    coefTrs.forEach((input, i) => {
        input.value = coefArr[Number.parseInt(i / 4)][i % 4];
    });
    consTrs.forEach((input, i) => {
        input.value = consArr[i];
    });
}