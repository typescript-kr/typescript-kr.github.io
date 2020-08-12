---
title: Using Babel with TypeScript
layout: docs
permalink: /docs/handbook/babel-with-typescript.html
oneline: How to create a hybrid Babel + TypeScript project
---

# Babel vs `tsc` for TypeScript
# Babel vs TypeScript의 `tsc`

When making a modern JavaScript project, you might ask yourself what the right way to convert files from TypeScript to JavaScript.

모던 JavaScript 프로젝트를 만들 때, 여러분은 TypeScript에서 JavaScript로 파일을 변환하는 올바른 방법이 무엇인지 고민하게 될 것입니다.

A lot of the time the answer is _"it depends"_, or _"someone may have decided for you"_ depending on the project. If you are building your project with an existing framework like [tsdx](https://www.npmjs.com/package/tsdx), [Angular](https://angular.io/), [NestJS](https://nestjs.com/) or any framework mentioned in the [Getting Started](/docs/home) then this decision is handled for you.

대부분의 경우, 이 질문의 대답은 프로젝트마다 `"~에 달려있다"` 혹은 `"~누군가 여러분 대신해서 결정했을지도 모른다` 일 것입니다. 만약 [tsdx](https://www.npmjs.com/package/tsdx), [Angular](https://angular.io/), [NestJS](https://nestjs.com/)와 같이 이미 존재하는 프레임워크 혹은 [Getting Started](/docs/home)에 언급된 그 어떤 프레임워크를 사용하여 프로젝트를 만들고 있다면, 해결책은 여러분의 손에 달려있습니다.

However, a useful heuristic could be:

하지만, 유용한 heuristic은 다음과 같습니다:

* Is your build output mostly the same as your source input files? Use `tsc`
* Do you need a build pipeline with multiple potential outputs? Use `babel` for transpiling and `tsc` for type checking

* 빌드 출력 결과가 소스 입력 파일과 거의 비슷한가요? `tsc`를 사용하세요.
* 잠재 산출 결과물을 내는 빌드 파이프라인이 필요하신가요? `babel`로 트랜스파일링을 하고, `tsc`로 타입체크를 하세요.

## Babel for transpiling, `tsc` for types

## 트랜스파일링은 Babel, 타입은 `tsc`

This is a common pattern for projects with existing build infrastructure which may have been ported from a JavaScript codebase to TypeScript.

JavaScript 코드베이스를 TypeScript로 포팅 되었을 수 있는 기존 빌드 인프라 구조를 가진 프로젝트의 일반적인 패턴입니다.

This technique is a hybrid approach, using Babel's [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) to generate your JS files, and then using TypeScript to do type checking and `.d.ts` file generation.

Babel의 [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)을 사용하여 JS 파일을 생성하고, 타입을 체크하고, `.d.ts` 파일 생성을 위해 TypeScript를 사용하는 방법인데 이는 하이브리드식 접근법입니다.

By using babel's support for TypeScript, you get the ability to work with existing build pipelines and are more likely to have a faster JS emit time because Babel does not type check your code.

Babel의 TypeScript 지원을 사용하여 기존 빌드 파이프라인으로 작업할 수 있으며, Babel은 코드의 타입을 체크하지 않기 때문에, JS 실행 시간이 더 빨라질 것입니다.

#### Type Checking and d.ts file generation

#### 타입 체킹과 d.ts 파일 생성

The downside to using babel is that you don't get type checking during the transition from TS to JS. This can mean that type errors which you miss in your editor could sneak through into production code.

Babel 사용의 단점은, TS를 JS로 전환하는 동안, 타입 체크를 할 수 없다는 점입니다. 즉, 텍스트 편집기에서 타입 오류를 잡지 못하고 배포 코드에 몰래 들어갈 수 있다는 뜻입니다.

In addition to that, Babel cannot create `.d.ts` files for your TypeScript which can make it harder to work with your project if it is a library.

게다가, Babel은 TypeScript에 대한 `.d.ts` 파일을 만들 수 없기 때문에, 여러분의 프로젝트가 라이브러리라면, 작업이 더 힘들어질 수 있습니다.

To fix these issues, you would probably want to set up a command to type check your project using TSC. This likely means duplicating some of your babel config into a corresponding [`tsconfig.json`](/tconfig) and ensuring these flags are enabled:

이와 같은 문제를 수정하기위해선, TSC를 사용하여 프로젝트의 타입을 체크할 수 있는 명령어를 설정하고 싶으실 것입니다. 이는 Babel 설정의 일부를 해당 [`tsconfig.json`](/tconfig)에 복사하고, 다음 플래그를 사용하도록 설정해줍니다:

```json
"compilerOptions": {
  // Ensure that .d.ts files are created by tsc, but not .js files
  "declaration": true,
  "emitDeclarationOnly": true,
  // Ensure that Babel can safely transpile files in the TypeScript project
  "isolatedModules": true
}
```

```json
"compilerOptions": {
  // tsc를 통해 .js 파일이 아닌 .d.ts 파일이 생성되도록 합니다.
  "declaration": true,
  "emitDeclarationOnly": true,
  // Babel이 TypeScript 프로젝트의 파일을 안전하게 트랜스파일링할 수 있도록 합니다.
  "isolatedModules": true
}
```

For more information on these flags:

다음 플래그들에 대한 더 많은 정보는 다음을 참고해주세요.:

* [`isolatedModules`](/tsconfig#isolatedModules)
* [`declaration`](/tsconfig#declaration), [`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)