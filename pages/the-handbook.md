---
title: The TypeScript Handbook
layout: docs
permalink: /docs/handbook/intro.html
oneline: Your first step to learn TypeScript
---

## 핸드북에 대해서 (About this Handbook)

JavaScript는 프로그래밍 커뮤니티에 도입된 지 20년이 지난 지금, 가장 널리 퍼진 cross-platform 언어 중 하나입니다. JavaScript는 웹 페이지에 사소한 상호작용을 추가하기 위한 작은 스크립팅 언어로 시작하여, 규모에 상관없이 프런트엔드와 백엔드 애플리케이션에서 선택 가능한 언어로 성장했습니다. JavaScript로 작성된 프로그램의 크기, 스코프 및 복잡성은 기하급수적으로 커졌지만, 다른 코드 단위 간의 관계를 표현하는 JavaScript 언어의 능력은 그렇지 못했습니다. JavaScript의 다소 특이한 런타임 의미 체계(runtime semantics)와 결합하여, 언어와 프로그램 복잡성 간의 이러한 불일치는 JavaScript 개발을 규모에 맞게 관리하기 어려운 작업으로 만들었습니다.

프로그래머들이 쓰는 가장 일반적인 종류의 오류는 타입 오류로 설명할 수 있습니다: 다른 종류의 값이 예상되는 곳에 특정한 값이 사용된 경우입니다. 이는 단순한 오타, 라이브러리의 API를 이해하지 못한 것, 런타임 동작에 대한 부정확한 가정 또는 기타 오류 때문일 수 있습니다. TypeScript의 목표는 JavaScript 프로그램의 정적 타입 검사자(typechecker) 가 되는 것입니다. 즉, 코드가 실행되기 전에 실행하고(정적), 프로그램 타입이 정확한지 확인하는 도구(타입 검사)가 되는 것입니다.

JavaScript에 대한 배경지식 없이 TypeScript를 첫 번째 언어로 사용한다면, 먼저 [Mozilla 웹 문서에서 JavaScript에 대한](https://developer.mozilla.org/docs/Web/JavaScript/Guide) 문서를 읽어 보는 것이 좋습니다.
다른 언어에 대한 경험이 있다면, 핸드북을 읽으면서 JavaScript 구문을 꽤 빠르게 익힐 수 있을 것입니다.

## How is this Handbook Structured

The handbook is split into two sections:

* **The Handbook**

  The TypeScript Handbook is intended to be a comprehensive document that explains TypeScript to everyday programmers. You can read the handbook by going from top to bottom in the left-hand navigation.

  You should expect each chapter or page to provide you with a strong understanding of the given concepts. The TypeScript Handbook is not a complete language specification, but it is intended to be a comprehensive guide to all of the language's features and behaviors.

  A reader who completes the walkthrough should be able to:

  * Read and understand commonly-used TypeScript syntax and patterns
  * Explain the effects of important compiler options
  * Correctly predict type system behavior in most cases
  * Write a .d.ts declaration for a simple function, object, or class

  In the interests of clarity and brevity, the main content of the Handbook will not explore every edge case or minutiae of the features being covered. You can find more details on particular concepts in the reference articles.

* **The Handbook Reference**

  The handbook reference is built to provide a richer understanding of how a particular part of TypeScript works. You can read it top-to-bottom, but each section aims to provide a deeper explanation of a single concept - meaning there is no aim for continuity.

### Non-Goals

The Handbook is also intended to be a concise document that can be comfortably read in a few hours. Certain topics won't be covered in order to keep things short.

Specifically, the Handbook does not fully introduce core JavaScript basics like functions, classes, and closures. Where appropriate, we'll include links to background reading that you can use to read up on those concepts.

The Handbook also isn't intended to be a replacement for a language specification. In some cases, edge cases or formal descriptions of behavior will be skipped in favor of high-level, easier-to-understand explanations. Instead, there are separate reference pages that more precisely and formally describe many aspects of TypeScript's behavior. The reference pages are not intended for readers unfamiliar with TypeScript, so they may use advanced terminology or reference topics you haven't read about yet.

Finally, the Handbook won't cover how TypeScript interacts with other tools, except where necessary. Topics like how to configure TypeScript with webpack, rollup, parcel, react, babel, closure, lerna, rush, bazel, preact, vue, angular, svelte, jquery, yarn, or npm are out of scope - you can find these resources elsewhere on the web.

## Get Started

Before getting started with [Basic Types](/docs/handbook/basic-types.html), we recommend reading one of the following introductory pages. These introductions are intended to highlight key similarities and differences between TypeScript and your favored programming language, and clear up common misconceptions specific to those languages.

* [TypeScript for New Programmers](/docs/handbook/typescript-from-scratch.html)
* [TypeScript for JavaScript Programmers](/docs/handbook/typescript-in-5-minutes.html)
* [TypeScript for OOP Programmers](/docs/handbook/typescript-in-5-minutes-oop.html)
* [TypeScript for Functional Programmers](/docs/handbook/typescript-in-5-minutes-func.html)
