이 가이드는 TypeScript를 [React](https://reactjs.org/) 및 [webpack](https://webpack.js.org/)에 연결하는 방법을 알려줍니다.

새로운 프로젝트를 시작하는 경우, 먼저 [React Quick Start guide](https://create-react-app.dev/docs/adding-typescript)를 살펴보세요.

그렇지 않으면 이미 [npm](https://www.npmjs.com/)과 함께 [Node.js](https://nodejs.org/)를 사용하고 있다고 가정합니다.

# 프로젝트 배치 (Lay out the project)

새 디렉토리부터 시작하겠습니다.
지금은 이름을 `proj`라고 지정하지만, 원하는대로 변경할 수 있습니다.

```shell
mkdir proj
cd proj
```

시작하기 위해, 다음과 같은 방식으로 프로젝트를 구성하겠습니다:

```text
proj/
├─ dist/
└─ src/
   └─ components/
```

TypeScript 파일은 `src` 폴더에서 시작하여, TypeScript 컴파일러를 통해 실행한 다음, webpack을 거쳐 `dist`의 `main.js` 파일로 끝납니다.
우리가 작성하는 모든 컴포넌트는 `src/components` 폴더 안에 있습니다.

이것을 기본 뼈대로 구성합니다:

```shell
mkdir src
cd src
mkdir components
cd ..
```

Webpack으로 마지막엔 `dist`폴더를 생성할 것입니다.

# 프로젝트 초기화 (Initialize the project)

이제 이 폴더를 npm 패키지로 바꿀 것 입니다.

```shell
npm init -y
```

기본값으로 `package.json` 파일이 생성됩니다.

# 의존성 설치 (Install our dependencies)

먼저 Webpack이 설치되어 있는지 확인합니다.

```shell
npm install --save-dev webpack webpack-cli
```

Webpack은 코드와 선택적으로 모든 의존성을 하나의 `.js`파일로 묶는 도구입니다.

이제 선언 파일과 함께 React 및 React-DOM을 `package.json` 파일에 의존성으로 추가하겠습니다:

```shell
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

`@types/` 접두사는 React와 React-DOM의 선언 파일을 가져오고 싶다는 것을 의미합니다.
일반적으로 `"react"`와 같은 경로를 가져오면, `react` 패키지 자체를 살펴볼 것입니다;
그러나 모든 패키지에 선언 파일이 포함되어 있지 않기 때문에, TypeScript는 `@types/react` 패키지도 찾습니다.
나중에는 이것에 대해 생각할 필요가 없다는 것을 알 수 있습니다.

다음으로, 개발 시 필요한 의존성에 [ts-loader](https://www.npmjs.com/package/ts-loader)와[source-map-loader](https://www.npmjs.com/package/source-map-loader)를 추가합니다.

```shell
npm install --save-dev typescript ts-loader source-map-loader
```

이 의존성들은  TypeScript와 Webpack을 같이 쓸 수 있게 해줍니다.
ts-loader는 Webpack이 `tsconfig.json`이라는 TypeScript 표준 구성 파일을 사용하여 TypeScript 코드를 컴파일하도록 도와줍니다.
source-map-loader는 TypeScript의 소스 맵 출력을 사용하여 *고유한* 소스 맵을 생성할 때 Webpack에 알립니다.
이렇게 하면 기존의 TypeScript 소스 코드를 디버깅하는 것 처럼 최종 출력 파일을 디버깅 할 수 있습니다.

ts-loader가 TypeScript의 유일한 로더는 아님을 유의해주세요

TypeScript를 개발 의존성으로  설치했다는 것에 유의하세요.
`npm link typescript`를 사용하여 TypeScript를 전역 복사본에 연결할 수도 있지만, 덜 일반적인 시나리오입니다.

# TypeScript 구성 파일 추가 (Add a TypeScript configuration file)

작성하려는 코드와 필요한 선언 파일 모두 TypeScript 파일로 가져오기를 원할 것입니다.

이렇게 하려면, 입력 파일 목록과 모든 컴파일 설정을 포함하는 `tsconfig.json` 파일을 만들어야 합니다.
프로젝트 루트에 `tsconfig.json`이라는 새 파일을 생성하고, 다음 내용을 채우세요:

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs",
        "target": "es6",
        "jsx": "react"
    }
}
```

`tsconfig.json` 파일에 대한 자세한 내용은 [여기](./tsconfig.json.md)를 참조하세요.

# 코드 작성하기 (Write some code)

React를 사용하여 첫 번째 TypeScript 파일을 작성해 봅시다.
먼저, `src/components`에 `Hello.tsx` 파일을 만들고 다음과 같이 작성하세요:

```ts
import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
```

이 예제는 [함수 컴포넌트](https://reactjs.org/docs/components-and-props.html#functional-and-class-components)를 사용하지만, 예제를 조금 더 *고급스럽게* 만들 수 있습니다.

```ts
import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps'는 props의 형태를 나타냅니다.
// state는 설정되지 않으므로, `{}` 타입을 사용합니다.
export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}
```

다음 소스를 이용하여 `src`에 `index.tsx`를 생성합니다.

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
```

방금 `Hello` 컴포넌트를 `index.tsx`로 가져왔습니다.
`"react"`나 `"react-dom"`과는 달리, `Hello.tsx`에 대한 *상대 경로*를 사용했다는 것에 유의하세요. - 이것은 중요합니다.
그렇지 않은 경우, TypeScript는 대신 `node_modules` 폴더를 찾았습니다.

`Hello` 컴포넌트를 표시할 페이지도 필요합니다.
`proj`의 루트에 `index.html` 파일을 생성하고 다음과 같이 작성하세요:

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
        <script src="./dist/main.js"></script>
    </body>
</html>
```

우리는 `node_modules` 안에 들어있는 파일을 포함시킵니다.
React와 React-DOM의 npm 패키지에는 웹 페이지에 포함 할 수 있는 독립형 `.js` 파일이 있으며, 보다 빠르게 이동하기 위해 직접 찹조합니다.
이런 파일을 다른 디렉토리에 복사하거나, CDN(Content Delivery Network)에서 호스팅합니다.
Facebook은 CDN-호스트 버전의 React를 제공하며, [여기에서 자세한 내용을 읽을 수 있습니다](http://facebook.github.io/react/downloads.html#development-vs.-production-builds).

# Webpack 구성 파일 생성하기 (Create a webpack configuration file)

프로젝트 디렉토리의 루트에 `webpack.config.js` 파일을 생성합니다.

```js
module.exports = {
    mode: "production",

    // Webpack의 출력물에서 디버깅을 하기위해 소스 맵을 허용합니다.
    devtool: "source-map",

    resolve: {
        // 확인 가능한 확장자로 '.ts' 와 '.tsx' 를 추가합니다.
        extensions: [".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // 모든 '.js' 출력 파일은 'source-map-loader'에서 다시 처리한 소스 맵이 있습니다.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    // 경로가 다음 중 하나와 일치하는 모듈을 가져올 때,
    // 해당 전역 변수가 있다고 가정하고 사용합니다.
    // 브라우저가 빌드간에 라이브러리를 캐시 할 수 있도록
    // 모든 의존성을 묶지 않아도 되기 때문에 중요합니다.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
```

`externals` 필드에 대해 궁금할 것 입니다.
컴파일 시간이 증가하고 브라우저가 라이브러리를 변경하지 않으면, 일반적으로 라이브러리를 캐시 할 수 있기 때문에 모든 React를 동일한 파일에 묶지 않는 것이 좋습니다.

이상적으로 브라우저 내에서 React 모듈을 가져오지만, 대부분의 브라우저는 아직 모듈을 지원하지 않습니다.
대신 라이브러리는 전통적으로 `jQuery` 나 `_` 와 같은 단일 전역 변수를 사용하여 사용할 수 있습니다.
이런 방식을 "namespace pattern"이라고 하며, Webpack을 사용하면 이 방식으로 작성된 라이브러리를 계속 활용할 수 있습니다.
`"react": "React"`를 입력하면 Webpack은 `React` 변수에서 `"react"`를 불러오기 위해 마법을 사용할 것 입니다.

[여기](https://webpack.js.org/concepts)에서 Webpack 구성에 대해 자세히 알아볼 수 있습니다.

# 모든 것을 함께 모아서 (Putting it all together)

그냥 실행합니다:

```shell
npx webpack
```

이제 즐겨 찾는 브라우저에서 `index.html`을 열고 모든 것을 사용할 준비가 되었습니다!
"Hello from TypeScript and React!" 라는 페이지가 나타납니다.
