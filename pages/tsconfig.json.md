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

If the `"files"` and `"include"` are both left unspecified, the compiler defaults to including all TypeScript (`.ts`, `.d.ts` and `.tsx`) files in the containing directory and subdirectories except those excluded using the `"exclude"` property. JS files (`.js` and `.jsx`) are also included if `allowJs` is set to true.
If the `"files"` or `"include"` properties are specified, the compiler will instead include the union of the files included by those two properties.
Files in the directory specified using the `"outDir"` compiler option are excluded as long as `"exclude"` property is not specfied. 

Files included using `"include"` can be filtered using the `"exclude"` property.
However, files included explicitly using the `"files"` property are always included regardless of `"exclude"`.
The `"exclude"` property defaults to excluding the `node_modules`, `bower_components`, `jspm_packages` and `<outDir>` directories when not specified.

Any files that are referenced by files included via the `"files"` or `"include"` properties are also included.
Similarly, if a file `B.ts` is referenced by another file `A.ts`, then `B.ts` cannot be excluded unless the referencing file `A.ts` is also specified in the `"exclude"` list.

Please note that the compiler does not include files that can be possible outputs; e.g. if the input includes `index.ts`, then `index.d.ts` and `index.js` are excluded.
In general, having files that differ only in extension next to each other is not recomended.

A `tsconfig.json` file is permitted to be completely empty, which compiles all files included by default (as described above) with the default compiler options.

Compiler options specified on the command line override those specified in the `tsconfig.json` file.

## `@types`, `typeRoots` and `types`

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