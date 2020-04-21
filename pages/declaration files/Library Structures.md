# 개요 (Overview)

일반적으로, 선언 파일을 *구조화*하는 방법은 라이브러리를 사용하는 방법에 따라 다릅니다.
JavaScript에서 사용할 라이브러리를 제공하는 방법은 여러 가지가 있고, 이에 맞추어 선언 파일을 작성해야 합니다.
이 가이드는 일반적인 라이브러리 패턴을 식별하는 방법과, 그 패턴에 상응하는 선언 파일을 작성하는 방법에 대해 다룹니다.

주요 라이브러리 각각의 구조화 패턴 유형은 [템플릿](./Templates.md) 섹션에 있습니다.
이 템플릿으로 시작하면 더 빠르게 진행할 수 있습니다.

# 라이브러리 종류 식별하기 (Identifying Kinds of Libraries)

첫 번째로, TypeScript 선언 파일이 나타낼 수 있는 라이브러리 종류를 다뤄보겠습니다.
각 종류의 라이브러리를 *사용하는* 방법과, *작성하는* 방법, 그리고 실제 라이브러리들의 예제를 볼 것입니다.

라이브러리의 구조를 식별하는 것은 선언 파일을 작성하는 첫 단계입니다.
*사용법*과 *코드*를 기반으로 구조를 식별하는 방법에 대한 힌트를 제공합니다.
라이브러리의 문서와 구성에 따라서, 어떤 건 다른 것보다 훨씬 쉬울 수 있습니다.
본인에게 더 편한 것을 사용할 것을 추천합니다.

## 전역 라이브러리 (Global Libraries)

*전역* 라이브러리는 전역 스코프 (즉, `import` 형식을 사용하지 않음)에서 접근 가능한 라이브러리입니다.
많은 라이브러리는 사용을 위해 간단히 하나 이상의 전역 변수를 노출합니다.
예를 들어, [jQuery](https://jquery.com/)를 사용한다면, `$` 변수를 참조해서 사용할 수 있습니다:

```ts
$(() => { console.log('hello!'); } );
```

HTML 스크립트 태그로 라이브러리를 사용하는 방법은 라이브러리 문서에서 지침을 볼 수 있습니다:

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

오늘날, 대부분의 전역에서 접근 가능한 유명 라이브러리들은 실제로 UMD 라이브러리로 작성되어 있습니다 (아래를 참조).
UMD 라이브러리 문서는 전역 라이브러리 문서와 구별하기 어렵습니다.
전역 선언 파일을 작성하기 전에, 실제로는 UMD가 아닌지 확인하십시오.

### 코드에서 전역 라이브러리 식별하기 (Identifying a Global Library from Code)

전역 라이브러리 코드는 대게 엄청 간단합니다.
전역 "Hello, world" 라이브러리는 다음과 같습니다:

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

전역 라이브러리의 코드를 보면, 보통 다음을 볼 수 있습니다:

* 최상위 레벨 `var`문 이나 `function`선언
* 하나 이상의 `window.someName` 할당
* DOM 인터페이스 `document` 혹은 `window`가 존재한다고 가정

다음은 볼 수 *없습니다*:

* `require` 이나 `define` 같은 모듈 로더 검사 혹은 사용
* `var fs = require("fs");` 형태의 CommonJS/Node.js-스타일 import
* `define(...)` 호출
* 라이브러리를 `require` 혹은 import하는 방법에 대해 설명하는 문서

### 전역 라이브러리 예제 (Examples of Global Libraries)

전역 라이브러리를 UMD 라이브러리로 바꾸는게 쉽기 때문에, 전역 스타일로 작성한 인기 라이브러리는 거의 없습니다.
하지만, 크기가 작고 DOM이 필요한 (혹은 의존성이 *없는*) 라이브러리는 여전히 전역입니다.

### 전역 라이브러리 템플릿 (Global Library Template)

템플릿 파일 [`global.d.ts`](./templates/global.d.ts.md)은 예제 라이브러리 `myLib`를 정의합니다.
["이름 충돌 방지" 각주](#preventing-name-conflicts)를 반드시 읽어보세요.

## 모듈형 라이브러리 (Modular Libraries)

어떤 라이브러리는 모듈 로더 환경에서만 동작합니다.
예를 들어, `express`는 Node.js에서만 동작하고 반드시 CommonJS의 `require` 함수로 로드되어야 합니다.

ECMAScript 2015 (ES2015, ECMAScript 6, ES6로도 잘 알려진), CommonJS와 RequireJS는 *모듈*을 *importing*하는 비슷한 개념을 가지고 있습니다.
JavaScript의 CommonJS (Node.js)를 예를 들면, 다음과 같이 작성합니다

```js
var fs = require("fs");
```

TypeScript나 ES6에서는, `import` 키워드가 같은 목적을 제공합니다:

```ts
import fs = require("fs");
```

일반적으로 모듈형 라이브러리의 문서에서 다음 코드들 중 하나를 볼 수 있습니다:

```js
var someLib = require('someLib');
```

혹은

```js
define(..., ['someLib'], function(someLib) {

});
```

전역 모듈과 마찬가지로 UMD 모듈의 문서에서도 이 예제들을 볼 수 있으므로, 코드나 문서를 반드시 확인하세요.

### 코드에서 모듈 라이브러리 식별하기 (Identifying a Module Library from Code)

모듈형 라이브러리는 일반적으로 다음 중 몇 가지를 반드시 가지고 있습니다:

* `require` 혹은 `define`에 대한 무조건적인 호출
* `import * as a from 'b';` 혹은 `export c;` 같은 선언문
* `exports` 혹은 `module.exports`에 대한 할당

다음은 거의 갖지 않습니다:

* `window` 혹은 `global` 프로퍼티 할당

### 모듈형 라이브러리 예제 (Examples of Modular Libraries)

많은 유명한 Node.js 라이브러리들은 [`express`](http://expressjs.com/), [`gulp`](http://gulpjs.com/), [`request`](https://github.com/request/request)와 같은 모듈군 안에 있습니다.

## *UMD*

*UMD* 모듈은 모듈로 (import를 통해) 사용할 수 있고 혹은 전역으로도 (모듈 로더 없는 환경에서 실행될 때) 사용할 수 있습니다.
[Moment.js](http://momentjs.com/) 같은 많은 유명한 라이브러리들은 이 방법으로 작성되었습니다.
예를 들어, Node.js나 RequireJS를 사용하면, 다음과 같이 작성합니다:

```ts
import moment = require("moment");
console.log(moment.format());
```

반면 바닐라 브라우저 환경에서는 다음과 같이 쓸 수 있습니다:

```js
console.log(moment.format());
```

### UMD 라이브러리 식별하기 (Identifying a UMD library)

[UMD modules](https://github.com/umdjs/umd)은 모듈 로더 환경 유무를 검사합니다.
이는 다음과 같이 보이는 찾기 쉬운 패턴입니다:

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

만약 라이브러리 코드, 특히 파일 상단에서 `typeof define`, `typeof window` 혹은 `typeof module`에 대한 테스트를 보았다면, 거의 대부분 UMD 라이브러리입니다.

UMD 라이브러리 문서에서는 `require`를 보여주는 "Node.js에서 사용하기" 예제를 종종 설명하고
  "브라우저에서 사용하기" 예제에서는 `<script>` 태그를 사용해서 스크립트를 로드하는 방법을 보여줍니다.

### UMD 라이브러리 예제 (Examples of UMD libraries)

유명한 라이브러리 대부분은 UMD 패키지로 사용할 수 있습니다.
예로는 [jQuery](https://jquery.com/), [Moment.js](http://momentjs.com/), [loadash](https://loadash.com/) 등 더 많이 있습니다.

### 템플릿 (Template)

모듈은 세 가지 템플릿을 사용할 수 있습니다,
  [`module.d.ts`](./templates/module.d.ts.md), [`module-class.d.ts`](./templates/module-class.d.ts.md) 그리고 [`module-function.d.ts`](./templates/module-function.d.ts.md).

만약 모듈을 함수처럼 *호출*할 수 있으면 [`module-function.d.ts`](./templates/module-function.d.ts.md)을 사용하세요:

```js
var x = require("foo");
// 참고: 함수로 'x'를 호출
var y = x(42);
```

[각주 "ES6가 모듈 호출 시그니처에 미치는 영향"](#the-impact-of-es6-on-module-plugins)를 반드시 읽어보세요

만약 모듈이 `new`를 사용하여 *생성*할 수 있다면 [`module-class.d.ts`](./templates/module-class.d.ts.md)를 사용하세요:

```js
var x = require("bar");
// 참고: 'new' 연산자를 import된 변수에 사용
var y = new x("hello");
```

이런 모듈에도 같은 [각주](#the-impact-of-es6-on-module-plugins)가 적용됩니다.

만약 모듈이 위 사항에 해당되지 않다면, [`module.d.ts`](./templates/module.d.ts.md) 파일을 사용하세요.

## *모듈 플러그인* 혹은 *UMD 플러그인* (*Module Plugin* or *UMD Plugin*)

*모듈 플러그인*은 다른 모듈 (UMD나 모듈)의 형태를 변경합니다.
예를 들어, Moment.js에서, `moment-range`는 `moment` 객체에 새로운 `range` 메서드를 추가합니다.

선언 파일 작성을 위해, 모듈이 일반 모듈로 변경되든 UMD 모듈로 변경되든 같은 코드를 작성합니다.

### 템플릿 (Template)

[`module-plugin.d.ts`](./templates/module-plugin.d.ts.md) 템플릿을 사용하세요.

## *전역 플러그인* (*Global Plugin*)

*전역 플러그인*은 전역의 형태를 변경하는 전역 코드입니다.
*전역-수정 모듈*과 마찬가지로 런타임에 충돌 가능성을 높입니다.

예를 들어, 몇몇 라이브러리는 `Array.prototype`이나 `String.prototype`에 새로운 함수를 추가합니다.

### 전역 플러그인 식별하기 (Identifying global plugins)

전역 플러그인은 일반적으로 문서를 보고 쉽게 식별할 수 있습니다.

다음과 같은 예제를 볼 수 있습니다:

```js
var x = "hello, world";
// 내장 타입에 새로운 메서드 생성
console.log(x.startsWithHello());

var y = [1, 2, 3];
// 내장 타입에 새로운 메서드 생성
console.log(y.reverseAndSort());
```

### 템플릿 (Template)

[`global-plugin.d.ts`](./templates/global-plugin.d.ts.md) 템플릿을 사용하세요.

## *전역-수정 모듈* (*Global-modifying Modules*)

*전역-수정 모듈*은 import 될 때, 전역 스코프에 존재하는 값을 변경합니다.
예를 들어, import 될 때 `String.prototype`에 새로운 멤버를 추가하는 라이브러리가 있을 수 있습니다.
이 패턴은 런타임 충돌의 가능성 때문에 위험하지만,
  여전히 선언 파일을 작성할 수 있습니다.

### 전역-수정 모듈 식별하기 (Identifying global-modifying modules)

전역-수정 모듈은 일반적으로 문서를 보고 쉽게 식별할 수 있습니다.
일반적으로, 전역 플러그인과 비슷하지만, 효과를 활성화하기 위해 `require` 호출이 필요합니다.

다음과 같은 문서를 볼 수 있습니다:

```js
// 반환값을 사용하지 않는 'require' 호출
var unused = require("magic-string-time");
/* 혹은 */
require("magic-string-time");

var x = "hello, world";
// 내장 타입에 새로운 메서드 생성
console.log(x.startsWithHello());

var y = [1, 2, 3];
// 내장 타입에 새로운 메서드 생성
console.log(y.reverseAndSort());
```

### 템플릿 (Template)

[`global-modifying-module.d.ts`](./templates/global-modifying-module.d.ts.md) 템플릿을 사용하세요.

# 의존성 사용하기 (Consuming Dependencies)

라이브러리가 몇 가지 의존성을 가지고 있을 수 있습니다.
이번 섹션에서는 선언 파일 안에 의존성을 import 하는 방법을 설명합니다.

## 전역 라이브러리 의존성 (Dependencies on Global Libraries)

만약 라이브러리가 전역 라이브러리에 의존성이 있다면, `/// <reference types="..." />` 디렉티브를 사용하세요:

```ts
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

## 모듈 의존성 (Dependencies on Modules)

만약 라이브러리가 모듈에 의존성이 있다면, `import`문을 사용하세요:

```ts
import * as moment from "moment";

function getThing(): moment;
```

## UMD 라이브러리 의존성 (Dependencies on UMD libraries)

### 전역 라이브러리에서 (From a Global Library)

만약 전역 라이브러리가 UMD 모듈에 의존성이 있다면, `/// <reference types` 디렉티브를 사용하세요:

```ts
/// <reference types="moment" />

function getThing(): moment;
```

### 모듈이나 UMD 라이브러리에서 (From a Module or UMD Library)

만약 모듈이나 UMD 라이브러리가 UMD 라이브러리에 의존성이 있다면, `import`문을 사용하세요:

```ts
import * as someLib from 'someLib';
```

UMD 라이브러리에 대한 의존성 선언에 `/// <reference` 디렉티브를 사용하지 *마세요*!

# 각주 (Footnotes)

## 이름 충돌 방지하기 (Preventing Name Conflicts)

전역 선언 파일을 작성할 때, 전역 스코프에 많은 타입을 정의할 수 있다는 점을 유의하세요.
많은 선언 파일이 프로젝트 내에 있을 때, 해결할 수 없는 이름 충돌이 발생할 수 있으므로 이를 사용하지 않는 것이 좋습니다.

따라야 하는 간단한 규칙은 라이브러리가 정의한 전역 변수가 무엇이든 타입을 *네임스페이스*로 정의하는 것입니다.
예를 들어, 만약 라이브러리가 전역 값 'cats'를 정의하면, 다음과 같이 작성하고

```ts
declare namespace cats {
    interface KittySettings { }
}
```

이렇게 하지는 *마세요*

```ts
// 최상위-레벨에서
interface CatsKittySettings { }
```

이 가이드는 선언 파일 사용자가 중단하지 않고 라이브러리를 UMD로 전환할 수 있도록 합니다.

## ES6가 모듈 플러그인에 미치는 영향 (The Impact of ES6 on Module Plugins)

어떤 플러그인은 기존 모듈에 최상위 export를 추가하거나 수정합니다.
CommonJS와 다른 로더에서는 허용되지만, ES6 모듈은 불변하다고 간주되기에 이 패턴은 불가능합니다.
왜냐하면 TypeScript는 로더에 구애받지 않기에, 이 정책이 컴파일-시간에 적용되지 않지만, ES6 모듈 로더로 전환하려는 개발자는 알고 있어야 합니다.

## 모듈 호출 시그니처에 ES6가 미치는 영향 (The Impact of ES6 on Module Call Signatures)

Express와 같은 많은 유명한 라이브러리들은 import 될 때 호출 가능한 함수를 노출합니다.
예를 들어, 일반적인 Express 사용법은 다음과 같습니다:

```ts
import exp = require("express");
var app = exp();
```

ES6 모듈 로더에서, 최상위-레벨 객체(여기에서는 `exp`로 import)는 프로퍼티만 가질 수 있습니다;
  최상위-레벨 모듈 객체는 *절대* 호출할 수 없습니다.
가장 일반적인 해결책은 호출 가능/생성 가능 객체를 `default` export로 정의하는 것입니다;
  어떤 모듈 로더 shims은 자동으로 이 상황을 감지하고 최상위-레벨 객체를 `default` export로 바꿉니다.

## 라이브러리 파일 레이아웃 (Library file layout)

선언 파일의 레이아웃은 라이브러리의 레이아웃을 반영해야 합니다.

라이브러리는 다음과 같이 여러 모듈로 구성됩니다

```Text
myLib
  +---- index.js
  +---- foo.js
  +---- bar
         +---- index.js
         +---- baz.js
```

이는 다음과 같이 import 할 수 있습니다

```js
var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");
```

그러므로 선언 파일은 다음과 같아야 합니다

```Text
@types/myLib
  +---- index.d.ts
  +---- foo.d.ts
  +---- bar
         +---- index.d.ts
         +---- baz.d.ts
```
