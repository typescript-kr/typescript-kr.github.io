# 소개 \(Introduction\)

`let`과 `const`는 JavaScript에서 상대적으로 새로운 두 가지 유형의 변수 선언입니다.  
이전에 언급했듯이 `let`은 `var`와 유사하지만 사용자가 JavaScript로 실행하는 일반적인 "결함"을 피할 수 있습니다.  
const는 변수에 재 할당 할 수 없다는 점에서 let의 기능 확장입니다.

TypeScript가 JavaScript의 상위 집합이기 때문에 자연스럽게 `let`과 `const`를 지원합니다.  
여기서 우리는 이 새로운 선언들에 대해 더 자세히 설명할 것이고 왜 그것들이 `var`보다 더 바람직한지를 자세히 설명 할 것입니다.

만약 JavaScript를 아무렇게나 사용했다면 다음 섹션은 기억을 새롭게 하는 좋은 방법이 될 것입니다.  
JavaScript에서 `var` 선언의 모든 단점을 잘 알고 있다면 더 쉽게 건너뛸 수 있습니다.

# `var` 선언 \(var declarations\)

전통적으로 JavaScript에서 변수 선언은 `var` 키워드를 사용하였습니다.

```ts
var a = 10;
```

알다시피 방금 `a` 변수의 값을 `10` 으로 선언하였습니다.

또한 함수 내에서 변수를 선언할 수도 있습니다.

```ts
function f() {
    var message = "Hello, world!";

    return message;
}
```

그리고 다른 함수 내부의 동일한 변수에 접근이 가능합니다.

```ts
function f() {
    var a = 10;
    return function g() {
        var b = a + 1;
        return b;
    }
}

var g = f();
g(); // 오류 '11'
```

위의 예제에서 `g`함수는 `f`함수에서 선언된 변수 `a`를 흭득하였습니다.

`g`함수가 호출되는 시점에 `a`의 값은 `f`함수 내에 `a`의 값에 연결됩니다.

`f`함수가 실행되는 시점에 `g`함수가 호출되더라도 `a`에 접근하여 수정할 수 있습니다.

```ts
function f() {
    var a = 1;

    a = 2;
    var b = g();
    a = 3;

    return b;

    function g() {
        return a;
    }
}

f(); // '2' 반환
```

## 스코프 규칙 \(Scoping rules\)

`var` 선언은 다른 언어의 스코프 규칙에 비해 이상한 스코프 규칙이 몇가지 있습니다.  
다음 예를 함께 보겠습니다.

```ts
function f(shouldInitialize: boolean) {
    if (shouldInitialize) {
        var x = 10;
    }

    return x;
}

f(true);  // '10' 반환
f(false); // 'undefined' 반환
```

어떤 독자는 이 예제를 두 번 실행해 볼 수도 있습니다.  
변수 `x`는 `if` 블록 내에 선언되어 있지만 블록의 바깥에서 접근할 수 있습니다.  
`var` 선언은 함수, 모듈, 네임 스페이스 또는 전역 스코프에서 접근할 수 있기 때문에 가능합니다.  
-포함된 블록에 관계없이 나중에 모두 다룰 것입니다.  
이것을 var-scoping 또는 function-scoping이라고 부릅니다.  
매개변수 또한 함수의 스코프입니다.

이러한 스코프 규칙은 몇 가지 유형의 실수를 유발할 수 있습니다.  
그들이 악화시키는 한가지 문제점은 동일한 변수를 여러 번 선언하는 것은 실수가 아니라는 사실입니다.

```ts
function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

어쩌면 다소 쉽게 찾을 수도 있지만 `for-loop` 내에서 동일한 함수 스코프의 변수를 참조하기 때문에 실수로 변수 `i` 를 덮어 쓰게 됩니다.  
숙련된 개발자들은 알겠지만 비슷한 종류의 버그는 코드 리뷰에서 끝없는 좌절의 원인이 될 수 있다.

## 변수 캡쳐링의 단점 \(Variable capturing quirks\)

잠깐 다음 코드의 출력을 예상을 해보세요

```ts
for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```

익숙하지 않은 사람들을 위해 `setTimeout`은 일정한 시간이 지나면 함수를 실행하려고 합니다.\(실행이 멈추는 것을 기다리고 있습니다.\)

준비됐나요? 보세요:

```text
10
10
10
10
10
10
10
10
10
10
```

많은 JavaScript 개발자들은 이러한 동작에 친숙하지만 당신은 놀랐을 수도 있습니다.  
하지만 당신은 확실히 혼자가 아닙니다.

대부분의 사람들은 이러한 결과를 기대합니다.

```text
0
1
2
3
4
5
6
7
8
9
```

앞에서 변수 캡쳐링에 대해 언급한 내용 기억하세요?  
`setTimeout`에 전달하는 모든 함수 표현식은 실제로 동일한 스코프의 `i`를 참조합니다.

이것이 무슨 뜻인지 한번 생각해 봅시다.  
`setTimeout`은 몇 밀리 초 후에 함수를 실행하지만 `for` 루프가 실행을 중지 한 후에 만 실행됩니다.  
`for` 루프가 실행을 중지했을 때 `i` 값은 `10`입니다. 따라서 주어진 함수가 호출될 때마다 `10`을 출력합니다!

일반적인 해결 방법은 각 반복마다 `i`를 캡쳐하는 즉시 실행 함수 표현식인 IIFE를 사용하는 것입니다.

```ts
for (var i = 0; i < 10; i++) {
    // 현재 값으로 함수를 호출함으로써
    // 'i'의 현재상태를 캡쳐
    (function(i) {
        setTimeout(function() { console.log(i); }, 100 * i);
    })(i);
}
```

위의 이상하게 생긴 패턴은 매우 일반적입니다.  
매개 변수 목록의 `i`는 `for`루프에 선언된 `i`와 같지만 동일한 네이밍을 했기 때문에 루프를 변경할 필요가 없었습니다.

# `let` 선언 \(let declarations\)

이제는 `var`에 몇 가지 문제가 있다는 것을 알아냈습니다.  
그 이유는 정확히 `let`이 도입 된 이유입니다.  
`let`은 `var`와 동일한 방식으로 작성됩니다.

```ts
let hello = "Hello!";
```

중요한 차이점은 구문에 있는 것이 아니라 의미에 관한 것입니다.  
이제 이 내용을 살펴 보겠습니다.

## 블록-스코프 \(Block-scoping\)

`let`을 사용하여 변수를 선언할 때 렉시컬-스코프 또는 블록-스코프를 사용합니다.  
스코프가 포함된 함수로 누출되는 `var` 변수와 달리 블록-스코프 변수는 가장 가깝게 포함된 블록 또는 `for` 반복문 외부에서 사용할 수 없습니다.

```ts
function f(input: boolean) {
    let a = 100;

    if (input) {
        // 'a'는 이곳에서 가능
        let b = a + 1;
        return b;
    }

    // 오류: 'b'는 여기에 존재하지 않습니다.
    return b;
}
```

여기 두 개의 지역변수 `a`와 `b`가 있습니다.  
`a`의 스코프는 함수 `f`의 지역변수로 제한되어있고 `b`의 스코프는 `if`문 블록에 제한되어있습니다.

catch 문안에 선언된 변수에도 유사한 스코프의 스코프 규칙을 갖습니다.

```ts
try {
    throw "oh no!";
}
catch (e) {
    console.log("Oh well.");
}

// 오류: 'e'는 여기에 존재하지 않습니다.
console.log(e);
```

블록-스코프 변수의 또 다른 프로퍼티는 실제로 선언되기 전에는 읽거나 쓸 수 없다는 것입니다.  
이러한 변수는 스코프내에서 _temporal dead zone_ 이 될 때까지 "존재"합니다.  
이것은 `let` 선언 이전에 변수에 먼저 접근 할수 없는 정교한 방법이며 다행스럽게도 TypeScript를 통해 알 수 있습니다.

```ts
a++; // 'a'를 선언하기전에 사용하는것은 불법입니다;
let a;
```

주의해야 할 점은 블록-스코프 변수가 선언되기 전에 변수를 캡쳐할 수 있다는 것입니다.  
선언전에 해당 함수을 실행시키는 것은 불법이라는 것을 알 수 있습니다.

ES2015를 목표로 한다면 현대적인 런타임은 오류를 던질 것입니다.  
그러나 지금은 TypeScripts는 허용되며 오류로 보고하지 않습니다.

```ts
function foo() {
    // 'a'를 캡쳐합니다
    return a;
}

// 잘못된 호출로 'foo'가 선언되기 전에 'a'가 선언됩니다.
// 여기서 런타임 오류가 발생해야합니다.
foo();

let a;
```

_Temporal dead zone_ 에 대한 자세한 내용은 [Mozilla 개발자 네트워크](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_오류s_with_let) 의 관련 내용을 참조하십시오.

## 재선언과 Shadowing \(Re-declarations and Shadowing\)

`var` 를 선언한 횟수가 중요하지 않다고 언급했습니다. 단지 변수를 하나 얻었을 뿐입니다.

```ts
function f(x) {
    var x;
    var x;

    if (true) {
        var x;
    }
}
```

위의 예에서 `x`의 모든 선언은 실제로 동일한 `x`를 참조하며 이는 완전히 유효합니다.  
이것은 종종 버그의 원인이 됩니다. 고맙게도 `let` 에서는 이런 것을 허용하지 않습니다.

```ts
let x = 10;
let x = 20; // 오류: 동일한 스코프에서 'x'를 다시 선언 할 수 없습니다.
```

TypeScript의 블록-스코프는 두개의 같은 변수는 필요하지 않다고 우리에게 문제를 말해줍니다.

```ts
function f(x) {
    let x = 100; // 오류: 매개변수가 변수 선언에 간섭하고 있습니다.
}

function g() {
    let x = 100;
    var x = 100; // 오류: 'x'의 선언을 두 번 할 수 없습니다.
}
```

블록-스코프 변수가 함수-스코프 변수로 선언될 수 없다는 뜻은 아닙니다.  
블록-스코프 변수는 명확하게 다른 블록 내에서 선언되어야합니다.

```ts
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // '0' 반환
f(true, 0);  // '100' 반환
```

중첩된 스코프에서 기존의 변수 이름을 사용하는 것을 _shadowing_ 이라고 합니다.  
 _shadowing_ 은 우발적인 버그를 유발하는 동시에 버그를 예방할 수도 있다는 점에서 양날의 검입니다.

예를 들어 `let` 변수를 사용하여 이전 `sumMatrix` 함수를 작성했다고 가정해 보겠습니다.

```ts
function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

이번 버전의 루프는 내부의 반복문의 `i`가 외부의 반복문의 `i`를 shadows하기때문에 실제로 계산을 합니다.

Shadowing은 _보통_ 더 명확한 코드를 작성하기 위해 피해야 합니다.  
이를 활용할 수 있는 몇 가지 시나리오가 있을 수 있지만 최선의 판단을 내려야 합니다.

## 블럭-스코프 변수 캡쳐

`var` 선언으로 변수 캡쳐를 처음 접했을 때 우리는 일단 캡쳐된 변수가 어떻게 작동하는지 간략하게 살펴보았습니다.  
이것에 대한 직감적이고 더 나은 직감을 주기 위해 스코프가 실행될 때마다 변수의 "환경"을 생성합니다.  
해당 환경 및 캡쳐 된 변수는 스코프 내의 모든 항목이 완료된 후에도 존재할 수 있습니다

```ts
function theCityThatAlwaysSleeps() {
    let getCity;

    if (true) {
        let city = "Seattle";
        getCity = function() {
            return city;
        }
    }

    return getCity();
}
```

환경내에서 `city`를 캡쳐했으므로 if 블록이 실행을 완료 했음에도 불구하고 여전히 접근할 수 있습니다.

이전의 `setTimeout` 예제에서 `for` 문을 반복할 때마다 변수의 상태를 캡쳐하기 위해 IIFE를 사용해야한다는 결론을 얻었습니다.  
실제로 하고 있던 것은 캡쳐한 변수를 위한 새로운 변수 환경을 만드는 것이었습니다.  
그것은 약간의 고통이었지만 다행스럽게도 TypeScript에서 그렇게 할 필요가 없습니다.

`let`은 루프의 일부로 선언될 때 크게 다른 동작을 합니다.  
루프 자체에 새로운 환경을 도입하기보다는 이러한 선언은 반복마다 새로운 스코프를 만듭니다.  
이것이 IIFE로 하고 있었던 것을 `let` 을 사용하여 이전의 `setTimeout` 예제를 바꿀 수 있습니다.

```ts
for (let i = 0; i < 10 ; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```

예상한대로 출력됩니다.

```text
0
1
2
3
4
5
6
7
8
9
```

# `const` 선언 \(const declarations\)

`const` 는 변수를 선언하는 또 다른 방법입니다.

```ts
const numLivesForCat = 9;
```

그것은 `let` 선언과 같지만 그 이름에서 알 수 있듯이 바인딩 된 후에는 값을 변경할 수 없습니다.  
즉 `let`과 동일한 스코프 규칙을 가지고 있지만 규칙을 다시 할당할 수 없습니다.

이것은 참조하는 값이 _불변_ 이라는 개념과 혼동되어서는 안됩니다.

```ts
const numLivesForCat = 9;
const kitty = {
    name: "Aurora",
    numLives: numLivesForCat,
}

// 오류
kitty = {
    name: "Danielle",
    numLives: numLivesForCat
};

// 모두 "좋아요"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

이를 방지하기 위해 구체적인 조치를 취하지 않는 한 `const`변수의 내부 상태는 여전히 수정할 수 있습니다. 다행히 TypeScript를 사용하면 객체의 멤버를 `readonly`로 지정할 수 있습니다.

[Interfaces](./Interfaces.md) 챕터에서 자세한 내용을 다룹니다.

# `let` vs. `const`

비슷한 스코프 지정 의미론을 가진 두 가지 선언이 있다고 가정할 때 어떤 것을 사용할 것인지를 묻는 것은 당연합니다.  
대부분의 질문들과 같이 그 대답도 다음과 같습니다: 그것은 다릅니다.

[principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) \(최소 권한 원칙\) 적용하면 수정할 권한을 제외한 모든 선언은 'const'를 사용해야 합니다.

근본적인 이유는 변수를 쓸 필요가 없는 경우 동일한 코드 베이스에서 작업하는 다른 사용자가 자동으로 객체에 쓸 수 없으므로 변수에 재할당 할 필요가 있는지 여부를 고려해야 합니다.

또한 `const`를 사용하면 데이터 흐름을 추론할 때 코드를 더 예측 가능하게 만들 수 있습니다.  
최선을 판단을 하여 해당되는 경우 팀원들과 이 문제를 상의하십시오.

이 handbook 의 경우 대부분 `let` 선언을 사용합니다.

# 비구조화 \(Destructuring\)

TypeScript에 있는 또 다른 ECMAScript2015 기능은 비구조화입니다.  
전체 참조 정보는 [Mozilla Developer Network의 기사](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)를 참조하세요.  
이 섹션에서는 간단한 개요를 제공합니다.

## 배열 비구조화 \(Array destructuring\)

가장 간단한 구조 해체 방법은 배열 비구조화 할당입니다.

```ts
let input = [1, 2];
let [first, second] = input;
console.log(first); // 1 출력
console.log(second); // 2 출력
```

이것은 `first`와 `second`라는 두 개의 새로운 변수를 만듭니다.

이는 인덱스를 사용하는 것과 동일하지만 훨씬 편리합니다.

```ts
first = input[0];
second = input[1];
```

비구조화는 이미 선언된 변수에서도 작동합니다.

```ts
// 변수 교환
[first, second] = [second, first];
```

함수에 대한 매개 변수가 있는 경우

```ts
function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
f([1, 2]);
```

`...` 구문을 사용하여 목록의 나머지 항목에 대한 변수를 생성할 수 있습니다.

```ts
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // 1 출력
console.log(rest); // [ 2, 3, 4 ] 출력
```

물론 이것은 JavaScript이므로 관심이 없는 후행 요소는 무시할 수 있습니다.

```ts
let [first] = [1, 2, 3, 4];
console.log(first); // 1 출력
```

또는 다른 요소들 :

```ts
let [, second, , fourth] = [1, 2, 3, 4];
```

## 객체 비구조화 \(Object destructuring\)

또한 객체를 해체할 수 있습니다.

```ts
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let { a, b } = o;
```

이것은 `o.a`와 `o.b`에서 새로운 변수 `a`와 `b`를 생성합니다. 필요없는 경우 `c`를 건너뛸 수 있습니다.

배열 비구조화처럼 선언없이 할당 수 있습니다.

```ts
({ a, b } = { a: "baz", b: 101 });
```

이 문장을 괄호로 묶어야한다는 것을 주목하십시오.  
JavaScript는 일반적으로 a`{`를 블록 시작으로 파싱합니다.

`...` 구문을 사용하여 객체의 나머지 항목에 대한 변수를 만들 수 있습니다

```ts
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```

### 프로퍼티 이름 변경 \(Property renaming\)

프로퍼티의 이름 또한 다름 이름으로 지정할 수 있습니다.

```ts
let { a: newName1, b: newName2 } = o;
```

문장이 혼란스러워지기 시작했습니다.

`a : newName1를` "`a` as `newName1`"로 읽을 수 있습니다.

방향은 왼쪽에서 오른쪽으로 사용합니다.

```ts
let newName1 = o.a;
let newName2 = o.b;
```

혼란스럽겠지만 여기서 콜론은 타입을 나타내는 콜론은 아닙니다.  
형식을 지정하는 경우 전체 형식이 비구조화된 후에도 형식을 작성해야 합니다.

```ts
let { a, b }: { a: string, b: number } = o;
```

### 기본값 \(Default values\)

기본값을 사용하면 프로퍼티가 정의되지 않은 경우의 기본값을 지정할 수 있습니다.

```ts
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

`keepWholeObject` 함수는 `b`가 정의되지 않더라도 `a`와 `b` 프로퍼티뿐만 아니라 `wholeObject`의 변수를 가집니다.

## 함수 선언 \(Function declarations\)

비구조화는 함수 선언에서도 작동합니다.  
간단한 예를 보겠습니다.

```ts
type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}
```

그러나 매개 변수에 대해 기본값을 지정하는 것이 더 일반적이며 비구조화시 기본값을 가져오는 것은 까다로울 수 있습니다.

우선 기본값 앞에 패턴을 두는 것을 기억해야 합니다.

```ts
function f({ a, b } = { a: "", b: 0 }): void {
    // ...
}
f(); // 좋아요, 기본값 { a: "", b: 0 }
```

> 위의 코드는 나중에 handbook에서 설명할 유형 추론의 한 예제입니다.

그런 다음 기본 초기화가 아닌 비구조화 프로퍼티에 대한 선택적인 프로퍼티를 기본값으로 지정한다는 것을 기억해야 합니다.  
`c`에서 `b`는 선택사항으로 지정되었다는 것을 기억하세요.

```ts
function f({ a, b = 0 } = { a: "" }): void {
    // ...
}
f({ a: "yes" }); // 좋아요, 기본값 b = 0
f(); // 좋아요, 기본값은 { a:"" }이며 이 경우 기본값은 b = 0입니다.
f({}); // 오류, 인수를 제공하려면 'a'가 필요합니다.
```

비구조화를 조심히 사용하세요.  
앞의 예제에서 보여 주듯이 가장 단순한 비구조화 표현식을 제외하고는 혼란스럽습니다.  
이름 바꾸기 기본값 및 타입을 주석으로 써놓지 않고는 이해하기 힘든 깊은 형태를 비구조화하는 것은 특히 그렇습니다.

비구조화 표현식은 작고 심플하게 유지하세요.

직접 생성한 비구조화를 항상 스스로 쓸 수 있어야 합니다.

## 전개 연산자 \(Spread\)

전개는 비구조화의 반대입니다.  
배열을 다른 배열로 객체를 다른 객체로 전개하는 것을 허용합니다.

예를 들어:

```ts
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

이것은 bothPlus에 `[0, 1, 2, 3, 4, 5]`값을 부여합니다.  
전개는 first와 second의 얕은 복사본을 만듭니다. 그들은 전개에 의해 변하지 않습니다.

또한 객체를 전개 할 수도 있습니다.

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

현재 `search`의 값은 `{ food: "rich", price: "$$", ambiance: "noisy" }`입니다.  
객체의 전개는 배열의 전개보다 복잡합니다.  
배열은 전개를 왼쪽에서 오른쪽으로 진행하지만 결과는 여전히 객체입니다.  
이것은 나중에 전개한 객체의 프로퍼티가 이전에 있던 프로퍼티를 덮어씁니다.  
따라서 끝에 전개할 이전의 코드를 수정하면 다음과 같습니다.

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

`defaults`의 `food`속성을 `food: "rich"`로 덮어쓰는데 우리는 이것을 원한 게 아닙니다.

객체 Spread에는 몇 가지 다른 놀라운 한계가 있습니다.

첫번째, 열거 가능 속성\([own, enumerable properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)\) 객체에 포함됩니다.  
기본적으로 객체의 인스턴스를 전개할 때 메서드를 잃어버린다는 것을 의미합니다.

```ts
class C {
  p = 12;
  m() {
  }
}
let c = new C();
let clone = { ...c };
clone.p; // 좋아요
clone.m(); // 오류!
```

두번째, Typescript 컴파일러는 일반 함수의 매개변수를 전개로 허용하지 않습니다.  
이 기능은 향후 버전의 언어에서 사용될 것으로 예상됩니다.

