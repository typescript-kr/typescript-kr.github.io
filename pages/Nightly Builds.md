[TypeScript의 `master`](https://github.com/Microsoft/TypeScript/tree/master) 브랜치의 nightly 빌드는 태평양 표준시(PST) 자정까지 NPM과 NuGet에 배포됩니다.  
도구를 사용하여 가져오는 방법과 사용하는 방법은 다음과 같습니다.

## npm 사용하기 (Using npm)

```shell
npm install -g typescript@next
```

## MSBuild에 NuGet 사용 (Using NuGet with MSBuild)

> 주의사항: NuGet 패키지를 사용하도록 프로젝트를 구성해야 합니다.
[NuGet를 사용하도록 MSBuild 프로젝트 구성](https://github.com/Microsoft/TypeScript/wiki/Configuring-MSBuild-projects-to-use-NuGet)을 참조하십시오.

nightly는 [www.myget.org](https://www.myget.org/gallery/typescript-preview)에서 이용 가능합니다.

두 패키지가 있습니다:

* `Microsoft.TypeScript.Compiler`: 도구만 사용(`tsc.exe`, `lib.d.ts`, 등.) .
* `Microsoft.TypeScript.MSBuild`: 위와 같은 도구뿐만 아니라 MSBuild 작업 및 대상 (`Microsoft.TypeScript.targets`, `Microsoft.TypeScript.Default.props`, 등.)

## nightly 빌드를 사용하도록 IDE 업데이트 (Updating your IDE to use the nightly builds)

nightly drop을 사용하도록 IDE를 업데이트할 수 있습니다.  
먼저 npm을 통해 패키지를 설치해야 합니다.
npm 패키지를 전역으로 설치하거나 로컬에 있는 `node_modules` 폴더에 설치할 수 있습니다.

이 섹션의 나머지 부분에서는 `typescript@next`가 이미 설치되어 있다고 가정합니다.

### 비주얼 스튜디오 코드 (Visual Studio Code)

`.vscode/settings.json` 파일을 다음과 같이 업데이트하세요:

```json
"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
```

자세한 내용은 [VSCode 문서](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions)를 참조하세요.

### 서브라임 텍스트 (Sublime Text)

`Settings - User` 파일을 다음과 같이 업데이트하세요:

```json
"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
```

자세한 내용은 [서브라임 텍스트를 위한 TypeScript 플러그인 설치 문서](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation)를 참조하세요.

### 비주얼 스튜디오 2013 및 2015 (Visual Studio 2013 and 2015)

> 주의사항: 대부분의 변경 사항에는 새로운 버전의 VS TypeScript 플러그인을 설치할 필요는 없습니다.

현재 nightly 빌드에는 전체 플러그인 설정이 포함되어 있지 않지만 nightly 기반으로 설치 프로그램을 배포하기 위해 노력하고 있습니다.

1. [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1) 스크립트를 다운로드하세요.

   > 또한 [커스텀 언어 서비스 파일 사용](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file)에 대한 위키 페이지를 참조하세요.

2. PowerShell 커맨드 라인 창에서 다음을 실행합니다:

  VS 2015:

  ```posh
  VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
  ```

  VS 2013:

  ```posh
  VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
  ```

### IntelliJ IDEA (Mac)

`Preferences` > `Languages & Frameworks` > `TypeScript`를 선택합니다:
 > TypeScript 버전: npm으로 설치한 경우: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

`File` > `Settings` > `Languages & Frameworks` > `TypeScript`를 선택합니다:
 > TypeScript 버전: npm으로 설치한 경우: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`