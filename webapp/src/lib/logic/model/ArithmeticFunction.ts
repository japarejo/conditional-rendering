import { NAryFunction, NAryFunctionOptions } from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";

export enum ArithmeticOperator {
    PLUS, MINUS, MUL, DIV, MOD, POW
}

class ArithmeticFunction implements NAryFunction<number> {

    left: NAryFunction<number>;
    right: NAryFunction<number>;
    op: ArithmeticOperator;

    constructor(left: NAryFunction<number>, right: NAryFunction<number>, operator: ArithmeticOperator) {
        this.left = left;
        this.right = right;
        this.op = operator;
    }

    async eval(options?: NAryFunctionOptions): Promise<ResultValue<number>> {
        const lEval = await this.left.eval(options);
        const rEval = await this.right.eval(options);
        if (lEval.isError || rEval.isError) {
            return error("Error evaluating Arithmetic Expression: " + lEval.errorMessage + " " + rEval.errorMessage);
        }

        const lVal = lEval.value;
        const rVal = rEval.value;

        let val;
        switch (this.op) {
            case ArithmeticOperator.PLUS:
                val = lVal + rVal;
                break;
            case ArithmeticOperator.MINUS:
                val = lVal - rVal;
                break;
            case ArithmeticOperator.MUL:
                val = lVal * rVal;
                break;
            case ArithmeticOperator.DIV:
                val = lVal / rVal;
                break;
            case ArithmeticOperator.MOD:
                val = lVal % rVal;
                break;
            case ArithmeticOperator.POW:
                val = Math.pow(lVal, rVal);
                break;
        }

        if (val === undefined) {
            return error("Error evaluating Arithmetic Expression: Invalid arithmetic operator " + this.op);
        }
        return value(val);
    }
}

export function plus(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.PLUS);
}

export function minus(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.MINUS);
}

export function mul(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.MUL);
}

export function div(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.DIV);
}

export function mod(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.MOD);
}

export function pow(left: NAryFunction<number>, right: NAryFunction<number>): ArithmeticFunction {
    return new ArithmeticFunction(left, right, ArithmeticOperator.POW);
}

