* [추론과 `Promise.all` 개선](#improvements-in-inference-and-promiseall)
* [속도 향상](#speed-improvements)
* [`// @ts-expect-error` 주석](#-ts-expect-error-comments)
* [조건문에서 호출되지 않은 함수 체크](#uncalled-function-checks-in-conditional-expressions)
* [에디터 개선](#editor-improvements)
    * [JavaScript에서 CommonJS 자동-Imports](#commonjs-auto-imports-in-javascript)
    * [코드 작업 개행 유지](#code-actions-preserve-newlines)
    * [누락된 반환문 빠른 수정](#quick-fixes-for-missing-return-expressions)
    * [`tsconfig.json` 파일 "솔루션 스타일" 지원](#support-for-solution-style-tsconfigjson-files)
* [주요 변경 사항](#주요-변경-사항-breaking-changes)

## <span id="improvements-in-inference-and-promiseall" /> 추론과 `Promise.all` 개선 (Improvements in Inference and `Promise.all`)

최신 버전의 TypeScript(약 3.7)는 `Promise.all` 및 `Promise.race`와 같은 함수 선언이 업데이트되었습니다.
운이 안 좋게도, 특히 `null` 또는 `undefined`와 값을 혼합할 때, 약간의 회귀가 발생했습니다.

```ts
interface Lion {
    roar(): void
}

interface Seal {
    singKissFromARose(): void
}

async function visitZoo(lionExhibit: Promise<Lion>, sealExhibit: Promise<Seal | undefined>) {
    let [lion, seal] = await Promise.all([lionExhibit, sealExhibit]);
    lion.roar(); // 오 이런
//  ~~~~
// 객체는 아마도 'undefined' 일 것입니다.
}
```

이건 이상한 행동입니다!
`sealExhibit`가 `undefined`를 포함하는 것은 어떻게든 `lion` 타입에 `undefined`를 주입합니다.

[Jack Bates](https://github.com/jablko)의 [pull request](https://github.com/microsoft/TypeScript/pull/34501) 덕분에, TypeScript 3.9의 추론 프로세스가 개선되었습니다.
위 오류는 더 이상 발생하지 않습니다.
`Promise`와 관련된 문제로 인해 이전 버전의 TypeScript에서 고생했다면, 3.9를 사용하는 것이 좋습니다.

### `awaited` 타입은 무엇입니까? (What About the `awaited` Type?)

이슈 트래커와 설계 회의 노트를 봐왔다면, [`awaited` 라는 새로운 연산자](https://github.com/microsoft/TypeScript/pull/35998)에 대한 일부 작업을 알고 있을 것입니다.
이 타입 연산자의 목표는 JavaScript에서 `Promise`를 푸는 방식을 정확하게 모델링 하는 것입니다.

처음에는 TypeScript 3.9에서 `awaited`을 제공할 것으로 예상했지만, 기존 코드 베이스와 함께 초기 TypeScript 빌드를 실행함으로써 모든 사용자에게 원활하게 배포하기 전에 이 기능에 더 많은 설계 작업이 필요하다는 사실을 알았습니다.
결과적으로, 더 확실해질 때까지 메인 브랜치에서 이 기능을 빼기로 결정했습니다.
이 기능에 대해 더 많은 실험을 할 예정이지만, 이번 릴리스에서는 제공하지 않습니다.

## <span id="speed-improvements" /> 속도 향상 (Speed Improvements)

TypeScript 3.9는 많은 새로운 속도 향상 기능이 포함되어 있습니다.
우리 팀은 material-ui 및 styled-components와 같은 패키지를 사용할 때 편집 / 컴파일 속도가 매우 열악한 것을 확인한 후 성능에 중점을 두었습니다.
거대한 유니언, 인터섹션, 조건별 타입 그리고 매핑된 타입과 관련된 특정 병리학적 사례를 최적화하는 다양한 pull request로 심층 분석했습니다.

* https://github.com/microsoft/TypeScript/pull/36576
* https://github.com/microsoft/TypeScript/pull/36590
* https://github.com/microsoft/TypeScript/pull/36607
* https://github.com/microsoft/TypeScript/pull/36622
* https://github.com/microsoft/TypeScript/pull/36754
* https://github.com/microsoft/TypeScript/pull/36696

이러한 각 pull request는 특정 코드 베이스에서 컴파일 시간이 약 5-10% 단축됩니다.
전체적으로 material-ui의 컴파일 시간이 약 40% 단축되었습니다!

또한 에디터 시나리오에서 파일 이름 변경 기능이 일부 변경되었습니다.
우리는 Visual Studio Code 팀으로부터 파일 이름을 바꿀 때 어떤 import 문을 업데이트해야 하는지 파악하는데 5초에서 10초가 소요될 수 있다고 들었습니다.
TypeScript 3.9는 [컴파일러 및 언어 서비스가 파일 조회를 캐싱 하는 방식의 내부 변경](https://github.com/microsoft/TypeScript/pull/37055)을 통해 이 문제를 해결합니다.

여전히 개선의 여지가 있지만, 이 작업이 모든 사람들에게 보다 빠른 경험으로 이어지기를 바랍니다!

## <span id="-ts-expect-error-comments" /> `// @ts-expect-error` 주석 (`// @ts-expect-error` Comments)

TypeScript로 라이브러리를 작성하고 퍼블릭 API의 일부분으로 `doStuff`라는 함수를 export 한다고 상상해보세요.
TypeScript 사용자가 타입-체크 오류를 받을 수 있도록 `doStuff` 함수의 타입은 두 개의 `string`을 갖는다고 선언하지만, 또한 JavaScript 사용자에게 유용한 오류를 제공하기 위해 런타임 오류 체크를 합니다 (개발 빌드 시에만 가능).

```ts
function doStuff(abc: string, xyz: string) {
    assert(typeof abc === "string");
    assert(typeof xyz === "string");

    // 어떤 작업을 하세요
}
```

그래서 TypeScript 사용자는 함수를 잘못 사용할 경우 유용한 빨간 오류 밑줄과 오류 메시지를 받게 되며, JavaScript 사용자는 단언 오류를 얻게 됩니다.
이러한 작동을 테스트하기 위해서, 유닛 테스트를 작성하겠습니다.

```ts
expect(() => {
    doStuff(123, 456);
}).toThrow();
```

불행히도 위의 테스트가 TypeScript에서 작성된다면, TypeScript는 오류를 발생시킬 것입니다!

```ts
    doStuff(123, 456);
//          ~~~
// 오류: 'number' 타입은 'string' 타입에 할당할 수 없습니다.
```

그래서 TypeScript 3.9는 새로운 기능을 도입했습니다: `// @ts-expect-error` 주석.
라인 앞에 `// @ts-expect-error` 주석이 붙어 있을 경우, TypeScript는 해당 오류를 보고하는 것을 멈춥니다;
그러나 오류가 존재하지 않으면, TypeScript는 `// @ts-expect-error`가 필요하지 않다고 보고할 것입니다.

간단한 예로, 다음 코드는 괜찮습니다

```ts
// @ts-expect-error
console.log(47 * "octopus");
```

그러나 다음 코드는

```ts
// @ts-expect-error
console.log(1 + 1);
```

오류로 이어질 것입니다

```
Unused '@ts-expect-error' directive.
```

이 기능을 구현한 컨트리뷰터, [Josh Goldberg](https://github.com/JoshuaKGoldberg)에게 큰 감사를 드립니다.
자세한 내용은 [the `ts-expect-error` pull request](https://github.com/microsoft/TypeScript/pull/36014)를 참고하세요.

### `ts-ignore` 또는 `ts-expect-error`? (`ts-ignore` or `ts-expect-error`?)

어떤 점에서는 `// @ts-expect-error`가 `// @ts-ignore`과 유사하게 억제 주석(suppression comment)으로 작용할 수 있습니다.
차이점은 `// @ts-ignore`는 다음 행에 오류가 없을 경우 아무것도 하지 않는다는 것입니다.

기존 `// @ts-ignore` 주석을 `// @ts-expect-error`로 바꾸고 싶은 마음이 들 수 있으며, 향후 코드에 무엇이 적합한지 궁금할 수 있습니다.
전적으로 당신과 당신 팀의 선택이지만, 우리는 어떤 상황에서 어떤 것을 선택할 것인지에 대한 몇 가지 아이디어를 가지고 있습니다.

다음 경우라면 `ts-expect-error`를 선택하세요:

* 타입 시스템이 작동에 대한 오류를 발생시키는 테스트 코드 작성을 원하는 경우
* 수정이 빨리 이루어지길 원하며 빠른 해결책이 필요한 경우
* 오류가 발생한 코드가 다시 유효해지면 바로 억제 주석을 삭제하길 원하는 혁신적인 팀이 이끄는 적당한-크기의 프로젝트에서 작업하는 경우

다음 경우라면 `ts-ignore`를 선택하세요:

* 더 큰 프로젝트를 갖고 있고 코드에서 발생한 새로운 오류의 명확한 책임자를 찾기 힘든 경우
* TypeScript의 두 가지 버전 사이에서 업그레이드하는 중이고, 한 버전에서는 코드 오류가 발생하지만 나머지 버전에서는 그렇지 않은 경우
* 솔직히 어떤 옵션 더 나은지 결정할 시간이 없는 경우

## <span id="uncalled-function-checks-in-conditional-expressions" /> 조건문에서 호출되지 않은 함수 체크 (Uncalled Function Checks in Conditional Expressions)

TypeScript 3.7에서 함수 호출을 잊어버렸을 경우 오류를 보고하기 위해 *호출되지 않은 함수 체크*를 도입했습니다.

```ts
function hasImportantPermissions(): boolean {
    // ...
}

// 이런!
if (hasImportantPermissions) {
//  ~~~~~~~~~~~~~~~~~~~~~~~
// hasImportantPermissions 함수가 항상 정의되어 있기 때문에, 이 조건문은 항상 true를 반환합니다.
// 대신 이것을 호출하려 하셨나요?
    deleteAllTheImportantFiles();
}
```

그러나, 이 오류는 `if` 문의 조건에만 적용됩니다.
[Alexander Tarasyuk](https://github.com/a-tarasyuk)의 [a pull request](https://github.com/microsoft/TypeScript/pull/36402) 덕분에, 이 기능은 삼항 조건 연산자도 지원하게 되었습니다 (예. `cond ? trueExpr : falseExpr` 구문).

```ts
declare function listFilesOfDirectory(dirPath: string): string[];
declare function isDirectory(): boolean;

function getAllFiles(startFileName: string) {
    const result: string[] = [];
    traverse(startFileName);
    return result;

    function traverse(currentPath: string) {
        return isDirectory ?
        //     ~~~~~~~~~~~
        // isDirectory 함수가 항상 정의되어 있기 때문에,
        // 이 조건문은 항상 true를 반환합니다
        // 대신 이것을 호출하려 하셨나요?
            listFilesOfDirectory(currentPath).forEach(traverse) :
            result.push(currentPath);
    }
}
```

https://github.com/microsoft/TypeScript/issues/36048

## <span id="editor-improvements" /> 에디터 개선 (Editor Improvements)

TypeScript 컴파일러는 주요 에디터의 TypeScript 작성 경험뿐만 아니라, Visual Studio 계열 에디터의 JavaScript 작성 경험에도 영향을 줍니다.
에디터에서 새로운 TypeScript/JavaScript 기능을 사용하는 것은 에디터에 따라 다르겠지만

* Visual Studio Code는 [다른 버전의 TypeScript 선택](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)을 지원합니다. 또는, 최신으로 유지하기 위한 [JavaScript/TypeScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)도 있습니다.(대체로 안정적입니다.)
* Visual Studio 2017/2019 에는 [SDK 설치 프로그램] 과 [MSBuild 설치](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild)가 있습니다.
* Sublime Text 3은 [다른 버전의 TypeScript 선택]((https://github.com/microsoft/TypeScript-Sublime-Plugin#note-using-different-versions-of-typescript))을 지원합니다.

### <span id="commonjs-auto-imports-in-javascript" /> JavaScript에서 CommonJS 자동-import (CommonJS Auto-Imports in JavaScript)

CommonJS 모듈을 사용하는 JavaScript 파일에서 자동-import 기능이 크게 개선되었습니다.

이전 버전에서는, TypeScript는 항상 파일에 관계없이 ECMAScript-스타일의 import를 원한다고 가정했습니다.

```js
import * as fs from "fs";
```

하지만, 모든 사람이 JavaScript 파일을 쓸 때 ECMAScript-스타일의 모듈을 원하는 것은 아닙니다.
많은 사용자가 여전히 CommonJS-스타일의 `require(...)` import를 사용하고 있습니다.

```js
const fs = require("fs");
```

이제 TypeScript는 파일 스타일을 깔끔하고 일관되게 유지하기 위해서 사용 중인 import 유형을 자동으로 검색합니다.

<video src="https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/ERkaliGU0AA5anJ1.mp4"></video>

이 변경에 대한 자세한 내용은, [해당 pull request](https://github.com/microsoft/TypeScript/pull/37027)를 참고하세요.

### <span id="code-actions-preserve-newlines" /> 코드 작업 개행 유지 (Code Actions Preserve Newlines)

TypeScript의 리팩터링과 빠른 수정은 종종 개행을 유지하는데 큰 역할을 하지는 않았습니다.
기본적인 예로 다음 코드를 보겠습니다.

```ts
const maxValue = 100;

/*시작*/
for (let i = 0; i <= maxValue; i++) {
    // 먼저 제곱 값을 구한다.
    let square = i ** 2;

    // 제곱 값을 출력한다.
    console.log(square);
}
/*끝*/
```

에디터에서 `/*시작*/` 에서 `/*끝*/` 까지 범위를 강조하여 새로운 함수로 추출하면, 다음과 같은 코드가 됩니다.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // 먼저 제곱 값을 구한다.
        let square = i ** 2;
        // 제곱 값을 출력한다.
        console.log(square);
    }
}
```

![이전 버전의 TypeScript에선 함수로 루프 추출은. 개행을 유지하지 않습니다.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithoutNewlines-3.9.gif.gif)

이건 이상적이지 않습니다 - `for` 루프에서 각각의 문 사이에 빈 줄이 있었지만 리팩터링이 없애버렸습니다!
TypeScript 3.9은 우리가 작성한 것을 보존하기 위해 조금 더 작업을 합니다.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // 먼저 제곱 값을 구한다.
        let square = i ** 2;

        // 제곱값을 출력한다.
        console.log(square);
    }
}
```

![TypeScript 3.9의 함수에 대한 루프 추출. 개행이 보존됨](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithNewlines-3.9.gif.gif)

[이 pull request](https://github.com/microsoft/TypeScript/pull/36688)에서 구현에 대해 더 자세히 볼 수 있습니다.

### <span id="quick-fixes-for-missing-return-expressions" /> 누락된 반환 문 빠른 수정 (Quick Fixes for Missing Return Expressions)

특히 화살표 함수에 중괄호를 추가할 때, 함수의 마지막 문의 값을 반환하는 것을 잊는 경우가 있습니다.

```ts
// 이전
let f1 = () => 42

// 실수 - 동일하지 않음!
let f2 = () => { 42 }
```

커뮤니티 멤버인 [Wenlu Wang](https://github.com/Kingwl)의 [pull request](https://github.com/microsoft/TypeScript/pull/26434) 덕분에, TypeScript는 누락된 `return` 문을 추가하거나, 중괄호를 제거하거나, 객체 리터럴 처럼 보이는 화살표 함수 몸체에 괄호를 추가하는 빠른-수정을 제공할 수 있습니다.

![TypeScript는 `return` 문을 추가하거나 중괄호를 제거하여 식이 반환되지 않는 오류를 수정합니다.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/04/missingReturnValue-3-9.gif)

### <span id="support-for-solution-style-tsconfigjson-files" /> `tsconfig.json` 파일 "솔루션 스타일" 지원 (Support for "Solution Style" `tsconfig.json` Files)

에디터는 파일이 어떤 설정 파일에 속하는지 파악하여 적절한 옵션을 적용할 수 있도록 하고 현재 "프로젝트"에 어떤 다른 파일이 포함되어 있는지 파악해야 합니다.
기본적으로, TypeScript의 언어 서버가 영향을 주는 에디터는 각 상위 디렉터리를 따라 올라가 `tsconfig.json`을 찾음으로써 이 작업을 수행합니다.

이 문제가 다소 실패하는 경우 중 하나는 tsconfig.json이 단순히 다른 tsconfig.json 파일을 참조하기 위해 존재할 때였습니다.

```json5
// tsconfig.json
{
    "files": [],
    "references": [
        { "path": "./tsconfig.shared.json" },
        { "path": "./tsconfig.frontend.json" },
        { "path": "./tsconfig.backend.json" },
    ]
}
```

다른 프로젝트 파일을 관리만 하는 이 파일은 어떤 환경에서는 종종 "솔루션"이라고 불립니다.
여기서 `tsconfig.*.json` 파일 중 어떤 파일도 서버에 의해 검색되지 않지만, 현재 `.ts` 파일이 루트의 `tsconfig.json`에 언급된 프로젝트 중 하나에 속한다는 것을 언어 서버가 이해하기를 원합니다.

TypeScript 3.9 는 이 설정에 대한 시나리오 수정을 지원합니다.
더 자세한 사항은, [이 기능을 추가한 pull request](https://github.com/microsoft/TypeScript/pull/37239)를 확인하세요.

## 주요 변경 사항 (Breaking Changes)

### 선택적 체이닝과 널이 아닌 단언에서 파싱 차이점 (Parsing Differences in Optional Chaining and Non-Null Assertions)

최근에 TypeScript는 선택적 체이닝 연산자를 도입했지만, 널이 아닌 단언 연산자 (`!`)와 함께 사용하는 선택적 체이닝 (`?.`)의 동작이 매우 직관적이지 않다는 사용자 피드백을 받았습니다.

구체적으로, 이전 버전에서는 코드가

```ts
foo?.bar!.baz
```

다음 JavaScript와 동등하게 해석되었습니다.

```js
(foo?.bar).baz
```

위에 코드에서 괄호는 선택적 체이닝의 "단락" 동작을 중단합니다, 그래서 만약 `foo`가 `undefined`이면, `baz`에 접근하는 것은 런타임 오류를 발생시킵니다.

이 동작을 지적한 바벨팀과 피드백을 준 대부분의 사용자들은 이 동작이 잘못되었다고 생각합니다.
저희도 그렇게 생각합니다!
`bar`의 타입에서 `null`과 `undefined`를 제거하는 것이 의도이기 때문에 가장 많이 들은 말은 `!` 연산자는 그냥 "사라져야 한다"입니다.

즉, 대부분의 사람들은 원본 문장이 다음과 같이

```js
foo?.bar.baz
```

`foo`가 `undefined`일 때, 그냥 `undefined`로 평가하는 것으로 해석되어야 한다고 생각합니다

이것이 주요 변경 사항이지만, 대부분의 코드가 새로운 해석을 염두에 두고 작성되었다고 생각합니다.
이전 동작으로 되돌리고 싶은 사용자는 `!` 연산자 왼쪽에 명시적인 괄호를 추가할 수 있습니다.

```ts
(foo?.bar)!.baz
```

### `}` 와 `>` 는 이제 유효하지 않은 JSX 텍스트 문자입니다 (`}` and `>` are Now Invalid JSX Text Characters)

JSX 명세서에는 텍스트 위치에 `}`와 `>` 문자의 사용을 금지합니다.
TypeScript와 바벨은 이 규칙을 더 적합하게 적용하기로 결정했습니다.
이 문자를 넣기 위한 새로운 방법은 HTML 이스케이프 코드를 사용하거나 (예를 들어, `<span> 2 &gt 1 </div>`) 문자열 리터럴로 표현식을 넣는 것입니다 (예를 들어, `<span> 2 {">"} 1 </div`).

다행히, [Brad Zacher](https://github.com/bradzacher)의 [pull request](https://github.com/microsoft/TypeScript/pull/36636) 덕분에, 다음 문장과 함께 오류 메시지를 받을 수 있습니다

```
Unexpected token. Did you mean `{'>'}` or `&gt;`?
Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
```

예를 들어:

```tsx
let directions = <span>Navigate to: Menu Bar > Tools > Options</div>
//                                           ~       ~
// Unexpected token. Did you mean `{'>'}` or `&gt;`?
```

이 오류 메시지는 편리하고 빠른 수정과 함께 제공되고 [Alexander Tarasyuk](https://github.com/a-tarasyuk) 덕분에, 많은 오류가 있으면 [이 변경사항을 일괄 적용 할 수 있습니다](https://github.com/microsoft/TypeScript/pull/37436).

### 교집합과 선택적 프로퍼티에 대한 더 엄격해진 검사 (Stricter Checks on Intersections and Optional Properties)

일반적으로, `A & B`와 같은 교차 타입은 `A` 또는 `B`가 `C`에 할당할 수 있으면, `A & B`는 `C`에 할당할 수 있습니다; 하지만, 가끔 선택적 프로퍼티에서 문제가 생깁니다.
예를 들어, 다음을 봅시다:

```ts
interface A {
    a: number; // 'number' 인 것에 주목
}

interface B {
    b: string;
}

interface C {
    a?: boolean; // 'boolean' 인것에 주목
    b: string;
}

declare let x: A & B;
declare let y: C;

y = x;
```

이전 버전의 TypeScript에서는, `A`가 `C`와 완전히 호환되지 않지만, `B`가 `C`와 호환 *되었기* 때문에 허용되었습니다.

TypeScript 3.9에서는, 교집합 안의 모든 타입이 구제적인 객체 타입이면, 타입 시스템은 모든 프로퍼티를 한 번에 고려합니다.
결과적으로, TypeScript는 `A & B`의 `a` 프로퍼티는 `C`의 `a` 프로퍼티와 호환되지 않는다고 봅니다:

```
'A & B' 타입은 'C' 타입에 할당할 수 없습니다.
  'a' 프로퍼티의 타입은 호환되지 않습니다.
    'number' 타입은 'boolean | undefined' 타입에 할당할 수 없습니다.
```

이 변경사항에 대한 자세한 정보는, [해당 pull request](https://github.com/microsoft/TypeScript/pull/37195)를 참조하세요.

### 판별 프로퍼티로 줄어든 교집합 (Intersections Reduced By Discriminant Properties)

존재하지 않는 값을 기술하는 타입으로 끝날 수 있는 몇 가지 경우가 있습니다.
예를 들어

```ts
declare function smushObjects<T, U>(x: T, y: U): T & U;

interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

declare let x: Circle;
declare let y: Square;

let z = smushObjects(x, y);
console.log(z.kind);
```

이 코드는 `Circle`과 `Square`의 교집합을 생성할 방법이 전혀 없기 때문에 약간 이상합니다 - 호환되지 않는 두 `kind` 필드가 있습니다.
이전 버전의 TypeScript에서는, 이 코드는 허용되었고 `"circle" & "square"`가 `절대(never)` 존재할 수 없는 값의 집합을 기술했기 때문에 `kind` 자체의 타입은 `never`였습니다.

TypeScript 3.9에서는, 타입 시스템이 더 공격적입니다 - `kind` 프로퍼티 때문에 `Circle`과 `Square`를 교차하는 것이 불가능하다는 것을 알고 있습니다.
그래서 `z.kind`를 `never`로 축소하는 대신, `z` 자체(`Circle & Square`) 타입을 `never`로 축소합니다.
즉 위의 코드는 다음과 같은 오류를 발생합니다:

```
'kind' 프로퍼티는 'never' 타입에 존재하지 않습니다.
```

관찰한 대부분의 오류는 잘못된 타입 선언과 일치하는 것으로 보입니다.
자세한 내용은 [원문 pull request](https://github.com/microsoft/TypeScript/pull/36696)를 보세요.

### Getters/Setters는 더 이상 열거하지 않습니다 (Getters/Setters are No Longer Enumerable)

이전 버전의 TypeScript에서, 클래스의 `get`과 `set` 접근자는 열거 가능한 방법으로 방출되었습니다; 하지만, `get`과 `set`은 열거할 수 없다는 ECMAScript 사양을 따르지 않았습니다.
결과적으로, ES5와 ES2015를 타겟팅 하는 TypeScript 코드는 동작이 다를 수 있습니다.

깃허브 사용자 [pathurs](https://github.com/pathurs)의 [pull request](https://github.com/microsoft/TypeScript/pull/32264) 덕분에, TypeScript 3.9는 이와 관련하여 ECMAScript와 더 밀접하게 호환됩니다.

### `any`로 확장된 타입 매개변수는 더 이상 `any` 처럼 행동하지 않음 (Type Parameters That Extend `any` No Longer Act as `any`)

이전 버전의 TypeScript에서 `any`로 제한된 타입 매개변수는 `any`로 다룰 수 있었습니다.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied; // 오류가 아님!
}
```

이는 실수였습니다, 그래서 TypeScript 3.9에서는 더 보수적인 접근을 취하고 이런 의심스러운 작업에 대해 오류를 발생시킵니다.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied;
    //  ~~~~~~~~~~~~~~~
    // 'spfjgerijghoied' 프로퍼티는 'T' 타입에 존재하지 않습니다.
}
```

### `export *`은 항상 유지됩니다 (`export *` is Always Retained)

이전 TypeScript 버전에서 `export * from "foo"` 같은 선언은 `foo`가 어떠한 값도 export 하지 않으면 JavaScript 출력에서 제외되었습니다.
이런 내보내기는 타입-지향적이고 바벨에서 에뮬레이트 될 수 없기 때문에 문제가 됩니다.
TypeScrip 3.9는 이런 `export *` 선언을 항상 내보냅니다.
실제로 이 변화가 기존 코드를 깨뜨릴 것이라고 생각하지 않습니다.
