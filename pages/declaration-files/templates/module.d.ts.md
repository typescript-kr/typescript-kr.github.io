```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 이건 모듈 템플릿 파일입니다.
 *~ 이름을 index.d.ts로 변경하고, 모듈과 같은 이름의 폴더 안에 배치해야 합니다.
 *~ 예를 들어, "super-greeter" 파일을 작성하는 경우
 *~ 이 파일은 'super-greeter/index.d.ts'가 되어야 합니다.
 */

/*~ 전역 변수 'myClassLib'을 노출하는 UMD 모듈을
 *~ 모듈 로더 환경 외부에서 로드하려면, 여기에서 전역으로 선언하세요.
 *~ 그렇지 않으면, 이 선언을 제거하세요.
 */
export as namespace myLib;

/*~ 이 모듈이 메서드를 가지고 있다면, 다음과 같이 함수로써 선언하세요.
 */
export function myMethod(a: string): string;
export function myOtherMethod(a: number): number;

/*~ 모듈 import를 통해 사용 가능한 타입을 선언할 수 있습니다 */
export interface someType {
    name: string;
    length: number;
    extras?: string[];
}

/*~ const, let, var를 사용하여 모듈의 프로퍼티를 선언할 수 있습니다 */
export const myField: number;

/*~ 모듈의 점으로 구분된 이름 안에 타입, 프로퍼티, 메서드가 있는 경우
 *~ 'namespace' 안에 선언하세요.
 */
export namespace subProp {
    /*~ 예를 들어 이런 정의가 있을 때, 다음과 같이 작성할 수 있습니다:
     *~   import { subProp } from 'yourModule';
     *~   subProp.foo();
     *~ 또는
     *~   import * as yourMod from 'yourModule';
     *~   yourMod.subProp.foo();
     */
    export function foo(): void;
}
```
