이 퀵 스타트 가이드는 [gulp](http://gulpjs.com)로 TypeScript를 빌드한 다음 [Browserify](http://browserify.org), [uglify](http://lisperator.net/uglifyjs) 또는 [Watchify](https://github.com/substack/watchify)를 gulp 파이프 라인에 추가하는 방법을 알려줍니다.
또한 [Babelify](https://github.com/babel/babelify)를 사용하여 [Babel](https://babeljs.io) 기능을 추가하는 방법을 알려줍니다.

[npm](https://www.npmjs.com)과 [Node.js](https://nodejs.org)는 이미 사용하고 있다고 가정합니다.

# 작은 프로젝트 (Minimal project)

새로운 디렉터리로 시작합시다.
당장은 `proj`라고 이름을 붙이겠지만 원하는 대로 변경할 수 있습니다.

```shell
mkdir proj
cd proj
```

시작하기 위해, 다음과 같이 프로젝트를 구조화해야 합니다:

```text
proj/
   ├─ src/
   └─ dist/
```

TypeScript 파일은 `src` 폴더에서 시작하여 TypeScript 컴파일러를 통해 실행되고 `dist`에서 끝납니다.

이것을 골격으로 합니다:

```shell
mkdir src
mkdir dist
```

## 프로젝트 초기화 (Initialize the project)

이제 이 폴더를 npm 패키지로 바꿀 것입니다.

```shell
npm init
```

일련의 알림을 받게 될 것입니다.  
entry point를 제외하고는 기본값을 사용할 수 있으며 `./dist/main.js`를 사용합니다.  
`package.json` 파일로 돌아가서 언제든 변경할 수 있습니다.

## 의존성 설치 (Install our dependencies)

이제는 `npm install`을 사용하여 패키지를 설치할 수 있습니다.  
먼저 `gulp-cli`를 전역으로 설치하십시오 (Unix 시스템을 사용하는 경우 `npm install` 명령 앞에 `sudo`를 붙여야 할 수도 있습니다).

```shell
npm install -g gulp-cli
```

그런 다음 프로젝트의 개발 의존성에 `typescript`, `gulp` 및 `gulp-typescript`를 설치하십시오.  
[Gulp-typescript](https://www.npmjs.com/package/gulp-typescript)는 TypeScript의 gulp 플러그인입니다.

```shell
npm install --save-dev typescript gulp gulp-typescript
```

## 간단한 예제 작성 (Write a simple example)

Hello World 프로그램을 작성해 보겠습니다.
`src`에 `main.ts` 파일을 만듭니다 :

```ts
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

`proj`이라는 프로젝트 루트에 `tsconfig.json` 파일을 생성합니다:

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

## `gulpfile.js` 생성 (Create a `gulpfile.js`)

프로젝트 루트에 `gulpfile.js` 파일을 만듭니다:

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

## 결과 앱 테스트 (Test the resulting app)

```shell
gulp
node dist/main.js
```

프로그램은 "Hello from TypeScript!"를 출력해야 합니다.

# 코드에 모듈 추가 (Add modules to the code)

Browserify를 시작하기 전에 코드를 만들고 믹스에 모듈을 추가해 보겠습니다.  
이것은 실제 앱에서 사용하기 쉬운 구조입니다.

`src/greet.ts` 파일을 만듭니다 :

```ts
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```

이제 `src/main.ts`의 `sayHello`를 `greet.ts`에서 import 하도록 변경합니다:

```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

마지막으로 `src/greet.ts`를 `tsconfig.json`에 추가하십시오:

```json
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

`gulp`을 실행하고 Node에서 테스트하여 모듈이 작동하는지 확인하십시오:

```shell
gulp
node dist/main.js
```

ES2015 모듈 구문을 사용했지만 TypeScript는 Node가 사용하는 CommonJS 모듈을 방출했습니다.  
이 튜토리얼에서는 CommonJS를 계속 사용하겠지만 options 객체에 `module`을 설정하여 이를 변경할 수 있습니다.  

# Browserify

이제 이 프로젝트를 Node에서 브라우저로 이동하겠습니다.  
이를 위해 모든 모듈을 하나의 JavaScript 파일로 번들링 하고자 합니다.  
다행히도 정확히 Browserify가 하는 일입니다.  
더 좋은 것은 노드에서 사용하는 CommonJS 모듈 시스템을 TypeScript에서 사용할 수 있다는 것입니다.  
즉 TypeScript와 Node 설정이 기본적으로 변경되지 않은 브라우저로 전송되는 것을 의미합니다.

먼저 browserify, [tsify](https://www.npmjs.com/package/tsify) 및 vinyl-source-stream을 설치하십시오.  
tsify는 gulp-typescript처럼 TypeScript 컴파일러에 접근할 수 있는 Browserify 플러그인입니다.  
vinyl-source-stream을 사용하면 Browserify의 파일 출력을 gulp에서 [vinyl](https://github.com/gulpjs/vinyl)으로 인식하는 형식으로 다시 변환할 수 있습니다.

```shell
npm install --save-dev browserify tsify vinyl-source-stream
```

## 페이지 만들기 (Create a page)

`src`에 `index.html` 파일을 생성합니다 :

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello World!</title>
    </head>
    <body>
        <p id="greeting">Loading ...</p>
        <script src="bundle.js"></script>
    </body>
</html>
```

이제 페이지를 업데이트하기 위해 `main.ts`를 변경합니다:

```ts
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```

`showHello` 호출은 `sayHello`를 호출하여 paragraph 텍스트를 변경합니다.  
이제 gulpfile을 다음과 같이 변경하십시오 :

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('copy-html'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
}));
```

`copy-html` 태스크를 추가하고 `default`의 의존성으로 추가합니다.  
`default`가 실행될 때마다 `copy-html`이 먼저 실행되어야 한다는 것을 의미합니다.  
또한 `default`를 gulp-typescript 대신 tsify 플러그인으로 Browserify를 호출하도록 변경했습니다.  
편리하게도 둘 모두 TypeScript 컴파일러에 동일한 options 객체를 전달할 수 있습니다.

`bundle`을 호출한 후 `source`(vinil-source-stream에 대한 별칭)를 사용하여 출력 번들 `bundle.js`의 이름을 지정합니다.

gulp를 실행하고 브라우저에서 `dist/index.html`을 열어 페이지를 확인하세요.  
페이지에 "Hello from TypeScript"가 표시되어야 합니다.

Browserify에 `debug : true`를 지정한 것에 주목하십시오.  
이로 인해 tsify는 번들된 JavaScript 파일 안에 소스 맵을 내보냅니다.  
소스 맵을 사용하면 번들로 제공된 JavaScript 대신 브라우저에서 원본 TypeScript 코드를 디버깅할 수 있습니다.  
브라우저의 디버거를 열고 `main.ts` 안에 브레이크 포인트을 넣으면 소스 맵이 작동하는지 테스트할 수 있습니다.  
페이지를 새로 고침 하면 브레이크 포인트가 페이지를 일시 중지하고 `greet.ts`를 디버깅 할 수 있어야 합니다.

# Watchify, Babel, and Uglify

이제 코드를 Browserify에 묶어서 tsify 했으므로 browserify 플러그인을 사용하여 빌드에 다양한 기능을 추가할 수 있습니다.

* Watchify가 gulp를 계속 실행하며 파일을 저장할 때마다 점차적으로 컴파일합니다.  
  이를 통해 브라우저에서 편집-저장-새로고침 사이클을 계속 진행할 수 있습니다.

* Babel은 ES2015 이상을 ES5 및 ES3으로 변환하는 매우 유연한 컴파일러입니다.  
  따라서 TypeScript에서 지원하지 않는 광범위한 맞춤형 변환을 추가할 수 있습니다.

* Uglify는 다운로드 시간을 줄이도록 코드를 압축합니다.

## Watchify

Watchify로 백그라운드 컴파일을 시작하겠습니다 :

```shell
npm install --save-dev watchify fancy-log
```

이제 gulpfile을 다음과 같이 변경하십시오 :

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var fancy_log = require('fancy-log');
var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
}

gulp.task('default', gulp.series(gulp.parallel('copy-html'), bundle));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', fancy_log);
```

여기에는 기본적으로 세 가지 변경 사항이 있지만 코드를 약간 리팩토링해야합니다.

1. `watchify`에 대한 호출에서 `browserify` 인스턴스를 감싸고 그 결과를 유지했습니다.
2. `watchedBrowserify.on('update', bundle);`을 호출하여 Browserify 가 TypeScript 파일 중 하나가 변경될 때마다 `bundle` 함수를 실행하도록 했습니다.
3. `watchedBrowserify.on('log', fancy_log);`을 호출하여 콘솔에 기록했습니다.

(1)과 (2)는 `default` 작업에서 `browserify`를 호출해야 한다는 것을 의미합니다.  
Watchify와 Gulp 모두 호출해야 하기 때문에 `default` 함수에 이름을 주어야 합니다.  
(3)을 사용한 로깅을 추가하는 것은 선택 사항이지만 설정을 디버깅하는 데 매우 유용합니다.

이제 Gulp를 실행하면 시작해야 하고 계속 실행됩니다.  
`main.ts`에서 `showHello`에 대한 코드를 변경하고 저장하십시오.  

다음과 같은 출력이 표시되어야 합니다 :

```shell
proj$ gulp
[10:34:20] Using gulpfile ~/src/proj/gulpfile.js
[10:34:20] Starting 'copy-html'...
[10:34:20] Finished 'copy-html' after 26 ms
[10:34:20] Starting 'default'...
[10:34:21] 2824 bytes written (0.13 seconds)
[10:34:21] Finished 'default' after 1.36 s
[10:35:22] 2261 bytes written (0.02 seconds)
[10:35:24] 2808 bytes written (0.05 seconds)
```

## Uglify

먼저 Uglify를 설치하십시오.  
Uglify의 요점은 코드를 압축하기 위한 것이므로 소스 맵을 유지하려면 vinyl-buffer와 gulp-sourcemaps도 설치해야 합니다.

```shell
npm install --save-dev gulp-uglify vinyl-buffer gulp-sourcemaps
```

이제 gulpfile을 다음과 같이 변경하십시오 :

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('copy-html'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}));
```

`uglify` 자체에는 하나의 호출만 있습니다 &mdash; `buffer`와 `sourcemaps`에 대한 호출은 sourcemaps이 계속 작동하는지 확인하기 위해 존재합니다.  
이러한 호출을 통해 이전과 같이 인라인 소스 맵을 사용하는 대신 별도의 소스 맵 파일을 사용할 수 있습니다.  
이제 Gulp를 실행하고 `bundle.js`가 난독화로 압축되는지 확인하십시오 :

```shell
gulp
cat dist/bundle.js
```

## Babel

먼저 ES2015 전용 Babelify 및 Babel preset을 설치하십시오.  
Uglify처럼 Babelify도 코드를 엉망으로 만들기 때문에 vinyl-buffer와 gulp-sourcemaps이 필요합니다.  
기본적으로 Babelify는 확장자가 `.js`, `.es`, `.es6` 및 `.jsx` 인 파일만 처리하므로 Babelify에 옵션으로 `.ts` 확장자를 추가해야 합니다.

```shell
npm install --save-dev babelify@8 babel-core babel-preset-es2015 vinyl-buffer gulp-sourcemaps
```

이제 gulpfile을 다음과 같이 변경하십시오 :

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('copy-html'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}));
```

TypeScript 대상 ES2015도 필요합니다.  
Babel은 TypeScript에서 내보내는 ES2015 코드에서 ES5를 생성합니다.
`tsconfig.json`을 수정합시다 :

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es2015"
    }
}
```

간단한 스크립트의 경우 Babel의 ES5 결과물은 TypeScript의 결과물과 거의 같아야 합니다.
