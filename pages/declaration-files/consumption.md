TypeScript 2.0에서는 선언 파일을 얻고, 사용하고, 찾는 것이 훨씬 쉬워졌습니다.
이 페이지에서 세 가지를 어떻게 하는지 정확하게 설명합니다.

# 다운로드 (Downloading)

TypeScript 2.0 이상에서 타입 선언을 가져오는데 npm 이외의 도구는 필요하지 않습니다.

예를 들어, lodash와 같은 라이브러리에 대한 선언을 얻는 것은 다음 명령어로 충분합니다.

```cmd
npm install --save @types/lodash
```

[Publishing](./Publishing.md)에서 설명한 데로 npm 패키지에 이미 선언 파일이 포함되어 있다면, `@types` 패키지를 설치할 필요는 없다는 걸 유의하세요.

# 사용하기 (Consuming)

TypeScript 코드에 별 어려움 없이 lodash를 사용할 수 있습니다.
이는 모듈 및 전역 코드에 모두 적용됩니다.

예를 들어, 타입 선언에 대해 `npm install`을 한 번만 수행하면, import 하고 사용할 수 있고

```ts
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

또는 모듈을 사용하지 않는다면, 전역 변수 `_` 를 사용할 수 있습니다.

```ts
_.padStart("Hello TypeScript!", 20, " ");
```

# 찾기 (Searching)

대부분의 경우, 타입 선언 패키지 이름은 항상 `npm` 상의 패키지 이름과 같아야 하지만, `@types/` 가 앞에 붙어야 합니다.
  하지만 필요시 [https://aka.ms/types](https://aka.ms/types) 를 방문해 선호하는 라이브러리의 패키지를 찾으세요.

> 참고: 만약 찾고자 하는 선언 파일이 없는 경우, 언제든지 기여하고, 다음 개발자가 이를 찾는 데 도움을 줄 수 있습니다.
> 자세한 내용은 DefinitelyTyped의 [기여 지침 페이지](http://definitelytyped.org/guides/contributing.html)를 참고하세요.
