## 개요

컴파일러 옵션은 MSBuild 프로젝트 내의 MSBuild 속성을 사용하여 지정할 수 있습니다.

## 예제

```XML
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>false</TypeScriptSourceMap>
  </PropertyGroup>
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
```

## 맵핑

컴파일러 옵션                              | MSBuild 속성 이름                      | 허용된 값
---------------------------------------------|--------------------------------------------|-----------------
`--allowJs`                                  | *MSBuild에서 지원되지 않습니다*                 |
`--allowSyntheticDefaultImports`             | TypeScriptAllowSyntheticDefaultImports     | boolean
`--allowUnreachableCode`                     | TypeScriptAllowUnreachableCode             | boolean
`--allowUnusedLabels`                        | TypeScriptAllowUnusedLabels                | boolean
`--alwaysStrict`                             | TypeScriptAlwaysStrict                     | boolean
`--baseUrl`                                  | TypeScriptBaseUrl                          | 파일 경로
`--charset`                                  | TypeScriptCharset                          |
`--declaration`                              | TypeScriptGeneratesDeclarations            | boolean
`--declarationDir`                           | TypeScriptDeclarationDir                   | 파일 경로
`--diagnostics`                              | *MSBuild에서 지원되지 않습니다*                 |
`--disableSizeLimit`                         | *MSBuild에서 지원되지 않습니다*                 |
`--emitBOM`                                  | TypeScriptEmitBOM                          | boolean
`--emitDecoratorMetadata`                    | TypeScriptEmitDecoratorMetadata            | boolean
`--experimentalAsyncFunctions`               | TypeScriptExperimentalAsyncFunctions       | boolean
`--experimentalDecorators`                   | TypeScriptExperimentalDecorators           | boolean
`--forceConsistentCasingInFileNames`         | TypeScriptForceConsistentCasingInFileNames | boolean
`--help`                                     | *MSBuild에서 지원되지 않습니다*                 |
`--importHelpers`                            | TypeScriptImportHelpers                    | boolean
`--inlineSourceMap`                          | TypeScriptInlineSourceMap                  | boolean
`--inlineSources`                            | TypeScriptInlineSources                    | boolean
`--init`                                     | *MSBuild에서 지원되지 않습니다*                 |
`--isolatedModules`                          | TypeScriptIsolatedModules                  | boolean
`--jsx`                                      | TypeScriptJSXEmit                          | `React` 또는 `Preserve`
`--jsxFactory`                               | TypeScriptJSXFactory                       | 제한된 이름
`--lib`                                      | TypeScriptLib                              | 쉼표로 구분된 문자열 목록
`--listEmittedFiles`                         | *MSBuild에서 지원되지 않습니다*                 |
`--listFiles`                                | *MSBuild에서 지원되지 않습니다*                 |
`--locale`                                   | *자동*                                | 자동으로 PreferredUILang 값 설정
`--mapRoot`                                  | TypeScriptMapRoot                          | 파일 경로
`--maxNodeModuleJsDepth`                     | *MSBuild에서 지원되지 않습니다*                 |
`--module`                                   | TypeScriptModuleKind                       | `AMD`, `CommonJs`, `UMD`, `System` or `ES6`
`--moduleResolution`                         | TypeScriptModuleResolution                 | `Classic` 또는 `Node`
`--newLine`                                  | TypeScriptNewLine                          | `CRLF` 또는 `LF`
`--noEmit`                                   | *MSBuild에서 지원되지 않습니다*                 |
`--noEmitHelpers`                            | TypeScriptNoEmitHelpers                    | boolean
`--noEmitOnError`                            | TypeScriptNoEmitOnError                    | boolean
`--noFallthroughCasesInSwitch`               | TypeScriptNoFallthroughCasesInSwitch       | boolean
`--noImplicitAny`                            | TypeScriptNoImplicitAny                    | boolean
`--noImplicitReturns`                        | TypeScriptNoImplicitReturns                | boolean
`--noImplicitThis`                           | TypeScriptNoImplicitThis                   | boolean
`--noImplicitUseStrict`                      | TypeScriptNoImplicitUseStrict              | boolean
`--noStrictGenericChecks`                    | TypeScriptNoStrictGenericChecks            | boolean
`--noUnusedLocals`                           | TypeScriptNoUnusedLocals                   | boolean
`--noUnusedParameters`                       | TypeScriptNoUnusedParameters               | boolean
`--noLib`                                    | TypeScriptNoLib                            | boolean
`--noResolve`                                | TypeScriptNoResolve                        | boolean
`--out`                                      | TypeScriptOutFile                          | 파일 경로
`--outDir`                                   | TypeScriptOutDir                           | 파일 경로
`--outFile`                                  | TypeScriptOutFile                          | 파일 경로
`--paths`                                    | *MSBuild에서 지원되지 않습니다*                 |
`--preserveConstEnums`                       | TypeScriptPreserveConstEnums               | boolean
`--preserveSymlinks`                         | TypeScriptPreserveSymlinks                 | boolean
`--listEmittedFiles`                         | *MSBuild에서 지원되지 않습니다*                 |
`--pretty`                                   | *MSBuild에서 지원되지 않습니다*                 |
`--reactNamespace`                           | TypeScriptReactNamespace                   | string
`--removeComments`                           | TypeScriptRemoveComments                   | boolean
`--rootDir`                                  | TypeScriptRootDir                          | 파일 경로
`--rootDirs`                                 | *MSBuild에서 지원되지 않습니다*                 |
`--skipLibCheck`                             | TypeScriptSkipLibCheck                     | boolean
`--skipDefaultLibCheck`                      | TypeScriptSkipDefaultLibCheck              | boolean
`--sourceMap`                                | TypeScriptSourceMap                        | 파일 경로
`--sourceRoot`                               | TypeScriptSourceRoot                       | 파일 경로
`--strict`                                   | TypeScriptStrict                           | boolean
`--strictFunctionTypes`                      | TypeScriptStrictFunctionTypes              | boolean
`--strictNullChecks`                         | TypeScriptStrictNullChecks                 | boolean
`--stripInternal`                            | TypeScriptStripInternal                    | boolean
`--suppressExcessPropertyErrors`             |  TypeScriptSuppressExcessPropertyErrors    | boolean
`--suppressImplicitAnyIndexErrors`           | TypeScriptSuppressImplicitAnyIndexErrors   | boolean
`--target`                                   | TypeScriptTarget                           | `ES3`, `ES5`, 또는 `ES6`
`--traceResolution`                          | *MSBuild에서 지원되지 않습니다*                 |
`--types`                                    | *MSBuild에서 지원되지 않습니다*                 |
`--typeRoots`                                | *MSBuild에서 지원되지 않습니다*                 |
`--watch`                                    | *MSBuild에서 지원되지 않습니다*                 |
*MSBuild 전용 옵션*                        | TypeScriptAdditionalFlags                  | *모든 컴파일러 옵션*

## 여러분의 Visual Studio 버전에서 지원되는 기능은 무엇일까요?

`C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets` 파일을 확인하세요.  
MSBuild XML 태그와 `tsc` 컴파일러 옵션 사이의 신뢰할 수 있는 맵핑이 여기에 있습니다.

## ToolsVersion

프로젝트 파일의 `<TypeScriptToolsVersion>1.7</TypeScriptToolsVersion>` 속성 값은 빌드하는 데 사용할 컴파일러 버전을 식별합니다 (이 예제에서는 1.7).  
이렇게 하면 프로젝트가 다른 컴퓨터에 있는 동일한 버전의 컴파일러에 대한 빌드를 허용합니다.

만약 `TypeScriptToolsVersion`이 지정되지 않으면 설치된 최신 컴파일러 버전을 사용하여 빌드합니다.

최신 버전의 TS를 사용하는 사용자에게는 첫 로드 시 프로젝트를 업그레이드하라는 메시지가 표시됩니다

## TypeScriptCompileBlocked

다른 빌드 도구를 사용하여 프로젝트 (예: 걸프, 그런트 등) 그리고 개발을 위한 VS와 디버깅 환경을 사용하는 경우 프로젝트에서 `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>`를 설정하세요.

이렇게 하면 모든 편집 지원이 제공되지만 F5키를 눌러도 빌드가 지원되지 않습니다.
