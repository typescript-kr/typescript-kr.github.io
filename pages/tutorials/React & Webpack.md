이 가이드에서는 TypeScript를 [React](http://facebook.github.io/react/)와 [webpack](http://webpack.github.io/)으로 묶는 방법을 가르쳐줄 것입니다.

새로운 프로젝트를 시작하려면 먼저 [React Quick Start guide](https://create-react-app.dev/docs/adding-typescript/)를 살펴보세요.

그렇지 않으면 [npm](https://www.npmjs.com/)과 [Node.js](https://nodejs.org/)를 이미 사용하고 있다고 가정합니다.

# 프로젝트 배치 (Lay out the project)

새로운 디렉토리부터 시작합시다. 지금은 이름을 `proj`로 지정했지만 원하는대로 변경할 수 있습니다.

```shell
mkdir proj
cd proj
```

시작하려면 다음과 같은 방식으로 프로젝트를 구성해야합니다:

```text
proj/
├─ dist/
└─ src/
   └─ components/
```

TypeScript 파일은 `src` 폴더에서 시작한 TypeScript는 컴파일 후 webpack을 실행하여 `dist`의 `bundle.js` 파일로 끝납니다.  
작성된 모든 구성 요소는`src / components` 폴더에 들어갑니다.

이것을 골격으로 합니다:

```shell
mkdir src
cd src
mkdir components
cd ..
```

Webpack은 결국 `dist` 디렉토리를 생성할 것입니다.

# 프로젝트 초기화 (Initialize the project)

이제 이 폴더를 npm 패키지로 바꿀 것입니다.

```shell
npm init
```

주의사항이 표시되지만 기본값을 자유롭게 사용할 수 있습니다.  
사용자를 위해 생성된 `package.json` 파일에서 언제든 기본값을 변경할 수 있습니다.

# 의존성 설치 (Install our dependencies)

먼저 Webpack이 글로벌으로 설치되어 있는지 확인해보세요.

```shell
npm install -g webpack
```

Webpack은 사용자의 코드를 번들(묶어서)로 제공하고 선택적으로 모든 의존성을 단 하나의 `.js` 파일로 번들링(묶는)하는 도구입니다.

이제 React와 React-DOM을 `package.json` 파일의 의존성으로 추가하겠습니다:

```shell
npm install --save react react-dom @types/react @types/react-dom
```

`@types/` 접두사는 React와 React-DOM을 위한 선언 파일을 가져온다는 것을 의미합니다.  
일반적으로 `"react"`와 같은 경로를 가져 오면 `react` 패키지 자체를 살펴봅니다.  
그러나 모든 패키지가 선언 파일을 포함하는 것은 아니므로 TypeScript는 또한 `@types/react` 패키지를 찾습니다.  
나중에는 이 일에 대해 생각할 필요도 없다는 걸 알게 될 것입니다.

다음으로 [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)와 [source-map-loader](https://www.npmjs.com/package/source-map-loader)에 development-time 의존성을 추가할 것입니다.

```shell
npm install --save-dev typescript awesome-typescript-loader source-map-loader
```

이러한 의존성 둘 다 TypeScript와 webpack이 함께 잘 작동하도록 할 것 입니다.  
awesome-typescript-loader는 Webpack이 TypeScript의 표준 구성 파일 `tsconfig.json`을 사용하여 TypeScript 코드를 컴파일하는 데 도움이 됩니다.  
source-map-loader는 TypeScript의 모든 소스 맵 출력을 사용하여 *자체* 소스 맵을 생성 할 때 webpack에 알립니다.  
이렇게하면 원래 TypeScript 소스 코드를 디버깅 하듯이 최종 출력 파일을 디버깅 할 수 있습니다.

awesome-typescript-loader가 typescript의 유일한 로더는 아닙니다.  
대신 [ts-loader](https://github.com/TypeStrong/ts-loader)를 사용할 수 있습니다.  
[여기에서](https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader)  두 로더 사이의 차이점에 대해 읽어보세요.

개발 의존성으로 TypeScript를 설치했음을 주목하십시오.  
TypeScript를 `npm link typescript`로 글로벌 사본에 연결할 수 있었는데 이것은 흔치 않은 경우입이다.

# TypeScript 설정 파일 추가 (Add a TypeScript configuration file)

TypeScript 파일을 함께 가져오고 싶다면 필요한 선언 파일뿐만 아니라 작성할 코드 모두 작성하세요.

이렇게 하려면 모든 컴파일 설정과 함께 입력 파일 목록이 포함된 `tsconfig.json`을 생성해야 합니다.  
프로젝트 루트에 `tsconfig.json`이라는 이름의 새 파일을 만들고 내용을 다음과 같이 채우기만 하면 됩니다:

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs",
        "target": "es5",
        "jsx": "react"
    },
    "include": [
        "./src/**/*"
    ]
}
```

`tsconfig.json` 파일에 대한 자세한 내용은 [여기](../tsconfig.json.md)를 참조하십시오.

# 몇 가지 코드 작성 (Write some code)

React를 사용하여 첫 번째 TypeScript 파일을 작성해 보겠습니다.  
먼저`src/components`에 `Hello.tsx`라는 이름의 파일을 만들고 다음과 같이 작성합니다:

```ts
import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
```

이 예제에서는 [stateless functional components](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)를 사용하는 경우에 대비하여 예제를 좀 더 *고급스럽게* 만들 수도 있습니다.

```ts
import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps'는 props의 형태을 만듭니다.
// State가 설정되어 있지 않아 '{}'타입을 사용합니다.
export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}
```

그런 다음 `src`에 `index.tsx`를 생성해 봅시다 :

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
```

`Hello` 컴포넌트를 `index.tsx`로 가져왔습니다.  
`"react"` 또는 `"react-dom"`과 달리 `Hello.tsx`에 대한 상대 경로를 사용했음을 주목하세요 - 이것은 중요합니다.  
그렇지 않다면 TypeScript는 대신`node_modules` 폴더를 살펴 보았을 겁니다.

또한 `Hello` 컴포넌트를 보여줄 페이지가 필요합니다.  
다음과 같은 내용을 담은 `index.html`파일을 `proj`의 루트에 만듭니다:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello React!</title>
    </head>
    <body>
        <div id="example"></div>

        <!-- Dependencies -->
        <script src="./node_modules/react/umd/react.development.js"></script>
        <script src="./node_modules/react-dom/umd/react-dom.development.js"></script>

        <!-- Main -->
        <script src="./dist/bundle.js"></script>
    </body>
</html>
```

`node_modules`에서 파일을 포함하고 있음을 주목하십시오.  
React와 React-DOM의 npm 패키지에는 웹 페이지에 포함할 수 있는 독립적인 `.js` 파일이 포함되어 있으며  
이를 빠르게 위해 직접 참조하고 있습니다.
이러한 파일을 다른 디렉토리에 자유롭게 복사하거나 CDN을 통해 호스팅하는 것이 좋습니다.  
페이스북은 React의 CDN 호스팅 버전을 제공하며 [여기에서](http://facebook.github.io/react/downloads.html#development-vs.-production-builds) 더 자세한 내용을 볼 수 있습니다.

# 웹팩 설정 파일 만들기 (Create a webpack configuration file)

프로젝트의 루트에 `webpack.config.js` 파일을 만듭니다.

```js
module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    // webpack의 출력을 디버깅 할 소스 맵을 사용하도록 설정합니다.
    devtool: "source-map",

    resolve: {
        // 확인 가능한 확장자로 '.ts' 및 '.tsx'를 추가합니다.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // '.ts' 또는 '.tsx' 확장자를 가진 모든 파일은 'awesome-typescript-loader'에 의해 처리됩니다.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // '.js' 파일의 모든 출력에는 'source-maps-loader'로 다시 처리된 소스 맵이 있습니다.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // 경로가 다음 중 하나와 일치하는 모듈을 임포트 경우
    // 해당하는 글로벌 변수가 있다고 가정하고 대신 사용하세요.
    // 이는 브라우저가 빌드와 라이브러리 사이에 캐시 할 수 있게 해주는
    // 모든 종속성을 번들로 묶는 것을 피할 수 있기 때문에 중요합니다.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};
```

아마도 `externals` 필드에 대해 궁금해 할지도 모릅니다.  
이렇게 하면 컴파일 시간이 증가하고 브라우저가 일반적으로 라이브러리를 변경하지 않을 경우 캐시 할 수 있으므로 모든 React 파일을 동일한 파일로 번들링하는 것을 방지합니다.

이상적으로는 브라우저에서 React 모듈을 임포트하는 것 뿐이지만 대부분의 브라우저들은 아직도 모듈을 완전히 지원하지 않습니다.  
대신 라이브러리는 전통적으로 `jQuery` 나 `_`와 같은 글로벌 하게 사용하여 자체적으로 사용할 수 있게 했습니다.  
이를 "네임 스페이스 패턴"이라고 하며 webpack을 사용하면 이러한 방식으로 작성된 라이브러리를 계속 활용할 수 있습니다.

`"react"`에 대한 entry를 사용하면 : webpack은 `"React"` 변수에서 `"react"`를 불러오기 위해 마술을 사용합니다.

webpack 설정에 대한 자세한 내용은 [여기](https://webpack.js.org/concepts)를 참조하십시오.

# 모든 것을 함께 모아서 (Putting it all together)

실행 :

```shell
webpack
```

이제 즐겨 찾는 브라우저에 `index.html`을 열면 모든 것을 사용할 준비가 될 것입니다!  
"Hello from TypeScript and React!"라고 쓰인 페이지가 보일 겁니다.