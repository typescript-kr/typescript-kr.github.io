트리플-슬래시 지시자는 단일 XML 태그가 포함된 한 줄 주석입니다.  
주석의 내용은 컴파일러 지시자로 사용됩니다.

트리플-슬래시 지시자는 포함된 파일의 **상단에서만** 유효합니다.   
트리플-슬래시 지시자는 다른 트리플-슬래시 지시자를 포함하여 한 줄 또는 여러 줄 주석 앞에 붙을 수 있습니다.  
문 또는 선언 뒤에 나오는 경우 보통의 한 줄 주석으로 간주하며 특별한 의미는 없습니다.

## `/// <reference path="..." />`

이 중 가장 일반적인 것은 `/// <reference path="..." />` 지시자입니다.  
파일 간에 *의존성* 선언의 역할을 합니다.

트리플-슬래시 참조는 컴파일 프로세스에서 추가적인 파일을 포함하도록 컴파일러에 지시합니다.

파일은 전처리 통과 후 입력과 같은 순서의 출력 파일 위치로 방출됩니다.

### 전처리 입력 파일 (Preprocessing input files)

컴파일러는 모든 트리플-슬래시 참조 지시자를 해석하기 위해 입력 파일에 대한 전처리 단계를 수행합니다.  
이러한 프로세스 중 컴파일에 추가 파일이 추가됩니다.

프로세스는 *root files* 집합으로 시작합니다.  
이것은 커맨드 라인이나 `tsconfig.json` 파일의 `"files"` 리스트에 지정된 파일 이름입니다.  
이러한 루트 파일은 지정된 순서대로 전처리됩니다.  
파일이 목록에 추가되기 전에 파일에 있는 모든 트리플-슬래시 참조가 처리되고 대상이 포함됩니다.  
트리플-슬래시 참조는 파일에서 본 순서대로 우선으로 깊숙하게 분석됩니다.

루트가 없는 경우 트리플-슬래시는 포함된 파일에 대한 기준으로 경로를 해석합니다.

### 오류

존재하지 않는 파일을 참조하는 것은 오류입니다.  
파일에 자체에 대한 트리플-슬래시 참조가 있는 것은 오류입니다.
### `--noResolve` 사용

컴파일러 옵션 `--noResolve`가 지정되면 트리플-슬래시 참조는 무시됩니다.  
새 파일을 추가하거나 제공된 파일의 순서를 변경하지도 않습니다.

## `/// <reference types="..." />`

`/// <reference path="..." />` 지시자와 마찬가지로 이 지시자도 *의존성* 선언의 역할을 합니다.  
하지만 `/// <reference types="..." />`지시자는 패키지에 대한 의존성을 선언합니다.

이런 패키지 이름을 해석하는 프로세스는 `import`문에서 모듈 이름을 해석하는 프로세스와 유사합니다.  
트리플-슬래시 참조 타입 지시자를 생각하는 쉬운 방법은 선언 패키지의 `import` 입니다.

예를 들어 선언 파일에 `/// <reference types="node" />`를 포함하면 이 파일은 `@types/node/index.d.ts`에 선언된 이름을 사용합니다.  
따라서 선언 파일과 함께 이 패키지를 컴파일에 포함해야 합니다.

이 지시자는 `d.ts` 파일을 직접 작성할 때만 사용하도록 하세요.

컴파일 시 생성된 선언 파일에 대해서는 컴파일러가 `/// <reference types="..." />`을 자동으로 추가합니다.  
생성된 선언 파일에서 `/// <reference types="..." />`은 결과 파일이 참조 패키지의 선언을 사용하는 *경우에만* 추가됩니다.

`.ts` 파일에 대한 `@types` 패키지에 의존성을 선언하려면 커맨드 라인이나 `tsconfig.json`에서 `--types`를 사용하세요.

더 자세한 내용은 [`tsconfig.json` 파일에서 `@types`, `typeRoots`와 `types` 사용하기](./tsconfig.json.md#types-typeroots-and-types)를 보세요.

## `/// <reference no-default-lib="true"/>`

이 지시자는 파일을 *기본 라이브러리*로 표시합니다.  
이 주석은 `lib.d.ts`와 다른 변이들의 맨 위에서 볼 수 있습니다.

이 지시자는 컴파일러에 기본 라이브러리 (예: `lib.d.ts`)를 포함하지 *않도록* 지시합니다.  
여기에 미치는 영향은 커맨드 라인에 `--noLib`를 전달하는 것과 비슷합니다.

또한 `--skipDefaultLibCheck`를 넘길 때 컴파일러는 `/// <reference no-default-lib="true"/>`를 가진 파일 검사만 건너뜁니다.

## `/// <amd-module />`

기본적으로 AMD모듈은 익명으로 생성됩니다.  
이로 인해 번들(예: `r.js`)과 같은 결과적인 모듈을 처리하는 데 다른 도구를 사용할 경우 문제가 발생할 수 있습니다.

`amd-module` 지시자는 선택적 모듈 이름을 컴파일러에 전달하는 것을 허용합니다:

##### amdModule.ts

```ts
///<amd-module name="NamedModule"/>
export class C {
}
```

AMD `define`을 호출할 때 `NamedModule`이라는 이름을 모듈에 할당할 것입니다:

##### amdModule.js

```js
define("NamedModule", ["require", "exports"], function (require, exports) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    exports.C = C;
});
```

## `/// <amd-dependency />`

> **주의사항**: 이 지시자는 더 이상 사용되지 않습니다(deprecated). 대신 `import "moduleName";`문을 사용하세요.

`/// <amd-dependency path="x" />` 결과 모듈의 require 호출에 주입해야하는 non-TS 모듈 의존성에 대해 컴파일러에 알려줍니다.

`amd-dependency` 지시자는 선택적 `name` 프로퍼티을 가질 수도 있습니다.  
이것은 amd-dependency에 선택적 이름을 전달할 수 있습니다:

```ts
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA:MyType
moduleA.callStuff()
```

생성된 JS 코드:

```js
define(["require", "exports", "legacy/moduleA"], function (require, exports, moduleA) {
    moduleA.callStuff()
});
```
