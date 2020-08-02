# 기여하기

번경을 요청하거나, 번역 작업을 참여하기 전에 아래에 기여 방법을 꼭 읽어주세요.

## 기여 방법

* 경어체를 사용하여 번역합니다.
* 번역의 진행 상황은 [이곳](https://github.com/typescript-kr/typescript-kr.github.io/projects/1)에서 확인할 수 있습니다.
* 자주 사용되는 용어를 일관적으로 번역하기 위해 공통된 용어를 사용합니다. 공통된 용어는 [번역 용어](#번역-용어)를 참고하세요.
* 번역 작업시 아래의 [번역 규칙](#번역-규칙)을 지켜야 합니다. **번역 규칙을 지키지 않았다고 판단되는 커밋은 PR받지 않습니다.**
* 다른 참여자가 진행하고 있는 작업과 중복을 피하기 위해 작업 전 [이슈](https://github.com/typescript-kr/typescript-kr.github.io/issues)를 확인해 주세요.
* 중복된 작업을 피하기 위해 작업 전, [이슈-번역 필요](https://github.com/typescript-kr/typescript-kr.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)에 번역할 범위, 예상 완료 날짜를 등록해 주세요.
   > 번역 범위: 문서 전체
   > 예상 완료 날짜: 2020/00/00
* 번역할 범위, 기간은 짧게 하는 것을 권장 드리며, 범위의 경우 최소 한 문단까지 가능합니다.
   > ex) Basic Types introduction만 번역
* 아래 [Pull Request 가이드](#pull-request)를 참고하여 PR합니다.

## 번역 규칙

### 1. 제목
`[번역]v(원어)` 형태로 번역합니다. 단 **번역이 어려울 시** 원어를 사용해도 무방합니다.

> 소개 (Introduction)  // 번역이 가능할 때
>
> `const` vs `let`  // 번역이 어려울 때

### 2. 원문의 마크다운 양식
원문에서의 마크다운 양식은 정확하게 따릅니다. 마크다운 양식은 [원본 마크다운 양식](https://github.com/microsoft/TypeScript-Handbook/tree/master/pages)을 참고합니다.

#### 2.1 마크다운 양식 맞추기
예를 들어 *이탤릭체* 나 "" 와 같이 원문에 마크다운 문법이 들어가 있다면 번역에도 동일하게 사용합니다.

> Each enum member has a value associated with it which can be either *constant* or *computed*.
>
> 각 열거형의 멤버는 *상수*이거나 *계산*으로 얻어진 값일 수 있습니다.
>
>While string enums don't have auto-incrementing behavior, string enums have the benefit that they "serialize" well.
>
>문자열 열거형은 숫자 열거형처럼 자동-증가하는 기능은 없지만, "직렬화"를 매우 잘한다는 이점이 있습니다.

#### 2.2 라인 번호 맞추기
**원문과 라인 수를 맞춰야 합니다.** 이는 추후 원문 수정시에 위치를 빠르게 찾기 위함입니다.

### 3. 맞춤법
번역 완료 후, **커밋 하기 전에 맞춤법 검사**를 실시합니다.

### 4. 주석
삽입된 코드 내에 **주석은 번역하는 것을 원칙**으로 합니다. 단 컴파일 결과 메세지와 같은 보여주기 용 주석은 번역하지 않습니다.

```ts
let mySearch: SearchFunc;

// error: Type '(src: string, sub: string) => string' is not assignable to type 'SearchFunc'.
// Type 'string' is not assignable to type 'boolean'.
mySearch = function(src, sub) {
  let result = src.search(sub);
  return "string";
};
```

위 주석은 컴파일 결과 메세지이므로 번역하지 않습니다.

```ts
interface NumberDictionary {
    [index: string]: number;
    length: number;    // ok, length is a number
    name: string;      // error, the type of 'name' is not a subtype of the indexer
}
```

위 주석은 메세지가 아니므로 번역해야 합니다.

#### 4.1 `ok`, `error` 번역
코드 주석에서 `ok` 는 성공, `error`는 오류로 번역합니다.

### 5. 용어의 정의
문서에서 용어를 정의할 때, **번역을 쓰고 괄호 안에 원어를** 첨부합니다. 명시를 했다면 다음부터 원어 부분은 생략해도 무방합니다.
> 하위클래스(subclasses), 상위클래스(superclasses)

### 6. 번역이 애매할 때
문서 번역시 애매한 부분이 발생할 수 있습니다. Issue란에 `질문` 태그를 달아서 토론을 진행하거나 PR시 리뷰어들에게 도움을 요청할 수 있습니다.

### 7. 마크다운 린트
현재 프로젝트에는 마크다운 린트가 적용되어 있습니다. 깃 클론 후 `npm install`을 하면 커밋 시에 lint 검사를 하게 됩니다. `npm run lint`를 사용해도 됩니다. lint 검사는 PR시에도 자동으로 진행합니다. **lint 검사 후 올리는 것을 권장합니다.**

## 번역 용어

| 영어 | 번역 |  기타 |
| --- | --- | --- |
| type | 타입 | TypeScript 언어에서 지칭하는 타입의 경우 "타입"으로 번역, 그 외에는 유형', '모양', '생김새'등 번역해서 사용 |
| property | 프로퍼티 | - |
| parameter | 매개변수 | 인자라고 부르기도 함 |
| assertion | 단언 | - |
| JavaScript | JavaScript | 원어 자체로 사용 |
| TypeScript | TypeScript | 원어 자체로 사용 |
| method | 메서드 | 국립국어원 발음표기에 따라 '메소드'가 아닌 '메서드'로 통일 |
| base class | 기초클래스 | - |
| subclass | 하위클래스 | - |
| superclass | 상위클래스 | - |
| optional | 선택적 | - |
| argument | 인수 | - |
| statement | 문 | - |
| syntax | 구문 | - |
| anonymous function | 익명 함수 | - |
| annotate | 표기하기 | - |
| type annotation | 타입 표기 | - |
| modifier | 지정자 | - |
| dependency | 의존성 | - |
| alias | 별칭 | - |
| identifier | 식별자 | - |
| scope | 스코프 | - |
| ambient | ambient | - |
| symbol | 심벌 | "심볼"은 잘못된 표현이니 주의|
| import | import | 모듈 import 설명시 원어 사용 |
| export | export | 모듈 export 설명시 원어 사용 |

## 번역 작업에 도움이 될만한 글들

* [흔한 번역투 TOP 12](https://m.hanbit.co.kr/channel/category/category_view.html?cms_code=CMS1174085364)
* [describe - 번역 팁](http://blog.daum.net/standards/442)


# Pull Request

* PR 전에 맞춤법 검사를 수행해 주세요.
* PR은 최소 두 명의 메인테이너가 찬성하면 머지할 수 있습니다.

## Working With Code

PR을 보내는 프로세스는 매우 간단하며, 일반적으로 매번 동일한 패턴을 따릅니다.

1. [새 브랜치 만들기](#step1)
2. [수정하기](#step2)
3. [Upstream으로부터 rebase하기](#step3)
4. [테스트하기](#step4)
5. [변경 내용을 push하기](#step5)
6. [Pull Request 보내기](#step6)

각 단계에 대한 자세한 내용은 아래에 있습니다.

### Step 1: 새 브랜치 만들기<a name="step1"></a>

PR을 보내기 위해 fork한 레포지토리에서 브랜치를 만듭니다. 브랜치 이름은 수정하려는 내용을 간단하게 표현합니다.

```sh
$ git checkout -b issue1234
```

이 브랜치에서는 해당 이슈에 관련된 수정을 해야합니다.

**Note**: 여러 이슈에 대한 수정을 하나의 브랜치에서 수행하면 안됩니다. 이슈마다 각 브랜치를 생성하세요.

### Step 2: 수정하기<a name="step2"></a>

번역 규칙에 따라 문서를 번역 및 수정합니다. 번역이 완료되면 브랜치에 수정을 커밋합니다.

```sh
$ git add -A
$ git commit
```

커밋 메시지는 커밋의 내용을 자유롭게 입력합니다.

### Step 3: Upstream으로 부터 rebase하기<a name="step3"></a>

Pull Request를 보내기 전에 Upstream 소스를 rebase해야 합니다. 이렇게 하면 최신 코드를 가져와 충돌을 피할 수 있습니다.

```sh
$ git fetch upstream
$ git rebase upstream/master
```

### Step 4: 테스트하기<a name="step4"></a>

현재 모든 문서에는 markdown lint가 적용되어 있습니다. 리베이스 이후에 테스트를 하여 린트 규칙을 확인합니다.

```sh
$ npm test
```

또한 local 환경에서 gitbook을 테스트할 수 있습니다.

```sh
$ npm run serve:gitbook
```

http://localhost:4000 에서 번경된 문서를 확인할 수 있습니다.

### Step 5: 변경 내용을 Push 하기<a name="step5"></a>

변경 내용을 clone한 레포지토리에 push합니다.

```sh
$ git push origin issue1234
```

일부 참조가 오래되어 push할 수 없다면 강제 push를 합니다.

```sh
$ git push -f origin issue1234
```

### Step 6: Pull Request 보내기<a name="step6"></a>

이제 Pull Request를 보낼 준비가 완료되었습니다. Fork된 레포지토리로 이동하여 [Github 문서](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)를 참고하여 Pull Request를 보냅니다.