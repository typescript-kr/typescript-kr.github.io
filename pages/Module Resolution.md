> 이번 섹션에서는 모듈에 대한 몇 가지 기본 지식을 전제로합니다. 자세한 내용은 [모듈](./Modules.md)을 참조하세요.

*모듈 resolution*은 import가 무엇을 참조하는지 파악하기 위해 컴파일러가 사용하는 프로세스입니다.  
`import { a } from "moduleA"`와 같은 import 문을 고려하세요.  

a의 사용을 검사하기 위해서는 컴파일러는 그것이 무엇을 의미하는지 정확히 알아야 하며 그것의 정의인 `moduleA`를 검사해야 할 필요가 있습니다.

이때 컴파일러가 "`moduleA`의 형태가 무엇입니까?"라고 묻습니다.  
이것은 간단하게 들릴지 모르지만 `moduleA`는 자신의 `.ts`/`.tsx` 파일들 중 하나 또는 사용자의 코드가 의존하는 `.d.ts` 파일 중 하나에서 정의될 수 있습니다.

먼저 컴파일러는 가져온 모듈을 나타내는 파일을 찾습니다.  
이렇게하기 위해 컴파일러는 다음 두 가지 전략 중 하나를 따릅니다: [클래식](#classic) 또는 [노드](#node).  
이 전략은 컴파일러에게 `moduleA`를 찾을 위치를 알려줍니다.

그래도 작동하지 않고 모듈 이름이 관련이 없는 경우(`"moduleA"`의 경우에는)  컴파일러는 [ambient module declaration](./Modules.md#ambient-modules)을 찾으려고 시도할 것입니다.  
다음에 Non-relative imports에 대해 다룰 것입니다.

마지막으로 컴파일러가 모듈을 해석하지 못하면 오류를 기록합니다.  
이 경우 오류는 `오류 TS2307 : 모듈 'moduleA'을 찾을 수 없습니다.`

## 상대적 vs. 비-상대적 모듈 import (Relative vs. Non-relative module imports)

모듈 imports는 모듈 참조가 상대적인지 아닌지에 따라 다르게 처리됩니다.

*relative import*는 `/`, `./` 또는 `../` 로 시작하는 임포트입니다.  
몇 가지 예는 다음과 같습니다:

* `import Entry from "./components/Entry";`
* `import { DefaultHeaders } from "../constants/http";`
* `import "/mod";`

다른 모든 import는 **non-relative**로 간주됩니다.  
몇 가지 예는 다음과 같습니다:

* `import * as $ from "jquery";`
* `import { Component } from "@angular/core";`

import된 파일과 관련하여 relative import가 해석되었으며 ambient module declaration에 으로 해석할 수는 없습니다.  
상대적인 위치를 런타임에 유지할 수 있도록 보장되는 모듈에 relative imports를 사용해야 합니다.

non-relative import는 `baseUrl`을 기준 또는 경로 매핑을 통해 해석될 수 있습니다.  
또한 [ambient module declarations](./Modules.md#ambient-modules)으로 해석할 수도 있습니다.  
외부의 의존성을 가져올 때는 non-relative 경로를 사용하세요.

## 모듈 해석 전략 (Module Resolution Strategies)

모듈 해석 전략에는 두가지가 있습니다: [노드](#node)와 [클래식](#classic).  
`--moduleResolution`를 사용하여 모듈 해석 전략을 지정할 수 있습니다.  
지정하지 않은 경우 기본값은 `--module AMD | System | ES2015`인 경우 [클래식](#classic)이며 그렇지 않다면 [노드](#node)입니다.

### 클래식 (Classic)

이것은 TypeScript의 기본 해석 전략이었습니다.  
요즘은 주로 이전 버전과의 호환성을 위해 이 전략이 존재합니다.

relative import는 import된 파일과 관련하여 해석됩니다.  
그러므로 소스 파일 `/root/src/folder/A.ts`에 있는 `import { b } from "./moduleB"`를 실행하면 다음과 같은 결과가 나옵니다:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

그러나 non-relative 모듈 imports의 경우 컴파일러는 imports 파일이 포함된 디렉토리부터 시작하여 일치하는 정의 파일을 가져오기 위해 디렉토리 트리를 찾으려합니다.

예를 들면:


`moduleB`를 소스 파일에서 `import { b } from "moduleB"`와 같이 상대적으로 가져오지 않으면 `"moduleB"`를 찾기 위해 다음과 같은 위치에서 찾게 됩니다:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

### 노드 (Node)

이 해석 전략은 런타임에 [Node.js](https://nodejs.org/) 모듈 분석 메커니즘을 모방하려고 시도합니다.  
전체 Node.js 해석 알고리즘은 [Node.js 모듈 문서](https://nodejs.org/api/modules.html#modules_all_together)에 설명되어 있습니다.

#### Node.js 모듈 해석 방법 (How Node.js resolves modules)

TS 컴파일러가 따르는 단계를 이해하려면 Node.js 모듈에 대해 설명하는 것이 중요합니다.  
전통적으로, Node.js의 import는 `require`라는 함수를 호출함으로써 수행됩니다.  
Node.js가 취하는 동작은 `require`에 상대 경로인지 비-상대 경로인지에 따라 달라집니다.

상대 경로는 매우 간단합니다.  
예를 들어 `var x = require("./moduleB");` import가 포함된 `/root/src/moduleA.js`에 있는 파일을 살펴보겠습니다.  
Node.js는 가져 오기를 다음 순서로 해석합니다:

1. `/root/src/moduleB.js`라는 이름의 파일이 존재합니다.

2. `"main"` 모듈을 지정하는 `package.json` 파일이 포함된 경우 `/root/src/moduleB` 폴더로 지정합니다.  
   이 예에서, Node.js가 `{ "main": "lib/mainModule.js" }`를 포함하는 `/root/src/moduleB/package.json` 파일을 찾으면 Node.js는 `/root/src/moduleB/lib/mainModule.js`를 참조합니다.

3. `index.js`라는 파일이 포함되어 있다면 `/root/src/moduleB` 폴더로 간주합니다.  
   그 파일은 암시적으로 그 폴더의 "메인" 모듈로 여겨집니다.

이에 대한 자세한 내용은 [파일 모듈](https://nodejs.org/api/modules.html#modules_file_modules)과 [폴더 모듈](https://nodejs.org/api/modules.html#modules_folders_as_modules)에 대한 Node.js 문서를 참조하세요.

그러나 [non-relative module name](#relative-vs-non-relative-module-imports)의 해석은 다르게 수행됩니다.  
node는 node_modules라는 특수 폴더에서 모듈을 검색합니다.  
`node_modules` 폴더는 현재 파일과 동일한 레벨이거나 디렉토리 체인에서 상위 레벨 일 수 있습니다.  
node는 불러오기 위한 모듈을 찾을 때까지 각 `node_modules`를 보고 디렉토리 체인을 거슬러 올라갑니다.

위의 예제를 따르면, `/root/src/moduleA.js`가 비-상대 경로를 대신 사용하여 `var x = require("moduleB");` import를 가지고 있는지 고려해보세요.

그런 다음 Node는 `moduleB`가 작동할 때까지 각 위치에 대해 해석을 시도합니다.

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json` (`"main"` 프로퍼티 지정)
3. `/root/src/node_modules/moduleB/index.js`
   <br /><br />
4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json` (`"main"` 프로퍼티 지정)
6. `/root/node_modules/moduleB/index.js`
   <br /><br />
7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json` (`"main"` 프로퍼티 지정)
9. `/node_modules/moduleB/index.js`

Node.js가 (4)와 (7)에서 디렉토리 이동했음을 주목하세요.

이 프로세스에 대한 자세한 내용은 [node_modules에서 모듈을 로드](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)하는 방법에 대한 node.js 문서를 참조하세요.

#### TypeScript 모듈 해석 방법 (How TypeScript resolves modules)

TypeScript는 컴파일 타임에 모듈에 대한 정의 파일을 찾기 위해 Node.js 런타임 해석 전략을 모방합니다.  
이를 달성하기 위해 TypeScript는 TypeScript 원본 파일 확장자 (`.ts`, `.tsx`, 및 `.d.ts`)을 노드의 해석 로직 위에 덮어씌웁니다.  
TypeScript는 또한 `"main"`의 목적을 반영하기 위해 `package.json`에 있는 ``types"` 필드를 사용합니다 - 컴파일러가 이를 사용하여 참조할 "main" 정의 파일을 찾습니다.

예를 들어 `/root/src/moduleA.ts`에서 `import { b } from "./moduleB"`와 같은 import 문은 `"./moduleB"`를 찾기 위해 다음 위치에서 시도하게됩니다:

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json` (`"types"` 프로퍼티 지정)
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

Node.js는 `moduleB.js` 파일을 찾은 다음, 적용 가능한 `package.json` 파일을 찾아 `index.js` 파일을 찾습니다.

마찬가지로 비-상대적인 import에서는 Node.js 해석 로직을 따르고 먼저 파일을 검색한 다음 적용 가능한 폴더를 찾습니다.  
따라서 소스 파일 `/root/src/moduleA.ts`에서  `import { b } from "moduleB"`는 다음과 같은 조회를 하게 됩니다:

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json` (`"types"` 프로퍼티 지정)
5. `/root/src/node_modules/moduleB/index.ts`
6. `/root/src/node_modules/moduleB/index.tsx`
7. `/root/src/node_modules/moduleB/index.d.ts`
   <br /><br />
8. `/root/node_modules/moduleB.ts`
9. `/root/node_modules/moduleB.tsx`
10. `/root/node_modules/moduleB.d.ts`
11. `/root/node_modules/moduleB/package.json` (`"types"` 프로퍼티 지정)
12. `/root/node_modules/moduleB/index.ts`
13. `/root/node_modules/moduleB/index.tsx`
14. `/root/node_modules/moduleB/index.d.ts`
    <br /><br />
15. `/node_modules/moduleB.ts`
16. `/node_modules/moduleB.tsx`
17. `/node_modules/moduleB.d.ts`
18. `/node_modules/moduleB/package.json` (`"types"` 프로퍼티 지정)
19. `/node_modules/moduleB/index.ts`
20. `/node_modules/moduleB/index.tsx`
21. `/node_modules/moduleB/index.d.ts`

단계의 수에 겁먹지마세요 - TypeScript는 여전히 단계 (8)과 (15)에서 디렉토리를 두 번 점프합니다.  
이것은 정말로 Node.js보다 복잡하지 않습니다.

## 추가적인 모듈 해석 알리기 (Additional module resolution flags)

프로젝트 소스 레이아웃이 출력 결과와 일치하지 않는 경우가 있습니다.  
일반적으로 일련의 빌드 단계의 집합에서 최종 출력을 생성합니다.  
여기에는 `.ts` 파일을 `.js`로 컴파일하는 것과 다른 소스 위치의 의존성을 하나의 출력 위치에 복사하는 것이 포함됩니다.  
최종적으로 런타임에 모듈의 이름이 정의를 포함하는 소스 파일과 다를 수 있다는 것입니다.  
또는 최종 출력의 모듈 경로가 컴파일 시 해당 소스 파일 경로와 일치하지 않을 수 있습니다.

TypeScript 컴파일러에는 최종 출력을 생성하기 위해 소스에 발생할 것으로 예상되는 변환의 컴파일러에 정보를 *제공하기 위한* 추가적인 것들이 있습니다.

컴파일러가 이러한 변환을 하지 *않을 것*을 주목하는 것이 중요합니다.  
이 정보를 사용하여 모듈 import를 정의 파일로 해석하는 프로세스를 안내합니다.

### Base URL
baseUrl을 사용하는 것은 모듈이 런타임에 단일 폴더로 "배포"되는 AMD 모듈 로더를 사용하는 어플리케이션에서의 일반적인 방법입니다.  
이러한 모듈의 소스는 서로 다른 디렉토리에 존재할 수 있지만 빌드 스크립트에 의해 모두 결합되어 구성됩니다. 

`baseUrl`을 설정하면 컴파일러에게 어디에서 모듈을 찾을 수 있는지 알려줍니다.  
비-상대적 이름을 가진 모든 모듈 imports는 `baseUrl`에 상대적인 것으로 가정됩니다.

*baseUrl* 값은 다음 중 하나로 결정됩니다:

* *baseUrl* 커멘드 라인 인수의 값 (주어진 경로가 상대 경로인 경우 현재의 디렉토리의 위치를 기반으로 계산)
* 'tsconfig.json'의 *baseUrl* 프로퍼티 값 (주어진 경로가 상대 경로인 경우 'tsconfig.json'의 위치를 기반으로 계산)

상대적 모듈 imports는 baseUrl을 설정하면 영향을 받지 않으며 imports 파일과 관련하여 항상 확인되므로 주의해야합니다.

[RequireJS](http://requirejs.org/docs/api.html#config-baseUrl) 및 [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#baseurl) 문서에서 baseUrl에 대한 자세한 설명을 볼 수 있습니다.

### 경로 매핑 (Path mapping)

때때로 모듈은 *baseUrl* 아래에 직접 위치하지 않습니다.  
예를 들어, 모듈 `"jquery"`에 대한 import는 런타임시에 `"node_modules/jquery/dist/jquery.slim.min.js"`로 변환됩니다.  
로더는 매핑 구성을 사용하여 런타임에 모듈 이름을 파일에 매핑 합니다. 자세한 내용은 [RequireJs 문서](http://requirejs.org/docs/api.html#config-paths)와 [SystemJS 문서](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#paths)를 참조하세요.  

TypeScript 컴파일러는 `tsconfig.json`파일에서 `"paths"` 프로퍼티를  사용하여 이러한 매핑을 선언하는 기능을 지원합니다.  
다음은 `jquery`에 대한 `"paths"` 프로퍼티를 지정하는 예제입니다.

```json
{
  "compilerOptions": {
    "baseUrl": ".", // "paths"가 지정된 경우 이 값을 지정해야합니다.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // 이 매핑은 "baseUrl"과 상대적입니다.
    }
  }
}
```

`"paths"`는 `"baseUrl"`에 비례해서 해석된다는 것을 주의하십시오.  
`"baseUrl"`을 `"."`보다 다른 값으로 설정할 때 즉 `tsconfig.json`의 디렉토리일때마다 매핑을 적절하게 변경해야합니다.  
가령 위의 예제에서 `"baseUrl": "./src"`를 설정하면 jquery는 `"../node_modules/jquery/dist/jquery"`에 매핑되어야합니다.

`"paths"`를 사용하면 여러개의 fall back 위치를 포함한 좀 더 정교한 매핑을 사용할 수도 있습니다.  
한 위치에서는 일부 모듈만 사용할 수 있고 나머지는 다른 위치에 있는 프로젝트 구성을 고려해보세요.  
빌드 단계는 모든 것을 한 곳에 한 곳에 모일 것입니다.  

프로젝트 레이아웃은 다음과 같을 수 있습니다:

```tree
projectRoot
├── folder1
│   ├── file1.ts (imports 'folder1/file2' and 'folder2/file3')
│   └── file2.ts
├── generated
│   ├── folder1
│   └── folder2
│       └── file3.ts
└── tsconfig.json
```

해당 `tsconfig.json`은 다음과 같습니다:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": [
        "*",
        "generated/*"
      ]
    }
  }
}
```

이것은 `"*"`(모든 값) 패턴과 일치하는 모듈 import를 컴파일러에게 알려줌으로써 두 위치를 살펴봅니다:

 1. `"*"`: 변경되지 않은 동일한 이름을 의미하기때문에 `<moduleName>` => `<baseUrl>/<moduleName>`을 매핑하세요.
 2. `"generated/*"` 추가된 접두어 "generated"가 붙은 모듈 이름을 의미하기때문에 `<moduleName>` => `<baseUrl>/generated/<moduleName>`을 매핑하세요.

이 로직에 따라 컴파일러는 두 가지 imports를 다음과 같이 해석하기위해 노력합니다:

* import 'folder1/file2'
  1. '*' 패턴이 일치하고 와일드 카드가 전체 모듈 이름을 캡처합니다.
  2. 먼저 목록에 대체를 시도하세요: '*' -> `folder1/file2`
  3. 이에 따른 대체 결과는 비상대적인 이름입니다 - *baseUrl* 와 결합하세요 -> `projectRoot/folder1/file2.ts`.
  4. 좋아요. 파일이 존재합니다.
* import 'folder2/file3'
  1. '*' 패턴이 일치하고 와일드 카드가 전체 모듈 이름을 캡처합니다.
  2. 먼저 목록에 대체를 시도하세요: '*' -> `folder2/file3`
  3. 이에 따른 대체 결과는 비-상대적인 이름입니다 - *baseUrl* 와 결합하세요 -> `projectRoot/folder2/file3.ts`.
  4. 파일이 존재하지 않습니다. 두번째 대체 파일로 이동하세요.
  5. 두번째 대체 'generated/*' -> `generated/folder2/file3`
  6. 이에 따른 대체 결과는 비-상대적인 이름입니다 - *baseUrl* 와 결합하세요 -> `projectRoot/generated/folder2/file3.ts`.
  7. 좋아요. 파일이 존재합니다.

### `rootDirs` 디렉토리 (Virtual Directories with `rootDirs`)

컴파일 시 여러 디렉토리의 프로젝트 소스가 모두 결합되어 단일 출력 디렉토리를 생성하는 경우가 있습니다.  
이것은 소스 디렉토리가 "가상" 디렉토리를 만드는 것으로 볼 수 있습니다.

`rootDirs`를 사용하면 "가상" 디렉토리를 구성하는 *roots*를 컴파일러에 알릴 수 있습니다.  
따라서 컴파일러는 이러한 "가상" 디렉토리내의 상대 모듈 imports를 하나의 디렉토리에 병합된 것*처럼* 해석 할 수 있습니다.

예를 들어 다음 프로젝트 구조를 고려해보세요.

```tree
 src
 └── views
     └── view1.ts (imports './template1')
     └── view2.ts

 generated
 └── templates
         └── views
             └── template1.ts (imports './view2')
```

`src/views`의 파일은 일부 UI컨트롤의 사용자 코드입니다.  
`generated/templates` 파일은 빌드의 일부로 템플릿 생성기에 의해 자동 생성된 UI템플릿 바인딩 코드입니다.   
빌드 단계는 `/src/views` 및 `/generated/templates/views`에 있는 파일을 출력의 동일한 디렉토리에 복사합니다.  
런타임에 뷰는 템플릿이 그 옆에 존재하기를 기대할 수 있으므로 상대적 이름을 `"./template"`로 사용하여 import합니다.

이 관계를 컴파일러에 지정하려면 `"rootDirs"`를 사용하세요.  
`"rootDirs"`은 내용이 런타임에 병합될 것으로 예상되는 *roots* 목록을 지정합니다.  
따라서 우리의 예에 따라, `tsconfig.json`파일은 다음과 같이 보여야 합니다:

```json
{
  "compilerOptions": {
    "rootDirs": [
      "src/views",
      "generated/templates/views"
    ]
  }
}
```

컴파일러가 `rootDirs`의 하위 폴더에 있는 상대적 모듈 가져오기를 볼 때마다 `rootDirs`의 각 항목에서 import를 검색합니다.

`rootDirs`의 유연성은 논리적으로 병합된 물리적 소스 디렉토리 목록 지정에 한정되는 것은 아닙니다.  
제공된 배열은 존재 여부에 관계 없이 원하는 수의 임의 디렉토리 이름을 포함할 수 있습니다.  
이를 통해 컴파일러는 조건부 포함 및 프로젝트 별 로더 플러그인과 같은 정교한 번들 및 런타임 기능을 타입 세이프 방식으로 캡처할 수 있습니다.

빌드 도구가 `./#{locale}/messages`와 같은 상대 모듈 경로의 일부로써 특별한 경로 토큰 `#{locale}`을 삽입하여 지역 특정 번들을 자동으로 생성하는 국제화 시나리오를 생각해보세요.  

이 가상 설정에서 도구는 지원되는 로케일을 열거하고 추상화된 경로를 `./zh/messages`, `./de/messages` 등으로 매핑합니다.  

이러한 각 모듈이 일련의 문자열을 내보낸다고 가정합니다.  
예를 들어 `./zh/messages`에는 다음이 포함될 수 있습니다:

```ts
export default [
    "您好吗",
    "很高兴认识你"
];
```
`rootDirs`를 활용하여 디렉토리가 존재하지 않더라도 이 매핑의 컴파일러에 이를 알려 줌으로써 `./#{locale}/messages`를 안전하게 해결할 수 있습니다.

예를 들어, 다음과 같은 `tsconfig.json`을 함께 사용합니다:

```json
{
  "compilerOptions": {
    "rootDirs": [
      "src/zh",
      "src/de",
      "src/#{locale}"
    ]
  }
}
```

이제 컴파일러는 `import messages from './#{locale}/messages'`에서 `import messages from './zh/messages'`의 메시지를 가져 와서 시간 지원 계획을 해치지 않고 지역에 상관없이 개발할 수 있습니다.

## 모듈 해석 추적 (Tracing module resolution)

앞에서 설명한 것처럼 컴파일러가 모듈을 해석할 때 현재 폴더 외부의 파일들에 방문할 수 있습니다.  
모듈이 해석되지 않은 이유를 진단하거나 잘못된 정의로 해석된 경우에는  문제 해석이 어려울 수 있습니다.  
`--traceResolution`을 사용하여 컴파일러 모듈 해석 추적을 활성화하면 모듈 확인 프로세스 중에 발생한 일에 대한 통찰력을 얻을 수 있습니다.

`typescript` 모듈을 사용하는 샘플 애플리케이션이 있다고 가정해 봅시다.  
`app.ts`는 `import * as ts from "typescript"`와 같은 import를 가지고 있습니다.

```tree
│   tsconfig.json
├───node_modules
│   └───typescript
│       └───lib
│               typescript.d.ts
└───src
        app.ts
```

`--traceResolution`을 사용하여 컴파일러 호출하기

```shell
tsc --traceResolution
```

결과는 다음과 같습니다:

```txt
======== Resolving module 'typescript' from 'src/app.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
```

#### 주의사항 (Things to look out for)

* import의 이름과 위치

 > ======== 모듈 해석 **'typescript'** from **'src/app.ts'**. ========

* 컴파일러가 따르는 방법

 > **'NodeJs'** 를 사용하여 모듈 해석 종류가 지정되지 않았습니다.

* npm 패키지에서 타입 로드

 > 'package.json'에는 'node_modules/typescript/lib/typescript.d.ts'를 참조하는 **'types'** 필드인 './lib/typescript.d.ts'가 있습니다.

* 최종 결과

 > ======== 모듈 이름 'typescript'는 'node_modules/typescript/lib/typescript.d.ts'에서 **성공적으로 해석되었습니다.** ========

## `--noResolve` 사용하기 (Using `--noResolve`)

일반적으로 컴파일러는 컴파일 프로세스를 시작하기 전에 모든 모듈의 imports를 해석하려고 시도합니다.  
파일에 `import`를 성공적으로 해석할 때마다 컴파일러는 파일을 나중에 처리할 파일 집합에 추가합니다.

`--noResolve` 컴파일러 옵션은 컴파일러가 커맨드라인에서 전달되지 않은 파일을 컴파일에 "추가"하지 않도록 지시합니다.  
모듈을 파일로 해석하려고 하지만 파일이 지정되지 않으면 포함되지 않습니다.

예를 들어:

#### app.ts

```ts
import * as A from "moduleA" // 좋아요, 'moduleA'가 커맨드라인에서 전달되었습니다.
import * as B from "moduleB" // TS2307 오류: 'moduleB' 모듈을 찾을 수 없습니다.
```

```shell
tsc app.ts moduleA.ts --noResolve
```

`--noResolve`를 사용하여 `app.ts`를 컴파일하면 다음과 같은 결과가 발생합니다:

* 커맨드라인에서 전달된대로 `moduleA`를 적절하게 찾습니다.
* 전달되지 않았기 때문에 `moduleB`를 찾지 못하는 오류.

## 공통 질문 (Common Questions)

### 제외 목록에 있는 모듈을 여전히 컴파일러가 선택하는 이유는 무엇입니까? (Why does a module in the exclude list still get picked up by the compiler?)

`tsconfig.json`은 폴더를 "프로젝트"로 만듭니다.  
`“exclude”` 또는 `“files”` 항목을 지정하지 않으면 `tsconfig.json`을 포함한 폴더의 모든 파일과 해당 하위 디렉토리가 컴파일에 포함됩니다.  
일부 파일을 제외하려면 `“exclude”`를 사용하세요.  
만일 모든 파일을 지정하고 싶다면 컴파일러가 찾아보게 하는 대신에 `“files”`을 사용하세요.

`tsconfig.json`는 자동 포함입니다.  
위에서 설명한 모듈 해석을 포함하지 않습니다.  
컴파일러가 파일을 모듈 import의 대상으로 식별하는 경우 이전 단계에서 제외되었는지 여부에 관계 없이 컴파일에 포함됩니다.

따라서 컴파일에서 파일을 제외하려면 `import` 또는 `/// <reference path="..." />` 지시자가 있는 **모든** 파일을 제외해야 합니다.