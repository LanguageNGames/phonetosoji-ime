import cmudictText from "./cmudict.txt?raw";

import { parseCmudict }
from "../utils/parseCmudict";

export const cmuDictionary =
  parseCmudict(cmudictText);