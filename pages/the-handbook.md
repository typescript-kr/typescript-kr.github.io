---
title: The TypeScript Handbook
layout: docs
permalink: /docs/handbook/intro.html
oneline: Your first step to learn TypeScript
---

## 핸드북에 대해서 (About this Handbook)

JavaScript는 프로그래밍 커뮤니티에 도입된 지 20년이 지난 지금, 가장 널리 퍼진 cross-platform 언어 중 하나입니다. JavaScript는 웹 페이지에 사소한 상호작용을 추가하기 위한 작은 스크립팅 언어로 시작하여, 규모에 상관없이 프론트엔드와 백엔드 애플리케이션에서 선택 가능한 언어로 성장했습니다. JavaScript로 작성된 프로그램의 크기, 범위 및 복잡성은 기하급수적으로 커졌지만, 다른 코드 단위 간의 관계를 표현하는 JavaScript 언어의 능력은 그렇지 못했습니다. JavaScript의 다소 특이한 런타임 의미 체계(runtime semantics)와 더불어, 언어와 프로그램 복잡성 간의 불일치는 JavaScript 개발을 규모에 맞게 관리하기 어려운 작업으로 만들었습니다.

프로그래머들이 작성하는 가장 흔한 오류는 타입 오류입니다: 다른 종류의 값이 예상되는 곳에 특정한 값이 사용된 경우입니다. 이는 단순한 오타, 라이브러리 API를 이해하지 못한 것, 런타임 동작에 대한 잘못된 가정 또는 다른 오류 때문일 수 있습니다. TypeScript의 목표는 JavaScript 프로그램의 정적 타입 검사자 입니다. 즉, 코드가 실행되기 전에 실행하고(정적), 프로그램 타입이 정확한지 확인하는 도구(타입 검사)입니다.

JavaScript에 대한 배경지식 없이 TypeScript를 첫 번째 언어로 사용한다면, 먼저 [Mozilla 웹 문서에서 JavaScript에 대한](https://developer.mozilla.org/docs/Web/JavaScript/Guide) 문서를 읽어 보는 것이 좋습니다.
다른 언어에 대한 경험이 있다면, 핸드북을 읽으면서 JavaScript 구문을 꽤 빠르게 익힐 수 있을 것입니다.

## 핸드북은 어떻게 구성되어 있는가? (How is this Handbook Structured)

핸드북은 두 영역으로 나뉩니다:

* **핸드북**

  TypeScript 핸드북은 평범한 프로그래머들에게 TypeScript를 설명하는 종합적인 문서입니다. 왼쪽 메뉴를 통해 위에서 아래로 이동하며 읽을 수 있습니다. 

  각 장 또는 페이지가 주어진 개념에 대해 자세한 설명을 제공할 것이라고 기대할 것입니다. TypeScript 핸드북은 언어에 대한 완전한 설명서는 아니지만, 모든 특징과 동작에 대한 종합적인 가이드입니다.

  실습을 완료한 독자는 다음을 수행할 수 있어야 합니다:

  * 일반적으로 사용하는 TypeScript 구문 및 패턴을 읽고 이해하기
  * 중요한 컴파일러 옵션의 효과 설명하기
  * 대부분의 경우에서 타입 시스템 동작을 올바르게 예측하기
  * 간단한 함수, 객체 또는 클래스에 대한 .d.ts 선언 작성하기

  핸드북의 주요 내용은 명확성과 간결성을 위해, 다루어지고 있는 특징의 모든 엣지 케이스 또는 세부 사항을 탐구하지는 않습니다. 참고문헌에서 특정 개념에 대한 자세한 내용을 찾아볼 수 있습니다.

* **핸드북 레퍼런스**

  핸드북 레퍼런스는 TypeScript의 특정 부분이 어떻게 작동하는지 풍부한 이해를 제공하기 위해 작성되었습니다. 위에서 아래로 읽을 수 있지만, 연속적으로 설명하는 것이 아니라, 각 섹션은 단일 개념에 대한 더 깊은 설명 제공을 목표로 합니다.

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
