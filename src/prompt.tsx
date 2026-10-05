import Anthropic from "@anthropic-ai/sdk";
import {
  Action,
  ActionPanel,
  Detail,
  getPreferenceValues,
  getSelectedText,
  LaunchProps,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useRef, useState } from "react";

// Upper bound only; generation normally stops on its own long before this.
const MAX_TOKENS = 32768;
const SELECTION = "{selection}";

// Raycast does not expand `{selection}` in deeplink arguments; the command must.
async function resolvePrompt(prompt: string): Promise<string> {
  if (!prompt.includes(SELECTION)) return prompt;
  const selection = await getSelectedText(); // rejects when nothing is selected
  // Function replacer: a string replacement would interpret `$&` etc. inside the selection.
  return prompt.replaceAll(SELECTION, () => selection);
}

export default function Command(props: LaunchProps<{ arguments: Arguments.Prompt }>) {
  const { prompt, model, reasoning } = props.arguments;
  const { baseUrl } = getPreferenceValues<Preferences>();
  const [thinking, setThinking] = useState("");
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  // Development builds render in StrictMode, which runs the effect below twice on mount. Both runs must
  // share one selection read: concurrent getSelectedText() calls corrupt each other via the clipboard.
  const resolved = useRef<Promise<string>>(undefined);

  useEffect(() => {
    // TODO(security): LM Studio runs without auth by default; the SDK requires a key, so send a placeholder.
    // Local server: retrying a refused connection only delays the error.
    const client = new Anthropic({ baseURL: baseUrl, apiKey: "lm-studio", maxRetries: 0 });
    // Closing the Raycast window aborts the request; that is not a failure.
    const controller = new AbortController();

    (async () => {
      const content = await (resolved.current ??= resolvePrompt(prompt));
      if (controller.signal.aborted) return;
      // LM Studio maps `thinking` to the model's on/off switch only; effort levels are ignored.
      const stream = client.messages.stream(
        {
          model,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content }],
          ...(reasoning === "on" && { thinking: { type: "adaptive" } }),
        },
        { signal: controller.signal },
      );
      stream.on("thinking", (_, snapshot) => setThinking(snapshot));
      stream.on("text", (_, snapshot) => setText(snapshot));
      await stream.done();
      setDone(true);
    })().catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setDone(true);
      showToast({ style: Toast.Style.Failure, title: "LM Studio Prompt failed", message: String(error) });
    });

    return () => controller.abort();
  }, []);

  // Show the reasoning as a quote while it streams, then only the answer.
  const markdown = text || (thinking && `> ${thinking.trim().replaceAll("\n", "\n> ")}`);

  return (
    <Detail
      isLoading={!done}
      navigationTitle={model}
      markdown={markdown}
      actions={
        text && (
          <ActionPanel>
            <Action.CopyToClipboard content={text} />
            <Action.Paste content={text} />
          </ActionPanel>
        )
      }
    />
  );
}
