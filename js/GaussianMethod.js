class GaussianMethod {
    coefArr; // coefficients Aij
    consArr; // constants  Bi
    result;  // dimanic - changed result, includes: type (ns - no solutions, os - one solution, ms - many solutions) and value of result

    /* getResult includes next steps:
     * 1) set tables, errors must be handled in outside of class
     * 2) straight move - return true/false, if true - go back();
     * 3) back move - return true/false
     * 4) set result value, it depends on result.type
     * 
     * returning value - object result with fields: type and value (if type != 'ns')
     * if type == 'os' value == array with x values
     * else if type = 'ms' value == array with objects that contains: c, array of x values
     * objects can be easely changed to equation: x(arrIndex) = object.c + object.xArr[0] * x(xArrIndex + 0) + object.xArr[1] * x(xArrIndex + 1)...
     * to number x's from 1 just set x index = arrIndex + 1 (+ object.array index + 1)
     */
    getResult(tables) {
        this.result = {}; // nullify type and value

        this.setTables(tables);

        if (this.straight()) {
            this.back();
            this.setResultValue();
        }
        return this.result;
    }

    setTables(tables) {
        this.coefArr = tables.coefArr;
        this.consArr = tables.consArr;
        this.log();
    }

    /* straight must change coefArr to triangle form, like this:
     * coef  | cons
     * v v v | с
     * 0 v v | с
     * 0 0 v | с
     * where v, c = some value (can be unique for every cell)
     * changing doing by steps, using helper functions that contains check for every step
     * 
     * if some coef row have only '0' and cons != 0 step return 'true' and function
     * set result = 'haven't solutions' and return true, that means getResult function must return result
     * 
     * if some coef row have only '0' and cons = 0 that means we can 'delete' this row and there will be many solutions
     * in this case last coef row will have 'v' counts > 1
     * 
     * this.substractLine returning value has boolean type:
     * if true - functions remove(delete) one line, becouse it's all zeros
     * if false - function dont delete one line, but there may be no solutions then function mate this.result.type = 'ns'
     */
    straight() {
        console.log("straight");
        for (let i = 0; i < this.coefArr.length; i++) {
            for (let j = i + 1; j < this.coefArr.length; j++) {
                if (this.substractLine(i, j)) {
                    j--;
                } else if (this.result.type == "ns") return false;
            }
        }
        this.removeZeroColumns();
        this.log();
        return true;
    }

    /* back functions must change coefArr to form like this:
     * coef  | cons
     * v 0 0 | c
     * 0 v 0 | c
     * 0 0 v | c
     * 
     * or something like this:
     * v v 0 0 | c
     * 0 v v 0 | c
     * 0 0 v v | c
     * if we have multiple solutions (use diffirent functions, dependencing on last-row type)
     * 
     * only one thing must be taken to attention is top-right triangle, it must look like:
     * v 0 0
     * ? v 0
     * ? ? v
     * where ? = 0 or v
     * 
     * then every x can be found easily
     */
    back() {
        console.log("back");
        let leftmostIndex = this.coefArr[0].length - this.coefArr.length;
        for (let i = this.coefArr.length - 1; i >= 1; i--) {
            for (let j = i - 1; j >= 0; j--) {
                this.backSubstractLine(i, j, leftmostIndex);
            }
        }
        this.log();
    }

    setResultValue() {
        if (this.isManySolutions()) {
            this.result.type = "ms";
            this.setManySolutions();
        } else {
            this.result.type = "os";
            this.setOneSolution();
        }
    }

    // helper functions

    // straight

    /* args: i1 - index of first line, i2 - index of second line;
     * position of x, that should be turned to '0' == i1
     * make secondLine[i2] = secondLine[i2] - firstLine[i1] * M
     * where M = secondLine x / firstLine x
     * if delete line return true
     */
    substractLine(i1, i2) {
        console.log(i1 + " " + i2);

        let firstLine = this.coefArr[i1];
        let secondLine = this.coefArr[i2];

        let M = secondLine[i1] / firstLine[i1];

        for (let i = i1; i < firstLine.length; i++) {
            secondLine[i] -= firstLine[i] * M;
        }
        this.consArr[i2] -= this.consArr[i1] * M;

        if (this.isZeroLine(i2)) {
            if (this.isNoSolutions(i2)) {
                this.result.type = "ns";
                return false;
            } else {
                this.removeLine(i2);
                return true;
            }
        }
        return false;
    }

    isZeroLine(index) {
        for (let i = 0 ; i < this.coefArr.length; i++) {
            if (this.coefArr[index][i] != 0) return false;
        }
        return true;
    }

    isNoSolutions(index) {
        return this.consArr[index] != 0; 
    }

    removeLine(index) {
        for (let i = index + 1; i < this.consArr.length; i++) {
            this.coefArr[i - 1] = this.coefArr[i];
            this.consArr[i - 1] = this.consArr[i];
        }
        this.coefArr.pop();
        this.consArr.pop();
    }

    // delete zero columns afther straight move
    removeZeroColumns() {
        for (let i = 0; i < this.coefArr.length; i++) {
            if (this.isZeroColumn(i)) this.removeColumn(i);
        }
    }

    isZeroColumn(index) {
        for (let i = 0; i < this.coefArr.length; i++) {
            if (this.coefArr[index] != 0) return false;
        }
        return true;
    }

    removeColumn(index) {
        for (let i = 0; i < this.coefArr.length; i++) {
            for (let j = index + 1; j < this.coefArr[0].length; j++) {
                this.coefArr[i][j - 1] = this.coefArr[i][j];
            }
            this.coefArr[i].pop();
        }
    }

    // back

    /* function looks like substractLines(), but there some difference:
     * this function multiplier 'M' depends not on mostleft X, it depends on mostright X
     * there no check for 'zero-lines'
     * arg leftmostIndex need if we have multiply solutions, it added to i1 so we can find mostrightX
     */
    backSubstractLine(i1, i2, leftmostIndex) {
        let firstLine = this.coefArr[i1];
        let secondLine = this.coefArr[i2];

        let M = secondLine[i1 + leftmostIndex] / firstLine[i1 + leftmostIndex];

        //this.log();
        console.log((i1 + 1) + " " + (i2 + 1));

        for (let i = i1; i < firstLine.length; i++) {
            secondLine[i] -= firstLine[i] * M;
        }
        this.consArr[i2] -= this.consArr[i1] * M;
    }

    // setResultValue

    // if penultimate cell of last row != 0 then we have multiple solutions
    isManySolutions() {
        return this.coefArr[this.coefArr.length - 1][this.coefArr[0].length - 2] != 0
    }

    // x[arrIndex] = c / v
    setOneSolution() {
        let solutions = [];
        for (let i = 0; i < this.coefArr.length; i++) {
            let xValue = this.consArr[i] / this.coefArr[i][i];
            solutions.push(xValue);
        }
        this.result.value = solutions;
    }

    // x[arrIndex] = c + x[arrIndex + 1] + x[arrIndex + 2]... / v
    setManySolutions() {
        let solutions = [];
        for (let i = 0; i < this.coefArr.length; i++) {
            let solution = {
                c: this.consArr[i] / this.coefArr[i][i], // constant
                xArr: []                              // dependency of other x's
            }
            for (let j = i + 1; j < this.coefArr[0].length; j++) {
                if (this.coefArr[i][j] == 0) {
                    break;
                } else {
                    let xValue = this.coefArr[i][j] / this.coefArr[i][i];
                    solution.xArr.push(xValue);
                }
            }
            solutions.push(solution);
        }
        this.result.value = solutions;
        console.log(solutions);
    }

    log() {
        this.logDA(this.coefArr);
        let str = "";
        this.consArr.forEach((v) => {
            str += " " + v;
        });
        console.log(str);
    }

    logDA(doubleArray) {
        let str = "";
        doubleArray.forEach((row) => {
            row.forEach((v) => {
                str += v + "\t";
            });
            str += "\n";
        });
        console.log(str);
    }
}