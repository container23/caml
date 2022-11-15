import { checkValueOnAML } from './verifier.js';

describe('Simple Full Text Search on AML List', () => {
    const tests = [
        {
            input: "catrunningFast",
            matched: false
        },
        {
            input: "Sufian al-Salamabi",
            matched: true,
        },
        {
            input: "Sufian al",
            matched: true,
        },
        {
            input: "bogdan",
            matched: true
        },
        {
            input: "Bogdanovicha",
            matched: true
        },
        {
            input: "KOLOSOV",
            matched: true
        },
        {
            input: "XBT 3Q5dGfLKkWqWSwYtbMUyc8xGjN5LrRviK4",
            matched: true
        },
        {
            input: "Aircraft Tail Number YV2913",
            matched: true
        },
        {
            input: "Passport T00043812",
            matched: true
        }
    ];

    for (let t of tests) {
        test(`Matched ${t.matched} with input: ${t.input}` ,() => {
            expect(checkValueOnAML(t.input).foundMatch).toBe(!!t.matched);
        })
    }
})