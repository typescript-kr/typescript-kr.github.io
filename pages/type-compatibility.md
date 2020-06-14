# 소개 (Introduction)

TypeScript의 타입 호환성은 구조적 서브 타이핑(subtyping)을 기반으로 합니다.
구조적 타이핑이란 오직 멤버만으로 타입을 관계시키는 방식입니다.
명목적 타이핑(nominal typing) 과는 대조적입니다.
다음 코드를 살펴보겠습니다:

```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// 성공, 구조적 타이핑이기 때문입니다.
p = new Person();
```

C#이나 Java와 같은 명목적-타입 언어에서는 `Person` 클래스는 `Named` 인터페이스를 명시적인 구현체로 기술하지 않았기 때문에 해당 코드는 오류를 발생시킵니다.

TypeScript의 구조적 타입 시스템은 JavaScript 코드의 일반적인 작성 방식에 따라서 설계되었습니다.
JavaScript는 함수 표현식이나 객체 리터럴 같은 익명 객체를 광범위하게 사용하기 때문에 JavaScript에서 발견되는 관계의 타입을 명목적 타입 시스템보다는 구조적 타입 시스템을 이용하여 표현하는 것이 훨씬 더 자연스럽습니다.

## 건전성에 대한 참고사항 (A Note on Soundness)

TypeScript의 타입 시스템은 컴파일 시간에 확인할 수 없는 특정 작업을 안전하게 수행할 수 있습니다. 타입 시스템이 이런 특성을 갖고 있을 때, "건전"하지 않다고 말합니다. TypeScript에서 건전하지 못한 곳을 허용하는 부분을 신중하게 고려했으며, 이 문서 전체에서 이러한 상황이 발생하는 곳과 유발하는 시나리오에 대해 설명합니다.

# 시작하기 (Starting out)

TypeScript의 구조적 타입 시스템의 기본 규칙은 `y`가 최소한 `x`와 동일한 멤버를 가지고 있다면 `x`와 `y`는 호환된다는 것입니다. 예를 들어:

```ts
interface Named {
    name: string;
}

let x: Named;
// y의 추론된 타입은 { name: string; location: string; } 입니다.
let y = { name: "Alice", location: "Seattle" };
x = y;
```

`y`를 `x`에 할당할 수 있는지 검사하기 위해, 컴파일러는 `x`의 각 프로퍼티를 검사하여 `y`에서 상응하는 호환 가능한 프로퍼티를 찾습니다.
이 경우, `y`는 `name`이라는 문자열 멤버를 가지고 있어야 합니다. 그러므로 할당이 허용됩니다.

함수 호출 인수를 검사할 때 동일한 할당 규칙이 적용됩니다:

```ts
function greet(n: Named) {
    console.log("Hello, " + n.name);
}
greet(y); // 성공
```

`y`는 `location` 프로퍼티를 추가적으로 가지고 있지만 오류를 발생시키지 않는 점에 유의합니다.
호환성을 검사할 때는 오직 대상 타입의 멤버(이 경우는 `Named`)만 고려됩니다.

이 비교하는 과정은 재귀적으로 각 멤버와 하위-멤버의 타입을 탐색하면서 진행됩니다.

# 두 함수 비교 (Comparing two functions)

원시 타입과 객체 타입을 비교하는 것은 비교적 간단하지만, 어떤 유형의 함수들이 호환될 수 있는지에 대한 질문은 조금 더 복잡합니다.
먼저 매개변수 목록에서만 다른 두 함수의 기본 예제를 살펴보겠습니다:

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // 성공
x = y; // 오류
```

`x`를 `y`에 할당할 수 있는지 검사하기 위해, 먼저 매개변수 목록을 살펴봅니다.
`x`의 각 매개변수는 호환 가능한 타입을 가진 `y`의 해당 매개변수를 가져야 합니다.
매개변수의 이름은 고려하지 않고 타입만 검사한다는 점에 유의하세요.
이 경우에는 `x`의 모든 매개변수는 `y`에 상응하는 호환 가능한 매개변수를 가지므로 할당이 허용됩니다.

두 번째 할당은 `y`는 `x`에 없는 두 번째 필수적인 매개변수를 가지고 있기 때문에 할당이 허용되지 않아 오류가 발생합니다.

`y = x`의 예제에서처럼 매개변수를 '버리는' 것이 허용되는 이유가 궁금할 수 있습니다.
이러한 할당이 허용되는 이유는 함수의 추가 매개변수를 무시하는 것이 실제로 JavaScript에선 매우 일반적이기 때문입니다.
예를 들어, `Array#forEach`는 콜백 함수에게 3 가지 매개변수인 배열 요소, 그 요소의 인덱스 그리고 이것을 포함하는 배열을 제공합니다.
그럼에도 불구하고 첫 번째 매개변수만 사용하는 콜백을 제공하는 것은 매우 유용합니다:

```ts
let items = [1, 2, 3];

// 추가 매개변수를 강제로 사용하지 마세요.
items.forEach((item, index, array) => console.log(item));

// 괜찮습니다!
items.forEach(item => console.log(item));
```

반환 타입이 다른 두 함수를 사용하여 반환 타입이 어떻게 처리되는지 살펴보겠습니다:

```ts
let x = () => ({name: "Alice"});
let y = () => ({name: "Alice", location: "Seattle"});

x = y; // 성공
y = x; // 오류, x()는 location 프로퍼티가 없습니다.
```

타입 시스템은 원본 함수의 반환 타입이 대상 타입의 반환 타입의 하위 타입이 되도록 합니다.

## 함수 매개변수의 Bivariance (Function Parameter Bivariance)

함수 매개변수의 타입을 비교할 때, 원본 매개변수가 대상 매개변수에 할당이 가능하거나 이 반대여도 할당은 성공합니다.
이것은 호출한 측에서 더 특수한 타입을 취하여 함수를 제공할 수도 있지만, 덜 특수화된 타입의 함수를 호출할 수 있기 때문에 바람직하지 않습니다.
실제로 이런 종류의 오류는 드물지만 이는 많은 일반적인 JavaScript 패턴들을 사용할 수 있게 합니다. 간단한 예제:

```ts
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// 바람직하진 않지만 유용하고 일반적임
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// 건전성 측면에서 바람직하지 않은 대안
listenEvent(EventType.Mouse, (e: Event) => console.log((e as MouseEvent).x + "," + (e as MouseEvent).y));
listenEvent(EventType.Mouse, ((e: MouseEvent) => console.log(e.x + "," + e.y)) as (e: Event) => void);

// 여전히 허용되지 않음 (명확한 오류). 완전히 호환되지 않는 타입에 적용되는 타입 안전성(Type safety)
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

컴파일러 플래그인 `strictFunctionTypes`을 통해 이러한 상황이 발생하면 TypeScript에서 오류가 발생하도록 할 수 있습니다.

## 선택적 매개변수와 나머지 매개변수 (Optional Parameters and Rest Parameters)

함수의 호환성을 비교할 때 선택적 매개변수와 필수 매개변수를 서로 바꿔 사용할 수 있습니다.
원본 타입의 추가 선택적 매개변수는 오류가 아니고, 원본 타입의 해당 매개변수가 없는 대상 타입의 선택적 매개변수도 오류가 아닙니다.

함수가 나머지 매개변수를 가지고 있다면, 마치 무한한 일련의 선택적 매개변수처럼 처리됩니다.

이것은 타입 시스템 관점에서는 바람직하지 않지만, 런타임 관점에서는 해당 위치에 `undefined`를 전달하는 것은 대부분 함수에 해당하므로 선택적 매개변수에 대한 아이디어는 제대로 적용되지 않습니다.

다음을 유발하는 예제는 콜백을 받아서 (프로그래머에게는) 예측이 가능하지만 (타입 시스템이) 알 수 없는 개수의 인수를 호출하는 함수의 일반적인 패턴입니다:

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... 'args'를 사용하여 콜백을 호출함 ... */
}

// 바람직하지 않음 - invokeLater는 "아마도" 여러개의 인수를 제공합니다
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// 혼란스럽고 (x와 y가 실제로 필요함) 발견할 수 없음
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

## 오버로드 함수 (Functions with overloads)

함수에 오버로드가 있는 경우 원본 타입의 각 오버로드는 대상 타입의 호환 가능한 시그니처와 일치해야 합니다.
이를 통해 원본 함수와 모든 동일한 상황에서 대상 함수를 호출할 수 있습니다.

# 열거형 (Enums)

열거형은 숫자와 호환되며 숫자는 열거형과 호환됩니다. 다른 열거형 타입의 열거형 값은 호환되지 않는 것으로 간주됩니다. 예를 들면,

```ts
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  // 오류
```

# 클래스 (Classes)

클래스는 객체 리터럴 타입과 인터페이스와 한 가지 예외를 제외하곤 유사하게 동작합니다: 클래스는 정적 타입과 인스턴스 타입이 있습니다.
클래스 타입의 두 개의 객체를 비교할 때, 오직 인스턴스의 멤버만 비교됩니다.
정적인 멤버와 생성자는 호환성에 영향을 주지 않습니다.

```ts
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  // 성공
s = a;  // 성공
```

## 클래스의 private 멤버와 protected 멤버 (Private and protected members in classes)

클래스의 private과 protected 멤버는 호환성에 영향을 줍니다.
클래스 인스턴스의 호환성을 검사할 때 대상 타입에 private 멤버가 있다면, 원본 타입 또한 동일 클래스에서 비롯된 private 멤버가 있어야 합니다.
마찬가지로 protected 멤버가 있는 인스턴스도 똑같이 적용됩니다.
이를 통해 클래스는 상위 클래스와 호환 가능하지만 같은 형태를 가진 다른 상속 계층 구조의 클래스와는 호환이 되지 *않습니다*.

# 제네릭 (Generics)

TypeScript는 구조적 타입 시스템이기 때문에, 타입 매개변수는 멤버의 타입의 일부로 사용할 때 결과 타입에만 영향을 줍니다. 에를 들면,

```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // 성공, y는 x의 구조와 대응하기 때문
```

위에서 `x`와 `y`는 구조가 타입 인수를 서로 다르게 사용하지 않기 때문에 호환됩니다.
이 예제에 `Empty<T>`를 멤버에 추가하여 어떻게 동작하는 살펴봅시다:

```ts
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // 오류, x와 y 는 호환되지 않음
```

이런 식으로, 타입 인수가 지정된 제네릭 타입은 비-제네릭 타입처럼 동작합니다.

타입 인수가 지정되지 않은 제네릭 타입에 관해선, 모든 지정되지 않은 타입 인수를 대신해서 `any`로 지정함으로써 호환성 검사를 합니다.
그 결과 생성된 타입은 비-제네릭 경우와 마찬가지로 호환성을 검사합니다.

예를 들어,

```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // 성공, (x: any) => any는  (y: any) => any와 대응하기 때문
```

# 고급 주제 (Advanced Topics)

## 하위 타입 vs 할당 (Subtype vs Assignment)

지금까지 언어 사양에 정의된 용어가 아닌 "호환" 을 사용했습니다.
TypeScript에서는 두 가지 종류의 호환성이 있습니다: 하위 타입과 할당.
할당은 하위 타입의 호환성을 확장하여 `any`에서의 할당과 `enum`과 해당 숫자 값의 할당을 허용하는 규칙을 가진다는 점만 다릅니다.

언어에서 다른 위치는 상황에 따라 두 가지 호환 메커니즘 중 하나를 사용합니다.
실용적인 목적을 위해 타입 호환성은 심지어 `implements`와 `extends`의 경우에도 할당 호환성에 의해 결정됩니다.

자세한 내용은 [TypeScript 사양](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md)을 참고하세요.
