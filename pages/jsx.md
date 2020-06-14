# 목차 (Table of contents)

[소개 (Introduction)](#소개-introduction)

[기본 사용법 (Basic usage)](#기본-사용법-basic-usage)

[as 연산자 (The as operator)](#as-연산자-the-as-operator)

[타입 검사 (Type Checking)](#타입-검사-type-Checking)
* [내장 요소 (Intrinsic elements)](#내장-요소-intrinsic-elements)
* [값-기반 요소 (Value-based elements)](#값-기반-요소-value-based-elements)
* [함수형 컴포넌트 (Function Component)](#함수형-컴포넌트-function-Component)
* [클래스형 컴포넌트 (Class Component)](#클래스형-컴포넌트-class-Component)
* [속성 타입 검사 (Attribute type checking)](#속성-타입-검사-attribute-type-checking)
* [자식 타입 검사 (Children Type Checking)](#자식-타입-검사-children-type-Checking)

[JSX 결과 타입 (The JSX result type)](#jsx-결과-타입-the-jsx-result-type)

[표현식 포함하기 (Embedding Expressions)](#표현식-포함하기-embedding-expressions)

[리액트와 통합하기 (React integration)](#리액트와-통합하기-react-integration)

[팩토리 함수 (Factory Functions)](#팩토리-함수-factory-functions)

# 소개 (Introduction)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

[JSX](https://facebook.github.io/jsx/)는 내장형 XML 같은 구문입니다.
변환의 의미는 구현에 따라 다르지만 유효한 JavaScript로 변환되어야 합니다.
JSX는 [React](https://reactjs.org/)로 큰 인기를 얻었지만, 이후 다른 구현도 등장했습니다.
TypeScript는 임베딩, 타입 검사, JSX를 JavaScript로 직접 컴파일하는 것을 지원합니다.

## 기본 사용법 (Basic usage)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

JSX를 사용하려면 다음 두 가지 작업을 해야 합니다.

1. 파일 이름을 `.tsx` 확장자로 지정합니다.
2. `jsx` 옵션을 활성화합니다.

TypeScript는 `preserve`, `react` 및 `react-native`라는 세 가지의 JSX 모드와 함께 제공됩니다.
이 모드들은 방출 단계에서만 영향을 미치며, 타입 검사에는 영향을 받지 않습니다.
`preserve` 모드는 다른 변환 단계(예: [Babel](https://babeljs.io/))에 사용하도록 결과물의 일부를 유지합니다.
또한 결과물은 `.jsx` 파일 확장자를 갖습니다.
`react` 모드는 `React.createElement`를 생성하여, 사용하기 전에 JSX 변환이 필요하지 않으며, 결과물은 `.js` 확장자를 갖게 됩니다.
`react-native` 모드는 JSX를 유지한다는 점은 `preserve` 모드와 동일하지만, 결과물은 `.js` 확장자를 갖게 된다는 점이 다릅니다.

|모드|입력|결과|결과 파일 확장자|
|:---|:---|:---|:---|
|`preserve`|`<div />`|`<div />`|`.jsx`|
|`react`|`<div />`|`React.createElement("div")`|`.js`|
|`react-native`|`<div />`|`<div />`|`.js`|

`--jsx` 명령줄 플래그 또는 [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 파일의 해당 옵션을 사용하여 모드를 지정할 수 있습니다.

> *참고: React JSX를 생성할 때 `--jsxFactory` 옵션으로  사용할 JSX 팩토리(JSX factory) 함수를 지정할 수 있습니다 (기본값은 `React.createElement`)

## `as` 연산자 (The `as` operator)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

타입 단언(type assertion)을 어떻게 작성하는지 떠올려 볼까요:

```ts
var foo = <foo>bar;
```

위 코드는 변수 `bar`가 `foo` 타입이라는 것을 단언합니다.
TypeScript는 꺾쇠 괄호를 사용해 타입을 단언하기 때문에, JSX 구문과 함께 사용할 경우 특정 문법 해석에 문제가 될 수도 있습니다. 결과적으로 TypeScript는 `.tsx` 파일에서 화살 괄호를 통한 타입 단언을 허용하지 않습니다.

위의 구문은 `.tsx` 파일에서 사용할 수 없으므로, `as`라는 대체 연산자를 통해 타입 단언을 해야 합니다.
위의 예시는 `as` 연산자로 쉽게 다시 작성할 수 있습니다.

```ts
var foo = bar as foo;
```

`as` 연산자는 `.ts`와 `.tsx` 파일 모두 사용할 수 있으며, 꺾쇠 괄호 형식의 단언과 동일하게 동작합니다.

# 타입 검사 (Type Checking)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

JSX의 타입 검사를 이해하기 위해선, 먼저 내장 요소와 값-기반 요소의 차이점에 대해 알아야 합니다.
JSX 표현식 `<expr />`에서 `expr`은 환경에 내장된 요소(예: DOM 환경의 `div` 또는 `span`) 혹은 사용자가 만든 사용자 정의 컴포넌트를 참조할 것입니다.
이는 다음과 같은 두 가지 이유로 중요합니다:

1. 리액트에서 내장 요소는 `React.createElement("div")`과 같은 문자열로 생성되는 반면, 사용자가 만든 컴포넌트는 `React.createElement("MyComponent")`가 아닙니다.
2. JSX 요소에 전달되는 속성의 타입은 다르게 조회되어야 합니다.
  내장 요소의 속성은 *내재적으로* 알고 있어야 하지만, 컴포넌트는 각각 자신의 속성 집합을 지정하려고 합니다.

TypeScript는 [React와 동일한 규칙](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)을 사용하여 구별합니다.
내장 요소는 항상 소문자로 시작하고 값-기반 요소는 항상 대문자로 시작합니다.

## 내장 요소 (Intrinsic elements)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

내장 요소는 특수 인터페이스 `JSX.IntrinsicElements`에서 조회됩니다.
기본적으로 이 인터페이스가 지정되지 않으면 그대로 진행되어 내장 요소 타입은 검사되지 않습니다.
그러나 이 인터페이스가 *있는* 경우, 내장 요소의 이름은 `JSX.IntrinsicElements` 인터페이스의 프로퍼티로 조회됩니다.
예를 들어:

```ts
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}

<foo />; // 성공
<bar />; // 오류
```

위의 예제에서 `<foo />`는 잘 동작하지만, `<bar />`는 `JSX.IntrinsicElements`에 지정되지 않았기 때문에 오류를 일으킵니다.

> 참고: 다음과 같이 `JSX.IntrinsicElements`에 catch-all 문자열 인덱서를 지정할 수도 있습니다.

```ts
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
```

## 값-기반 요소 (Value-based elements)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

값-기반 요소는 해당 스코프에 있는 식별자로 간단하게 조회됩니다.

```ts
import MyComponent from "./myComponent";

<MyComponent />; // 성공
<SomeOtherComponent />; // 오류
```

값-기반 요소를 정의하는데엔 다음의 두 가지 방법이 있습니다:

1. 함수형 컴포넌트 (FC)
2. 클래스형 컴포넌트

이 두 가지 유형의 값-기반 요소는 JSX 표현식에서 서로 구별할 수 없으므로, TS는 과부하 해결을 사용하여 먼저 함수형 컴포넌트 표현식으로 해석합니다. 이 과정이 성공적으로 진행되면, TS는 이 선언을 표현식으로 해석합니다. 함수형 컴포넌트로 해석되지 않는다면, TS는 클래스형 컴포넌트로 해석을 시도합니다. 이 과정도 실패할 경우, TS는 오류를 보고합니다.

### 함수형 컴포넌트 (Function Component)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

이름에서 알 수 있듯, 컴포넌트는 첫 번째 인수가 `props` 객체인 JavaScript 함수로 정의됩니다.
TS는 컴포넌트의 반환 타입이 `JSX.Element`에 할당 가능하도록 요구합니다.

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>
```

함수형 컴포넌트는 JavaScript 함수이므로, 함수 오버로드 또한 사용 가능합니다:

```ts
interface ClickableProps {
  children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
  home: JSX.Element;
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
  ...
}
```

> 참고: 함수형 컴포넌트는 이전에 무상태 함수형 컴포넌트(SFC)로 알려져 있습니다. 하지만 최근 버전의 리액트에선 더 이상 함수형 컴포넌트를 무상태로 취급하지 않으며, `SFC` 타입과 그 별칭인 `StatelessComponent`은 더 이상 사용되지 않습니다.

### 클래스형 컴포넌트 (Class Component)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

클래스형 컴포넌트의 타입을 정의하는 것은 가능합니다.
이를 위해선 *요소 클래스 타입* 과 *요소 인스턴스 타입* 이라는 새로운 용어를 이해해야 합니다.

`<Expr />`에서, *요소 클래스 타입* 은 `Expr`의 타입입니다.
위의 예시에서 `MyComponent`가 ES6 클래스라면 이 클래스 타입은 클래스 생성자이고 전역입니다.
`MyComponent`가 팩토리 함수라면, 클래스 타입은 해당 함수입니다.

클래스 타입이 결정되면, 인스턴스 타입은 클래스 타입의 생성자 혹은 호출 시그니처(있는 것 중 어느 쪽으로든)에 의한 반환 타입을 결합하여 결정됩니다.
따라서 ES6 클래스의 경우, 인스턴스 타입은 해당 클래스의 인스턴스 타입이 되고, 팩토리 함수의 경우엔 해당 함수로부터 반환된 값의 타입이 됩니다.

```ts
class MyComponent {
  render() {}
}

// 생성자 시그니처 사용
var myComponent = new MyComponent();

// 요소 클래스 타입 => MyComponent
// 요소 인스턴스 타입 => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {
    }
  }
}

// 호출 시그니처 사용
var myComponent = MyFactoryFunction();

// 요소 클래스 타입 => MyFactoryFunction
// 요소 인스턴스 타입 => { render: () => void }
```

흥미롭게도 요소 인스턴스 타입은 `JSX.ElementClass`에 할당 가능해야 하며, 그렇지 않을 경우 오류를 일으킵니다.
기본적으로 `JSX.ElementClass`는 `{}`이지만, 적절한 인터페이스에 적합한 타입으로만 JSX를 사용하도록 제한할 수 있습니다.

```ts
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} }
}

<MyComponent />; // 성공
<MyFactoryFunction />; // 성공

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // 오류
<NotAValidFactoryFunction />; // 오류
```

## 속성 타입 검사 (Attribute type checking)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

속성 타입 검사를 위해선 첫 번째로 *요소 속성 타입* 을 결정해야 합니다.
이는 내장 요소와 값-기반 요소 간에 약간 다른 점이 있습니다.

내장 요소의 경우, 요소 속성 타입은 `JSX.IntrinsicElements`의 프로퍼티 타입과 동일합니다.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean }
  }
}

// 'foo'의 요소 속성 타입은 '{bar?: boolean}'
<foo bar />;
```

값-기반 요소의 경우엔 조금 더 복잡합니다.
이전에 *요소 인스턴스 타입* 의 프로퍼티 타입에 따라 결정됩니다.
사용할 프로퍼티는 `JSX.ElementAttributesProperty`에 따라 결정됩니다.
이는 단일 프로퍼티로 선언되어야 합니다.
이후 해당 프로퍼티 이름을 사용합니다.
TypeScript 2.8 부터 `JSX.ElementAttributesProperty`가 제공되지 않으면, 클래스 요소의 생성자 또는 함수형 컴포넌트의 첫 번째 매개변수 타입을 대신 사용할 수 있습니다.

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // 사용할 프로퍼티 이름을 지정
  }
}

class MyComponent {
  // 요소 인스턴스 타입의 프로퍼티를 지정
  props: {
    foo?: string;
  }
}

// 'MyComponent'의 요소 속성 타입은 '{foo?: string}'
<MyComponent foo="bar" />
```

요소 속성 타입은 JSX에서 속성 타입을 확인하는데 사용됩니다.
선택적 혹은 필수적인 프로퍼티들이 지원됩니다.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number }
  }
}

<foo requiredProp="bar" />; // 성공
<foo requiredProp="bar" optionalProp={0} />; // 성공
<foo />; // 오류, requiredProp이 누락됨
<foo requiredProp={0} />; // 오류, requiredProp은 문자열이어야 함
<foo requiredProp="bar" unknownProp />; // 오류, unknownProp은 존재하지 않음
<foo requiredProp="bar" some-unknown-prop />; // 성공, 'some-unknown-prop'은 유효한 식별자가 아니기 때문에
```

> 참고: 만약 속성 이름이 유효한 JavaScript 식별자(`data-*` 속성 등)가 아닌 경우, 해당 이름을 요소 속성 타입에서 찾을 수 없어도 오류로 간주하지 않습니다.

추가적으로, `JSX.IntrinsicAttributes` 인터페이스는 일반적으로 컴포넌트의 props나 인수로 사용되지 않는 JSX 프레임워크를 위한 추가적인 프로퍼티를 지정할 수 있습니다. - 예를 들면 React의 `key`. 더 나아가서, `JSX.IntrinsicClassAttributes<T>` 제네릭 타입을 사용하여 클래스형 컴포넌트에 대해 동일한 종류의 추가 속성을 지정할 수 있습니다 (함수형 컴포넌트 제외하고). 이 유형에서, 제네릭의 매개변수는 클래스 인스턴스 타입에 해당합니다. React의 경우, 이는 `Ref<T>` 타입의 `ref` 속성을 허용하는 데에 쓰입니다. 일반적으로는, JSX 프레임워크 사용자가 모든 태그에 특정 속성을 제공할 필요가 없다면, 이런 인터페이스의 모든 프로퍼티는 선택적이어야 합니다.

스프레드 연산자 또한 동작합니다:

```JSX
var props = { requiredProp: "bar" };
<foo {...props} />; // 성공

var badProps = {};
<foo {...badProps} />; // 오류
```

## 자식 타입 검사 (Children Type Checking)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

TypeScript 2.3부터, TS는 *자식* 의 타입 검사를 도입했습니다. *자식* 은 자식 *JSX 표현식* 을 속성에 삽입하는 *요소 속성 타입*의 특수한 프로퍼티입니다.
TS는 `JSX.ElementAttributesProperty`를 사용해 *props* 를 결정하는 것과 유사하게, `JSX.ElementChildrenAttribute`를 사용해 해당 props 내의 *자식* 의 이름을 결정합니다.
`JSX.ElementChildrenAttribute`는 단일 프로퍼티로 선언되어야 합니다.

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {};  // 사용할 자식의 이름을 지정
  }
}
```

```ts
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

다른 속성처럼 *자식* 의 타입도 지정할 수 있습니다. 예를 들어 [React 타이핑](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) 을 사용하는 경우 기본 타입을 오버라이드 할 것입니다.

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// 성공
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// 오류 : 자식은 JSX.Element의 배열이 아닌 JSX.Element 타입입니다.
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// 오류 : 자식은 JSX.Element의 배열이나 문자열이 아닌 JSX.Element 타입입니다.
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>
```

# JSX 결과 타입 (The JSX result type)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

기본적으로 JSX 표현식의 결과물은 `any` 타입입니다.
`JSX.Element` 인터페이스를 수정하여 특정한 타입을 지정할 수 있습니다.
그러나 이 인터페이스에서는 JSX의 요소, 속성, 자식에 대한 정보를 검색할 수 없습니다.
이 인터페이스는 블랙박스입니다.

# 표현식 포함하기 (Embedding Expressions)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

JSX는 중괄호(`{ }`)로 표현식을 감싸 태그 사이에 표현식 사용을 허용합니다.

```JSX
var a = <div>
  {["foo", "bar"].map(i => <span>{i / 2}</span>)}
</div>
```

위의 코드는 문자열을 숫자로 나눌 수 없으므로 오류를 일으킵니다.
`preserve` 옵션을 사용할 때, 결과는 다음과 같습니다:

```JSX
var a = <div>
  {["foo", "bar"].map(function (i) { return <span>{i / 2}</span>; })}
</div>
```

# 리액트와 통합하기 (React integration)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

리액트에서 JSX를 사용하기 위해선 [React 타이핑](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)을 사용해야 합니다.
이는 리액트를 사용할 수 있도록 `JSX` 네임스페이스를 적절하게 정의합니다.

```ts
/// <reference path="react.d.ts" />

interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>
  }
}

<MyComponent foo="bar" />; // 성공
<MyComponent foo={0} />; // 오류
```

# 팩토리 함수 (Factory Functions)
<b><a href="#목차-table-of-contents">↥ 위로</a></b>

`jsx: react` 컴파일러 옵션에서 사용하는 팩토리 함수는 설정이 가능합니다. 이는 `jsxFactory` 명령 줄 옵션을 사용하거나 인라인 `@jsx` 주석을 사용하여 파일별로 설정할 수 있습니다. 예를 들어 `jsxFactory`에 `createElement`를 설정했다면, `<div />`는 `React.createElement("div")` 대신 `createElement("div")`으로 생성될 것입니다.

주석 pragma 버전은 다음과 같이 사용할 수 있습니다 (TypeScript 2.8 기준):

```ts
import preact = require("preact");
/* @jsx preact.h */
const x = <div />;
```

이는 다음처럼 생성됩니다:

```ts
const preact = require("preact");
const x = preact.h("div", null);
```

선택된 팩토리는 전역 네임스페이스로 돌아가기 전에 `JSX` 네임스페이스(타입 검사를 위한 정보)에도 영향을 미칩니다. 팩토리가 `React.createElement`(기본값)로 정의되어 있다면, 컴파일러는 전역 `JSX`를 검사하기 전에 `React.JSX`를 먼저 검사할 것입니다. 팩토리가 `h`로 정의되어 있다면, 컴파일러는 전역 `JSX`를 검사하기 전에 `h.JSX`를 검사할 것입니다.
