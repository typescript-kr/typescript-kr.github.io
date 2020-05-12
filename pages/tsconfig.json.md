## 개요 (Overview)

디렉토리에 `tsconfig.json` 파일이 있다면 해당 디렉토리가 TypeScript 프로젝트의 루트가 됩니다.  
`tsconfig.json` 파일은 프로젝트를 컴파일하는 데 필요한 루트 파일과 컴파일러 옵션을 지정합니다.
프로젝트는 다음 방법들로 컴파일됩니다:

## tsconfig.json 사용하기 (Using tsconfig.json)

* 입력 파일 없이 `tsc`를 호출하면 컴파일러는 현재 디렉토리에서부터 시작하여 상위 디렉토리 체인으로 `tsconfig.json` 파일을 검색합니다.
* 입력 파일이 없이 `tsc`와 `tsconfig.json` 파일이 포함된 디렉토리 경로 또는 설정이 포함된 유효한 경로의 `.json` 파일 경로를 지정하는  `--project` (또는 `-p`) 커맨드 라인 옵션을 사용할 수 있습니다.

커맨드 라인에 입력 파일을 지정하면 `tsconfig.json` 파일이 무시됩니다.

tsconfig의 컴파일러 옵션에 대해 자세한 내용은 [the v2 site](https://www.typescriptlang.org/v2/en/tsconfig)에 있는
TSConfig Reference beta을 확인하세요.

## 예제 (Examples)

`tsconfig.json` 예제 파일들:

* `"files"` 속성 사용하기

  ```json
  {
      "compilerOptions": {
          "module": "commonjs",
          "noImplicitAny": true,
          "removeComments": true,
          "preserveConstEnums": true,
          "sourceMap": true
      },
      "files": [
          "core.ts",
          "sys.ts",
          "types.ts",
          "scanner.ts",
          "parser.ts",
          "utilities.ts",
          "binder.ts",
          "checker.ts",
          "emitter.ts",
          "program.ts",
          "commandLineParser.ts",
          "tsc.ts",
          "diagnosticInformationMap.generated.ts"
      ]
  }
  ```

* `"include"` 와 `"exclude"` 속성 사용하기

  ```json
  {
      "compilerOptions": {
          "module": "system",
          "noImplicitAny": true,
          "removeComments": true,
          "preserveConstEnums": true,
          "outFile": "../../built/local/tsc.js",
          "sourceMap": true
      },
      "include": [
          "src/**/*"
      ],
      "exclude": [
          "node_modules",
          "**/*.spec.ts"
      ]
  }
  ```

## 상세 설명 (Details)

`"compilerOptions"` 속성은 생략될 수 있으며 생략하면 컴파일러의 기본 값이 사용됩니다. 지원되는 전체 목록은 [컴파일러 옵션](./Compiler%20Options.md)를 참고하세요.

`"files"` 속성은 상대 또는 절대 파일 경로 목록을 갖습니다.  
`"include"`와 `"exclude"` 속성은 glob과 유사한 파일 패턴 목록을 갖습니다.  
지원되는 glob 와일드카드는 다음과 같습니다:

* `*` 0개 이상의 문자와 매칭 (디렉토리 구분 기호 제외)
* `?` 한 문자와 매칭 (디렉토리 구분 기호 제외)
* `**/` 반복적으로 모든 하위 디렉토리와 매칭

glob 패턴의 구분에 `*` 또는 `. *`만 있다면, 지원하는 확장자 파일만 포함됩니다 (예: 기본적으로는 `.ts`, `.tsx` 및 `.d.ts`이고, `allowJs` true로 설정되어 있다면 `.js`와 `.jsx`).

`"files"`과 `"include"` 모두 지정되어 있지 않다면 컴파일러는 기본적으로 `"exclude"` 속성을 사용하여 제외된 것은 제외하고 모든 TypeScript (`.ts`,`.d.ts` 그리고 `.tsx`) 파일을 포함하는 디렉토리와 하위 디렉토리에 포함시킵니다. `allowJs`가 true로 설정되면 JS 파일(`.js`와 `.jsx`)도 포함됩니다.
`"files"`과 `"include"` 모두 지정되어 있다면 컴파일러는 그 두 속성에 포함된 파일의 결합을 포함합니다.
`"exclude"` 속성이 지정되지 않으면, `"outDir"` 컴파일러 옵션을 사용하여 지정된 디렉토리의 파일은 제외됩니다.

`"include"`을 사용하여 포함된 파일들은 `"exclude"` 속성을 사용해 필터링할 수 있습니다.  
그러나 `"files"` 속성을 명시적으로 사용하는 파일은 `"exclude"`에 관계없이 항상 포함됩니다.  
`"exclude"` 속성에 디렉토리가 지정되지 있지 않다면 기본적으로 `node_modules`, `bower_components`, `jspm_packages` 그리고 `<outDir>`를 제외합니다.

`"files"` 또는 `"include"` 속성에 포함되어 있는 파일이 참조되는 모든 파일도 포함됩니다.  
비슷하게, 파일 `B.ts`가 또 다른 파일 `A.ts`에 의해 참조된다면, 참조 파일 `A.ts`가 `"exclude"` 목록에서도 지정되지 않는 한 `B.ts`는 제외될 수 없습니다.

컴파일러에는 출력이 가능한 파일이 포함되어 있지 않다는 점에 주의해야 합니다; 즉 입력에 `index.ts`가 포함되면 `index.d.ts`와 `index.js`는 제외됩니다.
일반적으로 확장자만 다른 파일은 서로 옆에 두지 않는 것이 좋습니다.

`tsconfig.json` 파일은 완전히 비어둘 수 있으며, 기본 컴파일러 옵션으로 기본적으로 (위에서 설명한대로) 포함된 모든 파일을 컴파일합니다.

커맨드 라인에 지정된 컴파일러 옵션은 `tsconfig.json` 파일에 지정된 옵션을 오버라이드합니다.

## `@types`, `typeRoots` 및 `types` (`@types`, `typeRoots` and `types`)

기본적으로 *보이는* 모든 "`@types`"  패키지가 컴파일에 포함됩니다.  
동봉된 모든 폴더의 `node_modules/@types` 패키지는 표시된 것으로 간주됩니다.  
구체적으로 `./node_modules/@types/`,  `../node_modules/@types/`, `../../node_modules/@types/` 등의 패키지를 의미합니다.

`typeRoots`를 지정하면 `typeRoots` 아래에 있는 패키지*만* 포함됩니다.
예를 들어:

```json
{
   "compilerOptions": {
       "typeRoots" : ["./typings"]
   }
}
```

이 설정 파일에는 `./typings`의 *모든* 패키지가 포함되며 `./node_modules/@types`의 패키지는 포함되지 않습니다.

`types`을 지정하면 오직 해당 패키지 목록만 포함됩니다.
예를 들어:

```json
{
   "compilerOptions": {
       "types" : ["node", "lodash", "express"]
   }
}
```

이 `tsconfig.json`은 *오직* `./node_modules/@types/node`, `./node_modules/@types/lodash` 및 `./node_modules/@types/express`만 포함합니다.  
`node_modules/@types/*` 아래의 다른 패키지는 포함되지 않습니다.

types 패키지는 `index.d.ts` 파일이 있는 폴더 또는 폴더에 `types` 필드를 가진 `package.json`가 있는 폴더입니다.

`"types": []`를 지정하면 `@types` 패키지가 자동으로 포함되지 않습니다.

전역 선언이 포함된 파일을 사용하는 경우에만 자동 포함이 중요하다는 점에 명심하세요 (모듈로 선언된 파일과 달리).
예를 들어 `import "foo"` 문을 사용한다면 TypeScript는 여전히 `node_modules` 및 `node_modules/@types` 폴더를 보고 `foo` 패키지를 찾을 것입니다.

## `extends`를 이용한 설정 상속하기 (Configuration inheritance with `extends`)

`tsconfig.json` 파일은 `extends` 속성을  사용해 다른 파일의 설정을 상속할 수 있습니다.

`extends`는 `tsconfig.json`의 최상위 속성 (`compilerOptions`,`files`,`include` 및 `exclude`와 함께) 입니다.  
`extends`' 값은 상속받을 다른 설정 파일의 경로를 포함하는 문자열입니다.
경로는 Node.js 해석 스타일을 사용할 수 있습니다.

기본 파일의 설정이 먼저 로드된 다음 상속되는 설정 파일의 설정에 의해 재정의됩니다.  
순환성 장애와 맞닥뜨리면 오류를 보고합니다.

상속 설정 파일에서 `files`, `include` 및 `exclude`는 기본 설정 파일을 *덮어씁니다.*

설정 파일에 있는 모든 상대적 경로는 해당 경로가 원래 있던 설정 파일을 기준으로 해석됩니다.

예를 들어:

`configs/base.json`:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`:

```json
{
  "extends": "./configs/base",
  "files": [
    "main.ts",
    "supplemental.ts"
  ]
}
```

`tsconfig.nostrictnull.json`:

```json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

## `compileOnSave`

최상위 속성 `compileOnSave`를 IDE에 설정하면 저장 시 지정된 tsconfig.json에 대한 모든 파일을 생성합니다.

```json
{
   "compileOnSave": true,
   "compilerOptions": {
       "noImplicitAny" : true
   }
}
```

이 기능은 현재 TypeScript 1.8.4 이상과 [atom-typescript](https://github.com/TypeStrong/atom-typescript#compile-on-save) 플러그인이 있는 Visual Studio 2015에서 지원됩니다.

## 스키마 (Schema)

스키마는 [http://json.schemastore.org/tsconfig](http://json.schemastore.org/tsconfig)에서 찾을 수 있습니다.
