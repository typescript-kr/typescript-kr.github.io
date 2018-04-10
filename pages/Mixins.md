# 소개

전통적인 OO 계층 구조와 함께 재사용 가능한 컴포넌트로 클래스를 구축하는 또 다른 보편적인 방법은 더 간단한 부분의 클래스를 결합하여 클래스를 구축하는 것입니다.  
여러분은 스칼라와 같은 언어에서의 믹스인이나 특성에 대한 사상에 익숙할 수 있으며 이 패턴은 JavaScript 커뮤니티에서도 인기를 얻고 있습니다.

# 믹스인 샘플

아래 코드에서는 TypeScript에서 믹스인을 모델링하는 방법을 보여줍니다.  
코드가 끝나면 어떻게 작동하는지 분석해보겠습니다.

```ts
// Disposable 믹스인
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable 믹스인
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }

    // Disposable
    isDisposed: boolean = false;
    dispose: () => void;
    // Activatable
    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// 런타임 라이브러리 어딘가에
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
```

# 샘플 이해하기

믹스인으로 작동할 코드 샘플은 두 클래스로 시작합니다.  
각각의 개체가 특정 활동이나 능력에 초점을 맞추고 있다는 것을 볼 수 있습니다.  
나중에는 이 두 가지를 결합하여 새로운 클래스를 만들겠습니다.

```ts
// Disposable
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable
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

다음으로 두 믹스인의 결합을 처리할 클래스를 만들 것입니다.  
이 기능에 대해 자세히 살펴보겠습니다:

```ts
class SmartObject implements Disposable, Activatable {
```

위에서 첫 번째로 주목할 점은 `extends` 대신 `implements`를 사용한다는 것입니다.  
이것은 클래스를 인터페이스로 다루고 구현이 아닌 Disposable과 Activatable 타입만 사용합니다.  
즉, 클래스에서 구현을 제공해야 합니다.  
이외에 정확하게는 믹스인 사용하여 회피하고 싶은 것입니다.

이 요구 사항을 충족시키기 위해 믹스인에서 가져올 멤버에 대해 stand-in 프로퍼티과 그 타입을 생성합니다.  
이것은 컴파일러가 런타임에 이러한 멤버를 사용할 수 있음을 충족시킵니다.  
비록 약간의 bookkeeping 오버헤드가 있기는 하지만 여전히 믹스인의 이점을 얻을 수 있습니다.

```ts
// Disposable
isDisposed: boolean = false;
dispose: () => void;
// Activatable
isActive: boolean = false;
activate: () => void;
deactivate: () => void;
```

마지막으로, 믹스인을 클래스에 믹싱하여 완벽한 구현을 만들어냅니다.

```ts
applyMixins(SmartObject, [Disposable, Activatable]);
```

마지막으로 믹스인을 하기 위한 헬퍼 함수를 만듭니다.  
이것은 각 믹스인의 프로퍼티를 거쳐 실행되며 믹스인의 타겟으로 복사하고 구현된 stand-in 프로퍼티로 채우게 됩니다.

```ts
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

```
