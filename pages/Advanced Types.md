# 목차 (Table of contents)

[교차 타입 (Intersection Types)](#교차-타입-Intersection-Types)

[유니언 타입 (Union Types)](#유니언-타입-union-types)

[타입 가드와 차별 타입 (Type Guards and Differentiating Types)](#타입-가드와-차별-타입-type-guards-and-differentiating-types)
* [사용자-정의 타입 가드 (User-Defined Type Guards)](#사용자-정의-타입-가드-user-defined-type-guards)
  * [타입 서술어 사용하기 (Using type predicates)](#타입-서술어-사용하기-using-type-predicates)
  * [`in` 연산자 사용하기 (Using the `in` operator)](#in-연산자-사용하기-using-the-in-operator)
* [`typeof` 타입 가드 (`typeof` type guards)](#typeof-타입-가드-typeof-type-guards)
* [`instanceof` 타입 가드 (`instanceof` type guards)](#instanceof-타입-가드-instanceof-type-guards)

[널러블 타입 (Nullable types)](#널러블-타입-nullable-types)
* [선택적 매개변수와 프로퍼티 (Optional parameters and properties)](#선택적-매개변수와-프로퍼티-optional-parameters-and-properties)
* [타입 가드와 타입 단언 (Type guards and type assertions)](#타입-가드와-타입-단언-type-guards-and-type-assertions)

[타입 별칭 (Type Aliases)](#타입-별칭-type-aliases)
* [인터페이스 vs. 타입 별칭 (Interfaces vs. Type Aliases)](#인터페이스-vs-타입-별칭-interfaces-vs-type-aliases)

[문자열 리터럴 타입 (String Literal Types)](#문자열-리터럴-타입-string-literal-types)

[숫자 리터럴 타입 (Numeric Literal Types)](#숫자-리터럴-타입-numeric-literal-types)

[열거형 멤버 타입 (Enum Member Types)](#열거형-멤버-타입-enum-member-types)

[판별 유니언](#판별-유니언-discriminated-unions)
* [엄격한 검사](#엄격한-검사-exhaustiveness-checking)

[다형성 `this` 타입](#다형성-this-타입-polymorphic-this-types)

[인덱스 타입](#인덱스-타입-index-types)
* [인덱스 타입과 인덱스 시그니처](#인덱스-타입과-인덱스-시그니처-index-types-and-index-signatures)

[매핑 타입](#매핑-타입-mapped-types)
* [매핑 타입의 추론](#매핑-타입의-추론-inference-from-mapped-types)

[조건부 타입](#조건부-타입-conditional-types)
* [분산 조건부 타입](#분산-조건부-타입-distributive-conditional-types)
* [조건부 타입의 타입 추론](#조건부-타입의-타입-추론-type-inference-in-conditional-types)
* [미리 정의된 조건부 타입](#미리-정의된-조건부-타입-predefined-conditional-types)

# 교차 타입 (Intersection Types)

교차 타입은 여러 타입을 하나로 결합합니다.
기존 타입을 합쳐 필요한 모든 기능을 가진 하나의 타입을 얻을 수 있습니다.
예를 들어, `Person & Serializable & Loggable`은 `Person` *과* `Serializable` *그리고* `Loggable`입니다.
즉, 이 타입의 객체는 세 가지 타입의 모든 멤버를 갖게 됩니다.

기존 객체-지향 틀과는 맞지 않는 믹스인이나 다른 컨셉들에서 교차 타입이 사용되는 것을 볼 수 있습니다.
(JavaScript에는 이런 것들이 많습니다!)
믹스인 만드는 방법을 간단한 예제를 통해 살펴보겠습니다:

```ts
function extend<First, Second>(first: First, second: Second): First & Second {
    const result: Partial<First & Second> = {};
    for (const prop in first) {
        if (first.hasOwnProperty(prop)) {
            (result as First)[prop] = first[prop];
        }
    }
    for (const prop in second) {
        if (second.hasOwnProperty(prop)) {
            (result as Second)[prop] = second[prop];
        }
    }
    return result as First & Second;
}

class Person {
    constructor(public name: string) { }
}

interface Loggable {
    log(name: string): void;
}

class ConsoleLogger implements Loggable {
    log(name) {
        console.log(`Hello, I'm ${name}.`);
    }
}

const jim = extend(new Person('Jim'), ConsoleLogger.prototype);
jim.log(jim.name);
```

# 유니언 타입 (Union Types)

유니언 타입은 교차 타입과 밀접하게 관련되어 있지만, 매우 다르게 사용됩니다.
가끔, `숫자`나 `문자열`을 매개변수로 기대하는 라이브러리를 사용할 때가 있습니다.
예를 들어, 다음 함수를 사용할 때입니다:

```ts
/**
 * 문자열을 받고 왼쪽에 "padding"을 추가합니다.
 * 만약 'padding'이 문자열이라면, 'padding'은 왼쪽에 더해질 것입니다.
 * 만약 'padding'이 숫자라면, 그 숫자만큼의 공백이 왼쪽에 더해질 것입니다.
 */
function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // "    Hello world"를 반환합니다.
```

`padLeft`의 문제는 매개변수 `padding`이 `any` 타입으로 되어있다는 것입니다.
즉, `숫자`나 `문자열` 둘 다 아닌 인수로 호출할 수 있다는 것이고, TypeScript는 이를 괜찮다고 받아들일 것입니다.

```ts
let indentedString = padLeft("Hello world", true); // 컴파일 타임에 통과되고, 런타임에 오류.
```

전통적인 객체지향 코드에서, 타입의 계층을 생성하여 두 타입을 추상화할 수 있습니다.
이는 더 명시적일 수는 있지만, 좀 과하다고 할 수도 있습니다.
전통적인 방법의 `padLeft`에서 좋은 점은 그냥 원시 값을 전달할 수 있다는 것입니다.
즉 사용법이 간단하고 간결합니다.
이 새로운 방법은 다른 곳에서 이미 존재하는 함수를 사용하려 할 때, 도움이 되지 않습니다.

`any` 대신에, *유니언 타입*을 매개변수 `padding`에 사용할 수 있습니다:

```ts
/**
 * 문자열을 받고 왼쪽에 "padding"을 추가합니다.
 * 만약 'padding'이 문자열이라면, 'padding'은 왼쪽에 더해질 것입니다.
 * 만약 'padding'이 숫자라면, 그 숫자만큼의 공백이 왼쪽에 더해질 것입니다.
 */
function padLeft(value: string, padding: string | number) {
    // ...
}

let indentedString = padLeft("Hello world", true); // 컴파일 중에 오류
```

유니언 타입은 값이 여러 타입 중 하나임을 설명합니다.
세로 막대 (`|`)로 각 타입을 구분하여 `number | string | boolean`은 값의 타입이 `number`, `string` 혹은 `boolean`이 될 수 있음을 나타냅니다.

유니언 타입을 값으로 가지고 있으면, 유니언에 있는 모든 타입에 공통인 멤버에만 접근할 수 있습니다.

```ts
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // 성공
pet.swim();    // 오류
```

유니언 타입은 여기서 약간 까다로울 수 있으나, 익숙해지는데 약간의 직관만 있으면 됩니다.
만약 값이 `A | B` 타입을 가지고 있으면, *확신할* 수 있는 것은 `A` *와* `B` 둘 다 가지고 있는 멤버가 있다는 것뿐입니다.
이 예제에서, `Bird`는 `fly`를 멤버로 가지고 있습니다.
`Bird | Fish`로 타입이 지정된 변수가 `fly` 메서드를 가지고 있는지 확신할 수 없습니다
만약 변수가 실제로 런타임에 `Fish`이면, `pet.fly()`를 호출하는 것은 오류입니다.

# 타입 가드와 차별 타입 (Type Guards and Differentiating Types)

유니언 타입은 값의 타입이 겹쳐질 수 있는 상황을 모델링하는데 유용합니다.
`Fish`가 있는지 구체적으로 알고 싶을 때, 무슨일이 벌어질까요?
JavaScript에서 가능한 두 값을 구분하는 흔한 방법은 멤버의 존재를 검사하는 것입니다.
앞에서 말했듯이, 유니언 타입의 모든 구성 성분을 가지고 있다고 보장되는 멤버에만 접근할 수 있습니다.

```ts
let pet = getSmallPet();

// 이렇게 각 프로퍼티들에 접근하는 것은 오류를 발생시킵니다
if (pet.swim) {
    pet.swim();
}
else if (pet.fly) {
    pet.fly();
}
```

같은 코드를 동작하게 하려면, 타입 단언을 사용해야 합니다:

```ts
let pet = getSmallPet();

if ((pet as Fish).swim) {
    (pet as Fish).swim();
} else if ((pet as Bird).fly) {
    (pet as Bird).fly();
}
```

## 사용자-정의 타입 가드 (User-Defined Type Guards)

타입 단언을 여러 번 사용한 것을 주목하세요.
만약 검사를 실시했을 때, 각 브랜치에서 `pet`의 타입을 알 수 있다면 훨씬 좋을 것입니다.

마침 TypeScript에는 *타입 가드*라는 것이 있습니다.
타입 가드는 스코프 안에서의 타입을 보장하는 런타임 검사를 수행한다는 표현식입니다.

### 타입 서술어 사용하기 (Using type predicates)

타입 가드를 정의하기 위해, 반환 타입이 *타입 서술어*인 함수를 정의만 하면 됩니다:

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}
```

`pet is Fish`는 이 예제에서의 타입 서술어입니다.
서술어는 `parameterName is Type` 형태이고, `parameterName`는 반드시 현재 함수 시그니처의 매개변수 이름이어야 합니다.

`isFish`가 변수와 함께 호출될 때마다, TypeScript는 기존 타입과 호환된다면 그 변수를 특정 타입으로 *제한*할 것입니다.

```ts
// 이제 'swim'과 'fly'에 대한 모든 호출은 허용됩니다

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```

TypeScript가 `pet`이 `if`문 안에서 `Fish`라는 것을 알고 있을뿐만 아니라;
`else`문 안에서 `Fish`가 *없다*는 것을 알고 있으므로, `Bird`를 반드시 가지고 있어야합니다.

### `in` 연산자 사용하기 (Using the `in` operator)

`in` 연산자는 타입을 좁히는 표현으로 작용합니다.

`n in x` 표현에서, `n`은 문자열 리터럴 혹은 문자열 리터럴 타입이고 `x`는 유니언 타입입니다. "true" 분기에서는 선택적 혹은 필수 프로퍼티 `n`을 가지는 타입으로 좁히고, "false" 분기에서는 선택적 혹은 누락된 프로퍼티 `n`을 가지는 타입으로 좁혀집니다.

```ts
function move(pet: Fish | Bird) {
    if ("swim" in pet) {
        return pet.swim();
    }
    return pet.fly();
}
```

## `typeof` 타입 가드 (`typeof` type guards)

다시 돌아와서 유니언 타입을 사용하는 버전의 `padLeft` 코드를 작성해보겠습니다.
다음과 같이 타입 서술어를 사용해서 작성할 수 있습니다:

```ts
function isNumber(x: any): x is number {
    return typeof x === "number";
}

function isString(x: any): x is string {
    return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
    if (isNumber(padding)) {
        return Array(padding + 1).join(" ") + value;
    }
    if (isString(padding)) {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

그러나 타입이 원시 값인지 확인하는 함수를 정의하는 것은 너무나 귀찮습니다.
운 좋게도, TypeScript는 `typeof`를 타입 가드로 인식하기 때문에 `typeof x === "number"`를 함수로 추상할 필요가 없습니다.
즉 타입 검사를 인라인으로 작성할 수 있습니다.

```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

*`typeof` 타입 가드*는 두 가지 다른 형식인 `typeof v === "typename"` 와 `typeof v !== "typename"`이 있습니다. 여기서 `typename`은 `"number"`, `"string"`, `"boolean"` 그리고 `"symbol"`이여야 합니다.
TypeScript에서 위에 없는 다른 문자열과 비교하는 것을 막지는 않지만, 타입 가드의 표현식으로 인지되지 않습니다.

## `instanceof` 타입 가드 (`instanceof` type guards)

위의 `typeof` 타입 가드를 읽었고 JavaScript의 `instanceof` 연산자에 익숙하다면 이미 알고 있을 것입니다.

*`instanceof` 타입 가드* 는 생성자 함수를 사용하여 타입을 좁히는 방법입니다.
위의 string-padder 예제를 다시 보겠습니다:

```ts
interface Padder {
    getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) { }
    getPaddingString() {
        return Array(this.numSpaces + 1).join(" ");
    }
}

class StringPadder implements Padder {
    constructor(private value: string) { }
    getPaddingString() {
        return this.value;
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder(4) :
        new StringPadder("  ");
}

// 타입은 'SpaceRepeatingPadder | StringPadder' 입니다
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // 타입은 'SpaceRepeatingPadder'으로 좁혀집니다
}
if (padder instanceof StringPadder) {
    padder; // 타입은 'StringPadder'으로 좁혀집니다
}
```

`instanceof`의 오른쪽은 생성자 함수여야 하며, TypeScript는 다음과 같이 좁힙니다:

1. 함수의 `prototype` 프로퍼티 타입이 `any`가 아닌 경우
2. 타입의 생성자 시그니처에서 반환된 유니언 타입일 경우

위와 같은 순서대로 진행됩니다.

# 널러블 타입 (Nullable types)

TypeScript는 각각 값이 null과 undefined를 갖는 특수한 타입인 `null`과 `undefined`가 있습니다.
[기본 타입](./basic-types.md)에서 짧게 언급한 바 있습니다.
기본적으로, 타입 검사 시 `null`과 `undefined`를 아무것에나 할당할 수 있다고 간주합니다.
실제로 `null`과 `undefined`는 모든 타입에서 유효한 값입니다.
즉, 방지하고 싶어도 어떤 타입에 할당되는 것을 *방지할* 없습니다.
`null`의 개발자인 Tony Hoare는 이를 두고["십억 불짜리 실수 (billion dollar mistake)"](https://en.wikipedia.org/wiki/Null_pointer#History)라고 부릅니다.

이건 `--strictNullChecks` 플래그로 해결합니다: 변수를 선언할 때, 자동으로 `null`이나 `undefined`를 포함하지 않습니다.
유니언 타입을 사용하여 명시적으로 포함할 수 있습니다.

```ts
let s = "foo";
s = null; // 오류, 'null'은 'string'에 할당할 수 없습니다
let sn: string | null = "bar";
sn = null; // 성공

sn = undefined; // 오류, 'undefined'는 'string | null'에 할당할 수 없습니다.
```

TypeScript는 JavaScript와 맞추기 위해 `null`과 `undefined`를 다르게 처리합니다.
`string | null`은 `string | undefined`와 `string | undefined | null`과는 다른 타입입니다.

TypeScript 3.7 이후부터는 널러블 타입을 간단하게 다룰 수 있게 [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)를 사용할 수 있습니다.

## 선택적 매개변수와 프로퍼티 (Optional parameters and properties)

`--strictNullChecks`를 적용하면, 선택적 매개변수가 `| undefined`를 자동으로 추가합니다:

```ts
function f(x: number, y?: number) {
    return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // 오류, 'null'은 'number | undefined'에 할당할 수 없습니다
```

선택적 프로퍼티도 마찬가지입니다:

```ts
class C {
    a: number;
    b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // 오류, 'undefined'는 'number'에 할당할 수 없습니다
c.b = 13;
c.b = undefined; // 성공
c.b = null; // 오류, 'null'은 'number | undefined'에 할당할 수 없습니다.
```

## 타입 가드와 타입 단언 (Type guards and type assertions)

널러블 타입이 유니언으로 구현되기 때문에, `null`을 제거하기 위해 타입 가드를 사용할 필요가 있습니다
다행히, JavaScript에서 작성했던 코드와 동일합니다.

```ts
function f(sn: string | null): string {
    if (sn == null) {
        return "default";
    }
    else {
        return sn;
    }
}
```

여기서 `null`은 확실하게 제거되어 보이지만, 간단한 연산자를 사용할 수도 있습니다:

```ts
function f(sn: string | null): string {
    return sn || "default";
}
```

컴파일러가 `null`이나 `undefined`를 제거할 수 없는 경우, 타입 단언 연산자를 사용하여 수동으로 제거할 수 있습니다.
구문은 `!`를 후위 표기하는 방법입니다: `identifier!`는 `null`과 `undefined`를 `identifier`의 타입에서 제거합니다.

```ts
function broken(name: string | null): string {
  function postfix(epithet: string) {
    return name.charAt(0) + '.  the ' + epithet; // 오류, 'name'은 아마도 null 입니다
  }
  name = name || "Bob";
  return postfix("great");
}

function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + '.  the ' + epithet; // 성공
  }
  name = name || "Bob";
  return postfix("great");
}
```

예제는 중첩 함수를 사용합니다. 왜냐하면 컴파일러가 중첩 함수안에서는 null을 제거할 수 없기 때문입니다 (즉시-호출된 함수 표현은 예외).
특히 외부 함수에서 호출될 경우, 중첩 함수에 대한 모든 호출을 추적할 수 없기 때문입니다.
함수가 어디에서 호출되었는지 알 수 없으면, 본문이 실행될 때 `name`의 타입을 알 수 없습니다.

# 타입 별칭 (Type Aliases)

타입 별칭은 타입의 새로운 이름을 만듭니다.
타입 별칭은 때때로 인터페이스와 유사합니다만, 원시 값, 유니언, 튜플 그리고 손으로 작성해야 하는 다른 타입의 이름을 지을 수 있습니다.

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === "string") {
        return n;
    }
    else {
        return n();
    }
}
```

별칭은 실제로 새로운 타입을 만드는 것은 아닙니다 - 그 타입을 나타내는 새로운 *이름* 을 만드는 것입니다.
원시 값의 별칭을 짓는 것은 문서화의 형태로 사용할 수 있지만, 별로 유용하지 않습니다.

인터페이스처럼, 타입 별칭은 제네릭이 될 수 있습니다 - 타입 매개변수를 추가하고 별칭 선언의 오른쪽에 사용하면 됩니다:

```ts
type Container<T> = { value: T };
```

프로퍼티 안에서 자기 자신을 참조하는 타입 별칭을 가질 수 있습니다:

```ts
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

교차 타입과 같이 사용하면, 아주 놀라운 타입을 만들 수 있습니다.

```ts
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
    name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;
```

하지만, 타입 별칭을 선언의 오른쪽 이외에 사용하는 것은 불가능합니다.

```ts
type Yikes = Array<Yikes>; // 오류
```

## 인터페이스 vs. 타입 별칭 (Interfaces vs. Type Aliases)

위에서 언급했듯이, 타입 별칭은 인터페이스와 같은 역할을 할 수 있습니다; 하지만, 약간의 미묘한 차이가 있습니다

한 가지 차이점은 인터페이스는 어디에서나 사용할 수 있는 새로운 이름을 만들 수 있습니다.
타입 별칭은 새로운 이름을 만들지 못합니다 &mdash; 예를 들어, 오류 메시지는 별칭 이름을 사용하지 않습니다.
아래의 코드에서, 에디터에서 `interfaced`에 마우스를 올리면  `Interface`를 반환한다고 보여주지만 `aliased`는 객체 리터럴 타입을 반환한다고 보여줍니다.

```ts
type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
```

TypeScript의 이전 버전에서, 타입 별칭은 extend 하거나 implement 할 수 없었습니다 (다른 타입을 extend/implement 할 수도 없습니다). 2.7 버전부터, 타입 별칭은 교차 타입을 생성함으로써 extend 할 수 있습니다. 예를 들어, `type Cat = Animal & { purrs: true }`.

[소프트웨어의 이상적인 특징은 확장에 개방되어 있기 때문에](https://en.wikipedia.org/wiki/Open/closed_principle), 가능하면 항상 타입 별칭보다 인터페이스를 사용해야 합니다.

반면에, 만약 인터페이스로 어떤 형태를 표현할 수 없고 유니언이나 튜플 타입을 사용해야 한다면, 일반적으로 타입 별칭을 사용합니다.

# 문자열 리터럴 타입 (String Literal Types)

문자열 리터럴 타입은 문자열에 값을 정확하게 지정할 수 있게 해줍니다.
예제에서 문자열 리터럴 타입은 유니언 타입, 타입 가드, 그리고 타입 별칭과 잘 결합됩니다.
이 기능을 열거형-같은 행동을 문자열과 함께 사용할 수 있습니다.

```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out";
class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === "ease-in") {
            // ...
        }
        else if (easing === "ease-out") {
        }
        else if (easing === "ease-in-out") {
        }
        else {
            // 오류! null이나 undefined를 전달하면 안됩니다
        }
    }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // 오류: "uneasy"는 여기서 허용하지 않습니다
```

허용되는 3개의 문자열 아무거나 전달할 수 있지만, 그 외 다른 문자열들은 오류를 발생시킵니다.

```text
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```

문자열 리터럴 타입은 오버로드를 구별하기 위해 같은 방법으로 사용할 수 있습니다.

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... 더 많은 오버로드 ...
function createElement(tagName: string): Element {
    // ... 이곳에 코드를 ...
}
```

# 숫자 리터럴 타입 (Numeric Literal Types)

TypeScript는 또한 숫자 리터럴 타입을 갖고 있습니다.

```ts
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
    // ...
}
```

명시적으로 작성되는 경우는 거의 없지만, 이슈를 좁히고 버그를 잡는데 유용할 수 있습니다.

```ts
function foo(x: number) {
    if (x !== 1 || x !== 2) {
        //         ~~~~~~~
        // '!==' 연산자는 '1'과 '2' 타입에 적용할 수 없습니다.
    }
}
```

다시 말하면, `x`는 `2`와 비교될 때, 반드시 `1`이어야 하는데 위의 검사가 유효하지 않은 비교를 의미합니다.

# 열거형 멤버 타입 (Enum Member Types)

[열거형 섹션](./enums.md#유니언-열거형과-열거형-멤버-타입-union-enums-and-enum-member-types)에서 언급했듯이, 열거형 멤버는 모든 멤버가 리터럴로-초기화될 때 타입을 가집니다.

싱글톤 타입을 이야기 할때 여기서는 열거형 멤버 타입과 숫자/문자열 리터럴 타입을 얘기하지만, 대부분 많은 유저들은 "싱글톤 타입"과 "리터럴 타입"을 상호 교환적으로 사용합니다. 

# 판별 유니언 (Discriminated Unions)

*태그 된 유니언* 또는 *대수적 데이터 타입*이라고도 하는 *판별 유니언* 고급 패턴을 만들기 위해서 싱글톤 타입, 유니언 타입, 타입 가드, 타입 별칭을 합칠 수 있습니다.
판별 유니언은 함수형 프로그래밍에서 유용합니다.
어떤 언어에서는 자동으로 판별 유니언을 제공합니다; TypeScript는 대신에 현재 JavaScript 패턴을 기반으로 합니다.
세 가지 요소가 있습니다:

1. 공통 싱글톤 타입 프로퍼티를 갖는 타입 &mdash; *판별식*.
2. 해당 타입들의 유니언을 갖는 타입 별칭 &mdash; *유니언*.
3. 공통 프로퍼티의 타입 가드

```ts
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
```

먼저 통합할 인터페이스를 선언합니다.
각 인터페이스는 다른 문자열 리터럴 타입의 `kind` 프로퍼티를 가집니다.
`kind` 프로퍼티는 *판별식* 혹은 *태그*라고 부릅니다.
다른 프로퍼티는 각 인터페이스에 따라 다릅니다.
현재 인터페이스는 관련이 없다는 것에 유의하세요.
이제 유니언으로 집어넣어 봅시다:

```ts
type Shape = Square | Rectangle | Circle;
```

이제 판별 유니언을 사용해보겠습니다:

```ts
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

## 엄격한 검사 (Exhaustiveness checking)

판별 유니언의 모든 변형을 커버할 수 없을 때, 컴파일러가 알려주길 원합니다.
예를 들어, 만약 `Triangle`을 `Shape`에 추가하면, `area`도 업데이트해야 합니다.

```ts
type Shape = Square | Rectangle | Circle | Triangle;
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
    // 여기서 오류 발생 - "triangle"의 케이스를 처리하지 않음
}
```

이를 해결하기 위해 두 가지 방법이 있습니다.
첫 번째는 `--strictNullChecks`를 키고 반환 타입을 지정하는 것입니다.

```ts
function area(s: Shape): number { // 오류: number | undefined를 반환합니다
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

`switch`가 더 이상 철저하지 않아서 TypeScript는 함수가 `undefined`를 반환할 수 있다는 것을 알고 있습니다.
만약 명시적인 반환 타입 `number`를 가지고 있으면, 반환 타입이 실제로 `number | undefined`라는 오류를 얻게 됩니다.
하지만 이 방법은 꽤 애매하고 `--strictNullChecks`가 예전 코드에서 항상 작동하는 것은 아닙니다.

두 번째 방법은 컴파일러가 완전함을 검사하기 위해 사용하는 `never` 타입을 사용하는 것입니다.

```ts
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // 빠진 케이스가 있다면 여기서 오류 발생
    }
}
```

여기서, `assertNever`는 `s`가 `never` 타입인지 검사합니다 &mdash; 모든 다른 케이스들이 제거된 후 남은 타입.
만약 케이스를 잊었다면, `s`는 실제 타입을 가질 것이고 타입 오류가 발생합니다.
이 방법은 추가 함수를 정의해야 합니다만 잊어버렸을 때, 훨씬 더 명백해집니다.

# 다형성 `this` 타입 (Polymorphic `this` types)

다형성 `this` 타입은 포함하는 클래스나 인터페이스의 *하위 타입*을 나타냅니다.
*F*-bounded polymorphism이라고 부릅니다.
예를 들어, 계층적으로 유연한 인터페이스를 표현하기 더 쉽게 만듭니다.
각 연산 후에 `this`를 반환하는 간단한 계산기를 보겠습니다:

```ts
class BasicCalculator {
    public constructor(protected value: number = 0) { }
    public currentValue(): number {
        return this.value;
    }
    public add(operand: number): this {
        this.value += operand;
        return this;
    }
    public multiply(operand: number): this {
        this.value *= operand;
        return this;
    }
    // ... 다른 연산들은 여기에 작성 ...
}

let v = new BasicCalculator(2)
            .multiply(5)
            .add(1)
            .currentValue();
```

클래스가 `this` 타입을 사용하기 때문에, 이를 extend 할 수 있고 새로운 클래스가 아무 변경 없이 이전 메서드를 사용할 수 있습니다.

```ts
class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
    // ... 다른 연산들은 여기에 작성 ...
}

let v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
```

`this` 타입 없이, `ScientificCalculator`는 `BasicCalculator`를 extend 할 수 없을 것이고 유연한 인터페이스를 유지하지 못할 것입니다.
`multiply`는 `sin` 메서드를 가지지 않는 `BasicCalculator`를 반환합니다.
하지만, `this` 타입으로, `multiply`는 `this`를 반환하고, 여기서는 `ScientificCalculator`을 말합니다.

# 인덱스 타입 (Index types)

인덱스 타입을 사용하면, 동적인 프로퍼티 이름을 사용하는 코드를 컴파일러가 검사할 수 있습니다.
예를 들어, 일반적인 JavaScript 패턴은 객체에서 프로퍼티의 부분집합을 뽑아내는 것입니다:

```js
function pluck(o, propertyNames) {
    return propertyNames.map(n => o[n]);
}
```

여기서는 **인덱스 타입 쿼리**와 **인덱스 접근** 연산자를 사용해서 TypeScript에서 이 함수를 어떻게 작성하고 사용하는지 보여줍니다:

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n]);
}

interface Car {
    manufacturer: string;
    model: string;
    year: number;
}
let taxi: Car = {
    manufacturer: 'Toyota',
    model: 'Camry',
    year: 2014
};

// Manufacturer과 model은 둘 다 문자열 타입입니다,
// 그래서 둘 다 타이핑된 문자열 배열로 끌어낼 수 있습니다.
let makeAndModel: string[] = pluck(taxi, ['manufacturer', 'model']);

// 만약 model과 year를 끌어내려고 하면,
// 유니언 타입의 배열: (string | number)[] 을 얻게됩니다.
let modelYear = pluck(taxi, ['model', 'year'])
```

컴파일러는 `manufacturer` 와 `model`이 실제 `Car`의 프로퍼티인지 검사합니다.
예제는 몇 가지 새로운 타입 연산자를 소개합니다.
첫 번째, `keyof T`는 **인덱스 타입 쿼리 연산자**입니다.
any 타입인 `T`, `keyof T`는 `T`의 알려지고 공개된 프로퍼티 이름들의 유니언입니다.
예를 들어:

```ts
let carProps: keyof Car; // ('manufacturer' | 'model' | 'year')의 유니언
```

`keyof Car`는 `'manufacturer' | 'model' | 'year'`와 완전히 호환됩니다.
차이점은 `Car`에 `ownersAddress: string`라는 또 다른 프로퍼티를 추가한다면, `keyof Car`는 자동으로 `'manufacturer' | 'model' | 'year' | 'ownersAddress'`로 업데이트합니다.
그리고 미리 프로퍼티 이름을 알 수 없을 때, `pluck`처럼 제네릭 컨텍스트에서 `keyof`를 사용할 수 있습니다.
즉 컴파일러가 올바른 프로퍼티 이름들의 집합을 `pluck`에 전달하는지 검사합니다:

```ts
// 오류, 'manufacturer' | 'model' | 'year'에 'unknown'이 없습니다.
pluck(taxi, ['year', 'unknown']); /
```

두 번째 연산자는 **인덱스 접근 연산자** `T[K]`입니다.
여기서, 타입 구문은 표현 구문을 반영합니다.
즉 `person['name']`은 `Person['name']` 타입 &mdash; 이 예제에서는 단지 `string`, 을 가집니다.
하지만, 인덱스 타입 쿼리처럼, `T[K]`를 제네릭 컨텍스트에서 사용할 수 있습니다.
타입 변수 `K extends keyof T`인지 확인하면 됩니다.
여기 `getProperty` 함수의 또 다른 예제가 있습니다.

```ts
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName]는 T[K] 타입입니다
}
```

`getProperty`, `o: T` 그리고 `propertyName: K`은 `o[propertyName]: T[K]`를 의미합니다.
`T[K]` 결과를 반환하면, 컴파일러는 실제 키의 타입을 인스턴스화하고, `getProperty`의 반환 타입은 요청한 프로퍼티에 따라 달라집니다.

```ts
let name: string = getProperty(taxi, 'manufacturer');
let year: number = getProperty(taxi, 'year');

// 오류, 'unknown'은 'manufacturer' | 'model' | 'year'에 없습니다
let unknown = getProperty(taxi, 'unknown');
```

## 인덱스 타입과 인덱스 시그니처 (Index types and index signatures)

`keyof`와 `T[K]`가 인덱스 시그니처와 상호 작용합니다. 인덱스 시그니처 매개변수 타입은 'string' 혹은 'number'이어야 합니다.
만약 문자열 인덱스 시그니처인 타입이 있으면, `keyof T`는 `string | number`가 될 것입니다
(그냥 `string`이 아닙니다, JavaScript에선 문자열 (`object['42'`])나 숫자 (`object[42]`)를 사용해서
객체 프로퍼티에 접근할 수 있습니다).
그리고 `T[string]`은 인덱스 시그니처의 타입입니다:

```ts
interface Dictionary<T> {
    [key: string]: T;
}
let keys: keyof Dictionary<number>; // string | number
let value: Dictionary<number>['foo']; // number
```

숫자 인덱스 시그니처인 타입이 있으면, `keyof T`는 `number`일 것입니다.

```ts
interface Dictionary<T> {
    [key: number]: T;
}
let keys: keyof Dictionary<number>; // 숫자
let value: Dictionary<number>['foo']; // 오류, 프로퍼티 'foo'는 타입 'Dictionary<number>'에 존재하지 않습니다.
let value: Dictionary<number>[42]; // 숫자
```

# 매핑 타입 (Mapped types)

기존 타입을 가져와 선택적 프로퍼티로 만드는 것은 일반적인 작업입니다:

```ts
interface PersonPartial {
    name?: string;
    age?: number;
}
```

혹은 읽기전용 버전을 원할 수도 있습니다:

```ts
interface PersonReadonly {
    readonly name: string;
    readonly age: number;
}
```

JavaScript에서 충분히 자주 일어나는 일이며 TypeScript는 이전 타입 &mdash; **매핑 타입**을 기반으로 새로운 타입을 만드는 방법을 제공합니다.
매핑 타입에서, 새로운 타입은 이전 타입에서 각 프로퍼티를 같은 방법으로 변환합니다.
예를 들어, 모든 프로퍼티를 `readonly` 혹은 선택적으로 만들수 있습니다.
여기 몇가지 예제가 있습니다:

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

그리고 사용하기 위해서는:

```ts
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```

이 구문이 멤버보다는 타입을 설명한다는 것에 유의하세요.
멤버를 추가하길 원한다면, 교차 타입을 사용할 수 있습니다:

```ts
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// 다음을 사용하지 **마세요**!
// 오류입니다!
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
}
```

가장 간단한 매핑 타입과 그 부분을 봅시다:

```ts
type Keys = 'option1' | 'option2';
type Flags = { [K in Keys]: boolean };
```

구문은 `for .. in`이 들어간 인덱스 시그니처 구문과 유사합니다.
세 부분으로 나뉩니다:

1. 각 프로퍼티에 순서대로 바인딩되는 타입 변수 `K`.
2. 반복할 프로퍼티 이름이 포함된 문자열 리터럴 유니언 `Keys`.
3. 프로퍼티의 결과 타입

이 간단한 예제에서, `Keys`는 하드-코딩된 프로퍼티 이름 목록이고 프로퍼티 타입은 항상 `boolean`입니다, 그래서 이 매핑 타입은 아래 쓰인 것과 동일합니다:

```ts
type Flags = {
    option1: boolean;
    option2: boolean;
}
```

하지만 실제 애플리케이션은, 위에서 `readonly`나 `Partial`처럼 보입니다.
존재하는 타입을 기반으로 하고, 특정 방법으로 프로퍼티를 변형시킵니다.
이때 `keyof`와 인덱스 접근 타입이 등장합니다:

```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null }
type PartialPerson = { [P in keyof Person]?: Person[P] }
```

하지만 일반적인 버전을 가지는 게 더 유용할 것입니다.

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null }
type Partial<T> = { [P in keyof T]?: T[P] }
```

이 예제들에서, 프로퍼티 목록은 `keyof T`이고 결과 타입은 `T[P]`의 변형입니다.
이는 매핑 타입의 일반적인 사용에 있어 좋은 템플릿입니다.
왜냐하면 이런 종류의 변형이 [동형 (homomorphic)](https://en.wikipedia.org/wiki/Homomorphism) 이기 때문에, 매핑이 `T`의 프로퍼티에만 적용되고 다른 것에는 적용되지 않습니다.
컴파일러는 새로운 것을 추가하기 전에 존재하는 모든 프로퍼티 지정자를 복사할 수 있다는 것을 알고 있습니다.
예를 들어, 만약 `Person.name`이 읽기 전용이었다면, `Partial<Person>.name`은 읽기 전용이고 선택적일 것입니다.

`Proxy<T>` 클래스 안에 래핑 된 `T[P]`에 대한 예제가 하나 더 있습니다.

```ts
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}
function proxify<T>(o: T): Proxify<T> {
   // ... 프록시 래핑 ...
}
let proxyProps = proxify(props);
```

`Readonly<T>`와 `Partial<T>`가 아주 유용하다는 것을 주목하세요, 이들은 `Pick`과 `Record`와 함께 TypeScript의 표준 라이브러리에 포함되어 있습니다.

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends keyof any, T> = {
    [P in K]: T;
}
```

`Readonly`, `Partial` 그리고 `Pick`은 동형이지만 `Record`는 아닙니다.
`Record`가 동형이 아니라는 단서 중 하나는 프로퍼티를 복사하는 입력 타입을 받지 않는 것입니다:

```ts
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
```

비-동형 타입은 본질적으로 새로운 프로퍼티를 만듭니다, 그래서 어디서든지 프로퍼티 지정자를 복사할 수 없습니다.

## 매핑 타입의 추론 (Inference from mapped types)

타입의 프로퍼티를 어떻게 래핑 하는지 알게 되었으니, 다음에 하고 싶은 것은 어떻게 언래핑(unwrap) 할지입니다.
다행히, 꽤 쉽습니다:

```ts
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}

let originalProps = unproxify(proxyProps);
```

이 언래핑 추론은 동형 매핑된 타입에만 동작합니다.
만약 매핑 타입이 동형이 아니면 언래핑 함수에 명시적인 타입 매개변수를 주어야 할 것입니다.

# 조건부 타입 (Conditional Types)

TypeScript 2.8에서 비-균등 타입 매핑을 표현하는 기능을 추가하는 *조건부 타입*을 도입했습니다.
조건부 타입은 타입 관계 검사로 표현된 조건에 따라 두 가지 가능한 타입 중 하나를 선택합니다:

```ts
T extends U ? X : Y
```

위의 타입은 `T`가 `U`에 할당될 수 있으면 타입은 `X`가 되고 그렇지 않다면 타입이 `Y`가 된다는 것을 뜻합니다.

조건부 타입 `T extends U ? X : Y`는 `X` 나 `Y`로 *결정*되거나, *지연*됩니다, 왜냐하면 조건이 하나 혹은 그 이상의 타입 변수에 의존하기 때문입니다.
`T`나 `U`가 타입 변수를 포함할 때, `X` 또는 `Y`로 결정되거나 지연될지, 타입 시스템이 `T`가 항상 `U`에 할당할 수 있는지에 대해 충분한 정보를 가지고 있는지 여부로 결정됩니다.

즉시 결정되는 일부 타입의 예제로, 다음 예제를 살펴보겠습니다:

```ts
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// 타입은 'string | number'
let x = f(Math.random() < 0.5)

```

또 다른 예제는 중첩 조건부 타입을 사용하는 `TypeName` 타입 별칭입니다:

```ts
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"
```

하지만 조건부 타입이 지연되는 지점 - 분기를 선택하기보단 고정되는 - 의 예를 들면 다음과 같습니다:

```ts
interface Foo {
    propA: boolean;
    propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
    // 'U extends Foo ? string : number' 타입을 가지고 있습니다
    let a = f(x);

    // 이 할당은 허용됩니다!
    let b: string | number = a;
}
```

위에서, 변수 `a`는 아직 분기를 선택하지 못한 조건부 타입을 가지고 있습니다.
또 다른 코드가 `foo`의 호출을 그만두면, `U`를 다른 타입으로 대체할 것이고, TypeScript가 실제로 분기를 선택할 수 있는지 결정하기 위해 조건부 타입을 재-평가할 것입니다.

그동안, 조건부 타입을 조건부의 각 분기가 대상에 할당 가능한 한 다른 대상 타입으로 할당할 수 있습니다.
그래서 위 예제에서 조건부가 어떻게 평가되든지, `string`혹은 `number`로 알려져 있기 때문에, 조건이 `U extends Foo ? string : numer`를 `string | number`로 할당할 수 있었습니다.

## 분산 조건부 타입 (Distributive conditional types)

검사된 타입이 벗겨진 (naked) 타입 매개변수인 조건부 타입을 *분산 조건부 타입*이라고 합니다.
분산 조건부 타입은 인스턴스화 중에 자동으로 유니언 타입으로 분산됩니다.
예를 들어, `T`에 대한 타입 인수 `A | B | C`를 사용하여 `T extends U ? X : Y`를 인스턴스화하면 `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`로 결정됩니다.

### 예제

```ts
type T10 = TypeName<string | (() => void)>;  // "string" | "function"
type T12 = TypeName<string | string[] | undefined>;  // "string" | "object" | "undefined"
type T11 = TypeName<string[] | number[]>;  // "object"
```

분산 조건부 타입 `T extends U ? X : Y`의 인스턴스화에서,
조건부 타입 내의 `T`에 대한 참조는 유니언 타입의 개별 성분으로 결정됩니다 (즉 `T`가 조건부 타입이 유니언 타입으로 분산된 *후에* 개별 성분을 참조합니다).
게다가, `X` 안의 `T`에 대한 참조에는 추가적인 타입 매개변수 제약 조건 (constraint) `U`가 있습니다 (즉 `T`는 `X` 안에서 `U`에 할당 가능하다고 간주됩니다).

### 예제

```ts
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T20 = Boxed<string>;  // BoxedValue<string>;
type T21 = Boxed<number[]>;  // BoxedArray<number>;
type T22 = Boxed<string | number[]>;  // BoxedValue<string> | BoxedArray<number>;
```

`T`가 실제 `Boxed<T>`의 분기 안에서 추가 제약조건 `any[]`을 가지고 있고 `T[number]`로 배열의 요소 타입을 참조할 수 있음을 유의하세요. 또한 지난 예제에서 조건부 타입이 어떻게 유니언 타입으로 분산되었는지 확인하세요.

조건부 타입의 분산 프로퍼티는 유니언 타입을 *필터링*하는데 편하게 사용할 수 있습니다:

```ts
type Diff<T, U> = T extends U ? never : T;  // U에 할당할 수 있는 타입을 T에서 제거
type Filter<T, U> = T extends U ? T : never;  // U에 할당할 수 없는 타입을 T에서 제거

type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
type T32 = Diff<string | number | (() => void), Function>;  // string | number
type T33 = Filter<string | number | (() => void), Function>;  // () => void

type NonNullable<T> = Diff<T, null | undefined>;  // T에서 null과 undefined를 제거

type T34 = NonNullable<string | number | undefined>;  // string | number
type T35 = NonNullable<string | string[] | null | undefined>;  // string | string[]

function f1<T>(x: T, y: NonNullable<T>) {
    x = y;  // 성공
    y = x;  // 오류
}

function f2<T extends string | undefined>(x: T, y: NonNullable<T>) {
    x = y;  // 성공
    y = x;  // 오류
    let s1: string = x;  // 오류
    let s2: string = y;  // 성공
}
```

조건부 타입은 특히 매핑 타입과 결합할 때 유용합니다.

```ts
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
    id: number;
    name: string;
    subparts: Part[];
    updatePart(newName: string): void;
}

type T40 = FunctionPropertyNames<Part>;  // "updatePart"
type T41 = NonFunctionPropertyNames<Part>;  // "id" | "name" | "subparts"
type T42 = FunctionProperties<Part>;  // { updatePart(newName: string): void }
type T43 = NonFunctionProperties<Part>;  // { id: number, name: string, subparts: Part[] }
```

유니언과 교차 타입과 유사하게, 조건부 타입은 재귀적으로 자기 자신을 참조할 수 없습니다.
예를 들어 다음의 예제는 오류입니다.

### 예제

```ts
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T;  // 오류
```

## 조건부 타입의 타입 추론 (Type inference in conditional types)

조건부 타입의 `extends` 절 안에서, 이제 추론 될 타입 변수를 도입하는 `infer` 선언을 가지는 것이 가능합니다.
이렇게 추론된 타입 변수는 조건부 타입의 실제 분기에서 참조될 수 있습니다.
같은 타입 변수에 대한 여러 개의 `infer` 위치를 가질 수 있습니다.

예를 들어, 다음은 함수 타입의 반환 타입을 추출합니다.

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

조건부 타입은 순서대로 평가되는 일련의 패턴 일치를 형성하기 위해 중첩될 수 있습니다.

```ts
type Unpacked<T> =
    T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
    T extends Promise<infer U> ? U :
    T;

type T0 = Unpacked<string>;  // string
type T1 = Unpacked<string[]>;  // string
type T2 = Unpacked<() => string>;  // string
type T3 = Unpacked<Promise<string>>;  // string
type T4 = Unpacked<Promise<string>[]>;  // Promise<string>
type T5 = Unpacked<Unpacked<Promise<string>[]>>;  // string
```

다음 예제는 어떻게 공변 (co-variant) 위치에서 같은 타입 변수에 대한 여러 후보가 유니언 타입을 추론하는지 보여줍니다:

```ts
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never;
type T10 = Foo<{ a: string, b: string }>;  // string
type T11 = Foo<{ a: string, b: number }>;  // string | number
```

마찬가지로, 반-변(contra-variant) 위치에서 같은 타입 변수에 대한 여러 후보가 교차 타입을 추론합니다:

```ts
type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
```

여러 호출 시그니처가 있는 타입에서 추론할 때 (오버로딩된 함수의 타입과 같은), 추론은 *마지막* 시그니처에서 만들어집니다 (이는 아마도 가장 관대한 케이스 일 것입니다).
인수 타입의 리스트를 기반으로 오버로드 해결을 수행할 수는 없습니다.

```ts
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;
type T30 = ReturnType<typeof foo>;  // string | number
```

일반 타입 매개변수에 대한 제약조건 절에서 `infer` 선언을 사용할 수 없습니다.

```ts
type ReturnType<T extends (...args: any[]) => infer R> = R;  // 오류, 지원되지 않습니다.
```

하지만, 제약조건에서 타입 변수를 지우고 대신에 조건부 타입을 지정하면 거의 같은 효과를 얻을 수 있습니다:

```ts
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R ? R : any;
```

## 미리 정의된 조건부 타입 (Predefined conditional types)

TypeScript 2.8에서 `lib.d.ts`에 미리 정의된 조건부 타입을 추가했습니다.

* `Exclude<T, U>` -- `U`에 할당할 수 있는 타입은 `T`에서 제외.
* `Extract<T, U>` -- `U`에 할당할 수 있는 타입을 `T`에서 추출
* `NonNullable<T>` -- `T`에서 `null`과 `undefined`를 제외.
* `ReturnType<T>` -- 함수 타입의 반환 타입을 얻기.
* `InstanceType<T>` -- 생성자 함수 타입의 인스턴스 타입을 얻기.

### 예제

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // never
type T17 = ReturnType<string>;  // 오류
type T18 = ReturnType<Function>;  // 오류

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // never
type T23 = InstanceType<string>;  // 오류
type T24 = InstanceType<Function>;  // 오류
```
> Note: `Exclude` 타입은 [여기](https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458)에서 제안된 `Diff` 타입의 적절한 구현입니다. `Diff`를 정의한 코드와의 충돌을 피하기 위해 `Exclude`를 사용했고, 또 이 이름이 타입의 의미를 더 잘 전달한다고 느꼈습니다.
