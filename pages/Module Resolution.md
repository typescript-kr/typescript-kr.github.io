> 이번 섹션은 모듈에 대한 기초적인 지식을 전제로 합니다.
더 많은 정보는 [모듈](./modules.md)을 보도록 하세요.

*모듈 해석 (module resolution)* 은 컴파일러가 imoprt가 무엇을 참조하는지 알아내기 위해 사용하는 프로세스입니다.
`import { a } from "moduleA"`같은 import 문을 생각해보세요;
`a`의 모든 사용을 검사하기 위해, 컴파일러는 무엇을 참조하는지 정확히 알아야 할 필요가 있습니다, 그리고 `moduleA` 정의를 검사해야 할 필요가 있습니다.

이 시점에, 컴파일러는 "`moduleA`의 형태가 뭘까?"라고 질문할 것입니다.
간단해 보이지만, `moduleA`는 `.ts`/`.tsx` 파일에 정의되어 있거나 혹은 코드가 의존하는 `.d.ts`에 정의되어 있을 수 있습니다.

첫 번째로, 컴파일러는 가져온 모듈을 나타내는 파일의 위치를 찾으려고 할 것입니다.
그렇게 하기 위해 컴파일러는 두 가지 다른 전략 중 하나를 따릅니다: [클래식](#클래식-classic) 혹은 [노드][#노드-node].
이 전략들은 컴파일러가 `moduleA`를 찾기 위해 *어디*를 봐야 할지 알려줍니다.

만약 이 방법이 잘 안되고 모듈 이름이 비-상대적이라면 (`"moduleA`의 경우가 그렇습니다), 컴파일러는 [ambient 모듈 선언](./modules.md#Ambient-모듈-Ambient-modules)을 찾으려고 할 것입니다.
비-상대적 import는 다음에 다룰 것입니다.

마지막으로, 컴파일러가 모듈을 해석할 수 없다면, 오류 로그가 발생합니다.
이 경우에, 오류는 `error TS2307: Cannot find module 'moduleA`와 같습니다.

## 상대적 vs. 비-상대적 모듈 import (Relative vs. Non-relative module imports)

모듈 참조가 상대적 혹은 비-상대적이냐에 따라 모듈 import는 다르게 해석됩니다.

*상대적 import* 는 `/`, `./` 혹은 `../`. 중에 하나로 시작합니다.
일부 예제는 다음과 같습니다:

* `import Entry from "./components/Entry";`
* `import { DefaultHeaders } from "../constants/http";`
* `import "/mod";`

다른 모든 import는 **비-상대적** 으로 간주됩니다.
일부 예제는 다음과 같습니다:

* `import * as $ from "jquery";`
* `import { Component } from "@angular/core";`

상대적 import는 가져온 파일에 상대적으로 해석되고 ambient 모듈 선언으로 해석 *될 수 없습니다*.
자신의 모듈에 대해서는 런타임에 상대적 위치를 유지하는 것을 보장하는 상대적 import를 사용해야 합니다.

비-상대적 import는 `baseUrl`로 해석되거나, 밑에서 다루게 될 경로 매핑으로 해석될 수 있습니다.
[ambient 모듈 선언](./modules.md#Ambient-모듈-Ambient-modules)으로도 해석될 수 있습니다.
외부 의존성을 import 할 때, 비-상대적 경로를 사용하세요.

## 모듈 해석 전략 (Module Resolution Strategies)

두 가지 가능한 모듈 해석 전략이 있습니다: [노드](#노드-node)와 [클래식](#클래식-classic).
`--moduleResolution` 플래그를 사용하여 모듈 해석 전략을 지정할 수 있습니다.
지정되지 않았으면, 디폴트는 `--module AMD | System | ES2015`에서는 [클래식][#클래식-classic]이고 나머지는 [노드](#노드-node)입니다.

### 클래식 (Classic)

TypeScript의 디폴트 해석 전략으로 사용됩니다.
요즘에, 이 전략은 주로 이전 버전과의 호환성을 위해 제공됩니다.

상대적 import는 import하는 파일에 상대적으로 해석됩니다.
그래서 소스 파일 `/root/src/folder/A.ts`안에 import { b } from "./moduleB"`는 다음과 같이 조회합니다:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

그러나, 비-상대적 모듈 import에서는, 컴파일러가 가져온 파일을 갖고 있는 디렉터리부터 시작해서 디렉터리 트리를 거슬러 올라가 맞는 정의 파일의 위치를 찾으려고 합니다.

예를 들어:

소스 파일 `/root/src/folder/A.ts`안에 `import { b } from "moduleB"`처럼 `moduleB`의 비-상대적 import은 `"moduleB"`의 위치를 찾기 위해 다음과 같은 위치를 찾습니다.

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

### 노드 (Node)

이 해석 전략은 런타임에 [Node.js](https://nodejs.org/)의 모듈 해석 메커니즘을 모방하려고 시도합니다.
전체 Node.js 해석 알고리즘은 [Node.js 모듈 문서](https://nodejs.org/api/modules.html#modules_all_together)에 요약되어 있습니다.

#### Node.js가 모듈을 해석하는 방법 (How Node.js resolves modules)

TS 컴파일러가 어떤 과정을 따를지 이해하기 위해서는, Node.js 모듈을 이해하는 것이 중요합니다.
전통적으로, Node.js의 import는 `require` 함수를 호출해 수행합니다.
Node.js의 동작은 `require`에 상대적 경로 혹은 비-상대적 경로가 주어지는지에 따라 달라집니다.

상대적 경로는 아주 간단합니다.
예를 들어, `var x = require("./moduleB");`라는 import 문을 포함한 `/root/src/moduleA.js`에 위치한 파일을 생각해봅시다.
Node.js는 다음 순서로 import를 해석합니다:

1. `/root/src/moduleB.js`라는 파일이 존재하는지 확인.

2. 만약 `"main"` 모듈을 지정하는 `package.json`라는 파일을 포함하고 있으면, `/root/src/moduleB` 폴더 확인하기.
  이 예제에서는, 만약 Node.js가 `{ "main": "lib/mainModule.js" }`을 포함하는 `/root/src/moduleB/package.json`파일을 찾았다면, Node.js가 `/root/src/moduleB/lib/mainModule.js`를 참조할 것입니다.

3. `index.js` 라는 파일을 포함하고 있으면, `/root/src/moduleB` 확인하기.
    이 파일은 폴더의 "main" 모듈임을 암시적으로 나타냅니다.

자세한 내용은 Node.js 문서 [파일 모듈](https://nodejs.org/api/modules.html#modules_file_modules)과 [폴더 모듈](https://nodejs.org/api/modules.html#modules_folders_as_modules)에서 더 읽어보실 수 있습니다.

그러나, [비-상대적 모듈 이름](#relative-vs-non-relative-module-imports)에 대한 해석은 다르게 수행합니다.
Node는 `node_modules`로 불리는 특별한 폴더에서 모듈을 찾을 것입니다.
`node_modules` 폴더는 현재 파일과 동일한 레벨이거나, 디렉터리 체인에서 더 높을 수도 있습니다.
Node는 디렉터리 체인을 올라가, 로드하려는 모듈을 찾을 때까지 각 `node_modules`을 찾습니다.

위의 예제를 따라서, `/root/src/moduleA.js`가 대신 비-상대적 경로를 사용하고 `var x = require("moduleB");` import를 가지고 있다고 생각해봅시다.
Node는 하나가 일치할 때까지 각 위치에서 `moduleB`를 해석하려고 시도합니다.

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json` (`"main"` 항목을 지정했다면)
3. `/root/src/node_modules/moduleB/index.js`
   <br /><br />
4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json` (`"main"` 항목을 지정했다면)
6. `/root/node_modules/moduleB/index.js`
   <br /><br />
7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json` (`"main"` 항목을 지정했다면)
9. `/node_modules/moduleB/index.js`

Node.js가 (4) 와 (7)에서 디렉터리를 점프했다는 것에 주목하세요.

프로세스에 대한 더 많은 정보는 Node.js 문서 [`node_modules`에서 모듈 로드하기](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)에서 읽어보실 수 있습니다.

#### TypeScript가 모듈을 해석하는 방법 (How TypeScript resolves modules)

TypeScript는 컴파일-타임에 모듈의 정의 파일 위치를 찾기 위해 Node.js의 런타임 해석 전략을 모방합니다.
이를 달성하기 위해, TypeScript는 TypeScript 소스 파일 확장자 (`.ts`, `.tsx` 와 `.d.ts`)를 Node의 해석 로직 위에 씌웁니다.
TypeScript는 `"main"`의 목적 - 컴파일러가 이를 사용하여 참조할 "main" 정의 파일을 찾음. 을 반영하기 위해 `"types"`라는 `package.json`안에 필드를 사용합니다

예를 들어, `/root/src/moduleA.ts`안에 `import { b } from "./moduleB"` 같은 import 문은 `"./moduleB"`의 위치를 찾기 위해 다음과 같은 위치를 찾습니다.

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json` (`"types"` 항목을 지정했다면)
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

Node.js가 `moduleB.js` 파일을 찾고 나서, 해당하는 `package.json`을 찾고, `index.js`를 찾았다는 것을 상기해봅시다.

비슷하게, 비-상대적 import는 Node.js 해석 로직을 따릅니다, 첫 번째로 파일을 찾고, 그러고 나서 해당하는 폴더를 찾습니다.
그래서 `/root/src/moduleA.ts` 소스 파일 안에 `import { b } from "moduleB"`는 다음과 같은 조회를 합니다.

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json` (`"types"` 프로퍼티를 지정했다면)
5. `/root/src/node_modules/@types/moduleB.d.ts`
6. `/root/src/node_modules/moduleB/index.ts`
7. `/root/src/node_modules/moduleB/index.tsx`
8. `/root/src/node_modules/moduleB/index.d.ts`
   <br /><br />
9. `/root/node_modules/moduleB.ts`
10. `/root/node_modules/moduleB.tsx`
11. `/root/node_modules/moduleB.d.ts`
12. `/root/node_modules/moduleB/package.json` (`"types"` 항목을 지정했다면)
13. `/root/node_modules/@types/moduleB.d.ts`
14. `/root/node_modules/moduleB/index.ts`
15. `/root/node_modules/moduleB/index.tsx`
16. `/root/node_modules/moduleB/index.d.ts`
    <br /><br />
17. `/node_modules/moduleB.ts`
18. `/node_modules/moduleB.tsx`
19. `/node_modules/moduleB.d.ts`
20. `/node_modules/moduleB/package.json` (`"types"` 항목을 지정했다면)
21. `/node_modules/@types/moduleB.d.ts`
22. `/node_modules/moduleB/index.ts`
23. `/node_modules/moduleB/index.tsx`
24. `/node_modules/moduleB/index.d.ts`

스텝 수 때문에 두려워하지 마세요 - TypeScript가 여전히 디렉터리를 (9)와 (17)에서 두 번 점프합니다.

Node.js가 하는 것보다 더 복잡하지 않습니다.

## 추가 모듈 해석 플래그 (Additional module resolution flags)

프로젝트 소스 레이아웃이 출력과 일치하지 않을 때도 있습니다.
일반적으로 일련의 빌드 스텝이 생성된 최종 출력을 만듭니다.
`.ts`파일을 `.js`로 컴파일하고, 다른 소스 위치에서 하나의 출력 위치로 의존성을 복사하는 것을 포함합니다.
최종 결과는 런타임의 모듈이 해당 정의를 포함하는 소스 파일과 다른 이름을 가질 수 있다는 것이다.
혹은 최종 출력의 모듈 경로가 컴파일 타임에 해당하는 소스 파일 경로와 일치하지 않을 수 있습니다.

TypeScript 컴파일러는 추가 플래그를 갖고 있습니다.
The TypeScript compiler has a set of additional flags to *inform* the compiler of transformations that are expected to happen to the sources to generate the final output.
TypeScript 컴파일러는 최종 출력을 생성하기위해 소스에 발생할 것으로 예상되는 변환을 컴파일러에게 *알리기* 위한 추가 플래그 세트가 있습니다.

컴파일러가 이러한 변환도 수행하지 *않는* 다는 것에 유의하십시오;
정의 파일로 모듈 import를 해석하는 과정을 안내하기 위해 이러한 정보를 사용합니다.

### 기본 URL (Base URL)

`baseUrl`을 사용하는 것은 모듈들이 런타임에 단일 폴더로 "배포"되는 AMD 모듈 로더를 사용하는 애플리케이션에서 일반적인 방법입니다.
이 모듈들의 소스는 다른 디렉터리 안에 있을 수 있지만, 빌드 스크립트가 모두 하나로 만들 것입니다.

`baseUrl`을 설정하는 것은 컴파일러에게 어디에서 모듈을 찾을지 알려주는 것입니다.
모든 비-상대적 이름의 모듈 import는 `baseUrl`에 상대적이라고 가정합니다.

*baseUrl*의 값은 다음 중 하나로 결정됩니다:

* *baseUrl* 명령 줄 인수 값 (만약 주어진 경로가 상대적이면, 현재 디렉터리를 기준으로 계산됨)
* 'tsconfig.json'안에 *baseUrl* 프로퍼티 값 (만약 주어진 경로가 상대적이면, 'tsconfig.json'의 위치를 기준으로 계산됨)

상대적 모듈 import는 항상 가져온 파일의 상대적으로 해석되기 때문에, baseUrl을 설정하는 것에 영향을 받지 않는 점에 유의하십시오.

baseUrl에 대한 더 많은 문서는 [RequireJS](http://requirejs.org/docs/api.html#config-baseUrl)와 [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#baseurl) 문서에서 찾으실 수 있습니다.

### 경로 매핑 (Path mapping)

가끔 모듈이 *baseUrl* 아래에 위치하지 않는 경우가 있습니다.
예를 들어, `"jquery"` 모듈의 import는 런타임에 `"node_modules/jquery/dist/jquery.slim.min.js"`로 번역됩니다.
로더는 런타임에 모듈 이름을 파일에 매핑하기 위해 매핑 구성을 사용합니다, [RequireJs 문서](http://requirejs.org/docs/api.html#config-paths)와 [SystemJS 문서](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#paths)를 보세요.

TypeScript 컴파일러는 `tsconfig.json` 파일 안에 `"paths"` 프로퍼티를 사용한 매핑의 선언을 지원합니다.
`jquery`를 위한 `"paths"` 프로퍼티를 지정하는 방법에 대한 예제가 있습니다.

```json
{
  "compilerOptions": {
    "baseUrl": ".", // "paths"가 있는 경우 반드시 지정되어야함.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // 이 매핑은 "baseUrl"에 상대적임.
    }
  }
}
```

`"paths"`가 `"baseUrl"`에 상대적으로 해석된다는 점에 주목하세요.
`"baseUrl"`을 `"."`가 아닌 다른 값, 예 `tsconfig.json`의 디렉터리,으로 설정하면, 그에 따라 매핑도 바뀝니다.
위 예제에서 `"baseUrl": "./src"`로 설정했기 때문에, jquery는 `"../node_modules/jquery/dist/jquery"`로 매핑됩니다.

`"paths"`를 사용하는 것은 여러 개의 이전 위치를 포함한 정교한 매핑이 가능합니다.
일부 모듈만 한 위치에서 사용 가능하고, 나머지는 다른 곳에 있는 프로젝트 구성을 생각해보세요.
빌드 스텝이 한곳으로 모을 것입니다.
프로젝트의 레이아웃은 다음과 같이 보입니다:

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

`tsconfig.json`는 다음과 같이 보일 것입니다:

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

이는 컴파일러에게 두 위치에서 패턴 `"*"` (i.e. 모든 값) 과 일치하는 모든 모듈 import를 알려줍니다

 1. `"*"`: 같은 이름은 바뀌지 않음을 의미, 그래서 `<moduleName>` => `<baseUrl>/<moduleName>`으로 매핑
 2. `"generated/*"` 접두사 "generated"가 추가된 모듈 이름을 의미, 그래서 `<moduleName>` => `<baseUrl>/generated/<moduleName>`로 매핑

이 로직을 따르면, 컴파일러는 다음과 같은 두 가지 import를 해석하려고 할 것입니다:

import 'folder1/file2':
 1. 모듈 '*'은 일치하고 와일드카드가 전체 모듈 이름을 캡처함
 2. 목록에서 첫 번째 대체 시도: '*' -> `folder1/file2`
 3. 대체의 결과가 비-상대적 이름 - *baseUrl*과 결합 -> `projectRoot/folder1/file2.ts`
 4. 파일이 존재. 완료.

import 'folder2/file3':
 1. 모듈 '*'은 일치하고 와일드카드가 전체 모듈 이름을 캡처함
 2. 목록에서 첫 번째 대체 시도: '*' -> `folder2/file3`
 3. 대체의 결과가 비-상대적 이름 - *baseUrl*과 결합 -> `projectRoot/folder2/file3.ts`
 4. 파일이 존재하지 않음, 두 번째 대체로 이동
 5. 두 번째 대체 'generated/*' -> `generated/folder2/file3`
 6. 대체의 결과가 비-상대적 이름 - *baseUrl*과 결합 -> `projectRoot/generated/folder2/file3.ts`
 7. 파일이 존재. 완료.

### `rootDirs` 가상 디렉터리 (Virtual Directories with `rootDirs`)

때때로 컴파일 타임에 여러 디렉터리의 프로젝트 소스가 모두 결합되어 단일 출력 디렉터리를 생성합니다.
여러 소스 디렉터리가 "가상" 디렉터리를 생성하는 것으로 보입니다.

'rootDirs'를 사용하면, 컴파일러에게 이 "가상" 디렉터리를 구성하는 *roots*를 알릴 수 있습니다;
따라서 컴파일러는 이러한 "가상"디렉터리 내에서 상대적 모듈 import를 *마치* 하나의 디렉터리에 같이 병합 한 것처럼 해석할 수 있습니다.

예를 들어 이 프로젝트 구조를 생각해보세요:

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

`src/views` 안의 파일들은 UI 컨트롤을 위한 유저 코드입니다.
`generated/templated` 안의 파일들은, 빌드의 일부로써 템플릿 생성기에 의해 자동-생성된 UI 템플릿 바인딩 코드입니다.
빌드 스텝은 `/src/view`와 `/generated/templates/views`를 출력에서 같은 디렉터리로 복사합니다.
런타임에서, 뷰는 템플릿이 옆에 있다고 기대할 것이기 때문에, `"./template"`처럼 상대적인 이름을 import에서 사용해야 합니다.

컴파일러에게 이 관계를 지정하기 위해서, `"rootDirs"`를 사용합니다.
`"rootDirs"`는 내용물이 런타임에 병합할 것으로 예상되는 *roots* 의 목록을 지정합니다.
그래서 다음의 예제에서, `tsconfig.json` 파일은 다음과 같아야 합니다:

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

컴파일러가 `rootDirs` 중 하나의 하위 폴더에서 상대적 모듈 import를 볼 때마다, 각 `rootDirs`의 엔트리에서 이 import를 찾으려고 할 것입니다.

`rootDirs`의 유연함은 논리적으로 병합되는 물리적 소스 디렉터리의 목록을 지정하는데 제한되지 않습니다. 제공되는 배열은 아마 존재 여부에 관계없이 임의의 수의 ad hoc, 임의의 디렉터리 이름을 포함할 수 있습니다. 이는 컴파일러에게 조건부 포함과 프로젝트 전용 로더 플러그인과 같은 복잡한 번들링과 런타임 기능을 안전한 방법으로 캡처할 수 있게 해줍니다.

`./#{locale}/messages`와 같은 상대 모듈 경로의 일부로 `#{locale}`와 같은 특수 경로 토큰을 보간하여 빌드 툴이 로케일 전용 번들을 자동으로 생성하는 국제화 시나리오를 고려해봅시다. 이 가상의 설정에서 툴이 지원하는 로케일을 열거하고, 추상 경로를 `./zh/messages`, `./de/messages` 등으로 매핑 합니다.

각 모듈은 문자열 배열을 export 한다고 가정합니다. 예를 들어 `./zh/messages`는 다음을 포함합니다:

```ts
export default [
    "您好吗",
    "很高兴认识你"
];
```

`rootDirs`를 활용하여 컴파일러에게 이 매핑에 대해 알려주어 심지어 디렉터리가 존재하지 않아도 안전하게 `./#{locale}/messages`를 해석할 수 있도록 합니다. 예를 들어, 다음과 같은 `tsconfig.json`를 보십시오:

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

컴파일러는 이제 './#{locale}/messages'`를 './zh/messages'`로 해석하여 설계 시간 지원을 타협하지 않고 로케일에 관계없는 방법으로 개발할 수 있습니다.

## 모듈 해석 추적 (Tracing module resolution)

앞에서 논의한 바와 같이 컴파일러는 모듈을 해석할 때 현재 폴더 외부의 파일을 방문할 수 있습니다.
이는 모듈이 해석되지 않거나 잘못된 정의로 해석된 이유를 진단할 때 어려울 수 있습니다.
'--traceResolution'을 사용하여 컴파일러 모듈 해석 추적을 활성화하면 모듈 해석 과정 중에 발생한 작업에 대한 인사이트를 얻을 수 있습니다.

`typescript` 모듈을 사용하는 예제 애플리케이션이 있다고 해봅시다.
`app.ts`는 `import * as ts from "typescript"` 같은 import가 있습니다.

```tree
│   tsconfig.json
├───node_modules
│   └───typescript
│       └───lib
│               typescript.d.ts
└───src
        app.ts
```

`--traceResolution`으로 컴파일러를 호출

```shell
tsc --traceResolution
```

다음과 같은 출력이 발생:

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

 > ======== **'src/app.ts'** 에서 **'typesciprt'** 모듈 해석. ========

* 컴파일러가 따르는 전략

 > 모듈 해석 종류가 지정되지 않으면, **'NodeJs** 사용.

* npm 패키지에서 types 로딩
 > 'package.json'은 'node_modules/typescript/lib/typescript.d.ts'를 참조하는 **'types'** 필드 './lib/typescript.d.ts'가 있습니다.

* 최종 결과
 > ======== 모듈 이름 'typescript'는 'node_modules/typescript/lib/typescript.d.ts'로 **성공적으로 해석** 되었습니다. ========

## `--noResolve` 사용하기 (Using `--noResolve`)

일반적으로 컴파일러는 컴파일 과정을 시작하기 전에 모든 모듈 import를 해석하려고 합니다.
파일의 `import`를 성공적으로 해석할 때마다, 파일은 나중에 컴파일러가 처리할 파일 세트에 추가됩니다.

`--noResolve` 컴파일러 옵션은 명령 줄에 전달하지 않은 파일은 컴파일에 "추가" 하지 않도록 지시합니다.
여전히 파일에 모듈을 해석하려고 하지만, 파일이 지정되지 않았으면, 그 파일은 포함하지 않습니다.

예를 들어:

#### app.ts

```ts
import * as A from "moduleA" // 성공, 'moduleA'가 명령줄로 전달됨
import * as B from "moduleB" // Error TS2307: Cannot find module 'moduleB.
```

```shell
tsc app.ts moduleA.ts --noResolve
```

`--noResolve`를 사용한 `app.ts`의 컴파일은 다음과 같은 결과가 나옵니다:

* 명령 줄로 전달했기 때문에 `moduleA`는 정확하게 찾음.
* 전달하지 않았기 때문에 `moduleB`를 찾는데 실패함.

## 공통 질문 (Common Questions)

### 제외 목록에 있는 모듈을 여전히 컴파일러가 선택하는 이유는 무엇인가? (Why does a module in the exclude list still get picked up by the compiler?)

`tsconfig.json`은 폴더를 "프로젝트"로 바꿉니다.
`"exclude"` 나 `"files"` 엔트리를 지정하지 않으면, `tsconfig.json`를 포함하는 폴더 안의 모든 파일과 모든 하위-디렉터리가 컴파일에 포함됩니다.
만약 일부 파일을 제외하고 싶으면 `"exclude"`를 사용하고, 컴파일러가 찾도록 하게 하는 대신 모든 파일을 지정하고 싶으면, `"files"`를 사용하십시오.

`tsconfig.json`의 자동 포함입니다.
위에서 논의한 내장 모듈 해석이 아닙니다.
컴파일러는 파일을 모듈 import 대상으로 식별한 경우, 이전 단계에서 제외되었는지에 관계없이 컴파일에 포함하게 됩니다.

그래서 컴파일에 파일은 제외하기 위해서는, 그 파일을 제외하고 그 파일에 `import`나 `/// <reference path="..."" />` 지시문이 있는 **모든** 파일을 제외해야 합니다.
