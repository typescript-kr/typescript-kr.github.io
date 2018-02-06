# 소개 (Introduction)

전통적인 JavaScript는 재사용 가능한 컴포넌트를 만들기 위해 함수와 프로토 타입 기반의 상속을 사용하지만  
 클래스가 함수을 상속하고 객체가 이러한 클래스에서 구축되는 객체 지향 접근 방식에 익숙하지 않은 개발자들에게는 다소 어색함을 느낄 수 있습니다.  
ECMAScript6로도 알려진 ECMAScript 2015년을 시작으로 JavaScript 개발자는 이 객체 지향 클래스 기반 접근 방식을 사용하여 응용 프로그램을 구축 할 수 있습니다.  
TypeScript에서는 개발자가 이 기술을 사용하고 다음 JavaScript 버전을 기다리지 않고도 모든 메이저 브라우저와 플랫폼에서 작동하는 JavaScript로 컴파일 할 수 있습니다.

# 클래스 (Classes)

간단한 클래스 기반 예제를 살펴 보겠습니다:

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

클래스의 멤버 중 하나를 참조 할 때 클래스에서 `this`를 앞에 접두어로 붙입니다.
이것은 멤버에 접근하는 것을 뜻합니다.

마지막 줄에서는 `new`를 사용하여 `Greeter` 클래스의 인스턴스를 만듭니다.  
이것은 이전에 정의한 생성자를 호출하여 `Greeter` 형태의 새 객체를 만들고 생성자를 실행하여 이를 초기화합니다.

# 상속 (Inheritance)

TypeScript에서는 일반적인 객체 지향 패턴을 사용할 수 있습니다.
클래스 기반 프로그래밍에서 가장 기본적인 패턴 중 하나는 상속을 사용하여 기존 클래스를 확장하여 새로운 클래스를 생성할 수 있다는 것입니다.

예제를 살펴 보겠습니다:

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
파생 클래스는 종종 *하위클래스(subclasses)* 라고하며 기본 클래스는 *슈퍼클래스(superclasses)* 라고도 합니다.

`Dog`는 `Animal`로부터 기능을 확장시키기 때문에 `bark()`와 `move()` 둘다 할 수 있는 `Dog`의 인스턴스를 만들 수 있었습니다.

이제 좀 더 복잡한 예제를 살펴 보겠습니다.

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
이번에도 `Animal`의 새로운 하위클래스인 `Horse`과 `Snake`을 만드는 `extends` 키워드가 등장합니다.

이전 예제와의 한 가지 다른 점은 생성자 함수를 포함하는 각 파생 클래스가 기본 클래스의 생성자를 실행할 `super()`를 호출*해야한다는 것*입니다.  
게다가 생성자내에서 `this`에 있는 프로퍼티에 접근하기 전에 *항상* `super()`를 *호출해야합니다*.  
이것은 TypeScript가 적용할 중요한 규칙입니다.

또한 이 예제에서는 기본 클래스의 메서드를 하위 클래스에 특화된 메서드를 오버라이드하는 방법도 보여 줍니다.

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


다른 언어의 클래스에 익숙하다면 위의 예제에서 `public`이라는 단어를 사용하지 않아도 된다는 사실을 알았을것입니다.  
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
두개의 다른 타입을 비교할 때 그것들이 어디서 왔는지에 관계없이 모든 멤버의 타입이 호환 가능하다면 그 타입 자체가 호환성(compatible)이 있다고 말합니다.

그러나 `private` 및 `protected`멤버가 있는 타입을 비교할 때 이러한 타입들은 다르게 처리합니다.

호환성(compatible)이 있는 것으로 판단되는 두 가지 타입 중 `private`멤버가 있는 경우 다른 멤버는 동일한 선언에서 유래된 `private`멤버가 있어야합니다. 이것은 `protected`멤버에도 적용됩니다.

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

생성자 또한 `protected`로 표시 될 수도 있습니다.  
즉 클래스를 포함하는 클래스 외부에서 클래스를 인스턴스화 할 수는 없지만 확장될 수는 있습니다.

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

마지막 예제에서 `Octopus` 클래스에서 readonly 멤버 `name`과 생성자 매개변수 `theName`을 선언했습니다.  
그 다음 바로 `name`을 `theName`으로 설정했습니다.

이것은 매우 일반적인 방법입니다.  
*매개변수 프로퍼티(Parameter properties)* 를 사용하면 한곳에서 멤버를 생성하고 초기화할 수 있습니다.  
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
마찬가지로 `public`, `protected` 그리고 `readonly`도 마찬가지입니다.

# Accessors

TypeScript supports getters/setters as a way of intercepting accesses to a member of an object.
This gives you a way of having finer-grained control over how a member is accessed on each object.

Let's convert a simple class to use `get` and `set`.
First, let's start with an example without getters and setters.

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

While allowing people to randomly set `fullName` directly is pretty handy, this might get us in trouble if people can change names on a whim.

In this version, we check to make sure the user has a secret passcode available before we allow them to modify the employee.
We do this by replacing the direct access to `fullName` with a `set` that will check the passcode.
We add a corresponding `get` to allow the previous example to continue to work seamlessly.

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

To prove to ourselves that our accessor is now checking the passcode, we can modify the passcode and see that when it doesn't match we instead get the message warning us we don't have access to update the employee.

A couple of things to note about accessors:

First, accessors require you to set the compiler to output ECMAScript 5 or higher.
Downlevelling to ECMAScript 3 is not supported.
Second, accessors with a `get` and no `set` are automatically inferred to be `readonly`.
This is helpful when generating a `.d.ts` file from your code, because users of your property can see that they can't change it.

# Static Properties

Up to this point, we've only talked about the *instance* members of the class, those that show up on the object when it's instantiated.
We can also create *static* members of a class, those that are visible on the class itself rather than on the instances.
In this example, we use `static` on the origin, as it's a general value for all grids.
Each instance accesses this value through prepending the name of the class.
Similarly to prepending `this.` in front of instance accesses, here we prepend `Grid.` in front of static accesses.

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

Abstract classes are base classes from which other classes may be derived.
They may not be instantiated directly.
Unlike an interface, an abstract class may contain implementation details for its members.
The `abstract` keyword is used to define abstract classes as well as abstract methods within an abstract class.

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

Methods within an abstract class that are marked as abstract do not contain an implementation and must be implemented in derived classes.
Abstract methods share a similar syntax to interface methods.
Both define the signature of a method without including a method body.
However, abstract methods must include the `abstract` keyword and may optionally include access modifiers.

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

When you declare a class in TypeScript, you are actually creating multiple declarations at the same time.
The first is the type of the *instance* of the class.

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

Here, when we say `let greeter: Greeter`, we're using `Greeter` as the type of instances of the class `Greeter`.
This is almost second nature to programmers from other object-oriented languages.

We're also creating another value that we call the *constructor function*.
This is the function that is called when we `new` up instances of the class.
To see what this looks like in practice, let's take a look at the JavaScript created by the above example:

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

Here, `let Greeter` is going to be assigned the constructor function.
When we call `new` and run this function, we get an instance of the class.
The constructor function also contains all of the static members of the class.
Another way to think of each class is that there is an *instance* side and a *static* side.

Let's modify the example a bit to show this difference:

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

In this example, `greeter1` works similarly to before.
We instantiate the `Greeter` class, and use this object.
This we have seen before.

Next, we then use the class directly.
Here we create a new variable called `greeterMaker`.
This variable will hold the class itself, or said another way its constructor function.
Here we use `typeof Greeter`, that is "give me the type of the `Greeter` class itself" rather than the instance type.
Or, more precisely, "give me the type of the symbol called `Greeter`," which is the type of the constructor function.
This type will contain all of the static members of Greeter along with the constructor that creates instances of the `Greeter` class.
We show this by using `new` on `greeterMaker`, creating new instances of `Greeter` and invoking them as before.

## Using a class as an interface

As we said in the previous section, a class declaration creates two things: a type representing instances of the class and a constructor function.
Because classes create types, you can use them in the same places you would be able to use interfaces.

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
