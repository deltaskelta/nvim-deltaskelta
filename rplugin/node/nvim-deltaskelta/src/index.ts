import { NvimPlugin } from 'neovim';

export default (p: NvimPlugin) => {
  p.setOptions({ dev: true });
  const { remap } = funcs(p);

  p.registerAutocmd('BufEnter', () => setTimeout(() => p.nvim.outWriteLine('YOU ROCK!'), 2000), {
    pattern: '*',
  });

  p.registerAutocmd('BufWritePre', () => updateTime(p), { pattern: '*.md,*.mdx', sync: true });
  p.registerCommand('InsertDate', () => insertDate(p));
  p.registerCommand('InlineMath', () => insertMath(p, false));
  p.registerCommand('BlockMath', () => insertMath(p, true));

  const remaps: { [k: string]: string[][] } = {
    nnoremap: [[]],
    vnoremap: [[]],
    inoremap: [
      // insert inline/block math and go to the quote mark and go back to insert
      ['<leader>im', '<ESC>:InlineMath<CR>f"a'],
      ['<leader>bm', '<ESC>:BlockMath<CR>f"a'],
    ],
    tnoremap: [[]],
  };

  Object.keys(remaps).forEach((k: string) => {
    remaps[k].forEach((m: string[]) => remap(k, m[0], m[1]));
  });
};

// update time looks for updatedAt in the frontmatter of the md file and updates it to now
const updateTime = async (p: NvimPlugin) => {
  const lines = await p.nvim.buffer.getLines();

  if (lines[0].match('---')) {
    for (const [i, l] of lines.slice(1).entries()) {
      if (l.match('updatedAt: ')) {
        await p.nvim.buffer.setLines([`updatedAt: ${new Date().toISOString()}`], { start: i + 1, end: i + 2 });
      }

      if (l.match('---')) {
        break;
      }
    }
  }
};

// for inserting math component in mdx files on my blog
const insertMath = async (p: NvimPlugin, block: boolean) => {
  const line = await p.nvim.getLine();
  const [cLine, offset] = await p.nvim.window.cursor;
  await p.nvim.setLine(`${line.slice(0, offset)} <M ${block ? 'b' : 'i'}="" />${line.slice(offset, line.length)}`);
};

// insert date inserts the date at the end of the line
const insertDate = async (p: NvimPlugin) => {
  const line = await p.nvim.getLine();
  await p.nvim.setLine(`${line} ${new Date().toISOString()}`);
};

// for declaring funcs which need the plugin in the scope
const funcs = (p: NvimPlugin) => ({
  remap: (m: string, trigger: string, cmd: string) => p.nvim.command(`${m} ${trigger} ${cmd}`),
});
