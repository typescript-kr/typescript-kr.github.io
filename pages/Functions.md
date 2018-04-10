# 소개 (Introduction)

함수는 JavaScript의 모든 애플리케이션을 구성하는 기본 요소입니다.  
클래스는 추상화 계층, 클래스, 정보 은닉 및 모듈을 구축하는 방법입니다.    
TypeScript에서는 클래스와 네임 스페이스 그리고 모듈이 있지만 함수는 그럼에도 불구하고 *작업* 방법을 설명하는 데 중요한 역할을 합니다.  
또한 TypeScript는 표준 JavaScript 기능에 몇가지 새로운 기능을 추가하여 작업을 더 쉽게 해 줍니다.

# 함수 (Functions)

JavaScript와 마찬가지로 TypeScript 함수는 기명 함수 또는 익명 함수로 만들 수 있습니다.  
이를 통해 API의 함수 목록을 작성하든 다른 함수에 전달할 일회성 함수이든 애플리케이션에 가장 적합한 접근 방법을 선택할 수 있습니다.

이 두가지 접근 방식이 JavaScript에서 어떻게 보이는지 빠르게 요약하면:

```ts
// 기명 함수
function add(x, y) {
    return x + y;
}

// 익명 함수
let myAdd = function(x, y) { return x + y; };
```

JavaScript에서와 마찬가지로 함수는 함수 본문 외부의 변수를 참조할 수 있습니다.  
그렇게 할 때 이러한 변수들을 `capture`라고 말합니다.  
이 기법의 사용 방법과 사용할 때의 절충 사항을 이해하는 것은 이번 장의 범위를 벗어나지만  
캡처의 메커니즘이 JavaScript와 TypeScript에 얼마나 중요한 부분인지 확실히 이해해야 합니다.

```ts
let z = 100;

function addToZ(x, y) {
    return x + y + z;
}
```

# 함수의 타입 (Function Types)

## 함수 작성하기 (Typing the function)

앞에서 살펴본 간단한 예제에 타입을 추가해보겠습니다.

```ts
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```

각 매개변수에 타입을 추가 한 다음 함수 자체에 타입을 추가하여 반환 타입을 추가할 수 있습니다.  
TypeScript는 리턴문를 보고 반환 타입을 파악할 수 있기 때문에 대부분 선택적으로 반환 타입을 생략할 수 있습니다.

## 함수 타입 작성하기 (Writing the function type)

이제 함수를 작성했으므로 함수 타입의 각 부분을 살펴보면서 함수의 전체 타입을 작성해보겠습니다.

```ts
let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };
```

함수의 타입은 두개의 파트로 나뉩니다: 인수의 타입과 반환 타입.  
전체 함수 타입을 작성할 때 두 파트가 모두 필요합니다.  
매개변수 타입과 같이 매개변수 목록을 기록하여 각 매개변수에 이름과 타입을 지정합니다.  
이 이름은 가독성을 돕기 위한 것입니다.

위의 코드를 다음과 같이 작성할 수 있습니다:

```ts
let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };
```

매개변수 타입이 정렬되어 있는 한 함수의 타입에 매개변수를 제공하는 이름에 관계 없이 매개변수 타입이 유효한 타입으로 간주됩니다.

두 번째 파트는 반환 타입입니다.  
매개변수와 반환 타입 사이에 굵은 화살표(=>)를 사용하여 반환 타입을 명확하게 합니다.  
앞서 언급한 것처럼 이것은 함수 타입의 필수적인 부분이므로 함수가 값을 반환하지 않는 경우에는 반환 값을 남겨 두지 않고 `void`를 사용합니다.

주의사항, 매개변수와 반환 타입만 함수 타입을 구성합니다.  
캡처된 변수는 타입에 반영되지 않습니다.  
실제로 캡처된 변수는 함수의 "숨겨진 상태"의 일부이며 해당 API를 구성하지 않습니다.

## 타입 추론 (Inferring the types)

예를 들면 TypeScript 컴파일러는 한쪽에는 타입이 있지만 다른 한쪽에 타입이 없는 경우 그 타입을 이해할 수 없다는 것을 알게 됩니다:

```ts
// myAdd는 완벽하게 함수 타입을 가지고 있습니다.
let myAdd = function(x: number, y: number): number { return  x + y; };

// 매개변수 'x'와 'y'에는 number 타입이 있습니다.
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

이것을 타입 추론의 한 종류인 "상황적 타이핑(Contextual Typing)"이라고 합니다.
이를 통해 프로그램을 계속 유지하는 데 드는 노력을 줄일 수 있습니다.

# 선택적 매개변수와 기본 매개변수 (Optional and Default Parameters)

TypeScript에서는 모든 매개변수가 함수에 필요하다고 가정합니다.  
`null` 또는 `undefined`가 주어질 수 없다는 것을 의미하는 것이 아니라 함수가 호출될 때 컴파일러가 각 매개변수에 값을 제공했는지 확인한다는 것입니다.  
또한 컴파일러는 이러한 매개변수들이 함수로 전달되는 유일한 매개변수라고 가정합니다.  
간단히 말해서 함수에 주어진 인수의 수는 그 함수에서 기대하는 매개변수의 수와 일치해야 합니다.

```ts
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 오류, 너무 적은 매개변수
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 아, 딱 맞습니다
```

JavaScript에서 모든 매개변수는 선택 사항이며 매개변수를 원하는 대로 사용하지 않을 수 있습니다.  
그렇게 되면 그 매개변수들의 값은 `undefined`입니다.
TypeScript에서 선택적인 매개변수를 사용하려면 선택적으로 사용하려는 매개변수의 끝에 `?`를 추가하세요.

예를 들어 위에서 사용한 lastName 매개변수를 선택적으로 사용할 수 있도록 합니다:

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");                  // 올바르게 작동합니다
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 아, 딱 맞습니다
```

모든 선택적 매개변수는 필수 매개변수를 따라와야 합니다.  
last name 대신 first name을 선택적 매개변수로 만들고 싶다면 함수의 매개변수 순서를 변경해야 합니다.  
즉 목록의 first name을 마지막에 넣어야합니다.

TypeScript에서 사용자가 매개변수를 제공하지 않거나 사용자가 대신 `undefined`를 전달하더라도 매개변수가에 할당되는 값을 설정할 수 있습니다.  
이것을 기본 매개변수(default-initialized parameters)라고 합니다.

앞의 예제를 따라 last name의 기본값을 `"Smith"`로 설정해 보겠습니다.

```ts
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 올바르게 작동하며 "Bob Smith"를 반환합니다
let result2 = buildName("Bob", undefined);       // 여전히 작동하며 "Bob Smith"를 반환합니다.
let result3 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result4 = buildName("Bob", "Adams");         // 아, 딱 맞습니다
```

필수 매개변수의 뒤에 오는 기본 매개변수는 선택적 매개변수로 취급되어 함수를 호출할 때 선택적 매개변수처럼 생략할 수 있습니다.  
이것은 선택적 매개변수와 후행 기본 매개변수가 해당 타입의 공통점을 공유한다는 것을 의미하므로  

둘 다

```ts
function buildName(firstName: string, lastName?: string) {
    // ...
}
```

그리고

```ts
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```

`(firstName: string, lastName?: string) => string` 동일한 타입을 공유합니다.  
`lastName`의 기본 값은 타입에서 사라지고 매개변수가 선택 사항이라는 사실만 남겨졌습니다.

일반 선택적 매개변수와 달리 기본 매개변수는 필수 매개변수 뒤에 나올 *필요*가 없습니다.  
기본 매개변수가 필수 매개변수 앞에 오는 경우 사용자는 명시적으로 `undefined`를 전달하여 기본 초기화된 값을 가져와야 합니다.

예를 들어 `firstName`에 기본 초기화만 있는 마지막 예제를 작성할 수 있습니다:

```ts
function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 오류, 너무 적은 매개변수
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 좋아요 "Bob Adams"를 반환합니다
let result4 = buildName(undefined, "Adams");     // 좋아요 "Will Adams"를 반환합니다
```

# 나머지 매개변수 (Rest Parameters)

필수 매개변수와 선택적 매개변수 그리고 기본 매개변수 모두 공통점이 하나 있습니다: 한 번에 하나의 매개변수에 대해 이야기합니다.  
때로는 여러 매개변수를 그룹으로 사용하거나 함수가 마지막으로 가져올 매개변수의 수를 모를 수 있습니다.  
JavaScript에서는 모든 함수 본문에서 볼 수 있는 `arguments`를 사용하여 인수를 직접 사용할 수 있습니다.

TypeScript에서는 다음과 같은 인수를 변수로 함께 모을수 있습니다:
```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

*나머지 매개변수*는 무한적인 수의 선택적 매개변수로 처리됩니다.  
Rest 매개변수에 인수를 전달할 때는 원하는 만큼 사용할 수 있으며 심지어 통과할 수 없습니다.  
컴파일러는 줄임표 (`...`) 다음에 전달된 인수들을 배열을 작성하여 함수에서 사용할 수 있습니다.

줄임표(`...`)는 나머지 매개변수가 있는 함수의 타입에도 사용됩니다:

```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

# `this`

JavaScript에서 `this`를 사용법을 배우는 것은 일종의 통과 의례입니다.  
TypeScript는 JavaScript의 상위 집합이기 때문에 TypeScript 개발자들도 `this`을 사용하는 방법과 올바르게 사용되고 있지 않을 때를 찾아내는 방법을 배워야 합니다.  
JavaScript에서 `this`가 어떻게 작동하는지 알아야 한다면 Yehuda Katz의 [Understanding JavaScript Function Invocation and "this"](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)를 먼저 읽어보세요.  
Yehuda의 글에는 `this`의 내부 동작을 잘 설명하기 때문에 여기서는 기본적인 내용만 다룰 것입니다.

## `this`와 화살표 함수 (`this` and arrow functions)

JavaScript에서 `this`는 함수가 호출될 때 설정되는 변수입니다.  
매우 강력하고 유연한 기능이지만 함수가 실행되는 상황에 대해 항상 알고 있어야 하는 시간이 듭니다.  
특히 함수를 반환하거나 함수를 인수로 전달할 때 악명 높을 정도로 혼란스럽습니다.

예제를 살펴보겠습니다:

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

`createCardPicker`는 자체적으로 함수를 반환하는 함수입니다.  
예제를 실행하려고 하면 alert 대신 오류가 발생합니다.  
`createCardPicker`에 의해 생성된 함수에서 사용되는 `this`가 `deck` 객체 대신에 `window`로 설정되어 있기 때문입니다.  
왜냐하면 `cardPicker()`는 자기 자신을 호출하기 때문입니다.  
이와 같이 최상위 비-메서드 구문 호출은 `this`에 `window`를 사용합니다.  
(주의사항 : 엄격모드(strict mode)에서 `this`는 `window`보다는 `undefined`가 될 것입니다).

나중에 사용할 함수를 반환하기 전에 함수에 올바른 `this`가 연결되도록하여 이를 해결할 수 있습니다.
이렇게하면 나중에 어떻게 사용되든 상관없이 원래의 `deck`객체를 볼 수 있습니다.  
이를 위해 함수 표현식을 ECMAScript 6의 화살표 구문으로 변경하여 사용합니다.  
화살표 함수는 호출된 곳이 아닌 함수가 생성 된 곳에서 `this`를 캡처합니다:

```ts
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // 주의: 아래 줄은 이제 화살표 함수입니다. 여기에서 'this'를 캡처할 수 있습니다.
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

더 좋은 점은 컴파일러에 `--noImplicitThis` 신호를 넘겨주면 TypeScript가 실수를 했을 때 경고를 합니다.  
`this.suits[pickedSuit]`에서 `this`는 `any` 타입입니다.

## `this` parameters

불행히도 `this.suits [pickedSuit]`의 타입은 여전히`any`입니다.  
왜냐하면 `this`는 객체 리터럴 내부의 함수 표현식에서 왔기 때문입니다.  
이 문제를 해결하기 위해 명시적으로 `this` 매개변수를 제공할 수 있습니다.  

`this` 매개변수는 함수의 매개변수 목록에서 처음 나오는 가짜 매개변수입니다:

```ts
function f(this: void) {
    // 이 분리된 함수에서 'this'를 사용할 수 없는지 확인해보세요.
}
```
위의 예제에서 `Card`와 `Deck`에 몇 가지 인터페이스를 추가하여 타입을 더 명확하고 쉽게 재사용하기 쉽게 만들 수 있도록 하겠습니다

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
    // 주의사항 : 이 함수는 이제 반드시 Deck 타입이어야합니다
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

이제 TypeScript는`createCardPicker`가 `Deck` 객체에서 호출될 것으로 예상합니다.  
즉 `this`는 `any`가 아닌 `Deck` 타입입니다. 따라서 `--noImplicitThis`는 오류를 발생시키지 않습니다.

### 콜백에서의 `this` 매개변수 (`this` parameters in callbacks)

함수를 나중에 호출할 라이브러리에 전달할 때 콜백에서 `this`를 사용하여 오류가 발생할 수도 있습니다.  
왜냐하면 콜백을 호출하는 라이브러리가 표준 함수처럼 호출하기 때문에 `this`는 `undefined`가 될 것입니다.

때때로 `this` 매개변수를 사용하여 콜백 오류를 방지할 수도 있습니다.
첫 번째, 라이브러리 작성자는 콜백 타입에 `this`를 사용하여 annotate를 달아야 합니다:

```ts
interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

`this : void`는 `addClickListener`가 `onclick`이 `this` 타입을 필요로 하지 않는 함수라는 것을 의미합니다.

두 번째, `this`를 사용하여 호출 코드와 함께 annotate를 달아야 합니다:

```ts
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // 이런, 여기서 this를 사용했어요. 이 콜백을 사용하면 충돌으로 런타임 오류가 발생합니다.
        this.info = e.message;
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // 오류!
```

`this`가 annotated되어 있으면 `onClickBad`는 반드시 `Handler`의 인스턴스에서 호출되어야한다는 것을 명시해야 합니다.  
그런 다음 TypeScript는 `addClickListener`에 `this : void`가 있는 함수가 필요하다는 것을 발견합니다.  
오류를 해결하려면 `this`의 타입을 수정하세요:

```ts
class Handler {
    info: string;
    onClickGood(this: void, e: Event) {
        // this의 타입이 void이기 때문에 여기서는 사용할 수 없습니다!
        console.log('clicked!');
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

`onClickGood`는 `this`의 타입을 `void`로 지정하기 때문에 `addClickListener`에 전달할 수 있습니다.  
물론 this는 또한 `this.info`를 사용할 수 없다는 것을 의미합니다.  
두 가지 모두를 사용하려면 화살표 함수를 사용해야 합니다:

```ts
class Handler {
    info: string;
    onClickGood = (e: Event) => { this.info = e.message }
}
```

이것은 화살표 함수가 `this`를 캡처하지 않기 때문에 효과적입니다.  
때문에 기대하는 것 같이 항상 `this : void`를 넘겨줄 수 있습니다.

단점은 Handler 타입의 객체마다 하나의 화살표 함수가 생성된다는 것입니다.  
반면에 메서드는 한 번만 만들어지고 핸들러의 프로토 타입에 소속됩니다.   
이러한 객체는 핸들러 타입의 모든 객체 사이에 공유됩니다.

# 오버로드 (Overloads)

JavaScript는 본질적으로 매우 동적인 언어입니다.  
단일 JavaScript 함수가 전달된 인수의 형태를 기반으로 서로 다른 타입의 객체를 반환하는 것은 드문 일이 아닙니다.

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
    // 객체 / 배열로 작업하고 있는지 확인해보세요
    // 그렇다면 그것들은 덱을 주고 사용자는 카드를 선택할 것입니다.
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // 그렇지 않으면 카드를 선택하게하세요.
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

여기서 `pickCard` 함수는 사용자가 무엇을 전달했는지에 따라 두 개의 서로 다른 내용을 반환합니다.  
사용자가 deck를 나타내는 객체를 전달하면 함수가 card를 선택합니다.  
사용자가 card를 선택하면 그들이 선택한 card를 알려줍니다.  
하지만 이것을 어떻게 타입 시스템에 설명할까요?

이에 대한 대답은 오버로드 목록과 동일한 함수에 대한 여러 함수 타입을 제공하는 것이다.  
이 목록은 컴파일러가 함수 호출을 해결하는 데 사용할 것입니다.  
`pickCard`가 받아들일 수 있는 것과 그것이 반환하는 것을 기술한 오버로드 목록을 작성해 보세요.

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // 객체 / 배열로 작업하고 있는지 확인해보세요
    // 그렇다면 그것들은 덱을 주고 사용자는 카드를 선택할 것입니다.
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // 그렇지 않으면 카드를 선택하게하세요.
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

이런 변화로 인해 오버로드가 `pickCard` 함수에 대한 타입-체크 호출을 제공합니다.

컴파일러가 올바른 타입 검사를 선택하기 위해 기본 JavaScript와 비슷한 프로세스를 수행합니다.  
오버로드 목록을 살펴보고 제공된 매개변수를 사용하여 함수를 호출하는 첫 번째 오버로드 시도를 계속합니다.  
일치하는 것을 찾으면 이 오버로드를 올바른 오버로드로 선택합니다.  
이러한 이유 때문에 주문이 많아지면 가장 구체적인 것에서 가장 덜 구체적인 것으로 오버로드합니다.

`function pickCard (x) : any` 조각은 오버로드 목록의 일부가 아니므로 두 개의 오버로드만 있습니다:  
하나는 객체를 취하고 하나는 숫자를 취합니다.  
`pickCard`를 다른 매개 변수 타입과 함께 호출하면 오류가 발생합니다.
