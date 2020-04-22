# 소개 (Introduction)

함수는 JavaScript로 된 모든 애플리케이션에서의 기본적인 구성 요소입니다.
JavaScript 함수는 추상화 계층을 구축하거나 클래스 모방, 정보 은닉, 모듈에 대한 방법을 제공합니다.
TypeScript에는 클래스, 네임스페이스, 모듈이 있지만, 함수는 여전히 이 일을 어떻게 *할 것인지*를 설명하는 데 있어 핵심 역할을 수행합니다.
TypeScript에서는 표준 JavaScript 함수가 작업을 수월하게 하도록 몇 가지 새로운 기능을 추가합니다.

# 함수 (Function)

TypeScript 함수는 JavaScript와 마찬가지로 기명 함수(named function)과 익명 함수(anonymous function)로 만들 수 있습니다.
이를 통해 API에서 함수 목록을 작성하든 일회성 함수를 써서 다른 함수로 전달하든 애플리케이션에 가장 적합한 방법을 선택할 수 있습니다.

JavaScript에서의 이 두 가지 방법에 대한 예시를 빠르게 다시 보겠습니다:

```js
// 기명 함수
fucntion add(x, y) {
  return x + y;
}

// 익명 함수
let myAdd = function(x, y) { return x + y };
```

JavaScript에서처럼, 함수는 함수 외부의 변수를 참조할 수 있습니다.
이런 경우를, 변수를 *캡처(capture)* 한다고 합니다.
이것이 어떻게 작동하는지 (그리고 이 기술을 사용할 때의 장단점)를 이해하는 것은 이 본문의 주제를 벗어나는 것이지만, 이 메커니즘이 어떻게 작동하는지에 대한 확실한 이해는 JavaScript 및 TypeScript를 사용하는 데 있어 중요합니다.

```js
let z = 100;

function addToZ(x, y) {
  return x + y + z;
}
```

# 함수 타입 (Function Types)

## 함수의 타이핑 (Typing the function)

이전에 사용했던 예시에 타입을 더해보겠습니다.

```ts
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y };
```

각 파라미터와 함수 자신의 반환될 타입을 정해줄 수 있습니다.
TypeScript는 반환 문을 보고 반환 타입을 파악할 수 있으므로 반환 타입을 생략할 수 있습니다.

## 함수 타입 작성하기 (Writing the function type)

함수에 타입을 붙였으니, 이제 함수 타입들을 살펴보고 함수의 전체 타입을 작성해 봅시다.

```ts
let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };
```

함수의 타입은 매개변수의 타입과 반환 타입이 있습니다.
전체 함수 타입을 작성하고자 한다면 이 두 가지 타입이 필요합니다.
매개변수 목록처럼 각 매개변수에 이름과 타입 타입을 작성해 줍시다.
작성하는 이름은 가독성을 위한 것입니다.
위의 코드 대신 이렇게 쓸 수도 있습니다:

```ts
let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };
```

매개변수의 타입들이 올바르게 나열되어 있다면 함수 타입에 이름을 붙이더라도 유효한 타입으로 간주합니다.

두 번째로 반환 타입입니다.
매개변수 타입들과 반환 타입 사이에 '화살표 표기'( `=>` )를 써서 반환 타입을 분명히 할 수 있습니다.
이전에 언급했듯이, 함수 표기에 필요한 부분입니다, 그래서 만약 함수가 값을 반환하지 않는다면 비워두는 대신 `void`를 써서 표시합니다.

참고로, 매개변수 타입과 반환 타입만이 함수 타입을 구성합니다.
캡처된 변수는 타입에 반영되지 않습니다.
사실상 캡처된 변수는 함수의 "숨겨진 상태"의 일부이고 API를 구성하지 않습니다.

## 타입의 추론 (Inferring the types)

아래 예시를 직접 입력해보세요. TypeScript 컴파일러가 방정식의 한쪽에만 타입이 있더라도 타입을 알아낼 수 있다는 것을 알아채셨나요?


```ts
// myAdd는 전체 함수 타입을 가집니다
let myAdd = function(x: number, y: number): number { return  x + y; };

// 매개변수 x 와 y는 number 타입을 가집니다
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

이러한 타입 추론 형태를 `"contextual typing"` 이라 부릅니다.
이를 통해 여러분의 프로그램에서 타입을 유지하기 위한 노력을 줄일 수 있습니다.

# 선택적 매개변수와 기본 매개변수 (Optional and Default Parameter)

TypeScript에서는 모든 매개변수가 함수에 필요하다고 가정합니다.
이것이 `null` 이나 `undefined`를 줄 수 없다는 걸 의미하는 것은 아닙니다. 대신 함수가 호출될 때, 컴파일러는 각 매개변수에 대해 사용자가 값을 제공했는지를 검사합니다.
또한, 컴파일러는 매개변수들이 함수로 전달될 유일한 매개변수라고 가정합니다. 요약하자면, 함수에 주어진 인자의 수는 함수가 기대하는 매개변수의 수와 일치해야 합니다.

```ts
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 오류, 너무 적은 매개변수
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 정확함

```

JavaScript에서는 모든 매개변수가 선택적이고, 사용자는 적합하다고 생각하면 그대로 둘 수 있습니다.
그렇게 둔다면 그 값은 `undefined`가 됩니다.
TypeScript에서도 선택적 매개변수를 원한다면 매개변수 이름 끝에 `?` 를 붙임으로써 해결할 수 있습니다.
그 예시로 성을 선택적 매개변수로 하는 경우를 들어보겠습니다:

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");                  // 지금은 바르게 동작
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 정확함
```

어느 선택적 매개변수든 반드시 매개변수 정의가 필요합니다.
lastName 대신 firstName을 선택적으로 하고 싶다면 매개변수의 순서를 변경해야 합니다.

TypeScript에서는 유저가 값을 제공하지 않거나 `undefined`로 했을 때에 할당될 매개변수의 값을 정해 놓을 수도 있습니다.
이것을 `기본-초기화 매개변수`라고 합니다.
이전 예시에서 lastName을 `"Smith"` 라고 지정해 보겠습니다.

```ts
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 올바르게 동작, "Bod Smith" 반환
let result2 = buildName("Bob", undefined);       // 여전히 동작, 역시 "Bob Smith" 반환
let result3 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result4 = buildName("Bob", "Adams");         // 정확함
```

모든 필수 매개변수 뒤에 오는 `기본-초기화 매개변수`는 선택적으로 처리되며, 선택적 매개변수와 마찬가지로 해당 함수를 호출할 때 생략할 수 있습니다.
이는 선택적 매개변수와 뒤따르는 기본 매개변수의 타입들이 공통성을 공유함을 의미합니다, 그래서 이 두 가지

```ts
function buildName(firstName: string, lastName?: string) {
    // ...
}
```

와

```ts
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```

는 `(firstName: string, lastName?: string) => string` 라는 공통된 타입을 공유합니다.
`lastName`의 기본값은 타입에서 사라지고 오직 선택적 매개변수라는 사실만 남깁니다.

순수한 선택적 매개변수와는 다르게 `기본-초기화 매개변수`는 필수 매개변수 뒤에 오는 것이 강요되지 않습니다.
만약 `기본-초기화 매개변수`가 필수 매개변수보다 앞에 오게 된다면 사용자가 명시적으로 `undefined` 를 전달해 주어야 `기본-초기화 매개변수`를 볼 수 있습니다.
앞서 사용했던 예시에 기본 초기화를 `firstName`에 적용한 것입니다:

```ts
function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 오류, 너무 적은 매개변수
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 성공, "Bob Adams" 반환
let result4 = buildName(undefined, "Adams");     // 성공, "Will Adams" 반환
```

# 나머지 매개변수 (Rest Parameters)

필수, 선택적, 기본 매개변수는 한 번에 하나의 매개변수만을 가지고 이야기합니다.
때로는 다수의 매개변수를 그룹 지어 작업하기를 원하거나, 함수가 최종적으로 얼마나 많은 매개변수를 취할지 모를 때도 있을 것입니다.
JavaScript에서는 모든 함수 내부에 위치한 `arguments`라는 변수를 사용해 직접 인자를 가지고 작업할 수 있습니다.

TypeScript에서는 이 인자들을 하나의 변수로 모을 수 있습니다:

```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

// employeeName 은 "Joseph Samuel Lucas MacKinzie" 가 될것입니다.
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

*나머지 매개변수*는 선택적 매개변수들의 수를 무한으로 취급합니다.
나머지 매개변수로 인자들을 넘겨줄 때는 당신이 원하는 만큼 넘겨 줄 수도 있습니다; 아무것도 넘겨주지 않을 수도 있습니다.
컴파일러는 생략 부호 (`...`) 뒤의 이름으로 전달된 인자 배열을 빌드하여 함수에서 사용할 수 있도록 합니다.

생략 부호는 나머지 매개변수가 있는 함수의 타입에도 사용됩니다:

```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

# this

`this` 가 JavaScript에서 어떻게 쓰이는지 아는 것은 일종의 통과의례입니다.
TypeScript는 JavaScript의 상위 집합이므로 TypeScript 개발자들 역시 this가 어떻게 쓰이는지 또는 this가 잘못 쓰일 때를 발견하는 방법을 배울 필요가 있습니다.
다행히도 TypeScript는 몇 가지 기술들로 잘못된 `this` 사용을 잡아낼 수 있습니다.
만약 JavaScript에서 this가 어떻게 동작하는지 알고 싶다면 먼저 Yehuda Katz의 글 [JavaScript 함수 호출과 "this" 이해하기](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) 을 읽도록 합니다.
Yehuda의 글은 `this`의 내부 동작을 아주 잘 설명하므로, 여기서는 기본만 다룰 것입니다.

## `this`와 화살표 함수 (this and arrow functions)

JavaScript에서, `this`는 함수가 호출될 때 정해지는 변수입니다.
매우 강력하고 유연한 기능이지만 이것은 항상 함수가 실행되는 콘텍스트에 대해 알아야 한다는 수고가 생깁니다.
특히 함수를 반환하거나 인자로 넘길 때의 혼란스러움은 악명 높습니다.

예시를 봅시다:

```ts
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

`createCardPicker`가 자기 자신을 반환하는 함수임을 주목해 주세요.
이 예제를 작동시키면 기대했던 경보 창 대신 오류가 발생할 것입니다.
`createCardPicker`에 의해 생성된 함수에서 사용 중인 `this`가 `deck` 객체가 아닌 `window`에 설정되었기 때문입니다.
`cardPicker()`의 자체적인 호출 때문에 생긴 일입니다.
최상위 레벨에서의 비-메서드 문법의 호출은 `this`를 `window`로 합니다.
(Note: strict mode에서는 `this`가 `window` 대신 `undefined` 가 됩니다. )

이 문제는 나중에 사용할 함수를 반환하기 전에 바인딩을 알맞게 하는 것으로 해결할 수 있습니다.
이 방법대로라면 나중에 사용하는 방법에 상관없이 원본 `deck` 객체를 계속해서 볼 수 있습니다.
이를 위해, 함수 표현식을 ES6의 화살표 함수로 바꿀 것입니다.
화살표 함수는 함수가 호출 된 곳이 아닌 함수가 생성된 쪽의 `this`를 캡처합니다:

```ts
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // NOTE: 아랫줄은 화살표 함수로써, 'this'를 이곳에서 캡처할 수 있도록 합니다
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

`--noImplicitThis` 플래그를 컴파일러에 전달하는 실수를 하게 된다면 TypeScript는 경고를 표시할 것입니다.
`this.suits[pickedSuit]` 의 `this`는 `any` 타입인 것을 짚고 넘어가겠습니다.

## `this` 매개변수 (this parameter)

불행히도 `this.suits[pickedSuit]`의 타입은 여전히 `any`입니다.
`this`가 객체 리터럴 내부의 함수에서 왔기 때문입니다.
이것을 고치기 위해 명시적으로 `this` 매개변수를 줄 수 있습니다.
`this` 매개변수는 함수의 매개변수 목록에서 가장 먼저 나오는 가짜 매개변수입니다.

```ts
function f(this: void) {
    // 독립형 함수에서 `this`를 사용할 수 없는 것을 확인함
}
```

명확하고 재사용하기 쉽게 `Card`와 `Deck` 두 가지 인터페이스 타입들을 예시에 추가해 보겠습니다.

```ts
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: 아래 함수는 이제 callee가 반드시 Deck 타입이어야 함을 명시적으로 지정합니다.
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

이제 TypeScript는 `createCardPicker`가 `Deck` 객체에서 호출된다는 것을 알게 됐습니다.
이것은 `this`가 `any` 타입이 아니라 `Deck` 타입이며 따라서 `--noImplicitThis` 플래그가 어떤 오류도 일으키지 않는다는 것을 의미합니다.

### 콜백에서 `this` 매개변수 (`this` parameters in callbacks)

나중에 호출할 콜백 함수를 라이브러리에 전달할 때 `this` 때문에 오류가 발생할 수 있습니다.
라이브러리는 콜백을 일반 함수처럼 호출하므로 `this`는 `undefined`가 됩니다.
일부 작업에서는 `this` 매개변수를 콜백 오류를 막는데 사용할 수 있습니다.
먼저 라이브러리 작성자는 콜백 타입을 `this`로 표시를 해주어야 합니다.

```ts
interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

`this: void`는 `addClickListener`가 `onclick`이 `this`타입을 요구하지 않는 함수가 될 것으로 예상하는 것을 의미합니다.
두 번째로, 호출 코드를 `this`로 표시합니다.

```ts
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // 이런, `this`가 여기서 쓰이는군요. 이 콜백을 쓰면 런타임에서 충돌을 일으키겠군요
        this.info = e.message;
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // 오류!
```

`this`로 표시를 한 상태에서 `onClickBad`가 반드시 `Handler`의 인스턴스로써 호출되어야 함을 명시해 주어야 합니다.
그러면 TypeScript는 `addClickListener`가 `this: void`를 갖는 함수를 필요로 한다는 것을 감지합니다.
오류를 고치기 위해 `this`의 타입을 바꿔줍니다:

```ts
class Handler {
    info: string;
    onClickGood(this: void, e: Event) {
        // void 타입이기 때문에 this는 이곳에서 쓸 수 없습니다!
        console.log('clicked!');
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

`onClickGood`이 `this` 타입을 `void`로 지정하고 있기 때문에 `addClickListener`로 넘겨지는데 적합합니다.
물론, 이것이 `this.info`를 쓸 수 없는 것을 의미하기도 합니다.
만약 당신이 `this.info`까지 원한다면 화살표 함수를 사용해야 할 겁니다:

```ts
class Handler {
    info: string;
    onClickGood = (e: Event) => { this.info = e.message }
}
```

이러한 작업은 화살표 함수가 외부의 `this`를 사용하기 때문에 가능하므로 `this: void`일 것으로 기대하는 무언가라면 전달에 문제가 없습니다.
`Handler` 타입 객체마다 하나의 화살표 함수가 작성된다는 점이 단점입니다.
반면, 메서드들은 하나만 작성되어 `Handler`의 프로토타입에 붙습니다.
그들은 `Handler` 타입의 모든 객체 간에 공유됩니다.

# 오버로드 (Overloads)

JavaScript는 본질적으로 매우 동적인 언어입니다.
하나의 JavaScript 함수가 전달된 인자의 형태에 따라 다른 타입의 객체들을 반환하는 것은 흔한 일입니다.

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
    // 인자가 배열 또는 객체인지 확인
    // 만약 그렇다면, deck이 주어지고 card를 선택합니다.
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // 그렇지 않다면 그냥 card를 선택합니다.
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

여기 사용자가 전달하는 것에 따라 두 가지 다른 결과를 반환하는 함수가 있습니다.
사용자가 deck을 의미하는 객체 값을 전달한다면 함수가 카드를 선택합니다.
사용자가 카드를 선택하면 선택한 카드가 무엇인지 대답해 줍니다.
하지만 타입 시스템에서 이것을 어떻게 구현할 것입니까?

정답은 오버로드 목록으로 동일한 함수에 다중 함수 타입을 제공하는 것입니다.
오버로드 목록은 컴파일러가 함수 호출들을 해결할 때 사용하는 것입니다.
오버로드 목록으로 `pickCard`가 동작을 승인하고 반환하는 것을 구현해 봅시다:

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // 인자가 배열 또는 객체인지 확인
    // 만약 그렇다면, deck이 주어지고 card를 선택합니다.
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // 그렇지 않다면 그냥 card를 선택합니다.
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

이 변화를 통해, 오버로드는 `pickCard` 함수에 대해 타입 검사 호출을 제공합니다.

컴파일러가 알맞은 타입 검사를 하기 위해서, JavaScript와 비슷한 프로세스를 따릅니다.
오버로드 목록에서 첫 번째 오버로드를 진행하면서 제공된 매개변수를 사용하여 함수를 호출하려고 시도합니다.
만약 일치하게 된다면 해당 오버로드를 알맞은 오버로드로 선택하여 작업을 수행합니다.
이러한 이유로 가장 구체적인 것부터 오버로드 리스팅을 하는 것이 일반적입니다.

위 예제에서 `function pickCard(x): any`는 오버로드 목록에 해당되지 않음을 유의하세요, 그래서 두 가지 오버로드만을 가집니다: 객체를 받는것 하나와 숫자를 받는 것 하나.
다른 매개변수 타입으로 `pickCard`를 호출하는 것은 오류가 발생합니다.
