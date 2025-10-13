"use server";

import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

const schema = z.object({
  environment: z.array(
    z.object({
      variable: z.string(),
      value: z.string(),
    }),
  ),
});

type Payload = { message: string } | z.infer<typeof schema>;

export async function deserialize(_: Payload, formData: FormData) {
  console.log(JSON.stringify(Object.fromEntries(formData)));

  const result = parseWithZod(formData, { schema });

  if (result.status === "success") {
    const { value } = result;
    console.log(value);

    return value;
  } else {
    return { message: "Failed to parse form data." };
  }
}
