import { NvimPlugin } from 'neovim';

export default (plugin: NvimPlugin) => {
  plugin.registerAutocmd('BufEnter', () => setTimeout(() => plugin.nvim.outWriteLine('YOU ROCK!'), 2000), {
    pattern: '*',
  });

  plugin.registerAutocmd('BufWritePre', () => updateTime(plugin), { pattern: '*.md,*.mdx', sync: true });
  plugin.registerCommand('InsertDate', () => insertDate(plugin));
};

// update time looks for updatedAt in the frontmatter of the md file and updates it to now
const updateTime = async (p: NvimPlugin) => {
  const lines = await p.nvim.buffer.getLines();

  if (lines[0].match('---')) {
    for (const [i, l] of lines.slice(1).entries()) {
      if (l.match('updatedAt: ')) {
        await p.nvim.buffer.setLines([`updatedAt: ${new Date().toUTCString()}`], { start: i + 1, end: i + 2 });
      }

      if (l.match('---')) {
        break;
      }
    }
  }
};

// insert date inserts the date at the end of the line
const insertDate = async (p: NvimPlugin) => {
  const line = await p.nvim.getLine();
  await p.nvim.setLine(`${line} ${new Date().toUTCString()}`);
};
