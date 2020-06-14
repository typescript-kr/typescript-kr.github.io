```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 전역-수정 모듈 템플릿 파일입니다. 사용할 때는 파일 이름을 index.d.ts로 바꿔야 하고,
 *~ 모듈과 같은 이름의 폴더 안에 넣으세요.
 *~ 예를 들어, "super-greeter"라는 모듈을 만들고 있다면,
 *~ 파일의 위치는 'super-greeter/index.d.ts' 이어야 합니다.
 */

/*~ 주의: 전역 수정 모듈이 호출되거나 생성될 수 있다면,
 *~ 여기에서 패턴을 모듈-클래스 또는 모듈-함수의 패턴과 결합해야 합니다.
 *~ 템플릿 파일
 */
declare global {
    /*~ 여기에서, 전역 네임스페이스에 포함할 것을 선언하거나,
     *~ 전역 네임스페이스에 기존 선언을 보강하세요
     */
    interface String {
        fancyFormat(opts: StringFormatOptions): string;
    }
}

/*~ 모듈이 타입이나 값을 export한다면, 평소대로 사용하세요 */
export interface StringFormatOptions {
    fancinessLevel: number;
}

/*~ 예를 들어, 모듈에 메서드를 선언하는 경우 (전역 side effect 이외에) */
export function doSomething(): void;

/*~ 모듈이 아무것도 export하지 않으면, 이 라인이 필요합니다. 그렇지 않다면 지우세요 */
export { };
```
