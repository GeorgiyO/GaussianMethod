/*
 * this file works with tables, change tables size and return arrays of values
 */

"use strict";

 // html elements in view layer:

let rowsCountInput = document.getElementById("rowsCountInput");
let rowsCountSpan = document.getElementById("rowsCountSpan");

let coefTable = document.getElementById("coefficientsTable");
let consTable = document.getElementById("constantsTable");
let tablesSpan = document.getElementById("tablesSpan");


// when 'size'-input changes, we should change table size
rowsCountInput.oninput = () => {changeTablesSize(rowsCountInput.value)};

// update size:

function changeTablesSize(newCount) {

    // turn value into integer:
    newCount = Number.parseInt(newCount);

    // check if its integer and its positive: 
    if (!Number.isInteger(newCount) || newCount < 1) {
        showError(rowsCountSpan);
        return;
    } else {
        hideError(rowsCountSpan);
    }

    if (newCount > 15) {
        newCount = 15;
        rowsCountInput.value = 15;
    }

    let oldCount = consTable.rows.length;
    let diff = newCount - oldCount;

    diff > 0 ? addCells(oldCount, diff) : removeCells(-diff);
}

// return values:

function getTables() {
    let coefArr;
    let consArr;
    try {
        coefArr = getCoefArr();
        consArr = getConsArr();
    } catch (e) {
        showError(tablesSpan);
        throw e;
    }
    hideError(tablesSpan);
    let tables = {
        coefArr,
        consArr
    };
    return tables;
}

// helper functions (mostly uses in this file only):

function addCells(oldCount, diff) {
    for (let i = 0; i < diff; i++) {
        let tr = document.createElement("tr");
        addCellsToTr(tr, oldCount);
        coefTable.appendChild(tr)

        tr = document.createElement("tr");
        addCellsToTr(tr, 1);
        consTable.appendChild(tr);
    }

    [...coefTable.children].forEach((tr) => {
        addCellsToTr(tr, diff);
    });
}

function removeCells(diff) {

    for (let i = 0; i < diff; i++) {
        coefTable.removeChild(coefTable.lastElementChild);
        consTable.removeChild(consTable.lastElementChild);
    }
    [...coefTable.children].forEach((tr) => {
        removeCellsFromTr(tr, diff);
    })
}

function addCellsToTr(tr, count) {
    for (let i = 0; i < count; i++) {
        let cell = document.createElement("input");
        cell.setAttribute("type", "number");
        cell.setAttribute("value", "0");
        tr.appendChild(document.createElement("td")).appendChild(cell);
    }
}

function removeCellsFromTr(tr, count) {
    for (let i = 0; i < count; i++) {
        tr.removeChild(tr.lastElementChild);
    }
}

function getCoefArr() {
    let arr = [];
    [...coefTable.children].forEach((tr) => {
        let row = [];
        [...tr.children].forEach((cell) => {
            let v = cell.firstChild.value;
            v = Number.parseFloat(v);
            if (Number.isNaN(v)) throw new WrongTableValueError();
            row.push(v);
        });
        arr.push(row);
    });
    return arr;
}

function getConsArr() {
    let arr = [];
    [...consTable.children].forEach((tr) => {
        let v = tr.firstChild.firstChild.value;
        v = Number.parseFloat(v);
        if (Number.isNaN(v)) throw new WrongTableValueError();
        arr.push(v);
    });
    return arr;
}

function showError(span) {
    span.style.display = "inline-block";
}

function hideError(span) {
    span.style.display = "none";
}

class WrongTableValueError extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongTableValueError";
    }
}