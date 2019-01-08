import { NvimPlugin } from "neovim";

const echo = () => {
  console.log("echoed something");
};

export default (plugin: NvimPlugin) => {
  plugin.registerAutocmd("BufEnter", () => console.log("bufenter called"), {
    pattern: "*"
  });
  plugin.registerCommand("ECHOYO", echo);
};
