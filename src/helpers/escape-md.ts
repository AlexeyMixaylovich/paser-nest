const markdownV2EscapeList = [
  '_',
  '*',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!',
];

export const escapeMarkdown = (text: string) =>
  markdownV2EscapeList.reduce(
    (oldText, charToEscape) =>
      oldText.replaceAll(charToEscape, `\\${charToEscape}`),
    text,
  );
