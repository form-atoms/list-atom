import { FormFieldValues, FormFields } from "form-atoms";
import { ReactNode } from "react";

import { List, ListProps } from ".";

export const ListField = <Fields extends FormFields>({
  atom,
  label,
  ...listProps
}: {
  label: ReactNode;
} & ListProps<Fields, FormFieldValues<Fields>>) => {
  return (
    <>
      <label>{label}</label>
      <List atom={atom} {...listProps} />
    </>
  );
};
