import asyncPool from "tiny-async-pool"

export const asyncPoolAll = async (...args: any) => {
    const results = [];
    for await (const result of asyncPool(...args)) {
        results.push(result);
    }
    return results;
};