# Overview

대체로 선언파일을 *구성하는* 방법은 라이브러리가 어떻게 사용되냐에 따라 달라집니다. JavaScript에서 사용할 수 있는 라이브러리를 제공하는 방법은 여러가지가 있으며, 그에 맞게 선언 파일을 작성해야합니다. 이 가이드에서는 공통 라이브러리 패턴을 식별하는 방법과 해당 패턴에 해당하는 선언파일을 작성하는 법을 다룹니다.

각 유형의 주요 라이브러리 구조화 패턴은 [Templates](./Templates.md) 섹션에 해당 파일이 있습니다.
이러한 템플릿을 통해 더빨리 시작할 수 있습니다.

# 라이브러리 종류 식별 (Identifying Kinds of Libraries)

먼저 TypeScript 선언 파일이 나타낼 수 있는 라이브러리의 종류를 검토합니다.
우리는 각 종류의 라이브러리가 어떻게 *사용되고*, 어떻게 *쓰여지는지를* 간략히 보여주고, 현실 세계의 예시 라이브러리들을 나열할것입니다.

라이브러리의 구조를 식별하는 것은 선언 파일을 작성하는 첫 번째 단계입니다.
*사용법* 과 *코드* 를 기반으로 구조를 식별하는 방법에 대해 힌트를 드리겠습니다.
라이브러리의 문서 및 구성에 따라, one might be easier than the other.
어느 것이든 편한 것을 사용하는 것이 좋습니다.

## 전역 라이브러리 (Global Libraries)

*전역* 라이브러리는 전역 범위에서 액세스할 수 있는 라이브러리입니다(즉, 어떤 형태의 `import`도 사용하지 않음).
많은 라이브러리는 간단히 하나 이상의 전역 변수를 노출하여 사용할 수 있습니다.
예를 들어, [jQuery](https://jquery.com/)를 사용 중인 경우, `$` 변수는 다음을 참조하는 것으로 사용할 수 있습니다:

```ts
$(() => { console.log('hello!'); } );
```

일반적으로 전역 라이브러리의 문서에서 HTML 스크립트 태그 라이브러리 사용 방법에 대한 가이드를 볼 수 있습니다.

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

오늘날 세계적으로 가장 많이 엑세스 가능한 라이브러리는 실제로 UMD 라이브러리로 작성됩니다. (아래 참조).
UMD 라이브러리 문서는 전역 라이브러리 문서와 구분하기 어렵습니다.
전역 선언 파일을 작성하기 전에 라이브러리가 실제로 UMD가 아니라는 것을 확실히 해야합니다.


### 코드에서 전역 라이브러리 식별 (Identifying a Global Library from Code)

전역 라이브러리 코드는 일반적으로 매우 간단합니다.
전역 라이브러리 "Hello, world"는 다음과 같습니다:

```js
function createGreeting(s) {
    return "Hello, " + s;
}
```

혹은 다음과 같습니다:

```js
window.createGreeting = function(s) {
    return "Hello, " + s;
}
```

전역 라이브러리의 코드를 보면, 일반적으로 다음과 같은 정보가 표시됩니다:

* Top-level `var` statements or `function` declarations
* One or more assignments to `window.someName`
* Assumptions that DOM primitives like `document` or `window` exist

다음과 같은 정보는 표시되지 *않습니다.*

* Checks for, or usage of, module loaders like `require` or `define`
* CommonJS/Node.js-style imports of the form `var fs = require("fs");`
* Calls to `define(...)`
* Documentation describing how to `require` or import the library

### 전역 라이브러리의 예시 (Examples of Global Libraries)

전역 라이브러리를 UMD 라이브러리로 변환 하는 것은 일반적으로 간단하기 때문에, 아주 소수의 인기있는 라이브러리들은 여전히 전역 스타일로 작성됩니다.
그러나 크기가 작고 DOM이 필요한 라이브러리(혹은 의존성이 *없는* 라이브러리)는 여전히 전역일수 있습니다.

### 전역 라이브러리 템플릿 (Global Library Template)

템플릿 파일 [`global.d.ts`](./templates/global.d.ts.md)은 예제 라이브러리 `myLib` 를 정의합니다.
["Preventing Name Conflicts" footnote](#preventing-name-conflicts)를 반드시 읽어야 합니다.

## 모듈러 라이브러리 (Modular Libraries)

일부 라이브러리는 모듈 로더 환경에서만 동작합니다.
예를 들어, `express`는 Node.js에서만 동작하고 반드시 CommonJs `requrie`함수를 사용하여 로드 해야합니다..

ECMAScript 2015 (ES2015, ECMAScript 6 및 ES6), CommonJS, 그리고 RequireJS는 *모듈* 을 *가져오는* 개념과 유사합니다.
예를 들어, JavaScript CommonJS (Node.js)에서는 다음과 같이 씁니다.

```ts
var fs = require("fs");
```

TypeScript나 ES6 에서는 , `import` 키워드는 같은 목적을 가지고 있습니다.

```ts
import fs = require("fs");
```

일반적으로 모듈형 라이브러리는 문서에서 다음 중 하나를 포함합니다.

```js
var someLib = require('someLib');
```

or

```ts
define(..., ['someLib'], function(someLib) {

});
```

전역 모듈과 마찬가지로 UMD 모듈의 문서에서 이러한 예를 볼 수 있으므로 코드나 문서를 꼭 확인해야합니다.

### 코드에서 모듈 라이브러리를 식별 (Identifying a Module Library from Code)

모듈러 라이브러리는 일반적으로 아래중 적어도 하나를 가지고 있습니다.

* Unconditional calls to `require` or `define`
* Declarations like `import * as a from 'b';` or `export c;`
* Assignments to `exports` or `module.exports`

다음과 같은 경우는 거의 없습니다:


* Assignments to properties of `window` or `global`

### 모듈러 라이브러리의 예시 (Examples of Modular Libraries)


[`express`](http://expressjs.com/), [`gulp`](http://gulpjs.com/) 혹은 [`request`](https://github.com/request/request)와 같은 많은 인기 있는 Node.js 라이브러리가 모듈 제품군에 있습니다.

## *UMD*

*UMD* 모듈은 (import를 통해) 모듈로 사용하거나(모듈 로더가 없는 환경에서 실행되는 경우) 전역으로 사용할 수 있는 모듈입니다.
[Moment.js](http://momentjs.com/)와 같은 많은 인기있는 라이브러리가 이러한 방법으로 쓰여져 있습니다.
예를 들어, Node.js 또는 RequireJS를 사용하면 다음과 같이 작성해야합니다:


```ts
import moment = require("moment");
console.log(moment.format());
```

반면에 바닐라 브라우저 환경에서는 다음과 같이 작성합니다:

```ts
console.log(moment.format());
```

### UMD 라이브러리 식별 (Identifying a UMD library)

[UMD modules](https://github.com/umdjs/umd)는 모듈로더 환경이 있는지 확인합니다.
이것은 다음과 같이 나타내기 쉬운 패턴입니다:

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```

특히 파일 맨위에 있는 라이브러리의 코드에서 `typeof define`, `typeof window`, 혹은 `typeof module`를 위한 테스트가 있다면 거의 항상 UMD 라이브러리 입니다.

UMD 라이브러리에 대한 문서에는 종종 `require`를 보여주는 "Node.js에서 사용" 예제와 스크립트를 로드하기 위한 `<script>` 테그를 사용하는 "브라우저에서 사용" 예제를 보여줍니다.

### UMD 라이브러리의 예시 (Examples of UMD libraries)

대부분의 인기있는 라이브러리는 현재 UMD 라이브러리를 지원하고있습니다.
예시로는 [jQuery](https://jquery.com/), [Moment.js](http://momentjs.com/), [lodash](https://lodash.com/) 등이 포함됩니다.

### 템플릿 (Template)

모듈에는 세 가지 템플릿 [`module.d.ts`](./templates/module.d.ts.md), [`module-class.d.ts`](./templates/module-class.d.ts.md), [`module-function.d.ts`](./templates/module-function.d.ts.md) 이 있습니다.

모듈을 함수처럼 호출할 수 있으면 [`module-function.d.ts`](./templates/module-function.d.ts.md)를 사용하세요.

```ts
var x = require("foo");
// Note: calling 'x' as a function
var y = x(42);
```

반드시 [footnote "The Impact of ES6 on Module Call Signatures"](#the-impact-of-es6-on-module-plugins)를 읽어보세요.

모듈이 `new`를 사용해 *생성*될 수 있으면 [`module-class.d.ts`](./templates/module-class.d.ts.md)를 사용하세요:

```ts
var x = require("bar");
// Note: using 'new' operator on the imported variable
var y = new x("hello");
```

동일한 [footnote](#the-impact-of-es6-on-module-plugins)가 이러한 모듈에 적용됩니다.

모듈을 호출하거나 생성(new)할 수 없는 경우 [`module.d.ts`](./templates/module.d.ts.md)를 사용하세요.

## *모듈 플러그인* or *UMD 플러그인* (*Module Plugin* or *UMD Plugin*)

*모듈 플러그인*은 다른 다른 모듈(UMD 또은 모듈)의 형태를 변경합니다.
예를들어 Moment.js에서, `moment-range`는 `moment` 객체에 새로운 `range`메서드를 추가합니다.

For the purposes of writing a declaration file, you'll write the same code whether the module being changed is a plain module or UMD module.

### 템플릿 (Template)

[`module-plugin.d.ts`](./templates/module-plugin.d.ts.md) 템플릿을 사용합니다.

## *전역 플러그인* (*Global Plugin*)

*전역 플러그인*은 일부 전역 형태를 변경하는 전역코드 입니다.
*global-modifying modules*과 마찬가지로 런타임 충돌 가능성도 제기됩니다.

예를 들어 일부 라이브러리는 새로운 함수를 `Array.prototype`나 `String.prototype`에 추가합니다.

### 전역 플러그인 식별 (Identifying global plugins)

전역 플로그인은 일반적으로 문서에서 식별하기 쉽습니다.

다음과 같은 예를 볼 수 있습니다.

```ts
var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());

var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
```

### 템플릿 (Template)

[`global-plugin.d.ts`](./templates/global-plugin.d.ts.md) 템플릿을 사용하세요.

## *Global-modifying Modules*

*global-modifying module*은 import 될때 전역 범위안의 기존 값을 변경합니다.
예를 들어, import될때 `String.prototype`에 새로운 맴버를 추가하는 라이브러리가 존재할 수 있습니다.
이 패턴은 런타인 충돌 가능성 때문에 다소 위험하지만, 그래도 여전히 선언 파일을 쓸 수 있습니다.

### global-modifying modules 식별하기 (Identifying global-modifying modules)

Global-modifying modules은 일반적으로 문서에서 쉽게 식별될 수 있습니다.
일반적으로 전역 플러그인과 비슷하지만, 효과를 활성화하려면 `require`를 호출해야 합니다.

다음과 같은 문서를 볼 수 있습니다:

```ts
// 'require' call that doesn't use its return value
var unused = require("magic-string-time");
/* or */
require("magic-string-time");

var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());

var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
```

### 템플릿 (Template)

[`global-modifying-module.d.ts`](./templates/global-modifying-module.d.ts.md) 템플릿을 사용하세요.

# Consuming Dependencies

여러 종류의 의존성이 있을 수 있습니다.

## 전역 라이브러리에 대한 의존성 (Dependencies on Global Libraries)

만약 당신의 라이브러리가 전역 라이브러에 의존한다면, `/// <reference types="..." />` 지시자를 사용하세요:

```ts
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

## 모듈에 대한 의존성 (Dependencies on Modules)

만약 당신의 라이브러리가 모듈에 의존한다면 `import`를 사용하세요:

```ts
import * as moment from "moment";

function getThing(): moment;
```

## UMD 라이브러리에 대한 의존성 (Dependencies on UMD libraries)

### From a Global Library

만약 당신의 전역 라이브러리가 UMD 모듈에 의존한다면, `/// <reference types` 지시자를 사용하세요:

```ts
/// <reference types="moment" />

function getThing(): moment;
```

### From a Module or UMD Library

만약 당신의 모듈이나 UMD 라이브러리가 UMD 라이브러리에 의존한다면, `import`를 사용하세요:

```ts
import * as someLib from 'someLib';
```

Do *not* use a `/// <reference` directive to declare a dependency to a UMD library!

UMD라이브러리에 대한 의존성을 선언하기 위해 `/// <reference` 지시자를 사용하지 *마세요*

# 각주 (Footnotes)

## 이름 충돌 방지 (Preventing Name Conflicts)

전역 선언파일을 작성할때 전역 범위에서 여러 타입을 정의할 수 있다는 것을 알아두세요.
프로젝트에 많은 선언파일이 있을때 해결할 수 없는 이름 충돌이 발생할 수 있으므로 이 방법을 사용하지 않는 것이 좋습니다.

따라야하는 간단한 규칙은 라이브러리가 지정한 전역 변수로 네임스페이스가 지정된 타입만 선언하는 것입니다.
예를 들어, 만약 라이브러리가 전역 값 'cats'를 정의하면 이렇게 작성해야합니다.

```ts
declare namespace cats {
    interface KittySettings { }
}
```

그러나 이렇게는 작성하지*마세요*

```ts
// at top-level
interface CatsKittySettings { }
```

이 가이드는 또한 선언파일 사용자를 중단하지 않고 라이브러리를 UMD로 전환 할 수 있도록 합니다.

## 모듈 플로그인에 대한 ES6의 영향 (The Impact of ES6 on Module Plugins)

일부 플로그인은 기존 모듈에서 최상위 export를 추가하거나 수정합니다.
이것은 CommonJS에서는 합법이지만 ES6 모듈은 불변(immutable)으로 간주되며 이 패턴은 불가능합니다.
TypeScript는 로더에 구애받지 않기 때문에 이 정책을 컴파일 타임으로 적용할 수는 없지 ES6 모듈 로더로 전환하려는 개발자는 이를 알고 있어야 합니다.

## ES6가 모듈 호출 서명에 미치는 영향(The Impact of ES6 on Module Call Signatures)

Express와 같이 인기 있는 많은 라이브러리는 import될때 호출가능한 함수로 자신을 노출시킵니다.
예를 들어, 일반적인 Express 사용법은 다음과 같습니다.

```ts
import exp = require("express");
var app = exp();
```

ES6 모듈 로더에서 최상위 객체 (here imported as `exp`)는 속성만 가질 수 있습니다;
  최상위 모듈 객체는 *절대* 호출할 수 없습니다.
여기서 가장 일반적인 해결책은 호출/생성(new) 가능한 객체에 대해 `default` export를 정의하는 것입니다;
  일부 모듈 로더 shims는 이 상황을 자동으로 감지하여 최상위 객체를 `default` export로 대체합니다.
