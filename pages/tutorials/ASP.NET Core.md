# 설정

## ASP.NET 코어 및 TypeScript 설치 (Install ASP.NET Core and TypeScript)

먼저 필요한 경우에는 ASP.NET Core를 설치합니다.  
이 퀵 스타트 가이드를 위해서는 VisualStudio2015 또는 2017이 필요합니다.

다음으로 사용 중인 VisualStudio에 최신 TypeScript가 아직 없는 경우 이를 [설치](http://www.microsoft.com/en-us/download/details.aspx?id=48593)할 수 있습니다.

## 새 프로젝트 만들기 (Create a new project)

1. **파일** 선택
2. **새로운 프로젝트** 선택 (Ctrl + Shift + N)
3. **Visual C#** 선택
4. VS2015의 경우 **ASP.NET Web Application** > **ASP.NET 5 Empty**를 선택하고 로컬에서 실행하기 때문에 "Host in the cloud" 선택을 취소합니다.

    ![Use empty template](../../assets/images/tutorials/aspnet/new-asp-project-empty.png)

    VS2017의 경우 **ASP.NET Core Web Application (.NET Core)** 대신 **ASP.NET Core 1.1 Empty** 를 선택하세요.

    ![Use empty template VS2017](../../assets/images/tutorials/aspnet/new-asp-project-empty-17.PNG)

애플리케이션을 실행하고 작동하는지 확인합니다.

## 서버 설정 (Set up the server)

### VS2015

`project.json`에서 `"dependencies"`에 다음 항목을 추가합니다 :

```json
"Microsoft.AspNet.StaticFiles": "1.0.0-rc1-final"
```

의존성은 다음과 같아야 합니다 :

```json
  "dependencies": {
    "Microsoft.AspNet.IISPlatformHandler": "1.0.0-rc1-final",
    "Microsoft.AspNet.Server.Kestrel": "1.0.0-rc1-final",
    "Microsoft.AspNet.StaticFiles": "1.0.0-rc1-final"
  },
```

`Startup.cs`에서 `Configure`를 다음으로 교체합니다.

```cs
public void Configure(IApplicationBuilder app)
{
    app.UseIISPlatformHandler();
    app.UseDefaultFiles();
    app.UseStaticFiles();
}
```

### VS2017

Open **Dependencies** > **Manage NuGet Packages** > **Browse**. 검색 및 설치  `Microsoft.AspNetCore.StaticFiles` 1.1.2:

![Install Microsoft.AspNetCore.StaticFiles](../../assets/images/tutorials/aspnet/install-nuget-packages.png)

`Startup.cs`에서 `Configure`를 다음으로 교체합니다.

```cs
public void Configure(IApplicationBuilder app)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}
```

`UseDefaultFiles`와 `UseStaticFiles` 아래의 빨간선이 사라지려면 VS를 다시 시작해야 할 수 있습니다.

# 타입스크립트 추가 (Add TypeScript)

다음 단계는 TypeScript를 위한 폴더를 추가하는 것입니다.

![Create new folder](../../assets/images/tutorials/aspnet/new-folder.png)

그냥 `scripts`라고 부르겠습니다.

![scripts folder](../../assets/images/tutorials/aspnet/scripts-folder.png)

## 타입스크립트 코드 추가 (Add TypeScript code)

`scripts`를 마우스 오른쪽 버튼으로 클릭하고 **New Item**을 클릭합니다.  
그런 다음 **TypeScript File** (. NETCore섹션에 있을 수도 있음)을 선택하고 `app.ts`의 이름을 지정합니다.

![New item](../../assets/images/tutorials/aspnet/new-item.png)

## 예제 코드 추가 (Add example code)

app.ts에 다음 코드를 입력하십시오

```ts
function sayHello() {
    const compiler = (document.getElementById("compiler") as HTMLInputElement).value;
    const framework = (document.getElementById("framework") as HTMLInputElement).value;
    return `Hello from ${compiler} and ${framework}!`;
}
```

## 빌드 설정 (Set up the build)

### TypeScript 컴파일러 설정 (Configure the TypeScript compiler)

먼저 TypeScript에 빌드 방법을 알려줘야합니다.  
scripts 폴더를 마우스 오른쪽 버튼으로 클릭하고 **New Item**을 클릭합니다.  
그런 다음 **TypeScript ConfigurationFile**을 선택하고 기본 이름인 `tsconfig.json`을 사용하십시오.

![Create tsconfig.json](../../assets/images/tutorials/aspnet/new-tsconfig.png)

기본 `tsconfig.json`를 다음으로 대체하세요:

```json
{
  "compilerOptions": {
      "noImplicitAny": true,
      "noEmitOnError": true,
      "sourceMap": true,
      "target": "es5"
  },
  "files": [
      "./app.ts"
  ],
  "compileOnSave": true
}
```

다음과 같은 차이점을 제외하고 기본값과 유사합니다.

1. `"noImplicitAny": true` 설정합니다.
2. `"excludes"`에 의존하지 않고 명시적으로 `"files"` 리스트를 나열합니다.
3. `"compileOnSave": true` 설정합니다.

새로운 코드를 작성할 때마다 `"nomaplicitany"`가 좋습니다 - &mdash; 실수로 타입이 지정되지 않은 코드를 쓰지 않도록 할 수 있습니다.  
`"compileOnSave"`는 실행중인 웹 앱에서 코드를 손쉽게 업데이트할 수 있도록 해 준다.

### NPM 설정 (Set up NPM)

이제 JavaScript패키지를 다운로드할 수 있도록 NPM을 설정해야 합니다.  
프로젝트를 마우스 오른쪽 버튼으로 누르고 **New Item**을 클릭하십시오.  
그런 다음 **NPM Configuration File**을 선택하고 기본 이름 `package.json`을 사용하십시오.  

``devDependencies '``안에 "gulp"와 "del"을 추가하십시오 :

```json
"devDependencies": {
    "gulp": "3.9.0",
    "del": "2.2.0"
}
```
Visual Studio는 파일을 저장하는 즉시 gulp 및 del 설치를 시작해야합니다.
그렇지 않은 경우 패키지를 마우스 오른쪽 버튼으로 누르고 **Restore Packages**를 하십시오.

### gulp 설정 (Set up gulp)

마지막으로 `gulpfile.js`라는 새로운 JavaScript파일을 추가하십시오.

다음 코드를 입력합니다.

```js
/// <binding AfterBuild='default' Clean='clean' />
/*
이 파일은 Gulp의 작업을 정의하고 플러그인을 사용하기 위한 entry point입니다.
자세한 내용을 보려면 여기를 클릭하십시오. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var del = require('del');

var paths = {
    scripts: ['scripts/**/*.js', 'scripts/**/*.ts', 'scripts/**/*.map'],
};

gulp.task('clean', function () {
    return del(['wwwroot/scripts/**/*']);
});

gulp.task('default', function () {
    gulp.src(paths.scripts).pipe(gulp.dest('wwwroot/scripts'))
});
```

첫번째 줄은 Visual Studio에게 빌드가 끝난 후에 작업을 'default'로 실행하도록 지시합니다.  
또한 Visual Studio에 빌드를 정리하도록 요청하면 'clean'작업도 실행됩니다.

이제 `gulpfile.js`를 마우스 오른쪽 버튼으로 클릭하고 **Task Runner Explorer**를 클릭하십시오.  
'default' 및 'clean'작업이 표시되지 않으면 탐색기를 새로고침 합니다 :

![Refresh Task Runner Explorer](../../assets/images/tutorials/aspnet/task-runner-explorer.png)

## HTML 페이지 작성 (Write an HTML page)

`wwwroot` 안에 `index.html`이라는 새 항목을 추가합니다.

다음 코드를 `index.html`에 사용합니다 :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="scripts/app.js"></script>
    <title></title>
</head>
<body>
    <div id="message"></div>
    <div>
        Compiler: <input id="compiler" value="TypeScript" onkeyup="document.getElementById('message').innerText = sayHello()" /><br />
        Framework: <input id="framework" value="ASP.NET" onkeyup="document.getElementById('message').innerText = sayHello()" />
    </div>
</body>
</html>
```

## 테스트 (Test)

1. 프로젝트를 실행하십시오.
2. 입력 상자에 입력할 때 메시지가 표시됩니다 :

![Picture of running demo](../../assets/images/tutorials/aspnet/running-demo.png)

## 디버그 (Debug)

1. Edge에서 F12 키를 누르고 **Debugger** 탭을 클릭하십시오.
2. 첫 번째 localhost 폴더를 찾은 다음 scripts/app.ts를 찾습니다.
3. `return` 라인이 있는 라인에 breakpoint를 설정합니다
4. Type 상자에 내용을 입력하고 breakpoint가 TypeScript 코드에 들어가고 검사가 올바르게 작동하는지 확인합니다.

![Demo paused on breakpoint](../../assets/images/tutorials/aspnet/paused-demo.png)

ASP.NET 프로젝트에 기본적인 TypeScript를 포함시키기 위해 알아야 할 것은 이것뿐입니다.  
다음으로 간단한 Angular 앱을 작성합니다.

# 앵귤러 2 추가 (Add Angular 2)

## NPM 의존성 추가 (Add NPM dependencies)

`package.json`의 `dependencies`에 Angular 2와 SystemJS를 추가하십시오.

VS2015의 경우는 새로운 `dependencies`리스트 :

```json
  "dependencies": {
    "angular2": "2.0.0-beta.11",
    "systemjs": "0.19.24",
    "gulp": "3.9.0",
    "del": "2.2.0"
  },
```

VS2017의 경우 NPM3에서 peer 의존성이 사용되지 않으므로 Angular 2의 peer 의존성을 의존성으로 직접 나열해야합니다 :

```json
  "dependencies": {
    "angular2": "2.0.0-beta.11",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.2",
    "zone.js": "^0.6.4",
    "systemjs": "0.19.24",
    "gulp": "3.9.0",
    "del": "2.2.0"
  },
```

## tsconfig.json 업데이트 (Update tsconfig.json)

이제 Angular 2와 그 의존성이 설치되었으므로 TypeScript의 데코레이터에 대한 실험적 지원이 필요합니다.  
또한 `Promise`과 같은 것들에는 Angular가 core-js를 사용하기 때문에 ES2015에 선언을 추가해야 합니다.  
향후에는 데코레이터가 기본이 될 것이므로 이러한 설정은 필요하지 않을 것입니다.

`"experimentalDecorators": true, "emitDecoratorMetadata": true`를 `"compilerOptions"`에 추가하십시오.  
그런 다음 ES2015에서 선언을 가져오려면 `"lib": ["es2015", "es5", "dom"]`을 `"compilerOptions"` 에 추가하십시오.  

마지막으로 만들 `"./model.ts"`를 `"files"`에 새 항목을 추가해야 합니다.  
tsconfig는 다음과 같이 보일 것입니다 :

```json
{
    "compilerOptions": {
        "noImplicitAny": true,
        "noEmitOnError": true,
        "sourceMap": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "target": "es5",
        "lib": [
            "es2015", "es5", "dom"
        ]
    },
    "files": [
        "./app.ts",
        "./model.ts",
        "./main.ts"
    ],
    "compileOnSave": true
}
```

## gulp 빌드에 Angular 추가 (Add Angular to the gulp build)

마지막으로 Angular 파일을 빌드의 일부로 복사해야합니다.
추가할 사항은 다음과 같습니다:

1. 라이브러리 파일에 대한 경로.
2. `lib` 태스크를 추가하여 파일을 `wwwroot`에 연결(pipe)합니다.
3. `default` 태스크에 `lib`에 대한 의존성을 추가하십시오.

업데이트된 `gulpfile.js`은 다음과 같이 표시됩니다 :

```xml
/// <binding AfterBuild='default' Clean='clean' />
/*
이 파일은 Gulp의 작업을 정의하고 플러그인을 사용하기 위한 entry point입니다.
자세한 내용을 보려면 여기를 클릭하십시오. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var del = require('del');

var paths = {
    scripts: ['scripts/**/*.js', 'scripts/**/*.ts', 'scripts/**/*.map'],
    libs: ['node_modules/angular2/bundles/angular2.js',
           'node_modules/angular2/bundles/angular2-polyfills.js',
           'node_modules/systemjs/dist/system.src.js',
           'node_modules/rxjs/bundles/Rx.js']
};

gulp.task('lib', function () {
    gulp.src(paths.libs).pipe(gulp.dest('wwwroot/scripts/lib'));
});

gulp.task('clean', function () {
    return del(['wwwroot/scripts/**/*']);
});

gulp.task('default', ['lib'], function () {
    gulp.src(paths.scripts).pipe(gulp.dest('wwwroot/scripts'));
});
```

다시 한번 gulpfile을 저장한 후에는 Task Runner Explorer가 새로운 `lib` 작업을 보게해야 합니다.

## TypeScript에 간단한 Angular 애플리케이션 작성 (Write a simple Angular app in TypeScript)

먼저 `app.ts`의 코드를 다음과 같이 변경하십시오 :

{% raw %}

```ts
import {Component} from "angular2/core"
import {MyModel} from "./model"

@Component({
    selector: `my-app`,
    template: `<div>Hello from {{getCompiler()}}</div>`
})
export class MyApp {
    model = new MyModel();
    getCompiler() {
        return this.model.compiler;
    }
}
```

{% endraw %}

그런 다음 `Model.ts`라는 이름의 `scripts`에 다른 TypeScript 파일을 추가하십시오 :

```ts
export class MyModel {
    compiler = "TypeScript";
}
```

그리고 `scripts`에 `main.ts`라는 또 다른 TypeScript 파일이 있습니다 :

```ts
import {bootstrap} from "angular2/platform/browser";
import {MyApp} from "./app";
bootstrap(MyApp);
```

마지막으로 `index.html`의 코드를 다음과 같이 변경하십시오 :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="scripts/lib/angular2-polyfills.js"></script>
    <script src="scripts/lib/system.src.js"></script>
    <script src="scripts/lib/rx.js"></script>
    <script src="scripts/lib/angular2.js"></script>
    <script>
    System.config({
        packages: {
            'scripts': {
                format: 'cjs',
                defaultExtension: 'js'
            }
        }
    });
    System.import('scripts/main').then(null, console.error.bind(console));
    </script>
    <title></title>
</head>
<body>
    <my-app>Loading...</my-app>
</body>
</html>
```

그러면 앱이 로드됩니다.  
ASP.NET 애플리케이션을 실행하면 "loading..." 이라고 표시된 다음 "Hello from TypeScript" div가 표시됩니다.
