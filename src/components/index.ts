// import type { FormFields } from "form-atoms";
// import { FunctionComponent } from "react";

// import { type AddProps, createAdd } from "./add";
// import { type EmptyProps, createEmpty } from "./empty";
// import { type ItemProps, createItem } from "./item";
// import { type ListProps, createList } from "./list";
// import { Nested, type NestedProps } from "./nested";
// import type { ListAtom } from "../atoms";

// /**
//  * Creates compound components for the List component.
//  * It applies the given atom to each of the components, eliminating the need for React.Context.
//  * @param atom
//  */
// export function createComponents<Fields extends FormFields>(
//   listAtom: ListAtom<Fields, any>,
// ) {
//   const root = createList(listAtom);

//   Object.assign(root.List, {
//     ...createAdd(listAtom),
//     ...createEmpty(listAtom),
//     ...createItem(listAtom),
//     Nested,
//   });

//   return root;
// }
