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

## TypeScript: A Static Type Checker

We said earlier that some languages wouldn't allow those buggy programs to run at all.
Detecting errors in code without running it is referred to as _static checking_.
Determining what's an error and what's not based on the kinds of values being operated on is known as static _type_ checking.

TypeScript checks a program for errors before execution, and does so based on the _kinds of values_, it's a _static type checker_.
For example, the last example above has an error because of the _type_ of `obj`.
Here's the error TypeScript found:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### A Typed Superset of JavaScript

How does TypeScript relate to JavaScript, though?

#### Syntax

TypeScript is a language that is a _superset_ of JavaScript: JS syntax is therefore legal TS.
Syntax refers to the way we write text to form a program.
For example, this code has a _syntax_ error because it's missing a `)`:

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript doesn't consider any JavaScript code to be an error because of its syntax.
This means you can take any working JavaScript code and put it in a TypeScript file without worrying about exactly how it is written.

#### Types

However, TypeScript is a _typed_ superset, meaning that it adds rules about how different kinds of values can be used.
The earlier error about `obj.heigth` was not a _syntax_ error: it is an error of using some kind of value (a _type_) in an incorrect way.

As another example, this is JavaScript code that you can run in your browser, and it _will_ print a value:

```js
console.log(4 / []);
```

This syntactically-legal program prints `NaN`.
TypeScript, though, considers division of number by an array to be a nonsensical operation, and will issue an error:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

It's possible you really _did_ intend to divide a number by an array, perhaps just to see what happens, but most of the time, though, this is a programming mistake.
TypeScript's type checker is designed to allow correct programs through while still catching as many common errors as possible.
(Later, we'll learn about settings you can use to configure how strictly TypeScript checks your code.)

If you move some code from a JavaScript file to a TypeScript file, you might see _type errors_ depending on how the code is written.
These may be legitimate problems with the code, or TypeScript being overly conservative.
Throughout this guide we'll demonstrate how to add various TypeScript syntax to eliminate such errors.

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