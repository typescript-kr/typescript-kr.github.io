# 소개

TypeScript와 ES6의 클래스가 도입됨에 따라 클래스 및 클래스 멤버에 어노테이션 또는 변경을 지원하기 위해 추가적인 기능이 필요한 일부 상황이 있습니다.  
데코레이터는 클래스 선언과 멤버에 대한 어노테이션과 메타-프로그래밍 구문을 모두 추가할 수 있는 방법을 제공합니다.  
데코레이터는 JavaScript의 [stage 2 제안](https://github.com/tc39/proposal-decorators)이며 TypeScript의 실험적인 기능으로 사용할 수 있습니다.
> 주의사항&emsp; 데코레이터는 향후 변경될 수 있는 실험적 기능입니다.

데코레이터에 대한 실험적인 지원을 사용하려면 커맨드 라인이나 `tsconfig.json`에서 `experimentalDecorators` 컴파일러 옵션을 사용하도록 활성화해야 합니다:

**커맨드 라인**:

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

# 데코레이터

*데코레이터*는 [클래스 선언](#class-decorators), [메서드](#method-decorators), [접근제어자](#accessor-decorators), [프로퍼티](#property-decorators) 또는 [매개변수](#parameter-decorators)에 첨부될 수 있는 특별한 종류의 선언입니다.  
데코레이터는 `@표현식`의 형태를 사용하는데, 여기서 표현식은 데코레이팅된 선언에 대한 정보와 함께 런타임에 호출될 함수로 평가되어야 합니다.  

예를 들어, 데코레이터 `@sealed`을 사용하여 다음과 같이 `sealed` 함수를 작성할 수 있습니다:

```ts
function sealed(target) {
    // 'target'으로 뭐든 해보세요 ...
}
```

> 주의사항&emsp; 아래의 [클래스 데코레이터](#class-decorators)에서 데코레이터에 대한 더욱 자세한 예제를 볼 수 있습니다.

## 데코레이터 팩토리

선언에 데코레이터를 적용하는 방법을 커스터마이징하고 싶다면 데코레이터 팩토리를 작성할 수 있습니다.  
*Decorator Factory*는 간단히 런타임에 데코레이터에 의해 호출될 표현식을 반환하는 함수입니다.

다음과 같은 방식으로 데코레이터 팩토리를 작성할 수 있습니다:

```ts
function color(value: string) { // 이것은 데코레이터 팩토리입니다
    return function (target) { // 이것은 데코레이터입니다
        // 'target'과 'value'로 뭐든 해보세요...
    }
}
```

> 주의사항&emsp; 아래의 [메서드 데코레이터](#method-decorators)에서 데코레이터 팩토리에 대한 더욱 자세한 예제를 볼 수 있습니다.

## 데코레이터 구성

다음 예제처럼 여러 데코레이터를 선언에 적용 할 수 있습니다:

* 한 줄에:

  ```ts
  @f @g x
  ```

* 여러 줄에:

  ```ts
  @f
  @g
  x
  ```

여러 데코레이터가 단일 선언에 적용되는 경우 평가는 [수학에서의 함수 구성](http://en.wikipedia.org/wiki/Function_composition)과 유사합니다.  
이 모델에서 함수 *f*와 *g*을 구성할 때, 결과적인 합성 (*f* ∘ *g*)(*x*)은(는) *f*(*g*(*x*))와 동일합니다.

따라서 TypeScript의 단일 선언에서 여러 데코레이터를 평가할 때 다음 단계를 수행합니다:

1.  각 데코레이터에 대한 표현식은 위에서 아래로 평가됩니다.
2. 그런 다음 결과는 아래에서 위로 함수를 호출합니다.

데코레이터 팩토리를 사용하려면 다음 예에서 이 평가 순서를 관찰할 수 있습니다:

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

그러면 이 출력을 콘솔에 출력합니다:

```shell
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## 데코레이터 평가 (Decorator Evaluation)

클래스 내의 다양한 선언에 데코레이터를 적용하는 방법에는 잘 정의된 순서가 있습니다:

매개 변수 Decorator, 메서드, 접근 자 또는 속성 Decorator가 각 정적 멤버에 적용됩니다.
Method, Accessor, PropertiesDecorator등에 의한 파라미터 Decorator는 각 정적 멤버에 대해 적용된다.

1. *메서드*, *접근제어자* 또는 *프로퍼티 데코레이터*에 이어지는 *매개변수 데코레이터*는 각 인스턴스 멤버에 적용됩니다.
2. *메서드*, *접근제어자* 또는 *프로퍼티 데코레이터*에 이어지는 *매개변수 데코레이터*는 각 정적 멤버에 적용됩니다.
3. *매개변수* 데코레이터는 생성자에 적용됩니다.
4. *클래스* 데코레이터는 클래스에 적용됩니다.

## Class Decorators

A *Class Decorator* is declared just before a class declaration.
The class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition.
A class decorator cannot be used in a declaration file, or in any other ambient context (such as on a `declare` class).

The expression for the class decorator will be called as a function at runtime, with the constructor of the decorated class as its only argument.

If the class decorator returns a value, it will replace the class declaration with the provided constructor function.

> NOTE&nbsp; Should you chose to return a new constructor function, you must take care to maintain the original prototype.
The logic that applies decorators at runtime will **not** do this for you.

The following is an example of a class decorator (`@sealed`) applied to the `Greeter` class:

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

We can define the `@sealed` decorator using the following function declaration:

```ts
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
```

When `@sealed` is executed, it will seal both the constructor and its prototype.

Next we have an example of how to override the constructor.

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

## Method Decorators

A *Method Decorator* is declared just before a method declaration.
The decorator is applied to the *Property Descriptor* for the method, and can be used to observe, modify, or replace a method definition.
A method decorator cannot be used in a declaration file, on an overload, or in any other ambient context (such as in a `declare` class).

The expression for the method decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The *Property Descriptor* for the member.

> NOTE&emsp; The *Property Descriptor* will be `undefined` if your script target is less than `ES5`.

If the method decorator returns a value, it will be used as the *Property Descriptor* for the method.

> NOTE&emsp; The return value is ignored if your script target is less than `ES5`.

The following is an example of a method decorator (`@enumerable`) applied to a method on the `Greeter` class:

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

We can define the `@enumerable` decorator using the following function declaration:

```ts
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
```

The `@enumerable(false)` decorator here is a [decorator factory](#decorator-factories).
When the `@enumerable(false)` decorator is called, it modifies the `enumerable` property of the property descriptor.

## Accessor Decorators

An *Accessor Decorator* is declared just before an accessor declaration.
The accessor decorator is applied to the *Property Descriptor* for the accessor and can be used to observe, modify, or replace an accessor's definitions.
An accessor decorator cannot be used in a declaration file, or in any other ambient context (such as in a `declare` class).

> NOTE&emsp; TypeScript disallows decorating both the `get` and `set` accessor for a single member.
Instead, all decorators for the member must be applied to the first accessor specified in document order.
This is because decorators apply to a *Property Descriptor*, which combines both the `get` and `set` accessor, not each declaration separately.

The expression for the accessor decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The *Property Descriptor* for the member.

> NOTE&emsp; The *Property Descriptor* will be `undefined` if your script target is less than `ES5`.

If the accessor decorator returns a value, it will be used as the *Property Descriptor* for the member.

> NOTE&emsp; The return value is ignored if your script target is less than `ES5`.

The following is an example of an accessor decorator (`@configurable`) applied to a member of the `Point` class:

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

We can define the `@configurable` decorator using the following function declaration:

```ts
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```

## Property Decorators

A *Property Decorator* is declared just before a property declaration.
A property decorator cannot be used in a declaration file, or in any other ambient context (such as in a `declare` class).

The expression for the property decorator will be called as a function at runtime, with the following two arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.

> NOTE&emsp; A *Property Descriptor* is not provided as an argument to a property decorator due to how property decorators are initialized in TypeScript.
This is because there is currently no mechanism to describe an instance property when defining members of a prototype, and no way to observe or modify the initializer for a property. The return value is ignored too.
As such, a property decorator can only be used to observe that a property of a specific name has been declared for a class.

We can use this information to record metadata about the property, as in the following example:

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

We can then define the `@format` decorator and `getFormat` functions using the following function declarations:

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

The `@format("Hello, %s")` decorator here is a [decorator factory](#decorator-factories).
When `@format("Hello, %s")` is called, it adds a metadata entry for the property using the `Reflect.metadata` function from the `reflect-metadata` library.
When `getFormat` is called, it reads the metadata value for the format.

> NOTE&emsp; This example requires the `reflect-metadata` library.
See [Metadata](#metadata) for more information about the `reflect-metadata` library.

## Parameter Decorators

A *Parameter Decorator* is declared just before a parameter declaration.
The parameter decorator is applied to the function for a class constructor or method declaration.
A parameter decorator cannot be used in a declaration file, an overload, or in any other ambient context (such as in a `declare` class).

The expression for the parameter decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The ordinal index of the parameter in the function's parameter list.

> NOTE&emsp; A parameter decorator can only be used to observe that a parameter has been declared on a method.

The return value of the parameter decorator is ignored.

The following is an example of a parameter decorator (`@required`) applied to parameter of a member of the `Greeter` class:

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

We can then define the `@required` and `@validate` decorators using the following function declarations:

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

The `@required` decorator adds a metadata entry that marks the parameter as required.
The `@validate` decorator then wraps the existing `greet` method in a function that validates the arguments before invoking the original method.

> NOTE&emsp; This example requires the `reflect-metadata` library.
See [Metadata](#metadata) for more information about the `reflect-metadata` library.

## Metadata

Some examples use the `reflect-metadata` library which adds a polyfill for an [experimental metadata API](https://github.com/rbuckton/ReflectDecorators).
This library is not yet part of the ECMAScript (JavaScript) standard.
However, once decorators are officially adopted as part of the ECMAScript standard these extensions will be proposed for adoption.

You can install this library via npm:

```shell
npm i reflect-metadata --save
```

TypeScript includes experimental support for emitting certain types of metadata for declarations that have decorators.
To enable this experimental support, you must set the `emitDecoratorMetadata` compiler option either on the command line or in your `tsconfig.json`:

**Command Line**:

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

When enabled, as long as the `reflect-metadata` library has been imported, additional design-time type information will be exposed at runtime.

We can see this in action in the following example:

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
        set(value);
    }
}
```

The TypeScript compiler will inject design-time type information using the `@Reflect.metadata` decorator.
You could consider it the equivalent of the following TypeScript:

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

> NOTE&emsp; Decorator metadata is an experimental feature and may introduce breaking changes in future releases.
