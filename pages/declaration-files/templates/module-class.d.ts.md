```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 클래스 모듈을 위한 모듈 템플릿 입니다.
 *~ 이름을 index.d.ts로 변경하고, 모듈 이름의 폴더에 배치해야 합니다.
 *~ 예를 들어, "super-greeter" 파일을 작성하는 경우
 *~ 이 파일은 'super-greeter/index.d.ts'가 되어야 합니다.
 */

// ES6 모듈은 직접 클래스 객체를 export할 수 없습니다.
// 이 파일은 CommonJS-style을 사용해서 import 해야 합니다.
//   import x = require('[~THE MODULE~]');
//
// 또한, --allowSyntheticDefaultImports 나
// --esModuleInterop 옵션을 활성화한다면,
// default import로 import할 수 있습니다:
//   import x from '[~THE MODULE~]';
//
// ES6 모듈의 제한에 대한 일반적인 해결 방법을 이해하려면
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// 에서 TypeScript 문서를 참고하세요.

/*~ 전역 변수 'myClassLib'을 노출하는 UMD 모듈을
 *~ 모듈 로더 환경 외부에서 로드하려면, 여기에서 전역으로 선언하세요.
 *~ 그렇지 않으면, 이 선언을 제거하세요.
 */
export as namespace myClassLib;

/*~ 이 선언은 클래스 생성자 함수를
 *~ 파일에서 export된 객체로 지정합니다.
 */
export = MyClass;

/*~ 이 클래스에서 모듈 메서드와 프로퍼티를 지정합니다. */
declare class MyClass {
    constructor(someParam?: string);

    someProperty: string[];

    myMethod(opts: MyClass.MyClassMethodOptions): number;
}

/*~ 모듈에서 타입을 노출하려면
 *~ 이 블록 안에 위치시키세요.
 *~
 *~ 네임스페이스를 포함할 경우,
 *~ --esModuleInterop 이 설정되어 있지 않으면,
 *~ 모듈을 네임 스페이스 객체로 잘못 import 할 수 있습니다:
 *~   import * as x from '[~THE MODULE~]'; // 오류! 이렇게 하지 마세요!
 */
declare namespace MyClass {
    export interface MyClassMethodOptions {
        width?: number;
        height?: number;
    }
}
```
