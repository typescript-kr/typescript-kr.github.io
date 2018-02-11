# 소개 (Introduction)

TypeScript의 타입 호환성은 구조적 하위 타입을 기반으로합니다.  
구조적 타이핑은 멤버에 따라 타입을 관계시키는 방법입니다.  
이것은 명사뿐인 타이핑과 대조적입니다.

다음 코드를 살펴보세요 :

```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// 좋아요 구조적 타이핑이니까
p = new Person();
```

C# 또는 Java 같은 명사적인 언어에서는 `person` 클래스가 자신을 `Named` 인터페이스의 구현체로 명시적으로 기술하지 않기 때문에 동일한 코드가 오류가 될 수 있습니다.

TypeScript의 구조적인 타입 시스템은 일반적으로 JavaScript 코드가 작성된 방식에 따라 설계되었습니다.

JavaScript는 함수 표현식이나 객체 리터럴과 같은 익명의 객체를 광범위하게 사용하기 때문에 이름뿐인 구조적 타입 시스템 대신 JavaScript 라이브러리에서 발견되는 관계의 타입을 표현하는 것이 훨씬 자연스럽습니다.

## 안전성에 대한 노트 (A Note on Soundness)

TypeScript의 타입 시스템을 사용하면 완료시 알 수 없는 특정 작업을 안전하게 수행할 수 있습니다.  
타입 시스템에 이 프로퍼티가 있으면 그것은 "타당"한 것이 아니라고 합니다.

TypeScript에서 부적절한 동작을 허용하는 곳을 신중하게 고려했으며 이 문서 전체에서 이러한 상황이 발생하는 곳과 그 뒤에있는 숨겨진 동기 부여 시나리오에 대해 설명합니다.

# 시작하기 (Starting out)

TypeScript의 구조 타입 시스템에 대한 기본적인 규칙은 `y`가 적어도`x`와 같은 멤버를 가지고 있다면 `x`는 `y`와 호환된다는 것입니다.

예를 들어:

```ts
interface Named {
    name: string;
}

let x: Named;
// y의 추론된 타입은 { name: string; location: string; } 입니다
let y = { name: "Alice", location: "Seattle" };
x = y;
```

`y`가 `x`에 할당될 수 있는지를 검사하기 위해 컴파일러는 `x`의 각 프로퍼티를 검사하여 `y`에서 상응하는 호환되는 프로퍼티를 찾습니다.

이 경우 `y`는 문자열인 `name` 멤버를 가져야합니다. 그렇기 때문에 할당이 허용됩니다.

함수 호출 인수를 검사할 때 다음과 같은 할당 규칙이 사용됩니다 :

```ts
function greet(n: Named) {
    alert("Hello, " + n.name);
}
greet(y); // 좋아요
```

`y`는 별도의 `location` 프로퍼티를 가지고 있지만  이로 인해 오류가 생기는 것은 아니라는 점에 유의한다.  

호환성을 검사할 때 대상의 타입 (이 경우 `Named`) 멤버만 고려됩니다.

이 비교 프로세스는 재귀적으로 진행되어 각 구성원 및 하위 멤버의 유형을 탐색합니다.

# 두 함수 비교 (Comparing two functions)

While comparing primitive types and object types is relatively straightforward, the question of what kinds of functions should be considered compatible is a bit more involved.
Let's start with a basic example of two functions that differ only in their parameter lists:

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

To check if `x` is assignable to `y`, we first look at the parameter list.
Each parameter in `x` must have a corresponding parameter in `y` with a compatible type.
Note that the names of the parameters are not considered, only their types.
In this case, every parameter of `x` has a corresponding compatible parameter in `y`, so the assignment is allowed.

The second assignment is an error, because `y` has a required second parameter that `x` does not have, so the assignment is disallowed.

You may be wondering why we allow 'discarding' parameters like in the example `y = x`.
The reason for this assignment to be allowed is that ignoring extra function parameters is actually quite common in JavaScript.
For example, `Array#forEach` provides three parameters to the callback function: the array element, its index, and the containing array.
Nevertheless, it's very useful to provide a callback that only uses the first parameter:

```ts
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach(item => console.log(item));
```

Now let's look at how return types are treated, using two functions that differ only by their return type:

```ts
let x = () => ({name: "Alice"});
let y = () => ({name: "Alice", location: "Seattle"});

x = y; // OK
y = x; // Error because x() lacks a location property
```

The type system enforces that the source function's return type be a subtype of the target type's return type.

## Function Parameter Bivariance

When comparing the types of function parameters, assignment succeeds if either the source parameter is assignable to the target parameter, or vice versa.
This is unsound because a caller might end up being given a function that takes a more specialized type, but invokes the function with a less specialized type.
In practice, this sort of error is rare, and allowing this enables many common JavaScript patterns. A brief example:

```ts
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + "," + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + "," + e.y)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

## Optional Parameters and Rest Parameters

When comparing functions for compatibility, optional and required parameters are interchangeable.
Extra optional parameters of the source type are not an error, and optional parameters of the target type without corresponding parameters in the source type are not an error.

When a function has a rest parameter, it is treated as if it were an infinite series of optional parameters.

This is unsound from a type system perspective, but from a runtime point of view the idea of an optional parameter is generally not well-enforced since passing `undefined` in that position is equivalent for most functions.

The motivating example is the common pattern of a function that takes a callback and invokes it with some predictable (to the programmer) but unknown (to the type system) number of arguments:

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

## Functions with overloads

When a function has overloads, each overload in the source type must be matched by a compatible signature on the target type.
This ensures that the target function can be called in all the same situations as the source function.

# Enums

Enums are compatible with numbers, and numbers are compatible with enums. Enum values from different enum types are considered incompatible. For example,

```ts
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  //error
```

# Classes

Classes work similarly to object literal types and interfaces with one exception: they have both a static and an instance type.
When comparing two objects of a class type, only members of the instance are compared.
Static members and constructors do not affect compatibility.

```ts
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  //OK
s = a;  //OK
```

## Private and protected members in classes

Private and protected members in a class affect their compatibility.
When an instance of a class is checked for compatibility, if the target type contains a private member, then the source type must also contain a private member that originated from the same class.
Likewise, the same applies for an instance with a protected member.
This allows a class to be assignment compatible with its super class, but *not* with classes from a different inheritance hierarchy which otherwise have the same shape.

# Generics

Because TypeScript is a structural type system, type parameters only affect the resulting type when consumed as part of the type of a member. For example,

```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // okay, y matches structure of x
```

In the above, `x` and `y` are compatible because their structures do not use the type argument in a differentiating way.
Changing this example by adding a member to `Empty<T>` shows how this works:

```ts
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // error, x and y are not compatible
```

In this way, a generic type that has its type arguments specified acts just like a non-generic type.

For generic types that do not have their type arguments specified, compatibility is checked by specifying `any` in place of all unspecified type arguments.
The resulting types are then checked for compatibility, just as in the non-generic case.

For example,

```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // Okay because (x: any)=>any matches (y: any)=>any
```

# Advanced Topics

## Subtype vs Assignment

So far, we've used 'compatible', which is not a term defined in the language spec.
In TypeScript, there are two kinds of compatibility: subtype and assignment.
These differ only in that assignment extends subtype compatibility with rules to allow assignment to and from `any` and to and from enum with corresponding numeric values.

Different places in the language use one of the two compatibility mechanisms, depending on the situation.
For practical purposes, type compatibility is dictated by assignment compatibility even in the cases of the `implements` and `extends` clauses.
For more information, see the [TypeScript spec](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md).
