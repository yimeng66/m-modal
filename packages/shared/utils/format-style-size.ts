const CssUnitList = [
  'em',
  'ex',
  '%',
  'px',
  'cm',
  'mm',
  'in',
  'pt',
  'pc',
  'ch',
  'rem',
  'vh',
  'vw',
  'vmin',
];
const cssUnitRegex = new RegExp(`.+(${CssUnitList.join('|')})$`);

export function formatStyleSize(val: number | string | undefined) {
  if (typeof val === 'number') {
    return `${val}px`;
  }

  if (val && val !== 'auto' && !cssUnitRegex.test(val)) {
    console.warn(`"${val}"非法css单位值`);
  }

  return val;
}
