## 컴파일러 옵션

옵션                                           | 타입      | 기본값                         | 설명
-----------------------------------------------|-----------|--------------------------------|----------------------------------------------------------------------
`--allowJs`                                    | `boolean` | `false`                        | JavaScript 파일 컴파일 허용합니다
`--allowSyntheticDefaultImports`               | `boolean` | `module === "system"`          | default export가 없는 모듈에서 default imports를 허용합니다. 코드 방출에는 영향을 주지 않으며 단지 타입 검사에 불과합니다.
`--allowUnreachableCode`                       | `boolean` | `false`                        | 연결할 수 없는 코드에 대한 오류를 보고하지 않습니다.
`--allowUnusedLabels`                          | `boolean` | `false`                        | 사용되지 않는 레이블에 대한 오류 보고하지 않습니다.
`--alwaysStrict`                               | `boolean` | `false`                        | 각 소스 파일에 대해 strict 모드로 구문 파싱을 하고 `"use strict"`을 내보냅니다.
`--baseUrl`                                    | `string`  |                                | 비-상대적 모듈 이름을 해석하기 위한 기본 디렉토리. 자세한 내용은 [모듈 해석 문서](./Module Resolution.md#base-url)을 참조하세요.
`--charset`                                    | `string`  | `"utf8"`                       | 입력 파일의 문자열 집합입니다.
`--checkJs`                                    | `boolean` | `false`                        | `.js` 파일에 오류를 보고합니다. `--allowJs`와 함께 사용하세요.
`--declaration`<br/>`-d`                       | `boolean` | `false`                        | 해당하는 `.d.ts` 파일을 생성합니다.
`--declarationDir`                             | `string`  |                                | 생성된 선언 파일의 출력 디렉토리입니다.
`--diagnostics`                                | `boolean` | `false`                        | 진단 정보를 보여줍니다.
`--disableSizeLimit`                           | `boolean` | `false`                        | JavaScript 프로젝트의 사이즈 제한을 중지합니다.
`--downlevelIteration`                         | `boolean` | `false`                        | ES5 또는 ES3를 대상으로 할 때 `for..of`, spread 및 destructuring 반복가능한 iterables 지원을 제공합니다.
`--emitBOM`                                    | `boolean` | `false`                        | 출력 파일의 시작 부분에 UTF-8 바이트 순서표(BOM)를 내보냅니다.
`--emitDecoratorMetadata`<sup>[1]</sup>        | `boolean` | `false`                        | 소스에 데코레이터 선언에 대한 설계 타입 메타 데이터를 내보냅니다. 자세한 내용은 [#2577 이슈](https://github.com/Microsoft/TypeScript/issues/2577)을 참조하세요.
`--experimentalDecorators`<sup>[1]</sup>       | `boolean` | `false`                        | ES 데코레이터에 대한 실험적인 지원을 사용하도록 활성화합니다.
`--forceConsistentCasingInFileNames`           | `boolean` | `false`                        | 동일한 파일에 대해 일관성없는 참조를 허용하지 않습니다.
`--help`<br/>`-h`                              |           |                                | 도움말을 출력합니다.
`--importHelpers`                              | `boolean` | `false`                        | 방출된 헬퍼를 임포트합니다. [`tslib`](https://www.npmjs.com/package/tslib)로부터 (예. `__extends`, `__rest`, 등..)
`--inlineSourceMap`                            | `boolean` | `false`                        | 별도의 파일 대신 소스 맵으로 단일 파일을 내보냅니다.
`--inlineSources`                              | `boolean` | `false`                        | 단일 파일 내에서 소스 맵과 함께 소스를 내 보냅니다. `--inlineSourceMap` 또는 `--sourceMap`을 설정해야합니다.
`--init`                                       |           |                                | TypeScript 프로젝트를 초기화하고 `tsconfig.json` 파일을 생성합니다.
`--isolatedModules`                            | `boolean` | `false`                        | 각 파일을 별도의 모듈로 불리하여 변환합니다 ("ts.transpileModule"과 비슷합니다).
`--jsx`                                        | `string`  | `"Preserve"`                   | `.tsx` 파일에서 JSX 지원: `"React"` 또는 `"Preserve"`. [JSX](./JSX.md)를 확인하세요.
`--jsxFactory`                                 | `string`  | `"React.createElement"`        | 리액트 JSX 방출을 대상으로 할 때 사용할 JSX 팩토리 함수를 지정합니다. 예: `React.createElement` 또는 `h`.
`--lib`                                        | `string[]`|                                | 컴파일에 포함될 라이브러리 파일 목록입니다.<br/>가능한 값은 다음과 같습니다:  <br/>► `ES5` <br/>► `ES6` <br/>► `ES2015` <br/>► `ES7` <br/>► `ES2016` <br/>► `ES2017` <br/>► `ESNext` <br/>► `DOM` <br/>► `DOM.Iterable` <br/>► `WebWorker` <br/>► `ScriptHost` <br/>► `ES2015.Core` <br/>► `ES2015.Collection` <br/>► `ES2015.Generator` <br/>► `ES2015.Iterable` <br/>► `ES2015.Promise` <br/>► `ES2015.Proxy` <br/>► `ES2015.Reflect` <br/>► `ES2015.Symbol` <br/>► `ES2015.Symbol.WellKnown` <br/>► `ES2016.Array.Include` <br/>► `ES2017.object` <br/>► `ES2017.SharedMemory` <br/>► `ES2017.TypedArrays` <br/>► `esnext.asynciterable` <br/>► `esnext.promise` <br/><br/> 주의사항: `--lib`가 지정되지 않으면 라이브러리의 기본 리스트가 삽입됩니다. 주입되는 기본 라이브러리는 다음과 같습니다:  <br/> ► `--target ES5`: `DOM,ES5,ScriptHost`<br/>  ► `--target ES6`: `DOM,ES6,DOM.Iterable,ScriptHost`
`--listEmittedFiles`                           | `boolean` | `false`                        | 컴파일의 일부로 생성된 파일의 이름을 출력합니다.
`--listFiles`                                  | `boolean` | `false`                        | 컴파일에 포함된 파일의 이름을 출력합니다.
`--locale`                                     | `string`  | *(특정 플랫폼)*          | 오류 메시지를 표시하는 데 사용할 지역화, 예: en-us. <br/>가능한 값은 다음과 같습니다:  <br/>► English (US): `en` <br/>► Czech: `cs` <br/>► German: `de` <br/>► Spanish: `es` <br/>► French: `fr` <br/>► Italian: `it` <br/>► Japanese: `ja` <br/>► Korean: `ko` <br/>► Polish: `pl` <br/>► Portuguese(Brazil): `pt-BR` <br/>► Russian: `ru` <br/>► Turkish: `tr` <br/>► Simplified Chinese: `zh-CN`  <br/>► Traditional Chinese: `zh-TW`
`--mapRoot`                                    | `string`  |                                | 디버거가 생성된 위치가 아닌 맵 파일의 위치를 지정합니다. .map 파일이 .js 파일과 다른 위치에 런타임시 위치할 경우 이 옵션을 사용하세요. 지정된 위치는 sourceMap에 포함되어 맵 파일이 위치할 디버거를 지정합니다.
`--maxNodeModuleJsDepth`                       | `number`  | `0`                            | node_modules 및 로드 JavaScript 파일 아래에서 검색할 최대 의존성 깊이. `--allowJs`에만 적용됩니다.
`--module`<br/>`-m`                            | `string`  | `target === "ES3" or "ES5" ? "CommonJS" : "ES6"`   | 모듈 코드 생성 지정: `"None"`, `"CommonJS"`, `"AMD"`, `"System"`, `"UMD"`, `"ES6"`, `"ES2015"` 또는 `"ESNext"`.<br/>► `"AMD"`와 `"System"`만 `--outFile`과 함께 사용할 수 있습니다.<br/>► `"ES6"`와 `"ES2015"` 값은 `"ES5"` 또는 이하를 대상으로 할 때 사용할 수 있습니다.
`--moduleResolution`                           | `string`  | `module === "AMD" or "System" or "ES6" ?  "Classic" : "Node"`                    | 모듈 해석 방법 결정. Node.js/io.js 스타일 해석의 경우, `"Node"` 또는 `"Classic"` 중 하나입니다. 자세한 내용은 [모듈 해석 문서](./Module Resolution.md)를 참조하세요.
`--newLine`                                    | `string`  | *(특정 플랫폼)*          | 파일을 내보낼 때 사용되는 지정된 라인 끝의 시퀀스 사용: `"crlf"` (윈도우) 또는 `"lf"` (유닉스)."
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
`--noResolve`                                  | `boolean` | `false`                        | 컴파일된 파일 목록에 트리플-슬래시 참조 또는 모듈 임포트 타겟을 추가하지 않습니다.
`--noStrictGenericChecks`                      | `boolean` | `false`                        | 함수 타입에서 제네릭 시그니처의 엄격한 검사를 비활성화합니다.
`--noUnusedLocals`                             | `boolean` | `false`                        | 사용하지 않는 지역 변수에 대한 오류를 보고합니다.
`--noUnusedParameters`                         | `boolean` | `false`                        | 사용하지 않는 매개 변수에 대한 오류를 보고합니다.
~~`--out`~~                                    | `string`  |                                | DEPRECATED 되어 `--outFile`을 대신 사용합니다.
`--outDir`                                     | `string`  |                                | 출력 구조를 디렉토리로 리다이렉트합니다.
`--outFile`                                    | `string`  |                                | 출력을 단일 파일로 연결하여 방출합니다. 연결의 순서는 컴파일러에 전달된 파일 목록과 트리플-슬래시 참조 그리고 임포트와 함께 결정됩니다. 자세한 내용은 출력 파일 순서 문서를 참조하세요.
`paths`<sup>[2]</sup>                          | `Object`  |                                | List of path mapping entries for module names to locations relative to the `baseUrl`. See [Module Resolution documentation](./Module Resolution.md#path-mapping) for more details.
`--preserveConstEnums`                         | `boolean` | `false`                        | Do not erase const enum declarations in generated code. See [const enums documentation](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#94-constant-enum-declarations) for more details.
`--preserveSymlinks`                            | `boolean` | `false`                       | Do not resolve symlinks to their real path; treat a symlinked file like a real one.
`--pretty`<sup>[1]</sup>                       | `boolean` | `false`                        | 색상 및 컨텍스트를 사용하여 오류 및 메세지 스타일을 지정합니다.
`--project`<br/>`-p`                           | `string`  |                                | Compile a project given a valid configuration file.<br/>The argument can be a file path to a valid JSON configuration file, or a directory path to a directory containing a `tsconfig.json` file.<br/>See [tsconfig.json](./tsconfig.json.md) documentation for more details.
`--reactNamespace`                             | `string`  | `"React"`                      | DEPRECATED. Use `--jsxFactory` instead.<br/>Specifies the object invoked for `createElement` and `__spread` when targeting `"react"` JSX emit.
`--removeComments`                             | `boolean` | `false`                        | Remove all comments except copy-right header comments beginning with `/*!`
`--rootDir`                                    | `string`  | *(공통 루트 디렉토리는 input files 리스트에서 처리됩니다)*   | Specifies the root directory of input files. Only use to control the output directory structure with `--outDir`.
`rootDirs`<sup>[2]</sup>                       | `string[]`|                                | List of <i>root</i> folders whose combined content represent the structure of the project at runtime. See [Module Resolution documentation](./Module Resolution.md#virtual-directories-with-rootdirs) for more details.
`--skipDefaultLibCheck`                        | `boolean` | `false`                        | DEPRECATED. Use `--skipLibCheck` instead.<br/>Skip type checking of [default library declaration files](./Triple-Slash Directives.md#-reference-no-default-libtrue).
`--skipLibCheck`                               | `boolean` | `false`                        | 모든 선언 파일(`*.d.ts`)의 타입 검사를 건너뜁니다.
`--sourceMap`                                  | `boolean` | `false`                        | 해당하는 `.map` 파일을 생성합니다.
`--sourceRoot`                                 | `string`  |                                | Specifies the location where debugger should locate TypeScript files instead of source locations. Use this flag if the sources will be located at run-time in a different location than that at design-time. The location specified will be embedded in the sourceMap to direct the debugger where the source files will be located.
`--strict`                                     | `boolean` | `false`                        | Enable all strict type checking options. <br/>Enabling `--strict` enables `--noImplicitAny`, `--noImplicitThis`, `--alwaysStrict`, `--strictNullChecks` and `--strictFunctionTypes`.
`--strictFunctionTypes`                        | `boolean` | `false`                        | 함수 타입에 대한 bivariant 매개변수를 비활성화합니다.
`--strictNullChecks`                           | `boolean` | `false`                        | In strict null checking mode, the `null` and `undefined` values are not in the domain of every type and are only assignable to themselves and `any` (the one exception being that `undefined` is also assignable to `void`).
`--stripInternal`<sup>[1]</sup>                | `boolean` | `false`                        |  `/** @internal */` JSDoc 주석을 가진 코드에 대한 선언을 방출하지 않습니다.
`--suppressExcessPropertyErrors`               | `boolean` | `false`                        | 객체 리터럴에 대한 프로퍼티 초과 검사를 억제합니다.
`--suppressImplicitAnyIndexErrors`             | `boolean` | `false`                        | 인덱스 시그니처가 없는 객체를 인덱싱하는 경우 `--noImplicitAny` 억제합니다. 오류를 시그니처 자세한 내용은 [#1232 이슈](https://github.com/Microsoft/TypeScript/issues/1232#issuecomment-64510362)를 참조하세요.
`--target`<br/>`-t`                            | `string`  | `"ES3"`                        | ECMAScript 대상 버전 지정: `"ES3"` (기본값), `"ES5"`, `"ES6"`/`"ES2015"`, `"ES2016"`, `"ES2017"` 또는 `"ESNext"`. <br/><br/> 주의사항: `"ESNext"`는 최신 [ES 제안 기능](https://github.com/tc39/proposals)을 대상으로 합니다.
`--traceResolution`                            | `boolean` | `false`                        | 모듈 해석 로그 메세지를 보고합니다.
`--types`                                      | `string[]`|                                | 타입 정의가 포함될 이름의 목록. 자세한 내용은 [@types, --typeRoots 및 --types](./tsconfig.json.md#types-typeroots-and-types)를 참조하세요.
`--typeRoots`                                  | `string[]`|                                | 타입 정의가 포함될 폴더의 목록. 자세한 내용은 [@types, --typeRoots 및 --types](./tsconfig.json.md#types-typeroots-and-types)를 참조하세요.
`--version`<br/>`-v`                           |           |                                | 컴파일러의 버전을 출력합니다.
`--watch`<br/>`-w`                             |           |                                | 컴파일러를 와치 모드로 실행합니다. 입력 파일을 와치하여 변경시 다시 컴파일합니다.

* <sup>[1]</sup> 이 옵션은 실험단계입니다.
* <sup>[2]</sup> 이 옵션은 `tsconfig.json`에서만 허용되며 커맨드 라인에서는 허용되지 않습니다.

## 관련사항

* [`tsconfig.json`](./tsconfig.json.md) 파일에서 컴파일러 옵션 설정하기
* [MSBuild projects](./Compiler-Options-in-MSBuild.md) 프로젝트에서 컴파일러 옵션 설정하기
