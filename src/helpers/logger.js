const {
  bold,
  green,
  yellow,
} = require('kleur');

const warn = async (content) =>
  console.log(yellow('\n' + content));

const info = async (content) =>
  console.log(bold('\n' + content));

const hint = async (content) =>
  console.log(green().bold().underline('\n' + content))

module.exports = {
  info,
  warn,
  hint,
}
