# LM Studio Prompt (Raycast)

One Raycast command, `LM Studio Prompt`, that sends a single prompt to a local LM Studio model through its Anthropic-compatible Messages API (`/v1/messages`) and streams the answer. No conversation history: every run is one-shot.

Prompts live in Raycast Quicklinks, not in the extension.

## Arguments

| Argument | Required | Meaning |
|---|---|---|
| `prompt` | yes | Prompt text. The command replaces `{selection}` with the text selected in the frontmost app (Raycast itself does not expand it in deeplinks); errors if nothing is selected |
| `model` | yes | LM Studio model identifier (`lms ls`) |
| `reasoning` | no | `off` (default) or `on`. LM Studio only maps thinking on/off; effort levels are ignored |

Sampling parameters (temperature etc.) are not arguments: Raycast allows at most 3, and sampling belongs to the model's settings in LM Studio.

Preference `Server URL` defaults to `http://localhost:1234`.

## Install

```bash
npm install
npm run dev   # imports the extension into Raycast; Ctrl-C when done, it stays installed
```

The LM Studio server must be running (`lms server start`, or the Developer tab in LM Studio).

## Quicklink format

```
raycast://extensions/dawson/lmstudio/prompt?arguments=<encodeURIComponent(JSON)>
```

where the JSON is e.g. `{"prompt":"...{selection}...","model":"qwen3.8-27b-heretic-ara","reasoning":"off"}`.

In the result view: `Enter` copies the answer, `Cmd+Enter` pastes it into the frontmost app.
