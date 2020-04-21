# 소개 (Introduction)

TypeScript 및 ES6에 클래스가 도입됨에 따라, 클래스 및 클래스 멤버에 어노테이션을 달거나 수정하기 위해 추가 기능이 필요한 특정 시나리오가 있습니다.
데코레이터는 클래스 선언과 멤버에 어노테이션과 메타-프로그래밍 구문을 추가할 수 있는 방법을 제공합니다.
데코레이터는 JavaScript에 대한 [2단계 제안](https://github.com/tc39/proposal-decorators)이며 TypeScript의 실험적 기능으로 이용 가능합니다.

> 참고&emsp; 데코레이터는 향후 릴리스에서 변경될 수 있는 실험적인 기능입니다.

데코레이터에 대한 실험적 지원을 활성화하려면 명령줄 또는 `tsconfig.json`에서 `experimentDecorators` 컴파일러 옵션을 활성화해야합니다:

**명령줄 (Command Line)**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

# 데코레이터 (Decorators)

*데코레이터*는 [클래스 선언](#클래스-데코레이터-class-decorators), [메서드](#메서드-데코레이터-method-decorators), [접근자](#접근자-데코레이터-accessor-decorators), [프로퍼티](#프로퍼티-데코레이터-property-decorators) 또는 [매개 변수](#매개변수-데코레이터-parameter-decorators)에 첨부할 수 있는 특수한 종류의 선언입니다.
데코레이터는 `@expression` 형식을 사용합니다. 여기서 `expression`은 데코레이팅 된 선언에 대한 정보와 함께 런타임에 호출되는 함수여야 합니다.

예를 들어, 데코레이터 `@sealed`를 사용하면 다음과 같이 `sealed` 함수를 작성할 수 있습니다.

```ts
function sealed(target) {
    // 'target' 변수와 함께 무언가를 수행합니다.
}
```

> 참고&emsp; 아래 [데코레이터 클래스](#클래스-데코레이터-class-decorators)에서 더 자세한 데코레이터 예제를 볼 수 있습니다.

## 데코레이터 팩토리 (Decorator Factories)

데코레이터가 선언에 적용되는 방식을 원하는 대로 바꾸고 싶다면 데코레이터 팩토리를 작성할 수 있습니다. *데코레이터 팩토리*는 단순히 데코레이터가 런타임에 호출할 표현식을 반환하는 함수입니다.

다음과 같은 방식으로 데코레이터 팩토리를 작성할 수 있습니다.

```ts
function color(value: string) { // 데코레이터 팩토리
    return function (target) { // 데코레이터
        // 'target'과 'value' 변수를 가지고 무언가를 수행합니다.
    }
}
```

> 참고&emsp; 아래 [메서드 데코레이터](#메서드-데코레이터-mehod-decorators)에서 데코레이터 팩토리에 대한 자세한 예를 볼 수 있습니다.

## 데코레이터 합성 (Decorator Composition)

다음 예제와 같이 선언에 여러 데코레이터를 적용할 수 있습니다.

* 단일 행일 경우:

  ```ts
  @f @g x
  ```

* 여러 행일 경우:

  ```ts
  @f
  @g
  x
  ```

여러 데코레이터가 단일 선언에 적용되는 경우는 [수학의 합성 함수](http://en.wikipedia.org/wiki/Function_composition)와 유사합니다.
이 모델에서 함수 *f*와 *g*을 합성할 때 (*f*∘*g*)(*x*)의 합성 결과는 *f*(*g*(*x*))와 같습니다.

따라서 TypeScript에서 단일 선언에서 여러 데코레이터를 사용할 때 다음 단계가 수행됩니다.

1. 각 데코레이터의 표현은 위에서 아래로 평가됩니다.
2. 그런 다음 결과는 아래에서 위로 함수로 호출됩니다.

[데코레이터 팩토리](#데코레이터-팩토리-decorator-factories)를 사용하는 경우 다음 예제를 통해 이 수행 순서를 관찰 할 수 있습니다.

```ts
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

이는 결과를 콘솔에 출력합니다.

```shell
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## 데코레이터 평가 (Decorator Evaluation)

클래스에서 다양한 선언에 데코레이터를 적용하는 방법은 다음과 같이 잘 정의되어 있습니다.

1. *메서드*, *접근자* 또는 *프로퍼티 데코레이터*가 다음에 오는 *매개 변수 데코레이터*는 각 인스턴스 멤버에 적용됩니다.
2. *메서드*, *접근자* 또는 *프로퍼티 데코레이터*가 다음에 오는 *매개 변수 데코레이터*는 각 정적 멤버에 적용됩니다.
3. *매개 변수 데코레이터*는 생성자에 적용됩니다.
4. *클래스 데코레이터*는 클래스에 적용됩니다.

## 클래스 데코레이터 (Class Decorators)

**클래스 데코레이터**는 클래스 선언 직전에 선언됩니다.
클래스 데코레이터는 클래스 생성자에 적용되며 클래스 정의를 관찰, 수정 또는 교체하는 데 사용할 수 있습니다.
클래스 데코레이터는 선언 파일이나 다른 주변 컨텍스트 (예: `선언` 클래스)에서 사용할 수 없습니다.

클래스 데코레이터의 표현식은 데코레이팅된 클래스의 생성자를 유일한 인수로 런타임에 함수로 호출됩니다.

클래스 데코레이터가 값을 반환하면 클래스가 선언을 제공하는 생성자 함수로 바꿉니다.

> 참고&nbsp; 새 생성자 함수를 반환하도록 선택한 경우 원래 프로토타입을 유지 관리해야 합니다.
런타임에 데코레이터를 적용하는 로직은 이 기능을 **대신해주지 않습니다.**

다음은`Greeter` 클래스에 적용된 클래스 데코레이터 (`@sealed`)의 예입니다.

```ts
@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

다음 함수 선언을 사용하여 `@sealed` 데코레이터를 정의할 수 있습니다.

```ts
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
```

`@sealed`가 실행되면 생성자와 프로토 타입을 모두 감쌉니다.

생성자를 재정의하는 방법에 대한 예제는 다음과 같습니다.

```ts
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));
```

## 메서드 데코레이터 (Method Decorators)

*메서드 데코레이터*는 메서드 선언 직전에 선언됩니다.
데코레이터는 메서드의 *프로퍼티 설명자(Property Descriptor)* 에 적용되며 메서드 정의를 관찰, 수정 또는 대체하는 데 사용할 수 있습니다.
메서드 데코레이터는 선언 파일, 오버로드 또는 기타 주변 컨텍스트(예: `선언` 클래스)에서 사용할 수 없습니다.

메서드 데코레이터의 표현식은 런타임에 다음 세 개의 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입입니다.
2. 멤버의 이름
3. 멤버의 *프로퍼티 설명자*

> 참고&emsp; 스크립트 대상이 'ES5'보다 낮은 경우 *프로퍼티 설명자* 는 'undefined'이 됩니다.

메서드 데코레이터가 값을 반환하면, 메서드의 *프로퍼티 설명자* 로 사용됩니다.

> 참고&emsp; 스크립트 대상이 'ES5'보다 낮은 경우 반환 값은 무시됩니다.

다음은 `Greeter` 클래스의 메서드에 적용된 메서드 데코레이터 (`@ enumerable`)의 예입니다:

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

다음 함수 선언을 사용하여 `@enumerable` 데코레이터를 정의할 수 있습니다.

```ts
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
```

`@enumerable(false)`데코레이터는 [데코레이터 팩토리](#데코레이터-팩토리-DecoratorFactories)입니다.
`@enumerable(false)` 데코레이터가 호출되면 프로퍼티 설명자의 `enumerable` 프로퍼티를 수정합니다.

## 접근자 데코레이터 (Accessor Decorators)

*접근자 데코레이터*는 접근자 선언 바로 전에 선언됩니다.
접근자 데코레이터는 접근자의 *프로퍼티 설명자*에 적용되며 접근자의 정의를 관찰, 수정 또는 교체하는 데 사용할 수 있습니다.
접근자 데코레이터는 선언 파일이나 다른 주변 컨텍스트(예: `선언` 클래스)에서 사용할 수 없습니다.

> 참고&emsp; TypeScript는 단일 멤버에 대해 `get` 및 `set` 접근자를 데코레이팅 할 수 없습니다.
대신 멤버의 모든 데코레이터를 문서 순서대로 지정된 첫 번째 접근자에 적용해야 합니다.
왜냐하면, 데코레이터는 각각의 선언이 아닌 `get`과 `set` 접근자를 결합한 *프로퍼티 설명자*에 적용되기 때문입니다.

접근자 데코레이터의 표현 식은 런타임에 다음 세 가지 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름
3. 멤버의 *프로퍼티 설명자*

> 참고&emsp; 스크립트 대상이 'ES5'보다 낮은 경우 *프로퍼티 설명자*는 `undefined`가 됩니다.

접근자 데코레이터가 값을 반환하면 멤버의 *프로퍼티 설명자*로 사용됩니다.

> 참고&emsp; 스크립트 대상이 'ES5'보다 낮은 경우 반환 값은 무시됩니다.

다음은 `Point` 클래스의 멤버에 적용되는 접근자 데코레이터 (`@configurable`)의 예입니다:

```ts
class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}
```

다음 함수 선언을 사용하여 `@configurable` 데코레이터를 정의할 수 있습니다:

```ts
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```

## 프로퍼티 데코레이터 (Property Decorators)

*프로퍼티 데코레이터*는 프로퍼티 선언 바로 전에 선언됩니다.
프로퍼티 데코레이터는 선언 파일이나 다른 주변 컨텍스트(예: `선언` 클래스)에서 사용할 수 없습니다.

프로퍼티 데코레이터의 표현 식은 런타임에 다음 두 개의 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름

> 참고&emsp; TypeScript에서 `프로퍼티 데코레이터`가 초기화되는 방식으로 인해 *프로퍼티 설명자*가 프로퍼티 데코레이터에 대한 인수로 제공되지 않습니다.
현재 프로토타입의 멤버를 정의할 때 인스턴스 프로퍼티를 설명하는 메커니즘이 없고 프로퍼티의 이니셜라이저를 관찰하거나 수정할 수 있는 방법이 없기 때문입니다. 반환 값도 무시됩니다.
따라서 프로퍼티 데코레이터는 특정 이름의 프로퍼티가 클래스에 선언되었음을 관찰하는 데만 사용할 수 있습니다.

이 정보를 사용하여 다음 예와 같이 프로퍼티에 대한 메타데이터를 기록할 수 있습니다:

```ts
class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}
```

다음 함수 선언을 사용하여 `@format` 데코레이터와 `getFormat` 함수를 정의 할 수 있습니다:

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

`@format("Hello, %s")` 데코레이터는 [데코레이터 팩토리](#데코레이터-팩토리-Decorator-Factories)입니다.
`@format("Hello, %s")`가 호출되면 `reflect-metadata` 라이브러리의 `Reflect.metadata` 함수를 사용하여 프로퍼티에 대한 메타데이터 항목을 추가합니다.
`getFormat`이 호출되면 형식의 메타데이터 값을 읽습니다.

> 참고&emsp; 이 예제에는 `reflect-metadata` 라이브러리가 필요합니다.
`reflect-metadata` 라이브러리에 대한 자세한 내용은 [메타데이터](#메타데이터-metadata)를 참조하십시오.

## 매개변수 데코레이터 (Parameter Decorators)

*매개변수 데코레이터*는 매개 변수 선언 직전에 선언됩니다.
매개변수 데코레이터는 클래스 생성자 또는 메서드 선언의 함수에 적용됩니다.
매개변수 데코레이터는 선언 파일, 오버로드 또는 다른 주변 컨텍스트(예: `선언` 클래스)에서 사용할 수 없습니다.

매개 변수 데코레이터의 표현식은 런타임시 다음 세 개의 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름
3. 함수의 매개 변수 목록에 있는 매개 변수의 서수 색인(ordinal index)

> 참고&emsp; 매개변수 데코레이터는 매개변수가 메서드에서 선언되었을 때에만 관찰하는 데에 사용할 수 있습니다.

메개변수 데코레이터의 반환 값은 무시됩니다.

다음은 `Greeter` 클래스 멤버의 매개 변수에 적용되는 매개 변수 데코레이터 (`@required`)의 예입니다:

```ts
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    @validate
    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}
```

다음 함수 선언을 사용하여 `@required` 및 `@validate` 데코레이터를 정의할 수 있습니다.

```ts
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value;
    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }

        return method.apply(this, arguments);
    }
}
```

`@required` 데코레이터는 필요에 따라 매개변수를 표시하는 메타데이터 항목을 추가합니다.
그런 다음 `@validate` 데코레이터는 원래 메서드를 호출하기 전에 인수 유효성 검증하는 함수로 기존의 `greet` 메서드를 감쌉니다.

> 참고&emsp; 이 예제에는 `reflect-metadata` 라이브러리가 필요합니다.
`reflect-metadata` 라이브러리에 대한 자세한 내용은 [메타데이터] (#메타데이터-metadata)를 참조하십시오.

## 메타데이터 (Metadata)

일부 예제는 [실험적 메타데이터 API](https://github.com/rbuckton/ReflectDecorators)에 대한 폴리필(polyfill)을 추가하는 `reflect-metadata` 라이브러리를 사용합니다.
이 라이브러리는 아직 ECMAScript (JavaScript) 표준의 일부가 아닙니다.
그러나 데코레이터가 공식적으로 ECMAScript 표준의 일부로 채택되면 이러한 확장을 채택하게 될 것입니다.

npm을 통해 설치할 수 있습니다.

```shell
npm i reflect-metadata --save
```

TypeScript에는 데코레이터가 있는 선언에 대해 특정 타입의 메타 데이터를 내보내는 실험적인 지원을 포함합니다.
이 실험적인 지원을 가능하게 하려면, 명령행 또는`tsconfig.json`에서 `emitDecoratorMetadata` 컴파일러 옵션을 설정해야 합니다.

**명령줄**:

```shell
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**:

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

활성화되면 `reflect-metadata`라이브러리를 가져오기만 하면 추가 디자인-타임 타입 정보가 런타임에 사용 가능합니다.

다음 예제에서 이를 확인할 수 있습니다.

```ts
import "reflect-metadata";

class Point {
    x: number;
    y: number;
}

class Line {
    private _p0: Point;
    private _p1: Point;

    @validate
    set p0(value: Point) { this._p0 = value; }
    get p0() { return this._p0; }

    @validate
    set p1(value: Point) { this._p1 = value; }
    get p1() { return this._p1; }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let set = descriptor.set;
    descriptor.set = function (value: T) {
        let type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError("Invalid type.");
        }
        set.call(target, value);
    }
}
```

TypeScript 컴파일러는 `@Reflect.metadata` 데코레이터를 사용하여 디자인-타임 타입 정보를 주입합니다.
다음 TypeScript와 동일하다고 생각할 수 있습니다.

```ts
class Line {
    private _p0: Point;
    private _p1: Point;

    @validate
    @Reflect.metadata("design:type", Point)
    set p0(value: Point) { this._p0 = value; }
    get p0() { return this._p0; }

    @validate
    @Reflect.metadata("design:type", Point)
    set p1(value: Point) { this._p1 = value; }
    get p1() { return this._p1; }
}

```

> 참고&emsp; 데코레이터 메타 데이터는 실험적인 기능으로 향후 릴리스에서 주요 변경 사항이 있을 수 있습니다.
