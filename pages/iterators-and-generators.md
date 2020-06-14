# 이터러블 (Iterables)

객체가 [`Symbol.iterator`](https://www.typescriptlang.org/docs/handbook/symbols.html#symboliterator)프로퍼티에 대한 구현을 가지고 있다면 이터러블로 간주합니다.
`Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array` 등과 같은 일부 내장 타입에는 이미 `Symbol.iterator` 프로퍼티가 구현되어 있습니다.
객체의 `Symbol.iterator` 함수는 반복할 값 목록을 반환합니다.

## `for..of` 문

`for..of`는 객체의 `Symbol.iterator` 프로퍼티를 호출하여, 이터러블 객체를 반복합니다.
다음은 배열의 간단한 `for..of` 루프입니다:

```ts
let someArray = [1, "string", false];

for (let entry of someArray)
 console.log(entry); // 1, "string", false
}
```

### `for..of` vs. `for..in` 문

`for..of` 및 `for..in` 문 모두 목록을 반복합니다; 반복되는 값은 다르지만, `for..in`은 반복되는 객체의 *키* 목록을 반환하고, 반면에 `for..of`는 반복되는 객체의 숫자 프로퍼티 *값* 목록을 반환합니다.

다음은 이러한 차이점을 보여주는 예입니다.

```ts
let list = [4, 5, 6];

for (let i in list){
 console.log(i); // "0", "1", "2"
}

for (let i of list){
 console.log(i); // "4", "5", "6"
}
```

또 다른 차이점은 `for..in`은 모든 객체에서 작동한다는 것입니다; 객체의 프로퍼티를 검사하는 방법으로 사용됩니다.
반면에 `for..of`는 이터러블 객체의 값에 주로 관심이 있습니다. `Map` 및 `Set`과 같은 내장 객체는 저장된 값에 접근할 수 있는 `Symbol.iterator` 프로퍼티를 구현합니다.

```ts
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets){
 console.log(pet); // "species"
}

for (let pet of pets){
 console.log(pet); // "Cat", "Dog", "Hamster"
}
```

### 코드 생성 (Code generation)

#### ES5 및 ES3 타게팅 (Targeting ES5 and ES3)

ES5 또는 ES3-호환 엔진을 대상으로 하는 경우, 반복자는 `Array` 유형의 값만 허용합니다.
이런 배열이 아닌 값이 `Symbol.iterator` 프로퍼티를 구현하더라도 배열이 아닌 값에서 `for..of` 루프를 사용하면 오류가 발생합니다.

컴파일러는 `for..of` 루프에 대한 간단한 `for` 루프를 생성합니다, 예를 들면:

```ts
let numbers = [1, 2, 3];
for (let num of numbers){
 console.log(num);
}
```

는 다음과 같이 생성합니다:

```ts
var numbers = [1, 2, 3];
for (var _i = 0; _i < numbers.length; _i++){
 var num = numbers[_i];
 console.log(num);
}
```

#### ECMAScript 2015 및 상위 버전 타케팅 (Targeting ECMAScript 2015 and higher)

ECMAScipt 2015-호환 엔진을 타케팅하는 경우, 컴파일러는 엔진의 내장 반복자 구현을 대상으로 하는 `for..of` 루프를 생성합니다.
