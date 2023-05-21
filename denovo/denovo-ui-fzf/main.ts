import type { Denovo } from "https://deno.land/x/denovo_core@v0.0.1/mod.ts";
import {
  assertArray,
  isString,
} from "https://deno.land/x/unknownutil@v2.1.1/mod.ts";

export function main(denovo: Denovo): Promise<void> {
  denovo.dispatcher = {
    fzf(...input: unknown[]): Promise<string> {
      assertArray(input, isString);
      return fzf(denovo, input);
    },
  };
  return Promise.resolve();
}

async function fzf(denovo: Denovo, input: string[]): Promise<string> {
  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  return denovo.eval(`fzf < ${temp}`).finally(() => {
    Deno.removeSync(temp);
  });
}
