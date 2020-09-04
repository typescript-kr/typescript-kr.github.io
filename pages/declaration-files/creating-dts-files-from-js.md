---
title: Creating .d.ts Files from .js files
layout: docs
permalink: /docs/handbook/declaration-files/dts-from-js.html
oneline: "How to add d.ts generation to JavaScript projects"
---

[TypeScript 3.7에서](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs),
TypeScript는 JSDoc 구문을 사용한 JavaScript에서 .d.ts 파일을 생성할 수 있게 되었습니다.

즉 프로젝트를 TypeScript에 이식하거나(porting) 코드베이스에 .d.ts 파일을 유지하지 않고도 TypeScript 기반 편집기의 환경을 유지할 수 있습니다.
TypeScript는 대부분의 JSDoc 태그를 지원하며, [참조](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc)에서 찾을 수 있습니다.

## .d.ts 파일 생성을 위한 프로젝트 설정 (Setting up your Project to emit .d.ts files)

.d.ts 파일을 프로젝트에서 생성하려면, 다음과 같은 4단계를 거쳐야합니다:

* 개발 의존성에 TypeScript 추가
* TypeScript 설정을 위해 `tsconfig.json` 추가
* JS 파일에 해당하는 d.ts 파일을 생성하기 위해 TypeScript 컴파일 실행
* (선택적으로) 타입을 참조하기 위한 package.json 수정

### TypeScript 추가 (Adding TypeScript)

[설치 페이지](https://www.typescriptlang.org/download)에서 방법을 확인할 수 있습니다.

### TSConfig

TSConfig는 컴파일러 플래그를 구성하고 파일을 찾을 위치를 선언하는 json5 파일입니다.
위와 같은 경우, 다음과 같은 파일이 필요합니다:

```json5
{
  // 프로젝트에 알맞게 수정하세요.
  include: ["src/**/*"],

  compilerOptions: {
    // 일반적으로 소스 파일로 무시되기 때문에,
    // TypeScript가 JS 파일을 읽도록 지시합니다.
    allowJs: true,
    // d.ts 파일을 생성시킵니다.
    declaration: true,
    // 컴파일러 실행이 오직
    // d.ts 파일만 출력하게 합니다.
    emitDeclarationOnly: true,
    // 타입은 이 디렉터리 안에 존재해야 합니다.
    // 해당 설정을 제거하면,
    // .d.ts 파일이 .js 파일 옆에 생성됩니다.
    outDir: "dist",
  },
}
```

[tsconfig 참조](/reference)에서 더 많은 옵션을 찾을 수 있습니다.
TSConfig 파일을 사용하는 대신 CLI를 사용할 수 있습니다.

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## 컴파일러 실행 (Run the compiler)

[설치 페이지](https://www.typescriptlang.org/download)에서 방법을 확인할 수 있습니다.
프로젝트의 `.gitignore`에 파일이 있을 때, 이러한 파일들이 패키지에 포함되어 있는지 확인합니다.

## package.json 수정 (Editing the package.json)

TypeScript는 .d.ts 파일을 찾기 위한 추가 단계와 함께 `package.json`의 모듈에 대한 노드 관계(node resolution)를 복제합니다.
대략적으로 먼저 선택적인 `"types"` 필드를 확인 후, 다음은 `"main"`, 마지막으로 루트에서 `index.d.ts`를 확인합니다.

| Package.json              | 기본 .d.ts의 위치                 |
| :------------------------ | :----------------------------- |
| "types" 필드 없음           | "main" 확인 후, index.d.ts 확인   |
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./main/main.d.ts               |

type 필드가 없다면, "main"으로 넘어갑니다.

| Package.json             | 기본 .d.ts의 위치            |
| :----------------------- | :------------------------ |
| "main" 필드 없음           | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## 팁 (Tips)

.d.ts의 테스트를 작성하고 싶다면, [tsd](https://github.com/SamVerschueren/tsd)를 사용해보세요.