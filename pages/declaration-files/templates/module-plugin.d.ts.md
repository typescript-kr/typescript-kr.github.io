```ts
// Type definitions for [~라이브러리 이름~] [~선택적 버전 숫자~]
// Project: [~프로젝트 이름~]
// Definitions by: [~내 이름~] <[~내 URL~]>

/*~ 모듈 플러그인을 위한 모듈 템플릿 입니다.
 *~ 이름을 index.d.ts로 변경하고, 모듈과 같은 이름의 폴더 안에 배치해야 합니다.
 *~ 예를 들어, "super-greeter" 파일을 작성하는 경우
 *~ 이 파일은 'super-greeter/index.d.ts'가 되어야 합니다.
 */

/*~ 이 줄에서, 모듈에 추가한 모듈을 import 하세요 */
import * as m from 'someModule';

/*~ 필요한 경우, 다른 모듈을 import 할 수 있습니다 */
import * as other from 'anotherModule';

/*~ 여기는 위에서 import 한 모듈을 선언합니다 */
declare module 'someModule' {
    /*~ 내부에 새로운 함수, 클래스, 변수를 추가합니다.
     *~ 필요한 경우 원래 모듈에서 export 하지 않은 타입을 사용할 수 있습니다. */
    export function theNewMethod(x: m.foo): other.bar;

    /*~ 인터페이스 보강을 작성해서
     *~ 원래 모듈의 기존 인터페이스에 새로운 프로퍼티를 추가할 수 있습니다. */
    export interface SomeModuleOptions {
        someModuleSetting?: string;
    }

    /*~ 새로운 타입도 선언할 수 있으며,
     *~ 마치 원래 모듈에 있는 것처럼 보입니다 */
    export interface MyModulePluginOptions {
        size: number;
    }
}
```
