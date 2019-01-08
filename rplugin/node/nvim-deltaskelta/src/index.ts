import { NvimPlugin } from 'neovim';

const echo = (plugin: NvimPlugin) => {
  plugin.nvim.outWriteLine(`it is: ${new Date().toDateString()}`);
};

const onBufEnter = (plugin: NvimPlugin) => {
  plugin.nvim.outWriteLine('onBufEnter called');
};

export default (plugin: NvimPlugin) => {
  plugin.registerAutocmd('BufEnter', () => onBufEnter(plugin), {
    pattern: '*',
  });

  plugin.registerCommand('EchoTime', () => echo(plugin));
};
