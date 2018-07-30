# 소개 (Introduction)

전통적인 JavaScript는 재사용 가능한 컴포넌트를 만들기 위해 함수와 프로토 타입 기반의 상속을 사용하지만 클래스가 함수를 상속하고 객체가 이러한 클래스에서 구축되는 객체 지향 접근 방식에 익숙하지 않은 개발자들에게는 다소 어색함을 느낄 수 있습니다.  
ECMAScript6로도 알려진 ECMAScript 2015년을 시작으로 JavaScript 개발자는 이 객체 지향 클래스 기반 접근 방식을 사용하여 응용 프로그램을 구축 할 수 있습니다.  
TypeScript에서는 개발자가 이 기술을 사용하고 다음 JavaScript 버전을 기다리지 않고도 모든 메이저 브라우저와 플랫폼에서 작동하는 JavaScript로 컴파일 할 수 있습니다.

# 클래스 (Classes)

간단한 클래스 기반 예제를 살펴보겠습니다:

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

이전에 C# 또는 Java를 사용한 적이 있는 경우 구문이 익숙하게 보여야 합니다.  
새로운 클래스인 `Greeter`을 선언합니다.
이 클래스에는 3개의 멤버가 있습니다: `greeting` 프로퍼티와 생성자 그리고 `greet` 메서드가 있습니다.

클래스의 멤버 중 하나를 참조할 때 클래스에서 `this`를 앞에 접두어로 붙입니다.
이것은 멤버에 접근하는 것을 뜻합니다.

마지막 줄에서는 `new`를 사용하여 `Greeter` 클래스의 인스턴스를 만듭니다.  
이것은 이전에 정의한 생성자를 호출하여 `Greeter` 형태의 새 객체를 만들고 생성자를 실행하여 이를 초기화합니다.

# 상속 (Inheritance)

TypeScript에서는 일반적인 객체 지향 패턴을 사용할 수 있습니다.  
클래스 기반 프로그래밍에서 가장 기본적인 패턴 중 하나는 상속을 사용하여 기존 클래스를 확장하여 새로운 클래스를 생성할 수 있다는 것입니다.

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

이 예제는 가장 기본적인 상속 기능을 보여줍니다: 클래스는 기본 클래스에서 속성과 메서드를 상속받습니다.  
여기서 `Dog`는 `extends` 키워드를 사용하여 `Animal` *기본* 클래스에서 유래된 *파생* 클래스입니다.  
파생 클래스는 종종 *하위 클래스(subclasses)* 라고 하며 기본 클래스는 *슈퍼 클래스(superclasses)* 라고도 합니다.

`Dog`는 `Animal`로부터 기능을 확장시키기 때문에 `bark()`와 `move()` 둘 다 할 수 있는 `Dog`의 인스턴스를 만들 수 있었습니다.

이제 좀 더 복잡한 예제를 살펴보겠습니다.

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

이 예제는 앞서 언급하지 않은 몇 가지 다른 기능을 다룹니다.  
이번에도 `Animal`의 새로운 하위 클래스인 `Horse`과 `Snake`을 만드는 `extends` 키워드가 등장합니다.

이전 예제와의 한 가지 다른 점은 생성자 함수를 포함하는 각 파생 클래스가 기본 클래스의 생성자를 실행할 `super()`를 호출*해야한다는 것*입니다.  
게다가 생성자 내에서 `this`에 있는 프로퍼티에 접근하기 전에 *항상* `super()`를 *호출해야 합니다*.  
이것은 TypeScript가 적용할 중요한 규칙입니다.

또한 이 예제에서는 기본 클래스의 메서드를 하위 클래스에 특화된 메서드를 오버라이드 하는 방법도 보여 줍니다.

여기에서 `Snake`와 `Horse`는 `Animal`의 `move`를 오버라이드하고 각 클래스에 고유한 기능을 부여하는 `move` 메서드를 만듭니다.

`tom`은 `Animal`로 선언되었지만 `Horse`의 값을 가지므로 `tom.move(34)`를 호출하면 `Horse`의 오버라이딩 메서드가 호출됩니다:

```Text
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

# Public, private, 그리고 protected 지정자 (Public, private, and protected modifiers)

## 기본적인 Public (Public by default)

예를 들어 프로그램을 통해 선언된 멤버들에 자유롭게 접근할 수 있었습니다.

다른 언어의 클래스에 익숙하다면 위의 예제에서 `public`을 사용하지 않아도 된다는 사실을 알았을 것입니다.  
예를 들어 C#의 경우 각 멤버를 `public`으로 표시하도록 명시해야합니다.

TypeScript에서는 기본적으로 각 멤버가 `public`입니다.

그럼에도 불구하고 `public`를 멤버를 명시적으로 표시할 수 있습니다.  
이전 섹션의 `Animal` 클래스를 다음과 같이 작성할 수 있었습니다:

```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

## `private` 이해하기 (Understanding `private`)

멤버가 `private`으로 표시되면 그 멤버를 포함하는 클래스의 외부에서는 접근할 수 없습니다. 예 :

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 오류: 'name'은 private이다;
```

TypeScript는 구조적인 타입의 시스템입니다.  
두 개의 다른 타입을 비교할 때 그것들이 어디서 왔는지에 관계없이 모든 멤버의 타입이 호환 가능하다면 그 타입 자체가 호환성(compatible)이 있다고 말합니다.

그러나 `private` 및 `protected`멤버가 있는 타입을 비교할 때 이러한 타입들은 다르게 처리합니다.

호환성(compatible)이 있는 것으로 판단되는 두 가지 타입 중 `private`멤버가 있는 경우 다른 멤버는 동일한 선언에서 유래된 `private`멤버가 있어야 합니다.  
이것은 `protected`멤버에도 적용됩니다.

실제로 이러한 기능이 어떻게 작동하는지를 더 잘 알아보기 위한 예를 살펴보겠습니다:

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
animal = employee; // 오류: 'Animal'과 'Employee'는 호환되지 않습니다.
```

이 예제에서는 `Animal`과 `Rhino`가 있습니다. `Rhino`는 `Animal`의 하위 클래스입니다.  
또한 구체적으로 `Animal`과 같아 보이는 `Employee`라는 새로운 클래스를 가지고 있습니다.  
이러한 클래스들의 인스턴스들을 만들고 서로를 할당하여 어떠한 일이 발생하는지 봅시다.

`Animal`과 `Rhino`는 `Animal`의 `private name: string` 선언으로부터 `private`의 형태를 공유하기 때문에 호환됩니다.  
그러나 `Employee`의 경우는 그렇지 않습니다.

`Employee`를 `Animal`에 할당하려고 할 때 이 타입들은 호환되지 않는다는 오류가 발생합니다.  
`Employee`도 name이라는 `private` 멤버가 있지만 `Animal`에서 선언한 것이 아닙니다.

## `protected` 이해하기 (Understanding `protected`)

`protected` 지정자는 `private` 지정자와 매우 유사하게 동작합니다.  
단 `protected` 멤버도 선언된 파생 클래스의 인스턴스에서 접근할 수 있습니다.  

예를 들어

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

`Person`의 외부에서 `name`을 사용할 수는 없지만 `Employee`는 `Person`으로부터 파생되기 때문에 `Employee`의 인스턴스 메서드 내에서 여전히 사용할 수 있습니다.

생성자 또한 `protected`로 표시될 수도 있습니다.  
즉 클래스를 포함하는 클래스 외부에서 클래스를 인스턴스화할 수는 없지만 확장될 수는 있습니다.

예를 들어

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee는 Person을 확장할 수 있습니다
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
let john = new Person("John"); // 오류: 'Person'의 생성자는 protected입니다.
```

# Readonly 지정자 (Readonly modifier)

`readonly` 키워드를 사용하여 프로퍼티들을 읽기 전용으로 만들 수 있습니다.
읽기 전용 프로퍼티들은 선언 또는 생성자에서 초기화해야합니다.

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 오류! name은 readonly입니다.
```

## 매개변수 프로퍼티 (Parameter properties)

마지막 예제의 `Octopus` 클래스에서 readonly 멤버 `name`과 생성자 매개변수 `theName`을 선언했습니다.  
그 다음 바로 `name`을 `theName`으로 설정했습니다.

이것은 매우 일반적인 방법입니다.  
*매개변수 프로퍼티(Parameter properties)* 를 사용하면 한 곳에서 멤버를 생성하고 초기화할 수 있습니다.  
다음은 매개 변수 프로퍼티를 사용하여 이전에 `Octopus` 클래스를 추가적으로 수정합니다:

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

`theName`을 어떻게 삭제했는지 확인하고 생성자에서 `readonly name : string` 매개 변수를 사용해 멤버 `name`을 생성하고 초기화할 수 있습니다.

선언과 할당을 하나의 장소로 통합했습니다.

매개변수 프로퍼티는 접근 지정자(accessibility modifier) 또는 `readonly` 또는 둘 모두로 생성자 매개변수를 접두어로 붙여 선언합니다.  
매개 변수 프로퍼티에 `private`을 사용하면 private 멤버가 선언되고 초기화됩니다.  
마찬가지로 `public`와 `protected` 그리고 `readonly`도 마찬가지입니다.

# 접근자 (Accessors)

TypeScript는 객체의 멤버에 대한 접근을 인터셉트하는 방법으로 getters/setters를 지원합니다.  
이것을 통해 각 객체에서 멤버에 접근하는 방법을 세부적으로 제어할 수 있습니다.

간단한 클래스에 `get`과 `set`을 사용하도록 변환해봅시다.
먼저 getter와 setter가 없는 예제부터 시작합시다.

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

사람들이 임의로 `fullName`을 직접 설정하는 것은 매우 편리하지만 기분 내키는 대로 이름을 바꿀 수 있다면 문제를 일으킬 수 있습니다

이 버전에서는 employee를 수정할 수 있도록 하기 전에 사용자가 passcode를 사용할 수 있는지 확인합니다.  
이를 위해 passcode를 확인할 `fullName`에 대한 직접적인 권한을 `set`으로 교체합니다.  
앞의 예제가 계속해서 원활하게 작동하도록 하기 위해 그에 상응하는 `get`을 추가합니다.

```ts
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("오류 : employee의 무단 업데이트!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

접근자가 passcode를 확인하고 있다는 것을 입증하기 위해 passcode를 수정하고 passcode가 일치하지 않을 경우 employee에게 업데이트 권한이 없다는 경고 메시지를 받을 수 있습니다.

접근자에 대해 알아야 할 몇 가지 주의사항:

첫째, 접근자를 사용하려면 ECMAScript5 이상을 출력하도록 컴파일러를 설정해야 합니다.
ECMAScript3 다운그레이드는 지원되지 않습니다.

둘째, `set`을 가지고 있지 않은 접근자는 자동적으로 `readonly`로 추론됩니다.  
이것은 코드에서 `.d.ts` 파일을 생성할 때 유용합니다. 왜냐하면 프로퍼티를 변경할 수 없다는 것을 알 수 있기 때문입니다.

# 정적 프로퍼티 (Static Properties)

지금까지는 *인스턴스*의 클래스 멤버들에 대해서만 이야기했습니다.   
인스턴스는 인스턴스화될 때 객체에서 나타납니다.  
또한 인스턴스가 아닌 클래스 자체에 볼 수 있는 *스태틱* 멤버도 생성할 수 있습니다.

이 예제에서는 모든 grid의 일반적인 값이기 때문에 origin에 `스태틱`을 사용합니다.  
각 인스턴스는 클래스의 이름을 미리 정의하여 이 값에 접근합니다.  
인스턴스의 접근자 앞에 `this.` 를 추가하는 것과 비슷하게 `스태틱` 접근자 앞에 `Grid`를 추가합니다.

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

추상 클래스는 다른 클래스가 파생될 수 있는 기본 클래스입니다.  
추상 클래스는 직접적으로 인스턴스화할 수 없습니다.  
인터페이스와 달리 추상 클래스는 클래스의 멤버에 대한 구현 세부 정보를 포함할 수 있습니다.  
`abstract` 키워드는 추상 클래스뿐만 아니라 추상 클래스 내의 추상 메서드를 정의하는 데 사용됩니다.

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

abstract으로 표시된 추상 클래스 내의 메서드는 구현을 포함하지 않으므로 파생된 클래스에서 구현해야 합니다.  
추상 메서드는 인터페이스 메서드와 유사한 구문을 사용합니다.  
둘 다 메서드 본문을 포함하지 않고 메서드를 정의합니다.  
그러나 추상 메서드는 `abstract` 키워드를 포함해야 하며 선택적으로 접근 지정자를 포함할 수 있습니다.

```ts
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void; // 파생된 클래스에서 구현해야 합니다.
}

class AccountingDepartment extends Department {

    constructor() {
        super("Accounting and Auditing"); // 파생된 클래스의 생성자는 super()를 호출해야합니다.
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}

let department: Department; // 좋아요: abstract 타입에 대한 참조를 만듭니다.
department = new Department(); // 오류: 추상 클래스의 인스턴스를 생성할 수 없습니다.
department = new AccountingDepartment(); // 좋아요: 추상적이지 않은 하위 클래스를 생성하고 할당합니다.
department.printName();
department.printMeeting();
department.generateReports(); // 오류: abstract 타입으로 선언된 메서드가 존재하지 않습니다.
```

# 고급 기법 (Advanced Techniques)

## 생성자 함수 (Constructor functions)

TypeScript에서 클래스를 선언하면 실제로 여러 선언이 동시에 생성됩니다.
첫 번째 클래스의 *인스턴스* 타입입니다.

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
console.log(greeter.greet());
```

여기서 `let greeter: Greeter`라고 할 때 `Greeter` 클래스의 인스턴스 타입으로 `Greeter`를 사용합니다.  
이것는 다른 객체 지향 언어를 사용하는 개발자에게는 거의 두 번째 특성입니다.

또한 *생성자 함수*라고 부르는 또 다른 값을 생성하고 있습니다.
이것은 클래스의 인스턴스를 `new` 할 때 호출되는 함수입니다.

실제로 이 과정이 어떻게 진행되고 있는지 확인하기 위해 위의 예제에서 생성된 JavaScript를 살펴보겠습니다:

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
console.log(greeter.greet());
```

여기서 `let Greeter`는 생성자 함수를 할 받게 될 것입니다.  
`new`를 호출하고 이 함수를 실행하면 클래스의 인스턴스를 얻습니다.  
생성자 함수에는 클래스의 모든 스태틱 멤버 또한 포함됩니다.  
각각의 클래스를 생각하는 또 다른 방법은 *인스턴스* 측면과 *스태틱* 측면이 있다는 것입니다.

이 차이를 보여 주기 위해 예제를 약간 수정해 보겠습니다:

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
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

이 예제에서 `greeter1`은 이전과 비슷하게 작동합니다.  
`Greeter` 클래스를 인스턴스화하고 이 객체를 사용합니다.   
이것은 전에 본 적이 있는 것입니다.

그런 다음 그 클래스를 직접 사용합니다.  
여기서 `greeterMaker`라는 새로운 변수를 만듭니다.  
이 변수는 클래스 자체를 유지하거나 생성자 함수라고 하는 또 다른 방법으로 설명합니다.  

여기서는 `typeof Greeter`를 사용합니다.  
즉 "인스턴스 타입이 아닌 "`Greeter` 클래스 자체의 타입을 제공합니다".  
또는 더 정확하게 생성자 함수의 타입인 "`Greeter`라는 symbol 타입을 제공합니다".  
이 타입에는 `Greeter` 클래스의 인스턴스를 생성하는 생성자와 함께 Greeter의 모든 스태틱 멤버가 포함됩니다.  
`greeterMaker`에 `new`를 사용하는 것을 보여 주며 `Greeter`의 새로운 인스턴스를 생성하고 이전과 같이 호출합니다.

## 클래스를 인터페이스로 사용하기 (Using a class as an interface)

앞서 언급한 것처럼 클래스 선언은 두 가지를 생성합니다: 클래스의 인스턴스를 나타내는 타입과 생성자 함수  
클래스는 타입을 작성하기 때문에 인터페이스를 사용할 수 있는 동일한 위치에서 타입을 사용할 수 있습니다.

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
