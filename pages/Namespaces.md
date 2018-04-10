> **용어에 대한 참고 사항:**
TypeScript 1.5에 명칭이 변경되었습니다.  
"내부 모듈"은 이제 "네임스페이스"입니다.  
"외부 모듈"은 [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)의 용어에 맞게 간단히 "모듈"입니다 (즉 모듈 X { 는 현재 선호되는 네임스페이스 X { 와 동일합니다).

# 소개

이 게시물은 TypeScript의 네임스페이스(이전의 "내부 모듈")를 사용하여 코드를 구성하는 다양한 방법을 간략하게 설명합니다.  
용어에 대해 언급할 때 "내부(internal) 모듈"은 이제 "네임스페이스"로 언급됩니다.  
또 내부 모듈을 선언할 때 `module` 키워드가 사용된 곳이라면 어디에서나 `namespace` 키워드를 대신 사용할 수 있습니다.  
비슷한 이름의 용어로 오버로드함으로써 새로운 사용자에게 주는 혼동을 방지합니다.

# 첫 걸음 (First steps)

먼저 이 페이지의 예제로 사용할 프로그램에서부터 시작해보겠습니다.  
웹 페이지의 양식에 대한 사용자 입력을 확인하거나 외부에서 제공하는 데이터 파일의 형식을 확인하기 위해 작성할 수 있는 간단한 문자열 유효성 검사기를 작성했습니다.

## 단일 파일의 유효성 검사기 (Validators in a single file)

```ts
interface StringValidator {
    isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// 시험용 샘플
let strings = ["Hello", "98052", "101"];

// 사용할 Validators
let validators: { [s: string]: StringValidator; } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// 각 문자열이 Validator를 통과했는지 여부를 보여 줍니다.
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`'${ s }' ${ isMatch ? "matches" : "does not match" } '${ name }'.`);
    }
}
```

# Namespacing

Validator를 더 추가함에 따라 타입을 추적하고 다른 객체와의 이름 충돌에 대해 걱정하지 않을 수 있는 일종의 조직 체계를 원할 것입니다.  
전역 네임스페이스에 다른 이름을 많이 추가하는 대신 객체를 네임스페이스로 마무리합시다.

이 예제에서는 모든 validator 관련 엔티티를 `Validation`라는 네임스페이스로 이동합니다.  
여기서 인터페이스와 클래스를 네임스페이스 외부에서 볼 수 있기를 원하기 때문에 `export`를 머리말에 붙입니다.  
반대로 변수 `lettersRegexp`와 `numberRegexp`는 구현 세부 사항이므로 노출되지 않은 상태로 남아있어 네임스페이스 외부의 코드에는 보이지 않습니다.  
파일의 아래쪽에 있는 테스트 코드에서 (예: `Validation.LettersOnlyValidator`)와 같이 네임스페이스 외부에서 사용할 경우 타입의 이름을 확인해야 합니다.

## Namespaced Validators

```ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// 시험용 샘플
let strings = ["Hello", "98052", "101"];

// 사용할 Validators
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 각 문자열이 Validator를 통과했는지 여부를 보여 줍니다.
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

# 파일 분할 (Splitting Across Files)

애플리케이션이 증가함에 따라 코드를 여러 파일로 나누어 유지 보수하기 쉽게 만들려고 합니다.

## Multi-file namespaces

여기서 `Validation` 네임스페이스를 많은 파일들로 나눌 것입니다.  
파일은 별개이지만 각각 동일한 네임스페이스에 기여할 수 있으며 모든 파일이 한곳에서 정의된 것처럼 사용할 수 있습니다.  
파일 간 의존성이 있기 때문에 컴파일러에게 파일들 간의 관계를 알려주는 참조 태그를 추가합니다.  
테스트 코드는 변경되지 않습니다.

##### Validation.ts

```ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```

##### LettersOnlyValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

##### ZipCodeValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

##### Test.ts

```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// 시험용 샘플
let strings = ["Hello", "98052", "101"];

// 사용할 Validators
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 각 문자열이 Validator를 통과했는지 여부를 보여 줍니다.
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

여러 파일이 포함되면 컴파일된 모든 코드를 로드해야 합니다.  
이 작업에는 두 가지 방법이 있습니다.

먼저 `--outFile`을 사용하여 모든 입력 파일을 단일 JavaScript 출력 파일로 컴파일 할 수 있습니다:

```Shell
tsc --outFile sample.js Test.ts
```

컴파일러는 파일에 있는 참조 태그를 기반으로 출력 파일을 자동으로 정렬합니다.  
각 파일을 개별적으로 지정할 수도 있습니다:

```Shell
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

또는 파일별 컴파일(기본값)을 사용하여 각 입력 파일에 대한 JavaScript 파일을 하나씩 내보낼 수 있습니다.  
만약 여러 개의 JS 파일이 생성되면 웹 페이지에 있는 `<script>`태그를 사용하여 출력된 각 파일을 적절한 순서대로 로드해야 합니다.

예를 들어:

##### MyTestPage.html (excerpt)

```html
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

# 별칭 (Aliases)

네임스페이스 작업을 단순화할 수 있는 또 다른 방법은 `import x = require("name")`를 사용하여 일반적으로 사용되는 객체의 더 짧은 이름을 생성하는 것입니다.  
이러한 종류의 imports(별칭으로 불림)를 모듈 imports에서 생성된 객체를 포함한 모든 종류의 식별자에 사용할 수 있습니다.

```ts
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // 'new Shapes.Polygons.Square()'와 동일합니다
```

`require` 키워드는 사용하지 않습니다. 대신 가져오는 심볼에 걸맞은 이름을 직접 할당합니다.  
이것은 `var` 사용과 비슷하지만 가져온 심볼의 타입과 네임스페이스 의미에 대해서도 작용합니다.  
중요한 점은, 값의 경우 `import`는 원래 심볼과 별개의 참조이므로 앨리어싱된 `var`에 대한 변경 사항은 원래 변수에 반영되지 않습니다.

# 다른 JavaScript 라이브러리로 작업하기 (Working with Other JavaScript Libraries)

TypeScript에서 작성되지 않은 라이브러리의 형태을 설명하려면 라이브러리에서 표시하는 API를 선언해야 합니다.  
대부분의 JavaScript 라이브러리는 몇 개의 최상위 레벨의 객체만 노출하므로 네임스페이스는 객체를 표현할 수있는 좋은 방법입니다.

구현을 "ambient"으로 정의하지 않는 선언을 호출합니다.  
일반적으로 이들은 `.d.ts` 파일에 정의되어 있습니다.  
C/C++에 익숙하다면 `.d.ts` 파일로 생각할 수 있습니다.  
몇 가지 예를 살펴보겠습니다.

## Ambient Namespaces

인기 있는 라이브러리 D3는 `d3`이라는 전역 객체에서 기능을 정의합니다.  
이 라이브러리는 `<script>` 태그 (모듈 로더 대신)를 통해 로드되기 때문에 선언에 네임스페이스를 사용하여 그 형태을 정의합니다.  
TypeScript 컴파일러가 이 형태을 보려면 ambient 네임스페이스 선언을 사용합니다.
예를 들어 다음과 같이 작성할 수 있습니다:

##### D3.d.ts (simplified excerpt)

```ts
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
```
