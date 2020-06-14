# Mixin

## 소개(Introduction)

전통적인 객쳬지향 계층과 함께, 재사용 가능한 컴포넌트로 부터 클래스를 빌드하는 또 다른 일반적인 방법으로, 간단한 부분클래스를 결합하여 빌드하는 것입니다. 스칼라 등의 언어를 통해서, 믹스인에 대한 개념과 특성은 익숙할 수 있을 것이며, 패턴은 JavaScript 커뮤니티에서도 어느 정도의 인기를 얻었습니다.

## 예시 코드(Code Sample)

아래 코드에서는 `TypeScript`에서 `mixin`의 모델링 방식을 보여줍니다. 코드를 본 후, 작동 방식을 살펴보도록 하겠습니다.

```ts
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Actiavatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }
}

interface SmartObject extends Disposable, Activatable {}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
```

## 예시 알아보기(Understanding the sample)

예시 코드는 `mixin`을 수행하는 두 클래스로 시작합니다. 두 클래스는 각각 부분적인 기능에 집중되어 있음을 알 수 있습니다. 이후에는 두 기능을 모두 사용하여 새로운 클래스를 만들기 위해 이들을 혼합(mix)할 것입니다.

```ts
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
```

다음으로, 두 mixin의 결합을 처리 할 클래스를 만듭니다. 이것이 어떻게 작동하는지 더 자세히 살펴 보겠습니다.

```ts
class SmartObject {
    ...
}

interface SmartObject extends Disposable, Activatable {}
```

첫 번째 사항은 `SmartObject` 클래스에서 `Disposable`과 `Activatable`을 확장하는 대신 `SmartObject` 인터페이스에서 확장한다는 것입니다. `Declaration merging`으로 인해 `SmartObject` 인터페이스가 `SmartObject` 클래스에 혼합됩니다.

클래스를 인터페이스로 취급하고 `Disposable` 및 `Activatable` 뒤에있는 유형 만 구현이 아닌 `SmartObject` 유형으로 혼합합니다. 이것은 우리가 클래스에서 구현에서 mixin을 제공해야 한다는 것을 의미합니다. 그 외에는 `mixin`의 사용을 피할 수 있습니다.

마지막으로 클래스에 구현에서, `mixin`을 혼합(mix)합니다.

```ts
applyMixins(SmartObject, [Disposable, Activatable]);
```

마지막으로, 우리를 위해 `mixin`을 수행 할 도우미 함수를 만듭니다. 그러면 각 `mixin`의 속성이 실행되고 `mixin`의 대상으로 복사되어 독립형 속성을 구현합니다.

```ts
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
```
