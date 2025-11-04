import { useSku } from "../dist";

test('unselectedName',()=>{
    const { unselectedName } = useSku(null);
    expect(unselectedName().length).toBe(0);
})