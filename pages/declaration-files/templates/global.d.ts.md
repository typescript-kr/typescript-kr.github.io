```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 라이브러리가 호출 가능하다면 (예. myLib(3)처럼 호출 가능하다면)
 *~ 여기에 호출 시그니처를 포함하세요.
 *~ 그렇지 않으면, 이 섹션은 삭제하세요.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;

/*~ 라이브러리의 이름이 유효한 타입 이름으로 사용하고 싶으면,
 *~ 여기서 할 수 있습니다.
 *~
 *~ 예를 들어, 'var x: myLib'; 처럼 사용할 수 있습니다.
 *~ 하지만 이게 실제로 의미 있는지 확인하세요! 그렇지 않다면,
 *~ 해당 선언을 삭제하고 아래 네임스페이스 안에 타입을 추가하세요.
 */
interface myLib {
    name: string;
    length: number;
    extras?: string[];
}

/*~ 전역 변수에 export된 프로퍼티를 라이브러리가 갖고 있다면,
 *~ 이곳에 위치시키세요.
 *~ 여기에도 타입 (인터페이스와 타입 별칭)을 위치시켜야 합니다.
 */
declare namespace myLib {
    //~ 'myLib.timeout = 50;' 라고 사용할 수 있습니다.
    let timeout: number;

    //~ 'myLib.version'에 접근할 수 있지만, 수정할 순 없습니다.
    const version: string;

    //~ 'let c = new myLib.Cat(42)' 또는 참조 (예. 'function f(c: myLib.Cat) { ... }) 를 통해
    //~ 클래스를 만들 수 있습니다
    class Cat {
        constructor(n: number);

        //~ 'Cat' 인스턴스에서 'c.age'를 읽을 수 있습니다
        readonly age: number;

        //~ 'Cat' 인스턴스에서 'c.purr()'를 호출할 수 있습니다.
        purr(): void;
    }

    //~ 다음과 같이 변수를 선언할 수 있습니다.
    //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
    interface CatSettings {
        weight: number;
        name: string;
        tailLength?: number;
    }

    //~ 'const v: myLib.VetID = 42;'라고 작성할 수 있습니다.
    //~  또는 'const v: myLib.VetID = "bob";'
    type VetID = string | number;

    //~ 'myLib.checkCat(c)' 나 'myLib.checkCat(c, v);'을 호출할 수 있습니다.
    function checkCat(c: Cat, s?: VetID);
}
```
