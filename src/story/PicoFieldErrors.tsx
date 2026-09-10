import { type FieldAtom, useFieldErrors } from "form-atoms";

const style = { color: "var(--pico-color-red-550)" };

export function PicoError({ children }: { children: React.ReactNode }) {
  return <p style={style}>{children} </p>;
}

export const PicoFieldErrors = <T,>({ atom }: { atom: FieldAtom<T> }) => {
  const errors = useFieldErrors(atom);

  return (
    <>
      {errors.map((error) => (
        <PicoError key={error}>{error}</PicoError>
      ))}
    </>
  );
};
