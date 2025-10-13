import { type StoryObj } from "@storybook/react-vite";
import { type FormFieldValues, type FormFields } from "form-atoms";
import { RenderProp } from "react-render-prop-type";

import { type ListAtom } from "../atoms";
import { StoryForm } from "./StoryForm";
import { createList, ListComponents } from "../components/list";

export function render<Fields extends FormFields>({
  atom,
  children,
}: ListStoryArgs<Fields>) {
  const { List } = createList(atom);

  return children({ List, atom });
}

type ListStoryArgs<Fields extends FormFields> = {
  hideFormActions?: boolean;
  atom: ListAtom<Fields, FormFieldValues<Fields>>;
} & RenderProp<
  ListComponents<Fields> & {
    atom: ListAtom<Fields, FormFieldValues<Fields>>;
  }
>;

export const createListStory = <Fields extends FormFields>(
  storyObj: {
    args: ListStoryArgs<Fields>;
  } & Omit<StoryObj, "args">,
) => ({
  decorators: [
    (Story: () => JSX.Element) => (
      <StoryForm
        fields={{ field: storyObj.args.atom }}
        hideFormActions={storyObj.args.hideFormActions}
      >
        {() => <Story />}
      </StoryForm>
    ),
  ],
  ...storyObj,
});

export const RemoveButton = ({ remove }: { remove: () => void }) => (
  <button type="button" className="outline secondary" onClick={remove}>
    Remove
  </button>
);
