---
title: DOM Manipulation
layout: docs
permalink: /docs/handbook/dom-manipulation.html
oneline: Using the DOM with TypeScript
---

# DOM 조작 (DOM Manipulation)

### _`HTMLElement` 타입 탐구_ (_An exploration into the `HTMLElement` type_)

표준화 이후 20여 년 동안, JavaScript는 많은 발전을 이루었습니다. 2020년에는 서버, 데이터 사이언스, 그리고 IoT 기기에도 JavaScript를 사용할 수 있지만, 가장 인기 있는 활용 사례는 웹 브라우저인 것을 기억하는 것이 중요합니다.

웹 사이트는 HTML 및/또는 XML 문서로 구성됩니다. 이러한 문서들은 정적이어서, 변하지 않습니다. *문서 객체 모델(DOM)은* 정적 웹 사이트를 기능적으로 작동시키기 위해 브라우저에 의해 구현된 프로그래밍 인터페이스입니다. DOM API를 사용하면 문서의 구조, 스타일, 그리고 내용을 변경할 수 있습니다. API는 매우 강력해서 이를 바탕으로 보다 쉽게 동적인 웹사이트들 개발하기 위해 수많은 프런트엔드 프레임워크(jQuery, React, Angular 등)가 개발되었습니다.

TypeScript는 타입이 있는 JavaScript 상위 집합(superset)이며, DOM API에 대한 타입 정의를 제공합니다. 이러한 정의는 모든 기본 TypeScript 프로젝트에서 쉽게 사용 가능합니다. _lib.dom.d.ts_ 에 있는 2만여 줄의 정의 중에서, 가장 눈에 띄는 것은 `HTMLElement`입니다. 이 타입은 TypeScript를 사용한 DOM 조작의 중축입니다.

> [DOM 타입 정의](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)에 대한 소스코드는 이곳에서 볼 수 있습니다.

## 기본 예제 (Basic Example)

간단한 예시 파일 _index.html_:

    <!DOCTYPE html>
    <html lang="en">
      <head><title>TypeScript Dom Manipulation</title></head>
      <body>
        <div id="app"></div>
        <!-- Assume index.js is the compiled output of index.ts -->
        <script src="index.js"></script>
      </body>
    </html>

`#app` 요소에 `<p>Hello, World</p>` 요소를 추가하는 TypeScript 스크립트를 살펴보겠습니다.

```ts
// 1. id 프로퍼티를 사용하여 div 요소를 선택합니다.
const app = document.getElementById("app");

// 2. 새로운 <p></p> 요소를 프로그래밍 방식으로 생성합니다.
const p = document.createElement("p");

// 3. 텍스트 내용을 추가합니다.
p.textContent = "Hello, World!";

// 4. div 요소에 p 요소를 자식 노드로 추가합니다.
app?.appendChild(p);
```

_index.html_ 페이지를 컴파일하고 실행한 후, HTML 결과:

```html
<div id="app">
  <p>Hello, World!</p>
</div>
```

## `Document` 인터페이스 (The `Document` Interface)

TypeScript 코드의 첫 번째 줄은 전역변수 `document`를 사용하며, 그 변수를 검사하면 _lib.dom.d.ts_ 파일의 `Document` 인터페이스에 의해 정의된 것으로 표시됩니다. 그 코드의 스니펫(snippet)에는 `getElementById`와 `createElement`라는 두 가지 메서드 호출이 포함되어 있습니다.

### `Document.getElementById`

이 메서드의 정의는 다음과 같습니다:

```ts
getElementById(elementId: string): HTMLElement | null;
```

문자열 id 요소가 전달되면 `HTMLElement` 또는 `null`이 반환됩니다. 이 메서드는 가장 중요한 타입들 중 하나인 `HTMLElement`를 도입합니다. 이 타입은 다른 모든 요소 인터페이스의 기본 인터페이스 역할을 합니다. 예를 들면, 예제 코드에서 `p` 변수는 `HTMLParagraphElement` 타입입니다. 다음으로, 이 메서드는 `null`을 반환할 수 있다는 점에 유의해야 합니다. 메서드가 실제로 지정된 요소를 찾을 수 있을지 없을지에 따라 확실한 사전 런타임이 될 수 없기 때문입니다. 스니펫 코드의 마지막 줄에는, `appendChild`를 호출하기 위해 새로운 _선택적 체이닝(optional chaining)_ 연산자가 사용되고 있습니다.

### `Document.createElement`

이 메서드의 정의는 다음과 같습니다(_deprecated_ 표기된 정의는 생략했습니다):

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

이는 오버 로드된 함수 정의입니다. 두 번째 오버로드는 가장 단순하며 `getElementById` 메서드와 매우 유사하게 작동합니다. 어떤 `문자열`이 전달되면 HTMLElement 표준이 반환됩니다. 이 정의는 개발자가 고유한 HTML 요소 태그를 생성할 수 있게 합니다.

예를 들면 `document.createElement('xyz')`는 HTML 규격에 지정된 요소가 아닌 `<xyz></xyz>` 요소를 반환합니다.

> 관심 있는 사람들을 위해 언급하자면, `document.getElementsByTagName`를 사용해 사용자 정의 태그(custom tag) 요소와 상호작용할 수 있습니다.

`createElement`의 첫 번째 정의에는, 고급 제네릭 패턴들을 사용하고 있습니다. 이는 내용을 나누어 이해하는 것이 가장 좋습니다. 먼저 `<K extends keyof HTMLElementTagNameMap>`라는 제네릭 표현부터 시작합니다. 이 표현식은 `HTMLElementTagNameMap` 인터페이스의 키에 제약을 받는 제네릭 매개변수 `K`를 정의하고 있습니다. 그 맵 인터페이스는 모든 지정된 HTML 태그 이름과 해당 타입 인터페이스를 포함하고 있습니다. 예를 들면 여기 코드 초반에 5개의 매핑된 값이 있습니다:

```ts
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
        ...
}
```

일부 요소들은 고유한 프로퍼티를 나타내지 않아 `HTMLElement`를 반환하기도 하지만, 그 외 타입 요소들은 고유한 프로퍼티와 메서드를 가지고 특정 인터페이스(`HTMLElement`에서 확장되거나 구현됨)를 반환합니다.

이제, `createElement` 정의의 나머지 부분인 `(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]`를 살펴보겠습니다. 첫 번째 인수 `tagName`은 제네릭 매개변수 `K`로 정의됩니다. TypeScript 인터프리터는 이 인수로부터 제네릭 매개변수를 _추론_ 할 수 있는 충분한 성능을 가지고 있습니다. 이는 개발자가 메서드를 사용할 때 실제로 제네릭 매개변수를 지정할 필요가 없음을 의미하며, 어떤 값이 `tagName`인수로 전달되든 간에 `K`로 추론되므로 정의의 나머지 부분에 사용할 수 있을 것입니다. 정확히 무슨 일이 일어나는지를 보면 반환값 `HTMLElementTagNameMap[K]`는 `tagName`인수를 가지고 해당 타입을 반환합니다. 이 정의는 스니펫 코드 `p` 변수에서 `HTMLParagraphElement`타입을 얻는 방법입니다. 그리고 코드가 `document.createElement('a')`였다면, `HTMLAnchorElement`타입의 요소가 됩니다.

## The `Node` interface

The `document.getElementById` function returns an `HTMLElement`. `HTMLElement` interface extends the `Element` interface which extends the `Node` interface. This prototypal extension allows for all `HTMLElements` to utilize a subset of standard methods. In the code snippet, we use a property defined on the `Node` interface to append the new `p` element to the website.

### `Node.appendChild`

The last line of the code snippet is `app?.appendChild(p)`. The previous, `document.getElementById` , section detailed that the _optional chaining_ operator is used here because `app` can potentially be null at runtime. The `appendChild` method is defined by:

```ts
appendChild<T extends Node>(newChild: T): T;
```

This method works similarly to the `createElement` method as the generic parameter `T` is inferred from the `newChild` argument. `T` is _constrained_ to another base interface `Node`.

## Difference between `children` and `childNodes`

Previously, this document details the `HTMLElement` interface extends from `Element` which extends from `Node`. In the DOM API there is a concept of _children_ elements. For example in the following HTML, the `p` tags are children of the `div` element

```tsx
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

After capturing the `div` element, the `children` prop will return a `HTMLCollection` list containing the `HTMLParagraphElements`. The `childNodes` property will return a similar `NodeList` list of nodes. Each `p` tag will still be of type `HTMLParagraphElements`, but the `NodeList` can contain additional _HTML nodes_ that the `HTMLCollection` list cannot.

Modify the html by removing one of the `p` tags, but keep the text.

```tsx
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;

const div = document.getElementByTagName("div")[0];

div.children;
// HTMLCOllection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

See how both lists change. `children` now only contains the `<p>Hello, World</p>` element, and the `childNodes` contains a `text` node rather than two `p` nodes. The `text` part of the `NodeList` is the literal `Node` containing the text `TypeScript!`. The `children` list does not contain this `Node` because it is not considered an `HTMLElement`.

## The `querySelector` and `querySelectorAll` methods

Both of these methods are great tools for getting lists of dom elements that fit a more unique set of constraints. They are defined in _lib.dom.d.ts_ as:

```ts
/**
 * Returns the first element that is a descendant of node that matches selectors.
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * Returns all element descendants of node that match selectors.
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

The `querySelectorAll` definition is similar to `getElementByTagName`, except it returns a new type: `NodeListOf`. This return type is essentially a custom implementation of the standard JavaScript list element. Arguably, replacing `NodeListOf<E>` with `E[]` would result in a very similar user experience. `NodeListOf` only implements the following properties and methods: `length` , `item(index)`, `forEach((value, key, parent) => void)` , and numeric indexing. Additionally, this method returns a list of _elements_ not _nodes_, which is what `NodeList` was returning from the `.childNodes` method. While this may appear as a discrepancy, take note that interface `Element` extends from `Node`.

To see these methods in action modify the existing code to:

```tsx
<ul>
  <li>First :)</li>
  <li>Second!</li>
  <li>Third times a charm.</li>
</ul>;

const first = document.querySelector("li"); // returns the first li element
const all = document.querySelectorAll("li"); // returns the list of all li elements
```

## Interested in learning more?

The best part about the _lib.dom.d.ts_ type definitions is that they are reflective of the types annotated in the Mozilla Developer Network (MDN) documentation site. For example, the `HTMLElement` interface is documented by this [HTMLElement page](https://developer.mozilla.org/docs/Web/API/HTMLElement) on MDN. These pages list all available properties, methods, and sometimes even examples. Another great aspect of the pages is that they provide links to the corresponding standard documents. Here is the link to the [W3C Recommendation for HTMLElement](https://www.w3.org/TR/html52/dom.html#htmlelement).

Sources:

* [ECMA-262 Standard](http://www.ecma-international.org/ecma-262/10.0/index.html)
* [Introduction to the DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)