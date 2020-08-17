---
제목: TypeScript를 활용한 JS 프로젝트(JS Projects Utilizing TypeScript)
레이아웃: 문서
고유 링크: /docs/handbook/intro-to-js-ts.html
한 줄 설명: TypeScript를 사용하여 JavaScript 파일에 유형 확인을 추가하는 방법
---

TypeScript의 타입시스템은 코드베이스로 작업할 때와 엄격함의 정도가 다릅니다:

* 오직 JavaScript 코드를 사용한 추론만을 기반으로 하는 타입시스템
* [JSDoc를 통한](/docs/handbook/jsdoc-supported-types.html) JavaScript에서의 Incremental typing
* JavaScript에서의 `// @ts-check` 사용
* TypeScript 코드
* [`엄격함`](/tsconfig#strict)이 활성화된 TypeScript

각 단계는 더 안전한 타입시스템을 위한 움직임에 해당하지만, 반드시 모든 프로젝트가 해당 수준에 맞는 검증을 필요로 하는 것은 아닙니다.

## JavaScript를 활용한 TypeScript(TypeScript with JavaScript)

이는 자동 완성, 심벌로 이동 및 이름 바꾸기와 같은 리팩터링(refactoring) 도구와 같은 툴을 제공하기 위하여 TypeScript를 사용하는 편집기를 사용하는 경우에 유용합니다. [홈페이지](/)에는 TypeScript 플러그인들이 있는 편집자 목록이 있습니다.

## JSDoc을 통하여 JS에 타입 힌트 제공(Providing Type Hints in JS via JSDoc)

`.js` 파일에서는, 종종 타입들을 유추할 수 있습니다. 타입들을 유추할 수 없는 경우, JSDoc 구문을 사용하여 구체적으로 밝힐 수 있습니다.

JSDoc 표기들은 선언 전에 와서 특정 선언들의 타입을 설정하는 데 사용됩니다. 예를 들어,

```js twoslash
/** @type {number} */
var x;

x = 0; // 성공
x = false; // 성공?!
```

지원되는 JSDoc 패턴의 전체 목록은 [JSDoc가 지원되는 유형에서](/docs/handbook/jsdoc-supported-types.html) 찾을 수 있습니다.

## `@ts-check`

이전 코드 예시의 마지막 줄은 TypeScript에서 오류를 발생시키지만, JS 프로젝트에서는 기본적으로 오류를 발생시키지 않습니다.
JavaScript 파일에서 오류를 실행하려면 다음을 추가해야 합니다: `.js` 파일의 첫 번째 줄에 `// @ts-check`를 추가하여 TypeScript가 이를 오류로 올리도록 해야 합니다.

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // 성공
x = false; // 성공 아님
```

만일 오류를 추가하려는 JavaScript 파일이 많은 경우, [`jsconfig.json`](/docs/handbook/tsconfig-json.html) 역시 사용할 수 있습니다.
파일에 `// @ts-nocheck` 코멘트를 추가하면 일부 파일 확인을 건너뛸 수 있습니다.

TypeScript는 당신이 동의하지 않는 오류들을 제공할 수도 있는데, 이 경우 특정 줄 맨앞에 `// @ts-ignore` 또는 `// @ts-expect-error`를 추가하여 그 줄의 오류를 무시할 수 있습니다.

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // 성공
// @ts는-오류라고-판단할 코드
x = false; // 성공 아님
```

JavaScript를 TypeScript로 해석하는 방법에 대한 자세한 내용은 [TS Type이 JS를 체크하는 방법](/docs/handbook/type-checking-javascript-files.html)을 참고하시기 바랍니다.