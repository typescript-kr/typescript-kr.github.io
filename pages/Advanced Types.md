# 교차 타입 (Intersection Types)

교차 타입은 다양한 타입을 하나로 결합합니다.  
따라서 기존 타입을 추가하여 필요한 모든 기능을 갖춘 단일 타입을 얻을 수 있습니다.

예를 들어 `Person & Serializable & Loggable`은 `Person` *과* `Serializable` *이며* `Loggable` 입니다.  
즉 이 타입의 객체는 세 가지 타입의 모든 멤버를 갖게됩니다.

믹스인에 사용되는 교차 타입과 고전적인 객체 지향 형식에 맞지 않는 다른 개념을 볼 수 있습니다.  
(JavaScript에 이러한 것들이 많습니다!)

여기에 Mixin을 만드는 방법을 보여 주는 간단한 예제가 있습니다 :

```ts
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

# 유니온 타입 (Union Types)

유니온 타입은 교차 타입과 밀접한 관련이 있지만 매우 다르게 사용됩니다.  
때로는 매개 변수가`number` 또는`string`이 될 것으로 기대하는 라이브러리를 실행하게됩니다.

예를 들어 다음과 같은 함수을 수행하십시오:

```ts
/**
 * string 타입을 가져와서 왼쪽에 "padding"을 추가합니다.
 * 'padding'이 string인 경우에는 'padding'이 왼쪽에 추가됩니다.
 * 'padding'이 number인 경우에는 해당 개수의 공백이 왼쪽에 추가됩니다.
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

padLeft("Hello world", 4); // "    Hello world" 반환
```

`padLeft`의 문제점은 `padding` 매개 변수가 `any`로 분류된다는 것입니다.  
즉 `number`이거나 `string`이 아닌 인수를 사용하여 호출할 수 있지만 TypeScript는 해당 인수와 함께 사용할 수 있습니다.

```ts
let indentedString = padLeft("Hello world", true); // 컴파일 타임에는 통과되지만 런타임에는 실패합니다.
```

전통적인 객체 지향 코드에서는 타입의 계층을 만들어 두 가지 타입을 추상화 할 수 있습니다.  
이것이 훨씬 더 명백하기는 하지만 또 약간 지나치기도 합니다.  
`padLeft`의 원래 버전에 대한 좋은 점 중 하나는 원시 값을 전달할 수 있다는 것입니다.  
이는 사용법이 간단하고 간결하다는 것을 의미했습니다.  
이 새로운 접근법은 이미 다른 곳에있는 함수를 사용하려는 경우에도 도움이되지 않습니다.

`any` 대신 `padding` 매개변수에 *union type* 을 사용할 수 있습니다 :

```ts
/**
 * string 타입을 가져와서 왼쪽에 "padding"을 추가합니다.
 * 'padding'이 string인 경우에는 'padding'이 왼쪽에 추가됩니다.
 * 'padding'이 number인 경우에는 해당 개수의 공백이 왼쪽에 추가됩니다.
 */
function padLeft(value: string, padding: string | number) {
    // ...
}

let indentedString = padLeft("Hello world", true); // 컴파일 시 오류
```

유니온 타입은 여러 타입 중 하나일 수 있는 값을 설명합니다.  
각 타입을 구분하기 위해 수직 막대(`|`)를 사용하므로 `number | string | boolean`은 `number`, `string` 또는 `boolean` 될 수 있는 값의 타입입니다.

유니온 타입이 있는 값이 있으면 유니온의 모든 타입에 공통적인 멤버에만 접근할 수 있습니다.

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
pet.layEggs(); // 좋아요
pet.swim();    // 오류
```

유니온 타입이 좀 까다로울 수도 있지만 익숙해지는 데는 약간의 직관이 필요할 뿐입니다.  
어떤 값에 `A | B` 타입이 있다면 `A` *와* `B` 모두 가지고있는 멤버가 있음을 *확실히* 알고 있습니다.  
이 예제에서 `Bird`는 `fly`라는 멤버를 가지고 있습니다.  
하지만 `Bird | Fish`의 변수 타입이 `fly` 메서드로 작용하고 있는지는 알 수 없습니다.  
런타임에 변수가 `Fish` 인경우 `pet.fly()` 호출은 실패합니다.

# 타입 가드와 차별 타입 (Type Guards and Differentiating Types)

유니온 타입은 값을 취할 수있는 타입으로 겹칠 수있는 상황을 모델링 할 때 유용합니다.  
`Fish`를 가지고 있는지에 대해 구체적으로 알아야 할 필요가 있을 때 무슨 일이 일어날까요?  
JavaScript에서 두 가지 가능한 값을 구별하는 일반적인 용어는 멤버의 존재를 확인하는 것입니다.
언급했듯이 유니온 타입의 모든 구성 요소에 포함될 수 있는 보장된 멤버에만 접근할 수 있습니다.

```ts
let pet = getSmallPet();

// 이러한 각 프로퍼티 접근은 오류를 발생시킵니다.
if (pet.swim) {
    pet.swim();
}
else if (pet.fly) {
    pet.fly();
}
```

동일한 코드가 작동하도록하려면 타입 표명을 사용해야합니다 :

```ts
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```

## 사용자 정의 타입 가드 (User-Defined Type Guards)

타입 표명(type assertions)을 여러번 사용해야 했다는 것에 주목하세요.  
일단 이 검사을 실시하면 각 지점에서 `pet`의 타입를 알 수 있습니다.

그런 일이 있을때 TypeScript에는 *type guard*라는 것이 있습니다.  
타입 가드(type guard)는 일부 스코프에서 타입을 보장하는 런타임 검사를 수행하는 표현식입니다.  
타입 가드를 정의하려면 반환 타입이 *타입 명제 (type predicate)* 인 함수를 정의하기만 하면 됩니다 :

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```

`pet is Fish '는 이 예제에서 타입 명제입니다.  
명제는 `parameterName is Type` 형태을 취합니다, 여기서 `parameterName`은 현재 함수 서명의 매개 변수 이름이어야합니다.

`IsFish`가 일부 변수와 함께 호출될 때 원래 타입이 호환 가능하다면 TypeScript는 그 변수를 특정 타입으로 *제한*할 것입니다.

```ts
// 'swim'과 'fly' 호출은 이제 모두 괜찮습니다.

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```

TypeScript는 `pet`이 `if` 스코프의 `Fish`라는 것을 알고있을뿐만 아니라,  
`else` 스코프에서는 `Fish`가 *없다는 것을* 알기 때문에 `Bird`가 있어야합니다.

## `typeof` 타입 가드 (`typeof` type guards)

그럼 다시 돌아와 유니온 타입을 사용하는 `padLeft` 버전의 코드를 작성해보겠습니다.  
다음과 같이 타입 명제로 작성할 수 있습니다 :

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

그러나 어떤 타입이 원시적인지 알아내는 함수를 정의하는 것은 고통스럽습니다.  
다행스럽게도, typeScript가 자체적으로 타입 가드임을 인식하기 때문에 `typeof x === "number"`를 직접 함수로 추상화할 필요는 없습니다.  
즉 이러한 인라인 검사를 작성할 수 있다는 것을 의미합니다.

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

이것들의 *`typeof` 타입 가드*는 두가지 다른 형태로 인식됩니다: `typeof v === "typename"`와  `typeof v !== "typename"`, 여기서  `"typename"`은 반드시 `"number"`, `"string"`, `"boolean"`, 또는 `"symbol"`.  
TypeScript에서 다른 문자열과 비교하는 것을 멈추지는 않지만 언어에서는 이러한 표현식을 타입 가드로 인식하지 않습니다.

## `instanceof` 타입 가드 (`instanceof` type guards)

`typeof` 타입 가드를 읽었고 JavaScript에서 `instanceof` 연산자에 익숙하다면 아마 이 섹션에 대해 알 수 있을 것입니다.

*`instanceof` 타입 가드*는 생성자 함수를 사용하여 타입을 좁히는 방법입니다.  
예를 들어, 이전의 string-padder 예제를 차용해보겠습니다:

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

// 'SpaceRepeatingPadder | StringPadder' 타입입니다
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // 타입이 'SpaceRepeatingPadder'로 좁혀졌습니다

if (padder instanceof StringPadder) {
    padder; // 타입이 'StringPadder'로 좁혀졌습니다.
}
```

`instanceof`의 오른쪽에는 생성자 함수가 있어야 하며 TypeScript는 다음과 같이 범위를 좁혀 나갑니다:

1. 타입이 `any`가 아닌 경우 함수의 `prototype` 프로퍼티 타입
2. 해당 타입의 생성자 서명에 의해 반환된 타입의 결합

이와 같은 순서로 진행됩니다.

# Nullable types

TypeScript는 `null`과 `undefined` 값을 가지는 두가지 특별한 타입이 있습니다.  
이것을 [기본 타입](./Basic Types.md) 섹션에서 간략하게 언급했었습니다.  
기본적으로 타입 체커는 `null`과 `undefined`를 모든 항목에 할당 가능한 것으로 간주합니다.  
사실상 `null` 과 `undefined`는 모든 타입의 유효한 값입니다.  
즉 방지하려는 경우조차도 any 타입에 할당되지 *않도록* 할 수 없습니다.  
`null`의 발명가 토니 호어는 이것을 ["10억달러의 실수"](https://en.wikipedia.org/wiki/Null_pointer#History)라고 부릅니다.

`--strictNullChecks`에서 다음과 같이 수정할 수 있습니다: 변수를 선언할 때 자동으로 `null` 또는 `undefined`가 포함되지 않습니다.  
유니온 타입을 사용하여 명시적으로 포함할 수 있습니다:

```ts
let s = "foo";
s = null; // 오류, 'null'은 'string'에 할당할 수 없습니다.
let sn: string | null = "bar";
sn = null; // 좋아요

sn = undefined; // 오류, 'undefined'는 'string | null'에 할당할 수 없습니다.
```

TypeScript는 JavaScript의 의미론과 일치하도록 `null`과 `undefined`를 다르게 다루고 있습니다.  
`string | null`은 `string | undefined` 및 `string | undefined | null`과는 다른 타입입니다.

## 선택적 매개변수와 프로퍼티 (Optional parameters and properties)

`--strictNullChecks`와 선택적 매개 변수는 자동으로 `| undefined`를 추가합니다:

```ts
function f(x: number, y?: number) {
    return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // 오류, 'null'은 'number | undefined'에 할당할 수 없습니다
```

선택적 프로퍼티의 경우에도 동일합니다:

```ts
class C {
    a: number;
    b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // 오류, 'undefined'를 'number'에 할당 할 수 없습니다
c.b = 13;
c.b = undefined; // ok
c.b = null; // 오류, 'null'은 'number | undefined'에 할당할 수 없습니다
```

## 타입 가드와 타입 표명 (Type guards and type assertions)

nullable 타입은 유니온으로 구현되기때문에 타입 가드를 사용하여 `null`을 제거해야합니다.  
다행히 JavaScript에서 작성하는 코드는 다음과 같습니다:

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

여기서 `null`을 제거하는 것은 확실히 좋지만 간단한 연산자도 사용할 수 있습니다.:

```ts
function f(sn: string | null): string {
    return sn || "default";
}
```

컴파일러가 `null` 또는`undefined`를 제거 할 수 없는 경우 타입 표명 연산자를 사용하여 수동으로 제거할 수 있습니다.  
구문은 후위에 `!` 입니다: `identifier!`는 `identifier`의 타입 `null`과 `undefined`를 제거합니다:

```ts
function broken(name: string | null): string {
  function postfix(epithet: string) {
    return name.charAt(0) + '.  the ' + epithet; // 오류, 'name'이 null일 수 있습니다.
  }
  name = name || "Bob";
  return postfix("great");
}

function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + '.  the ' + epithet; // 좋아요
  }
  name = name || "Bob";
  return postfix("great");
}
```

이 예제에서 컴파일러가 중첩된 함수 내에서 null을 제거할 수 없기 때문에 여기에 중첩된 함수를 사용합니다(즉시실행함수 제외).  
특히 외부 함수에서 호출한 경우 중첩된 함수에 대한 모든 호출을 추적할 수 없기 때문입니다.  
함수가 어디에서 호출되는지 알지 못하면 body가 실행될 때 `name`의 타입이 무엇인지 알 수 없습니다.

# Type Aliases

타입 aliases는 타입의 새로운 이름을 생성합니다.  
타입 aliases은 인터페이스와 유사하지만 원시 타입, 유니온, 튜플 및 기타 직접 작성해야하는 다른 타입의 이름을 지정할 수 있습니다.

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

Aliasing(Type Aliases)은 실제로 새로운 타입을 생성하지는 않습니다 - 그 타입을 참조하기 위해 새로운 *이름*을 생성합니다.  
원시값을 Aliasing 하는 것은 문서의 형태로 사용될 수 있지만 굉장히 유용하지 않습니다.

인터페이스와 마찬가지로 타입 aliases도 일반적일 수 있습니다 - aliases 선언의 오른쪽에 타입 매개 변수를 추가하여 사용하면 됩니다:

```ts
type Container<T> = { value: T };
```

type alias를 프로퍼티에서 참조할 수도 있습니다:

```ts
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

교차(intersection) 타입과 함께 mind-bending 타입을 만들 수 있습니다:

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

그러나 타입 alias가 선언의 다른 오른쪽에 나타나는 것은 불가능합니다:

```ts
type Yikes = Array<Yikes>; // 오류
```

## Interfaces vs. Type Aliases

앞서 언급했듯이, 타입 type aliases는 인터페이스와 같은 역할을 할 수 있지만 몇가지 미묘한 차이점이 있습니다.

한가지 다른 점은 인터페이스가 어디에서나 사용되는 새로운 이름을 만들어 낸다는 것입니다.  
타입 aliases는 새로운 이름을 만들지 않습니다&mdash; 예를 들어 오류 메시지는 alias 이름을 사용하지 않습니다.  
아래 코드에서, 에디터의 `interfaced` 위로 마우스를 가져가면 `Interface`를 반환할 것을 보여주지만 `aliased`는 객체 리터럴 타입을 반환한다는 것을 보여줍니다.

```ts
type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
```

두번째 더 중요한 차이점은 타입 aliases를 다음에서 확장하거나 구현할 수 없다는 것입니다 (다른 타입을 확장/구현할 수도 없습니다).  
왜냐하면 [소프트웨어의 이상적인 특성이 확장에 열려있다](https://en.wikipedia.org/wiki/Open/closed_principle) 가능한 경우 타입 alias에 대한 인터페이스를 사용해야합니다.  
다른 한편으로는, 인터페이스로 일부 형태를 표현할 수 없고 유니온이나 튜플 타입을 사용해야하는 경우 타입 aliases을 사용하는 것이 보통 좋습니다.

# 문자열 리터럴 타입 (String Literal Types)

문자열 리터럴 타입을 사용하여 문자열에 필요한 정확한 값을 지정할 수 있습니다.  
실제로 문자열 리터럴 타입은 유니온 타입, 타입 가드 및 타입 aliases와 잘 결합됩니다.  
이러한 기능을 함께 사용하여 문자열에서 열거형과 같은 동작을 얻을 수 있습니다.

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
            // 오류! null 또는 undefined로 통과해서는 안 됩니다.
        }
    }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // 오류: 여기서 "uneasy"가 허용되지 않습니다.
```

허용되는 세 문자열 중 아무 것이나 전달할 수 있지만 다른 문자열은 오류를 제공합니다.

```text
'"uneasy"' 타입의 인수를 타입의 매개 변수에 지정할 수 없습니다. '"ease-in" | "ease-out" | "ease-in-out"'
```

오버로드를 구별하기 위해 동일한 방법으로 문자열 리터럴 타입을 사용할 수 있습니다.

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... 더 많은 오버로드 ...
function createElement(tagName: string): Element {
    // ... 코드는 여기에 있습니다 ...
}
```

# 숫자 리터럴 타입 (Numeric Literal Types)

TypeScript에는 숫자 리터럴 타입도 있습니다.

```ts
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    // ...
}
```

이들은 명시 적으로 작성되는 경우는 거의 없으며 범위를 좁히는 것이 버그를 잡는 데 유용할 수 있습니다:

```ts
function foo(x: number) {
    if (x !== 1 || x !== 2) {
        //         ~~~~~~~
        // 연산자 '!=='는 '1'과 '2' 타입에는 적용 할 수 없습니다.
    }
}
```

바꾸어 말하면 `x`는 `2`와 비교할 때 `1`이어야하며 이것은 위 체크가 유효하지 않은 비교를 하고 있음을 의미합니다.

# 열거형 멤버 타입 (Enum Member Types)

[열거형 섹션](./Enums.md#union-enums-and-enum-member-types)에서 언급했듯이 열거형 멤버는 모든 멤버가 리터럴로 초기화될 때 타입을 가집니다.

"싱글톤 타입"에 대해 이야기할 때 많은 시간동안, 많은 사용자가 "싱글톤 타입"과 "리터럴 타입"을 바꿔 사용하겠지만 숫자/문자열 리터럴 타입뿐만 아니라 열거형 멤버 타입을 모두 참조합니다

# Discriminated Unions

You can combine singleton types, union types, type guards, and type aliases to build an advanced pattern called *discriminated unions*, also known as *tagged unions* or *algebraic data types*.
Discriminated unions are useful in functional programming.
Some languages automatically discriminate unions for you; TypeScript instead builds on JavaScript patterns as they exist today.
There are three ingredients:

1. Types that have a common, singleton type property &mdash; the *discriminant*.
2. A type alias that takes the union of those types &mdash; the *union*.
3. Type guards on the common property.

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

First we declare the interfaces we will union.
Each interface has a `kind` property with a different string literal type.
The `kind` property is called the *discriminant* or *tag*.
The other properties are specific to each interface.
Notice that the interfaces are currently unrelated.
Let's put them into a union:

```ts
type Shape = Square | Rectangle | Circle;
```

Now let's use the discriminated union:

```ts
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

## Exhaustiveness checking

We would like the compiler to tell us when we don't cover all variants of the discriminated union.
For example, if we add `Triangle` to `Shape`, we need to update `area` as well:

```ts
type Shape = Square | Rectangle | Circle | Triangle;
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
    // should error here - we didn't handle case "triangle"
}
```

There are two ways to do this.
The first is to turn on `--strictNullChecks` and specify a return type:

```ts
function area(s: Shape): number { // error: returns number | undefined
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

Because the `switch` is no longer exhaustive, TypeScript is aware that the function could sometimes return `undefined`.
If you have an explicit return type `number`, then you will get an error that the return type is actually `number | undefined`.
However, this method is quite subtle and, besides, `--strictNullChecks` does not always work with old code.

The second method uses the `never` type that the compiler uses to check for exhaustiveness:

```ts
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // error here if there are missing cases
    }
}
```

Here, `assertNever` checks that `s` is of type `never` &mdash; the type that's left after all other cases have been removed.
If you forget a case, then `s` will have a real type and you will get a type error.
This method requires you to define an extra function, but it's much more obvious when you forget it.

# Polymorphic `this` types

A polymorphic `this` type represents a type that is the *subtype* of the containing class or interface.
This is called *F*-bounded polymorphism.
This makes hierarchical fluent interfaces much easier to express, for example.
Take a simple calculator that returns `this` after each operation:

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
    // ... other operations go here ...
}

let v = new BasicCalculator(2)
            .multiply(5)
            .add(1)
            .currentValue();
```

Since the class uses `this` types, you can extend it and the new class can use the old methods with no changes.

```ts
class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
    // ... other operations go here ...
}

let v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
```

Without `this` types, `ScientificCalculator` would not have been able to extend `BasicCalculator` and keep the fluent interface.
`multiply` would have returned `BasicCalculator`, which doesn't have the `sin` method.
However, with `this` types, `multiply` returns `this`, which is `ScientificCalculator` here.

# Index types

With index types, you can get the compiler to check code that uses dynamic property names.
For example, a common Javascript pattern is to pick a subset of properties from an object:

```js
function pluck(o, names) {
    return names.map(n => o[n]);
}
```

Here's how you would write and use this function in TypeScript, using the **index type query** and **indexed access** operators:

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
```

The compiler checks that `name` is actually a property on `Person`.
The example introduces a couple of new type operators.
First is `keyof T`, the **index type query operator**.
For any type `T`, `keyof T` is the union of known, public property names of `T`.
For example:

```ts
let personProps: keyof Person; // 'name' | 'age'
```

`keyof Person` is completely interchangeable with `'name' | 'age'`.
The difference is that if you add another property to `Person`, say `address: string`, then `keyof Person` will automatically update to be `'name' | 'age' | 'address'`.
And you can use `keyof` in generic contexts like `pluck`, where you can't possibly know the property names ahead of time.
That means the compiler will check that you pass the right set of property names to `pluck`:

```ts
pluck(person, ['age', 'unknown']); // error, 'unknown' is not in 'name' | 'age'
```

The second operator is `T[K]`, the **indexed access operator**.
Here, the type syntax reflects the expression syntax.
That means that `person['name']` has the type `Person['name']` &mdash; which in our example is just `string`.
However, just like index type queries, you can use `T[K]` in a generic context, which is where its real power comes to life.
You just have to make sure that the type variable `K extends keyof T`.
Here's another example with a function named `getProperty`.

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}
```

In `getProperty`, `o: T` and `name: K`, so that means `o[name]: T[K]`.
Once you return the `T[K]` result, the compiler will instantiate the actual type of the key, so the return type of `getProperty` will vary according to which property you request.

```ts
let name: string = getProperty(person, 'name');
let age: number = getProperty(person, 'age');
let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'
```

## Index types and string index signatures

`keyof` and `T[K]` interact with string index signatures.
If you have a type with a string index signature, `keyof T` will just be `string`.
And `T[string]` is just the type of the index signature:

```ts
interface Map<T> {
    [key: string]: T;
}
let keys: keyof Map<number>; // string
let value: Map<number>['foo']; // number
```

# Mapped types

A common task is to take an existing type and make each of its properties optional:

```ts
interface PersonPartial {
    name?: string;
    age?: number;
}
```

Or we might want a readonly version:

```ts
interface PersonReadonly {
    readonly name: string;
    readonly age: number;
}
```

This happens often enough in Javascript that TypeScript provides a way to create new types based on old types &mdash; **mapped types**.
In a mapped type, the new type transforms each property in the old type in the same way.
For example, you can make all properties of a type `readonly` or optional.
Here are a couple of examples:

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

And to use it:

```ts
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```

Let's take a look at the simplest mapped type and its parts:

```ts
type Keys = 'option1' | 'option2';
type Flags = { [K in Keys]: boolean };
```

The syntax resembles the syntax for index signatures with a `for .. in` inside.
There are three parts:

1. The type variable `K`, which gets bound to each property in turn.
2. The string literal union `Keys`, which contains the names of properties to iterate over.
3. The resulting type of the property.

In this simple example, `Keys` is a hard-coded list of property names and the property type is always `boolean`, so this mapped type is equivalent to writing:

```ts
type Flags = {
    option1: boolean;
    option2: boolean;
}
```

Real applications, however, look like `Readonly` or `Partial` above.
They're based on some existing type, and they transform the fields in some way.
That's where `keyof` and indexed access types come in:

```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null }
type PartialPerson = { [P in keyof Person]?: Person[P] }
```

But it's more useful to have a general version.

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null }
type Partial<T> = { [P in keyof T]?: T[P] }
```

In these examples, the properties list is `keyof T` and the resulting type is some variant of `T[P]`.
This is a good template for any general use of mapped types.
That's because this kind of transformation is [homomorphic](https://en.wikipedia.org/wiki/Homomorphism), which means that the mapping applies only to properties of `T` and no others.
The compiler knows that it can copy all the existing property modifiers before adding any new ones.
For example, if `Person.name` was readonly, `Partial<Person>.name` would be readonly and optional.

Here's one more example, in which `T[P]` is wrapped in a `Proxy<T>` class:

```ts
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}
function proxify<T>(o: T): Proxify<T> {
   // ... wrap proxies ...
}
let proxyProps = proxify(props);
```

Note that `Readonly<T>` and `Partial<T>` are so useful, they are included in TypeScript's standard library along with `Pick` and `Record`:

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends string, T> = {
    [P in K]: T;
}
```

`Readonly`, `Partial` and `Pick` are homomorphic whereas `Record` is not.
One clue that `Record` is not homomorphic is that it doesn't take an input type to copy properties from:

```ts
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
```

Non-homomorphic types are essentially creating new properties, so they can't copy property modifiers from anywhere.

## Inference from mapped types

Now that you know how to wrap the properties of a type, the next thing you'll want to do is unwrap them.
Fortunately, that's pretty easy:

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

Note that this unwrapping inference only works on homomorphic mapped types.
If the mapped type is not homomorphic you'll have to give an explicit type parameter to your unwrapping function.
