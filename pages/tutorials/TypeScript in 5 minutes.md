Typescript로 간단한 웹 애플리케이션을 만들어 보겠습니다.

## TypeScript 설치하기 (Installing TypeScript)

TypeScript를 설치하는 방법에는 크게 두 가지가 있습니다:

* npm을 이용한 설치 (Node.js 패키지 매니저)
* TypeScript의 Visual Studio 플러그인 설치

Visual Studio 2017과 Visual Studio 2015 Update 3는 기본적으로 Typescript를 포함하고 있습니다.
만약 TypeScript를 Visual Studio과 함께 설치하지 않았다면 [이곳에서 다운로드](/#download-links)할 수 있습니다.

NPM 사용자의 경우:

```shell
> npm install -g typescript
```

## 첫 번째 TypeScript 파일 만들기 (Building your first TypeScript file)

에디터에서, `greeter.ts` 파일에 다음의 JavaScript 코드를 입력하세요:

```ts
function greeter(person) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 코드 컴파일하기 (Compiling your code)

`.ts` 확장자를 사용했지만, 이 코드는 아직 일반 JavaScript 코드입니다.
기존의 JavaScript 앱에서 이 코드를 바로 복사하여 붙여 넣을 수 있습니다.

커맨드 라인에서 TypeScript 컴파일러를 실행하세요:

```shell
tsc greeter.ts
```

결과는 동일한 JavaScript 코드를 포함하고 있는 `greeter.js` 파일이 될 것입니다.
JavaScript 앱에서 TypeScript를 사용하여 시작했습니다!

이제 TypeScript가 제공하는 몇 가지 새로운 기능을 이용할 수 있습니다.
다음과 같이 `: string` 타입 표기를 'person' 함수의 인수에 추가하세요.

```ts
function greeter(person: string) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 타입 표기 (Type annotations)

TypeScript의 타입 표기는 함수나 변수의 의도된 계약을 기록하는 간단한 방법입니다.
아래의 경우, greeter 함수를 단일 문자열 매개변수와 함께 호출하려고 합니다.
우리는 greeter 함수 호출 시 매개변수로 배열을 전달하도록 변경해 볼 수 있습니다:

```ts
function greeter(person: string) {
    return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

다시 컴파일하면, 오류가 발생한 것을 볼 수 있습니다:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

마찬가지로, greeter 함수 호출에서 모든 인수를 제거해보세요.
TypeScript는 당신이 예상치 못한 개수의 매개변수로 이 함수를 호출했다는 것을 알려줄 것입니다.
두 경우 모두, TypeScript는 코드의 구조와 타입 표기에 기반해서 정적 분석을 제공합니다.

오류가 존재하기는 하지만, `greeter.js` 파일은 생성되었습니다.
코드에 오류가 존재하더라도 TypeScript를 사용할 수 있습니다. 그러나 TypeScript는 코드가 예상대로 작동하지 않을 것이라는 경고를 하게 됩니다.

## 인터페이스 (Interfaces)

예제를 더 발전시켜 보겠습니다. 여기서는 firstName 및 lastName 필드를 갖고 있는 객체를 나타내는 인터페이스를 사용합니다.
TypeScript에서, 내부 구조가 호환되는 두 타입은 서로 호환 됩니다.
그래서 명시적인 `implements` 절 없이, 인터페이스가 요구하는 형태를 사용하는 것만으로도 인터페이스를 구현할 수 있습니다.

```ts
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## 클래스 (Classes)

마지막으로, 클래스를 사용하여 예제를 확장해 보겠습니다.
TypeScript는 클래스 기반 객체 지향 프로그래밍 지원과 같은 JavaScript의 새로운 기능을 지원합니다.

생성자와 public 필드를 사용해 `Student` 클래스를 만들겠습니다.
클래스와 인터페이스가 잘 작동하여, 프로그래머가 올바른 추상화 수준을 결정할 수 있게 해준다는 점을 주목하세요.

또한, 생성자의 인수에 `public`을 사용하는 것은 그 인수의 이름으로 프로퍼티를 자동으로 생성하는 축약형입니다.

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

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

`tsc greeter.ts`를 재실행하면 생성된 JavaScript 코드가 이전의 코드와 동일하다는 것을 알 수 있습니다.
TypeScript의 클래스는 단지 JavaScript에서 자주 사용되는 프로토타입-기반 OO의 축약형일 뿐입니다.

## TypeScript 웹 앱 실행하기 (Running your TypeScript web app)

이제 아래의 코드를 `greeter.html`에 작성하세요:

```html
<!DOCTYPE html>
<html>
    <head><title>TypeScript Greeter</title></head>
    <body>
        <script src="greeter.js"></script>
    </body>
</html>
```

브라우저에서 `greeter.html`을 열어 간단한 첫 번째 TypeScript 웹 앱을 실행해보세요!

옵션: Visual Studio에서 `greeter.js`를 열거나, TypeScript playground에 코드를 복사하세요.
식별자 위에 마우스를 올려놓으면 해당 타입을 볼 수 있습니다.
경우에 따라 타입이 자동으로 추론되기도 한다는 점을 유의하세요.
마지막 행을 다시 입력하고, DOM 요소 타입에 기반한 완료 목록과 매개변수 도움말을 확인하세요.
greeter 함수 참조 위에 커서를 올려놓고, F12 키를 눌러 해당 정의로 이동할 수 있습니다.
또한, 심벌을 마우스 오른쪽 버튼으로 클릭하고 리팩토링을 사용하여 이름을 바꿀 수 있습니다.

제공된 타입 정보는 애플리케이션 규모에서 JavaScript로 작동하는 도구와 함께 작동합니다.
TypeScript와 관련된 더 많은 예시를 보려면, 웹사이트의 Samples 섹션을 참고하세요.

![Visual Studio picture](/assets/images/docs/greet_person.png)
