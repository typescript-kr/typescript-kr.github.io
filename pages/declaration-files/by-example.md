# 소개 (Introduction)

이 가이드는 양질의 선언 파일을 작성하는 방법을 설명하기 위해 작성되었습니다.
이 가이드는 일부 API 문서를 해당 API 사용 예시와 함께 보여주고,
  상응하는 선언을 작성하는 방법을 설명합니다.

예제는 대체로 후반부로 갈수록 복잡해집니다.

* [전역 변수 (Global Variables)](#전역-변수-global-variables)
* [전역 함수 (Global Functions)](#전역-함수-global-functions)
* [프로퍼티를 갖는 객체 (Objects with Properties)](#프로퍼티를-갖는-객체-objects-with-properties)
* [오버로드된 함수 (Overloaded Function)](#오버로드된-함수-overloaded-functions)
* [재사용 가능한 타입 (인터페이스) (Reusable Types (Interfaces))](#재사용-가능한-타입-인터페이스-reusable-types-interfaces)
* [재사용 가능한 타입 (타입 별칭) (Reusable Types (Type Aliases))](#재사용-가능한-타입-타입-별칭-reusable-types-type-aliases)
* [타입 구조화하기 (Organizing Types)](#타입-구조화하기-organizing-types)
* [클래스 (Classes)](#클래스-classes)

# 예제 (The Examples)

## 전역 변수 (Global Variables)

*문서*

> 전역 변수 `foo`는 존재하는 위젯의 수를 포함합니다.

*코드*

```ts
console.log("Half the number of widgets is " + (foo / 2));
```

*선언*

변수를 선언하기 위해 `declare var`를 사용하세요.
만약 변수가 읽기-전용이라면, `declare const`를 사용하세요.
변수가 블록-스코프인 경우 `declare let` 또한 사용할 수 있습니다.

```ts
/** 존재하는 위젯의 수 */
declare var foo: number;
```

## 전역 함수 (Global Functions)

*문서*

> 사용자에게 인사말을 보여주기 위해 `greet` 함수를 호출할 수 있습니다.

*코드*

```ts
greet("hello, world");
```

*선언*

함수를 선언하기 위해 `declare function`을 사용하세요.

```ts
declare function greet(greeting: string): void;
```

## 프로퍼티를 갖는 객체 (Objects with Properties)

*문서*

> 전역 변수 `myLib`에는 인사말을 만드는 함수 `makeGreeting`와,
> 지금까지 생성한 인사말의 수를 가리키는 `numberOfGreetings` 프로퍼티가 있습니다.

*코드*

```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

*선언*

점 표기법으로 접근하는 타입이나 값을 설명하기 위해 `declare namespace`를 사용하세요.

```ts
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}
```

## 오버로드된 함수 (Overloaded Functions)

*문서*

`getWidget` 함수는 숫자를 인자로 받아 Widget을 반환하거나, 문자열을 인자로 받아 Widget 배열을 반환합니다.

*코드*

```ts
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```

*선언*

```ts
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## 재사용 가능한 타입 (인터페이스) (Reusable Types (Interfaces))

*문서*

> greeting을 명시할 때, 반드시 `GreetingSettings` 객체를 전달해야 합니다.
> 이 객체는 다음의 프로퍼티를 갖고 있습니다:
>
> 1 - greeting: 필수 문자열
>
> 2 - duration: 선택적 시간 (밀리초)
>
> 3 - color: 선택적 문자열, 예. '#ff00ff'

*코드*

```ts
greet({
  greeting: "hello world",
  duration: 4000
});
```

*선언*

프로퍼티를 갖는 타입을 정의하기 위해 `interface`를 사용하세요.

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

## 재사용 가능한 타입 (타입 별칭) (Reusable Types (Type Aliases))

*문서*

> 인사말이 예상되는 어느 곳에나, `string`, `string`을 반환하는 함수, 또는 `Greeter` 인스턴스를 전달할 수 있습니다.

*코드*

```ts
function getGreeting() {
    return "howdy";
}
class MyGreeter extends Greeter { }

greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

*선언*

타입에 대한 약칭으로 타입 별칭을 사용할 수 있습니다:

```ts
type GreetingLike = string | (() => string) | Greeter;

declare function greet(g: GreetingLike): void;
```

## 타입 구조화하기 (Organizing Types)

*문서*

> `greeter` 객체는 파일에 로그를 작성하거나 경고 창을 띄울 수 있습니다.
> 로그 옵션을 `.log(...)` 내부에, 경고 창 옵션을 `.alert(...)` 내부에 전달할 수 있습니다.

*코드*

```ts
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```

*선언*

타입을 구조화하기 위해 네임스페이스를 사용하세요.

```ts
declare namespace GreetingLib {
    interface LogOptions {
        verbose?: boolean;
    }
    interface AlertOptions {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```

중첩된 네임스페이스를 하나의 선언으로 만들 수 있습니다:

```ts
declare namespace GreetingLib.Options {
    // Refer to via GreetingLib.Options.Log
    interface Log {
        verbose?: boolean;
    }
    interface Alert {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```

## 클래스 (Classes)

*문서*

> `Greeter` 객체를 인스턴스화해서 greeter를 생성하거나, 이 객체를 상속해서 커스텀 greeter를 생성할 수 있습니다.

*코드*

```ts
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
    constructor() {
        super("Very special greetings");
    }
}
```

*선언*

클래스 혹은 클래스-같은 객체를 설명하기 위해 `declare class`를 사용하세요.
클래스는 생성자 뿐만 아니라 프로퍼티와 메서드를 가질 수 있습니다.

```ts
declare class Greeter {
    constructor(greeting: string);

    greeting: string;
    showGreeting(): void;
}
```

<!-- Template

##

*Documentation*
>

*Code*

```ts

```

*Declaration*

```ts

```

-->
