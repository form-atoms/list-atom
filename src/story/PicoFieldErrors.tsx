import { FieldAtom, useFieldErrors } from "form-atoms";

const style = { color: "var(--pico-color-red-550)" };

export const PicoFieldErrors = ({ atom }: { atom: FieldAtom<any> }) => {
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
