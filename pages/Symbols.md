# 소개 (Introduction)

ECMAScript 2015에서 시작된 `symbol`은 `number`와 `string`같은 primitive 데이터 타입입니다.

`symbol` 값은 `Symbol` 생성자를 호출하여 생성됩니다.

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // 선택적 문자열 키
```

심볼은 불변이고 고유합니다.

```ts
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, 심볼은 고유합니다.
```

문자열과 마찬가지로 심볼을 객체 프로퍼티의 키로 사용할 수 있습니다.

```ts
let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```
심볼을 계산된 프로퍼티 선언과 결합하여 객체 프로퍼티와 클래스 멤버를 선언할 수도 있습니다.

```ts
const getClassNameSymbol = Symbol();

class C {
    [getClassNameSymbol](){
       return "C";
    }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

# 잘 알려진 심볼 (Well-known Symbols)

사용자 정의 심볼 외에도 잘 알려진 내장 심볼이 있습니다.
내장 심볼은 내부 언어 동작을 나타내는 데 사용됩니다.

다음은 잘 알려진 심볼 목록입니다.

## `Symbol.hasInstance`

생성자 객체를 생성자의 인스턴스 중 하나로서 객체를 인식하는지 여부를 판단하는 메서드입니다. `instanceof` 연산자의 의미로 호출됩니다.

## `Symbol.isConcatSpreadable`

객체가 `Array.prototype.concat`에 의해 배열 요소로 병합되어야 함을 나타내는 boolean 값입니다.

## `Symbol.iterator`

객체의 기본 반복자를 반환하는 메서드입니다. for-of 구문에 의해 호출됩니다.

## `Symbol.match`

정규 표현식을 문자열과 비교하는 정규 표현식 메소드입니다. `String.prototype.match` 메서드로 호출 됩니다.

## `Symbol.replace`

일치하는 문자열의 부분 문자열을 대체하는 정규 표현식 메서드입니다. `String.prototype.replace` 메서드로 호출 됩니다.

## `Symbol.search`

정규식과 일치하는 문자열에서 인덱스를 반환하는 정규식 메서드입니다. `String.prototype.search` 메서드로 호출 됩니다.

## `Symbol.species`

파생된 객체를 만드는 데 사용되는 생성자 함수의 프로퍼티 값을 갖는 프로퍼티입니다.

## `Symbol.split`

정규 표현식과 일치하는 인덱스에서 문자열을 분할하는 정규 표현식 메서드입니다.
 `String.prototype.split` 메서드에 의해 호출 됩니다.

## `Symbol.toPrimitive`

객체를 해당하는 primitive 값으로 변환하는 방법입니다.
`ToPrimitive` 추상 동작에 의해 호출됩니다.

## `Symbol.toStringTag`

객체의 기본 문자열 설명을 만드는 데 사용되는 String 값입니다.
내장 메소드`Object.prototype.toString`로 호출 합니다.

## `Symbol.unscopables`

자신의 프로퍼티 이름"을" 가지는 객체는 연관된 객체의 환경 바인딩에서 제외되는 프로퍼티 이름입니다.
