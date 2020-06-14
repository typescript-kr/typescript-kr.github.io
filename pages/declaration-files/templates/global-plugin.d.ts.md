```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 전역 플러그인을 작성하는 방법을 보여주는 템플릿입니다. */

/*~ 기존의 타입 선언을 작성하고, 새로운 멤버를 추가하세요.
 *~ 예를 들어, 아래는 내장 숫자 타입에 'toBinaryString' 메서드를 추가하여
 *~ 오버라이드 합니다.
 */
interface Number {
    toBinaryString(opts?: MyLibrary.BinaryFormatOptions): string;
    toBinaryString(callback: MyLibrary.BinaryFormatCallback, opts?: MyLibrary.BinaryFormatOptions): string;
}

/*~ 여러 타입을 선언해야 한다면, 전역 네임스페이스에 많은 것을 추가하는 상황을 피하기 위해
 *~ 네임스페이스 안에 위치시키세요.
 */
declare namespace MyLibrary {
    type BinaryFormatCallback = (n: number) => string;
    interface BinaryFormatOptions {
        prefix?: string;
        padding: number;
    }
}
```