# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [v3.0.5] - 2019-05-29
### Fixed
- publish correct CHANGELOG

## [v3.0.4] - 2019-05-29
### Fixed
- fix RunKit example

## [v3.0.0] - 2019-05-29
### Added
- added `BehaviorContainer#toogle(key) -> boolean`

### Changed
- BREAKING: now all native actions has `$` as prefix (e.g.: `$create` instead of `create`)

## [2.0.1]
### Removed
- removed some unused pices of code in `lib/behavior-system.js`

### Fixed
- fixed CHANGELOG version.

### Security
- code coverage now is 100%!

## [2.0.0]
### Added
- BREAKING: renamed `BehaviorContainer#id` to `BehaviorContainer#getID() -> int` (now is a function). Now this value is **unique** per each enabled `BehaviorContainer`.

### Changed
- modern code with classes
- removed some unused variables
- minimal internal code changes

### Fixed
- `BehaviorSystem#disable()` now works correctly and recycles BehaviorContainer ids

## [1.2.1]
### Changed
- internal code optimization
- updated devDependecies

## [1.2.0]
### Changed
- internal code refactoration
- better test descriptions
- now using package `tap-dot` instead `tap-spec`
- removed the `extend` helper function in favor of `Object.assign`

## [1.1.0] - 2017-06-15
### Added
- `BehaviorContainer.prototype.pause(key:string) -> boolean`: pause an instance
	- The `BehaviorContainer` can't process methods of a paused `'key'`
	- `paused` method is called when a behavior instance is paused
	- returns a `boolean` to indicate the success/fail
- `BehaviorContainer.prototype.resume(key:string) -> boolean`: resume an paused instance
	- `resumed` method is called when a behavior instance is paused
	- returns a `boolean` to indicate the success/fail
- `BehaviorContainer.prototype.pauseAll()`: pause all instances of a container
- `BehaviorContainer.prototype.resumeAll()`: resume all paused instances of a container
- `BehaviorContainer.prototype.isPaused()`: returns a true if the instance is paused

### Changed
- now using package `tap-spec` instead `tap-min`

### Contributors
- @Oli4242

## [1.0.2] - 2017-01-18

### Changed
- updated `example.js`

## [1.0.1] - 2017-01-18
### Added
- added nodejs version in `package.json`

## [1.0.0] - 2017-01-18
### Added
- `BehaviorContainer.prototype.removeAll`: remove all behavior instances of object
- `BehaviorContainer.prototype.processAll`: process a which method of all behavior instances of object
- `BehaviorContainer.prototype.process` can have a return value
- `BehaviorContainer.prototype.process` can pass extras arguments to the methods
- `BehaviorContainer.prototype.processAll` can pass extras arguments to the methods
- `BehaviorSystem.prototype.globalProcessAll` can pass extras arguments to the methods

### Changed
- renamed `BehaviorSystem.prototype.processAll` to `.globalProcessAll`
- `BehaviorSystem.prototype.enable` now returns a boolean to indicate the success/fail
- `BehaviorSystem.prototype.disable` now returns a boolean to indicate the success/fail
- `BehaviorContainer.prototype.set` now returns the key of newly behavior instance
- `BehaviorContainer.prototype.remove` now returns a boolean to indicate the success/fail

### Removed

- `BehaviorContainer.prototype.get`
