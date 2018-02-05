# 소개 \(Introduction\)

TypeScript의 핵심 원리 중 하나는 값이 가지는 _형태_에 초점을 맞추는 타입-체킹을 한다는 것입니다.  
이것은 때때로 "덕 타이핑\(duck typing\)" 또는 "구조적 하위 유형화\(structural subtyping\)"라고도 합니다.  
TypeScript에서는 인터페이스가 이러한 타입의 이름을 지정하는 역할을 하며 코드 내에서 계약을 정의하고 프로젝트 외부에서 코드를 사용하는 계약을 정의하는 강력한 방법입니다.

# 첫번째 인터페이스 \(Our First Interface\)

인터페이스의 작동 방식을 확인하는 가장 쉬운 방법은 간단한 예를 들어 시작하는 것입니다:

```ts
function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

타입-체커는 `printLabel`에 대한 호출을 확인합니다.  
`PrintLabel` 함수에는 객체를 전달하는 데 필요한 단일 매개변수가 있으며 이는 문자열 타입의 `label` 프로퍼티를 가집니다.  
실제로 객체는 이보다 더 많은 프로퍼티를 가지고 있지만 컴파일러는 필요한 속성이 `최소한` 있고 필요한 타입과 일치하는지만 검사합니다.  
TypeScript가 그렇게 관대하지 않은 경우도 있습니다. 이에 대해 좀 더 자세히 다룰 것입니다.

이번에도 인터페이스를 사용하여 문자열 타입인 `label` 프로퍼티를 가져야 한다는 요구 사항을 설명하는 동일한 예제를 다시 작성할 수 있습니다:

```ts
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

인터페이스 `LabelledValue`은 이전 예제의 요구 사항을 설명하는 데 사용할 수 있는 이름입니다.  
여전히 `label`이라는 문자열 타입의 단일 프로퍼티가 있습니다.  
`printLabel`에 전달하는 객체가 다른 언어처럼 이 인터페이스를 구현한다고 명시적으로 말할 필요가 없었습니다.  
여기서는 중요한 형태일 뿐입니다. 함수로 전달되는 객체가 나열된 요구 사항을 충족하는 경우 허용됩니다.

타입-체커에서는 이러한 프로퍼티가 순서대로 제공될 것을 요구하지 않으며 다만 인터페이스에 필요한 속성이 있고 필요한 타입만 필요하다는 점을 지적하는 것이 중요합니다.

# 선택적 프로퍼티 \(Optional Properties\)

인터페이스의 모든 프로퍼티가 필수로 필요할 수는 없습니다.  
어떤 것들은 특정한 조건 하에 존재하거나 아예 존재하지 않을 수도 있습니다.  
이러한 선택적 프로퍼티는 프로퍼티 중에서 일부만 채워진 객체를 함수에 전달하는 "옵션 가방\(option bags\)"과 같은 패턴을 생성할 때 많이 사용됩니다.

다음은 이 패턴의 예입니다:

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

선택적 프로퍼티를 가진 인터페이스는 다른 인터페이스와 유사하게 작성되며 선언된 프로퍼티 이름 끝에 `?`로 표시됩니다.

선택적 프로퍼티의 장점은 사용 가능한 프로퍼티를 설명하는 동시에 인터페이스에 포함되지 않은 프로퍼티의 사용을 방지할 수 있다는 것입니다.

예를 들어 `createSquare`에서 `color` 프로퍼티의 이름을 잘못 입력하면 다음과 같은 오류 메시지가 표시됩니다:

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        // 오류 : 'SquareConfig' 타입에 'clor'프로퍼티가 존재하지 않습니다. 
        newSquare.color = config.clor;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

# 읽기 전용 프로퍼티 \(Readonly properties\)

일부 프로퍼티는 객체를 처음 생성할 때만 수정할 수 있어야 합니다. 프로퍼티 이름 앞에 `readonly`을 붙여 넣어 지정할 수 있습니다:

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

객체 리터럴을 할당하여 `Point`를 구성 할 수 있습니다. 할당 후 `x`와 `y`는 바꿀 수 없습니다.

```ts
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // 오류!
```

TypeScript에는 모든 변형 메서드가 제거된 `Array<T>`와 동일한 `ReadonlyArray<T>`타입이 있으므로 생성 후 배열을 변경하지 말아야 합니다.

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // 오류!
ro.push(5); // 오류!
ro.length = 100; // 오류!
a = ro; // 오류!
```

코드의 마지막 줄에서 전체 `ReadonlyArray`를 일반적인 배열로 다시 할당하는 것조차도 불법임을 알 수 있습니다.  
그럼에도 불구하고 타입 표명\(assertion\)을 통해 오버라이드 할 수 있습니다.

```ts
a = ro as number[];
```

## `readonly` vs `const`

readonly을 사용할지 아니면 const 사용할지 기억할 수 있는 가장 쉬운 방법은 변수에서 사용할지 또는 프로퍼티에서 사용할지를 묻는 것입니다.  
변수는 `const`를 사용하는 반면 프로퍼티는 `readonly`를 사용합니다.

# 프로퍼티 초과 검사 \(Excess Property Checks\)

인터페이스를 사용하는 첫 번째 예에서 TypeScript를 사용하면 `{ size: number; label: string; }`을 `{ label: string; }`으로만 예상하는 항목으로 전달할 수 있습니다.  
또한 선택적 프로퍼티에 대해서 배웠고 그것이 소위 말하는 "옵션 가방\(option bags\)"을 설명할 때 어떻게 유용한지도 배웠습니다.

그러나 두 가지를 결합하는 것은 JavaScript에서와 하고 있는 것과 같은 방식으로 자신의 무덤을 파는 것입니다.  
예를 들어 `createSquare`를 사용한 마지막 예제를 봅시다:

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

`createSquare`의 인수는 `color`가 아닌 `colour` 입니다. 보통의 JavaScript에서는 이러한 종류의 작업은 조용히 실패합니다.

`width` 프로퍼티가 호환되고 `color` 프로퍼티가 없으며 특별하게 `color` 프로퍼티가 대수롭지 않기 때문에 이 프로그램이 올바른 타입임을 주장할 수 있습니다.

그러나 TypeScript는 이 코드에 버그가 있을 수 있음을 나타냅니다.  
객체 리터럴은 다른 변수에 할당하거나 인수로 전달할 때 특별한 처리를 받아 _프로퍼티 초과 검사\(Excess Property Checks\)_ 를 거칩니다.  
객체 리터럴에 "대상 타입"에 없는 속성이 있으면 오류가 발생합니다.

```ts
// 오류 : 'colour'는 'SquareConfig' 타입에서 필요하지 않습니다.
let mySquare = createSquare({ colour: "red", width: 100 });
```

이런 점검을 하는 것은 실제로 정말 간단합니다.  
가장 쉬운 방법은 타입 표명\(type assertion\)을 사용하는 것입니다:

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

하지만 객체에 특별한 방법으로 사용되는 추가 프로퍼티가 있는 것이 확실한 경우 문자열 인덱스 서명\(string index signature\)을 추가하는 것이 더 좋습니다.

`SquareConfig`가 위의 타입이 포함되는 `color` 및 `width` 프로퍼티가 가질 수 _있지만 또_ 다른 속성도 있는 경우에는 다음과 같이 정의할 수 있습니다.

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

이후에 인덱스 서명\(index signatures\)에 대해 이야기하겠지만 `SquareConfig`은 여러 프로퍼티들을 가질 수 있으며 `color` 이나 `width`가 아닌 다른 프로퍼티들의 타입은 문제 되지 않습니다.

이러한 검사를 하는 마지막 방법 중 하나는 객체를 다른 변수에 할당하는 것입니다: `squareOptions`은 너무 프로퍼티 초과 검사를 거치지 않기 때문에 컴파일러가 오류를 제공하지 않습니다:

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

위와 같은 간단한 코드의 경우에는 이러한 검사를 "회피하는" 시도를 하지 말아야 합니다.  
메서드와 상태를 유지하는 더 복잡한 객체 리터럴의 경우 이러한 기법을 유지하고 싶은 마음이겠지만 대부분의 초과 프로퍼티 오류는 실제로 버그입니다.  
즉 옵션 가방\(option bags\)과 같은 물건에 대해 초과 프로퍼티 검사 문제가 발생하는 경우 타입 선언 중 일부를 수정해야 할 수도 있습니다.  
이 경우 `createSquare`에 `color` or `colour` 프로퍼티를 모두 포함한 객체를 전달하는 것이 괜찮은 경우 `squareConfig`의 정의를 수정해야 합니다.

# 함수 타입 \(Function Types\)

인터페이스는 JavaScript 객체가 취할 수 있는 다양한 형태을 형성할 수 있습니다.  
프로퍼티를 가진 객체를 설명하는 것 외에도 인터페이스는 함수 타입을 형성할 수도 있습니다.

인터페이스가 포함된 함수의 타입을 형성하기 위해 인터페이스에 호출 서명\(call signature\)을 제공합니다.  
이것은 매개 변수 목록과 리턴 타입만 주어진 함수 선언과 같습니다. 매개 변수 목록의 각 매개 변수에는 이름과 타입이 모두 필요합니다.

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

일단 정의되면 다른 인터페이스처럼 이 함수 타입의 인터페이스를 사용할 수 있습니다.  
여기서는 함수 타입의 변수를 생성하고 동일한 타입의 함수 값을 할당하는 방법을 보여줍니다.

```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```

함수 타입의 타입을 점검할 때 매개 변수의 이름이 일치할 필요는 없습니다. 예를 들어 다음과 같은 예를 작성할 수 있습니다:

```ts
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

함수 매개 변수는 하나씩 점검되며 각 해당 파라미터 위치의 타입을 서로 비교하며 점검합니다.  
타입을 지정하지 않으려는 경우 함수 값이 `SearchFunc` 타입의 변수에 직접 지정되므로 TypeScript의 컨텍스트 타입\(contextual typing\)에 따라 인수 타입을 추론할 수 있습니다.  
또한 여기서 함수 표현식의 리턴 타입은 리턴되는 값에 의해서도 암시적으로 나타납니다\(여기서는 `false`와 `true`\)  
함수 표현식이 숫자나 문자열을 리턴하는 경우 타입-체커가 리턴 타입이 `SearchFunc` 인터페이스에 설명된 리턴 타입과 일치하지 않는다는 경고했을 것입니다

```ts
let mySearch: SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

# 인덱싱 가능 타입\(Indexable Types\)

함수 타입을 설명하기 위해 인터페이스를 사용하는 방법과 마찬가지로 `a[10]` 또는 `ageMap["daniel"]`처럼 "인덱스를" 생성할 수 있는 타입을 만들 수도 있습니다.  
인덱싱 가능 타입에는 객체로 인덱싱 하는 데 사용할 수 있는 타입과 인덱싱 할 때 해당 리턴 타입을 설명하는 _인덱스 서명\(index signature\)_ 이 있습니다.  
예를 들어 보겠습니다.

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

위에서 우리는 인덱스 서명\(index signature\)을 가진 `String Array` 인터페이스를 가지고 있습니다.  
이 인덱스 서명은 `StringArray`이 `number`로 인덱싱 될 때 `string`을 리턴한다는 것을 나타냅니다.

지원되는 인덱스 서명에는 문자열과 숫자의 두 가지 타입이 있습니다.  
두 가지 타입의 인덱서\(indexer\)를 모두 지원할 수 있지만 숫자\(numeric\) 인덱서에서 리턴되는 타입은 문자열\(string\) 인덱서에서 리턴된 타입의 하위 타입이어야 합니다.  
왜냐하면 `number`로 인덱싱을 생성하는 시점에 JavaScript가 객체로 인덱싱하기 전에 `string`으로 변환하기 때문입니다.  
즉 `100` \(`number`\)로 인덱싱하는 것은 `"100"` \(`string`\)으로 인덱싱하는 것과 동일하므로 두 가지 모두 일관성이 있어야 합니다.

```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 오류: numeric과 string으로 인덱싱하면 완전히 다른 타입의 Animal을 얻을 수 있습니다!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

문자열 인덱스 서명\(index signatures\)이 "사전\(dictionary\)" 패턴을 만드는 강력한 방법이지만 모든 프로퍼티가 반환 타입과 일치하도록 강요합니다.  
문자열 인덱스의 `obj.property`가 `obj["property"]`으로도 사용할 수 있다고 선언하기 때문입니다.  
다음 예에서는 `name`의 타입이 문자열 인덱스의 타입과 일치하지 않으며 타입-체커에서 오류를 표시합니다

```ts
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 좋아요, length는 number입니다.
    name: string;      // 오류, 'name'의 타입이 인덱서의 하위 타입이 아닙니다.
}
```

마지막으로 인덱스에 할당되지 않도록 인덱스 서명\(index signatures\)을 읽기 전용\(readonly\)으로 만들 수 있습니다:

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // 오류!
```

인덱스 서명이 읽기 전용이므로 `myArray[2]`를 설정할 수 없습니다.

# 클래스 타입 \(Class Types\)

## 인터페이스 구현 \(Implementing an interface\)

C\# 및 Java와 같은 언어로 인터페이스를 사용하는 가장 일반적인 방법 중 하나로 클래스가 특정 계약을 충족하도록 명시적인 강제가 TypeScript에서도 가능하다는 것입니다.

```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

또한 아래의 예제에서 `setTime`과 마찬가지로 클래스에 구현된 인터페이스의 메서드를 만들 수도 있습니다.

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

인터페이스는 public 측면과 private 측면이 아닌 public 측면의 class를 만듭니다.  
클래스를 사용하여 클래스 인스턴스의 private 측에 특정 타입이 있는지 점검하는 것은 금지되어 있습니다.

## 클래스의 스태틱과 인스턴스의 차이점\(Difference between the static and instance sides of classes\)

클래스와 인터페이스로 작업할 때 클래스에 _두 가지_ 타입이 있음을 명심하세요: 스태틱 측면의 타입과 인스턴스 측면의 타입  
construct signature으로 인터페이스를 만들고 이 인터페이스를 구현하는 클래스를 생성하려고 하면 오류가 발생할 수 있습니다:

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

왜냐하면 클래스가 인터페이스를 구현할 때 클래스의 인스턴스 측면만 검사되기 때문입니다.  
생성자는 정적인 측면이기 때문에 이 점검에 포함되지 않습니다.

대신 클래스의 정적인 측면에서 직접 작업해야 합니다.  
이 예제에서는 생성자를 위한 `ClockConstructor`와 인스턴스 메서드를 위한 `ClockInterface`라는 두 개의 인터페이스를 정의합니다.  
편의상 전달된 타입의 인스턴스를 생성하는 `createClock` 생성자 함수를 정의합니다.

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
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

`createClock`의 첫 번째 매개 변수는 `createClock(AnalogClock, 7, 32)`에 `ClockConstructor` 타입이므로 `AnalogClock`이 올바른 생성자 서명\(constructor signature\)을 가지고 있는지 확인합니다.

# 인터페이스 확장 \(Extending Interfaces\)

클래스처럼 인터페이스도 서로를 확장할 수 있습니다.  
이렇게 하면 한 인터페이스의 멤버를 다른 인터페이스로 복사할 수 있으므로 인터페이스를 재사용 가능한 컴포넌트로 분리하는 방법을 더 유연하게 할 수 있습니다.

```ts
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

여러 인터페이스를 확장하여 모든 인터페이스를 결합하여 만들 수 있습니다.

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

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

# 하이브리드 타입 \(Hybrid Types\)

이전에 언급했듯이 인터페이스는 실제 JavaScript에서 제공되는 풍부한 타입을 만들 수 있습니다.  
JavaScript의 동적이고 유연한 특성으로 인해 위에 설명된 몇 가지 타입의 조합으로 작동하는 객체를 종종 볼 수 있습니다.

이러한 예로는 다음과 같이 추가 프로퍼티로 함수와 객체 역할을 모두 하는 객체가 있습니다:

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

서드파티 JavaScript와 상호 작용할 때 타입의 형태를 완전히 형성하려면 위와 같은 패턴을 사용해야 할 수 있습니다.

# 인터페이스 확장 클래스 \(Interfaces Extending Classes\)

인터페이스 타입이 클래스 타입을 확장하면 해당 클래스의 멤버들을 상속하지만 구현을 상속하지는 않습니다.  
이는 마치 인터페이스가 구현을 제공하지 않고 클래스의 모든 멤버를 선언한 것과 같습니다.  
인터페이스는 기본 클래스의 private 및 protected 멤버조차도 상속합니다.  
즉 private 또는 protected 멤버가 있는 클래스를 확장하는 인터페이스를 생성하면 해당 인터페이스 타입은 해당 클래스 또는 해당 클래스의 서브 클래스에서만 구현할 수 있습니다.

이는 상속 계층이 크지만 특정 프로퍼티를 가진 서브 클래스에서만 코드가 작동하도록 지정하려는 경우에 유용합니다.  
서브 클래스는 기본 클래스에서 상속받는 것 외에는 관련이 없습니다.

예를 들면:

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

// 오류: 'Image' 타입의 'state' 프로퍼티가 없습니다.
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

위의 예제에서 `SelectableControl`에는 Private `state` 프로퍼티를 포함한 `Control`의 모든 멤버가 포함되어 있습니다.  
`state`는 private 멤버이기 때문에 `Control`의 자식만 `SelectableControl`을 구현할 수 있습니다.  
왜냐하면 `Control`의 자식들만이 같은 선언에서 시작된 `state` private 멤버를 가지기 때문입니다.  
이것은 private 멤버들이 호환 가능해야 합니다.

`Control` 클래스 내에서 `SelectableControl`의 인스턴스를 통해 `state` private 멤버에 접근할 수 있습니다.  
실제로 `SelectableControl`은 알려진 대로 `select` 메서드를 가진 `Control`과 같은 역할을 합니다.  
`Button`과 `TextBox` 클래스는 `SelectableControl`의 하위 타입입니다 \(왜냐하면 둘 다 `Control`을 상속받으며 `select` 메서드를 가지기 때문입니다\).  
그러나 `Image` 클래스와 `Location` 클래스는 그렇지 않습니다.

