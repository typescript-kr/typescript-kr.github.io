TypeScript로 간단한 웹 애플리케이션 만들기를 시작해봅시다.

## TypeScript 설치하기 (Installing TypeScript)

TypeScript를 설치하는 방법은 크게 두가지입니다:

-   NPM을 통해 설치 (Node.js 패키지 매니저)
-   TypeScript의 Visual Studio 플러그인 설치

Visual Studio 2017 및 Visual Studio 2015 Update 3에는 기본적으로 TypeScript가 포함되어 있습니다.
Visual Studio와 함께 TypeScript를 설치하지 않았다면 [다운로드](#download-links)할 수 있습니다.

NPM 사용자의 경우:

```shell
> npm install -g typescript
```

## 첫번째 TypeScript 파일 만들기 (Building your first TypeScript file)

편집기에서 `greeter.ts`파일을 만들고 다음 JavaScript 코드를 입력하십시오:

```ts
function greeter(person) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.innerHTML = greeter(user);
```

## 코드 컴파일하기 (Compiling your code)

우리는 `.ts` 확장자를 사용했지만, 이 코드는 그냥 자바스크립트입니다.
기존 자바스크립트 앱에서 바로 복사 / 붙여넣기 할 수 있습니다.

명령줄에서 TypeScript 컴파일러를 실행합니다:

```shell
tsc greeter.ts
```

결과는 동일한 자바스크립트를 포함하고있는 `greeter.js` 파일이 될 것입니다.
JavaScript 애플리케이션에서 TypeScript를 실행 중입니다!

이제 TypeScript가 제공하는 새로운 기능들을 활용할 수 있습니다.
다음과 같이 'person' 함수의 인수에 `: string` 타입 어노테이션을 추가하십시오:

```ts
function greeter(person: string) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.innerHTML = greeter(user);
```

## 타입 어노테이션 (Type annotations)

TypeScript의 타입 어노테이션은 함수 또는 변수의 의도된 계약을 적는 간단한 방법입니다.
이 경우 greeter 함수를 단일 문자열 매개변수로 호출하려고 합니다.
여기서 우리는 greeter 함수에 문자열 대신 배열을 전달하여 호출할 수도 있을 것입니다:

```ts
function greeter(person: string) {
    return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.innerHTML = greeter(user);
```

다시 컴파일하면, 오류가 표시됩니다.

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

마찬가지로, greeter를 호출할 때 모든 인수를 제거해보십시오.
TypeScript는 예상치 못한 매개변수로 함수를 호출했다는 것을 알려줍니다.
두 경우 모두 TypeScript는 코드 구조와 사용자가 제공한 타입 어노테이션을 기반으로 정적 분석을 제공할 수 있습니다.

에러가 있었음에도 불구하고, `greeter.js` 파일은 여전히 생성됩니다.
코드에 오류가 있어도 TypeScript를 사용할 수 있습니다. 그러나 이 경우에 TypeScript는 코드가 예상대로 실행되지 않을 것이라고 경고합니다.

## 인터페이스 (Interfaces)

예제를 더 발전시켜 봅시다. 여기서는 firstName 및 lastName 필드가 있는 객체를 설명하는 인터페이스를 사용합니다.
TypeSciprt에서는 두가지 타입이 내부 구조가 호환되면 호환됩니다.
이것은 명시적으로 `implements` 구문 없이 인터페이스가 요구하는 형태를 가짐으로써 인터페이스를 구현할 수 있게 해줍니다.

```ts
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

## 클래스 (Classes)

마지막으로 클래스를 사용하여 예제를 확장해 보겠습니다.
TypeScript는 클래스 기반 객체 지향 프로그래밍과 같은 JavaScript의 새로운 기능을 지원합니다.

여기서는 생성자와 몇 개의 public 필드를 사용하여 `Student` 클래스를 생성 할 것입니다.
클래스와 인터페이스가 잘 작동하여 프로그래머가 올바른 수준의 추상화를 결정할 수 있습니다.

또한 생성자에 대한 인수에 `public` 을 사용하는 것은 그 이름으로 속성을 자동으로 생성 할 수 있는 단축형태입니다.

```ts
class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

`tsc greeter.ts` 를 다시 실행하면 생성된 JavaScript가 이전 코드와 동일하다는 것을 알 수 있습니다.
TypeScript의 클래스는 JavaScript에서 자주 사용되는 것과 동일한 프로토 타입 기반 OO의 줄임말입니다.

## TypeScript 웹 앱 실행하기 (Running your TypeScript web app)

이제 `greeter.html` 에 다음을 입력하십시오:

```html
<!DOCTYPE html>
<html>
    <head><title>TypeScript Greeter</title></head>
    <body>
        <script src="greeter.js"></script>
    </body>
</html>
```

첫번째 간단한 TypeScript 웹 애플리케이션을 실행하기 위해 브라우저에서 `greeter.html` 을 여십시오!

옵션 : Visual Studio에서 `greeter.ts` 를 열거나 코드를 TypeScript 플레이그라운드로 복사하십시오.
식별자 위로 마우스를 가져가면 타입을 볼 수 있습니다.
경우에 따라 이러한 타입이 자동으로 추론됩니다.
마지막 줄을 다시 입력하고 DOM 요소의 타입에 따라 완료 목록 및 매개변수 도움말을 확인하십시오.
greeter 함수에 대한 참조에 커서를 놓고 F12 키를 눌러 해당 정의로 이동할 수 있습니다.
기호를 마우스 오른쪽 버튼으로 클릭하고 리팩토링을 사용하여 심볼의 이름을 바꿀 수 있습니다.

제공된 타입 정보는 애플리케이션 규모에서 JavaScript로 작업할수 있는 도구와 함께 작동합니다.
TypeScript에서 가능한 모든 예제는 웹 사이트의 샘플 섹션을 참조하십시오.

![Visual Studio picture](https://www.typescriptlang.org/assets/images/docs/greet_person.png)
