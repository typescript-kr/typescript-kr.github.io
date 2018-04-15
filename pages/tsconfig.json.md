## 개요

디렉토리에 `tsconfig.json` 파일이 존재한다는 것은 해당 디렉토리가 TypeScript 프로젝트의 루트임를 나타냅니다.  
`tsconfig.json` 파일은 프로젝트를 컴파일하는 데 필요한 루트 파일과 컴파일러 옵션을 지정합니다.

프로젝트는 다음 방법 중 하나로 컴파일됩니다:

## tsconfig.json 사용 (Using tsconfig.json)

* By invoking tsc with no input files, in which case the compiler searches for the `tsconfig.json` file starting in the current directory and continuing up the parent directory chain.
* By invoking tsc with no input files and a `--project` (or just `-p`) command line option that specifies the path of a directory containing a `tsconfig.json` file, or a path to a valid `.json` file containing the configurations.

커맨드 라인에 입력 파일을 지정하면 `tsconfig.json` 파일이 무시됩니다.

## 예제

`tsconfig.json` 예제 파일들:

* `"files"` 속성 사용

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

* `"include"` 및 `"exclude"` 속성 사용

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

## Details

`"compilerOptions"` 속성은 생략될 수 있으며 이 경우 컴파일러의 기본 값이 사용됩니다.  
지원되는 [컴파일러 옵션](./Compiler Options.md)의 전체 목록보기

`"files"` 속성은 상대적이거나 절대적인 파일 경로 목록을 갖습니다.  
`"include"`와 `"exclude"`는 glob 파일 패턴의 목록과 같은 속성을 갖습니다.  
지원되는 glob 와일드카드는 다음과 같습니다:

* `*` 0개 이상의 문자와 매칭 (디렉토리 separator 제외)
* `?` 한 문자와 매칭 (디렉토리 separator 제외)
* `**/` 반복적으로 모든 하위 디렉토리와 매칭

glob 패턴의 구분에 `*` 또는 `. *`만 있는 경우, 지원하는 확장자 파일만 포함됩니다 (예: 기본적으로는 `.ts`, `.tsx` 및 `.d.ts` / `allowJs` true로 설정시 `.js`와 `.jsx`).

`"files"`과 `"include"` 모두 지정되어 있지 않을 경우 컴파일러는 기본적으로 모든 TypeScript (`.ts`,`.d.ts` 그리고 `.tsx`) 파일을 포함하는 디렉토리와 하위 디렉토리에 포함시킵니다.  
`"exclude"` 속성을 사용하여 제외된 것은 제외합니다.  
`allowJs`가 true로 설정되면 JS 파일(`.js`와 `.jsx`)도 포함됩니다.

`"files"`과 `"include"` 모두 지정되어 있는 경우 컴파일러는 그 두 속성에 포함된 파일의 결합(union)을 대신 포함합니다.  
`"outDir"` 컴파일러 옵션을 사용하여 지정된 디렉토리의 파일들은 `"exclude"` 속성이 지정되지 않은 한 제외됩니다.

`"include"`을 사용하여 포함된 파일들은 `"exclude"` 속성을 사용해 필터링할 수 있습니다.  
그러나 `"files"` 속성을 명시적으로 사용하는 파일은 `"exclude"`에 관계없이 항상 포함됩니다.  
`"exclude"` 속성에 디렉토리가 지정되지 있지 않을 경우 `node_modules`, `bower_components`, `jspm_packages` 그리고 `<outDir>`를 제외합니다.

`"files"` 또는 `"include"` 속성을 통해 파일에 참조되는 모든 파일도 포함됩니다.  

비슷하게, 파일 `B.ts`가 또 다른 파일 `A.ts`에 의해 참조되는 경우, `B.ts`는 참조 파일 `A.ts`가 `"exclude"` 리스트에서도 지정되지 않는 한 제외될 수 없습니다.

컴파일러에는 실행할 수 있는 출력 파일이 포함되어 있지 않다는 점에 주의해야 합니다.  
즉 입력에 `index.ts`가 포함되면 `index.d.ts`와 `index.js`는 제외됩니다.  
일반적으로 파일이 확장자만 다르게 나란히 있는 것은 권장하지 않습니다.

A `tsconfig.json` file is permitted to be completely empty, which compiles all files included by default (as described above) with the default compiler options.

Compiler options specified on the command line override those specified in the `tsconfig.json` file.

## `@types`, `typeRoots` 및 `types`

By default all *visible* "`@types`" packages are included in your compilation.
Packages in `node_modules/@types` of any enclosing folder are considered *visible*;
specifically, that means packages within `./node_modules/@types/`,  `../node_modules/@types/`, `../../node_modules/@types/`, and so on.

If `typeRoots` is specified, *only* packages under `typeRoots` will be included.
For example:

```json
{
   "compilerOptions": {
       "typeRoots" : ["./typings"]
   }
}
```

This config file will include *all* packages under `./typings`, and no packages from `./node_modules/@types`.

If `types` is specified, only packages listed will be included.
For instance:

```json
{
   "compilerOptions": {
       "types" : ["node", "lodash", "express"]
   }
}
```

This `tsconfig.json` file will *only* include  `./node_modules/@types/node`, `./node_modules/@types/lodash` and `./node_modules/@types/express`.
Other packages under `node_modules/@types/*` will not be included. 

A types package is a folder with a file called `index.d.ts` or a folder with a `package.json` that has a `types` field.

Specify `"types": []` to disable automatic inclusion of `@types` packages.

Keep in mind that automatic inclusion is only important if you're using files with global declarations (as opposed to files declared as modules).
If you use an `import "foo"` statement, for instance, TypeScript may still look through `node_modules` & `node_modules/@types` folders to find the `foo` package.

## Configuration inheritance with `extends`

A `tsconfig.json` file can inherit configurations from another file using the `extends` property.

The `extends` is a top-level property in `tsconfig.json` (alongside `compilerOptions`, `files`, `include`, and `exclude`).
`extends`' value is a string containing a path to another configuration file to inherit from.

The configuration from the base file are loaded first, then overridden by those  in the inheriting config file.
If a circularity is encountered, we report an error.

`files`, `include` and `exclude` from the inheriting config file *overwrite* those from the base config file.

All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

For example:

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

Setting a top-level property `compileOnSave` signals to the IDE to generate all files for a given tsconfig.json upon saving.

```json
{
   "compileOnSave": true,
   "compilerOptions": {
       "noImplicitAny" : true
   }
}
```

This feature is currently supported in Visual Studio 2015 with TypeScript 1.8.4 and above, and [atom-typescript](https://github.com/TypeStrong/atom-typescript#compile-on-save) plugin.

## Schema

Schema can be found at: [http://json.schemastore.org/tsconfig](http://json.schemastore.org/tsconfig)