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

데코레이터 팩토리를 사용하려면 다음 예제에서 이 평가 순서를 관찰할 수 있습니다:

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

매개 변수 Decorator, 메서드, 접근제어자 또는 속성 Decorator가 각 정적 멤버에 적용됩니다.
Method, Accessor, PropertiesDecorator등에 의한 파라미터 Decorator는 각 정적 멤버에 대해 적용된다.

1. *메서드*, *접근제어자* 또는 *프로퍼티 데코레이터*에 이어지는 *매개변수 데코레이터*는 각 인스턴스 멤버에 적용됩니다.
2. *메서드*, *접근제어자* 또는 *프로퍼티 데코레이터*에 이어지는 *매개변수 데코레이터*는 각 정적 멤버에 적용됩니다.
3. *매개변수* 데코레이터는 생성자에 적용됩니다.
4. *클래스* 데코레이터는 클래스에 적용됩니다.

## 클래스 데코레이터 (Class Decorators)

*클래스 데코레이터*는 클래스 선언 바로 직전에 선언됩니다.  
클래스 데코레이터는 클래스 정의를 관찰, 수정 또는 바꾸는 데 사용할 수 있는 클래스 생성자에 적용됩니다.  
클래스 데코레이터는 선언 파일이나 다른 ambient 컨텍스트(예: `선언` 클래스)에서 사용할 수 없습니다.

클래스 데코레이터에 대한 표현식은 런타임에 함수로 호출되며 데코레이팅 클래스의 생성자는 대상을 유일한 인수로 호출됩니다.

클래스 데코레이터가 값을 반환하는 경우, 클래스 선언을 제공된 생성자 함수로 대체합니다.

> 주의사항&nbsp; 새 생성자 함수를 반환하도록 선택해야하는 경우 원본 프로토타입을 유지하도록 관리해야합니다. 런타임에 데코레이터를 적용하는 로직은 이 작업을 수행하지 **않습니다.**

다음은 `Greeter` 클래스에 적용된 클래스 데코레이터(`@sealed`)의 예제입니다:

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

다음 함수 선언을 사용하여 `@sealed` 데코레이터를 정의할 수 있습니다:

```ts
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
```

`@sealed`가 실행되면 생성자와 프로토타입 모두를 봉인합니다.  
다음은 생성자를 재정의하는 방법에 대한 예제입니다.

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

*메서드 데코레이터*는 메서드 선언 바로 직전에 선언됩니다.  
데코레이터는 메서드의 *프로퍼티 Descriptor*에 적용되며 메서드 정의를 관찰, 수정 또는 바꾸는 데 사용할 수 있습니다.  
메서드 데코레이터는 선언 파일, 오버로드 또는 기타 ambient 컨텍스트 (예: `선언` 클래스)에서 사용할 수 없습니다.

메서드 데코레이터의 표현식은 런타임에 다음 세 가지 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수거나 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름
3. 멤버의 *프로퍼티 Descriptor*

> 주의사항&emsp; 스크립트 타겟이 `ES5`보다 작은 경우 *프로퍼티 Descriptor*는 `undefined`가 됩니다.

메서드 데코레이터가 값을 반환하는 경우 해당 메서드에 대해 *프로퍼티 Descriptor*로 사용됩니다.

> 주의사항&emsp; 스크립트 타겟이 `ES5`보다 작은 경우 반환 값은 무시됩니다.

다음은 `Greeter`클래스의 메서드에 적용된 메서드 데코레이터 (`@enumerable`)의 예제입니다:

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

다음 함수 선언을 사용하여 `@enumerable` 데코레이터를 정의할 수 있습니다:

```ts
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
```

`@enumerable(false)` 데코레이터는 [데코레이터 팩토리](#decorator-factories)입니다.  
`@enumerable(false)` 데코레이터가 호출되면 프로퍼티 Descriptor의 `enumerable` 프로퍼티를 수정합니다.

## 접근제어자 데코레이터 (Accessor Decorators)

*접근제어자 데코레이터*는 접근제어자 선언 바로 직전에 선언됩니다.  
접근제어자 데코레이터는 접근제어자에 대한 프로퍼티 Descriptor에 적용되며 접근제어자 정의를 관찰, 수정 또는 바꾸는 데 사용할 수 있습니다.  
데코레이터는 메서드의 *프로퍼티 Descriptor*에 적용되며 메서드 정의를 관찰, 수정 또는 바꾸는 데 사용할 수 있습니다.  
접근제어자 데코레이터는 선언 파일이나 다른 ambient 컨텍스트 (예: `선언` 클래스)에서 사용할 수 없습니다.

> 주의사항&emsp; TypeScript는 단일 멤버에 대한 접근제어자 `get`과 `set` 모두 데코레이팅하는 것을 허용하지 않습니다.
대신 멤버의 모든 데코레이터가 순서를 따라 첫 번째 접근제어자에게 적용되어야 합니다. 왜냐하면 데코레이터가 *프로퍼티 Descriptor*에 적용되기 때문입니다. 그리고 각 선언을 별도로 구분하지 않고 `get`과 `set` 접근제어자를 결합합니다.

접근제어자 데코레이터 표현식은 런타임시 다음 세 가지 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수나 인스턴스 멤버에 대한 클래스의 프로토타입이 있습니다
2. 멤버의 이름
3. 멤버에 *프로퍼티 Descriptor*

> 주의사항&emsp; 스크립트 타겟이 `ES5`보다 작은 경우 *프로퍼티 Descriptor*는 `undefined`가 됩니다.

접근제어자 데코레이터가 값을 반환하면 경우 해당 멤버에 대한 *프로퍼티 Descriptor*로 사용됩니다.

> 주의사항&emsp; 스크립트 타겟이 `ES5`보다 작은 경우 반환 값은 무시됩니다.

다음은 `Point` 클래스의 멤버에 적용된 접근제어자 데코레이터 (`@configurable`)의 예제입니다:

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

*프로퍼티 데코레이터*는 프로퍼티 선언 바로 직전에 선언됩니다.  
프로퍼티 데코레이터는 선언 파일이나 기타 ambient 컨텍스트 (예: `선언` 클래스)에서 사용할 수 없습니다.

프로퍼티 데코레이터의 표현식은 런타임에 다음 두 가지 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름

> 주의사항&emsp; *프로퍼티 Descriptor*는 프로퍼티 Descriptor가 TypeScript에서 초기화되는 방법으로 인해 프로퍼티 Descriptor에 대한 인수로 제공되지 않습니다.
이는 현재 프로토타입의 멤버을 정의할 때 인스턴스 프로퍼티를 설명하는 메커니즘이 없고, 프로퍼티에 대한 이니셜라이저를 관찰하거나 수정할 방법이 없기 때문이다. 반환 값도 무시됩니다.
따라서 프로퍼티 데코레이터는 특정 이름의 프로퍼티가 클래스에 대해 선언되는 것을 관찰하는 데만 사용할 수 있습니다.

다음 예와 같이 이 정보를 사용하여 프로퍼티에 대한 메타 데이터를 기록할 수 있습니다:

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

그 다음 함수 선언을 사용하여 `@format` 데코레이터와 `getFormat` 함수를 정의 할 수 있습니다:

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

`@format("Hello, %s")` 데코레이터는 [데코레이터 팩토리](#decorator-factories)입니다.  
`@format("Hello, %s")`이 호출되면 `reflect-metadata` 라이브러리의 `Reflect.metadata` 함수를 사용하여 프로퍼티에 대한 메타 데이터 항목을 추가합니다.  
`getFormat`를 호출하면 포맷에 대한 메타 데이터를 읽습니다.

> 참고&emsp; 이 예제에는 `reflect-metadata` 라이브러리가 필요합니다. `reflect-metadata` 라이브러리에 대한 자세한 정보는 [메타 데이터](#metadata)를 참조하세요.

## 매개변수 데코레이터 (Parameter Decorators)

*매개변수 데코레이터*는 매개변수 선언 바로 직전에 선언됩니다.  
매개변수 데코레이터는 클래스 생성자 또는 메서드 선언의 함수에 적용됩니다.  
매개변수 데코레이터는 선언 파일, 오버로드 또는 기타 ambient 컨텍스트 (예: `선언` 클래스)에서 사용할 수 없습니다.

매개변수 데코레이터의 표현식은 런타임에 다음 세 가지 인수와 함께 함수로 호출됩니다:

1. 정적 멤버에 대한 클래스의 생성자 함수 또는 인스턴스 멤버에 대한 클래스의 프로토타입
2. 멤버의 이름
3. 함수의 매개 변수 목록내에 매개 변수의 서수(순서가 있는) 인덱스

> 주의사항&emsp; 매개변수 데코레이터는 매개변수가 메서드에 선언되었음을 관찰하는 데만 사용할 수 있습니다.

매개변수 데코레이터의 반환 값은 무시됩니다.

다음은 `Greeter` 클래스 멤버의 매개 변수에 적용된 매개 변수 데코레이터 (`@required`)의 예제입니다:

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

그 다음 함수 선언을 사용해 `@required`와 `@validate` 데코레이터를 정의할 수 있습니다:

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

`@required` 데코레이터는 필요에 따라 매개변수를 표시하는 메타 데이터 항목을 추가합니다.   
`@validate` 데코레이터는 기존 메서드을 호출하기 전에 기존의 `greet` 메서드를  validates 함수로 래핑합니다.

> 주의사항&emsp; 이 예제에는 `reflect-metadata` 라이브러리가 필요합니다. `reflect-metadata` 라이브러리에 대한 자세한 정보는 [메타 데이터](#metadata)를 참조하세요.

## 메타 데이터

일부 예제에서는 [실험적인 메타 데이터 API](https://github.com/rbuckton/ReflectDecorators)에 대한 polyfill을 추가하는 `reflect-metadata` 라이브러리를 사용합니다.  
이 라이브러리는 아직 ECMAScript (JavaScript) 표준에 속하지 않습니다.  
하지만 데코레이터가 공식적으로 ECMAScript 표준의 일부로 채택되면 이러한 확장 기능이 채택되도록 제안될 것입니다.

이 라이브러리는 npm을 통해 설치할 수 있습니다:

```shell
npm i reflect-metadata --save
```

TypeScript는 데코레이터가 있는 선언에 대한 특정 타입의 메타 데이터를 방출하기 위한 실험적인 지원을 포함하고 있습니다.  
이 실험적인 지원을 활성화하려면 커맨드 라인 또는 `tsconfig.json`에서  컴파일러 옵션 `emitDecoratorMetadata`을 설정해야 합니다:

**커맨드 라인**:

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

활성화가 될 때 `reflect-metadata` 라이브러리를 임포트 한 추가적인 design-time 타입 정보는 런타임에 노출됩니다.

다음 예제에서는 이러한 기능이 실제로 작동하는 것을 볼 수 있습니다:

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

TypeScript 컴파일러는 `@Reflect.metadata` 데코레이터를 사용하여 design-time 타입 정보를 주입합니다.

다음과 같은 TypeScript와 동일한 것으로 간주할 수 있습니다:

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

> 참고&emsp; 데코레이터 메타 데이터는 시험적인 기능이며 향후 공개에서 중요한 변경 사항을 도입할 수 있습니다.