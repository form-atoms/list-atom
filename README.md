<div align="center">
  <img width="180" style="margin: 32px" src="./form-atoms-field.svg">
  <h1>list atom for form-atoms</h1>
</div>

```
yarn add jotai form-atoms @form-atoms/list
```

<a aria-label="NPM version" href="https://www.npmjs.com/package/%40form-atoms/list">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40form-atoms/list?style=for-the-badge&labelColor=24292e">
</a>
<a aria-label="Code coverage report" href="https://codecov.io/gh/form-atoms/list">
  <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/form-atoms/list?style=for-the-badge&labelColor=24292e">
</a>

### Usage

```tsx
import { numberField, stringField, Select } from "@form-atoms/field";
import { fromAtom, useForm } from "form-atoms";
import { z } from "zod";
import { NumberField } from "@form-atoms/flowbite"; // or /chakra-ui

const height = numberField();
const age = numberField({ schema: z.number().min(18) }); // override default schema
const character = stringField().optional(); // make field optional

const personForm = formAtom({ height, age, character });

export const Form = () => {
  const { submit } = useForm(personForm);

  return (
    <form onSubmit={submit(console.log)}>
      <NumberField field={height} label="Height (in cm)" />
      <NumberField field={age} label="Your age (min 18)" />
      <Select
        field={character}
        label="Character"
        options={["the good", "the bad", "the ugly"]}
        getValue={(option) => option}
        getLabel={(option) => option}
      />
    </form>
  );
};
```
