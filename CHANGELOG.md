# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Added
- One simple unit test

### Changed
- Modify test.js (the script used to run Backpat sans project) and
rename as runner.js
- Replace ```console.log``` with ```process.stout.write``` in runner.js

## 0.3.0 - 2016-10-29
### Changed
- Fully removed Github star code and references
- Moved utility functions to helpers.js
- Updated documentation

## 0.2.0 - 2016-10-28
### Added
- Implemented batch request for npm monthly download counts
- Minor code comments

### Changed
- Deprecated Github star count in favor of npm download counts
- Documented change in README

## 0.1.2 - 2016-10-27
### Changed
- Cleaned metadocs
- Removed debugging logs

## 0.1.1 - 2016-10-27
### Added
- Bug fixes (Github API call and url handling)

## 0.1.0 - 2016-10-27
### Added
- README now contains module description and usage documentation
- Module is in solid, largely untested, working order
- Mocha dependencies are in place, however no tests have been written
- Module discovers and reads root package.json in limited dev environments