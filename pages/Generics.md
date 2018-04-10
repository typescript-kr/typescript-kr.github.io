# 소개 (Introduction)

소프트웨어 공학의 주요 부분은 명확하고 일관된 API를 가질뿐만 아니라 재사용 가능한 컴포넌트를 구축하는 것입니다.  
현재의 데이터 뿐만 아니라 미래의 데이터에 대해서도 처리할 수 있는 컴포넌트는 대형 소프트웨어 시스템 구축을 위한 가장 유연한 기능을 제공할 것입니다.

C# 및 Java와 같은 언어에서 재사용 가능한 컴포넌트를 만들기 위한 주요 도구 중 하나는 제네릭 즉 단일 타입이 아닌 다양한 타입을 처리할 수 있는 컴포넌트를 만드는 것입니다.  
이를 통해 사용자는 컴포넌트를 사용할 때 자신만의 타입을 사용할 수 있습니다.

# 제네릭의 Hello World (Hello World of Generics)

우선 제네릭의 "Hello World" 즉 identity 함수를 만들어 봅시다.  
이 identity 함수는 전달된 것을 그대로 반환하는 함수입니다.  
이는 `echo` 명령과 비슷한 방식으로 생각하면 됩니다.

제네릭이 없다면 identity 함수에 특정 타입을 부여해야 합니다.

```ts
function identity(arg: number): number {
    return arg;
}
```

또는 `any` 타입을 사용하여 identity 함수를 만들 수 있습니다.

```ts
function identity(arg: any): any {
    return arg;
}
```

`any`를 사용하는 것은 분명히 함수가 `arg`에 대한 모든 타입을 전달 받을 수 있게되지만 실제로 함수가 반환할 때 그 타입이 무엇이었는지에 대한 정보를 잃어버립니다.  
만약 숫자를 인수로 전달하면 어떤 타입이든 반환횔 수 있다는 것을 알 수 있습니다.

대신 어떤 타입이 반환될 것인지를 나타내는 데 사용할 수 있는 방식으로 인수 타입을 정하는 방법이 필요합니다.  
여기서는 값이 아닌 타입을 처리하는 특별한 종류의 변수인 _타입 변수(type variable)_을 사용할 것입니다.

```ts
function identity<T>(arg: T): T {
    return arg;
}
```

identity 함수에 타입변수 `T` 를 추가했습니다.  
이 `T` 는 함수 사용자가 제공한 타입(예: `number`)를 캡처하여 나중에 해당 정보를 사용할 수 있도록 합니다.  
또한 `T` 를 다시 반환 타입으로 사용합니다.  
자세히 보면 인수와 반환 타입에 동일한 타입이 사용되는 것을 볼 수 있습니다.  
이를 통해 함수의 안과 밖에서 타입에 대한 정보를 넘길 수 있습니다.

이러한 모습의 `identity` 함수는 다양한 타입을 처리할 수 있기 때문에 일반적이라고 할 수 있습니다.  
`any` 를 사용하는 것과는 달리 인수와 반환 타입에 숫자를 사용하는 처음의 `identity` 함수와 동일합니다.(즉 어떠한 정보도 잃어버리지 않습니다)

제네릭 `identity` 함수를 만든 후 두 가지 방법 중 하나로 호출할 수 있습니다.  
첫번째 방법은 타입 인수를 포함한 모든 인수를 함수에 전달하는 것입니다.

```ts
let output = identity<string>("myString");  // 반환 타입은 'string' 입니다.
```

여기서는 함수 호출에 대한 인수 중 하나인 `T` 를 `string` 으로 명시적으로 정했으며 인수에는 `()` 를 사용하는 것과 달리 `<>` 를 사용했습니다.

두번째 방법은 더 일반적인 방법이기도 합니다.  
여기서는 _타입 인수 추론(type argument inference)_ 를 사용합니다.  
즉 함수에 전달하는 인수 타입에 따라 컴파일러가 자동으로 `T` 값을 설정합니다.

```ts
let output = identity("myString");  // 반환 타입은 'string' 입니다.
```

꺾쇠 괄호(`<>`) 안에 명시적으로 타입을 전달할 필요가 없습니다.  
컴파일러는 그저 `"myString"` 의 값을 보고 `T` 를 그 타입으로 설정합니다.  
타입 인수 추론은 코드를 더 짧고 가독성 있게 유지하는 유용한 도구가 될 수 있지만 보다 복잡한 예제에서는 컴파일러가 타입을 추론하지 못하면 앞의 예제에서 했던 것 처럼 타입 인수를 명시적으로 전달해야 할 수도 있습니다.

# 제네릭 타입 변수 (Generic Type Variables)

제네릭을 사용하기 시작할 때  `identity` 와 같은 제네릭 함수를 만들면 컴파일러는 함수 내부에 제네릭으로 타입이 지정된 매개변수를 올바르게 사용하도록 합니다.  
즉 실제로 이러한 매개변수를 모든 타입이 될 수 있는 것처럼 취급힙니다.

앞에서 본 `identity` 함수를 보겠습니다.

```ts
function identity<T>(arg: T): T {
    return arg;
}
```

각 호출과 함께 콘솔에 인수 `arg` 의 길이를 기록하고 싶다면 어떻게 해야할까요?
이렇게 할지도 모릅니다:

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // 오류 : T는 .length 메소드를 가지고 있지 않습니다.
    return arg;
}
```

컴파일러는 `arg` 의 `.length` 멤버를 사용하고 있다는 오류를 주지만 `arg` 모듈에는 이 멤버가 없다고 할 수는 없습니다.  
이전에 타입 변수가 모든 타입이 될 수 있다고 했습니다.  
따라서 누군가 `.length` 멤버가 없는 `number` 를 전달 할 수 있을 것입니다.

실제로 이 함수가 `T` 대신 `T` 배열을 처리한다고 가정해 봅시다.  
그러면 배열을 처리할 수 있기 때문에 `.length` 멤버가 사용 가능해야 합니다.  
다른 타입의 배열을 생성하는 함수로 이것을 설명하겠습니다:

```ts
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array는 .length 멤버가 있습니다. 오류 없음.
    return arg;
}
```

`loggingIdentity` 는 타입 매개 변수 `T` 를 인수로 받고 `arg` 는 `T` 배열이며 `T` 배열을 반환합니다.  
숫자 배열을 인수로 넘기면 `T` 가 `number` 에 바인딩 되기 때문에 숫자 배열을 반환할 것입니다.   
이렇게하면 모든 타입이 아닌 처리하고자 하는 타입의 일부로 제네릭 타입 변수 `T` 를 사용하여 유연성을 높일 수 있습니다.

혹은 다음 예제와 같이 작성할 수 있습니다.

```ts
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array는 .length 멤버가 있습니다. 오류 없음.
    return arg;
}
```

이미 다른 언어의 타입 스타일에 대해 잘 알고 있을 것입니다.  
다음장에서는 `Array<T>` 와 같이 자신만의 제네릭 타입을 만드는 방법을 다룰 것입니다.

# 제네릭 타입 (Generic Types)

이전 장에서는 다양한 타입의 함수를 처리하는 제네릭 identity 함수를 만들었습니다.  
이 장에서는 함수 자체의 타입과 제네릭 인터페이스를 만드는 방법에 대하여 살펴보겠습니다.

제네릭 함수의 타입은 함수 선언과 비슷하게 타입 매개변수가 먼저 나열된 비 제네릭 함수의 타입은 같습니다.

```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

타입 변수의 수와 타입 변수의 사용이 일치하다면 제네릭 타입 매개변수에 다른 이름을 사용할 수도 있습니다.

```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

제네릭 타입을 객체 리터럴 타입의 호출 형식으로도 사용할 수 있습니다:

```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

따라서 첫번째 제네릭 인터페이스를 작성하게 됩니다.  
앞의 예제에서 객체 리터럴을 가져와 인터페이스로 옮깁니다.

```ts
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

비슷한 예에서 제네릭 매개변수를 전체 인터페이스의 매개변수로 이동하려고 할 수 있습니다.  
이렇게하면 일반적으로 사용하는 유형(예: `Dictionary` 가 아닌 `Dictionary<string>`) 을 볼 수 있습니다.  
이것은 인터페이스의 다른 모든 멤버가 타입 매개변수를 볼 수 있게합니다.

```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

예제를 약간 다른 것으로 바꿔보겠습니다.  
제네릭 함수 대신 제네릭 타입의 일부인 비 제네릭 함수 signature로 설명하겠습니다.  
우리가 `GenericIdentityFn` 을 사용할 때 대응하는 타입 매개변수(여기서는 `number`)를 지정할 필요가 있고 호출 형식을 효과적으로 고정시킬 것입니다.  
언제 직접 호출 형식에 타입 파라미터를 삽입해야 하고 언제 인터페이스 자체에 삽입해야하는지를 이해하는 것이 타입의 어떤 측면이 제네릭인지 설명하는데 도움이 될 것입니다.

제네릭 인터페이스 외에도 제네릭 클래스를 만들 수 있습니다.  
하지만 제네릭 열거형과 네임스페이스는 만들 수 없습니다.

# 제네릭 클래스 (Generic Classes)

제네릭 클래스는 제네릭 인터페이스와 형태가 비슷합니다.  
제네릭 클래스는 클래스 이름 다음에 꺾쇠 괄호(`<>`)로 묶인 제네릭 타입 매개변수들을 갖습니다.

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

이것은 `GenericNumber` 문자 그대로 `number` 타입만 사용하도록 제한하는 것이 없다는 것을 눈치 챘을 것입니다.
대신 `string` 이나 더 복잡한 객체를 사용할 수 있을 것입니다.

```ts
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

alert(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

인터페이스와 마찬가지로 타입 매개변수를 클래스 자체에 두면 클래스의 모든 속성이 동일한 타입으로 작동하도록 할 수 있습니다.

[클래스 섹션](./Classes.md)에서 다루었던 것처럼 클래스에는 정적인 측면과 인스턴스 측면의 두가지 측면이 있습니다.  
제네릭 클래스는 정적 측면 보다는 인스턴스 측면에서만 제네릭이므로 클래스를 사용할 때 정적 멤버(static member)는 클래스의 타입 매개변수를 사용할 수 없습니다.

# 제네릭 제약조건 (Generic Constraints)

이전의 예제를 기억한다면 타입들에 어떤 기능이 있는지에 대한 지식이 있는 타입에서 작동하는 제네릭 함수를 작성해야 할 때가 있습니다.  
`loggingIdentity` 예제에서는 `arg`의 `.length` 프로퍼티에 접근하기를 원했지만 컴파일러는 모든 타입이 `.length` 속성을 가지고 있음을 증명할 수 없었습니다.  
그래서 컴파일러는 이러한 가정을 하지 않도록 경고를 줍니다.

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // 오류 : T는 .length 메소드를 가지고 있지 않습니다.
    return arg;
}
```

모든 타입으로 작업하는 대신 이 함수가 `.length` 프로퍼티를 가진 모든 타입에서 작동하도록 제한을 두고 싶을 것입니다.  
타입에 이 멤버가 있으면 타입을 허용하지만 적어도 이 멤버가 있어야 합니다.  
그렇게 하기 위해서는 `T` 가 무엇이 될 수 있는지에 대한 제약으로서 요구 사항을 작성해야 합니다.

그러기 위해 제약 조건을 설명하는 인터페이스를 만들 것입니다.  
여기에서는 하나의 `.length` 프로퍼티를 가진 인터페이스를 만들고 이 인터페이스와 `extends` 키워드를 사용하여 제약조건을 나타냅니다.

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // 이제 .length 프로퍼티가 있으므로 더이상 오류가 없습니다.
    return arg;
}
```

제네릭 함수는 이제 제한되어 있으므로 더이상 모든 타입에서 작동하지 않습니다.

```ts
loggingIdentity(3);  // 오류, number 는 .length 프로퍼티가 없습니다.
```

대신 모든 필수 프로퍼티가 있는 타입의 값을 전달해야 합니다.

```ts
loggingIdentity({length: 10, value: 3});
```

## 제네릭 제약조건에서 타입 매개변수 사용 (Using Type Parameters in Generic Constraints)

다른 타입 매개 변수에 의해 제한되는 타입 매개변수를 선언할 수 있습니다.  
예를 들어 여기서는 이름을 가진 객체의 프로퍼티를 가져오려고 합니다.  
실수로 `obj`에 존재하지 않는 프로퍼티를 잡아내지 않도록 하고자 합니다.  
 그래서 두가지 타입 사이에 제약조건을 적용할 것입니다:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // 오류 없음
getProperty(x, "m"); // 오류 : 타입 'm'의 인수를 'a' | 'b' | 'c' | 'd' 에 할당 할 수 없습니다.
```

## 제네릭에서 클래스 타입 사용 (Using Class Types in Generics)

제네릭을 사용하여 TypeSciprt에서 팩토리를 생성할 때 생성자 함수를 사용하여 클래스 타입을 참조해야 합니다.

예를 들어

```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

아래의 고급 예제는 프로토타입 프로퍼티를 사용하여 생성자 함수와 클래스 타입의 인스턴스 사이의 관계를 추론하고 제한합니다.

```ts
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // 타입 체크!
createInstance(Bee).keeper.hasMask;   // 타입 체크!
```
