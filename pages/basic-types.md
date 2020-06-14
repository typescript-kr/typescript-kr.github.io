# 목차 (Table of Contents)

1. [소개 (Introduction)](#소개-introduction)
2. [불리언 (Boolean)](#불리언-boolean)
3. [숫자 (Number)](#숫자-number)
4. [문자열 (String)](#문자열-string)
5. [배열 (Array)](#배열-array)
6. [튜플 (Tuple)](#튜플-tuple)
7. [열거 (Enum)](#열거-enum)
8. [Any](#any)
9. [Void](#void)
10. [Null and Undefined](#null-and-undefined)
11. [Never](#never)
12. [객체 (Object)](#객체-object)
13. [타입 단언 (Type assertions)](#타입-단언-type-assertions)
14. ['let'에 관하여](#let에-관하여)

# 소개 (Introduction)

프로그램이 유용하려면 숫자, 문자열, 구조체, 불리언 값과 같은 간단한 데이터 단위가 필요합니다.
TypeScript는 JavaScript와 거의 동일한 데이터 타입을 지원하며, 열거 타입을 사용하여 더 편리하게 사용할 수 있습니다.

# 불리언 (Boolean)

가장 기본적인 데이터 타입은 JavaScript, TypeScript에서 `boolean` 값이라고 일컫는 참/거짓(true/false) 값입니다.

```ts
let isDone: boolean = false;
```

# 숫자 (Number)

JavaScript처럼, TypeScript의 모든 숫자는 부동 소수 값입니다.
부동 소수에는 `number`라는 타입이 붙혀집니다.
TypeScript는 16진수, 10진수 리터럴에 더불어, ECMAScript 2015에 소개된 2진수, 8진수 리터럴도 지원합니다.

```ts
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

# 문자열 (String)

웹 페이지, 서버 같은 프로그램을 JavaScript로 만들 때 기본적으로 텍스트 데이터를 다루는 작업이 필요합니다.
다른 언어들처럼, TypeScript에서는 텍스트 테이터 타입을 `string`으로 표현합니다.
JavaScript처럼 TypeScript도 큰따옴표 (`"`)나 작은따옴표 (`'`)를 문자열 데이터를 감싸는데 사용합니다.

```ts
let color: string = "blue";
color = 'red';
```

또한 *템플릿 문자열* 을 사용하면 여러 줄에 걸쳐 문자열을 작성할 수 있으며, 표현식을 포함시킬 수도 있습니다.
이 문자열은 백틱/백쿼트 (`` ` `` ) 문자로 감싸지며, `${ expr }`과 같은 형태로 표현식을 포함시킬 수 있습니다.

```ts
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ fullName }.
I'll be ${ age + 1 } years old next month.`;
```

위는 아래 `sentence`선언과 동일합니다:

```ts
let sentence: string = "Hello, my name is " + fullName + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

# 배열 (Array)

TypeScript는 JavaScript처럼 값들을 배열로 다룰 수 있게 해줍니다.
배열 타입은 두 가지 방법으로 쓸 수 있습니다.
첫 번째 방법은, 배열 요소들을 나타내는 타입 뒤에 `[]`를 쓰는 것입니다:

```ts
let list: number[] = [1, 2, 3];
```

두 번째 방법은 제네릭 베열 타입을 쓰는 것입니다. `Array<elemType>`:

```ts
let list: Array<number> = [1, 2, 3];
```

# 튜플 (Tuple)

튜플 타입을 사용하면, 요소의 타입과 개수가 고정된 배열을 표현할 수 있습니다. 단 요소들의 타입이 모두 같을 필요는 없습니다. 예를 들어, `number`, `string` 이 쌍으로 있는 값을 나타내고 싶을 수 있습니다:

```ts
// 튜플 타입으로 선언
let x: [string, number];
// 초기화
x = ["hello", 10]; // 성공
// 잘못된 초기화
x = [10, "hello"]; // 오류
```

정해진 인덱스에 위치한 요소에 접근하면 해당 타입이 나타납니다.

```ts
console.log(x[0].substring(1)); // 성공
console.log(x[1].substring(1)); // 오류, 'number'에는 'substring' 이 없습니다.
```

정해진 인덱스 외에 다른 인덱스에 있는 요소에 접근하면, 오류가 발생하며 실패합니다.

```ts
x[3] = "world"; // 오류, '[string, number]' 타입에는 프로퍼티 '3'이 없습니다.

console.log(x[5].toString()); // '[string, number]' 타입에는 프로퍼티 '5'가 없습니다.
```

# 열거 (Enum)

JavaScript의 표준 자료형 집합과 사용하면 도움이 될만한 데이터 형은 `enum`입니다.
C# 같은 언어처럼, `enum`은 값의 집합에 더 나은 이름을 붙여줄 수 있습니다.

```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

기본적으로, `enum`은 `0`부터 시작하여 멤버들의 번호를 매깁니다.
멤버 중 하나의 값을 수동으로 설정하여 번호를 바꿀 수 있습니다.
예를 들어, 위 예제를 `0`대신 `1`부터 시작해 번호를 매기도록 바꿀 수 있습니다.

```ts
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

또는, 모든 값을 수동으로 설정할 수 있습니다:

```ts
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

`enum`의 유용한 기능 중 하나는 매겨진 값을 사용해 enum 멤버의 이름을 알아낼 수 있다는 것입니다.
예를 들어, 위의 예제에서 `2`라는 값이 위의 어떤 `Color` enum 멤버와 매칭되는지 알 수 없을 때, 이에 일치하는 이름을 알아낼 수 있습니다:

```ts
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // 값이 2인 'Green'이 출력됩니다.
```

# Any

애플리케이션을 만들 때, 알지 못하는 타입을 표현해야 할 수도 있습니다.
이 값들은 동적인 콘텐츠에서 올 수도 있습니다. 예) 사용자로부터 받은 데이터. 혹은 3rd party library.
이 경우 타입 검사를 하지 않고, 그 값들이 컴파일 시간에 검사를 통과하길 원합니다.
이를 위해, `any` 타입을 사용할 수 있습니다:

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 성공, 분명히 부울입니다.
```

`any` 타입은 기존에 JavaScript로 작업할 수 있는 강력한 방법으로, 컴파일 중에 점진적으로 타입 검사를 하거나 하지 않을 수 있습니다.
혹 다른 언어에서 그렇듯, `Object`가 비슷한 역할을 할 수 있을 것 같다고 생각할 수도 있습니다.
그런데, `Object`로 선언된 변수들은 오직 어떤 값이든 그 변수에 할당할 수 있게 해주지만 실제로 메서드가 존재하더라도, 임의로 호출할 수는 없습니다:

```ts
let notSure: any = 4;
notSure.ifItExists(); // 성공, ifItExists 는 런타임엔 존재할 것입니다.
notSure.toFixed(); // 성공, toFixed는 존재합니다. (하지만 컴파일러는 검사하지 않음)

let prettySure: Object = 4;
prettySure.toFixed(); // 오류: 프로퍼티 'toFixed'는 'Object'에 존재하지 않습니다.
```

> Note: [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#general-types)에 설명 했듯이 `Object`를 no-primitive `object` 대신에 사용하지 마세요.

또한, any 타입은 타입의 일부만 알고 전체는 알지 못할 때 유용합니다.
예를 들어, 여러 다른 타입이 섞인 배열을 다룰 수 있습니다.

```ts
let list: any[] = [1, true, "free"];

list[1] = 100;
```

# Void

`void`는 어떤 타입도 존재할 수 없음을 나타내기 때문에, `any`의 반대 타입 같습니다.
`void`는 보통 함수에서 반환 값이 없을 때 반환 타입을 표현하기 위해 쓰이는 것을 볼 수 있습니다:

```ts
function warnUser(): void {
    console.log("This is my warning message");
}
```

`void`를 타입 변수를 선언하는 것은 유용하지 않은데, 왜냐하면 그 변수에는 `null`(`--strictNullChecks`을 사용하지 않을 때만 해당, 자세한 건 다음 섹션을 참고)또는 `undefined` 만 할당할 수 있기 때문입니다:

```ts
let unusable: void = undefined;
unusable = null; // 성공  `--strictNullChecks` 을 사용하지 않을때만
```

# Null and Undefined

TypeScript는 `undefined` 과 `null` 둘 다 각각 자신의 타입 이름으로 `undefined` , `null`로 사용합니다.
`void`처럼 그 자체로 유용한 경우는 거의 없습니다:

```ts
// 이 밖에 이 변수들에 할당할 수 있는 값이 없습니다!
let u: undefined = undefined;
let n: null = null;
```

기본적으로 `null` 과 `undefined`는 다른 모든 타입의 하위 타입니다.
이건, null과 undefined를 `number` 같은 타입에 할당할 수 있다는 것을 의미합니다.

하지만, `--strictNullChecks`를 사용하면, `null`과  `undefined`는 오직 `any`와 각자 자신들 타입에만 할당 가능합니다. (예외적으로 `undefined`는 `void`에 할당 가능합니다)
이건 많은 일반적인 에러를 방지하는 데 도움을 줍니다.
이 경우, `string` 또는 `null` 또는 `undefined`를 허용하고 싶은 경우 유니언 타입인 `string | null | undefined`를 사용할 수 있습니다.

유니언 타입은 상급 주제로, 이후 챕터에서 다룹니다.

> As a note: 가능한 경우 `--structNullChecks`를 사용할 것을 권장합니다. 하지만 핸드북의 목적에 따라, 사용하지 않는다고 가정합니다.

# Never

`never` 타입은 절대 발생할 수 없는 타입을 나타냅니다.
예를 들어, `never`는 함수 표현식이나 화살표 함수 표현식에서 항상 오류를 발생시키거나 절대 반환하지 않는 반환 타입으로 쓰입니다.
변수 또한 타입 가드에 의해 아무 타입도 얻지 못하게 좁혀지면 `never` 타입을 얻게 될 수 있습니다.

`never`타입은 모든 타입에 할당 가능한 하위 타입입니다. 하지만 어떤 타입도 `never`에 할당할 수 있거나, 하위 타입이 아닙니다.(`never` 자신은 제외)
심지어 `any` 도 `never`에 할당할 수 없습니다.

`never`를 반환하는 몇 가지 예제입니다:

```ts
// never를 반환하는 함수는 함수의 마지막에 도달할 수 없다.
function error(message: string): never {
    throw new Error(message);
}

// 반환 타입이 never로 추론된다.
function fail() {
    return error("Something failed");
}

// never를 반환하는 함수는 함수의 마지막에 도달할 수 없다.
function infiniteLoop(): never {
    while (true) {
    }
}
```

# 객체 (Object)

`object`는 원시 타입이 아닌 타입을 나타냅니다. 예를 들어, `number`, `string`, `boolean`, `bigint`, `symbol`, `null`, 또는 `undefined` 가 아닌 나머지를 의미합니다.

`object` 타입을 쓰면, `Object.create` 같은 API 가 더 잘 나타납니다. 예를 들어:

```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // 성공
create(null); // 성공

create(42); // 오류
create("string"); // 오류
create(false); // 오류
create(undefined); // 오류
```

# 타입 단언 (Type assertions)

가끔, TypeScript보다 개발자가 값에 대해 더 잘 알고 일을 때가 있습니다.
대개, 이런 경우는 어떤 엔티티의 실제 타입이 현재 타입보다 더 구체적일 때 발생합니다.

*타입 단언(Type assertions)* 은 컴파일러에게 "날 믿어, 난 내가 뭘 하고 있는지 알아"라고 말해주는 방법입니다.
`타입 단언`은 다른 언어의 타입 변환(형 변환)과 유사하지만, 다른 특별한 검사를 하거나 데이터를 재구성하지는 않습니다.
이는 런타임에 영향을 미치지 않으며, 온전히 컴파일러만 이를 사용합니다.
타입 스크립트는 개발자가 필요한 어떤 특정 검사를 수행했다고 인지합니다.

타입 단언에는 두 가지 형태가 있습니다.
하나는, "angle-bracket" 문법입니다:

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

다른 하나는 `as`-문법 입니다.

```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

위 두 예제는 동일합니다.
어떤 것을 사용할지는 주로 선호에 따른 선택입니다. 하지만 TypeScript를 JSX와 함께 사용할 때는, `as`-스타일의 단언만 허용됩니다.

# `let`에 관하여

지금까지 더 익숙할 수도 있는 JavaScript의 `var` 키워드 대신 `let` 키워드를 이용했다는 걸 알 수 있습니다.
`let` 키워드는 JavaScript ES2015에서 소개되었고, `var`보다 안전하다는 이유로, 현재 표준으로 여겨지고 있습니다.
나중에 더 자세히 살펴보겠지만, 대부분의 JavaScript의 문제들이 `let`을 사용해서 해결되며, 때문에 가능한 경우 최대한 `var`대신 `let`을 사용하셔야 합니다.
