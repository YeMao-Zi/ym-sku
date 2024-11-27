import { unselectedName } from "../dist";

test('unselectedName',()=>{
    expect(unselectedName().length).toBe(0);
})