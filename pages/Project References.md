프로젝트 레퍼런스는 TypeScript 프로그램을 더 작은 조각으로 구성할 수 있는 TypeScript 3.0의 새로운 기능입니다.

이를 통해, 빌드 시간을 크게 개선하고, 컴포넌트 사이의 논리적인 분리를 강제하여 코드를 새롭고 더 나은 방법으로 구성할 수 있습니다.

또한, 빠른 TypeScript 빌드를 위해 프로젝트 레퍼런스와 함께 동작하는 `tsc` 의 새로운 모드인 `--build` 플래그를 도입했습니다.

# 예제 프로젝트 (An Example Project)

꽤 일반적인 프로그램을 보고 프로젝트 레퍼런스가 이 프로그램을 더 잘 구성하는데 어떻게 도움이 될 수 있는지 살펴보겠습니다.
`converter`와 `units`이라는 두 모듈이 프로젝트 안에 있고, 각 모듈에 대응되는 테스트 파일이 있다고 상상해봅시다:

```shell
/src/converter.ts
/src/units.ts
/test/converter-tests.ts
/test/units-tests.ts
/tsconfig.json
```

테스트 파일은 구현 파일을 import 하고 테스트를 진행합니다:

```ts
// converter-tests.ts
import * as converter from "../converter";

assert.areEqual(converter.celsiusToFahrenheit(0), 32);
```

이전에는 이 구조가 단일 tsconfig 파일을 사용했다면 어색하게 동작했습니다:

* 구현 파일을 테스트 파일에 import 하는 것이 가능합니다
* 아마도 원치 않았겠지만 `src`가 출력 폴더 이름에 나타나지 않고는 `test`와 `src`를 동시에 빌드 하는 것이 불가능합니다
* 구현 파일 안에 *내용물* 만 바꿔도 새로운 오류를 절대 발생시키지 않지만 테스트 파일에 대한 *타입 검사*를 다시 해야 합니다
* 테스트 파일만 바꿔도 아무 변화 없지만 구현 파일의 타입 검사를 다시 해야 합니다

여러 개의 tsconfig 파일을 사용하여 이 문제들 중 *몇 가지*는 해결할 수 있지만, 새로운 문제가 발생합니다:

* 내장된 최신 검사가 없기 때문에, 항상 `tsc`를 두 번 실행해야 합니다
* `tsc`를 두 번 호출하면 시작 시간 오버헤드가 더 많이 발생합니다
* `tsc-w`는 한 번에 여러 config 파일을 실행할 수 없습니다

프로젝트 레퍼런스는 이 모든 문제를 해결할 수 있습니다.

# 프로젝트 레퍼런스는 무엇인가? (What is a Project Reference?)

`tsconfig.json` 파일은 새로운 최상위-레벨 프로퍼티 `reference`를 가집니다. 이는 참조할 프로젝트를 지정하는 객체의 배열입니다:

```js
{
    "compilerOptions": {
        // The usual
    },
    "references": [
        { "path": "../src" }
    ]
}
```

각 참조의 `path` 프로퍼티는 `tsconfig.json` 파일을 가지는 디렉터리를 가리키거나, config 파일 자체(어떤 이름도 가질 수 있음)를 가리킵니다.

프로젝트를 참조하면, 새로운 일이 일어납니다:

* 참조된 프로젝트에서 모듈을 import 하면 모듈의 *출력* 선언 파일을 대신 로드합니다 (`.d.ts`)
* 만약 참조된 프로젝트가 `outFile`를 생성하면, 출력 파일 `.d.ts` 파일의 선언은 이 프로젝트 안에서 노출됩니다
* 빌드 모드(아래 참조)는 필요하다면 자동으로 참조된 프로젝트를 빌드 합니다

여러 프로젝트로 분리하는 것은, 타입 검사와 컴파일 속도를 크게 향상시키고, 에디터를 사용할 때 메모리 사용량을 줄이며, 프로그램의 논리적 그룹화를 향상시킵니다.

# `composite`

참조 된 프로젝트는 반드시 새로운 `composite` 설정이 활성화되어야 합니다.
이 설정은 TypeScript가 참조된 프로젝트의 출력을 어디서 찾아야 할지 빠르게 결정하도록 하기 위해 필요합니다.
`composite` 플래그를 활성화하면 몇 가지가 변합니다:

* 만약 `rootDir` 설정이 명시적으로 지정되지 않으면, 기본 값은 `tsconfig` 파일을 가진 디렉터리입니다
* 모든 구현 파일은 반드시 `include` 패턴에 맞거나 `files` 배열 안에 있어야 합니다. 만약 이 제약조건을 위반하면, `tsc`는 어떤 파일이 지정되지 않았는지 알려줍니다
* `declaration`은 반드시 켜져 있어야 합니다

# `declarationMap`s

[선언 소스 맵](https://github.com/Microsoft/TypeScript/issues/14479)에 대한 지원도 추가했습니다.
만약 `--declarationMap`을 활성화하면, "정의로 이동"과 이름 변경과 같은 에디터 기능을 사용하여 지원하는 에디터에서 투명하게 탐색하고 프로젝트 경계를 넘어 코드를 수정할 수 있습니다.

# `prepend`와 `outFile` (`prepend` with `outFile`)

레퍼런스에서 `prepend` 옵션을 사용하여 의존성의 출력을 덧붙이는 것을 활성화할 수 있습니다:

```js
   "references": [
       { "path": "../utils", "prepend": true }
   ]
```

프로젝트를 덧붙이는 것은 프로젝트의 출력을 현재 프로젝트의 출력 위에 포함시킵니다.
이는 `.js` 파일과 `.d.ts` 파일에 모두 동작하고, 소스맵 파일 역시 올바르게 방출됩니다.

`tsc`는 이 작업을 위해 디스크에 있는 기존 파일만 사용합니다, 그래서 어떤 프로젝트의 출력이 결과 파일에 한 번 이상 나타날 수 있기 때문에, 올바른 출력 파일이 생성될 수 없는 프로젝트를 생성하는 것이 가능합니다.
예를 들어:

```txt
   A
  ^ ^
 /   \
B     C
 ^   ^
  \ /
   D
```

이 상황에서 각 레퍼런스에 덧붙이지 않는 것이 중요한데, 왜냐하면 `D`의 출력에 `A`의 두 가지 복사본이 나오기 때문입니다 - 이는 예상치 못한 결과를 초래할 수 있습니다.

# 프로젝트 레퍼런스에 대한 주의사항 (Caveats for Project References)

프로젝트 레퍼런스는 반드시 주의해야 할 몇 가지 트레이드오프가 있습니다.

왜냐하면 의존성 있는 프로젝트는 의존성으로부터 빌드 된 `.d.ts` 파일을 사용하기 때문에, 에디터에서 잘못된 오류를 보지 않고 프로젝트를 탐색할 수 있기 전에 특정 빌드 출력을 검사하거나 *혹은* 클론 후 프로젝트를 빌드 해야 합니다.
이를 개선할 수 있는 .d.ts 생성 과정을 작업하고 있습니다만, 지금은 클론 이후에 빌드 하는 것을 개발자분들에게 추천드립니다.

추가적으로, 기존 빌드 작업 흐름과의 호환성을 유지하기 위해, `tsc`는 `--build` 스위치를 호출하지 않는 한 자동으로 의존성 빌드를 하지 *않습니다*.
`--build`에 대해 배워봅시다.

# TypeScript를 위한 빌드 모드 (Build Mode for TypeScript)

오래 기다린 기능은 TypeScirpt 프로젝트를 위한 똑똑한 증분 빌드입니다.
3.0에서 `tsc`에서 `--build` 플래그를 사용할 수 있게 되었습니다.
이것은 단순한 컴파일러보다 빌드 관리자처럼 동작하는 `tsc`의 새로운 진입점입니다.

`tsc --build` (약식은 `tsc -b`)를 실행하면 다음의 작업을 합니다:

* 참조된 모든 프로젝트를 찾습니다
* 최신 상태인지 감지합니다
* 올바른 순서로 최신 상태가 아닌 프로젝트를 빌드 합니다

`tsc -b`에 여러 config 파일 경로를 제공할 수 있습니다 (예를 들어. `tsc -b src test`).
`tsc -p`처럼, 만약 config 파일 이름이 `tsconfig.json`이라면 이름을 지정하지 않아도 됩니다.

## `tsc -b` 명령줄 (`tsc -b` Commandline)

config 파일을 원하는 만큼 지정할 수 있습니다:

```shell
 > tsc -b                            # 현재 디렉터리에 있는 tsconfig.json 사용
 > tsc -b src                        # src/tsconfig.json 사용
 > tsc -b foo/prd.tsconfig.json bar  # foo/prd.tsconfig.json 와 bar/tsconfig.json 사용
```

명령줄에 전달한 파일의 순서에 대해서는 걱정하지 마세요 - 필요하면 `tsc`가 재배열하기 때문에 의존성이 언제나 먼저 빌드 됩니다.

`tsc -b`에 지정할 수 있는 몇 가지 플래그들이 더 있습니다:

* `--verbose`: 어떻게 진행되고 있는지 자세한 로그를 출력해 줍니다 (다른 플래그와 결합할 수 있습니다)
* `--dry`: 실제로 빌드 하지 않지만 어떻게 될지 보여줍니다
* `--clean`: 지정된 프로젝트의 출력을 제거합니다 (`--dry`와 결합할 수 있습니다)
* `--force`: 모든 프로젝트가 최신이 아닌 것처럼 동작합니다
* `--watch`: 감시 모드 (`--verbose`를 제외한 다른 플래그와는 결합할 수 없습니다)

# 주의사항 (Caveats)

일반적으로, `tsc`는 `noEmitOnError`가 활성화되어있지 않으면, 구문 또는 타입 오류가 있을 때 출력 (`.js`와 `.d.ts`)을 생성합니다.
이것을 증분 빌드 시스템에서 하는 것은 매우 안 좋습니다 - 만약 최신 상태가 아닌 의존성 중 하나가 새로운 오류가 있으면, 다음 빌드가 현재 최신 상태인 프로젝트를 빌드 하는 것을 건너뛸 것이기 때문에, *한번* 만 볼 수 있습니다.
이 이유로, `tsc -b`는 `noEmitOnError`가 모든 프로젝트에서 활성화된 것처럼 효과적으로 동작합니다.

아무 빌드 출력 (`.js`, `.d.ts`, `.d.ts.map`, 등)을 검사하는 경우, 소스 제어 도구가 로컬 사본과 원격 사본 사이의 타임스탬프를 보존하는지에 따라 특정 소스 제어 연산 후에 `--force` 빌드를 실행해야 할 수도 있습니다.

# MSBuild

만약 msbuild 프로젝트가 있으면, 다음을 추가하여 빌드 모드를 proj 파일에

```xml
    <TypeScriptBuildMode>true</TypeScriptBuildMode>
```

활성화할 수 있습니다. 이는 제거뿐만 아니라 자동 증분 빌드를 활성화합니다.

`tsconfig.json` / `-p`와 마찬가지로, 기존 TypeScript 프로젝트 프로퍼티는 고려되지 않음에 유의하십시오 - 모든 설정은 tsconfig 파일을 사용하여 관리해야 합니다.

일부 팀들은 tsconfig 파일들이 함께 병행하여 관리되는 프로젝트와 같은 *암시적* 그래프 순서를 가지며 msbuild 기반의 작업 흐름을 설정했습니다.
만약 해결책이 이와 같다면, 프로젝트 레퍼런스와 함께 `msbuild`를 `tsc -p`와 계속 사용할 수 있습니다; 이들은 완전히 상호 운용 가능합니다.

# 안내 (Guidance)

## 전체 구조 (Overall Structure)

더 많은 `tsconfig.json` 파일과 함께, 공통의 컴파일러 옵션들을 중앙 통제하기 위해 [구성 파일 상속](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)을 사용하고 싶으실 겁니다.
이 방법으로 여러 파일을 수정하지 않고 한 파일에서 설정을 변경할 수 있습니다.

또 다른 좋은 방법은 단순히 모든 리프-노드 프로젝트에 `references`를 가지고 `files`를 빈 배열로 설정하는 "솔루션" `tsconfig.json` 파일을 갖는 것입니다 (그렇지 않으면 솔루션 파일 때문에 파일이 두 번 컴파일됩니다). 3.0부터 적어도 하나의 `reference`가 `tsconfig.json`에 있으면, 빈 `files` 배열을 갖는 것은 더 이상 오류가 아님에 유의하세요.

이는 간단한 진입점을 제공합니다; 예를 들어, TypeScript 저장소에서 `src/tsconfig.json` 안에 모든 하위 프로젝트를 나열하기 때문에 단순히 `tsc -b src` 실행하여 모든 엔드포인트를 빌드 합니다.

이 패턴들은 TypeScript 저장소에서 볼 수 있습니다 - 주 예제로 `src/tsconfig_base.json`, `src/tsconfig.json`, 그리고 `src/tsc/tsconfig.json`를 보세요.

## 상대 모듈 구조화하기 (Structuring for relative modules)

일반적으로, 상대 모듈을 사용하여 저장소를 전환하는 데에는 별 다른 것이 필요 없습니다.
간단하게 부모 폴더의 `tsconfig.json` 파일을 각 하위 디렉터리 안에 위치시키고, 프로그램의 의도된 계층과 일치하도록 `reference`를 이 config 파일에 추가하십시오.
`outDir`을 출력 폴더의 명시적인 하위 폴더로 설정하거나, `rootDir`을 모든 프로젝트 폴더의 공통 루트로 설정해야 합니다.

## outFiles 구조화하기 (Structuring for outFiles)

`outFile`을 사용한 컴파일의 레이아웃은 상대 경로가 크게 중요하지 않기 때문에 더 유연합니다.
기억해야 할 한 가지는 "마지막" 프로젝트 전까지는 `prepend`를 사용하고 싶지 않다는 것입니다 - 이는 빌드 시간을 개선하고 주어진 빌드에 필요한 I/O 숫자를 줄여줄 것입니다.
TypeScript 저장소 자체는 여기서 좋은 레퍼런스입니다 - 몇 가지 "라이브러리" 프로젝트와 "엔드포인트" 프로젝트가 있습니다; "엔드포인트" 프로젝트는 가능한 작게 유지되고 있고 필요한 라이브러리만 pull 합니다.

<!--
## Structuring for monorepos

TODO: Experiment more and figure this out. Rush and Lerna seem to have different models that imply different things on our end
-->
