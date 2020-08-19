컴파일러는 환경 변수를 사용하여 파일과 디렉터리를 감시하는 방법 구성을 지원합니다.

## 환경 변수 `TSC_WATCHFILE`을 사용하여 파일 감시 설정 (Configuring file watching using environment variable `TSC_WATCHFILE`)

옵션                                            | 설명
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | `fs.watchFile`을 사용하지만 소스 파일, 설정 파일 및 누락된 파일에 대해 다른 폴링 주기(polling intervals)를 사용합니다.
`DynamicPriorityPolling`                       | 자주 수정되는 파일을 자주 폴링하고 변경되지 않은 파일을 덜 자주 폴링 하는 동적 큐(dynamic queue)를 사용합니다.
`UseFsEvents`                                  | 파일 시스템 이벤트를 사용하는 `fs.watch`API를 사용하여 파일 변경/생성/삭제에 대한 알림을 받습니다. (`fs.watch`API는 OS마다 다르게 작동할 수 있습니다.) 예를 들어. 리눅스는 감시자(watcher) 수에 제한이 있으며 `fs.watch`API를 사용하여 감시자를 만들지 못하면, `fs.watchFile`API를 대신 사용하여 감시자를 만들게 됩니다.
`UseFsEventsWithFallbackDynamicPolling`        | 이 옵션은 `fs.watch`를 사용하여 감시자를 만들지 못한 경우 폴링이 동적 큐를 통해 수행된다는 것을 제외하고는 `UseFsEvents` 옵션과 비슷합니다.(동적 큐에 대한 것은 `DynamicPriorityPolling`옵션에서 설명하였습니다.).
`UseFsEventsOnParentDirectory`                 | 이 옵션은 'fs.watch'(파일 시스템 이벤트 사용)로 파일의 상위 디렉터리를 감시합니다. 다만, CPU 사용량이 늘어나고 정확도는 떨어질 수 있습니다.
default (no value specified)                   | 환경 변수`TSC_NONPOLLING_WATCHER`가 true로 설정되면 파일의 상위 디렉터리를 감시합니다. (`UseFsEventsOnParentDirectory`와 동일).false 일 경우에는 `fs.watchFile`을 사용하여  `250ms`안에 모든 파일들을 감시합니다.

## Configuring directory watching using environment variable `TSC_WATCHDIRECTORY`

The watching of directory on platforms that don't support recursive directory watching natively in node, is supported through recursively creating directory watcher for the child directories using different options selected by `TSC_WATCHDIRECTORY`. Note that on platforms that support native recursive directory watching (e.g windows) the value of this environment variable is ignored.

Option                                         | Description
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | Use `fs.watchFile` to watch the directories and child directories which is a polling watch (consuming CPU cycles)
`RecursiveDirectoryUsingDynamicPriorityPolling`| Use dynamic polling queue to poll changes to the directory and child directories.
default (no value specified)                   | Use `fs.watch` to watch directories and child directories

## Background

`--watch` implementation of the compiler relies on `fs.watch` and `fs.watchFile` provided by node, both of these methods have pros and cons.

`fs.watch` uses file system events to notify the changes in the file/directory. But this is OS dependent and the notification is not completely reliable and does not work as expected on many OS. Also there could be limit on number of watches that can be created, eg. linux and we could exhaust it pretty quickly with programs that include large number of files. But because this uses file system events, there is not much CPU cycle involved. Compiler typically uses `fs.watch` to watch directories (eg. source directories included by config file, directories in which module resolution failed etc) These can handle the missing precision in notifying about the changes. But recursive watching is supported on only Windows and OSX. That means we need something to replace the recursive nature on other OS.

`fs.watchFile` uses polling and thus involves CPU cycles. But this is the most reliable mechanism to get the update on the status of file/directory. Compiler typically uses `fs.watchFile` to watch source files, config files and missing files (missing file references) that means the CPU usage depends on number of files in the program.
