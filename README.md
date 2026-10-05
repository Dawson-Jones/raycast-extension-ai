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

## Examples

Quicklinks I use daily. Select text in any app, run the Quicklink, then `Cmd+Enter` to paste the result back.

### Translate to Chinese

Prompt:

```
Act as a professional technical translator. Rules:
1. Strip code-specific symbols (like //, #, /*, */) if they exist.
2. Smartly join lines that are split by line breaks to form coherent sentences, but keep intentional paragraph breaks.
3. Translate into natural, fluent Chinese.
4. Output translation ONLY.

Text:
{selection}
```

Quicklink:

```
raycast://extensions/dawson/lmstudio/prompt?arguments=%7B%22prompt%22%3A%22Act%20as%20a%20professional%20technical%20translator.%20Rules%3A%5Cn1.%20Strip%20code-specific%20symbols%20(like%20%2F%2F%2C%20%23%2C%20%2F*%2C%20*%2F)%20if%20they%20exist.%5Cn2.%20Smartly%20join%20lines%20that%20are%20split%20by%20line%20breaks%20to%20form%20coherent%20sentences%2C%20but%20keep%20intentional%20paragraph%20breaks.%5Cn3.%20Translate%20into%20natural%2C%20fluent%20Chinese.%5Cn4.%20Output%20translation%20ONLY.%5Cn%5CnText%3A%5Cn%7Bselection%7D%22%2C%22model%22%3A%22qwen3.8-27b-heretic-ara%22%2C%22reasoning%22%3A%22off%22%7D
```

### Fix spelling and grammar

Prompt:

```
Act as a spelling corrector and improver. Reply only with the rewritten text.

Strictly follow these rules:
- Correct spelling, grammar and punctuation
- Keep the original language
- NEVER surround the rewritten text with quotes
- Keep all URLs unchanged
- Don't change emojis

Text: {selection}

Fixed Text:
```

Quicklink:

```
raycast://extensions/dawson/lmstudio/prompt?arguments=%7B%22prompt%22%3A%22Act%20as%20a%20spelling%20corrector%20and%20improver.%20Reply%20only%20with%20the%20rewritten%20text.%5Cn%5CnStrictly%20follow%20these%20rules%3A%5Cn-%20Correct%20spelling%2C%20grammar%20and%20punctuation%5Cn-%20Keep%20the%20original%20language%5Cn-%20NEVER%20surround%20the%20rewritten%20text%20with%20quotes%5Cn-%20Keep%20all%20URLs%20unchanged%5Cn-%20Don't%20change%20emojis%5Cn%5CnText%3A%20%7Bselection%7D%5Cn%5CnFixed%20Text%3A%22%2C%22model%22%3A%22qwen3.8-27b-heretic-ara%22%2C%22reasoning%22%3A%22off%22%7D
```

Both use `qwen3.8-27b-heretic-ara` with reasoning `off`; swap in any model from `lms ls`.
