# 소개

[JSX](https://facebook.github.io/jsx/)는 XML 같은 구문이 내장가능합니다.  
의미는 구현에 따라 다르지만 유효한 JavaScript로 변형되어야합니다.  
JSX는 [React](http://facebook.github.io/react/) 에서 인기를 얻었으나 이후 다른 애플리케이션도 볼 수 있습니다.  
TypeScript는 JSX를 직접 JavaScript에 포함, 타입 검사 및 컴파일할 수 있도록 지원합니다.
# 기본 사용 방법

JSX를 사용하려면 두 가지 작업을 해야합니다.

1. 파일의 이름을 `.tsx` 확장자로 지정하세요
2. `jsx` 옵션을 활성화하세요

TypeScript에는 세 가지 JSX 모드가 있습니다: `preserve`, `react`, 그리고 `react-native`.  
이 모드는 방출 단계에만 영향을 미칩니다 - 타입 검사에는 영향 받지 않습니다.  
`preserve` 모드는 다른 변환 단계 (예: [Babel](https://babeljs.io/))에서 더 사용되도록 출력의 일부로 JSX를 계속 유지합니다.  
추가적으로 출력에는 `.jsx` 파일 확장자가 지정되어 있습니다.  
`react` 모드는 `React.createElement`를 내보내고 사용하기 전에 JSX 변환을 거칠 필요가 없으며 출력은 `.js` 파일 확장자를 갖습니다.  
`react-native` 모드는 모든 JSX를 유지하고 있다는 점에서 `preserve`와 같지만 대신 출력은 `.js` 파일 확장자를 갖습니다.

모드           | 입력      | 출력                         | 출력 파일 확장자
---------------|-----------|------------------------------|----------------------
`preserve`     | `<div />` | `<div />`                    | `.jsx`
`react`        | `<div />` | `React.createElement("div")` | `.js`
`react-native` | `<div />` | `<div />`                    | `.js`

이 모드는 커맨드 라인의 `--jsx` 명령 또는 [tsconfig.json](./tsconfig.json.md) 파일의 해당 옵션을 사용하여 지정할 수 있습니다.

> *주의사항: `React` 식별자는 하드 코딩되어 있으므로 대문자 R.*로 React를 사용할 수 있도록 해야 합니다.

# `as` 연산자 (The `as` operator)

타입 표명 작성 방법을 회상해봅시다.

```ts
var foo = <foo>bar;
```

여기서 변수 `bar`의 타입을 `foo`라고 주장하고 있습니다.  
TypeScript도 타입 표명을 위해 꺾쇠 괄호를 사용하기 때문에 JSX의 특정 구문 파싱에는 몇가지 어려움이 있습니다.   
결과적으로 TypeScript는 `.tsx` 파일에 꺽쇠 괄호 타입 표명을 허용하지 않습니다.

이러한 `.tsx` 파일의 기능 손실을 채우기 위해 새로운 타입의 표명 연산자가  추가되었습니다: `as`.  
위 예제는 쉽게 `as` 연산자로 다시 작성할 수 있습니다.

```ts
var foo = bar as foo;
```

`as` 연산자는 `.ts`와 `.tsx` 파일 모두에서 사용할 수 있으며 다른 타입 표명 스타일과 똑같이 동작합니다.

# 타입 검사 (Type Checking)

JSX 타입 검사를 이해하기 위해서는 먼저 내장 요소와 값-기반 요소 사이의 차이를 이해해야 합니다.  
JSX 표현식 `<expr />`이 주어지면 `expr`은 원래 환경에 내장된 것을 참조할 수 있습니다 (예: DOM 환경의 `div` 또는 `span`) 또는 직접 작성한 사용자 정의 구성 요소를 참조할 수 있습니다.

이것이 중요한 두 가지 이유가 있습니다:

1. React의 경우, 내장 요소는 문자열 (`React.createElement("div")`)로 생성되는 반면 생성한 컴포넌트는 (`React.createElement(MyComponent)`)가 아닙니다.
2. JSX 요소에서 전달되는 속성의 타입은 다르게 보여야합니다.  
  내장 요소 속성은 *본질적으로* 알려져야 하는 반면에 컴포넌트는 자체 속성 집합을 지정하기를 원할 수 있습니다.

TypeScript는 이러한 것들을 구분하기 위해 [React와 동일한 컨벤션](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)을 사용합니다.  
내장 요소는 항상 소문자로 시작하고 값-기반 요소는 항상 대문자로 시작합니다.

## 내장 요소 (Intrinsic elements)

내장 요소는 `JSX.IntrinsicElements`라는 특수한 인터페이스에서 볼 수 있습니다.
기본적으로 이 인터페이스가 지정되지 않으면 모든 내장 요소에 타입 검사는 하지 않습니다.  
다만 이 인터페이스가 *존재* 하는 경우, 내부 요소의 이름은 `JSX.IntrinsicElements` 인터페이스의 프로퍼티로서 참조됩니다.

예를 들어:

```ts
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}

<foo />; // 좋아요
<bar />; // 오류
```

위의 예제에서 `<foo />`는 잘 동작하지만 `<bar />`는`JSX.IntrinsicElements`에 지정되지 않았기 때문에 오류가 발생합니다.

> 참고: `JSX.IntrinsicElements`에서 다음과 같이 catch-all 문자열 indexer를 지정할 수도 있습니다:
>```ts
>declare namespace JSX {
>    interface IntrinsicElements {
>        [elemName: string]: any;
>    }
>}
>```

## 값-기반 요소 (Value-based elements)

값 기반 요소는 스코프에 있는 식별자로 간단히 조회됩니다.

```ts
import MyComponent from "./myComponent";

<MyComponent />; // 좋아요
<SomeOtherComponent />; // 오류
```

값 기반 요소를 정의하는 방법에는 두가지가 있습니다.:

1. 무상태 함수형 컴포넌트 (SFC)
2. 클래스 컴포넌트

이 두가지 타입의 값 기반 요소는 JSX 표현식에서 구분할 수 없기 때문에 일단 오버로드 해석을 사용하여 무상태 함수형 컴포넌트로 표현식을 해결하려고합니다.    
프로세스가 성공하면 선언에 대한 표현식을 해결합니다.  
만약 SFC로 해결하지 못한다면 클래스 컴포넌트로 해결하려고합니다.  
만약 실패한다면 오류를 보고합니다.

### 무상태 함수형 컴포넌트(Stateless Functional Component)

이름에서 알 수 있듯이 컴포넌트는 첫 번째 인수가 `props` 객체인 JavaScript 함수로 정의됩니다.  
반환 타입은 `JSX.Element`에 할당 가능하도록 강제합니다.

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name=prop.name />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>
```

SFC는 단순히 JavaScript 함수이기 때문에 여기서도 함수 오버로드를 활용할 수 있습니다.

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

### 클래스 컴포넌트 (Class Component)

클래스 컴포넌트의 타입을 제한할 수 있습니다.  
하지만 이를 위해 새로운 두가지를 도입해야 합니다: *요소 클래스 타입* 과 *요소 인스턴스 타입*

`<Expr />`에 주어진 *요소 클래스 타입* 은 `Expr`입니다.  
따라서 위 예제의 `MyComponent`가 ES6 클래스라면 이 클래스가 그 클래스 타입이 될 것입니다.  
만일 `MyComponent`가 팩토리 함수라면 클래스 타입이 그 함수가 될 것입니다.

한 번 클래스 타입이 설정되면 인스턴스 타입은 클래스 타입의 호출 서명과 구조 서명의 반환 타입 유니온에 따라 결정됩니다.  
다시 ES6클래스의 경우, 인스턴스 타입은 해당 클래스의 인스턴스 타입이 되고 팩토리 함수의 경우 해당 함수에서 반환되는 값의 타입이 됩니다.

```ts
class MyComponent {
  render() {}
}

// 구조 서명 사용
var myComponent = new MyComponent();

// 요소 클래스 타입 => MyComponent
// 요소 인스턴스 타입 => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {
    }
  }
}

// 호출 서명 사용
var myComponent = MyFactoryFunction();

// 요소 클래스 타입 => 팩토리 함수
// 요소 인스턴스 타입 => { render: () => void }
```

요소 인스턴스 타입이 흥미로운 이유는 `JSX.ElementClass`에 할당되어야 하며 그렇지 않을 경우 오류가 발생하기 때문입니다.  
기본적으로 `JSX.ElementClass`는 `{}`이지만 JSX의 사용을 적절한 인터페이스에 맞는 타입으로 제한하도록 확장할 수 있습니다.

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

<MyComponent />; // 좋아요
<MyFactoryFunction />; // 좋아요

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // 오류
<NotAValidFactoryFunction />; // 오류
```

## Attribute type checking

The first step to type checking attributes is to determine the *element attributes type*.
This is slightly different between intrinsic and value-based elements.

For intrinsic elements, it is the type of the property on `JSX.IntrinsicElements`

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean }
  }
}

// element attributes type for 'foo' is '{bar?: boolean}'
<foo bar />;
```

For value-based elements, it is a bit more complex.
It is determined by the type of a property on the *element instance type* that was previously determined.
Which property to use is determined by `JSX.ElementAttributesProperty`.
It should be declared with a single property.
The name of that property is then used.

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // specify the property name to use
  }
}

class MyComponent {
  // specify the property on the element instance type
  props: {
    foo?: string;
  }
}

// element attributes type for 'MyComponent' is '{foo?: string}'
<MyComponent foo="bar" />
```

The element attribute type is used to type check the attributes in the JSX.
Optional and required properties are supported.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number }
  }
}

<foo requiredProp="bar" />; // ok
<foo requiredProp="bar" optionalProp={0} />; // ok
<foo />; // error, requiredProp is missing
<foo requiredProp={0} />; // error, requiredProp should be a string
<foo requiredProp="bar" unknownProp />; // error, unknownProp does not exist
<foo requiredProp="bar" some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier
```

> Note: If an attribute name is not a valid JS identifier (like a `data-*` attribute), it is not considered to be an error if it is not found in the element attributes type.

The spread operator also works:

```JSX
var props = { requiredProp: "bar" };
<foo {...props} />; // ok

var badProps = {};
<foo {...badProps} />; // error
```

## Children Type Checking

In 2.3, we introduce type checking of *children*. *children* is a property in an *element attributes type* which we have determined from type checking attributes.
Similar to how we use `JSX.ElementAttributesProperty` to determine the name of *props*, we use `JSX.ElementChildrenAttribute` to determine the name of *children*.
`JSX.ElementChildrenAttribute` should be declared with a single property.

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {};  // specify children name to use
  }
}
```

Without explicitly specify type of children, we will use default type from [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react).

```ts
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>props.children</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

You can specify type of *children* like any other attribute. This will overwritten default type from [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react).

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        this.props.children
      </h2>
    )
  }
}

// OK
<Component>
  <h1>Hello World</h1>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element
<Component>
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element or string.
<Component>
  <h1>Hello</h1>
  World
</Component>
```

# The JSX result type

By default the result of a JSX expression is typed as `any`.
You can customize the type by specifying the `JSX.Element` interface.
However, it is not possible to retrieve type information about the element, attributes or children of the JSX from this interface.
It is a black box.

# Embedding Expressions

JSX allows you to embed expressions between tags by surrounding the expressions with curly braces (`{ }`).

```JSX
var a = <div>
  {["foo", "bar"].map(i => <span>{i / 2}</span>)}
</div>
```

The above code will result in an error since you cannot divide a string by a number.
The output, when using the `preserve` option, looks like:

```JSX
var a = <div>
  {["foo", "bar"].map(function (i) { return <span>{i / 2}</span>; })}
</div>
```

# React integration

To use JSX with React you should use the [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react).
These typings define the `JSX` namespace appropriately for use with React.

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

<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // error
```
