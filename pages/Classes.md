# 소개 (Introduction)

전통적인 JavaScript는 재사용 가능한 컴포넌트를 만들기 위해 함수와 프로토 타입 기반의 상속을 사용하지만 클래스가 함수을 상속하고 객체가 이러한 클래스에서 구축되는 객체 지향 접근 방식에 익숙하지 않은 개발자들에게는 다소 어색함을 느낄 수 있습니다.
ECMAScript6로도 알려진 ECMAScript 2015년을 시작으로 JavaScript 개발자는 이 객체 지향 클래스 기반 접근 방식을 사용하여 응용 프로그램을 구축 할 수 있습니다.
TypeScript에서는 개발자가 이 기술을 사용하고 다음 JavaScript 버전을 기다리지 않고도 모든 메이저 브라우저와 플랫폼에서 작동하는 JavaScript로 컴파일 할 수 있습니다.

# Classes

Let's take a look at a simple class-based example:

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

C# 또는 자바를 사용한 적이 있는 경우 구문이 익숙하게 보여집니다.
우리는 새로운 클래스인 'Greeter'를 선언합니다. 이 클래스는 3개의 'greeting'이라고 불리는 프로퍼티와 'greet' 메소드, 한개의 컨스트럭터를 가지고 있습니다. 
You'll notice that in the class when we refer to one of the members of the class we prepend `this.`.
(멤버의 접두어 this는 클래스의 멤버인 것을 알아챌 수 있습니다.)
이는 멤버의 access임을 나타냅니다. 
마지막 라인에서 예시로 새로운 'Greeter' class를 생성합니다. 앞에서 정의한 생성자를 호출하여, 'Greeter' 모양으로 새 객체를 만들고 실행하여 초기화 합니다. 

# 상속 (Inheritance)

타입스크립트에서 우리는 일반적인 객체지향 패턴을 사용할 수 있습니다. 
클래스에서 가장 기본적인 패턴중의 하나는 기존 클래스를 상속을 사용하여 확장하여 새로운 클래스를 만들 수 있습니다. 

Let's take a look at an example:

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

이 예에서는 가장 기본적인 상속 기능을 보여줍니다:클래스는 기본 클래스로부터 프로퍼티와 메소드를 상속 받습니다. 
'Dog'는 확장 키워드를 사용하는 'Animalbase' 클래스에서 파생된 클래스입니다. 
파생 클래스는 subClass(하위 클래스)라고 하며, 기본 클래스는 superClass(상위 클래스)라고도 합니다. 

'Dog'이 'Animal'로부터 기능을 확장하기 때문에 우리는 Dog이 bark()와 move() 할 수 있는 예를 만들 수 있었습니다. 

좀 더 복잡한 예시:

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

이 예서는 이전에 언급하지 않았던 몇가지 다른 기능에 대해서도 다룹니다. 
다시 'extends' 키워드를 사용하여 'Animal'에서 'Horse'와 'Snake'라는 'subClass'를 생성하였습니다. 

이전 예제와 한가지 다른 점은 생성자 함수를 포함하는 각 파생 클래스가 기본 클래스의 생성자를 실행한 'super()'를 호출해야 한다는 것입니다. 게다가 생성자 본문에서 이 속성을 액세스 하기 전에 'super()'를 호출해야 합니다. 이것은 typescript에서 시행할 가장 중요한 규칙입니다. 

이 예에서는 하위 클래스 전용 메소드를 사용하여 기본 클래스의 메소드를 재정의 하는 방법도 보여줍니다. 
여기서 'Snake'와 'Horse'는 'Animal'로부터 오버라이드 하는 move 메소드를 생성하여 각 클래스 별로 기능을 부여합니다. 
'tom'은 'Animal'로 선언되었지만 그 값이 'Horse'이기 때문에 tom.move(34)를 호출하면 'Horse'의 재정의 메소드가 호출됩니다. 

```Text
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

# Public, private, and protected modifiers

## Public by default

이 예제에서 우리가 프로그램을 통해 선언한 'member'들에게 자유롭게 접근 할 수 있었습니다. 다른 언어의 class에 익숙하다면 위의 예에서 알 수 있듯이 우리는 'public'이라는 단어를 사용하지 않아도 된다는 것을 알았을 것입니다. 
예를 들어 C#에서는 각 'meber'는 'public'을 명시적으로 표시해야 됩니다. Typescript에서는 각 member는 기본적으로 public입니다.

여전히 'public'을 명시적으로 표현 할 수 있습니다.
우리는 이전의 Animal 클래스를 다음과 같이 작성할 수 있었습니다.

```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

## Understanding `private`

'private'표시를 할때 그것은 포함된 클래스의 외부에서 접근 할 수 없습니다.

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // Error: 'name' is private;
```

Typescript는 구조유형 시스템입니다. 
우리가 두 종류를 비교할 때 그들이 어디서 왔든 모든 구성원의 유형이 호환 가능할 경우 유형 자체가 호환 가능하다고 말합니다.

그러나 'private' 및 'protected'멤버가 있는 형식을 비교할 때 우리는 이러한 유형을 다르게 취급합니다. 두 유형이 호환되는 것으로 간주되는 경우, 한 유형에 'private'멤버가 있으면 다른 유형은 동일한 선언문에서 유래한 'private'멤버가 있어야 합니다. 보호되는 구성원에게도 동일한 사항이 적용됩니다. 

예를 들어보면 실제로 어떻게 작동하는지 확인 할 수 있습니다:

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
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

이러한 클래스의 인스턴스를 생성한 다음 서로 할당하여 어떤 일이 발생하는지 봅니다. 

이 예에서는 'Animal'과 'Rhino'가 있으며 'Rhino'는 'Animal'의 하위 클래스입니다. 
In this example, we have an `Animal` and a `Rhino`, with `Rhino` being a subclass of `Animal`.
우리는 또한 모양면에서 'Animal'과 같아 보이는 새로운 클래스 'employee'를 가지고 있습니다. 
We also have a new class `Employee` that looks identical to `Animal` in terms of shape.
We create some instances of these classes and then try to assign them to each other to see what will happen.
(Animal과 Rhino는 같은 이름의 private 선언에서 자신의 모양의 private를 공유하기 때문에 호환됩니다)그러나 이는 Employee와 다릅니다. 
Because `Animal` and `Rhino` share the `private` side of their shape from the same declaration of `private name: string` in `Animal`, they are compatible. However, this is not the case for `Employee`.
(Employee를 Animal에 배정하려고 하면 이러한 유형이 호환되지 않는 다는 오류가 발생합니다. Employee에는 name이라는 private멤버가 있지만, animal에서 선언한 멤버는 아닙니다.
When we try to assign from an `Employee` to `Animal` we get an error that these types are not compatible.
Even though `Employee` also has a `private` member called `name`, it's not the one we declared in `Animal`.

## 'protected' 이해하기 [Understanding `protected`]

'protected modifier'는 'private modifier'와 매우 유사하게 동작합니다. 단, 'protected'로 선언된 멤버는 파생 클래스의 인스턴스에서 액세스 할 수 있습니다.

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
console.log(howard.name); // error
```

'Person'의 외부에서 'name'을 사용할수는 없지만 'Employee'가 'Person'에서 파생되기 때문에 우리는 'Employee'의 인스턴스 메소드 내에서 여전히 그것을 사용할 수 있습니다. 

생성자도 'protected'를 선언할수 있습니다.즉, 클래스를 포함하는 클래스 외부에서 클래스를 인스턴스화 할수는 없지만 확장할 수는 있습니다.

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee can extend Person
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
let john = new Person("John"); // Error: The 'Person' constructor is protected
```

# Readonly modifier

'readony' 키워드를 사용하여 'readondy' 프로퍼티를 만들수있습니다. 'readonly' 프로퍼티는 선언시 또는 생성자에서 초기화 합니다. 

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // error! name is readonly.
```

## Parameter properties

이 예시에서 우리는 'Octopus' 클래스 안에서 'readonly name member'와 'theName'이라는 생성자 파라미터를 선언하고 'name'을 'theName'으로 설정합니다. 이것은 매우 일반적인 관행입니다. 파라미터 프로퍼니는 한곳에서 회원을 만들고 초기화 할 수 있게 해줍니다.'parameter properties' 속성을 사용하여 이전 'Octopus' 클래스의 추가 개정판을 작성합니다.
매개 변수 프로퍼티를 사용하는 이전`Octopus` 클래스의 추가 개정판이 있습니다:

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

우리가 'theName'을 어떻게 삭제하고 단축 된 'readonly'이름을 사용했는지 주목하십시오:'string parameter'를 사용하여 'name member'를 만들고 초기화 하십시오. 우리는 선언과 할당을 하나의 위치로 통합했습니다. 

'parameter' 속성은 접근성 수정자나 'readonly'로 또는 둘 모두로 생성자 파라미터 앞에 접두러를 붙임으로써 선언됩니다. 매개 변수 속성에 'private'를 사용하면 전용 멤버가 선언되고 초기화 됩니다. 마찬가지로 'public', 'protected', 'readonly'로도 동일하게 수행됩니다.

# Accessors

'Typescript'는 개체의 구성원에 대한 액세르를 가로채는 방법으로 'getters/setters'를 지원합니다. 이를 통해 각 개체에서 멤버에 액세스 하는 방법을 세부적으로 제어할 수 있습니다.

'get'과 'set'을 사용하는 간단한 클래스로 변환해보자. 먼저 'getters'와 'setters'가 없이 예를 들어보자 

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

사람들이 무작위로 'fullName'을 설정하는 것이 편하지만 기분 내키는 대로 이름을 바꿀수 있다면 문제가 발생할 수 있습니다.

이 버전에서는 'employee'를 수정하도록 허용하기 전에 사용자가 비밀암호를 사용 할 수 있는지 확인합니다. 우리는 'fullName'에 대한 직접 액세스를 패스 코드를 검사하는 세트로 바꾸어 이를 수행합니다. 
이전 예제가 계속 원활하게 작동 할 수 있도록 해당 'get'을 추가합니다. 

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
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

(접근 자가 현재 패스코드를 확인하고 있음을 증명합니다?)우리는 패스 코드를 수정할수 있으며 일치하지 않을 때 직원에게 업데이트 할 수 잇는 권한이 없다는 경고 메시지를 받게 됩니다.

접근자에 대해 몇가지 주의해야 할 사항들:

먼저, 'accessors'는 당신이 컴파일러를 'ecma5'이상으로 설정할 것을 요구합니다. 'ecma3'에 대한 다운그레이드는 지원되지 않습니다. 두번째로 집합이 없는 액세스 권한을 가진 사용자는 자동으로 'readonly'로 간주됩니다. (get 및 no 세트가 있는 접근자는 자동으로 readonly로 간주)
이는 코드에서 a.d.ts파일을 생성 할 때 유용합니다. 왜냐하면 사용자가 속성을 변경할 수 없다는 것을 알 수 있기 때문입니다.

# Static Properties

우리는 클래스의 인스턴스 멤버에 대해서만 이야기 했었습니다. 인스턴스 멤버가 인스턴스화 될 때 객체에 나타나는 'instance' 멤버에 대해서만 이야기했습니다. 
또한 인스턴스 대신 클래스 자체에서 볼 수있는 클래스의 정적 멤버를 만들 수도 있습니다. 
이 예제에서 모든 격자의 일반적인 값이기 때문에 우리는 원점에 'static'을 사용합니다. 각 인스턴스는 클래스 이름 앞에 값을 사용하여 이 값에 액세스합니다. (this와 유사하게 준비합니다?). (인스턴스 접근 앞에서 우리는 Grid를 준비한다. 정적 액세스 이전에)

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

# Abstract Classes
추상적인 클래스는 다른 클래스가 파생될 수 있는 기본 클래스입니다. 
직접 인스턴스화되지 않을 수 있습니다.
인터페이스와 달리, 추상적인 클래스는 그것의 memaber들을 위한 실행 세부 사항들을 포함할 수 있습니다.
추상적인 키워드는 추상적인 클래스 안에서 추상적인 방법뿐만 아니라 추상적인 클래스를 정의하는 데 사용됩니다

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```
추상적으로 표시된 추상적인 클래스 내의 방법은 구현을 포함하지 않으며 파생 클래스에서 구현되어야 합니다.
추상 메소드는 인터페이스 메소드와 유사한 구문을 공유합니다.
둘 다 메소드 본문을 포함하지 않고 메소드의 서명을 정의합니다.
그러나 추상 메서드는 'abstract' 키워드를 포함해야하며 선택적으로 액세스 한정자를 포함 할 수 있습니다

```ts
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {

    constructor() {
        super("Accounting and Auditing"); // constructors in derived classes must call super()
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}

let department: Department; // ok to create a reference to an abstract type
department = new Department(); // error: cannot create an instance of an abstract class
department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
department.generateReports(); // error: method doesn't exist on declared abstract type
```

# Advanced Techniques

## Constructor functions

typescript에서 클래스를 선언할때 동시에 여러 선언을 작성하고 있습니다. 첫번째는 클래스의 'instance' 유형입니다. 

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
여기 'let greeter:Greeter'를 사용하는 것에 말하자면 우리는 'Greeter'를 'Greeter'의 인스턴스타입으로 사용합니다. 이것은 객체지향언어에서 프로그래머에게 거의 두번째 성격입니다. 

우리는 또한 우리가 'constructor function'이라고 불리우는 다른것을 생성합니다. 
이것은 클래스의 인스턴스를 새로 만들 때 호출되는 함수입니다. 
이 함수는 class에서 'new'라고 불리는 instance입니다.
실제로 어떤 모습인지 보려면 위의 예제로 만든 javascript를 살펴 보겠습니다. 

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
여기 'let Greeter'는 생성자 함수를 할당하려고 합니다. 'new'를 호출하고 이 함수를 실행하면 클래스의 인스턴스를 얻습니다. 
생성자 함수는 또한 클래스의 모든 정적 멤버로 포함된다.
각 클래스를 생각하는 또 다른 방법은 'instance'면 과 'static' 면이 있다는 것입니다 

이 차이를 보여주기 위해 예제를 약간 수정해 봅시다. 

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

이 예시에서 'greeter1'은 전과 비슷하게 작동합니다. 'Greeter'클래스를 인스턴스화 하고 이 객체를 사용합니다. 이것은 우리가 전에 본적이 있습니다.

그런다음 클래스를 직접 사용합니다. 'greeterMake'r라는 새로운 변수를 만듭니다. 이 변수는 
클래스 자체를 보유하거나 다른 방법으로 생성자 함수를 나타냅니다. 여기서 우리는 'typeType Greeter'를 사용합니다. 즉, 인스턴스 유형이 아닌 "Greeter 클래스 자체의 유형을 지정하십시오" 또는 좀 더 정확히 말하면 "생성자 함수의 유형 인 'Greeter'라는 심볼 유형을 제공하십시오. 이 유형에는 'Greeter'의 모든 정적 멤버가 'Greeter' 클래스의 인스턴스를 생성하는 생성자와 함께 포함됩니다. 'greeterMaker'에서 'new'를 사용하여 'Greeter'의 새로운 인스턴스를 생성하고 이전과 같이 호출하여 이를 보여줍니다.

## Using a class as an interface

앞에서 말했듯이, 클래스 선언은 두 가지를 생성합니다 : 클래스의 인스턴스를 나타내는 유형과 생성자 함수. 클래스는 유형을 작성하기 때문에 인터페이스를 사용할 수있는 동일한 장소에서 유형을 사용할 수 있습니다.

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
