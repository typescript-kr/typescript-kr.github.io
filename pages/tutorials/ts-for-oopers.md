---
title: TypeScript for Java/C# Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-oop.html
oneline: Learn TypeScript if you have a background in object-oriented languages
---

TypeScript는 C#, Java와 같이 정적 타이핑을 사용하는 언어에 익숙한 프로그래머들에게 인기 있는 선택입니다.

TypeScript의 타입 시스템은 더 나은 코드 완성, 오류의 조기 발견, 프로그램 부분 간의 더 명확한 통신과 같이 정적 타이핑이 가지는 많은 이점을 제공합니다.
TypeScript는 이러한 개발자에게 친숙한 기능을 많이 제공하지만, JavaScript(또한 TypeScript도 마찬가지로)가 기존의 객체 지향 프로그래밍(OOP) 언어와 어떤 차이가 있는지 다시 살펴볼 필요가 있습니다.
이러한 차이점을 이해하는 것은 더 나은 JavaScript 코드를 작성하는데 도움을 줄 것이고, C#/Java에서 TypeScript로 바로 입문한 프로그래머가 겪는 흔한 함정을 피할 수 있을 것입니다.

## JavaScript 함께 배우기 (Co-learning JavaScript)

만약 JavaScript에 이미 익숙하지만 주로 Java또는 C#을 사용하는 프로그래머라면, 이 소개 페이지는 흔히 접할 수 있는 오해와 함정에 대한 설명에 도움을 줄 수 있습니다.
TypeScript 모델이 유형화하는 방법 중 일부는 Java나 C#과 상당히 다르며, TypeScript를 학습하는 데에 있어 이 부분을 염두에 두는 것이 중요합니다.

만약 JavaScript를 처음 접하는 Java나 C# 프로그래머라면, JavaScript의 런타임 동작을 이해하기 위해 우선적으로 타입을 _제외한_ JavaScript의 일부분을 배우는 것이 좋습니다.
TypeScript는 코드를 _실행하는_ 방식을 바꾸지 않기 때문에, 실제로 무언가 동작하는 코드를 작성하기 위해서는 여전히 JavaScript가 어떻게 작동하는지 배워야 합니다!

TypeScript가 JavaScript와 동일한 *런타임*을 사용하므로, 특정한 런타임 동작(문자열을 숫자로 변환하기, 경고 표시, 디스크에 파일 쓰기 등)을 구현하려는 리소스는 항상 TypeScript 프로그램에 똑같이 잘 적용된다는 점을 기억하는 것은 매우 중요합니다.
TypeScript에 특정된 리소스에만 제한을 두지 마십시오!

## 클래스 다시 생각하기 (Rethinking the Class)

C#과 Java는 _의무적 OOP_ 언어라고 부릅니다.
이러한 언어에서 *클래스*는 코드 구성의 기본 단위일 뿐만 아니라 런타임 시 모든 데이터 _그리고_ 동작의 기본적인 컨테이너입니다.
기능과 데이터를 전부 클래스에 담도록 강제하는 것은 일부 문제에 대해선 좋은 도메인 모델이 될 수 있지만, 모든 도메인이 이러한 방식으로 표현될 *필요*는 없습니다.

### 자유로운 함수와 데이터 (Free Functions and Data)

JavaScript에서 함수는 어디에나 있을 수 있고, 데이터를 미리 정의된 ‘class’나 ‘struct’에 속하지 않고 자유롭게 전달할 수 있습니다.
이러한 유연성은 매우 강력합니다.
OOP 계층과 상관 없이 데이터를 처리하는 “자유로운” (클래스와 연관되지 않은) 함수는 프로그램을 JavaScript로 작성하는 모델로 선호됩니다.

### 정적 클래스 (Static Classes)

추가적으로, C#과 Java의 싱글턴과 정적 클래스 같은 특정 구조는 TypeScript에서 필요하지 않습니다.

## TypeScript의 OOP (OOP in TypeScript)

즉, 원한다면 계속 클래스를 사용해도 됩니다!
일부 문제는 기존의 OOP 계층으로 해결하기 적합하며, TypeScript가 JavaScript의 클래스를 지원하므로 이러한 모델을 더 효과적으로 만듭니다.
TypeScript는 인터페이스, 상속, 정적 메서드 구현과 같은 많은 일반적인 패턴을 지원합니다.

우리는 이 가이드의 뒷부분에서 클래스를 다룰 것입니다.

## 타입 다시 생각하기 (Rethinking Types)

TypeScript의 *타입*에 대한 이해는 사실 C#이나 Java와 상당히 다릅니다.
몇 가지 차이점을 살펴봅시다.

### 이름으로 구체화된 타입 시스템 (Nominal Reified Type Systems)

C#과 Java에서 주어진 값과 객체는 ‘null’, 원시 타입, 또는 정의된 클래스 타입 중 정확하게 하나의 타입을 가집니다.
런타임 시점에서 정확한 타입을 묻기 위해 `value.GetType()` 또는 `value.getClass()`와 같은 메서드를 호출할 수 있습니다.
이러한 타입의 정의는 특정한 이름을 갖고 클래스의 어딘가 존재하며, 명시적인 상속관계나 공통적으로 구현된 인터페이스가 없는 이상 두 클래스가 유사한 형태를 가졌다 해도 서로 대체하여 사용할 수 없습니다.

이러한 양상은 *reified, nominal* 타입 시스템을 설명합니다.
코드에서 사용한 타입은 런타임 시점에 존재하며, 타입은 구조가 아닌 선언을 통해 연관 지어집니다.

### 집합으로서의 타입 (Types as Sets)

C# 또는 Java에서 런타임 타입과 해당 컴파일 타임 선언 사이의 일대일 대응관계는 중요합니다.

TypeScript에서 타입은 공통의 무언가를 공유하는 *값의 집합*으로 생각하는 것이 좋습니다.
타입은 집합에 불과하기 때문에, 특정한 값은 동시에 _수많은_ 집합에 속할 수 있습니다.

일단 타입을 집합으로 생각하기 시작하면, 특정 연산이 매우 자연스러워집니다.
예를 들어, C#에서는 ‘string’과 ‘int’ *둘 다 가능한* 타입이 존재하지 않기 때문에 이 값을 인자로 전달하는 것은 이상합니다.

TypeScript에서 모든 타입이 단순히 집합이라는 것을 깨닫는 순간 이는 매우 자연스러워집니다.
‘string’ 집합 또는 ‘number’ 집합에 속할 수 있는 값을 어떻게 설명하시겠습니까?
이 값은 단순히 그 집합들의 *유니언*: ‘string | number’에 속합니다.

TypeScript는 집합론에 의거해 타입을 이용하는 여러 방법을 제공하며, 타입을 집합으로 생각하는 것이 더 직관적입니다.

### 삭제된 구조적 타입 (Erased Structural Types)

TypeScript에서, 객체는 정확히 단일 타입이 _아닙니다_.
예를 들어 인터페이스를 만족하는 객체를 생성할 때, 둘 사이의 선언적인 관계가 없더라도 해당 인터페이스가 예상되는 곳에 해당 객체를 사용할 수 있습니다.

```
interface Pointlike {
  x: number;
  y: number;
}
interface Named {
  name: string;
}

function printPoint(point: Pointlike) {
  console.log("x = " + point.x + ", y = " + point.y);
}

function printName(x: Named) {
  console.log("Hello, " + x.name);
}

const obj = {
  x: 0,
  y: 0,
  name: "Origin",
};

printPoint(obj);
printName(obj);
```

TypeScript의 타입 시스템은 명목이 아닌 _구조적_입니다: `obj`는 숫자인 `x`와 `y` 프로퍼티를 가지고 있으므로, `Pointlike`로써 사용될 수 있습니다.
타입 간의 관계는 특정 관계로 선언되었는지가 아닌, 포함된 프로퍼티에 의해 결정됩니다.

TypeScript의 타입 시스템은 또한 _구체화되지 않았습니다_: 런타임에 `obj`가 `Pointlike`임을 알려주지 않습니다.
사실, `Pointlike` 타입은 런타임에 _어떤 형태로도_ 존재하지 않습니다.

_집합으로서의 타입_ 개념으로 보면, `obj`를 `Pointlike` 값 집합이나 `Named` 값 집합의 멤버로 간주할 수 있습니다.

### 구조적 타입화의 결과 (Consequences of Structural Typing)

객체지향 프로그래머는 종종 구조적 타입화의 두 가지 측면에 놀라곤 합니다.

#### 빈 타입 (Empty Types)

첫 번째로 _빈 타입_은 예상을 무시하는 것처럼 보입니다:

```
class Empty {}

function fn(arg: Empty) {
  // 무엇인가를 하나요?
}

// 오류는 없지만, '빈' 타입은 아니지 않나요?
fn({ k: 10 });
```

TypeScript는 주어진 인수가 유효한 `Empty`인지 확인하여 `fn`의 호출이 유효한지를 검사합니다
`{ k: 10 }`과 `class Empty { }`의 _구조를 확인하여 유효성을 검사합니다.
`Empty`에 프로퍼티가 없으므로 `Empty`가 수행하는 _모든_ 프로퍼티가 `{ k: 10 }`에 속해있습니다.
그러므로, 유효한 호출입니다:

놀랍지만, 최종적으로 명목적인 객체지향프로그래밍 언어와 매우 비슷하게 사용됩니다.
파생 클래스와 파생 클래스의 기본 사이의 자연스러운 하위 타입 관계가 파괴되기 때문에, 하위 클래스는 _삭제_할 수 없습니다.
구조적 타입 시스템은 호환 가능한 유형의 속성을 갖는 측면에서 하위 타입을 설명하므로 위의 관계를 암시적으로 구별합니다

#### 동일한 타입 (Identical Types)

또 다른 빈번한 놀라움의 원인은 동일한 타입에 기인합니다:

```ts
class Car {
  drive() {
    // hit the gas
  }
}
class Golfer {
  drive() {
    // hit the ball far
  }
}

// No error?
let w: Car = new Golfer();
```

다시 말하지만, 오류가 아닌 이유는 클래스의 _구조_가 동일하기 때문입니다.
잠재적인 혼란의 이유가 될 수도 있겠지만, 사실 상관없는 클래스가 동일한 경우는 일반적이지 않습니다.

차후에 클래스 챕터에서 클래스가 서로 어떻게 관련되는지에 대해 자세히 알아볼 것입니다.

### 반영 (Reflection)

객체지향 프로그래머는 제네릭을 포함하여 어떤 값의 유형이라도 다룰(query)수 있음에 익숙합니다.

```csharp
// C#
static void PrintType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

TypeScript의 타입 시스템이 완벽히 지워졌으므로, 제네릭 타입 인자의 인스턴스화와 같은 정보는 런타임에 사용할 수 없습니다.

JavaScript에는 `typeof`와 `instanceof`와 같은 제한된 원시요소가 있지만, 이런 연산자는 타입이 지워진 코드의 출력에 존재하므로 여전히 작동함을 알아야 합니다.
예를 들어, `typeof (new Car())`는 `Car`나 `"Car"`가 아닌 `"object"`입니다.

---

지금까지 개요였고, 여기에서 [핸드북](/docs/handbook/intro.html)을 읽거나 또는 [Playground 예제](/play#show-examples)를 탐색하세요.
