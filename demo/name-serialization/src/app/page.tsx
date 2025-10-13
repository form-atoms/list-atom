"use client";

import { useActionState } from "react";

import { Form } from "./form";
import { deserialize } from "./action";

export default function Home() {
  const [state, formAction] = useActionState(deserialize, {
    message: "No data submitted yet",
  });

  const initialValue = "environment" in state ? state.environment : undefined;

  return (
    <article>
      <header>
        <h2>Serialization in react submit action demo</h2>
      </header>
      <Form initialValue={initialValue} action={formAction} />
      <footer>
        {"message" in state ? state.message : JSON.stringify(state)}
      </footer>
    </article>
  );
}
