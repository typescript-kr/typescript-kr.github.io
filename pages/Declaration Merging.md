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
| 네임스페이스  |     X        |      |   X  |
| 클래스        |              |   X  |   X  |
| 열거형        |              |   X  |   X  |
| 인터페이스    |              |   X  |      |
| 타입 별칭     |              |   X  |      |
| 함수          |              |      |   X  |
| 변수          |              |      |   X  |

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

# 네임스페이스 병합 (Merging Namespaces)

인터페이스와 마찬가지로 같은 이름의 네임 스페이스도 해당 멤버를 병합합니다.  
네임 스페이스는 네임 스페이스와 값을 모두 생성하기 때문에 두 네임 스페이스가 어떻게 병합되는지 이해해야 합니다.

네임 스페이스를 병합하기 위해 각 네임스페이스에 선언된 exported 인터페이스의 타입 정의 자체가 병합되며 내부에 병합된 인터페이스 정의가 있는 단일 네임스페이스를 형성합니다.

네임 스페이스 값을 병합하려면 각 선언 사이트에 지정된 이름의 네임 스페이스가 이미 있는 경우 기존 네임 스페이스를 가져와 두 번째 네임 스페이스의 내보낸 멤버를 첫 번째 네임스페이스에 추가하여 네임 스페이스를 확장합니다.

이 예에서는 `Animals`의 병합을 선언합니다:

```ts
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```

다음과 같습니다.

```ts
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```

병합된 네임스페이스의 모델은 유용한 출발점이지만 내보내지 않은(non-exported) 멤버에 무슨 일이 일어나는지 이해할 필요가 있습니다.  
내보낼 수없는 멤버는 원래 (병합되지 않은) 네임 스페이스에서만 볼 수 있습니다.  
즉, 병합 후에는 다른 선언에서 가져온 병합 된 멤버는 내보낼 수없는 멤버를 볼 수 없습니다.
내보내지 않은 멤버는 원래 네임스페이스에서만 볼 수 있습니다(병합되지 않음).  
즉 병합 후에 다른 선언에서 가져온 병합된 멤버는 내보내지 않은 멤버를 볼 수 없습니다.

이 예제에서 이것을 더 명확하게 볼 수 있습니다:

```ts
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles;  // <-- 오류, haveMuscles는 여기에 표시되지 않습니다.
    }
}
```

`haveMuscles`가 exported되지 않았기 때문에 동일하게 병합되지 않은 네임스페이스를 공유하는 `animalsHaveMuscles` 함수만 이 심볼을 볼 수 있습니다.  
`doAnimalsHaveMuscles` 함수는 병합된 `Animal` 네임스페이스의 일부임에도 불구하고 exported 되지 않은 멤버를 볼 수 없습니다.

# 클래스, 함수 그리고 열거형 병합 (Merging Namespaces with Classes, Functions, and Enums)

네임스페이스는 다른 타입의 선언과도 통합이 가능할 정도로 유연합니다.  
이렇게 하려면 네임스페이스 선언이 병합할 선언을 따라야 합니다.  
결과 선언에는 두 선언 타입의 프로퍼티가 있습니다.  
TypeScript는 이 기능을 사용하여 JavaScript의 일부 패턴과 다른 프로그래밍 언어를 모델링 합니다.

## 클래스와 네임스페이스 병합 (Merging Namespaces with Classes)

이는 사용자에게 내부(inner) 클래스를 설명하는 방법을 제공합니다.

```ts
class Album {
    label: Album.AlbumLabel;
}
namespace Album {
    export class AlbumLabel { }
}
```

병합된 멤버의 가시성 규칙은 '네임스페이스 병합' 섹션에 설명된 것과 같으므로 병합된 클래스를 보려면 `AlbumLabel` 클래스를 export해야 합니다.  
최종 결과는 다른 클래스 내부에서 관리되는 클래스입니다.  
네임스페이스를 사용하여 기존 클래스에 더 많은 정적 멤버를 추가할 수도 있습니다.

내부 클래스 패턴 외에도 함수를 생성한 다음 함수에 프로퍼티를 추가하여 함수를 확장하는 JavaScript 방법에 익숙할 수도 있습니다.  
TypeScript는 이러한 타입을 안전한(type-safe) 방법으로 정의하기 위해 선언 병합을 사용합니다.

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

마찬가지로 네임스페이스를 사용하여 정적 멤버를 포함하는 열거형을 확장할 수 있습니다:

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

# 허용되지 않는 병합 (Disallowed Merges)

TypeScript에서는 일부 병합이 허용되지 않습니다.  
현재 클래스는 다른 클래스 또는 변수와 병합할 수 없습니다.  
클래스 병합을 모방하는 방법에 대한 자세한 내용은 [TypeScript의 Mixins](./Mixins.md) 섹션을 참조하세요.

# 모듈 확대 (Module Augmentation)

JavaScript 모듈은 병합을 지원하지 않지만 기존 객체를 가져 와서 업데이트할 수 있습니다.  
Observable 예제를 살펴봅시다:

```js
// observable.js
export class Observable<T> {
    // ... 구현은 숙제로 남겨놨습니다 ...
}

// map.js
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
    // ... 또 다른 숙제
}
```

이것은 TypeScript에서도 잘 작동하지만 컴파일러는 `Observable.prototype.map`에 대해 알지 못합니다.  
이런 경우 모듈 확대를 사용하여 컴파일러에 다음에 대해 알릴 수 있습니다:

```ts
// observable.ts는 그대로 유지됩니다.
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
    interface Observable<T> {
        map<U>(f: (x: T) => U): Observable<U>;
    }
}
Observable.prototype.map = function (f) {
    // ... 또 다른 숙제
}


// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map(x => x.toFixed());
```

모듈 이름은 `import`/`export`의 모듈 지정자와 동일한 방법으로 해석됩니다.  
자세한 내용은 [모듈](./Modules.md)을 참조하세요.  
확대되는 선언은 마치 원본과 같은 파일에 선언된 것처럼 병합됩니다.  
그러나 확대에서 새로운 최상위 레벨 선언을 새롭게 할 수는 없습니다. -- 기존 선언에 패치 만하면됩니다.

## 전역 확대 (Global augmentation)

모듈 내부에서 전역 스코프 선언을 추가할 수도 있습니다.

```ts
// observable.ts
export class Observable<T> {
    // ... 여전히 구현되지 않고 있습니다 ...
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

전역 확대는 모듈 확대와 동일한 작동 및 제한 사항을 가집니다.