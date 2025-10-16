## [2.3.8](https://github.com/form-atoms/list-atom/compare/v2.3.7...v2.3.8) (2025-10-16)


### Bug Fixes

* **list-item:** peek the field names, no need to subscribe ([e3e5995](https://github.com/form-atoms/list-atom/commit/e3e5995e644acb2398a049c9d88e7c9a0df263e1))

## [2.3.7](https://github.com/form-atoms/list-atom/compare/v2.3.6...v2.3.7) (2025-10-16)


### Bug Fixes

* **list-atom:** drop the Value generic param, derive from Fields ([8a469cd](https://github.com/form-atoms/list-atom/commit/8a469cd136d04675c0718091c076fec1abcb03f7))

## [2.3.6](https://github.com/form-atoms/list-atom/compare/v2.3.5...v2.3.6) (2025-10-15)


### Bug Fixes

* **scoped-naming:** support intermediary objects (fixes [#18](https://github.com/form-atoms/list-atom/issues/18)) ([255ff7e](https://github.com/form-atoms/list-atom/commit/255ff7e080d426859348722eda9ecf36df3f45f6))

## [2.3.5](https://github.com/form-atoms/list-atom/compare/v2.3.4...v2.3.5) (2025-10-15)


### Bug Fixes

* **createList:** split the List from the components creation ([961a737](https://github.com/form-atoms/list-atom/commit/961a7374015b45398921194b064ad70352cdf7f6))

## [2.3.4](https://github.com/form-atoms/list-atom/compare/v2.3.3...v2.3.4) (2025-10-15)


### Bug Fixes

* **initialization:** add effect only when a value is present ([1f0c7fe](https://github.com/form-atoms/list-atom/commit/1f0c7fed86cf4d60fe583c1e3eba1662f2d7045a))
* **list-item:** simplify parent list name ([392bc02](https://github.com/form-atoms/list-atom/commit/392bc02a75835796621a296086f4f0d310592ff7))

## [2.3.3](https://github.com/form-atoms/list-atom/compare/v2.3.2...v2.3.3) (2025-10-15)


### Bug Fixes

* **list-item:** disable proxy write to original field name ([cf9fdff](https://github.com/form-atoms/list-atom/commit/cf9fdfff69f62b304cb33b94e1cb63254a7495d2))

## [2.3.2](https://github.com/form-atoms/list-atom/compare/v2.3.1...v2.3.2) (2025-10-15)


### Bug Fixes

* **listItemForm:** the item name is in the `name` atom ([0bebdcd](https://github.com/form-atoms/list-atom/commit/0bebdcd2c617ee48311f95de6af98c6040fec4ab))

## [2.3.1](https://github.com/form-atoms/list-atom/compare/v2.3.0...v2.3.1) (2025-10-15)


### Bug Fixes

* **listAtom:** provide empty value as default config value ([12af0f5](https://github.com/form-atoms/list-atom/commit/12af0f5e9f5b936ef1b5340cc4ecb8de82f7a108))

# [2.3.0](https://github.com/form-atoms/list-atom/compare/v2.2.5...v2.3.0) (2025-10-14)


### Features

* **ListOf:** export Nested as ListOf ([c1bbdcc](https://github.com/form-atoms/list-atom/commit/c1bbdccac17917c56381dec4e9482469086d94f8))

## [2.2.5](https://github.com/form-atoms/list-atom/compare/v2.2.4...v2.2.5) (2025-10-13)


### Bug Fixes

* **types:** drop the render-prop as only children prop is used now ([00d08f6](https://github.com/form-atoms/list-atom/commit/00d08f6cbbf78b36fc25fae488670458b5bf68a4))

## [2.2.4](https://github.com/form-atoms/list-atom/compare/v2.2.3...v2.2.4) (2025-10-10)


### Bug Fixes

* **add:** type the AddChildrenProps, update docs ([e3c0d09](https://github.com/form-atoms/list-atom/commit/e3c0d09be4c8b0b606521b5bf96f86275dab94e6))

## [2.2.3](https://github.com/form-atoms/list-atom/compare/v2.2.2...v2.2.3) (2025-10-10)


### Bug Fixes

* **types/List.Item:** the `add` action accepts a value ([ee33e14](https://github.com/form-atoms/list-atom/commit/ee33e14cf726c1149d3daf16ea34fa96e88a0f0c))

## [2.2.2](https://github.com/form-atoms/list-atom/compare/v2.2.1...v2.2.2) (2025-10-09)


### Bug Fixes

* **types:** fix lint errors, add generic types instead of any ([96fc9ac](https://github.com/form-atoms/list-atom/commit/96fc9acf4f70cf0cdfeb4b02896467f6d9267f47))

## [2.2.1](https://github.com/form-atoms/list-atom/compare/v2.2.0...v2.2.1) (2025-10-07)


### Bug Fixes

* **types:** list ([4b94f02](https://github.com/form-atoms/list-atom/commit/4b94f0282d2bd340e531214d9ac2bc0c3f32c0d0))

# [2.2.0](https://github.com/form-atoms/list-atom/compare/v2.1.1...v2.2.0) (2025-10-06)


### Features

* **item-initialization:** initialize by effect, without builder value ([ed7265e](https://github.com/form-atoms/list-atom/commit/ed7265e3aa3bb023935c5574c554192936449780))

# [2.2.0-next.1](https://github.com/form-atoms/list-atom/compare/v2.1.1...v2.2.0-next.1) (2025-10-06)


### Features

* **item-initialization:** initialize by effect, without builder value ([ed7265e](https://github.com/form-atoms/list-atom/commit/ed7265e3aa3bb023935c5574c554192936449780))

## [2.1.1](https://github.com/form-atoms/list-atom/compare/v2.1.0...v2.1.1) (2025-10-02)


### Bug Fixes

* **Nested:** use memo instead of state ([ad3c27e](https://github.com/form-atoms/list-atom/commit/ad3c27efbc85d8195145f2ff954008eb58d9ced8))

# [2.1.0](https://github.com/form-atoms/list-atom/compare/v2.0.0...v2.1.0) (2025-10-02)


### Bug Fixes

* **release:** use OIDC instead of npm token for publishing ([42abd9e](https://github.com/form-atoms/list-atom/commit/42abd9e2be0f88e34661db8f1763079f81d7de43))


### Features

* **compound-components:** drop render props, introduce compounding ([b04e62e](https://github.com/form-atoms/list-atom/commit/b04e62eb02922c4c93fe7745c24604fd6d42f2f5))

# [2.1.0-next.1](https://github.com/form-atoms/list-atom/compare/v2.0.0...v2.1.0-next.1) (2025-10-02)


### Bug Fixes

* **release:** use OIDC instead of npm token for publishing ([42abd9e](https://github.com/form-atoms/list-atom/commit/42abd9e2be0f88e34661db8f1763079f81d7de43))


### Features

* **compound-components:** drop render props, introduce compounding ([b04e62e](https://github.com/form-atoms/list-atom/commit/b04e62eb02922c4c93fe7745c24604fd6d42f2f5))

# [2.1.0-next.1](https://github.com/form-atoms/list-atom/compare/v2.0.0...v2.1.0-next.1) (2025-10-01)


### Bug Fixes

* **release:** use OIDC instead of npm token for publishing ([42abd9e](https://github.com/form-atoms/list-atom/commit/42abd9e2be0f88e34661db8f1763079f81d7de43))


### Features

* **compound-components:** drop render props, introduce compounding ([d9fa7f0](https://github.com/form-atoms/list-atom/commit/d9fa7f026699ebded2dfedaf44558963890648a7))

# [2.0.0](https://github.com/form-atoms/list-atom/compare/v1.1.0...v2.0.0) (2025-09-19)


### Features

* **name-scoping:** upgrade effect to v2 ([e90543a](https://github.com/form-atoms/list-atom/commit/e90543a1c5c374f8386442ea49a702f9b432aa13))


### BREAKING CHANGES

* **name-scoping:** you need to update the jotai effect

# [1.1.0](https://github.com/form-atoms/list-atom/compare/v1.0.12...v1.1.0) (2025-09-19)


### Features

* **input-name:** jotai effect stable v1 ([907ca2b](https://github.com/form-atoms/list-atom/commit/907ca2b1418b5a406e205ca41472bc5363c92951))

## [1.0.12](https://github.com/form-atoms/list-atom/compare/v1.0.11...v1.0.12) (2024-09-13)


### Bug Fixes

* **valueAtom:** enable setValue with a callback function ([#11](https://github.com/form-atoms/list-atom/issues/11)) ([2569a5c](https://github.com/form-atoms/list-atom/commit/2569a5c5c15ab3d3d0b0e5bde2f4884be6e2eb24))

## [1.0.11](https://github.com/form-atoms/list-atom/compare/v1.0.10...v1.0.11) (2024-03-07)


### Bug Fixes

* **refAtom:** make the same type as fieldAtom ([f7dac70](https://github.com/form-atoms/list-atom/commit/f7dac708fce44af074680e81475df1f7a6d95d9b))

## [1.0.10](https://github.com/form-atoms/list-atom/compare/v1.0.9...v1.0.10) (2024-03-07)


### Bug Fixes

* **types:** errorsAtom as primitiveAtom ([2d2a6dd](https://github.com/form-atoms/list-atom/commit/2d2a6ddfd66275f2edf7e576f517b64093e0ac1c))

## [1.0.9](https://github.com/form-atoms/list-atom/compare/v1.0.8...v1.0.9) (2024-03-07)


### Bug Fixes

* **types:** cleanup the FormAtom copypaste, infer it without Atom wrap ([94ae550](https://github.com/form-atoms/list-atom/commit/94ae550a49f821042741eba3c3021e37c852a169))

## [1.0.8](https://github.com/form-atoms/list-atom/compare/v1.0.7...v1.0.8) (2024-03-07)


### Bug Fixes

* remove unnecessary wrapping for fields ([bb1b1b4](https://github.com/form-atoms/list-atom/commit/bb1b1b4f9da8831cbd0e777307837e04dd60e105))

## [1.0.7](https://github.com/form-atoms/list-atom/compare/v1.0.6...v1.0.7) (2024-03-06)


### Bug Fixes

* **List:** don't export internal props ([774f194](https://github.com/form-atoms/list-atom/commit/774f19475a658ed7c4cb1e4ba8e4e56d14905252))

## [1.0.6](https://github.com/form-atoms/list-atom/compare/v1.0.5...v1.0.6) (2024-03-06)


### Bug Fixes

* **item#moveDown:** make item first when last ([c5f858d](https://github.com/form-atoms/list-atom/commit/c5f858d0816fadb0f1a796fb67878128a35145fb))

## [1.0.5](https://github.com/form-atoms/list-atom/compare/v1.0.4...v1.0.5) (2024-03-06)


### Bug Fixes

* **scripts:** no postinstall ([c6c0d52](https://github.com/form-atoms/list-atom/commit/c6c0d52daa27c8c9164378090c2c1e934b87875d))

## [1.0.4](https://github.com/form-atoms/list-atom/compare/v1.0.3...v1.0.4) (2024-03-06)


### Bug Fixes

* **types:** PrimitiveAtom extends PrimitiveAtom is broken ([edf45c1](https://github.com/form-atoms/list-atom/commit/edf45c18819bd9883a23a02c2806af3dddfd0b3a))

## [1.0.3](https://github.com/form-atoms/list-atom/compare/v1.0.2...v1.0.3) (2024-03-05)


### Bug Fixes

* **build:** omit story files ([26b76df](https://github.com/form-atoms/list-atom/commit/26b76dfaf23850847fe601d20ccae169e0d36866))

## [1.0.2](https://github.com/form-atoms/list-atom/compare/v1.0.1...v1.0.2) (2024-03-05)


### Bug Fixes

* **debug:** add labels to atoms, mark internal atoms as private ([0b5ea09](https://github.com/form-atoms/list-atom/commit/0b5ea090ea73ba21571ab62d158e3582c6e14b57))

## [1.0.1](https://github.com/form-atoms/list-atom/compare/v1.0.0...v1.0.1) (2024-03-05)


### Bug Fixes

* reuse the buildItem method when adding items to the list ([b9e0af5](https://github.com/form-atoms/list-atom/commit/b9e0af523b6a8b2e0a7a2163641897e5d18bb99d))

# 1.0.0 (2024-03-04)


### Bug Fixes

* codecov ([025f5c3](https://github.com/form-atoms/list-atom/commit/025f5c3cd17f543845349e79e2b2303cdda0b715))
* export & name atom ([247785b](https://github.com/form-atoms/list-atom/commit/247785b97cb582203a124b4323a4189432378d2a))

# 1.0.0 (2024-03-04)

### Initial release

- the `listAtom` extracted from the `@form-atom/field` package now usable with plain fieldAtoms.
- dropped support for flat list
