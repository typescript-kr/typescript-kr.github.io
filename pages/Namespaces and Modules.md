> **용어에 대한 참고 사항:**
TypeScript 1.5에 명칭이 변경되었습니다.  
"내부 모듈"은 이제 "네임스페이스"입니다.  
"외부 모듈"은 [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)의 용어에 맞게 간단히 "모듈"입니다 (즉 모듈 X { 는 현재 선호되는 네임스페이스 X { 와 동일합니다).

# 소개

이 게시물은 TypeScript의 네임스페이스와 모듈을 사용하여 구성하는 다양한 방법을 설명합니다.  
또한 네임스페이스와 모듈을 사용하는 방법에 대한 몇 가지 고급 주제를 살펴보고 TypeScript에서 사용할 때 일반적인 몇 가지 함정을 다룰 예정입니다.

[모듈](./Modules.md)에 대한 자세한 내용은 모듈의 문서를 참조하세요.  
[네임스페이스](./Namespaces.md)에 대한 자세한 내용은 네임스페이스의 문서를 참조하세요.

# 네임스페이스 사용하기 (Using Namespaces)

네임스페이스는 전역 네임스페이스에서 JavaScript 객체로 불립니다.  
네임스페이스를 매우 사용하기 간단한 구조로 만듭니다.  
여러 파일에 걸쳐있을 수 있으며 `--outFile`을 사용하여 연결될 수 있습니다.  
네임스페이스는 HTML 페이지에 `<script>` 태그로 포 된 모든 의존성을 가진 웹 애플리케이션에서 코드를 구조화하는 좋은 방법이 될 수 있습니다.

모든 전역 네임스페이스 오염과 마찬가지로, 특히 대규모 애플리케이션에서는 구성 요소 의존성을 식별하기 어려울 수 있습니다.

# 모듈 사용하기 (Using Modules)

네임 스페이스와 마찬가지로 모듈에는 코드와 선언을 모두 포함시킵니다.  
가장 큰 차이점은 모듈이 의존성을 *선언*한다는 것입니다.

모듈은 또한 모듈 로더에 대한 의존성을 가지고 있습니다 (예: CommonJs/Require.js)  
작은 JS 애플리케이션의 경우는 최적이 아닐 수도 있지만 대규모 애플리케이션의 경우 장기적인 모듈성 및 유지 관리에 이점이 있습니다.  
모듈은 더 나은 코드 재사용, 강력한 격리 및 번들링을 위한 향상된 도구 지원을 제공합니다.

또한 Node.js 애플리케이션의 경우 모듈이 기본이며 코드를 구조화하기 위한 권장 방법임을 유의해야 합니다.

ECMAScript 2015 부터는 모듈은 언어의 기본 요소이며 모든 호환 엔진 구현에서 지원해야 합니다.  
따라서 새로운 프로젝트의 경우 모듈이 코드 구성 메커니즘의 권장 사항이 됩니다.

# 네임스페이스와 모듈의 위험 (Pitfalls of Namespaces and Modules)

이 섹션에서는 네임스페이스와 모듈을 사용할 때 흔히 발생하는 다양한 위험에 대해 설명하고 이를 피하는 방법에 대해 알아보겠습니다.

## `/// <reference>`-ing a module

일반적인 실수는 `import` 문을 사용하는 대신 모듈 파일을 참조하기 위해 `/// <reference ... />` 문을 사용하는 것이다.  
차이점을 이해하기 위해서는, 우선 컴파일러가 `import`(예:'...'에서 '...',`import x from "...";`에서 `import x = require("...");` 경로를 기반으로 모듈에 대한 타입 정보를 찾는 방법을 먼저 이해할 필요가 있습니다.

컴파일러는 적절한 경로로 `.ts`, `.tsx` 그리고`.d.ts`를 찾으려 할 겁니다.  
특정 파일을 찾을 수 없으면 컴파일러는 *ambient 모듈 선언*을 찾습니다.  
이 파일들을 `.d.ts` 파일에 선언해야 한다는 것을 기억해야 합니다.

* `myModules.d.ts`

  ```ts
  // 모듈이 아닌 .d.ts 파일 또는 .ts 파일:
  declare module "SomeModule" {
      export function fn(): string;
  }
  ```

* `myOtherModule.ts`

  ```ts
  /// <reference path="myModules.d.ts" />
  import * as m from "SomeModule";
  ```

여기서 참조 태그는 ambient 모듈에 대한 선언을 포함하는 선언 파일을 찾을 수 있게 해줍니다.  
이것은 다수의 TypeScript 샘플에서 사용되는 `node.d.ts` 파일이 사용되는 방법입니다.

## 불필요한 네임스페이스 (Needless Namespacing)

프로그램을 네임스페이스에서 모듈로 변환하는 경우에는 다음과 파일로 같은 쉽게 끝날 수 있습니다:

* `shapes.ts`

  ```ts
  export namespace Shapes {
      export class Triangle { /* ... */ }
      export class Square { /* ... */ }
  }
  ```

여기 최상위 모듈인 `Shapes`은 `Triangle`과 `Square`를 감싸고 있는 데 아무런 이유가 없습니다.  
이는 모듈의 사용자들을 혼란스럽고 성가시게 합니다:

* `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
  ```

TypeScript에서 모듈의 주요 특징은 두 개의 서로 다른 모듈이 동일한 스코프에 이름을 제공하지 않는다는 것입니다.  
모듈의 사용자가 할당할 이름을 결정하기 때문에 네임스페이스에서 내보낸 심볼을 사전에 감쌀 필요가 없습니다.

모듈 내용의 네임스페이스를 지정하지 않아야 하는 이유를 반복해서 설명하기 위해 Namespacing은 구조의 논리적 그룹을 제공하고 이름 충돌을 방지하는 것입니다.  
모듈 파일 자체는 논리적 그룹이며 최상위 이름은 이를 가져오는 코드에 의해 정의되기 때문에 내보낸 객체에 대해 추가적인 모듈 계층을 사용할 필요가 없습니다.

다음은 수정된 예입니다.

* `shapes.ts`

  ```ts
  export class Triangle { /* ... */ }
  export class Square { /* ... */ }
  ```

* `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Triangle();
  ```

## 모듈의 관계 (Trade-offs of Modules)

JS 파일과 모듈 사이에 일대일 대응이 있는 것과 마찬가지로 TypeScript는 모듈 소스 파일과 방출된 JS 파일 간에 일대일 대응을 합니다.  
이에 따른 한가지 효과는 대상 모듈 시스템에 따라 여러 모듈 소스 파일을 연결할 수 없다는 것입니다.  
예를 들어 `commonjs` 또는 `umd`를 대상으로 하는 동안 `outFile` 옵션을 사용할 수 없지만 TypeScript 1.8 이상에서는 `amd` 또는 `system`을 대상으로 지정할 때 `outFile`을 사용[할 수 있습니다](./release%20notes/TypeScript%201.8.md#concatenate-amd-and-system-modules-with---outfile).