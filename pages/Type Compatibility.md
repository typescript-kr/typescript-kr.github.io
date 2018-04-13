# 소개 (Introduction)

TypeScript의 타입 호환성은 구조적 하위 타입을 기반으로합니다.  
구조적 타이핑은 멤버에 따라 타입을 관계시키는 방법입니다.  
이것은 이름뿐인 타이핑과 대조적입니다.

다음 코드를 살펴보세요 :

```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// 구조적 타이핑이니까 좋아요 
p = new Person();
```

C# 또는 Java 같은 명사적인 언어에서는 `person` 클래스가 자신을 `Named` 인터페이스의 구현체로 명시적으로 기술하지 않기 때문에 동일한 코드가 오류가 될 수 있습니다.

TypeScript의 구조적인 타입 시스템은 일반적으로 JavaScript 코드가 작성된 방식에 따라 설계되었습니다.

JavaScript는 함수 표현식이나 객체 리터럴과 같은 익명의 객체를 광범위하게 사용하기 때문에 이름뿐인 구조적 타입 시스템 대신 JavaScript 라이브러리에서 발견되는 관계의 타입을 표현하는 것이 훨씬 자연스럽습니다.

## 안전성에 대한 노트 (A Note on Soundness)

TypeScript의 타입 시스템을 사용하면 완료시 알 수 없는 특정 작업을 안전하게 수행할 수 있습니다.  
타입 시스템에 이 프로퍼티가 있으면 그것은 "타당"한 것이 아니라고 합니다.

TypeScript에서 부적절한 동작을 허용하는 곳을 신중하게 고려했으며 이 문서 전체에서 이러한 상황이 발생하는 곳과 그 뒤에있는 숨겨진 동기 부여 시나리오에 대해 설명합니다.

# 시작하기 (Starting out)

TypeScript의 구조 타입 시스템에 대한 기본적인 규칙은 `y`가 적어도`x`와 같은 멤버를 가지고 있다면 `x`는 `y`와 호환된다는 것입니다.

예를 들어:

```ts
interface Named {
    name: string;
}

let x: Named;
// y의 추론된 타입은 { name: string; location: string; } 입니다
let y = { name: "Alice", location: "Seattle" };
x = y;
```

`y`가 `x`에 할당될 수 있는지를 검사하기 위해 컴파일러는 `x`의 각 프로퍼티를 검사하여 `y`에서 상응하는 호환되는 프로퍼티를 찾습니다.

이 경우 `y`는 문자열인 `name` 멤버를 가져야합니다. 그렇기 때문에 할당이 허용됩니다.

함수 호출 인수를 검사할 때 다음과 같은 할당 규칙이 사용됩니다 :

```ts
function greet(n: Named) {
    alert("Hello, " + n.name);
}
greet(y); // 좋아요
```

`y`는 별도의 `location` 프로퍼티를 가지고 있지만  이로 인해 오류가 생기는 것은 아니라는 점에 유의한다.  

호환성을 검사할 때 대상의 타입 (이 경우 `Named`) 멤버만 고려됩니다.

이 비교 프로세스는 재귀적으로 진행되어 각 구성원 및 하위 멤버의 유형을 탐색합니다.

# 두 함수 비교 (Comparing two functions)

원시적인 타입과 객체 타입을 비교하는 것은 비교적 간단하지만 호환성이 있는 것으로 간주되어야 하는 함수의 종류에 대한 질문은 좀 더 복잡합니다.

먼저 매개변수 목록에서만 다른 두 함수의 기본 예제를 살펴보겠습니다 :

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // 좋아요
x = y; // 오류
```

`x`가 `y`에 할당될 수 있는지 확인하기 위해 우선 매개 변수 목록을 살펴봅니다.
`x`의 각 매개 변수는 호환 가능한 타입을 가진 `y`에서 상응하는 매개 변수를 가져야합니다.

매개 변수 이름은 고려되지 않으며 타입만 고려됩니다.  
이 경우`x`의 모든 매개 변수는`y`에 상응하는 호환 매개 변수를 가지므로 할당이 허용됩니다.

`y`에는 `x`가 필요로 하지 않는 두 번째 매개 변수가 있어 할당이 허용되지 않으므로 오류입니다.

`y = x` 예시와 같은 '버려지는' 매개변수를 허용하는지 이유가 의심스러울겁니다.  
이 할당이 허용되는 이유는 JavaScript에서 추가적인 함수 매개 변수를 무시하는 것이 상당히 흔한 일이기 때문입니다.  

예를 들어 `Array#forEach`는 콜백 함수에 세 개의 매개 변수를 제공합니다 : 배열 요소와 해당 인덱스 및 포함된 배열
그럼에도 불구하고 첫 번째 매개 변수 만 사용하는 콜백을 제공하는 것은 매우 유용합니다 :

```ts
let items = [1, 2, 3];

// 이러한 추가 매개 변수를 강제로 사용하지 마세요
items.forEach((item, index, array) => console.log(item));

// 괜찮을 거에요!
items.forEach(item => console.log(item));
```

이제 타입 유형에 따라 다른 두 함수를 사용하여 반환 타입을 처리하는 방법을 살펴보겠습니다:
```ts
let x = () => ({name: "Alice"});
let y = () => ({name: "Alice", location: "Seattle"});

x = y; // 좋아요
y = x; // x에 location 프로퍼티가 없기 때문에 오류
```

타입 시스템은 소스 함수의 반환 타입이 대상 타입의 반환 타입의 서브 타입이되도록 강제합니다.

## 함수 매개변수의 Bivariance (Function Parameter Bivariance)

함수 매개 변수의 타입을 비교할 때 원본 매개 변수가 대상 매개 변수에 할당 가능하거나 그 반대일 경우 할당이 성공합니다.

이것은 호출한 측에서 더 특수화된 타입을 취하는 함수를 제공하게 될 수도 있지만 덜 특수화된 타입의 함수를 호출할 수 있기 때문에 바람직하지 않습니다.

실제로 이런 종류의 오류는 드물기 때문에 이를 통해 많은 일반적인 JavaScript 패턴을 사용할 수 있습니다. 

간단한 예제:

```ts
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// 부적절하지만 유익하고 일반적인
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// 안정성에서 바람직하지 않은 대안
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + "," + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + "," + e.y)));

//그래도 허용되지 않습니다(명확한 오류). 완전히 호환되지 않는 유형에 대해 적용되는 타입 안전성(Type safety)
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

## 선택적 매개 변수와 나머지 매개 변수 (Optional Parameters and Rest Parameters)

호환성을 위한 함수를 비교할 때 선택적 매개 변수와 필수 매개 변수는 서로 바꿔서 사용할 수 있습니다.  
원본 타입의 추가 선택적 매개 변수는 오류가 아니며 원본 타입의 해당 매개 변수가 없는 대상 타입의 선택적 매개 변수는 오류가 아닙니다.

함수에 나머지 매개 변수가 있으면 함수가 선택적 매개 변수의 무한적입 집합인것처럼 처리됩니다.

이는 타입 시스템의 관점에서 보면 중요하지 않지만 런타임 관점에서 선택적 매개 변수의 개념은 일반적으로 잘 적용되지 않습니다.  
왜냐하면 그 위치에서 `undefined`가 통과하는 것이 대부분의 함수가 같기 때문입니다.

동기를 부여하는 예제는 콜백을 수행하고 일부(개발자에게) 예측 가능하지만 (타입 시스템에) 알 수 없는 인수를 사용하여 호출하는 함수의 일반적인 패턴입니다.

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... 'arg'로 콜백을 호출합니다. ... */
}

// 부적절함 - invokeLater 임의의 수의 인수를 제공"할 수도 있습니다"
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// 혼란스러움 (x와 y는 정말로 필요합니다) 발견 할 수 없습니다.
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

## 오버로드 함수 (Functions with overloads)

함수에 오버로드가 있는 경우 원본 타입의 각 오버로드는 대상 타입의 호환가능한 시그니처과 일치해야합니다.  
이렇게하면 원본 함수와 동일한 모든 상황에서 대상 함수를 호출 할 수 있습니다.
# 열거형 (Enums)

열거형은 숫자와 호환되며 숫자는 열거형과 호환됩니다.  
다른 열거형에서 가져온 열거형의 값은 호환되지 않는 것으로 간주됩니다.

예를 들어

```ts
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  // 오류
```

# 클래스 (Classes)

클래스는 한가지 예외를 제외하고 객체의 리터럴 타입 및 인터페이스와 유사하게 작동합니다: 정적 타입과 인스턴스 타입을 모두 포함합니다.  

한 클래스 타입의 두 객체를 비교할 때 인스턴스의 멤버만 비교됩니다.  
정적 멤버 및 생성자는 호환성에 영향을 미치지 않습니다.

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

a = s;  // 좋아요
s = a;  // 좋아요
```

## 클래스의 Private와 protected 멤버 (Private and protected members in classes)

클래스의 Private와 및 protected 멤버는 호환성에 영향을 줍니다.  
클래스의 인스턴스가 호환성을 검사할 때 대상 타입에 private 멤버가 포함되어 있으면 원본 타입에 동일한 클래스에서 비롯된 private 멤버가 포함되어 있어야합니다.  
마찬가지로 protected 멤버가 있는 인스턴스에도 동일하게 적용됩니다.  
이를 통해 클래스는 수퍼 클래스와 할당을 지정하는 것이 가능하지만 다른 상속 계층 구조의 클래스에서는 동일한 형태을 가질 수 *없습니다*.

# 제네릭 (Generics)

TypeScript는 구조적인 타입 시스템이기 때문에 타입 매개변수는 멤버 타입의 일부로 사용될 때 결과 타입에 만 영향을 줍니다.

예를 들어

```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // 좋아요, y는 x의 구조와 일치합니다
```

위의 경우 `x`와 `y`의 구조가 인수 타입를 차별화된 방식으로 사용하지 않기 때문에 호환 가능합니다.

`Empty<T>`에 멤버를 추가하여 이 예제를 변경하면 어떻게 동작하는지 보여줍니다 :
```ts
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // 오류, x와 y는 호환되지 않습니다
```

이런 식으로 인수 타입이 명시된 제네릭 타입은 비-제네릭 타입처럼 동작합니다.

인수 타입 지정되지 않은 제네릭 타입의 경우 모든 지정되지 않은 인수 타입 대신에 `any`를 지정하여 호환성을 검사합니다.  
그런 다음 결과로 나타나는 유형의 호환성을 일반적이지 않은 경우와 마찬가지로 검사합니다.  
그 결과 생성된 타입은 비-제네릭 경우와 마찬가지로 호환성을 검사합니다.

예를 들어

```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // 좋아요 왜냐하면 (x: any)=>any 일치 (y: any)=>any
```

# 고급 주제 (Advanced Topics)

## 하위 타입 vs 할당 (Subtype vs Assignment)

지금까지는 언어 사양에 정의된 용어가 아닌 '호환성'을 사용했습니다.  
TypeScript에는 두 종류의 호환성이 있습니다: 하위 타입과 할당

이러한 할당과 `any`에서와 숫자 값을 상응하는 열거형까지 할당을 허용하는 규칙과 하위 호환성을 확장에서만 차이가 있다.

다른 위치는 상황에 따라 두 가지 호환 메커니즘 중 하나를 사용합니다.  
실용적인 목적을 위해 타입 호환성은 `implements`와 `extends`의 경우에도 할당 호환성에 의해 결정됩니다.

자세한 내용은 [TypeScript 사양](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md)을 참조하십시오.
