TypeScript는 공백 상태가 아닙니다.
JavaScript 생태계를 바탕으로 구축되었으며, 오늘날 많은 JavaScript가 존재합니다.
JavaScript 코드 베이스를 TypeScript로 변환하는 것은 다소 지루하기는 하지만 어렵지 않습니다.
이 튜토리얼에서 어떻게 시작하는지 살펴보겠습니다.
TypeScript 코드를 작성하기 위해 핸드북을 충분히 읽었다고 가정하고 설명하겠습니다.

React 프로젝트를 변환하고자 한다면, [React 변환 가이드](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide)를 먼저 읽어보는 것을 추천합니다.

# 디렉토리 설정하기 (Setting up your Directories)

일반 JavaScript로 작성하는 경우, `src`, `lib` 또는 `dist` 디렉터리에 있는 `.js` 파일이
JavaScript를 직접 실행한 다음, 원하는 대로 실행했을 가능성이 높습니다.

이 경우, 작성한 파일은 TypeScript에 입력으로 사용되고, 그로 인한 출력을 실행하게 됩니다.
JS에서 TS로의 전환하는 동안, TypeScript가 입력 파일을 겹쳐 쓰는 것을 방지하기 위해 입력 파일을 분리할 필요가 있습니다.
만약 출력 파일이 특정 디렉터리에 위치해야 하는 경우, 그 위치가 출력 디렉터리가 되어야 합니다.

또한 JavaScript에서 번들링을 하거나 바벨 같은 트랜스파일러를 사용하는 것처럼, 중간 단계를 실행할 수 있습니다.
이러한 경우, 이렇게 설정된 폴더 구조를 가지고 있을 수 있습니다.

이 시점부터, 디렉터리가 다음과 같이 설정되었다고 가정하겠습니다:

```text
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
```

만약 `src` 디렉터리 바깥에 `tests` 폴더가 존재한다면, `src`와 `tests` 내부에 각각 `tsconfig.json`이 존재할 수 있습니다.

# 설정 파일 작성하기 (Writing a Configuration File)

TypeScript는 어떤 파일을 포함하고, 어떤 종류의 체크가 수행되어야 하는지와 같은 프로젝트 옵션을 관리하기 위해, `tsconfig.json`이라 불리는 파일을 사용합니다.
프로젝트의 뼈대를 구성해 보겠습니다:

```json
{
    "compilerOptions": {
        "outDir": "./built",
        "allowJs": true,
        "target": "es5"
    },
    "include": [
        "./src/**/*"
    ]
}
```

TypeScript에 대한 몇 가지 사항을 명시하고 있습니다:

1. `src` 디렉터리에서 해석되는 모든 파일을 읽습니다 (`include` 포함).
2. JavaScript 파일을 입력으로 허용합니다 (`allowJs` 포함).
3. `built` 내부의 모든 출력 파일을 내보냅니다 (`outDir` 포함).
4. 최신 JavaScript 구성을 ECMAScript 5와 같은 이전 버전으로 변환합니다(`target` 사용).

이 시점에서, 프로젝트의 루트에서 `tsc`를 작동시키려면, 반드시 `built` 디렉터리에 있는 출력 파일이 표시되어야 합니다.
`built` 안의 레이아웃 파일은 `src`의 레이아웃과 동일해야 합니다.
이제 프로젝트가 TypeScript로 작동할 것입니다.

## 초기 혜택 (Early Benefits)

TypeScript가 프로젝트를 이해하는 것으로부터 몇 가지 큰 혜택을 받을 수 있습니다.
[VS Code](https://code.visualstudio.com) 나 [Visual Studio](https://visualstudio.com) 에디터를 열어보면, 자동완성과 같은 툴링 지원을 받는 것을 볼 수 있습니다.
또한 다음 옵션이 들어 있는 특정 버그도 잡을 수 있습니다:

* 함수의 마지막에 return을 빠뜨리는 것을 방지하는 `noImplicitReturns`
* switch 블록의 `case` 사이에 `break`를 빠뜨리는 것을 절대 잊지 않기 위한 `noFallthroughCasesInSwitch`  

또한 `allowUnreachableCode` 와 `allowUnusedLabels` 각각을 사용해, TypeScript는 도달할 수 없는 코드와 라벨에 대한 경고를 할 것입니다.

# 빌드 툴과 통합하기 (Integrating with Build Tools)

파이프라인에 더 많은 제작 단계가 있을 수 있습니다.
각각의 파일에 무언가를 연결할 수도 있습니다.
개별 빌드 도구는 다르지만, 빌드 도구의 핵심을 다루기 위해 최선을 다할 것입니다.

## Gulp

만약 Gulp를 어떤 방식으로 사용하고 있다면, TypeScript와 [Gulp를 사용하는 방법](./Gulp.md)과 Browserify, Babelify, Uglify 같은 일반적인 빌드 툴과 통합하는 방법에 대한 튜토리얼이 있습니다.
그곳에서 더 많은 내용을 볼 수 있습니다.

## Webpack

Webpack 통합은 꽤 간단합니다.
쉬운 디버깅을 위해 `source-map-loader`와 결합한 TypeScript 로더, `awesome-typescript-loader`를 사용할 수 있습니다.
단순히 실행하고

```shell
npm install awesome-typescript-loader source-map-loader
```

다음 옵션에서 `webpack.config.js` 파일과 병합하세요:

```js
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js",
    },

    // webpack의 출력을 디버깅하기 위해 소스맵을 활성화 합니다.
    devtool: "source-map",

    resolve: {
        // 해석 가능한 확장자로 '.ts' 와 '.tsx' 를 추가합니다.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // '.ts' 나 '.tsx' 확장자로 끝나는 모든 파일은 'awesome-typescript-loader'에 의해 처리됩니다.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],

        preLoaders: [
            // 모든 출력 '.js' 파일은 'source-map-loader'에 의해 재처리된 소스맵을 갖습니다.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // 다른 옵션들...
};
```

awesome-typescript-loader는 다른 로더가 `.js` 파일을 처리하기 전에 실행되어야 한다는 점을 유의하세요.

웹 팩을 위한 또 다른 TypeScript 로더, [ts-loader](https://github.com/TypeStrong/ts-loader)도 같습니다.
[여기](https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader)에서 둘 사이의 차이점을 읽을 수 있습니다.

[리액트와 웹 팩 튜토리얼](./React%20&%20Webpack.md)에서 웹 팩 사용에 관한 예제를 볼 수 있습니다.

# TypeScript 파일로 이동하기 (Moving to TypeScript Files)

이제, TypeScript 파일을 사용해 시작할 준비가 되었을 것입니다.
첫 번째 단계는 `.js` 파일을 `.ts` 파일로 이름을 바꾸는 것입니다.
파일이 JSX를 사용한다면 이름을 `.tsx`로 변경하세요.

그 단계를 마치셨나요?
좋습니다!
JavaScript에서 TypeScript로 파일을 성공적으로 마이그레이션 했습니다!

당연히, 그것이 바로 느껴지지는 않을 것입니다.
TypeScript를 지원하는 에디터로 파일을 열어보면 (또는 `tsc --pretty`를 실행하면), 특정 줄에 빨간 구불구불한 선이 나타날 것입니다.
Microsoft Word 같은 에디터의 빨간 구불구불한 선처럼 생각하면 됩니다.
Word가 문서를 여전히 프린트할 수 있는 것처럼, TypeScript도 여전히 코드를 해석할 수 있습니다.

만약 그것이 너무 느슨해 보인다면, 더 엄격하게 행동할 수 있습니다.
예를 들어, 오류 발생 시 JavaScript를 TypeScript로 컴파일 *하지 않으려면*, `noEmitOnError` 옵션을 사용할 수 있습니다.
그러한 의미에서, TypeScript는 이상적인 엄격함을 갖고 있고, 원하는 만큼 그 기준을 높일 수 있습니다.

최대한 엄격한 세팅을 사용할 계획이라면, 지금 설정하는 것이 좋습니다([더 엄격한 체크하기](#더-엄격한-체크하기-getting-stricter-checks) 참조).
예를 들어, TypeScript가 명시적 설명 없이는 타입을 `any`로 추론하지 않기를 원한다면, 파일을 수정하기 전 `noImplicitAny`를 사용할 수 있습니다.
다소 부담스럽게 느껴질 수 있지만, 장기적으로 훨씬 이득입니다.

## 오류 제거하기 (Weeding out Errors)

언급했던 것처럼, 전환 후 에러 메시지가 뜨는 것은 예상하지 못했습니다.
중요한 점은 실제로 하나하나의 오류를 어떻게 처리할 것인지 결정하는 것입니다.
종종 이것이 합법적인 버그가 될 수 있지만, 때때로 TypeScript에게 무엇을 더 잘하려고 하는지 설명해야 합니다.

### 모듈로부터 import 하기 (Importing from Modules)

시작할 때 `Cannot find name 'require'.`, and `Cannot find name 'define'.` 같은 에러가 많이 나타날 수 있습니다.
이러한 경우, 모듈을 사용할 수 있습니다.
아래의 선언을 통해 TypeScript에게 이러한 기능이 존재한다고 납득시킬 수 있지만

```ts
// For Node/CommonJS
declare function require(path: string): any;
```

또는

```ts
// For RequireJS/AMD
declare function define(...args: any[]): any;
```

이러한 호출을 제거하고 import를 위한 TypeScript 구문을 사용하는 것이 더 낫습니다.

먼저, TypeScript `module` 플래그를 설정함으로써 모듈 시스템을 활성화해야 합니다.
유효한 옵션은 `commonjs`, `amd`, `system`, 그리고 `umd`입니다.

만약 다음과 같은 Node/CommonJS 코드를 갖고 있다면:

```js
var foo = require("foo");

foo.doStuff();
```

또는 다음의 RequireJS/AMD 코드를 갖고 있다면:

```js
define(["foo"], function(foo) {
    foo.doStuff();
})
```

그러면 다음의 TypeScript 코드를 작성해야 합니다:

```ts
import foo = require("foo");

foo.doStuff();
```

### 선언 파일 시작하기 (Getting Declaration Files)

만약 TypeScript import로 전환을 시작했다면, `Cannot find module 'foo'.` 같은 오류가 발생할 수 있습니다.
여기서 문제는 라이브러리를 설명하는 *선언 파일*이 없을 가능성이 높다는 것입니다.
다행히 해결 방법은 꽤 쉽습니다.
만약 TypeScript가 `lodash` 같은 패키지에 대해 경고를 발생시키면, 그냥 작성하면 됩니다

```shell
npm install -S @types/lodash
```

`commonjs` 말고 다른 모듈 옵션을 사용한다면, `moduleResolution`을 `node`로 설정해야 합니다.

그 후, lodash를 문제없이 import 할 수 있고, 정확하게 완성할 수 있습니다.

### 모듈 export 하기 (Exporting from Modules)

전형적으로, 모듈을 export 하는 것은`exports` 혹은 `module.exports` 같은 값을 프로퍼티에 추가하는 것을 포함합니다.
TypeScript는 최상위-레벨의 export 문을 허용합니다.
예를 들어, 함수를 이렇게 export 했다면:

```js
module.exports.feedPets = function(pets) {
    // ...
}
```

그것을 다음과 같이 작성할 수 있습니다:

```ts
export function feedPets(pets) {
    // ...
}
```

때로 exports 객체를 완전히 재작성할 수 있습니다.
아래 예제처럼 즉시 호출하기 위해 이러한 흔한 패턴을 사용합니다:

```js
var express = require("express");
var app = express();
```

전에는 이렇게 작성했을 수 있습니다:

```js
function foo() {
    // ...
}
module.exports = foo;
```

TypeScript에서, 이것을 `export =` 구문을 사용하여 모델링 할 수 있습니다.

```ts
function foo() {
    // ...
}
export = foo;
```

### 너무 많은/너무 적은 인수 (Too many/too few arguments)

때로 너무 많은/너무 적은 인수를 갖고 있는 함수를 호출할 때가 있습니다.
전형적인 버그이지만, 그러나 몇몇 경우, 어떠한 매개변수를 쓰는 대신 `arguments` 객체를 사용하는 함수를 선언할 수 있습니다:

```js
function myCoolFunction() {
    if (arguments.length == 2 && !Array.isArray(arguments[1])) {
        var f = arguments[0];
        var arr = arguments[1];
        // ...
    }
    // ...
}

myCoolFunction(function(x) { console.log(x) }, [1, 2, 3, 4]);
myCoolFunction(function(x) { console.log(x) }, 1, 2, 3, 4);
```

이 경우, TypeScript를 사용해서 호출자에게 함수 오버로드를 사용해 `myCoolFunction`이 호출되는 방법을 알려주어야 합니다.

```ts
function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void;
function myCoolFunction() {
    if (arguments.length == 2 && !Array.isArray(arguments[1])) {
        var f = arguments[0];
        var arr = arguments[1];
        // ...
    }
    // ...
}
```

`myCoolFunction`에 오버로드 시그니처 두 개를 추가했습니다.
첫 번째 검사는 `myCoolFunction`이 (`number`를 인수로 갖는) 함수와 `number` 배열을 가진다는 것을 명시합니다.
두 번째 검사는 `myCoolFunction`이 마찬가지로 함수를 가지고, 나머지 연산자(`...nums`)를 사용하여 그 외의 인수는 몇개의 인수든 `number`가 되어야 함을 명시합니다.

### 순차적으로 추가된 프로퍼티 (Sequentially Added Properties)

어떤 사람들은 객체를 생성하고 다음과 같이 동적으로 프로퍼티를 추가하는 것이 미관상 더 보기 좋다고 생각합니다:

```js
var options = {};
options.color = "red";
options.volume = 11;
```

TypeScript는 `options`을 프로퍼티가 없는 `{}`로 인식했기 때문에 `color`와 `volume`을 할당할 수 없다고 할 것입니다.
만약 선언을 리터럴 객체로 변경하면, 오류가 발생하지 않습니다:

```ts
let options = {
    color: "red",
    volume: 11
};
```

또한 `options`의 타입을 정의해야 하고 객체 리터럴에 대한 타입 단언을 추가해야 합니다.

```ts
interface Options { color: string; volume: number }

let options = {} as Options;
options.color = "red";
options.volume = 11;
```

대신, `options`이 단순히 타입`any`를 갖는다고 명시할 수 있는데, 이 방법은 가장 쉬운 방법이지만 가장 적은 장점을 가지고 있습니다.

### `any`, `Object`, and `{}`

`Object`는 대부분의 경우 가장 일반적인 타입이므로, 값이 어떤 프로퍼티도 가질 수 있다고 말하기 위해 `Object` 나 `{}`를 사용하고 싶을 수 있습니다.
하지만 `any`가 가장 유연한 타입이므로, 이러한 경우에는 **실제로 `any`가 가장 적절한 타입 입니다**.

예를 들어, `Object`를 타입으로 선언한 경우 `toLowerCase()`같은 메서드를 호출할 수 없습니다.
더 일반적으로 사용한다는 것은 타입으로 더 적은 일을 할 수 있다는 것을 의미하지만, `any`는 어떤 일이든 할 수 있게 하는 동시에 가장 일반적인 타입이라는 점에서 특별합니다.
그것은 `any`를 호출하고, 구성하고, 프로퍼티에 접근하는 등의 일을 할 수 있다는 것을 의미합니다.
그러나 `any`를 사용하면 TypeScript가 제공하는 대부분의 타입 검사와 에디터 지원을 받을 수 없다는 것을 명심하세요.

만약 `Object`와 `{}`로 결정이 내려지면, `{}`를 선택해야 합니다.
이 둘은 거의 같지만, 특정 난해한 상황에서 기술적으로 `{}`이 `Object`보다 더 일반적인 타입입니다.

## 더 엄격한 체크하기 (Getting Stricter Checks)

TypeScript는 프로그램에 대한 안정성과 분석을 제공하는 특정한 검사를 갖고 있습니다.
TypeScript로 코드베이스를 시작하면, 향상된 안전성을 위한 검사를 활성화할 수 있습니다.

### 암시적인 `any`는 피하기 (No Implicit `any`)

어떤 타입이어야 하는지 TypeScript가 파악할 수 없는 경우가 있습니다.
최대한 유연하게 대응하기 위해, 그 자리에 `any`를 사용하기로 결정할 것입니다.
이것은 마이그레이션에는 좋지만, `any`를 사용한다는 것은 다른 곳에서 받을 수 있는 어떠한 타입 안정성과 툴링 지원도 받지 못한다는 것을 의미합니다.
TypeScript가 이런 부분에 플래그와 에러를 띄울 수 있도록 `noImplicitAny`옵션을 사용할 수 있습니다.

### 엄격한 `null` & `undefined` 검사 (Strict `null` & `undefined` Checks)

기본적으로, TypeScript는 `null` 과 `undefined`이 모든 타입의 도메인에 존재한다고 가정합니다.
`number`로 선언된 타입이 `null` 혹은 `undefined`이 될 수 있다는 의미입니다.
`null` 과 `undefined`는 JavaScript 와 TypeScript 에서 빈번한 버그 원인이기 때문에, TypeScript 에는 이러한 문제의 걱정을 덜어주는 `strictNullChecks` 옵션이 있습니다.

`strictNullChecks`가 활성화되면, `null`과 `undefined`는 각각 `null`과 `undefined`라는 자체 유형을 가져옵니다.
어떤 것이 `null`이 *될 가능성이 있는* 상황에서, 원래 타입과 함께 유니언 타입을 사용할 수 있습니다.
예를 들어, 만약 `number`나 `null`이 될수 있는 경우, `number | null`로 타입을 작성할 수 있습니다.

TypeScript가 `null`/`undefined`라고 생각할 수 있는 값을 갖고 있지만, 타입에 대해 더 잘 알고 있는 경우, 후위 연산자 `!`를 사용해 다르게 사용할 수 있습니다.

```ts
declare var foo: string[] | null;

foo.length;  // error - 'foo' is possibly 'null'

foo!.length; // okay - 'foo!' just has type 'string[]'
```

앞으로, `strictNullChecks`를 사용할 때, 의존성이 `strictNullChecks`를 사용하도록 업데이트 되어야 할 수 있습니다.

### `this`에 대한 암시적 `any` 피하기 (No Implicit `any` for `this`)

`this` 키워드를 클래스 밖에서 사용할 때, 기본적으로 `any` 타입을 가집니다.
예를 들어, `Point` 클래스를 상상해 보세요, 그리고 메서드로 추가하고 싶은 함수를 상상해보세요:

```ts
class Point {
    constructor(public x, public y) {}
    getDistance(p: Point) {
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
}
// ...

// Reopen the interface.
interface Point {
    distanceFromOrigin(point: Point): number;
}
Point.prototype.distanceFromOrigin = function(point: Point) {
    return this.getDistance({ x: 0, y: 0});
}
```

위에서 언급 한 것과 같은 문제가 있습니다 - `getDistance`의 철자를 틀리기 쉽고 에러가 발생하지 않았습니다.
이러한 이유 때문에, TypeScript 에 `noImplicitThis` 옵션이 있습니다.
이 옵션이 설정되면, TypeScript는 `this`가 명시적 타입 없이 사용될 때 에러를 발생시킵니다.
해결책은 인터페이스나 함수 자체에서 명시적 타입을 전달하기 위해 `this`-매개변수를 사용하는 것입니다:

```ts
Point.prototype.distanceFromOrigin = function(this: Point, point: Point) {
    return this.getDistance({ x: 0, y: 0});
}
```
