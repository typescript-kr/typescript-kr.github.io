TypeScript는 공백 상태로 존재하지 않습니다.  
JavaScript 생태계를 염두에 두고 만들어졌으며 오늘날에는 많은 JavaScript가 존재합니다.  
JavaScript 코드 베이스를 TypeScript로 변환하는 것은 다소 지루하지만 보통 어렵지 않습니다.  
이 튜토리얼에서는 시작하는 방법을 살펴보겠습니다.  
새로운 TypeScript 코드를 작성하기에 충분한 핸드북을 읽은 것으로 가정합니다.

React 프로젝트를 변환하려는 경우 [React Conversion Guide](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide)를 먼저 참조하는 것이 좋습니다.

# 디렉터리 설정하기 (Setting up your Directories)

평범한 JavaScript로 작성하는 경우 JavaScript가 `src`와 `lib` 또는 `dist` 디렉터리에 있는 `.js` 파일을 직접 실행하고 원하는 대로 실행할 수 있습니다.

이런 경우 작성한 파일은 TypeScript의 입력으로 사용되며 생성된 출력을 실행하게 됩니다.  
JS에서 TS로 마이그레이션 하는 동안 TypeScript가 입력 파일을 덮어쓰지 않도록 입력 파일을 분리해야 합니다.  
출력 파일이 특정 디렉터리에 있어야 하는 경우 해당 파일이 출력 디렉터리가 됩니다.

번들링이나 Babel과 같은 다른 트랜스파일러를 사용하는 것과 같이 JavaScript에서 중간 단계를 수행할 수도 있습니다.  
이런 경우에는 이와 같은 폴더 구조가 이미 설정되어 있을 수 있습니다.

지금부터 디렉터리가 다음과 같이 설정되었다고 가정할 것입니다:

```text
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
```

`src` 디렉터리 밖에 `tests` 폴더가 있다면 `src`에 `tsconfig.json`와 `tests`에 하나씩 가질 수 있습니다.

# 설정 파일 작성하기 (Writing a Configuration File)

TypeScript는 `tsconfig.json`이라는 파일을 사용하여 포함시킬 파일과 검사의 종류와 같은 프로젝트의 옵션을 관리합니다.  
프로젝트에 사용할 기본적인 뼈대를 생성하겠습니다:

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

여기서 TypeScript에 몇 가지를 지정합니다:

1. `src` 디렉터리에의 모든 파일을 읽습니다 (`include` 포함)
2. JavaScript 파일의 입력으로 허용합니다 (`allowJs` 포함)
3. `builtd`에 모든 출력 파일을 내 보냅니다 (`outDir`와 함께)
4. 최신 JavaScript 구문을 ECMAScript 5 같은 이전 버전으로 변환합니다 (`target` 사용)

이때 프로젝트 루트에 `tsc`를 실행하려고 하면 `built` 디렉터리에 출력 파일이 표시됩니다.  
`built`에 있는 파일의 레이아웃은 `src`의 레이아웃과 동일해야 합니다.  
이제 프로젝트에서 TypeScript로 작업해야 합니다.

## 초기의 혜택 (Early Benefits)

이 시점에서도 TypeScript에서 프로젝트를 이해함으로써 몇 가지 뛰어난 이점을 누릴 수 있습니다.  
[VS Code](https://code.visualstudio.com)나 [Visual Studio](https://visualstudio.com) 같은 편집기로 시작하면 자동 완성과 같은 도구 지원을 자주 받을 수 있습니다.  
또한 다음과 같은 옵션을 사용하여 특정 버그를 발견할 수도 있습니다:

* `noImplicitReturns`는 함수의 끝에 반환문을 빼먹는 것을 방지합니다.
* `noFallthroughCasesInSwitch`는 `switch`블록 `case` 사이에 `break`문을 뻬먹지 않기 위해 유용합니다.

TypeScript는 도달 할 수없는 코드와 라벨에 대해서도 경고합니다.  
이 코드와 라벨은 각각의 `allowUnreachableCode`와 `allowUnusedLabels`로 해제할 수 있습니다.

# 빌드 도구와 통합 (Integrating with Build Tools)

파이프 라인에 빌드 단계가 더 있을 수 있습니다.  
아마도 각 파일에 무언가를 연결했을 것입니다.  
각 빌드 도구는 다르지만 각 빌드 도구의 요점을 다루기 위해 최선을 다할 것입니다.

## Gulp

Gulp를 사용하는 경우 TypeScript로 [Gulp 사용하기](./Gulp.md) 튜토리얼이 있고 Browserify와 Babelify 그리고 Uglify와 같은 일반적인 빌드 도구와 통합됩니다.  
거기서 더 읽을 수 있습니다.

## Webpack

Webpack 통합은 매우 간단합니다.
TypeScript 로더인 `awesome-typescript-loader`를 `source-map-loader`와 결합하여 사용하면 디버깅이 쉬워 집니다.  

간단한 실행

```shell
npm install awesome-typescript-loader source-map-loader
```

그리고 다음의 옵션을 `webpack.config.js` 파일에 병합하십시오 :

```js
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js",
    },

    // webpack의 출력을 디버깅 할 소스 맵을 사용하도록 설정합니다.
    devtool: "source-map",

    resolve: {
        // 확인 가능한 확장자로 '.ts' 및 '.tsx'를 추가합니다.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // '.ts' 또는 '.tsx' 확장자를 가진 모든 파일은 'awesome-typescript-loader'에 의해 처리됩니다.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],

        preLoaders: [
            // '.js' 파일의 모든 출력에는 'source-maps-loader'로 다시 처리된 소스 맵이 있습니다.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // 다른 옵션들...
};
```

`.js` 파일을 다루는 다른 로더보다 awesome-typescript-loader를 먼저 실행해야 한다는 점에 주의해야 합니다.  
Webpack을 위한 TypeScript 로더인 [ts-loader](https://github.com/TypeStrong/ts-loader)도 마찬가지입니다.  
[여기에서](https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader). 그 둘의 차이점에 대해 더 읽어볼 수 있다. 

[React and Webpack에 관한 튜토리얼](./React & Webpack.md)에서 Webpack을 사용하는 예를 볼 수 있습니다.

# TypeScript 파일로 이동 (Moving to TypeScript Files)

이때 TypeScript 파일을 사용할 준비가 된 것입니다.  
첫 번째 단계는 `.js` 파일 중 하나의 이름을 `.ts`로 바꾸는 것입니다.  
파일이 JSX를 사용한다면 이름을 `.tsx`로 바꿔야 합니다.

그 단계를 끝냈나요?
좋았어!  
JavaScript에서 TypeScript로 파일을 성공적으로 마이그레이션 했습니다!

물론 옳다고 생각하지 않을 수도 있습니다.  
TypeScript를 지원하는 편집기에서 해당 파일을 열면 (또는 tsc --pretty를 실행하면) 특정 라인에 빨간 줄이 나타날 수 있습니다.  
Microsoft Word와 같은 편집기에서 빨간 줄을 생각하는 것과 같은 방식으로 생각해야합니다.  
Word에서 여전히 문서를 인쇄할 수 있는 것처럼 TypeScript는 코드를 변환합니다.

그 경고가 너무 느슨하면 그 경고를 엄격하게 할 수 있습니다.  
예를 들어 오류 발생으로 인해 TypeScript에서 JavaScript로 컴파일하는 것을 *원치 않는* 경우 `noEmitOnError` 옵션을 사용할 수 있습니다.  
그런 의미에서 TypeScript는 엄격함을 조절할 수 있는 도구를 가지고 있으며 원하는 만큼 조절할 수 있습니다.

만약 사용 가능한 더 엄격한 설정을 사용할 계획이라면 지금 바로 설정하는 것이 가장 좋습니다.  
(아래의 [Getting Stricter Checks](#getting-stricter-checks) 참조).

예를 들어 TypeScript가 타입에 대해 `any`를 추론하지 않도록 명시하려면 파일을 수정하기 전에 `noImplicitAny`를 사용할 수 있습니다.  
다소 벅차다고 느껴질 수도 있지만 장기적 이득은 훨씬 더 빨리 나타납니다.

## 오류 잡기 (Weeding out Errors)

앞서 언급 한 것처럼 변환 후에 오류 메시지가 표시되는 것은 예상치 못한 일이 아닙니다.  
중요한 것은 이런 것들을 하나씩 살펴보고 어떻게 오류를 처리할 것인지를 결정하는 것입니다.  
종종 이것들은 문제없는 버그가 될 수도 있지만 때로는 TypeScript를 위해 조금 더 나은 것을 설명해야 할 것입니다.

### 모듈 가져오기 (Importing from Modules)

`Cannot find name 'require'.`와 `Cannot find name 'define'.` 같은 오류가 발생하기 시작할 수 있습니다.  
이러한 경우 모듈을 사용하고 있을 가능성이 높습니다.

TypeScript로 작성하는 동안 확실할 수 있지만

```ts
// Node/CommonJS를 위한
declare function require(path: string): any;
```

또는

```ts
// RequireJS/AMD를 위한
declare function define(...args: any[]): any;
```

이러한 호출들은 제거하고 import에 TypeScript 구문을 사용하는 것이 좋습니다.

먼저 TypeScript의 `module` 플래그를 설정하여 일부 모듈 시스템을 활성화해야 합니다.  
유효한 옵션은`commonjs`,`amd`,`system` 그리고 `umd`입니다.

다음 Node/CommonJS 코드를 가지고 있는 경우:

```js
var foo = require("foo");

foo.doStuff();
```

또는 다음 RequireJS / AMD 코드:

```js
define(["foo"], function(foo) {
    foo.doStuff();
})
```

그러면 다음과 같은 TypeScript 코드를 작성하게 됩니다:

```ts
import foo = require("foo");

foo.doStuff();
```

### 선언 파일 가져 오기 (Getting Declaration Files)

TypeScript로 전환하기 시작하면 `Cannot find module 'foo'.`과 같은 오류가 발생할 수 있습니다.  
여기서 문제는 라이브러리를 설명할 수 있는 *선언 파일(declaration files)* 을 가지고 있지 않다는 것입니다.  
다행히도 이것은 꽤 쉽습니다.  
TypeScript에서 `lodash`와 같은 패키지에 대해 불평하는 경우 그냥 작성할 수 있습니다.

```shell
npm install -S @types/lodash
```

`commonjs`가 아닌 다른 모듈 옵션을 사용한다면 `moduleResolution` 옵션을 `node`로 설정해야 합니다.

그런 다음 문제없이 Lodash를 가져올 수 있으며 자동 완성을 얻을 수 있습니다.

### 모듈 내보내기 (Exporting from Modules)

전형적으로 모듈에서 내보내기는 `exports` 나 `module.exports`와 같은 값에 프로퍼티를 추가하는 것을 포함합니다.  
TypeScript를 사용하면 최상위 레벨 내보내기 명령문을 허용할 수 있습니다.

예를 들어 이와 같은 함수를 내보낸 경우:

```js
module.exports.feedPets = function(pets) {
    // ...
}
```

다음과 같이 작성할 수 있습니다:

```ts
export function feedPets(pets) {
    // ...
}
```

때로는 exports 객체를 완전히 덮어쓰기도 합니다.

이것은 모듈을 이 코드처럼 즉시 호출 가능한 모듈로 만들기 위해 사용하는 일반적인 패턴입니다:

```js
var express = require("express");
var app = express();
```

이전에는 이렇게 작성했을 수도 있습니다 :

```js
function foo() {
    // ...
}
module.exports = foo;
```

TypeScript에서는 이것을 `export =` 구조로 모델링할 수 있습니다.

```ts
function foo() {
    // ...
}
export = foo;
```

### 너무 많거나 적은 인수 (Too many/too few arguments)

때때로 너무나 많거나 적은 인수를 가진 함수를 호출할 때가 있습니다.  
전형적으로 이것은 버그이지만 어떤 경우에는 매개 변수를 쓰는 대신 `arguments` 객체를 사용하는 함수를 선언했을 수도 있습니다:

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

이런 경우에는 TypeScript를 사용하여 `myCoolfunction`이 함수 오버로드를 통해 호출될 수 있는 방법에 대해 알려주어야 합니다.

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

`myCoolFunction`에 두 개의 오버로드를 추가했습니다.
첫 번째 검사는 `myCoolFunction`가 (`number`를 갖는) 함수에 `number`의 목록을 가집니다.
두번째는 함수도 갖춰야 한다는 것이고 그 뒤에 오는 인수가 숫자여야 한다는 것을 알리기 위해 나머지 매개변수(`...nums`)를 사용합니다.

### 순차적으로 추가되는 프로퍼티 (Sequentially Added Properties)

어떤 사람들은 다음과 같이 즉시 객체를 생성하고 속성을 추가하는 것이 더 예술적으로 즐겁다는 것을 알게됩니다:

```js
var options = {};
options.color = "red";
options.volume = 11;
```

TypeScript는 `options`의 타입을 어떠한 프로퍼티도 갖지 않는 `{}`로 먼저 찾아냈기 때문에 `volume`과 `color`에 할당할 수 없다고 말할 것입니다.  
대신 선언을 객체 리터럴 자체로 옮기면 오류가 발생하지 않습니다:

```ts
let options = {
    color: "red",
    volume: 11
};
```

`options`의 타입을 정의하고 객체 리터럴에 타입 표명(type assertion)을 추가 할 수도 있습니다.

```ts
interface Options { color: string; volume: number }

let options = {} as Options;
options.color = "red";
options.volume = 11;
```

또는 `options`에 `any` 타입이라고 하는 것이 가장 쉬운 방법이지만 가장 이득이 적은 일이 될 것입니다.

### `any`와 `Object` 그리고 `{}` (`any`, `Object`, and `{}`)

대부분의 경우 `Object`가 가장 일반적인 타입이기 때문에 `Object` 또는 `{}`를 사용하여 값에 프로퍼티를 포함할 수 있다고 말할 수 있습니다.  
하지만 any가 가장 *유연한* 타입이기 때문에 이러한 상황에서 **실제로 사용하려는** 타입입니다.

예를 들어 `Object` 타입을 가지고 있다면 `toLowerCase()`와 같은 메서드를 호출할 수 없습니다.  

좀 더 일반적이라는 것은 보통 타입을 사용하는 것이 적다는 것을 의미하지만 가장 일반적인 타입인 `any`는 여전히 어떤 것이든 할 수 있게 허용해준다는 점에서 특별합니다.  
즉 호출하여 구성하고 프로퍼티를 조작할 수 있습니다.  
하지만 `any`를 사용하면 TypeScript가 제공하는 대부분의 오류 검사 및 편집기 지원을 잃어 버리게 됩니다.

`Object`와 `{}`로 판결났다면 `{}`을 선호해야 합니다.  
그것들은 대체로 같지만 비밀스러운 경우에는 기술적으로 `{}`가 `Object`보다 더 일반적인 타입입니다.

## 엄격한 검사 받기 (Getting Stricter Checks)

TypeScript는 프로그램의 안전성과 분석을 제공하기 위해 특정 검사를 제공합니다.  
일단 코드 베이스를 TypeScript로 변환한 후에는 이러한 검사를 활성화하여 안전성을 높일 수 있습니다.

### 암시적인 `any`는 No (No Implicit `any`)

타이프 스크립트가 어떤 타입이어야 할지 모르는 특정한 경우가 있습니다.  
가능하면 관대하기 위해 그 자리에 `any` 타입을 사용하기로 결정할 것입니다.  
이는 마이 그레이션에는 매우 유용하지만 `any`를 사용하면 어떠한 유형의 안전도 확보할 수 없으며 다른 곳에서 얻을 수 있는 것과 도구의 지원을 받을 수 없습니다.  
TypeScript에서 이러한 위치를 기록하도록 지시하고 `noImplicitAny` 옵션으로 오류를 표시할 수 있습니다.

### 엄격한 `null`과 `undefined` 체크 (Strict `null` & `undefined` Checks)

기본적으로 TypeScript는 `null`과 `undefined`이 모든 타입의 범위에 있다고 가정합니다.  
즉 `number` 타입으로 선언된 모든 것이 `null` 또는 `undefined` 일 수 있음을 의미합니다.  

`null`과 `undefined`는 JavaScript와 TypeScript에서 자주 발생하는 버그의 원천이기 때문에 TypeScript는 이에 대한 걱정을 덜어주기 위해 `strictNullChecks` 옵션을 가지고 있습니다.  

`strictNullChecks`가 활성화되면 `null`과 `undefined`는 `null`과 `undefined` 각각의 타입을 갖습니다.

*혹시* `null` 일 수 있는 항목이 있을 때 원래 타입을 union 타입으로 사용할 수 있습니다.  
그렇기 때문에 타입이 `number`(이)거나 `null` 일 수 있는 경우 해당 타입을 `number | null`로 쓰면 됩니다.

TypeScript가 `null` /`undefined`라고 생각하는 값을 가지고 있지만 더 잘 알고 있다면 후위 연산자 `!`를 사용하여 다르게 사용할 수 있습니다.

```ts
declare var foo: string[] | null;

foo.length;  // 오류 - 'foo'는 'null'일 수 있습니다.

foo!.length; // 좋아요 - 'foo!'에 'string[]'타입이 있습니다.
```

참고로 `strictNullChecks`를 사용할 때는 `strictNullChecks`도 사용하기 위해 의존성을 업데이트해야 할 수도 있습니다.

### 묵시적인 `this`의 `any` No! (No Implicit `any` for `this`)

클래스 밖에서 `this` 키워드를 사용할 때 기본적으로 `any` 타입을 가집니다.

예를 들어 `Point` 클래스를 생각하여 메서드로 추가하고자 하는 함수를 작성해보세요 :

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

// 인터페이스를 다시 열어보세요
interface Point {
    distanceFromOrigin(point: Point): number;
}
Point.prototype.distanceFromOrigin = function(point: Point) {
    return this.getDistance({ x: 0, y: 0});
}
```

이것은 위에서 언급한 것과 동일한 문제를 가지고 있습니다 - `getDistance`의 철자가 틀리거나 오류가 발생하지 않을 수 있습니다.  
이러한 이유로 TypeScript는 `noImplicitThis` 옵션을 가지고 있습니다.  
이 옵션을 설정하면 TypeScript에서 명시적(또는 추론된) 타입 없이 `this`를 사용할 경우 오류가 발생합니다.

해결책은 인터페이스나 함수 자체에 `this`-매개변수를 사용하여 명확한 타입을 제공하는 것입니다:

```ts
Point.prototype.distanceFromOrigin = function(this: Point, point: Point) {
    return this.getDistance({ x: 0, y: 0});
}
```
