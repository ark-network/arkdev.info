import siteConfig from '@generated/docusaurus.config';

const prismIncludeLanguages = (PrismObject) => {
  const {
    themeConfig: {prism},
  } = siteConfig;
  const {additionalLanguages = []} = prism;

  globalThis.Prism = PrismObject;

  // Define Bitcoin Script language
  PrismObject.languages.btcscript = {
    'comment': [
      {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      },
      {
        pattern: /\/\/.*/,
        greedy: true
      }
    ],
    'opcode': {
      pattern: /\b(?:OP_)?(?:CHECKSIG|CHECKMULTISIG|RETURN|DUP|HASH160|EQUAL|EQUALVERIFY|VERIFY|CHECKSIGVERIFY|CHECKMULTISIGVERIFY|CHECKSEQUENCEVERIFY|CODESEPARATOR|DROP|2DROP|NIP|OVER|PICK|ROLL|ROT|SWAP|TUCK|SIZE)\b/,
      alias: 'keyword'
    },
    'number': {
      pattern: /-?\b\d+\b/,
      alias: 'constant'
    },
    'hex': {
      pattern: /\b[0-9a-fA-F]+\b/,
      alias: 'string'
    },
    'stack-op': {
      pattern: /\b(?:1|0|TRUE|FALSE)\b/,
      alias: 'boolean'
    },
    'arithmetic': {
      pattern: /\b(?:OP_)?(?:ADD|SUB|MUL|DIV|MOD|LSHIFT|RSHIFT|BOOLAND|BOOLOR|NUMEQUAL|NUMEQUALVERIFY|NUMNOTEQUAL|LESSTHAN|GREATERTHAN|LESSTHANOREQUAL|GREATERTHANOREQUAL|MIN|MAX)\b/,
      alias: 'operator'
    }
  };

  // Load other additional languages
  additionalLanguages.forEach((lang) => {
    if (lang === 'btcscript') {
      return; // Skip btcscript as we defined it above
    }
    require(`prismjs/components/prism-${lang}`);
  });

  delete globalThis.Prism;
};

export default prismIncludeLanguages;
