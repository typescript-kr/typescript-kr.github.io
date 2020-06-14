* [타입-전용 Imports 와 Exports](#type-only-imports-exports)
* [ECMAScript 비공개 필드](#ecmascript-private-fields)
* [`export * as ns` 구문](#export-star-as-namespace-syntax)
* [최상위-레벨 `await`](#top-level-await)
* [JSDoc 프로퍼티 지정자](#jsdoc-modifiers)
* [리눅스에서 더 나은 디렉터리 감시와 `watchOptions`](#better-directory-watching)
* ["빠르고 느슨한" 증분 검사](#assume-direct-dependencies)

## <span id="type-only-imports-exports" /> 타입-전용 Imports 와 Exports (Type-Only Imports and Exports)

이 기능은 대부분의 사용자에겐 생각할 필요가 없을 수도 있지만; `--isolatedModules`, TypeScript의 `transpileModule` API, 또는 Babel에서 문제가 발생하면 이 기능과 관련이 있을 수 있습니다.

TypeScript 3.8은 타입-전용 imports, exports를 위한 새로운 구문이 추가되었습니다.

```ts
import type { SomeThing } from "./some-module.js";

export type { SomeThing };
```

`import type`은 타입 표기와 선언에 사용될 선언만 import 합니다.
이는 *항상* 완전히 제거되므로, 런타임에 남아있는 것은 없습니다.
마찬가지로, `export type`은 타입 문맥에 사용할 export만 제공하며, 이 또한 TypeScript의 출력물에서 제거됩니다.

클래스는 런타임에 값을 가지고 있고 디자인-타임에 타입이 있으며 사용은 상황에-따라 다르다는 것을 유의해야 합니다.
클래스를 import 하기 위해 `import type`을 사용하면, 확장 같은 것은 할 수 없습니다.

```ts
import type { Component } from "react";

interface ButtonProps {
    // ...
}

class Button extends Component<ButtonProps> {
    //               ~~~~~~~~~
    // error! 'Component' only refers to a type, but is being used as a value here.

    // ...
}
```

이전에 Flow를 사용해본 적이 있다면, 이 구문은 상당히 유사합니다.
한 가지 차이점은 코드가 모호해 보이지 않도록 몇 가지 제한을 두었다는 것입니다.

```ts
// 'Foo'만 타입인가? 혹은 모든 import 선언이 타입인가?
// 이는 명확하지 않기 때문에 오류로 처리합니다.

import type Foo, { Bar, Baz } from "some-module";
//     ~~~~~~~~~~~~~~~~~~~~~~
// error! A type-only import can specify a default import or named bindings, but not both.
```

`import type`과 함께, TypeScript 3.8은 런타임 시 사용되지 않는 import에서 발생하는 작업을 제어하기 위해 새로운 컴파일러 플래그를 추가합니다: `importsNotUsedAsValues`.
이 플래그는 3 가지 다른 값을 가집니다:

* `remove`: 이는 imports를 제거하는 현재 동작이며, 계속 기본값으로 작동할 것이며, 기존 동작을 바꾸는 변화가 아닙니다.
* `preserve`: 이는 사용되지 않는 값들을 모두 *보존*합니다. 이로 인해 imports/side-effects가 보존될 수 있습니다.
* `error`: 이는 모든 (`preserve` option 처럼) 모든 imports를 보존하지만, import 값이 타입으로만 사용될 경우 오류를 발생시킵니다. 이는 실수로 값을 import하지 않지만 사이드 이팩트 import를 명시적으로 만들고 싶을 때 유용합니다.

이 기능에 대한 더 자세한 정보는, `import type`선언이 사용될수 있는 범위를 확대하는 [pull request](https://github.com/microsoft/TypeScript/pull/35200), 와 [관련된 변경 사항](https://github.com/microsoft/TypeScript/pull/36092/)에서 찾을 수 있습니다.

## <span id="ecmascript-private-fields" /> ECMAScript 비공개 필드 (ECMAScript Private Fields)

TypeScript 3.8 은 ECMAScript의 [stage-3 클래스 필드 제안](https://github.com/tc39/proposal-class-fields/)의 비공개 필드를 지원합니다.

```ts
class Person {
    #name: string

    constructor(name: string) {
        this.#name = name;
    }

    greet() {
        console.log(`Hello, my name is ${this.#name}!`);
    }
}

let jeremy = new Person("Jeremy Bearimy");

jeremy.#name
//     ~~~~~
// 프로퍼티 '#name'은 'Person' 클래스 외부에서 접근할 수 없습니다.
// 이는 비공개 식별자를 가지기 때문입니다.
```

일반적인 프로퍼티들(`private` 지정자로 선언한 것도)과 달리, 비공개 필드는 몇 가지 명심해야 할 규칙이 있습니다.
그중 몇몇은:

* 비공개 필드는 `#` 문자로 시작합니다. 때때로 이를 *비공개 이름(private names)* 이라고 부릅니다.
* 모든 비공개 필드 이름은 이를 포함한 클래스 범위에서 유일합니다.
* `public` 또는 `private` 같은 TypeScript 접근 지정자는 비공개 필드로 사용될 수 없습니다.  
* JS 사용자로부터도 비공개 필드는 이를 포함한 클래스 밖에서 접근하거나 탐지할 수 없습니다! 때때로 이를 *강한 비공개(hard privacy)* 라고 부릅니다.

"강한" 비공개와 별도로, 비공개 필드의 또 다른 장점은 유일하다는 것입니다.
예를 들어, 일반적인 프로퍼티 선언은 하위클래스에서 덮어쓰기 쉽습니다.

```ts
class C {
    foo = 10;

    cHelper() {
        return this.foo;
    }
}

class D extends C {
    foo = 20;

    dHelper() {
        return this.foo;
    }
}

let instance = new D();
// 'this.foo' 는 각 인스턴스마다 같은 프로퍼티를 참조합니다.
console.log(instance.cHelper()); // '20' 출력
console.log(instance.dHelper()); // '20' 출력
```

비공개 필드에서는, 포함하고 있는 클래스에서 각각의 필드 이름이 유일하기 때문에 이에 대해 걱정하지 않아도 됩니다.

```ts
class C {
    #foo = 10;

    cHelper() {
        return this.#foo;
    }
}

class D extends C {
    #foo = 20;

    dHelper() {
        return this.#foo;
    }
}

let instance = new D();
// 'this.#foo' 는 각 클래스안의 다른 필드를 참조합니다.
console.log(instance.cHelper()); // '10' 출력
console.log(instance.dHelper()); // '20' 출력
```

알아 두면 좋은 또 다른 점은 다른 타입으로 비공개 필드에 접근하면 `TypeError` 를 발생한다는 것입니다.

```ts
class Square {
    #sideLength: number;

    constructor(sideLength: number) {
        this.#sideLength = sideLength;
    }

    equals(other: any) {
        return this.#sideLength === other.#sideLength;
    }
}

const a = new Square(100);
const b = { sideLength: 100 };

// Boom!
// TypeError: attempted to get private field on non-instance
// 이는 `b` 가 `Square`의 인스턴스가 아니기 때문에 실패 합니다.
console.log(a.equals(b));
```

마자막으로, 모든 일반 `.js` 파일 사용자들의 경우, 비공개 필드는 *항상* 할당되기 전에 선언되어야 합니다.

```js
class C {
    // '#foo' 선언이 없습니다.
    // :(

    constructor(foo: number) {
        // SyntaxError!
        // '#foo'는 쓰여지기 전에 선언되어야 합니다.
        this.#foo = foo;
    }
}
```

JavaScript는 항상 사용자들에게 선언되지 않은 프로퍼티에 접근을 허용했지만, TypeScript는 항상 클래스 프로퍼티 선언을 요구했습니다.
비공개 필드는, `.js` 또는 `.ts` 파일에서 동작하는지 상관없이 항상 선언이 필요합니다.

```js
class C {
    /** @type {number} */
    #foo;

    constructor(foo: number) {
        // 동작합니다.
        this.#foo = foo;
    }
}
```

구현에 대한 더 많은 정보는, [the original pull request](https://github.com/Microsoft/TypeScript/pull/30829)를 참고하세요

### 어떤 것을 사용해야 할까요? (Which should I use?)

이미 TypeScript 유저로서 어떤 종류의 비공개를 사용해야 하는지에 대한 많은 질문을 받았습니다: 주로, "`private` 키워드를 사용해야 하나요 아니면 ECMAScript의 해시/우물 (`#`) 비공개 필드를 사용해야 하나요?"
상황마다 다릅니다!

프로퍼티에서, TypeScript의 `private` 지정자는 완전히 지워집니다 - 이는 런타임에서는 완전히 일반 프로퍼티처럼 동작하며 이것이 `private` 지정자로 선언되었다고 알릴 방법이 없습니다.
`private` 키워드를 사용할 때, 비공개는 오직 컴파일-타임/디자인-타임에만 시행되며, JavaScript 사용자에게는 전적으로 의도-기반입니다.

```ts
class C {
    private foo = 10;
}

// 이는 컴파일 타임에 오류이지만
// TypeScript 가 .js 파일로 출력했을 때는
// 잘 동작하며 '10'을 출력합니다.
console.log(new C().foo);    // '10' 출력
//                  ~~~
// error! Property 'foo' is private and only accessible within class 'C'.

// TypeScript 오류를 피하기 위한 "해결 방법" 으로
// 캄파일 타임에 이것을 허용합니다.
console.log(new C()["foo"]); // prints '10'
```

이 같은 종류의 "약한 비공개(soft privacy)"는 사용자가 API에 접근할 수 없는 상태에서 일시적으로 작업을 하는 데 도움이 되며, 어떤 런타임에서도 동작합니다.

반면에, ECMAScript의 `#` 비공개는 완벽하게 클래스 밖에서 접근 불가능합니다.

```ts
class C {
    #foo = 10;
}

console.log(new C().#foo); // SyntaxError
//                  ~~~~
// TypeScript 는 오류를 보고 하며 *또한*
// 런타임에도 동작하지 않습니다.

console.log(new C()["#foo"]); // undefined 출력
//          ~~~~~~~~~~~~~~~
// TypeScript 는 'noImplicitAny' 하에서 오류를 보고하며
// `undefined`를 출력합니다.
```

이런 강한 비공개(hard privacy)는 아무도 내부를 사용할 수 없도록 엄격하게 보장하는데 유용합니다.
만약 라이브러리 작성자일 경우, 비공개 필드를 제거하거나 이름을 바꾸는 것이 급격한 변화를 초래서는 안됩니다.

언급했듯이, 다른 장점은 ECMAScript의 `#` 비공개가 *진짜* 비공개이기 때문에 서브클래싱을 쉽게 할 수 있다는 것입니다.
ECMAScript `#` 비공개 필드를 사용하면, 어떤 서브 클래스도 필드 네이밍 충돌에 대해 걱정할 필요가 없습니다.
TypeScript의 `private`프로퍼티 선언에서는, 사용자는 여전히 상위 클래스에 선언된 프로퍼티를 짓밟지  않도록 주의해야 합니다.

한 가지 더 생각해봐야 할 것은 코드가 실행되기를 의도하는 곳입니다.
현재 TypeScript는 이 기능을 ECMAScript 2015 (ES6) 이상 버전을 대상으로 하지 않으면 지원할 수 없습니다.
이는 하위 레벨 구현이 비공개를 강제하기 위해 `WeakMap`을 사용하는데, `WeakMap`은 메모리 누수를 잃으키지 않도록 폴리필될 수 없기 때문입니다.
반면, TypeScript의 `private`-선언 프로퍼티는 모든 대상에서 동작합니다- ECMAScript3에서도!

마지막 고려 사항은 속도 일수 있습니다: `private` 프로퍼티는 다른 어떤 프로퍼티와 다르지 않기 때문에, 어떤 런타임을 대상으로 하단 다른 프로퍼티와 마찬가지로 접근 속도가 빠를 수 있습니다.
반면에, `#` 비공개 필드는 `WeakMap`을 이용해 다운 레벨 되기 때문에 사용 속도가 느려질 수 있습니다.
어떤 런타임은 `#` 비공개 필드 구현을 최적화 하고, 더 빠른 `WeakMap`을 구현하고 싶을 수 있지만, 모든 런타임에서 그렇지 않을 수 있습니다.

## <span id="export-star-as-namespace-syntax" /> `export * as ns` 구문 (`export * as ns` Syntax)

다른 모듈의 모든 멤버를 하나의 멤버로 내보내는 단일 진입점을 갖는 것은 종종 일반적입니다.

```ts
import * as utilities from "./utilities.js";
export { utilities };
```

이는 매우 일반적이어서 ECMAScript2020은 최근에 이 패턴을 지원하기 위해서 새로운 구문을 추가했습니다.

```ts
export * as utilities from "./utilities.js";
```

이것은 JavaScript에 대한 훌륭한 삶의 질의 향상이며, TypeScript 3.8은 이 구문을 지원합니다.
모듈 대상이 `es2020` 이전인 경우, TypeScript는 첫 번째 줄의 코드 스니펫을 따라서 무언가를 출력할 것입니다.

## <span id="top-level-await" /> 최상위-레벨 `await` (Top-Level `await`)

TypeScript 3.8은 "최상위-레벨 `await`"이라는 편리한 ECMAScript 기능을 지원합니다.

JavaScript 사용자는 `await`을 사용하기 위해 `async` 함수를 도입하는 경우가 많으며, 이를 정의한 후 즉시 함수를 호출합니다.

```js
async function main() {
    const response = await fetch("...");
    const greeting = await response.text();
    console.log(greeting);
}

main()
    .catch(e => console.error(e))
```

이전의 JavaScript(유사한 기능을 가진 대부분의 다른 언어들과 함께)에서 `await`은 `async` 함수 내에서 만 허용되었기 때문입니다.
하지만 최상위-레벨 `await`로, 우리는 모듈의 최상위 레벨에서 `await`을 사용할 수 있습니다.

```ts
const response = await fetch("...");
const greeting = await response.text();
console.log(greeting);

// 모듈인지 확인
export {};
```

유의할 점이 있습니다: 최상위-레벨 `await`은 *module*의 최상위 레벨에서만 동작하며, 파일은 TypeScript가 `import`나 `export`를 찾을 때에만 모듈로 간주됩니다.
일부 기본적인 경우에 `export {}`와 같은 보일러 플레이트를 작성하여 이를 확인할 필요가 있습니다.

이러한 경우가 예상되는 모든 환경에서 최상위 레벨 `await`은 동작하지 않을 수 있습니다.
현재, `target` 컴파일러 옵션이 `es2017` 이상이고, `module`이 `esnext` 또는 `system`인 경우에만 최상위 레벨 `await`을 사용할 수 있습니다.
몇몇 환경과 번들러내에서의 지원은 제한적으로 작동하거나 실험적 지원을 활성화해야 할 수도 있습니다.

구현에 관한 더 자세한 정보는 [the original pull request을 확인하세요](https://github.com/microsoft/TypeScript/pull/35813).

## <span id="es2020-for-target-and-module" /> `es2020`용 `target`과 `module`   (`es2020` for `target` and `module`)

TypeScript 3.8은 `es2020`을 `module`과 `target` 옵션으로 지원합니다.
이를 통해 선택적 체이닝 (optional chaining), nullish 병합 (nullish coalescing), `export * as ns` 그리고 동적인 `import(...)` 구문과 같은 ECMAScript 2020 기능이 유지됩니다.
또한 `bigint` 리터럴이 `esnext` 아래에 안정적인 `target`을 갖는 것을 의미합니다.

## <span id="jsdoc-modifiers" /> JSDoc 프로퍼티 지정자 (JSDoc Property Modifiers)

TypeScript 3.8는 `allowJs` 플래그를 사용하여 JavaScript 파일을 지원하고 `checkJs` 옵션이나 `// @ts-check` 주석을 `.js` 파일 맨 위에 추가하여 JavaScript 파일의 *타입-검사*를 지원합니다.

JavaScript 파일에는 타입-검사를 위한 전용 구문이 없기 때문에 TypeScript는 JSDoc을 활용합니다.
TypeScript 3.8은 프로퍼티에 대한 몇 가지 새로운 JSDoc 태그를 인식합니다.

먼저 접근 지정자입니다: `@public`, `@private` 그리고 `@protected`입니다.
이 태그들은 TypeScript 내에서 각각 `public`, `private`, `protected`와 동일하게 동작합니다.

```js
// @ts-check

class Foo {
    constructor() {
        /** @private */
        this.stuff = 100;
    }

    printStuff() {
        console.log(this.stuff);
    }
}

new Foo().stuff;
//        ~~~~~
// 오류! 'stuff' 프로퍼티는 private 이기 때문에 오직 'Foo' 클래스 내에서만 접근이 가능합니다.
```

* `@public`은 항상 암시적이며 생략될 수 있지만, 어디서든 해당 프로퍼티에 접근 가능을 의미합니다.
* `@private`은 오직 프로퍼티를 포함하는 클래스 내에서 해당 프로퍼티 사용 가능을 의미합니다.
* `@protected`는 프로퍼티를 포함하는 클래스와 파생된 모든 하위 클래스내에서 해당 프로퍼티를 사용할 수 있지만, 포함하는 클래스의 인스턴스는 해당 프로퍼티를 사용할 수 없습니다.

다음으로 `@readonly` 지정자를 추가하여 프로퍼티가 초기화 과정 내에서만 값이 쓰이는 것을 보장합니다.

```js
// @ts-check

class Foo {
    constructor() {
        /** @readonly */
        this.stuff = 100;
    }

    writeToStuff() {
        this.stuff = 200;
        //   ~~~~~
        // 'stuff'는 읽기-전용(read-only) 프로퍼티이기 때문에 할당할 수 없습니다.
    }
}

new Foo().stuff++;
//        ~~~~~
// 'stuff'는 읽기-전용(read-only) 프로퍼티이기 때문에 할당할 수 없습니다.
```

## <span id="better-directory-watching" /> 리눅스에서 더 나은 디렉터리 감시와 `watchOptions`

TypeScript 3.8에서는 `node_modules`의 변경사항을 효율적으로 수집하는데 중요한 새로운 디렉터리 감시 전략을 제공합니다.

리눅스와 같은 운영체제에서 TypeScript는 `node_modules`에 디렉터리 왓쳐(파일 왓쳐와는 반대로)를 설치하고, 의존성 변화를 감지하기 위해 많은 하위 디렉터리를 설치합니다.
왜냐하면 사용 가능한 파일 왓쳐의 수는 종종 `node_modules`의 파일 수에 의해 가려지기 때문이고, 추적할 디렉터리 수가 적기 때문입니다.

TypeScript의 이전 버전은 폴더에 디렉터리 왓쳐를 *즉시* 설치하며, 초기에는 괜찮을 겁니다; 하지만, npm install 할 때, `node_modules`안에서 많은 일들이 발생할 것이고, TypeScript를 압도하여, 종종 에디터 세션을 아주 느리게 만듭니다.
이를 방지하기 위해, TypeScript 3.8은 디렉터리 왓쳐를 설치하기 전에 조금 기다려서 변동성이 높은 디렉터리에게 안정될 수 있는 시간을 줍니다.

왜냐하면 모든 프로젝트는 다른 전략에서 더 잘 작동할 수 있고, 이 새로운 방법은 당신의 작업 흐름에서는 잘 맞지 않을 수 있습니다. TypeScript 3.8은 파일과 디렉터리를 감시하는데 어떤 감시 전략을 사용할지 컴파일러/언어 서비스에 알려줄 수 있도록 `tsconfig.json`과 `jsconfig.json`에 `watchOptions`란 새로운 필드를 제공합니다.

```json5
{
    // 일반적인 컴파일러 옵션들
    "compilerOptions": {
        "target": "es2020",
        "moduleResolution": "node",
        // ...
    },

    // NEW: 파일/디렉터리 감시를 위한 옵션
    "watchOptions": {
        // 파일과 디렉터리에 네이티브 파일 시스템 이벤트 사용
        "watchFile": "useFsEvents",
        "watchDirectory": "useFsEvents",

        // 업데이트가 빈번할 때
        // 업데이트하기 위해 더 자주 파일을 폴링
        "fallbackPolling": "dynamicPriority"
    }
}
```

`watchOptions`는 구성할 수 있는 4가지 새로운 옵션이 포함되어 있습니다.

* `watchFile`: 각 파일의 감시 방법 전략. 다음과 같이 설정할 수 있습니다:
    * `fixedPollingInterval`: 고정된 간격으로 모든 파일의 변경을 1초에 여러 번 검사합니다.
    * `priorityPollingInterval`: 모든 파일의 변경을 1초에 여러 번 검사합니다, 하지만 휴리스틱을 사용하여 특정 타입의 파일은 다른 타입의 파일보다 덜 자주 검사합니다.
    * `dynamicPriorityPolling`: 동적 큐를 사용하여 덜-자주 수정된 파일은 적게 검사합니다.
    * `useFsEvents` (디폴트): 파일 변화에 운영체제/파일 시스템의 네이티브 이벤트를 사용합니다.
    * `useFsEventsOnParentDirectory`: 파일을 포함하고 있는 디렉터리 변경을 감지할 때, 운영체제/파일 시스템의 네이티브 이벤트를 사용합니다. 파일 왓쳐를 적게 사용할 수 있지만, 덜 정확할 수 있습니다.
* `watchDirectory`: 재귀적인 파일-감시 기능이 없는 시스템 안에서 전체 디렉터리 트리가 감시되는 전략. 다음과 같이 설정할 수 있습니다:
    * `fixedPollingInterval`: 고정된 간격으로 모든 디렉터리의 변경을 1초에 여러 번 검사합니다.
    * `dynamicPriorityPolling`: 동적 큐를 사용하여 덜-자주 수정된 디렉터리는 적게 검사합니다.
    * `useFsEvents` (디폴트): 디렉터리 변경에 운영체제/파일 시스템의 네이티브 이벤트를 사용합니다.
* `fallbackPolling`: 파일 시스템 이벤트를 사용할 때, 이 옵션은 시스템이 네이티브 파일 왓쳐가 부족하거나/혹은 지원하지 않을 때, 사용되는 폴링 전략을 지정합니다. 다음과 같이 설정할 수 있습니다.
    * `fixedPollingInterval`: *(위를 참조하세요.)*
    * `priorityPollingInterval`: *(위를 참조하세요.)*
    * `dynamicPriorityPolling`: *(위를 참조하세요.)*
* `synchronousWatchDirectory`: 디렉터리의 연기된 감시를 비활성화합니다. 연기된 감시는 많은 파일이 한 번에 변경될 때 유용합니다 (예를 들어, `npm install`을 실행하여 `node_modules`의 변경), 하지만 덜-일반적인 설정을 위해 비활성화할 수도 있습니다.

이 변경의 더 자세한 내용은 Github으로 이동하여 [the pull request](https://github.com/microsoft/TypeScript/pull/35615)를 읽어보세요.

## <span id="assume-direct-dependencies" /> "빠르고 느슨한" 증분 검사

TypeScript 3.8은 새로운 컴파일러 옵션 `assumeChangesOnlyAffectDirectDepencies`을 제공합니다.
이 옵션이 활성화되면, TypeScript는 정말로 영향을 받은 파일들은 재검사/재빌드하지않고, 변경된 파일뿐만 아니라 직접 import 한 파일만 재검사/재빌드 합니다.

예를 들어, 다음과 같이 `fileA.ts`를 import 한 `fileB.ts`를 import 한 `fileC.ts`를 import 한 `fileD.ts`를 살펴봅시다:

```text
fileA.ts <- fileB.ts <- fileC.ts <- fileD.ts
```

`--watch` 모드에서는, `fileA.ts`의 변경이 `fileB.ts`, `fileC.ts` 그리고 `fileD.ts`를 TypeScript가 재-검사해야 한다는 의미입니다.
`assumeChangesOnlyAffectDirectDependencies`에서는 `fileA.ts`의 변경은 `fileA.ts`와 `fileB.ts`만 재-검사하면 됩니다.

Visual Studio Code와 같은 코드 베이스에서는, 특정 파일의 변경에 대해 약 14초에서 약 1초로 재빌드 시간을 줄여주었습니다.
이 옵션을 모든 코드 베이스에서 추천하는 것은 아니지만, 큰 코드 베이스를 가지고 있고, 나중까지 전체 프로젝트 오류를 기꺼이 연기하겠다면 (예를 들어, `tsconfig.fullbuild.json`이나 CI를 통한 전용 빌드) 흥미로울 것입니다.

더 자세한 내용은 [the original pull request](https://github.com/microsoft/TypeScript/pull/35711)에서 보실 수 있습니다.
