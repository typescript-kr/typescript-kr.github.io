# 열거형 (Enums)

열거형을 사용하면 이름이 있는 상수들을 정의할 수 있습니다.  
열거형의 사용은 문서의 의도나 명확한 사례들을 쉽게 만들 수 있습니다.  
TypeScript 는 숫자 및 문자열 기반 열거형을 모두 제공합니다.

## 숫자 열거형 (Numeric enums)

먼저 숫자 열거형으로 시작합니다.  
다른 언어에서 열거형을 접해봤다면 더 익숙 할 것입니다.  
열거형은 `enum` 키워드를 사용하여 정의할 수 있습니다.

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
```

위에서 `Up` 는 `1` 로 초기화된 숫자 열거형입니다.  
아래에 이어서 등장하는 멤버들은 자동으로 증가합니다.  
즉, `Direction.Up` 은 `1`, `Down` 은 `2`, `Left` 는 `3`, `Right` 는 `4` 입니다.

원한다면 초기화를 완전히 없앨 수도 있습니다.

```ts
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

여기에서는 `Up` 은 `0` 이며, `Down` 은 `1` 이 됩니다.  
이 자동 증가 동작은 멤버의 값 자체에 신경 쓰지 않고 각 열거형이 동일한 열거형의 다른 값과 구별되는 경우에 유용합니다.

열거형을 사용하는 것은 간단합니다: 열거형 자체의 속성으로 모든 멤버에 엑섹스하고, 열거형의 이름을 사용하여 타입을 선언합니다.

```ts
enum Response {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Response): void {
    // ...
}

respond("Princess Caroline", Response.Yes)
```

숫자 열거형은 [계산된, 상수 멤버 (computed and constant members)](#computed-and-constant-members)에 혼합될 수 있습니다.  
단편적으로 초기화가 없는 열거형은 상수 또는 다른 상수 열거형의 멤버로 초기화된 숫자 열거형을 따라야할 필요가 있습니다.  
즉, 다음은 허용되지 않습니다:

```ts
enum E {
    A = getSomeValue(),
    B, // 오류 ! A 는 상수로 초기화되지 않았으므로 B에는 초기화가 필요합니다.
}
```

## 문자 열거형 (String enums)

문자 열거형은 비슷한 개념이지만 아래에 설명 된 것과 같이 약간의 미묘한 [실행시 차이 (runtime differences)](#enums-at-runtime)가 있습니다.  
문자 열거형에서 각 멤버는 문자열 리터럴 또는 다른 문자 열거형 멤버로 상수초기화되어야 합니다.

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

문자 열거형은 자동 증가 동작을 하지 않지만 문자 열거형은 "직렬화(serialize)"하는 이점이 있습니다.  
즉, 디버깅 중이며 숫자 열거형의 런타임 값을 읽어야하는 경우 이 값은 종종 불투명합니다 - 즉, 자체적으로 유용한 의미를 전달하지는 않습니다.([역 매핑 (enums-at-runtime)](#enums-at-runtime)이 도움이 될것입니다)  
문자 열거형을 사용하면 열거형 멤버 자체의 이름과 독립적으로 코드가 실행될 때 의미있고 읽기 쉬운 값을 제공합니다.

## 별종 열거형 (Heterogeneous enums)

엄밀히 말하자면 열거형은 문자열과 숫자 멤버와 섞일 수는 있지만 그렇게 할 이유는 없습니다.

```ts
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

JavaScript의 런타임 동작을 실제로 사용하려고 하지 않는 한, 이렇게 하지 않는 것이 좋습니다. 

## 계산된 상수 멤버 (Computed and constant members)

각 열거형 멤버에는 *constant* 또는 *computed* 중 하나일 수 있는 값이 있습니다.  
열거형 멤버는 다음과 같은 경우 상수로 간주됩니다:

* 열거형의 첫 번째 멤버이며 초기화가 없으면 값이 `0` 으로 지정됩니다:

  ```ts
  // E.X 는 상수입니다:
  enum E { X }
  ```

* 초기화가 없고 앞의 열거형 멤버가 *숫자* 인 상수입니다.  
  이 경우 이후 나오는 열거형 멤버의 값은 이전 열거형 멤버의 값에 1을 더한 값이 됩니다.

  ```ts
  // E1 및 E2의 모든 열거형 멤버는 상수입니다.

  enum E1 { X, Y, Z }

  enum E2 {
      A = 1, B, C
  }
  ```

* 열거형 멤버는 상수 열거형 표현식으로 초기화됩니다.  
  상수 열거형 표현식은 컴파일 시간에 완전히 평가될 수 있는 TypeScript의 하위 집합입니다.  
  표현식은 다음과 같은 경우 상수 열거 표현식입니다:
  1. 리터럴 열거 표현식 (기본적으로 문자 리터럴 또는 숫자 리터럴)
  2. 이전에 정의된 상수 열거형 멤버 (다른 열거형에서 올 수 있음)에 대한 참조
  3. 괄호로 묶인 상수 열거형 표현식
  4. 상수 열거형 표현식에 적용된 `+`, `-`, `~` 단항 연산자 중 하나
  5. `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` 바이너리 연산자에 사용된 상수 열거형 표현식
  상수 열거형 표현식이 `NaN` 또는 `Infinity` 로 평가되는 것은 컴파일 타임 에러입니다.
  
다른 모든 경우에는 열거형 멤버가 계산된(computed) 것으로 간주됩니다.

```ts
enum FileAccess {
    // 상수 멤버
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // 계산된 멤버
    G = "123".length
}
```

## 통합 열거형 및 열거형 멤버 타입 (Union enums and enum member types)

계산되지 않은 상수 열거형 멤버의 특수 하위 집합이 있습니다: 리터럴 열거형 멤버입니다.  
리터럴 열거형 멤버는 초기화된 값이 없거나 다음 값으로 초기화 된 값이 있는 상수 열거형 멤버입니다.

* 문자열 리터럴 (예: `"foo"`, `"bar"`, `"baz"`)
* 숫자 리터럴 (예: `1`, `100`)
* 숫자 리터럴에 적용되는 단항 마이너스 (예: `-1`, `-100`)

열거형의 모든 멤버가 리터럴 열거형 값을 가질 때 일부 특수한 의미가 있습니다.

첫번째는 열거형 멤버도 타입이 된다는 것입니다.
예를 들어 특정 멤버는 열거형 멤버의 값만 가질 수 있습니다.

```ts
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ 오류!
    radius: 100,
}
```

또 다른 변화는 열거 타입 자체가 각 열거형 멤버의 *합집합(union)* 이 된다는 것입니다.  
[결합 타입 (union types)](./Advanced Types.md#union-types)에 대해 아직 배우지 않았지만, 알아 두어야 할 것은 조합 열거형을 사용하는 타입 시스템이 열거형 자체에 존재하는 정확한 값들을 알고있다는 사실을 활용할 수 있다는 것입니다.  
이 때문에 TypeScript는 값을 잘못 비교하는 바보같은 버그를 잡을 수 있습니다.

```ts
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // 오류! 연산자 '!==' 는 'E.Foo' 및 'E.Bar' 타입에 적용할 수 없습니다.
    }
}
```

이 예제에서, 먼저 `x` 가 `E.Foo` 가 가 *아닌지* 검사했습니다.  
이 검사를 성공하면 `||` 가 실행되지 않고 'if' 의 내부가 실행됩니다.  
하지만 검사를 성공하지 못하면 `x` 는 *오직* `E.Foo` 만 될 수 있습니다. 따라서 `E.Bar` 와 동일한 지 확인하는 것은 의미가 없습니다.

## 런타임시의 열거형 (Enums at runtime)

열거형은 런타임에 존재하는 실제 객체입니다.

예를 들어 다음 열거형을 보면,

```ts
enum E {
    X, Y, Z
}
```

실제로 함수에 전달 될 수 있습니다.

```ts
function f(obj: { X: number }) {
    return obj.X;
}

// 작동합니다. 왜냐하면 `E` 는 숫자인 `X` 라는 속성을 가지고있기 떄문입니다.
f(E);
```

### 역 매핑 (Reverse mappings)

멤버에 대한 속성 이름이 있는 객체를 만드는 것 외에도 숫자 열거형 멤버는 열거형 값에서 열거형의 이름으로 *역 매핑(reverse mapping)* 을 받습니다.

예를 들어, 다음 예제에서:

```ts
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript는 이것을 다음 JavaScript로 컴파일합니다.

```js
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

이 생성된 코드에서 열거형은 전방향(forward) (`name` -> `value`) 매핑과 역방향(reverse) (`value` -> `name`) 매핑을 모두 저장하는 객체로 컴파일됩니다.  
다른 열거형 멤버에 대한 참조는 항상 속성 접근으로 방출되며 결고 인라인(inline)되지 않습니다.

문자열 열거형 멤버는 역매핑을 생성하지 *않습니다*.

### `const` 열거형 (`const` enums)

대부분의 경우 열거형은 완벽하게 유효현 방법입니다.  
하지만 때떄로 요구사항이 더 엄격합니다.  
열거형의 값에 접근할 때 여부느이 생성된 코드와 추가적인 우회 비용을 피하려면 `const` 열거형을 사용 할 수 있습니다.  
`const` 열거형은 열거형에 `const` 지시자를 사용하여 정의합니다.

```ts
const enum Enum {
    A = 1,
    B = A * 2
}
```

`const` 열거형은 상수 열거형 표현식만 사용할 수 있으며 일반 열거형과 달리 컴파일하는 동안 완전히 제거됩니다.  
`const` 열거형 멤버는 사용하는 사이트에서 인라인(inline)됩니다.  
`const` 열거형은 계산된 멤버를 가질수 없기 때문에 가능합니다.

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

코드는 다음과 같이 컴파일 됩니다.

```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

## 앰비언트 열거형 (Ambient enums)

```ts
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```

앰비언트 열거형과 비앰비언트 열거형의 중요한 차이점 중 하나는 일반 열거형에서 초기화가 없는 멤버는 이전 열거형 멤버가 상수로 간주된다는 것입니다.  
반대로, 초기화가 없는 앰비언트 (그리고 비상수(`non-const`)) 열거형 멤버는 *항상* 계산된 것으로 간주됩니다.