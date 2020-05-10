## CLI로 사용하기 (Using the CLI)

로컬에서 `tsc`를 실행하면 `tsconfig.json`가 정의한 가장 가까운 프로젝트를 컴파일하고, 원하는 파일 glob을 전달하여
TypeScript 파일 집합을 컴파일할 수 있습니다.

```sh
# tsconfig.json에 대한 fs를 역방향으로 검토하여 컴파일 실행
tsc

# 컴파일러 기본값으로 index.ts만 트랜스파일
tsc index.ts

# 기본 설정으로 src 폴더 안에 모든 .ts 파일을 트랜스파일
tsc src/*.ts

# tsconfig.json의 컴파일러 설정으로 src 폴더 안에 모든 .ts 파일을 트랜스파일
tsc --project tsconfig.json src/*.ts
```

## 컴파일러 옵션 (Compiler Options)

tsconfig의 컴파일러 옵션에 대한 더 많은 정보를 찾는다면, 베타 TSConfig 레퍼런스를
[v2 사이트](https://www.typescriptlang.org/v2/en/tsconfig)에서 확인하세요.

옵션                                           | 타입      | 기본값                         | 설명
-----------------------------------------------|-----------|--------------------------------|----------------------------------------------------------------------
`--allowJs`                                    | `boolean` | `false`                        | JavaScript 파일의 컴파일을 허용합니다
`--allowSyntheticDefaultImports`               | `boolean` | `module === "system"` 또는 `--esModuleInterop` | default export가 없는 모듈에서 default imports를 허용합니다. 코드 방출에는 영향을 주지 않으며, 타입 검사만 수행합니다.
`--allowUmdGlobalAccess`                       | `boolean` | `false`                        | 모듈에서 전역 UMD 접근을 허용합니다.
`--allowUnreachableCode`                       | `boolean` | `false`                        | 도달할 수 없는 코드에 대한 오류를 보고하지 않습니다.
`--allowUnusedLabels`                          | `boolean` | `false`                        | 사용되지 않는 레이블에 대한 오류를 보고하지 않습니다.
`--alwaysStrict`                               | `boolean` | `false`                        | strict mode에서 파싱하고 각 소스 파일에 대해 `"use strict"`를 내보냅니다.
`--assumeChangesOnlyAffectDirectDependencies`  | `boolean` | `false`                        | 파일 안에서의 변경은 파일이 직접 의존하는 파일에만 영향을 미친다고 가정하고 '--incremental' 및 '-watch'로 다시 컴파일 합니다.
`--baseUrl`                                    | `string`  |                                | 비-상대적 모듈 이름을 해석하기 위한 기본 디렉터리. 자세한 내용은 [모듈 해석 문서](./Module Resolution.md#base-url)을 참조하세요.
`--build`<br/>`-b`                             | `boolean` | `false`                        | [프로젝트 레퍼런스](./Project%20References.md)에서 지정한 이 프로젝트와 프로젝트의 모든 의존성을 빌드 합니다. 이 플래그는 이 페이지의 다른 플래그들과는 호환되지 않음에 유의하세요 자세한 내용은 [여기](./Project%20References.md)를 보세요.
`--charset`                                    | `string`  | `"utf8"`                       | 입력 파일의 문자 집합입니다.
`--checkJs`                                    | `boolean` | `false`                        | `.js` 파일에 오류를 보고합니다. `--allowJs`와 함께 사용하세요.
`--composite`                                  | `boolean` | `true`                         | TypeScript가 프로젝트를 컴파일하기 위해 참조된 프로젝트의 출력을 찾을 위치를 결정할 수 있는지 확인합니다.
`--declaration`<br/>`-d`                       | `boolean` | `false`                        | 해당하는 `.d.ts` 파일을 생성합니다.
`--declarationDir`                             | `string`  |                                | 생성된 선언 파일의 출력 디렉토리입니다.
`--declarationMap`                             | `boolean` | `false`                        | 해당하는 '.d.ts'파일 각각에 대한 소스 맵을 생성합니다.
`--diagnostics`                                | `boolean` | `false`                        | 진단 정보를 보여줍니다.
`--disableSizeLimit`                           | `boolean` | `false`                        | JavaScript 프로젝트의 사이즈 제한을 비활성화합니다.
`--downlevelIteration`                         | `boolean` | `false`                        | ES5 또는 ES3를 대상으로 할 때 `for..of`, 스프레드와 구조분해할당에서 이터러블을 완전히 지원합니다.
`--emitBOM`                                    | `boolean` | `false`                        | 출력 파일의 시작 부분에 UTF-8 바이트 순서표(BOM)를 내보냅니다.
`--emitDeclarationOnly`                        | `boolean` | `false`                        | '.d.ts' 선언 파일만 내보냅니다.
`--emitDecoratorMetadata`<sup>[1]</sup>        | `boolean` | `false`                        | 소스에 데코레이터 선언에 대한 설계-타입 메타 데이터를 내보냅니다. 자세한 내용은 [#2577 이슈](https://github.com/Microsoft/TypeScript/issues/2577)을 참조하세요.
`--esModuleInterop`                            | `boolean` | `false`                        | 런타임 바벨 생태계 호환성을 위한 `__importStar`와 `__importDefault` 헬퍼를 내보내고 타입 시스템 호환성을 위해 `--allowSyntheticDefaultImports`를 활성화합니다.
`--experimentalDecorators`<sup>[1]</sup>       | `boolean` | `false`                        | ES 데코레이터에 대한 실험적인 지원을 사용하도록 활성화합니다.
`--extendedDiagnostics`                        | `boolean` | `false`                        | 자세한 진단 정보를 표시합니다
`--forceConsistentCasingInFileNames`           | `boolean` | `false`                        | 동일 파일 참조에 대해 일관성 없는 대소문자를 비활성화합니다.
`--generateCpuProfile`                         | `string`  | `profile.cpuprofile`           | 주어진 경로에 cpu 프로필을 생성합니다. 파일 경로 대신 존재하는 디렉터리 이름을 전달하면 타임스탬프 이름이 지정된 프로필이 그 디렉터리에 대신 생성됩니다.
`--help`<br/>`-h`                              |           |                                | 도움말을 출력합니다.
`--importHelpers`                              | `boolean` | `false`                        | [`tslib`](https://www.npmjs.com/package/tslib)에서 방출된 헬퍼를 import 합니다.  (예. `__extends`, `__rest`, 등..)
`--importsNotUsedAsValues`                     | `string`  | `remove`                       | 타입을 위해서만 사용하는 import를 위한 내보내기/검사 동작을 지정합니다. `"remove"`와 `"preserve"`는 사이드 이펙트를 위해 사용하지 않는 import를 내보낼지 지정하고, `"erorr"`는 타입을 위해서만 사용하는 import는 `import type`으로 작성하게 강제합니다.
`--incremental`                                | `boolean` | `composite`이 켜져있으면 `true` 아니면 `false` | 이전 컴파일에서 디스크의 파일로 정보를 읽거나/기록하여 증분 컴파일을 활성화합니다. 이 파일은 `--tsBuildInfoFile` 플래그로 컨트롤합니다.
`--inlineSourceMap`                            | `boolean` | `false`                        | 별도의 파일 대신 소스 맵으로 단일 파일을 내보냅니다.
`--inlineSources`                              | `boolean` | `false`                        | 단일 파일 내에서 소스 맵과 함께 소스를 내보냅니다. `--inlineSourceMap` 또는 `--sourceMap`을 설정해야 합니다.
`--init`                                       |           |                                | TypeScript 프로젝트를 초기화하고 `tsconfig.json` 파일을 생성합니다.
`--isolatedModules`                            | `boolean` | `false`                        | 추가 검사를 수행하여 별도의 컴파일 (예를 들어 [`트랜스파일된 모듈`](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function) 혹은 [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript)) 이 안전한지 확인합니다.
`--jsx`                                        | `string`  | `"Preserve"`                   | `.tsx` 파일에서 JSX 지원: `"React"`, `"Preserve"`, `"react-native"`. [JSX](./JSX.md)를 확인하세요.
`--jsxFactory`                                 | `string`  | `"React.createElement"`        | 리액트 JSX 방출을 대상으로 할 때 사용할 JSX 팩토리 함수를 지정합니다. 예: `React.createElement` 또는 `h`.
`--keyofStringsOnly`                           | `boolean` | `false`                        | `keyof`를 문자열 값으로 된 프로퍼티 이름에만 적용합니다 (숫자나 심벌에서는 안됨).
`--useDefineForClassFields`                    | `boolean` | `false`                        | 클래스 필드를 ECMAScript-표준 시맨틱으로 내보냅니다.
`--lib`                                        | `string[]`|                                | 컴파일에 포함될 라이브러리 파일 목록입니다.<br/>가능한 값은 다음과 같습니다:  <br/>► `ES5` <br/>► `ES6` <br/>► `ES2015` <br/>► `ES7` <br/>► `ES2016` <br/>► `ES2017` <br/>► `ES2018` <br/>► `ESNext` <br/>► `DOM` <br/>► `DOM.Iterable` <br/>► `WebWorker` <br/>► `ScriptHost` <br/>► `ES2015.Core` <br/>► `ES2015.Collection` <br/>► `ES2015.Generator` <br/>► `ES2015.Iterable` <br/>► `ES2015.Promise` <br/>► `ES2015.Proxy` <br/>► `ES2015.Reflect` <br/>► `ES2015.Symbol` <br/>► `ES2015.Symbol.WellKnown` <br/>► `ES2016.Array.Include` <br/>► `ES2017.object` <br/>► `ES2017.Intl` <br/>► `ES2017.SharedMemory` <br/>► `ES2017.String` <br/>► `ES2017.TypedArrays` <br/>► `ES2018.Intl` <br/>► `ES2018.Promise` <br/>► `ES2018.RegExp` <br/>► `ESNext.AsyncIterable` <br/>► `ESNext.Array` <br/>► `ESNext.Intl` <br/>► `ESNext.Symbol` <br/><br/> 주의사항: `--lib`가 지정되지 않으면 라이브러리의 기본 리스트가 삽입됩니다. 주입되는 기본 라이브러리는 다음과 같습니다:  <br/> ► `--target ES5`: `DOM,ES5,ScriptHost`<br/>  ► `--target ES6`: `DOM,ES6,DOM.Iterable,ScriptHost`
`--listEmittedFiles`                           | `boolean` | `false`                        | 컴파일의 일부로 생성된 파일의 이름을 출력합니다.
`--listFiles`                                  | `boolean` | `false`                        | 컴파일에 포함된 파일의 이름을 출력합니다.
`--locale`                                     | `string`  | *(플랫폼 별)*          | 오류 메시지를 표시하는 데 사용할 지역화, 예: en-us. <br/>가능한 값은 다음과 같습니다:  <br/>► 영어 (US): `en` <br/>► 체코어: `cs` <br/>► 독일어: `de` <br/>► 스페인어: `es` <br/>► 프랑스어: `fr` <br/>► 이탈리아어: `it` <br/>► 일본어: `ja` <br/>► 한국어: `ko` <br/>► 폴란드어: `pl` <br/>► 포르투갈어(브라질): `pt-BR` <br/>► 러시아어: `ru` <br/>► 터키어: `tr` <br/>► 중국어 간체: `zh-CN`  <br/>► 중국어 번체: `zh-TW`
`--mapRoot`                                    | `string`  |                                | 디버거가 생성된 위치가 아닌 맵 파일의 위치를 지정합니다. .map 파일이 .js 파일과 다른 위치에 런타임 시 위치할 경우 이 옵션을 사용하세요. 지정된 위치는 sourceMap에 포함되어 맵 파일이 위치할 디버거를 지정합니다. 이 플래그는 지정된 경로를 작성하지 않고 해당 위치에 맵 파일을 생성합니다. 대신 파일을 지정된 경로로 이동하는 빌드 후 단계를 작성하십시오.
`--maxNodeModuleJsDepth`                       | `number`  | `0`                            | node_modules 및 로드 JavaScript 파일 아래에서 검색할 최대 의존성 깊이. `--allowJs`에만 적용됩니다.
`--module`<br/>`-m`                            | `string`  | `target === "ES3" or "ES5" ? "CommonJS" : "ES6"`   | 모듈 코드 생성 지정: `"None"`, `"CommonJS"`, `"AMD"`, `"System"`, `"UMD"`, `"ES6"`, `"ES2015"` 또는 `"ESNext"`.<br/>► `"AMD"`와 `"System"`만 `--outFile`과 함께 사용할 수 있습니다.<br/>► `"ES6"`와 `"ES2015"` 값은 `"ES5"` 또는 이하를 대상으로 할 때 사용할 수 있습니다.
`--moduleResolution`                           | `string`  | `module === "AMD" or "System" or "ES6" ?  "Classic" : "Node"`                    | 모듈 해석 방법 결정. Node.js/io.js 스타일 해석의 경우, `"Node"` 또는 `"Classic"` 중 하나입니다. 자세한 내용은 [모듈 해석 문서](./Module%20Resolution.md)를 참조하세요.
`--newLine`                                    | `string`  | *(플랫폼 별)*          | 파일을 내보낼 때 사용되는 지정된 라인 끝의 시퀀스 사용: `"crlf"` (윈도우) 또는 `"lf"` (유닉스)."
`--noEmit`                                     | `boolean` | `false`                        | 출력을 내보내지 않습니다.
`--noEmitHelpers`                              | `boolean` | `false`                        | 컴파일된 출력에서는 `__extends`와 같은 커스텀 헬퍼 함수를 생성하지 않습니다.
`--noEmitOnError`                              | `boolean` | `false`                        | 오류가 보고된 경우 출력을 내보내지 않습니다.
`--noErrorTruncation`                          | `boolean` | `false`                        | 오류 메세지를 줄이지 않습니다.
`--noFallthroughCasesInSwitch`                 | `boolean` | `false`                        | 스위치 문에 fallthrough 케이스에 대한 오류를 보고합니다.
`--noImplicitAny`                              | `boolean` | `false`                        | `any` 타입으로 암시한 표현식과 선언에 오류를 발생시킵니다.
`--noImplicitReturns`                          | `boolean` | `false`                        | 함수의 모든 코드 경로에 반환값이 없을 때 오류를 보고합니다.
`--noImplicitThis`                             | `boolean` | `false`                        | `any` 타입으로 암시한 `this` 표현식에 오류를 보고합니다.
`--noImplicitUseStrict`                        | `boolean` | `false`                        | 모듈 출력에 `"use strict"` 지시자를 내보내지 않습니다.
`--noLib`                                      | `boolean` | `false`                        | 기본 라이브러리 파일(`lib.d.ts`)은 포함하지 않습니다.
`--noResolve`                                  | `boolean` | `false`                        | 컴파일된 파일 목록에 트리플-슬래시 참조 또는 모듈 임포트 대상을 추가하지 않습니다.
`--noStrictGenericChecks`                      | `boolean` | `false`                        | 함수 타입에서 제네릭 시그니처의 엄격한 검사를 비활성화합니다.
`--noUnusedLocals`                             | `boolean` | `false`                        | 사용하지 않는 지역 변수에 대한 오류를 보고합니다.
`--noUnusedParameters`                         | `boolean` | `false`                        | 사용하지 않는 매개 변수에 대한 오류를 보고합니다.
~~`--out`~~                                    | `string`  |                                | 더 이상 사용하지 않습니다. `--outFile`을 대신 사용합니다.
`--outDir`                                     | `string`  |                                | 출력 구조를 디렉토리로 리다이렉트합니다.
`--outFile`                                    | `string`  |                                | 출력을 단일 파일로 연결하여 방출합니다. 연결의 순서는 컴파일러에 전달된 파일 목록과 트리플-슬래시 참조 그리고 import와 함께 결정됩니다. 자세한 내용은 [출력 파일 순서 문서](https://github.com/Microsoft/TypeScript/wiki/FAQ#how-do-i-control-file-ordering-in-combined-output---out-)를 참조하세요.
`paths`<sup>[2]</sup>                          | `Object`  |                                | `baseUrl`을 기준으로 관련된 위치에 모듈 이름의 경로 매핑 목록을 나열합니다. 자세한 내용은 [모듈 해석 문서](./Module%20Resolution.md#path-mapping)를 참조하세요.
`--preserveConstEnums`                         | `boolean` | `false`                        | 생성된 코드에 const enum 선언을 지우지 않습니다. 자세한 내용은 [const 열거형 문서](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#94-constant-enum-declarations)를 참조하세요.
`--preserveSymlinks`                            | `boolean` | `false`                       | symlinks를 실제 경로로 해석하지 않습니다. symlinked된 파일을 실제 파일처럼 다룹니다.
`--preserveWatchOutput`                        | `boolean` | `false`                        | 스크린을 지우는 대신에 예전 콘솔 출력을 감시 모드로 남겨둡니다
`--pretty`                                     | `boolean` | 다른 프로그램으로 파이프하거나 출력을 파일로 리다이렉션하지 않으면 `true` | 에러와 메시지를 색과 컨텍스트를 사용해서 스타일 지정합니다.
`--project`<br/>`-p`                           | `string`  |                                | 유효한 설정 파일이 지정된 프로젝트를 컴파일하세요.<br/>이 인수는 유효한 JSON 설정 파일의 파일 경로일 수도 있고 `tsconfig.json` 파일이 포함된 디렉토리의 경로일 수도 있습니다.<br/>자세한 내용은 [tsconfig.json](./tsconfig.json.md)를 참조하세요.
`--reactNamespace`                             | `string`  | `"React"`                      | 더 이상 사용하지 않습니다. `--jsxFactory`를 대신 사용합니다.<br/>`"react"` JSX emit을 대상으로 할 때 `createElement`와 `__spread`에 호출된 객체를 지정합니다.
`--removeComments`                             | `boolean` | `false`                        | `/*!`로 시작하는 copy-right 헤더 주석을 제외한 모든 주석을 제거합니다.
`--resolveJsonModule`                          | `boolean` | `false`                        | `.json` 확장자로 import된 모듈을 포함합니다.
`--rootDir`                                    | `string`  | *(공통 루트 디렉토리는 input files 리스트에서 처리됩니다)*   | 입력 파일의 루트 디렉토리를 지정합니다. `--outDir`로 출력 디렉토리 구조를 제어하기 위해서만 사용합니다.
`rootDirs`<sup>[2]</sup>                       | `string[]`|                                | 런타임 시 결합된 컨텐츠가 프로젝트의 구조를 나타내는 <i>루트</i> 폴더 목록입니다. 자세한 내용은 [모듈 해석 문서](./Module%20Resolution.md#virtual-directories-with-rootdirs)를 참조하세요.
`--showConfig`                                 | `boolean` | `false`                        | 다른 입력 옵션 및 구성 파일을 사용하여 빌드를 실제로 실행하는 대신 출력에 마지막 암시적 구성 파일을 표시하십시오.
`--skipDefaultLibCheck`                        | `boolean` | `false`                        | 더 이상 사용하지 않습니다. `--skipLibCheck`를 대신 사용합니다.<br/>[기본 라이브러리 선언 파일](./Triple-Slash%20Directives.md#-reference-no-default-libtrue)의 타입 검사를 건너뜁니다.
`--skipLibCheck`                               | `boolean` | `false`                        | 모든 선언 파일(`*.d.ts`)의 타입 검사를 건너뜁니다.
`--sourceMap`                                  | `boolean` | `false`                        | 해당하는 `.map` 파일을 생성합니다.
`--sourceRoot`                                 | `string`  |                                | 디버거가 소스 위치 대신 TypeScript 파일을 찾아야 하는 위치를 지정합니다. 설계 시점에 소스가 아닌 런타임에 소스가 있는 경우 이 옵션을 사용하세요. 지정한 위치는 소스 파일이 위치할 디버깅 위치를 지정하기 위해 소스 맵에 포함됩니다.
`--strict`                                     | `boolean` | `false`                        | 모든 엄격한 타입 검사 옵션을 활성화합니다. <br/>`--strict`를 활성화하면 `--noImplicitAny`, `--noImplicitThis`, `--alwaysStrict`, `--strictNullChecks` 및 `--strictFunctionTypes`이 가능합니다.
`--strictBindCallApply`                        | `boolean` | `false`                        | 함수에서 `bind`, `call` 그리고 `apply` 메서드의 더 엄격한 검사를 활성화합니다.
`--strictFunctionTypes`                        | `boolean` | `false`                        | 함수 타입에 대한 bivariant 매개변수를 비활성화합니다.
`--strictPropertyInitialization`               | `boolean` | `false`                        | undefined가 아닌 클래스 프로퍼티가 생성자에서 초기화 되도록 합니다. 이 옵션을 적용하려면 `--strictNullChecks`가 활성화되어야 합니다.
`--strictNullChecks`                           | `boolean` | `false`                        | 엄격한 null 검사 모드에서는 `null`과 `undefined` 값이 모든 타입의 도메인에 있지 않고 그 자체와 `any`만 할당할 수  있습니다(한 가지 예외사항은 `undefined` 또한 `void`에 할당 가능하다는 것입니다).
`--suppressExcessPropertyErrors`               | `boolean` | `false`                        | 객체 리터럴에 대한 프로퍼티 초과 검사를 억제합니다.
`--suppressImplicitAnyIndexErrors`             | `boolean` | `false`                        | 인덱스 시그니처가 없는 객체를 인덱싱하는 경우 `--noImplicitAny` 억제합니다. 오류를 시그니처 자세한 내용은 [#1232 이슈](https://github.com/Microsoft/TypeScript/issues/1232#issuecomment-64510362)를 참조하세요.
`--target`<br/>`-t`                            | `string`  | `"ES3"`                        | ECMAScript 대상 버전 지정: <br/>► `"ES3"` (기본 값) <br/>► `"ES5"` <br/>► `"ES6"`/`"ES2015"` <br/>► `"ES2016"` <br/>► `"ES2017"` <br/>► `"ES2018"` <br/>► `"ES2019"` <br/>► `"ES2020"` <br/>► `"ESNext"` <br/><br/> 주의사항: `"ESNext"`는 최신 [ES 제안 기능](https://github.com/tc39/proposals)을 대상으로 합니다.
`--traceResolution`                            | `boolean` | `false`                        | 모듈 해석 로그 메세지를 보고합니다.
`--tsBuildInfoFile`                            | `string`  | `.tsbuildinfo`                 | 증분 빌드 정보를 저장할 파일을 지정합니다.
`--types`                                      | `string[]`|                                | 타입 정의가 포함될 이름의 목록. 자세한 내용은 [@types, --typeRoots 및 --types](./tsconfig.json.md#types-typeroots-and-types)를 참조하세요.
`--typeRoots`                                  | `string[]`|                                | 타입 정의가 포함될 폴더의 목록. 자세한 내용은 [@types, --typeRoots 및 --types](./tsconfig.json.md#types-typeroots-and-types)를 참조하세요.
`--version`<br/>`-v`                           |           |                                | 컴파일러의 버전을 출력합니다.
`--watch`<br/>`-w`                             |           |                                | 컴파일러를 감시 모드로 실행합니다. 입력 파일을 감시하여 변경 시 다시 컴파일합니다. 감시 파일과 디렉터리의 구현은 환경 변수를 사용하여 구성합니다. 더 자세한 내용은 [감시 구성하기](./Configuring%20Watch.md)를 보세요.

* <sup>[1]</sup> 이 옵션은 실험단계입니다.
* <sup>[2]</sup> 이 옵션은 `tsconfig.json`에서만 허용되며 커맨드 라인에서는 허용되지 않습니다.

## 관련사항 (Related)

* [`tsconfig.json`](./tsconfig.json.md) 파일에서 컴파일러 옵션 설정하기
* [MSBuild projects](./Compiler-Options-in-MSBuild.md) 프로젝트에서 컴파일러 옵션 설정하기