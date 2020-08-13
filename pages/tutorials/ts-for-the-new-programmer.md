---
title: TypeScript for the New Programmer
layout: docs
permalink: /docs/handbook/typescript-from-scratch.html
oneline: Learn TypeScript from scratch
---

첫 번째 언어로 TypeScript를 고른것을 축하드립니다 - 정말로 좋은 결정입니다!

Typescript가 Javascript의 "기호(flavor)"나 "변형(variant)"이라는 것을 들어봤을 겁니다.
TypeScript(TS)와 JavaScript(JS)의 관계는 현대 프로그래밍 언어에서 꽤 독특한 관계이니, 이 관계를 더 배우는 것은 어떻게 TypeScript를 JavaScript에 추가할지에 도움이 될 것입니다.

## JavaScript의 짧은 역사 (What is JavaScript? A Brief History)

JavaScript(ECMAScript으로도 알려져있는)는 처음에 브라우저를 위한 스크립팅 언어로 만들어졌습니다.
JavaScript가 처음 나왔을 때, 수십 줄 이상의 코드를 작성하는 것은 다소 이례적인 일이었기에 웹 페이지 속 짧은 코드들을 위해 사용할 것으로 여겨졌습니다.
때문에, 초기 웹 브라우저들은 수십 줄 이상의 코드를 실행하는데 오래 걸렸습니다.
그러나 시간이 흘러 JS가 점점 더 유명해지면서, 웹 개발자들은 JS를 이용해 상호작용을 하는 경험을 하기 시작했습니다.

웹 브라우저 개발자들은 위와 같이 늘어나는 JS 사용량에 대하여 실행 엔진(동적 컴파일)을 최적화시키고 최적화 된 것을 이용해 할 수 있는 일(API 추가)을 확장하여 웹 개발자가 더 많이 JS를 사용할 수 있게 했습니다.
현대 웹사이트에서, 브라우저는 수십만 줄의 코드로 구성된 어플리케이션을 자주 실행합니다.
이는 정적 페이지의 간단한 네트워크로 시작해서, 모든 종류의 만족스러울만한 _어플리케이션_을 위한 플랫폼으로 성장한 "웹"의 길고 점진적인 성장입니다.

이외에도, JS는 node.js를 사용하여 JS 서버들을 구현하는 것처럼, 브라우저 맥락에서 벗어나는 일에 사용하기 충분할 정도로 유명해졌습니다.
"어디서든 작동됨"과 같은 JS의 성질은 교차 플랫폼(cross-platform) 개발을 위한 매력적인 선택지이기도 합니다.
오늘날 많은 개발자들은 _오직_ JavaScript만을 이용하여 전체 스택을 프로그래밍하고 있습니다!

요약하자면, 우리에게는 빠른 사용을 위해 설계되었으며 수백만 줄의 어플리케이션들을 작성하기 위해 만들어진 완벽한 도구인 JavaScript가 있습니다.
모든 언어는 각자의 _별난 점_ - 이상한 점과 놀랄만한 점이 있으며, JavaScript의 자랑스럽지만은 않은 시작은 _많은_ 문제를 만들게 되었습니다. 예를 들어:

* JavaScript의 동일 연산자는 (`==`) 인수를 _강제로 변환하여(coerces)_, 예기치 않은 동작을 유발합니다:

  ```js
  if ("" == 0) {
    // 참입니다! 근데 왜죠??
  }
  if (1 < x < 3) {
    // *어떤* x 값이던 참입니다!
  }
  ```

* JavaScript는 또한 존재하지 않는 프로퍼티의 접근을 허용합니다:

  ```js
  const obj = { width: 10, height: 15 };
  // 왜 이게 NaN이죠? 철자가 어렵네요!
  const area = obj.width * obj.heigth;
  ```

대부분의 프로그래밍 언어는 이런 종류의 오류들이 발생하면 오류를 표출해주고, 일부는 코드가 실행되기 전인 컴파일 중에 오류를 표출해줍니다.
작은 프로그램을 작성할 때에는, 이런 이상한 점들이 화를 돋구지만 관리는 가능합니다. 그러나 수백 또는 수천 줄의 어플리케이션들을 작성할 때에는, 이러한 지속적 놀라움들은 심각한 문제입니다.

## TypeScript: 정적 타입 검사자 (TypeScript: A Static Type Checker)

앞서 몇 언어는 버그가 많은 프로그램을 아예 실행시키지 않는다고 했습니다.
프로그램을 실행시키지 않으면서 코드의 오류를 검출하는 것을 _정적 검사(checking)_이라고 합니다.
어떤 것이 오류인지와 어떤 것이 연산 되는 값에 기인하지 않음을 정하는 것이 정적 _타입_ 검사입니다.

_정적 타입 검사자_인 TypeScript는 프로그램을 실행시키기 전에 _값의 종류_를 기반으로 프로그램의 오류를 찾습니다.
예를 들어, 위의 마지막 예시에 오류가 있는 이유는 `obj`의 _타입_ 때문입니다.
다음은 TypeScript에서 볼 수 있는 오류입니다:

```
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### 타입이 있는 JavaScript의 상위집합 (A Typed Superset of JavaScript)

그렇다면 TypeScript는 JavaScript와 어떤 관계일까요?

#### 구문 (Syntax)

TypeScript는 JS의 구문이 허용되는, JavaScript의 _상위집합_ 언어입니다.
구문은 프로그램을 만들기 위해 코드를 작성하는 방법을 의미합니다.
예를 들어, 다음 코드는 `)`이 없으므로 _구문_ 오류입니다:

```
// @errors: 1005
let a = (4
```

TypeScript는 독특한 구문 때문에 JavaScript 코드를 오류로 보지 않습니다.
즉, 어떻게 작성돼있는지 모르지만 작동하는 JavaScript 코드를 TypeScript 파일에 넣어도 잘 작동합니다.

#### 타입 (Types)

그러나 TypeScript는 다른 종류의 값들을 사용할 수 있는 방법이 추가된, _타입이 있는_ 상위집합입니다.
위의 `obj.heigth` 오류는 _구문_ 오류가 아닌, 값의 종류(_타입_)를 잘못 사용해서 생긴 오류입니다.

또 다른 예시로, 아래와 같은 JavaScript 코드가 브라우저에서 실행될 때, 다음과 같은 값이 출력될 _것입니다_:

```js
console.log(4 / []);
```

구문적으로 옳은(syntactically-legal) 위 코드는 JavaScript에서 `NaN`을 출력합니다.
그러나 TypeScript는 배열로 숫자를 나누는 연산이 옳지 않다고 판단하고 오류를 발생시킵니다:

```
// @errors: 2363
console.log(4 / []);
```

실제로 어떤 일이 일어나는지 보려는 의도로 숫자를 배열로 나눌 수 _있지만_, 대부분은 프로그래밍 실수입니다.
TypeScript의 타입 검사자는 최대한 많은 일반적인 오류를 검출하면서 올바른 프로그램을 만들 수 있게 설계되었습니다.
(나중에 TypeScript가 코드를 얼마나 엄격하게 검사할 수 있는지에 대한 설정에 대해 알아봅시다.)

만약 JavaScript 파일의 코드를 TypeScript 코드로 옮기면, 코드를 어떻게 작성했는지에 따라 _타입 오류_를 볼 수 있습니다.
이는 코드상의 문제이거나, TypeScript의 타입 검사가 지나치게 엄격한 것일 수 있습니다.
위와 같은 오류를 제거하기 위해 가이드는 다양한 TypeScript 구문을 추가하는 방법을 보여줍니다.

#### Runtime Behavior

TypeScript is also a programming language that preserves the _runtime behavior_ of JavaScript.
For example, dividing by zero in JavaScript produces `Infinity` instead of throwing a runtime exception.
As a principle, TypeScript **never** changes the runtime behavior of JavaScript code.

This means that if you move code from JavaScript to TypeScript, it is **guaranteed** to run the same way, even if TypeScript thinks that the code has type errors.

Keeping the same runtime behavior as JavaScript is a foundational promise of TypeScript because it means you can easily transition between the two languages without worrying about subtle differences that might make your program stop working.

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### Erased Types

Roughly speaking, once TypeScript's compiler is done with checking your code, it _erases_ the types to produce the resulting "compiled" code.
This means that once your code is compiled, the resulting plain JS code has no type information.

This also means that TypeScript never changes the _behavior_ of your program based on the types it inferred.
The bottom line is that while you might see type errors during compilation, the type system itself has no bearing on how your program works when it runs.

Finally, TypeScript doesn't provide any additional runtime libraries.
Your programs will use the same standard library (or external libraries) as JavaScript programs, so there's no additional TypeScript-specific framework to learn.
<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## Learning JavaScript and TypeScript

We frequently see the question "Should I learn JavaScript or TypeScript?".

The answer is that you can't learn TypeScript without learning JavaScript!
TypeScript shares syntax and runtime behavior with JavaScript, so anything you learn about JavaScript is helping you learn TypeScript at the same time.

There are many, many resources available for programmers to learn JavaScript; you should _not_ ignore these resources if you're writing TypeScript.
For example, there about 20 times more StackOverflow questions tagged `javascript` than `typescript`, but _all_ of the `javascript` questions also apply to TypeScript.

If you find yourself searching for something like "how to sort a list in TypeScript", remember: **TypeScript is JavaScript's runtime with a compile-time type checker**.
The way you sort a list in TypeScript is the same way you do so in JavaScript.
If you find a resource that uses TypeScript directly, that's great too, but don't limit yourself to thinking you need TypeScript-specific answers for everyday questions about how to accomplish runtime tasks.

---

From here, we'd recommend learning some of the JavaScript fundamentals (the [JavaScript guide at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide) is a good starting point.)

Once you're feeling comfortable, you can come back to read [TypeScript for JavaScript Programmers](/docs/handbook/typescript-in-5-minutes.html), then start on [the handbook](/docs/handbook/intro.html) or explore the [Playground examples](/play#show-examples).

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->