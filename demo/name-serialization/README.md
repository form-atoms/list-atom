# A deserialization example

This example uses [`parseWithZod`](https://conform.guide/api/zod/parseWithZod) to demonstrate how the `listAtom` field names, are parsed on the server,
when passed as `FormData` object through a React action.

```json
{
  "environment[0].variable": "PACKAGE_NAME",
  "environment[0].value": "form-atoms",
  "environment[1].variable": "APP_URL",
  "environment[1].value": "https://jotai.org"
}
```

```js
{
  environment: [
    { variable: "PACKAGE_NAME", value: "form-atoms" },
    { variable: "APP_URL", value: "https://jotai.org" },
  ];
}
```

## Install

```
npm install
```

## Run

```
npm run dev
```
