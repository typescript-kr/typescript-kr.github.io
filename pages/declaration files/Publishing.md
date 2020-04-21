이 가이드를 따라 선언 파일을 작성했으므로, 이제 npm에 배포할 시간입니다.
npm에 선언 파일을 배포하는 방법은 크게 두 가지가 있습니다:

1. npm 패키지로 번들링하거나
2. npm의 [@types organization](https://www.npmjs.com/~types)에 배포하기

만약 패키지가 TypeScript로 작성되었다면 첫 번째 방법을 사용하는 것이 좋습니다.
`--declaration` 플래그를 사용하여 선언 파일을 생성하세요.
이 방법을 사용하면, 선언과 JavaScript가 항상 일치하게 됩니다.

만약 패키지가 TypeScript로 작성되지 않았다면 두 번째 방법을 사용하는 것이 좋습니다.

# npm 패키지에 선언 포함하기 (Including declarations in your npm package)

만약 패키지가 메인 `.js` 파일을 가지고 있다면, 메인 선언 파일을 `package.json`에도 표시해야 합니다.
번들링된 선언 파일을 `types` 프로퍼티로 가리키도록 하세요.
예를 들어:

```json
{
    "name": "awesome",
    "author": "Vandelay Industries",
    "version": "1.0.0",
    "main": "./lib/main.js",
    "types": "./lib/main.d.ts"
}
```

`"typings"` 필드는 `"types"`와 동의어이기 때문에 역시 사용할 수 있습니다.

또한 `package.json`이 `"files"` 프로퍼티를 포함하고 있으면 `"types"` 프로퍼티는 무시됩니다. 이 경우 메인 선언 파일을 `"files"` 프로퍼티에 전달해야 합니다.

만약 메인 선언 파일 이름이 `index.d.ts`이고 패키지의 루트에 있으면 (`index.js` 옆에) `"types"` 프로퍼티를 쓰지 않아도 되지만, 쓰는 것이 좋습니다.

## 의존성 (Dependencies)

모든 의존성은 npm으로 관리됩니다.
의존성이 있는 모든 선언 패키지가 `package.json`에 `"dependencies"` 섹션 안에 알맞게 작성되어 있는지 확인하세요.
예를 들어, Browserify와 TypeScript로 작성된 패키지를 생각해봅시다.

```json
{
    "name": "browserify-typescript-extension",
    "author": "Vandelay Industries",
    "version": "1.0.0",
    "main": "./lib/main.js",
    "types": "./lib/main.d.ts",
    "dependencies": {
        "browserify": "latest",
        "@types/browserify": "latest",
        "typescript": "next"
    }
}
```

여기에서, 패키지는 `browserify`와 `typescript` 패키지에 의존성이 있습니다.
`browserify`는 선언 파일이 npm 패키지에 함께 번들링 되지 않기 때문에, `@types/browserify` 선언을 의존성에 추가해야 합니다.
반면에 `typescript`는 선언 파일이 패키징되기 때문에, 별도의 의존성을 추가할 필요가 없습니다.

이 패키지는 `browserify`와 `typescript` 패키지의 각 선언을 노출하기 때문에, `browserify-typescript-extension` 패키지는 이 의존성들을 가져야 합니다.
이 이유로, `"devDependencies"`가 아니라 `"dependencies"`를 사용합니다. 왜냐하면 `"devDependencies"`를 사용하면 사용자가 직접 이 패키지들을 설치해야 하기 때문입니다.
만약에 단지 명령줄 애플리케이션을 작성했고 패키지를 라이브러리로 사용하길 기대하지 않는다면, `devDependencies`를 사용해도 됩니다.

## 경고 플래그 (Red flags)

### `/// <reference path="..." />`

선언 파일에 `/// <reference path="..." />`를 사용하지 *마세요*.

```ts
/// <reference path="../typescript/lib/typescriptServices.d.ts" />
....
```

대신 `/// <reference types="..." />`를 사용*하세요*.

```ts
/// <reference types="typescript" />
....
```

더 자세한 내용을 위해 [의존성 사용하기](./Library%20Structures.md#consuming-dependencies) 섹션을 다시 보십시오.

### 의존적인 선언 패키징하기 (Packaging dependent declarations)

만약 타입 정의가 다른 패키지에 의존적이라면:

* 각 파일은 유지하고 다른 패키지와 합치지 *마세요*.
* 또한 작성한 패키지에 선언을 복사하지 *마세요*.
* 만약 npm 타입 선언 패키지가 선언 파일을 패키징하지 않는다면, 해당 패키지에 의존*하세요*.

# [@types](https://www.npmjs.com/~types)에 배포하기 (Publish to [@types](https://www.npmjs.com/~types))

[@types](https://www.npmjs.com/~types)안에 있는 패키지들은 [타입-배포 도구](https://github.com/Microsoft/types-publisher)를 사용하여 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)에서 자동으로 배포되었습니다.
선언을 @types 패키지로 배포하려면, [https://github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)에 pull request를 제출하세요.
[기여 지침 페이지](http://definitelytyped.org/guides/contributing.html)에서 더 자세한 내용을 찾을 수 있습니다.
