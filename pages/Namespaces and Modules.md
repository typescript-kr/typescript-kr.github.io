> **용어에 대한 참고 사항:**
TypeScript 1.5에 명칭이 변경되었습니다.  
"내부 모듈"은 이제 "네임스페이스"입니다.  
"외부 모듈"은 [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)의 용어에 맞게 간단히 "모듈"입니다 (즉 모듈 X { 는 현재 선호되는 네임스페이스 X { 와 동일합니다).

# 소개

이 게시물은 TypeScript의 네임스페이스와 모듈을 사용하여 구성하는 다양한 방법을 설명합니다.  
또한 네임스페이스와 모듈을 사용하는 방법에 대한 몇가지 고급 주제를 살펴보고 TypeScript에서 사용할 때 일반적인 몇가지 함정을 다룰 예정입니다.

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

또한 Node.js 애플리케이션의 경우 모듈이 기본이며 코드를 구조화하기위한 권장 방법임을 유의해야합니다.

ECMAScript 2015 부터는 모듈은 언어의 기본 요소이며 모든 호환 엔진 구현에서 지원해야합니다.  
따라서 새로운 프로젝트의 경우 모듈이 코드 구성 메커니즘의 권장 사항이 됩니다.

# 네임스페이스와 모듈의 위험 (Pitfalls of Namespaces and Modules)

이 섹션에서는 네임스페이스와 모듈을 사용할 때 흔히 발생하는 다양한 위험에 대해 설명하고 이를 피하는 방법에 대해 알아보겠습니다.

## `/// <reference>`-ing a module

A common mistake is to try to use the `/// <reference ... />` syntax to refer to a module file, rather than using an `import` statement.
To understand the distinction, we first need to understand how compiler can locate the type information for a module based on the path of an `import` (e.g. the `...` in `import x from "...";`, `import x = require("...");`, etc.) path.

The compiler will try to find a `.ts`, `.tsx`, and then a `.d.ts` with the appropriate path.
If a specific file could not be found, then the compiler will look for an *ambient module declaration*.
Recall that these need to be declared in a `.d.ts` file.

* `myModules.d.ts`

  ```ts
  // In a .d.ts file or .ts file that is not a module:
  declare module "SomeModule" {
      export function fn(): string;
  }
  ```

* `myOtherModule.ts`

  ```ts
  /// <reference path="myModules.d.ts" />
  import * as m from "SomeModule";
  ```

The reference tag here allows us to locate the declaration file that contains the declaration for the ambient module.
This is how the `node.d.ts` file that several of the TypeScript samples use is consumed.

## Needless Namespacing

If you're converting a program from namespaces to modules, it can be easy to end up with a file that looks like this:

* `shapes.ts`

  ```ts
  export namespace Shapes {
      export class Triangle { /* ... */ }
      export class Square { /* ... */ }
  }
  ```

The top-level module here `Shapes` wraps up `Triangle` and `Square` for no reason.
This is confusing and annoying for consumers of your module:

* `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
  ```

A key feature of modules in TypeScript is that two different modules will never contribute names to the same scope.
Because the consumer of a module decides what name to assign it, there's no need to proactively wrap up the exported symbols in a namespace.

To reiterate why you shouldn't try to namespace your module contents, the general idea of namespacing is to provide logical grouping of constructs and to prevent name collisions.
Because the module file itself is already a logical grouping, and its top-level name is defined by the code that imports it, it's unnecessary to use an additional module layer for exported objects.

Here's a revised example:

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

## Trade-offs of Modules

Just as there is a one-to-one correspondence between JS files and modules, TypeScript has a one-to-one correspondence between module source files and their emitted JS files.
One effect of this is that it's not possible to concatenate multiple module source files depending on the module system you target.
For instance, you can't use the `outFile` option while targeting `commonjs` or `umd`, but with TypeScript 1.8 and later, [it's possible](./release%20notes/TypeScript%201.8.md#concatenate-amd-and-system-modules-with---outfile) to use `outFile` when targeting `amd` or `system`.
