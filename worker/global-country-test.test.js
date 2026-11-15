import test from "node:test";
import assert from "node:assert/strict";
import { GLOBAL_TEST_COUNTRIES } from "./global-country-test.js";

test("global comprehension corpus covers 100 distinct countries", () => {
  assert.equal(GLOBAL_TEST_COUNTRIES.length,100);
  assert.equal(new Set(GLOBAL_TEST_COUNTRIES.map(x=>x.code)).size,100);
  assert.equal(new Set(GLOBAL_TEST_COUNTRIES.map(x=>x.gdelt)).size,100);
});
test("each country has an ISO code, display name, and GDELT source-country query", () => {
  for(const country of GLOBAL_TEST_COUNTRIES) {
    assert.match(country.code,/^[A-Z]{2}$/);
    assert.ok(country.name.length>1);
    assert.match(country.gdelt,/^[a-z]+$/);
  }
});
