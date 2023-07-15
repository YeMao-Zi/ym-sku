import { getUnchooseLabel } from "../dist";

test('getUnchooseLabel',()=>{
    expect(getUnchooseLabel().length).toBe(0);
})