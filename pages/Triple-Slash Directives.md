트리플-슬래시(Triple-slash) 지시어는 단일 XML 태그를 포함하는 한 줄 주석입니다.
주석의 내용은 컴파일러 지시어로 사용됩니다.

트리플-슬래시 지시어는 *오직* 포함된 파일의 상단에서만 유효합니다.
트리플-슬래시 지시어는 다른 트리플-슬래시 지시어를 포함한 한 줄 혹은 여러 줄의 주석 앞에만 위치할 수 있습니다.
만약 문 혹은 선언 뒤에 나오는 경우, 보통의 한 줄 주석으로 여겨지며 어떤 특별한 의미도 갖지 않습니다.

## `/// <reference path="..." />`

`/// <reference path="..." />` 지시어는 가장 일반적인 지시어입니다.
파일 간 *의존성* 선언으로 사용됩니다.

트리플-슬래시 참조는 컴파일 프로세스에 추가적인 파일을 포함하도록 컴파일러에게 지시합니다.

또한 `--out` 또는 `--outFile`을 사용할 때 출력물을 정렬하기 위한 방법으로도 사용됩니다.
파일은 전처리 통과 후 입력과 동일한 순서로 출력 파일 위치에 생성됩니다.

### 입력 파일 전처리 (Preprocessing input files)

컴파일러는 모든 트리플-슬래시 참조 지시어를 분석하기 위해 입력 파일에 대한 전처리를 수행합니다.
이 과정에서, 추가 파일이 컴파일에 추가됩니다.

이 과정은 *root files* 집합에서 시작합니다;
이것들은 커맨드-라인이나 `tsconfig.json` 파일의 `"files"`목록에 지정된 파일 이름입니다.
이 루트 파일들은 지정된 순서대로 전처리 됩니다.
파일이 목록에 추가되기 전, 파일에 있는 모든 트리플-슬래시 참조가 처리되고 그 대상들이 포함됩니다.
트리플-슬래시 참조는 파일에서 보이는 순서대로 깊이 우선으로 처리됩니다.

루트가 없는 경우 트리플-슬래시 참조 경로는 이를 포함하고 있는 파일을 기준으로 처리됩니다.

### 오류 (Errors)

존재하지 않는 파일을 참조하는 것은 오류입니다.
파일이 자기 자신에 대한 트리플-슬래시 참조를 갖는 것은 오류입니다.

### `--noResolve` 사용하기 (Using `--noResolve`)

컴파일러 플래그 `--noResolve`가 지정되면 트리플-슬래시 참조는 무시됩니다; 새 파일을 추가하거나 제공된 파일의 순서를 변경하지 않습니다.

## `/// <reference types="..." />`

*의존성*을 선언 역할을 하는 `/// <reference path="..." />` 지시어와 유사하게, `/// <reference types="..." />` 지시어는 패키지의 의존성을 선언합니다.

패키지 이름을 처리하는 과정은 `import` 문에서 모듈 이름을 처리하는 과정과 유사합니다.
트리플-슬래시-참조-타입 지시어를 선언 패키지의 `import`로 생각하면 이해하기 쉽습니다.

예를 들어, 선언 파일에 `/// <reference types="node" />`를 포함하는 것은 이 파일이 `@types/node/index.d.ts`에 선언된 이름을 사용한다고 선언하며;
따라서 이 패키지는 선언 파일과 함께 컴파일에 포함되어야 합니다.

이 지시어는 `d.ts` 파일을 직접 작성할 때만 사용하세요.

컴파일 중 생성된 선언 파일의 경우, 컴파일러는 자동으로 `/// <reference types="..." />`를 추가합니다;
오직 결과 파일이 참조된 패키지의 선언문을 사용하는 경우에만 생성된 선언 파일 안에 `/// <reference types="..." />` 가 추가됩니다.

`.ts` 파일에서 `@type`의 패키지의 의존성을 선언하려면, 커맨드 라인에 `--types` 을 사용하거나  `tsconfig.json`을 사용하세요.
[`tsconfig.json`에서 `@types`, `typeRoots` 과 `types` 사용하기](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)에서 세부 사항을 확인하세요.

## `/// <reference lib="..." />`

이 지시어는 파일이 명시적으로 기존 내장 _lib_ 파일을 포함하도록 합니다.

내장 _lib_ 파일은 _tsconfig.json_의` "lib"`컴파일러 옵션과 같은 방식으로 참조됩니다 (예 :`lib = "es2015.d"ts`가 아닌 `lib = "es2015"`사용 등).

DOM API 또는`Symbol` 또는 `Iterable`과 같은 내장 JS 런타임 생성자와 같은 내장 타입에 의존하는 선언 파일 작성자에게는 트리플 슬래시 참조 lib 지시어를 사용하는 것이 권장됩니다. 이전에는 이런 .d.ts 파일은 그런 타입의 전달/중복 선언을 추가했어야 했습니다.

예를 들어 컴파일에서 파일 중 하나에 `/// <reference lib="es2017.string" />`를 추가한 것 것은 `--lib es2017.string`으로 컴파일 하는 것과 같습니다.

```ts
/// <reference lib="es2017.string" />

"foo".padStart(4);
```

## `/// <reference no-default-lib="true"/>`

이 지시어는 파일을 *기본 라이브러리*라고 표시합니다.
이 주석은 `lib.d.ts`와 이를 변형한 것들의 맨 상단에서 볼 수 있습니다.

이 지시어는 컴파일러에게 기본 라이브러리(예.`lib.d.ts`)를 컴파일에 포함시키지 *않도록* 지시합니다.
이는 커맨드 라인에 `--nolib`을 넘겨주는 것과 비슷한 영향을 줍니다.

또한 `--skipDefaultLibCheck`를 넘겨주면, 컴파일러가 `/// <reference no-default-lib="true"/>` 을 갖는 파일만 검사하지 않는다는 것을 유의하세요.

## `/// <amd-module />`

기본적으로 AMD 모듈은 익명으로 생성됩니다.
이는 모듈로 만들어 내는 과정에 번들러(예. `r.js`)와 같은 다른 툴을 사용할 경우 문제를 발생시킬 수 있습니다.

`amd-module` 지시어는 컴파일러에게 선택적으로 모듈의 이름을 넘길 수 있도록 해줍니다:

##### amdModule.ts

```ts
///<amd-module name="NamedModule"/>
export class C {
}
```

이는 AMD `define` 호출의 일부로 `NamedModule` 이름을 모듈에 할당하는 결과를 낳을 것입니다:

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

> **Note**: 이 지시어는 deprecated 되었습니다. 대신 `import "moduleName";` 문을 사용하세요.

`/// <amd-dependency path="x" />`는 컴파일러에게 TS-가 아닌 모듈의 의존성이 결과 모듈의 require 호출에 추가되어야 한다고 알립니다.

`amd-dependeny` 지시어는 선택적으로 `name` 프로퍼티를 갖습니다; 이로 인해 amd-dependency에 선택적으로 이름을 전달할 수 있습니다:

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
