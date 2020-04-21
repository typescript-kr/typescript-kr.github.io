# 소개 (Introduction)

기존 JavaScript는 재사용할 수 있는 컴포넌트를 만들기 위해 함수와 프로토타입-기반 상속을 사용했지만, 객체 지향 접근 방식에 익숙한 프로그래머의 입장에서는 클래스가 함수를 상속받고 이런 클래스에서 객체가 만들어지는 것에 다소 어색함을 느낄 수 있습니다.
ECMAScript 6로도 알려진 ECMAScript 2015를 시작으로 JavaScript 프로그래머들은 이런 객체-지향적 클래스-기반의 접근 방식을 사용해서 애플리케이션을 만들 수 있습니다.
TypeScript에서는 다음 버전의 JavaScript를 기다릴 필요 없이 개발자들이 이러한 기법들을 사용할 수 있게 해주며, 기존의JavaScript로 컴파일하여 주요 브라우저와 플랫폼에서 동작하게 합니다.

# 클래스 (Classes)

간단한 클래스-기반 예제를 살펴보겠습니다:

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

C# 이나 Java를 사용해봤다면, 익숙한 구문일 것입니다.
새로운 클래스 `Greeter`를 선언했습니다. 이 클래스는 3개의 멤버를 가지고 있습니다: `greeting` 프로퍼티, 생성자 그리고 `greet` 메서드 입니다.

클래스 안에서 클래스의 멤버를 참조할 때 `this.`를 앞에 덧붙이는 것을 알 수 있습니다.
이것은 멤버에 접근하는 것을 의미합니다.

마지막 줄에서, `new`를 사용하여 `Greeter`클래스의 인스턴스를 생성합니다.
이 코드는 이전에 정의한 생성자를 호출하여 `Greeter` 형태의 새로운 객체를 만들고, 생성자를 실행해 초기화합니다.

# 상속 (Inheritance)

TypeScript에서는, 일반적인 객체-지향 패턴을 사용할 수 있습니다.
클래스-기반 프로그래밍의 가장 기본적인 패턴 중 하나는 상속을 이용하여 이미 존재하는 클래스를 확장해 새로운 클래스를 만들 수 있다는 것입니다.

예제를 살펴보겠습니다:

```ts
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

상속 기능을 보여주는 가장 기본적인 예제입니다: 클래스는 기초 클래스로부터 프로퍼티와 메서드를 상속받습니다.
여기서, `Dog`은 `extends` 키워드를 사용하여 `Animal`이라는 *기초* 클래스로부터 파생된 *파생* 클래스입니다.
파생된 클래스는 *하위클래스(subclasses)*, 기초 클래스는 *상위클래스(superclasses)* 라고 불리기도 합니다.

`Dog`는 `Animal`의 기능을 확장하기 때문에, `bark()`와 `move()`를 모두 가진 `Dog` 인스턴스를 생성할 수 있습니다.

조금 더 복잡한 예제를 살펴보겠습니다.

```ts
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

이 예제는 앞에서 언급하지 않은 몇 가지 기능을 다룹니다.
이번에도 `extends` 키워드를 사용하여 `Animal`의 하위클래스를 생성합니다: `Horse`와 `Snake`.

이전 예제와 한 가지 다른 부분은 파생된 클래스의 생성자 함수는 기초 클래스의 생성자를 실행할 `super()`를 *호출해야 한다는 점*입니다.
더욱이 생성자 내에서 `this`에 있는 프로퍼티에 접근하기 전에 `super()`를 먼저 호출해야 합니다.
이 부분은 TypeScript에서 중요한 규칙입니다.

또한 이 예제는 기초 클래스의 메서드를 하위클래스에 특화된 메서드로 오버라이드하는 방법을 보여줍니다.
여기서 `Snake`와 `Horse`는 `Animal`의 `move`를 오버라이드해서 각각 클래스의 특성에 맞게 기능을 가진 `move`를 생성합니다.
`tom`은 `Animal`로 선언되었지만 `Horse`의 값을 가지므로 `tom.move(34)`는 `Horse`의 오버라이딩 메서드를 호출합니다.

```ts
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

# Public, private 그리고 protected 지정자 (Public, private, and protected modifiers)

## 기본적으로 공개 (Public by default)

우리 예제에서는, 프로그램 내에서 선언된 멤버들에 자유롭게 접근할 수 있습니다.
다른 언어의 클래스가 익숙하다면, 위 예제에서 `public`을 사용하지 않아도 된다는 점을 알 수 있습니다. 예를 들어, C#에서는 노출 시킬 각 멤버에 `public`을 붙여야 합니다.
TypeScript에서는 기본적으로 각 멤버는 `public`입니다.

명시적으로 멤버를 `public`으로 표시할 수도 있습니다.
이전 섹션의 `Animal` 클래스를 다음과 같은 방식으로 작성할 수 있습니다:

```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

## ECMAScript 비공개 필드 (ECMAScript Private Fields)

TypeScript 3.8에서, TypeScript는 비공개 필드를 위한 JavaScript의 새로운 문법을 지원합니다:

```ts
class Animal {
    #name: string;
    constructor(theName: string) { this.#name = theName; }
}

new Animal("Cat").#name; // 프로퍼티 '#name'은 비공개 식별자이기 때문에 'Animal' 클래스 외부에선 접근할 수 없습니다.
```

이 문법은 JavaScript 런타임에 내장되어 있으며, 각각의 비공개 필드의 격리를 더 잘 보장할 수 있습니다.
현재 TypeScript 3.8 [릴리즈 노트](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports)에 비공개 필드에 대해 자세히 나와있습니다.

## TypeScript의 `private` 이해하기 (Understanding TypeScript’s `private`)

TypeScript에는 멤버를 포함하는 클래스 외부에서 이 멤버에 접근하지 못하도록 멤버를 `private`으로 표시하는 방법이 있습니다. 예:

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 오류: 'name'은 비공개로 선언되어 있습니다;
```

TypeScript는 구조적인 타입 시스템입니다.
두개의 다른 타입을 비교할 때 어디서 왔는지 상관없이 모든 멤버의 타입이 호환 된다면, 그 타입들 자체가 호환 가능하다고 말합니다.

그러나 `private` 및 `protected` 멤버가 있는 타입들을 비교할 때는 타입을 다르게 처리합니다.
호환된다고 판단되는 두 개의 타입 중 한 쪽에서 `private` 멤버를 가지고 있다면, 다른 한 쪽도 무조건 동일한 선언에 `private` 멤버를 가지고 있어야 합니다.
이것은 `protected` 멤버에도 적용됩니다.

실제로 어떻게 작동하는지 알아보기 위해 다음 예제를 살펴보겠습니다:

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 오류: 'Animal'과 'Employee'은 호환될 수 없음.
```

이 예제에서는 `Animal`과 `Animal`의 하위클래스인 `Rhino`가 있습니다.
`Animal`과 형태가 같아보이는 `Employee`라는 새로운 클래스도 있습니다.
이 클래스들의 인스턴스를 생성하여 할당하고 어떻게 작동하는지 살펴보겠습니다.
`Animal`과 `Rhino`는 `Animal`의 `private name:string`이라는 동일한 선언으로부터 `private` 부분을 공유하기 때문에 호환이 가능합니다. 하지만 `Employee` 경우는 그렇지 않습니다.
`Employee`를 `Animal`에 할당할 때, 타입이 호환되지 않다는 오류가 발생합니다.
`Employee`는 `name`이라는 `private` 멤버를 가지고 있지만, `Animal`에서 선언한 것이 아니기 때문입니다.

## `protected` 이해하기 (Understanding protected)

`protected` 지정자도 `protected`로 선언된 멤버를 파생된 클래스 내에서 접근할 수 있다는 점만 제외하면 `private`지정자와 매우 유사하게 동작합니다. 예를 들면,

```ts
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 오류
```

`Person` 외부에서 `name`을 사용할 수 없지만, `Employee`는 `Person`에서 파생되었기 때문에 `Employee`의 인스턴스 메서드 내에서는 여전히 사용할 수 있습니다.

생성자 또한 `protected`로 표시될 수도 있습니다.
이는 클래스를 포함하는 클래스 외부에서 인스턴스화 할 수 없지만 확장 할 수 있음을 의미합니다. 예를 들면,

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee는 Person을 확장할 수 있습니다.
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 오류: 'Person'의 생성자는 protected 입니다.
```

# 읽기전용 지정자 (Readonly modifier)

`readonly`키워드를 사용하여 프로퍼티를 읽기전용으로 만들 수 있습니다.
읽기전용 프로퍼티들은 선언 또는 생성자에서 초기화해야 합니다.

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 오류! name은 읽기전용 입니다.
```

## 매개변수 프로퍼티 (Parameter properties)

마지막 예제의 `Octopus` 클래스 내에서 `name`이라는 읽기전용 멤버와 `theName`이라는 생성자 매개변수를 선언했습니다. 이는 `Octopus`의 생성자가 수행된 후에 `theName`의 값에 접근하기 위해서 필요합니다. *매개변수 프로퍼티*를 사용하면 한 곳에서 멤버를 만들고 초기화할 수 있습니다. 다음은 매개변수 프로퍼티를 사용한 더 개정된 `Octopus`클래스입니다.

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

생성자에 짧아진 `readonly name: string` 파라미터를 사용하여 `theName`을 제거하고 `name` 멤버를 생성하고 초기화했습니다. 즉 선언과 할당을 한 곳으로 통합했습니다.

매개변수 프로퍼티는 접근 지정자나 `readonly` 또는 둘 모두를 생성자 매개변수에 접두어로 붙여 선언합니다. 매개변수 프로퍼티에 `private`을 사용하면 비공개 멤버를 선언하고 초기화합니다. 마찬가지로, `public`, `protected`, `readonly`도 동일하게 작용합니다.

# 접근자 (Accessors)

TypeScript는 객체의 멤버에 대한 접근을 가로채는 방식으로 getters/setters를 지원합니다. 이를 통해 각 객체의 멤버에 접근하는 방법을 세밀하게 제어할 수 있습니다.

간단한 클래스를 `get`과 `set`을 사용하도록 변환해봅시다. 먼저 getters와 setters가 없는 예제로 시작합니다.

```ts
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

사람들이 임의로 `fullName`을 직접 설정할 수 있도록 허용하는 것은 매우 편리하지만, 우리는 `fullName`이 설정될 때 몇 가지 제약 조건이 적용되는 것을 원할 수 있습니다.

이 버전에서는 백업 데이터베이스 필드의 최대 길이와 호환되는지 확인하기 위해 `newName`의 길이를 확인하는 setter를 추가합니다. 만약 최대 길이를 초과한다면, 클라이언트 코드에 문제가 있다는 것을 알리기 위해 오류를 발생시킵니다.

기존의 기능을 유지하기 위해, `fullName`을 수정하지 않는 간단한 getter도 추가합니다.

```ts
const fullNameMaxLength = 10;

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (newName && newName.length > fullNameMaxLength) {
            throw new Error("fullName has a max length of " + fullNameMaxLength);
        }

        this._fullName = newName;
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

접근자가 값의 길이를 확인하고 있는지 검증하기 위해서, 10자가 넘는 이름을 할당하고 오류가 발생함을 확인할 수 있습니다.

접근자에 대해 주의해야 할 사항:

먼저 접근자는 ECMAScript 5 이상을 출력하도록 컴파일러를 설정해야 합니다. ECMAScript 3으로의 하향 조정은 지원되지 않습니다. 둘째, `get`과 `set`이 없는 접근자는 자동으로 `readonly`로 유추됩니다. 이는 프로퍼티 내의 사용자들이 변경할 수 없음을 알 수 있기 때문에 코드 내에서 `.d.ts` 파일을 생성할 때 유용합니다.

# 전역 프로퍼티 (Static Properties)

지금까지는 인스턴스화될 때 객체에 보이는 *인스턴스* 멤버에 대해서만 살펴보았습니다. 또한 우리는 인스턴스가 아닌 클래스 자체에서 보이는 *전역* 멤버를 생성할 수 있습니다. 이 예제에서는 모든 grid의 일반적인 값이기 때문에 origin에 `static`을 사용합니다. 각 인스턴스는 클래스 이름을 앞에 붙여 이 값에 접근할 수 있습니다. 인스턴스 접근 앞에 `this.`를 붙이는 것과 비슷하게 여기선 전역 접근 앞에 `Grid.`를 붙입니다.

```ts
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

# 추상 클래스 (Abstract Classes)

추상 클래스는 다른 클래스들이 파생될 수 있는 기초 클래스입니다. 추상 클래스는 직접 인스턴스화할 수 없습니다. 추상 클래스는 인터페이스와 달리 멤버에 대한 구현 세부 정보를 포함할 수 있습니다. `abstract` 키워드는 추상 클래스뿐만 아니라 추상 클래스 내에서 추상 메서드를 정의하는데 사용됩니다.

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

추상 클래스 내에서 추상으로 표시된 메서드는 구현을 포함하지 않으며 반드시 파생된 클래스에서 구현되어야 합니다. 추상 메서드는 인터페이스 메서드와 비슷한 문법을 공유합니다. 둘 다 메서드 본문을 포함하지 않고 메서드를 정의합니다. 그러나 추상 메서드는 반드시 `abstract` 키워드를 포함해야 하며, 선택적으로 접근 지정자를 포함할 수 있습니다.

```ts
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void; // 반드시 파생된 클래스에서 구현되어야 합니다.
}

class AccountingDepartment extends Department {

    constructor() {
        super("Accounting and Auditing"); // 파생된 클래스의 생성자는 반드시 super()를 호출해야 합니다.
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}

let department: Department; // 추상 타입의 레퍼런스를 생성합니다
department = new Department(); // 오류: 추상 클래스는 인스턴스화 할 수 없습니다
department = new AccountingDepartment(); // 추상이 아닌 하위 클래스를 생성하고 할당합니다
department.printName();
department.printMeeting();
department.generateReports(); // 오류: 선언된 추상 타입에 메서드가 존재하지 않습니다
```

# 고급 기법 (Advanced Techniques)

## 생성자 함수 (Constructor functions)

TypeScript에서는 클래스를 선언하면 실제로 여러 개의 선언이 동시에 생성됩니다. 첫 번째로 클래스의 인스턴스 타입입니다.

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet()); // "Hello, world""
```

여기서 `let greeter: Greeter`라고 할 때, `Greeter` 클래스의 인스턴스 타입으로 `Greeter`를 사용합니다. 이것은 거의 다른 객체 지향 언어를 사용하는 프로그래머들에겐 자연스러운 성질입니다.

또한 *생성자 함수*라고 불리는 또 다른 값을 생성하고 있습니다. 이것은 클래스의 인스턴스를 `new` 할 때 호출되는 함수입니다. 실제로 어떻게 보이는지 확인하기 위해 위의 예제에서 만들어진 JavaScript를 살펴보겠습니다.

```ts
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet()); // "Hello, world"
```

여기서, `let Greeter`는 생성자 함수를 할당받을 것입니다. `new`를 호출하고 이 함수를 실행할 때, 클래스의 인스턴스를 얻습니다. 또한 생성자 함수는 클래스의 모든 전역 변수들을 포함하고 있습니다. 각 클래스를 생각하는 또 다른 방법은 *인스턴스* 측면과 *정적* 측면이 있다는 것 입니다.

이 차이를 보여주기 위해 예제를 수정해봅시다.

```ts
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet()); // "Hello, there"

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet()); // "Hey there!"
```

이 예제에서 `greeter1`은 이전과 비슷하게 작동합니다. `Greeter` 클래스를 인스턴스화하고 이 객체를 사용합니다. 이것은 전에 본 것입니다.

다음으로, 클래스를 직접 사용합니다. 여기서 `greeterMaker`라는 새로운 변수를 생성합니다. 이 변수는 클래스 자체를 유지하거나 생성자 함수를 다르게 설명합니다. 여기서 `typeof Greeter`를 사용하여 인스턴스 타입이 아닌 "`Greeter` 클래스 자체의 타입을 제공합니다". 혹은 더 정확하게 생성자 함수의 타입인 "`Greeter`라는 심볼의 타입을 제공합니다". 이 타입은 `Greeter` 클래스의 인스턴스를 만드는 생성자와 함께 Greeter의 모든 정적 멤버를 포함할 것입니다. `greeterMaker`에 `new`를 사용함으로써 `Greeter`의 새로운 인스턴스를 생성하고 이전과 같이 호출합니다.

## 인터페이스로써 클래스 사용하기 (Using a class as an interface)

앞서 언급한 것처럼, 클래스 선언은 클래스의 인스턴스를 나타내는 타입과 생성자 함수라는 두 가지를 생성합니다. 클래스는 타입을 생성하기 때문에 인터페이스를 사용할 수 있는 동일한 위치에서 사용할 수 있습니다.

```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```
