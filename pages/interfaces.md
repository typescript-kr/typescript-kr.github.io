# 소개 (Introduction)

TypeScript의 핵심 원칙 중 하나는 타입 검사가 값의 *형태*에 초점을 맞추고 있다는 것입니다.
이를 "덕 타이핑(duck typing)" 혹은 "구조적 서브타이핑 (structural subtyping)"이라고도 합니다.
TypeScript에서, 인터페이스는 이런 타입들의 이름을 짓는 역할을 하고 코드 안의 계약을 정의하는 것뿐만 아니라 프로젝트 외부에서 사용하는 코드의 계약을 정의하는 강력한 방법입니다.

# 첫 번째 인터페이스 (Our First Interface)

어떻게 인터페이스가 동작하는지 확인하는 가장 쉬운 방법은 간단한 예제로 시작하는 것입니다:

```ts
function printLabel(labeledObj: { label: string }) {
    console.log(labeledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

타입 검사는 `printLabel` 호출을 확인합니다.
`printLabel` 함수는 `string` 타입 `label`을 갖는 객체를 하나의 매개변수로 가집니다.
이 객체가 실제로는 더 많은 프로퍼티를 갖고 있지만, 컴파일러는 *최소한* 필요한 프로퍼티가 있는지와 타입이 잘 맞는지만 검사합니다.
TypeScript가 관대하지 않은 몇 가지 경우는 나중에 다루겠습니다.

이번엔 같은 예제를, 문자열 타입의 프로퍼티 `label`을 가진 인터페이스로 다시 작성해 보겠습니다:

```ts
interface LabeledValue {
    label: string;
}

function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

`LabeledValue` 인터페이스는 이전 예제의 요구사항을 똑같이 기술하는 이름으로 사용할 수 있습니다.
이 인터페이스는 여전히 `문자열` 타입의 `label` 프로퍼티 하나를 가진다는 것을 의미합니다.
다른 언어처럼 `printLabel`에 전달한 객체가 이 인터페이스를 구현해야 한다고 명시적으로 얘기할 필요는 없습니다.
여기서 중요한 것은 형태뿐입니다. 함수에 전달된 객체가 나열된 요구 조건을 충족하면, 허용됩니다.

타입 검사는 프로퍼티들의 순서를 요구하지 않습니다. 단지 인터페이스가 요구하는 프로퍼티들이 존재하는지와 프로퍼티들이 요구하는 타입을 가졌는지만을 확인합니다.

# 선택적 프로퍼티 (Optional Properties)

인터페이스의 모든 프로퍼티가 필요한 것은 아닙니다.
어떤 조건에서만 존재하거나 아예 없을 수도 있습니다.
선택적 프로퍼티들은 객체 안의 몇 개의 프로퍼티만 채워 함수에 전달하는 "option bags" 같은 패턴을 만들 때 유용합니다.

이 패턴의 예제를 한번 보겠습니다:

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

선택적 프로퍼티를 가지는 인터페이스는 다른 인터페이스와 비슷하게 작성되고, 선택적 프로퍼티는 선언에서 프로퍼티 이름 끝에 `?`를 붙여 표시합니다.

선택적 프로퍼티의 이점은 인터페이스에 속하지 않는 프로퍼티의 사용을 방지하면서, 사용 가능한 속성을 기술하는 것입니다.
예를 들어, `createSquare`안의 `color` 프로퍼티 이름을 잘못 입력하면, 오류 메시지로 알려줍니다:

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color: "white", area: 100};
    if (config.clor) {
        // Error: Property 'clor' does not exist on type 'SquareConfig'
        newSquare.color = config.clor;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

# 읽기전용 프로퍼티 (Readonly properties)

일부 프로퍼티들은 객체가 처음 생성될 때만 수정 가능해야합니다.
프로퍼티 이름 앞에 `readonly`를 넣어서 이를 지정할 수 있습니다:

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

객체 리터럴을 할당하여 `Point`를 생성합니다.
할당 후에는 `x`, `y`를 수정할 수 없습니다.

```ts
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // 오류!
```

TypeScript에서는 모든 변경 메서드(Mutating Methods)가 제거된 `Array<T>`와 동일한 `ReadonlyArray<T>` 타입을 제공합니다. 그래서 생성 후에 배열을 변경하지 않음을 보장할 수 있습니다.

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // 오류!
ro.push(5); // 오류!
ro.length = 100; // 오류!
a = ro; // 오류!
```

예제 마지막 줄에서 `ReadonlyArray`를 일반 배열에 재할당이 불가능한 것을 확인할 수 있습니다.
타입 단언(type assertion)으로 오버라이드하는 것은 가능합니다:

```ts
a = ro as number[];
```

## `readonly` vs `const`

`readonly`와 `const` 중에 어떤 것을 사용할 지 기억하기 가장 쉬운 방법은 변수와 프로퍼티중 어디에 사용할지 질문해 보는 것입니다.
변수는 `const`를 사용하고 프로퍼티는 `readonly`를 사용합니다

# 초과 프로퍼티 검사 (Excess Property Checks)

인터페이스의 첫 번째 예제에서 TypeScript가 `{ label: string; }`을 기대해도 `{ size: number; label: string; }`를 허용해주었습니다. 또한 선택적 프로퍼티를 배우고, 소위 "option bags"을 기술할 때, 유용하다는 것을 배웠습니다.

하지만, 그냥 그 둘을 결합하면 에러가 발생할 수 있습니다.
예를 들어, `createSquare`를 사용한 마지막 예제를 보겠습니다:

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

`createSquare`의 매개변수가 `color`대신 `colour`로 전달된 것에 유의하세요.
이 경우 JavaScript에선 조용히 오류가 발생합니다.

`width` 프로퍼티는 적합하고, `color` 프로퍼티는 없고, 추가 `colour` 프로퍼티는 중요하지 않기 때문에, 이 프로그램이 올바르게 작성되었다고 생각할 수 있습니다.

하지만, TypeScript는 이 코드에 버그가 있을 수 있다고 생각합니다.
객체 리터럴은 다른 변수에 할당할 때나 인수로 전달할 때, 특별한 처리를 받고, *초과 프로퍼티 검사 (excess property checking)*를 받습니다.
만약 객체 리터럴이 "대상 타입 (target type)"이 갖고 있지 않은 프로퍼티를 갖고 있으면, 에러가 발생합니다.

```ts
// error: Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
let mySquare = createSquare({ colour: "red", width: 100 });
```

이 검사를 피하는 방법은 정말 간단합니다.
가장 간단한 방법은 타입 단언을 사용하는 것입니다:

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

하지만 특별한 경우에, 추가 프로퍼티가 있음을 확신한다면, 문자열 인덱스 서명(string index signatuer)을 추가하는 것이 더 나은 방법입니다.
만약 `SquareConfig` `color`와 `width` 프로퍼티를 위와 같은 타입으로 갖고 있고, *또한* 다른 프로퍼티를 가질 수 있다면, 다음과 같이 정의할 수 있습니다.

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

나중에 인데스 서명에 대해 좀 더 다룰 것입니다. 하지만 여기서는 `SquareConfig`가 여러 프로퍼티가 가질 수 있고, 그 프로퍼티들이 `color`나 `width`가 아니라면, 그들의 타입은 중요하지 않습니다.

이 검사를 피하는 마지막 방법은 놀랍게도 객체를 다른 변수에 할당하는 것입니다.
`squareOptions`가 추가 프로퍼티 검사를 받지 않기 때문에, 컴파일러는 에러를 주지 않습니다.

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

`squareOptions`와 `SquareConfig` 사이에 공통 프로퍼티가 있는 경우에만 위와 같은 방법을 사용할 수 있습니다.
이 예제에서는, `width`가 그 경우입니다. 하지만 만약에 변수가 공통 객체 프로퍼티가 없으면 에러가 납니다. 예를 들어:

```ts
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

위처럼 간단한 코드의 경우, 이 검사를 "피하는" 방법을 시도하지 않는 것이 좋습니다.
메서드가 있고 상태를 가지는 등 더 복잡한 객체 리터럴에서 이 방법을 생각해볼 수 있습니다. 하지만 초과 프로퍼티 에러의 대부분은 실제 버그입니다.
그 말은, 만약 옵션 백 같은 곳에서 초과 프로퍼티 검사 문제가 발생하면, 타입 정의를 수정해야 할 필요가 있습니다.
예를 들어, 만약 `createSquare`에 `color`나 `colour` 모두 전달해도 괜찮다면, `squareConfig`가 이를 반영하도록 정의를 수정해야 합니다.

# 함수 타입 (Function Types)

인터페이스는 JavaScript 객체가 가질 수 있는 넓은 범위의 형태를 기술할 수 있습니다.
프로퍼티로 객체를 기술하는 것 외에, 인터페이스는 함수 타입을 설명할 수 있습니다.

인터페이스로 함수 타입을 기술하기 위해, 인터페이스에 호출 서명 (call signature)를 전달합니다.
이는 매개변수 목록과 반환 타입만 주어진 함수 선언과 비슷합니다. 각 매개변수는 이름과 타입이 모두 필요합니다.

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

한번 정의되면, 함수 타입 인터페이스는 다른 인터페이스처럼 사용할 수 있습니다.
여기서 함수 타입의 변수를 만들고, 같은 타입의 함수 값으로 할당하는 방법을 보여줍니다.

```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```

올바른 함수 타입 검사를 위해, 매개변수의 이름이 같을 필요는 없습니다.
예를 들어, 위의 예제를 아래와 같이 쓸 수 있습니다:

```ts
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

함수 매개변수들은 같은 위치에 대응되는 매개변수끼리 한번에 하나씩 검사합니다.
만약 타입을 전혀 지정하지 않고 싶다면, `SearchFunc` 타입의 변수로 직접 함수 값이 할당되었기 때문에 TypeScript의 문맥상 타이핑 (contextual typing)이 인수 타입을 추론할 수 있습니다.
이 예제에서, 함수 표현의 반환 타입이 반환하는 값으로 추론됩니다. (여기서는 `false`와 `true`)

```ts
let mySearch: SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

함수 표현식이 숫자 나 문자열을 반환했다면, 타입 검사는 반환 타입이 `SearchFunc` 인터페이스에 정의된 반환 타입과 일치하지 않는다는 에러를 발생시킵니다.

```ts
let mySearch: SearchFunc;

// error: Type '(src: string, sub: string) => string' is not assignable to type 'SearchFunc'.
// Type 'string' is not assignable to type 'boolean'.
mySearch = function(src, sub) {
  let result = src.search(sub);
  return "string";
};
```

# 인덱서블 타입 (Indexable Types)

인터페이스로 함수 타입을 설명하는 방법과 유사하게, `a[10]` 이나 `ageMap["daniel"]` 처럼 타입을 "인덱스로" 기술할 수 있습니다.
인덱서블 타입은 인덱싱 할때 해당 반환 유형과 함께 객체를 인덱싱하는 데 사용할 수 있는 타입을 기술하는 *인덱스 시그니처 (index signature)*를 가지고 있습니다.
예제를 보겠습니다:

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

위에서 인덱스 서명이 있는 `StringArray` 인터페이스가 있습니다.
이 인덱스 서명은 `StringArray`가 `number`로 색인화(indexed)되면 `string`을 반환할 것을 나타냅니다.

인덱스 서명을 지원하는 타입에는 두 가지가 있습니다: 문자열과 숫자.

두 타입의 인덱서(indexer)를 모두 지원하는 것은 가능하지만, 숫자 인덱서에서 반환된 타입은 반드시 문자열 인덱서에서 반환된 타입의 하위 타입(subtype)이어야 합니다.
이 이유는 `number`로 인덱싱 할 때, JavaScript는 실제로 객체를 인덱싱하기 전에 `string`으로 변환하기 때문입니다.
즉, `100` (`number`)로 인덱싱하는 것은 `"100"` (`string`)로 인덱싱하는 것과 같기 때문에, 서로 일관성 있어야 합니다.

```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 오류: 숫자형 문자열로 인덱싱을 하면 완전히 다른 타입의 Animal을 얻게 될 것입니다!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

문자열 인덱스 시그니처는 "사전" 패턴을 기술하는데 강력한 방법이지만, 모든 프로퍼티들이 반환 타입과 일치하도록 강제합니다.
문자열 인덱스가 `obj.property`가 `obj["property"]`로도 이용 가능함을 알려주기 때문입니다.
다음 예제에서, `name`의 타입은 문자열 인덱스 타입과 일치하지 않고, 타입 검사는 에러를 발생시킵니다.

```ts
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 성공, length는 숫자입니다
    name: string;      // 오류, `name`의 타입은 인덱서의 하위타입이 아닙니다
}
```

하지만, 인덱스 시그니처가 프로퍼티 타입들의 합집합이라면 다른 타입의 프로퍼티들도 허용할 수 있습니다:

```ts
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number;    // 성공, length는 숫자입니다
    name: string;      // 성공, name은 문자열입니다
}
```

마지막으로, 인덱스의 할당을 막기 위해 인덱스 시그니처를 `읽기 전용`으로 만들 수 있습니다:

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // 오류!
```

인덱스 시그니처가 읽기 전용이기 때문에 `myArray[2]`의 값을 할당할 수 없습니다.

# 클래스 타입 (Class Types)

## 인터페이스 구현하기 (Implementing an interface)

클래스가 특정 계약(contract)을 충족시키도록 명시적으로 강제하는 C#과 Java와 같은 언어에서 인터페이스를 사용하는 가장 일반적인 방법은 TypeScript에서도 가능합니다.

```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    constructor(h: number, m: number) { }
}
```

아래 예제의 `setTime` 처럼 클래스에 구현된 메서드를 인터페이스 안에서도 기술할 수 있습니다.

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

인터페이스는 클래스의 public과 private 모두보다는, public을 기술합니다.
그래서 클래스 인스턴스의 private에서는 특정 타입이 있는지 검사할 수 없습니다.

## 클래스의 스태틱과 인스턴스의 차이점 (Difference between the static and instance sides of classes)

클래스와 인터페이스를 다룰 때, 클래스는 *두 가지* 타입을 가진다는 것을 기억하는 게 좋습니다: 스태틱 타입과 인스턴스 타입입니다.
생성 시그니처 (construct signature)로 인터페이스를 생성하고, 클래스를 생성하려고 한다면, 인터페이스를 implements 할 때, 에러가 발생하는 것을 확인할 수 있을 겁니다:

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

클래스가 인터페이스를 implements 할 때, 클래스의 인스턴스만 검사하기 때문입니다.
생성자가 스태틱이기 때문에, 이 검사에 포함되지 않습니다.

대신에, 클래스의 스태틱 부분을 직접적으로 다룰 필요가 있습니다.
이번 예제에서, `ClockConstructor`는 생성자를 정의하고, `ClockInterface`는 인스턴스 메서드를 정의하는 두 인터페이스를 정의합니다.
그리고, 편의를 위해, 전달된 타입의 인스턴스를 생성하는 `createClock` 생성자 함수를 정의합니다:

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

`createClock`의 첫 번째 매개변수는 `createClock(AnalogClock, 7, 32)`안에 `ClockConstructor` 타입이므로, `AnalogClock`이 올바른 생성자 시그니처를 갖고 있는지 검사합니다.

또 다른 쉬운 방법은 클래스 표현을 사용하는 것입니다.

```ts
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
      console.log("beep beep");
  }
}
```

# 인터페이스 확장하기 (Extending Interfaces)

클래스처럼, 인터페이스들도 확장(extend)이 가능합니다.
이는 한 인터페이스의 멤버를 다른 인터페이스에 복사하는 것을 가능하게 해주는데, 인터페이스를 재사용성 높은 컴포넌트로 쪼갤 때, 유연함을 제공해줍니다.

```ts
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
```

인터페이스는 여러 인터페이스를 확장할 수 있어, 모든 인터페이스의 조합을 만들어낼 수 있습니다.

```ts
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

# 하이브리드 타입 (Hybrid Types)

일찍이 언급했듯이, 인터페이스는 실제 JavaScript 세계에 존재하는 다양한 타입들을 기술할 수 있습니다.
JavaScript의 동적이고 유연한 특성 때문에, 위에서 설명했던 몇몇 타입의 조합으로 동작하는 객체를 가끔 마주할 수 있습니다.

그러한 예제 중 하나는 추가적인 프로퍼티와 함께, 함수와 객체 역할 모두 수행하는 객체입니다:

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = (function (start: number) { }) as Counter;
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

써드파티 (3rd-party) JavaScript와 상호작용할 때, 타입의 형태를 완전히 기술하기 위해 위와 같은 패턴을 사용해야할 수도 있습니다.

# 클래스를 확장한 인터페이스 (Interfaces Extending Classes)

인터페이스 타입이 클래스 타입을 확장하면, 클래스의 멤버는 상속받지만 구현은 상속받지 않습니다.
이것은 인터페이스가 구현을 제공하지 않고, 클래스의 멤버 모두를 선언한 것과 마찬가지입니다.
인터페이스는 심지어 기초 클래스의 private과 protected 멤버도 상속받습니다.
이것은 인터페이스가 private 혹은 protected 멤버를 포함한 클래스를 확장할 수 있다는 뜻이고, 인터페이스 타입은 그 클래스나 하위클래스에 의해서만 구현될 수 있습니다.

이는 거대한 상속계층을 가지고 있을 때 유용하지만, 특정 프로퍼티를 가진 하위클래스에서만 코드가 동작하도록 지정하는데도 유용합니다.
하위클래스는 기초클래스에서 상속하는 것 외에는 관련이 있을 필요가 없습니다.
예를 들어:

```ts
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    private state: any;
    select() { }
}

class Location {

}
```

위 예제에서, `SelectableControl`은 private `state` 프로퍼티를 포함하여, `Control`의 모든 멤버를 가지고 있습니다.
`state`는 private 멤버이기 때문에, `SelectableControl`를 구현하는 것은 `Control`의 자식에게만 가능합니다.
`Control`의 자식만 같은 선언에서 유래된 `state` private 멤버를 가질수 있기 때문이고, private 멤버들이 호환되기 위해 필요합니다.

`Control` 클래스 안에서 `SelectableControl`의 인스턴스를 통해서 `state` private 멤버에 접근할 수 있습니다.
`SelectableControl`은 `select` 메서드를 가진 `Control`과 같은 역할을 합니다.
`Button`과 `TextBox` 클래스들은 `SelectableControl`의 하위타입이지만 (`Control`을 상속받고, `select` 메서드를 가지기 때문에), `Image`와 `Location` 클래스는 아닙니다.
