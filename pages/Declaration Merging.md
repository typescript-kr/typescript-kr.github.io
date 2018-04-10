# 소개

TypeScript의 고유한 개념 중 일부는 타입 레벨에서 JavaScript 객체의 형태를 설명합니다.  
특히 TypeScript에서의 고유한 예로는 '선언 병합'이라는 개념이 있습니다.  
이 개념을 이해하는 것은 기존 JavaScript를 사용할 때 이점을 제공할 것입니다.   
또한 고급 추상화 개념에 대한 문을 열어줍니다.

이 아티클의 목적인 "선언 병합"은 컴파일러가 동일한 이름으로 선언된 두개의 독립된 선언을 하나의 정의로 병합하는 것을 의미합니다.  
이 병합된 정의에는 원래 선언의 두 가지 기능이 있습니다.  
어떠한 수의 선언이든 병합할 수 있습니다. 단지 두 가지 선언에 제한되지 않습니다.

# 기본 개념 (Basic Concepts)

TypeScript에서 선언은 다음 세 가지중 중 하나 이상의 엔티티를 생성합니다: 네임스페이스, 타입 또는 값  
네임스페이스-생성 선언은 점 표기법을 사용하여 접근하는 이름이 포함된 네임스페이스를 생성합니다.  
타입-생성 선언은 다음과 같습니다: 선언된 형태로 표시되고 주어진 이름에 바인딩되는 타입을 작성합니다.  
마지막으로, 값-생성 선언은 출력된 JavaScript에서 볼 수 있는 값을 만듭니다.

|   선언 타입   | 네임스페이스 | 타입 |  값  |
|---------------|:------------:|:----:|:----:|
| Namespace     |     X        |      |   X  |
| Class         |              |   X  |   X  |
| Enum          |              |   X  |   X  |
| Interface     |              |   X  |      |
| Type Alias    |              |   X  |      |
| Function      |              |      |   X  |
| Variable      |              |      |   X  |

각 선언으로 생성된 내용을 이해하면 선언 병합을 수행할 때 병합되는 내용을 이해하는 데 도움이 됩니다.

# 인터페이스 병합 (Merging Interfaces)

가장 단순하고 아마도 가장 일반적인 타입의 선언 병합은 인터페이스 병합입니다.  
가장 기본적인 수준에서 이 병합은 두 선언의 멤버를 기계적으로 같은 이름의 단일 인터페이스에 결합시킵니다.

```ts
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

let box: Box = {height: 5, width: 6, scale: 10};
```

인터페이스의 비-함수 멤버는 고유해야합니다.  
고유하지 않다면 동일한 타입이어야합니다.  
컴파일러는 인터페이스가 모두 같은 이름이지만 다른 타입의 비-함수 멤버를 선언하는 경우 오류를 발생시킵니다.

함수 멤버의 경우 동일한 이름의 각 함수 멤버가 동일한 함수의 오버로드를 설명하는 것으로 간주됩니다.  
또한 후위의 인터페이스 `A`와 인터페이스 `A`를 병합하는 경우에는 두번째 인터페이스가 첫번째 인터페이스보다 우선 순위가 더 높다는 점이 주목됩니다.

예를 들어 다음과 같습니다:

```ts
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
```

세 개의 인터페이스가 병합되어 단일 선언을 생성합니다:

```ts
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}
```

각 그룹의 요소는 동일한 순서를 유지하지만 그룹 자체는 나중에 오버로드가 발생된 것이 가장 먼저 병합됩니다.

이 규칙에 대한 한가지 예외는 특수한 서명(specialized signatures)입니다.  
서명의 타입이 *단일* 문자열 리터럴 타입(예 : 문자열 리터럴의 유니온이 아닌)인 매개 변수가 있는 경우 병합된 오버로드 목록의 맨 위로 버블링됩니다.

예를 들어 다음 인터페이스가 함께 병합됩니다:

```ts
interface Document {
    createElement(tagName: any): Element;
}
interface Document {
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
    createElement(tagName: string): HTMLElement;
    createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

`Document`의 병합된 선언은 다음과 같습니다:

```ts
interface Document {
    createElement(tagName: "canvas"): HTMLCanvasElement;
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
    createElement(tagName: string): HTMLElement;
    createElement(tagName: any): Element;
}
```

# Merging Namespaces

Similarly to interfaces, namespaces of the same name will also merge their members.
Since namespaces create both a namespace and a value, we need to understand how both merge.

To merge the namespaces, type definitions from exported interfaces declared in each namespace are themselves merged, forming a single namespace with merged interface definitions inside.

To merge the namespace value, at each declaration site, if a namespace already exists with the given name, it is further extended by taking the existing namespace and adding the exported members of the second namespace to the first.

The declaration merge of `Animals` in this example:

```ts
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```

is equivalent to:

```ts
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```

This model of namespace merging is a helpful starting place, but we also need to understand what happens with non-exported members.
Non-exported members are only visible in the original (un-merged) namespace. This means that after merging, merged members that came from other declarations cannot see non-exported members.

We can see this more clearly in this example:

```ts
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles;  // <-- error, haveMuscles is not visible here
    }
}
```

Because `haveMuscles` is not exported, only the `animalsHaveMuscles` function that shares the same un-merged namespace can see the symbol.
The `doAnimalsHaveMuscles` function, even though it's part of the merged `Animal` namespace can not see this un-exported member.

# Merging Namespaces with Classes, Functions, and Enums

Namespaces are flexible enough to also merge with other types of declarations.
To do so, the namespace declaration must follow the declaration it will merge with. The resulting declaration has properties of both declaration types.
TypeScript uses this capability to model some of the patterns in JavaScript as well as other programming languages.

## Merging Namespaces with Classes

This gives the user a way of describing inner classes.

```ts
class Album {
    label: Album.AlbumLabel;
}
namespace Album {
    export class AlbumLabel { }
}
```

The visibility rules for merged members is the same as described in the 'Merging Namespaces' section, so we must export the `AlbumLabel` class for the merged class to see it.
The end result is a class managed inside of another class.
You can also use namespaces to add more static members to an existing class.

In addition to the pattern of inner classes, you may also be familiar with JavaScript practice of creating a function and then extending the function further by adding properties onto the function.
TypeScript uses declaration merging to build up definitions like this in a type-safe way.

```ts
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let suffix = "";
    export let prefix = "Hello, ";
}

alert(buildLabel("Sam Smith"));
```

Similarly, namespaces can be used to extend enums with static members:

```ts
enum Color {
    red = 1,
    green = 2,
    blue = 4
}

namespace Color {
    export function mixColor(colorName: string) {
        if (colorName == "yellow") {
            return Color.red + Color.green;
        }
        else if (colorName == "white") {
            return Color.red + Color.green + Color.blue;
        }
        else if (colorName == "magenta") {
            return Color.red + Color.blue;
        }
        else if (colorName == "cyan") {
            return Color.green + Color.blue;
        }
    }
}
```

# Disallowed Merges

Not all merges are allowed in TypeScript.
Currently, classes can not merge with other classes or with variables.
For information on mimicking class merging, see the [Mixins in TypeScript](./Mixins.md) section.

# Module Augmentation

Although JavaScript modules do not support merging, you can patch existing objects by importing and then updating them.
Let's look at a toy Observable example:

```js
// observable.js
export class Observable<T> {
    // ... implementation left as an exercise for the reader ...
}

// map.js
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
    // ... another exercise for the reader
}
```

This works fine in TypeScript too, but the compiler doesn't know about `Observable.prototype.map`.
You can use module augmentation to tell the compiler about it:

```ts
// observable.ts stays the same
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
    interface Observable<T> {
        map<U>(f: (x: T) => U): Observable<U>;
    }
}
Observable.prototype.map = function (f) {
    // ... another exercise for the reader
}


// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map(x => x.toFixed());
```

The module name is resolved the same way as module specifiers in `import`/`export`.
See [Modules](./Modules.md) for more information.
Then the declarations in an augmentation are merged as if they were declared in the same file as the original.
However, you can't declare new top-level declarations in the augmentation -- just patches to existing declarations.

## Global augmentation

You can also add declarations to the global scope from inside a module:

```ts
// observable.ts
export class Observable<T> {
    // ... still no implementation ...
}

declare global {
    interface Array<T> {
        toObservable(): Observable<T>;
    }
}

Array.prototype.toObservable = function () {
    // ...
}
```

Global augmentations have the same behavior and limits as module augmentations.
