컴파일러는 환경 변수를 사용하여 파일과 디렉터리를 감시하는 방법 구성을 지원합니다.

## 환경 변수 `TSC_WATCHFILE`을 사용하여 파일 감시 설정 (Configuring file watching using environment variable `TSC_WATCHFILE`)

옵션                                            | 설명
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | `fs.watchFile`을 사용하지만 소스 파일, 설정 파일 및 누락된 파일에 대해 다른 폴링 주기(polling intervals)를 사용합니다.
`DynamicPriorityPolling`                       | 자주 수정되는 파일을 자주 폴링하고 변경되지 않은 파일을 덜 자주 폴링 하는 동적 큐(dynamic queue)를 사용합니다.
`UseFsEvents`                                  | 파일 시스템 이벤트를 사용하는 `fs.watch`를 사용하여 파일 변경/생성/삭제에 대한 알림을 받습니다. (`fs.watch`는 OS마다 다르게 작동할 수 있습니다.) 예를 들어. 리눅스는 watcher 수에 제한이 있으며 `fs.watch`를 사용하여 watcher를 만들지 못하면, `fs.watchFile`를 대신 사용하여 watcher를 만들게 됩니다.
`UseFsEventsWithFallbackDynamicPolling`        | 이 옵션은 `fs.watch`를 사용하여 감시자를 만들지 못한 경우 폴링이 동적 큐를 통해 수행된다는 것을 제외하고는 `UseFsEvents` 옵션과 비슷합니다.(동적 큐에 대한 것은 `DynamicPriorityPolling`옵션에서 설명하였습니다.).
`UseFsEventsOnParentDirectory`                 | 이 옵션은 'fs.watch'(파일 시스템 이벤트 사용하는)로 파일의 상위 디렉터리를 감시합니다. 다만, CPU 사용량이 늘어나고 정확도는 떨어질 수 있습니다.
default (no value specified)                   | 환경 변수`TSC_NONPOLLING_WATCHER`가 true로 설정되면 파일의 상위 디렉터리를 감시합니다. (`UseFsEventsOnParentDirectory`와 동일).false 일 때는 `fs.watchFile`을 사용하여 `250ms` 시간 제한과 함께 모든 파일들을 감시합니다.

## 환경 변수`TSC_WATCHDIRECTORY`를 사용하여 디렉토리 감시 설정 (Configuring directory watching using environment variable `TSC_WATCHDIRECTORY`)

기본적으로 node에서 디렉터리의 재귀적인 감시를 지원하지 않는 플랫폼에서, 디렉터리 감시 기능은 `TSC_WATCHDIRECTORY`에서 선택한 다양한 옵션을 사용하여 하위 디렉터리에 대한 디렉터리 watcher를 재귀적으로 생성함으로써 지원됩니다. 기본적으로 재귀 디렉터리 감시(예: windows)를 지원하는 플랫폼에서는 이 환경 변수의 값이 무시됩니다.

옵션                                            | 설정
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | `fs.watchFile`을 사용하여 폴링 감시(CPU cycles 사용)인 디렉터리 및 하위 디렉터리를 감시합니다.
`RecursiveDirectoryUsingDynamicPriorityPolling`| 동적 폴링 큐를 사용하여 디렉터리 및 하위 디렉터리에 대한 변경사항을 폴링 합니다.
default (no value specified)                   | `fs.watch`를 사용하여 디렉터리 및 하위 디렉터리를 감시합니다.

## 배경 (Background)

컴파일러의 `--watch` 구현은 node에서 제공하는 `fs.watch`와 `fs.watchFile`에 의존하며, 이 두 방법 모두 장단점이 있습니다.

`fs.watch`는 파일 시스템 이벤트를 사용하여 파일 / 디렉터리의 변경 사항을 알립니다. 하지만 OS에 따라 다르며, 알림은 완전히 믿을 수가 없고, 많은 OS에서 예상대로 동작하지 않습니다. 또한, 생성할 수 있는 watcher의 수에 제한이 있을 수 있으며(예: linux), 파일 수가 많은 프로그램을 사용하면 매우 빠르게 소진할 수 있습니다. 그러나 이 작업은 파일 시스템 이벤트를 사용하기 때문에 CPU cycle에 많이 관여하진 않습니다. 컴파일러는 일반적으로 `fs.watch`를 사용하여 디렉터리를 감시합니다. (예: 설정 파일에 포함된 소스 디렉터리, 모듈 확인을 실패한 디렉터리 ... 등) 변경 사항에 대한 알림에서 누락된 정밀도를 처리할 수 있습니다. 그러나 재귀 감시 기능은 Windows와 OSX에서만 지원됩니다. 즉, 다른 OS들은 재귀적 특성을 대체할 무언가가 필요합니다.

`fs.watchFile`은 폴링을 사용하므로 CPU cycles가 필요합니다만, 파일/디렉터리 상태에 대한 업데이트를 받을 수 있는 가장 신뢰할 수 있는 메커니즘입니다. 컴파일러는 일반적으로 `fs.watchFile`을 사용하여 소스 파일, 구성 파일 및 누락된 파일(누락된 파일 참조)을 감시합니다. 이는 CPU 사용량이 프로그램의 파일 수에 따라 달라진다는 것을 의미합니다.
