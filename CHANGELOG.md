# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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
