export const codepoints = {
  "add": "e145",
  "archive": "e149",
  "calendar_today": "e935",
  "chevron_left": "e5cb",
  "chevron_right": "e5cc",
  "download": "f090",
  "edit": "e3c9",
  "expand_less": "e5ce",
  "expand_more": "e5cf",
  "filter_list": "e152",
  "groups": "e7ef",
  "help": "e887",
  "keyboard_arrow_down": "e313",
  "menu_book": "ea19",
  "message": "e0c9",
  "payments": "ef63",
  "remove": "e15b",
  "settings": "e8b8",
  "video_library": "e04a",
  "view_cozy": "eb75",
};

export const getCodepoint = (name: string) => {
  try {
    const codePoint = parseInt(codepoints[name as keyof typeof codepoints], 16);
    return String.fromCodePoint(codePoint);
  } catch (_e) {
    return name;
  }
};
