import { FieldAtom, useFieldErrors } from "form-atoms";

const style = { color: "var(--pico-color-red-550)" };

export const PicoFieldErrors = <T,>({ atom }: { atom: FieldAtom<T> }) => {
  const errors = useFieldErrors(atom);

  return (
    <>
      {errors.map((error, index) => (
        <p key={index} style={style}>
          {error}
        </p>
      ))}
    </>
  );
};
