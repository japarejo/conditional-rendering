import { ResultValue } from "./ResultValue";

export default interface NAryFunction<T> {
    eval: () => Promise<ResultValue<T>>;
}