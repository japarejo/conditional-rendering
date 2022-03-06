import { AttributeValue } from "lib/components/feature/FeatureRetriever";
import NAryFunction from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";

export enum BinaryRelationalOperator {
    LESS, LESSEQ, GREATER, GREATEREQ, EQUAL, NOTEQ
}

class BinaryRelationalPredicate implements NAryFunction<boolean> {

    left: NAryFunction<AttributeValue>;
    right: NAryFunction<AttributeValue>;
    op: BinaryRelationalOperator;

    constructor(left: NAryFunction<AttributeValue>, right: NAryFunction<AttributeValue>, operator: BinaryRelationalOperator) {
        this.left = left;
        this.right = right;
        this.op = operator;
    }

    async eval(): Promise<ResultValue<boolean>> {
        const lEval = await this.left.eval();
        const rEval = await this.right.eval();
        if (lEval.isError || rEval.isError) {
            return error("Error evaluating Relational Binary Expression: " + lEval.errorMessage + " " + rEval.errorMessage);
        }

        const lVal = lEval.value;
        const rVal = rEval.value;

        // Check if both are the same type
        if (typeof lVal !== typeof rVal) {
            return error("Error evaluating Relational Binary Expression: Left and Right operands are not of the same type. Left type is " + typeof lVal + " and Right type is " + typeof rVal);
        }

        // Check that if any are strings, operator can only be EQUAL or NOTEQ
        if (typeof lVal === "string" && (this.op !== BinaryRelationalOperator.EQUAL && this.op !== BinaryRelationalOperator.NOTEQ)) {
            return error("Error evaluating Relational Binary Expression: Left and Right operands are strings. Operator " + this.op + " is not supported");
        }

        let val;
        switch (this.op) {
            case BinaryRelationalOperator.LESS:
                val = lVal < rVal;
                break;
            case BinaryRelationalOperator.LESSEQ:
                val = lVal <= rVal;
                break;
            case BinaryRelationalOperator.GREATER:
                val = lVal > rVal;
                break;
            case BinaryRelationalOperator.GREATEREQ:
                val = lVal >= rVal;
                break;
            case BinaryRelationalOperator.EQUAL:
                val = lVal === rVal;
                break;
            case BinaryRelationalOperator.NOTEQ:
                val = lVal !== rVal;
                break;
        }
        if (val === undefined) {
            return error("Error evaluating Relational Binary Expression: Invalid binary relational operator " + this.op);
        }
        return value(val);
    }
}

export function lt(left: NAryFunction<number>, right: NAryFunction<number>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.LESS);
}

export function lte(left: NAryFunction<number>, right: NAryFunction<number>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.LESSEQ);
}

export function gt(left: NAryFunction<number>, right: NAryFunction<number>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.GREATER);
}

export function gte(left: NAryFunction<number>, right: NAryFunction<number>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.GREATEREQ);
}

export function eq(left: NAryFunction<AttributeValue>, right: NAryFunction<AttributeValue>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.EQUAL);
}

export function neq(left: NAryFunction<AttributeValue>, right: NAryFunction<AttributeValue>): BinaryRelationalPredicate {
    return new BinaryRelationalPredicate(left, right, BinaryRelationalOperator.NOTEQ);
}