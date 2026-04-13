import type {
  Locale,
  SiteLocaleContent,
  SourceDomain,
  SourceItem,
  SourceMedium,
} from '../types';

export const siteContent: Record<Locale, SiteLocaleContent> = {
  en: {
    brand: 'East Meridian',
    subtitle: 'Macro investor / cross-border notebook',
    languageToggleLabel: 'Switch site language',
    nav: {
      marketLens: 'Lens & Framework',
      marketSources: 'Sources',
      beyondMarkets: 'Beyond Markets',
      method: 'Method',
    },
    hero: {
      eyebrow: 'Macro notebook / bilingual research shelf',
      title: 'East Meridian',
      role: 'A pseudonymous macro investor reading both sides of the world.',
      summary:
        'I track rates, liquidity, commodities, policy, and the stories markets tell themselves. This page is a small public notebook for the material that sharpens my framework across English and Chinese information streams.',
      secondary:
        'From central bank speeches and market plumbing to history, politics, and social economics, the edge is usually in context rather than speed.',
      cta: 'Explore the source library',
    },
    marketLens: {
      kicker: 'Lens and framework',
      title: 'What I watch, and how I keep the map coherent',
      intro:
        'This is not a prediction machine. It is the operating map I return to when I need to decide what matters, what is noise, and where narrative is running ahead of balance-sheet reality.',
      bullets: [
        'Policy, rates, and liquidity come before headlines.',
        'Cross-asset confirmation matters: bonds, FX, commodities, and equities should tell a coherent story.',
        'China is not a side note. It is part of the transmission mechanism for global macro.',
        'Narratives are useful only after price, positioning, and institutional incentives are clear.',
        'Reading in both English and Chinese helps catch what each information world omits.',
      ],
      frameworkTitle: 'Core framework',
      framework: [
        {
          label: 'Focus variables',
          value: 'Rates, liquidity, China, commodities',
        },
        {
          label: 'Information edge',
          value: 'Reading overlap between English and Chinese worlds',
        },
        {
          label: 'Bias control',
          value: 'Primary sources first, commentary second',
        },
      ],
      closing:
        'The aim is context before conviction, and synthesis before speed.',
    },
    marketSources: {
      kicker: 'Markets',
      title: 'The market information shelf',
      intro:
        'A compact set of sources for fast signals, slower analysis, and institutional context. I would rather maintain a disciplined shelf than drown in dashboards.',
      quote:
        'The point is not information volume. The point is to balance speed, depth, and incentive alignment.',
    },
    beyondMarkets: {
      kicker: 'Beyond markets',
      title: 'History, politics, and social economics',
      intro:
        'Macro work gets better when price action is placed inside institutions, state capacity, class structure, and longer historical arcs.',
      quote:
        'History and politics do not predict prices directly, but they reshape the range of what a market can imagine.',
    },
    about: {
      kicker: 'Method',
      title: 'How I try to stay calibrated',
      intro:
        'A small process note, because filters matter more than feeds.',
      paragraphs: [
        'I use this page as a living notebook instead of a full biography. The objective is to make the inputs legible: what I read, what I replay, and what repeatedly survives re-reading.',
        'The best market work usually comes from comparing worlds that do not fully translate into each other. English sources are often stronger on global framing and market structure; Chinese sources are often closer to domestic policy language, industrial signals, and sentiment on the ground.',
      ],
      principlesTitle: 'Working rules',
      principles: [
        'Read primary material whenever possible.',
        'Compare official language with market pricing.',
        'Use history as a probability filter, not an analogy machine.',
        'Update quickly on evidence and slowly on identity-level views.',
      ],
    },
    mediumLabels: {
      read: 'Read',
      listen: 'Listen',
      watch: 'Watch',
    },
    sourceAction: 'Open source',
    footer: {
      note:
        'Placeholder identity and contact links for now. The structure is final; the public details can be swapped later.',
      links: [
        {
          label: 'Email',
          href: 'mailto:hello@eastmeridian.example',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/DJiangwei',
        },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/placeholder',
        },
      ],
    },
  },
  zh: {
    brand: '东望子午',
    subtitle: '宏观投资者 / 跨语境笔记',
    languageToggleLabel: '切换站点语言',
    nav: {
      marketLens: '视角与框架',
      marketSources: '信息源',
      beyondMarkets: '市场之外',
      method: '方法',
    },
    hero: {
      eyebrow: '宏观笔记 / 中英双语信息书架',
      title: '东望子午',
      role: '一个同时浸泡在中英文信息世界里的匿名宏观投资者。',
      summary:
        '我关注利率、流动性、大宗商品、政策以及市场如何讲述自己的故事。这个页面是一份公开的小型工作台，记录那些持续塑造我框架的阅读、收听与观看来源。',
      secondary:
        '从央行讲话、金融体系管道到历史、政治与社会经济，真正的优势通常来自语境与比较，而不是抢速度。',
      cta: '查看信息源',
    },
    marketLens: {
      kicker: '市场视角与核心框架',
      title: '我盯什么，也如何让整张地图保持一致',
      intro:
        '这不是一个“预测机器”，而是我反复回到的一张操作地图。它帮助我判断什么真正重要，什么只是噪音，以及叙事何时已经跑在资产负债表现实之前。',
      bullets: [
        '先看政策、利率与流动性，再看新闻标题。',
        '跨资产的相互验证很重要: 债券、外汇、大宗商品和股票应该能拼成同一个故事。',
        '中国不是旁枝信息，而是全球宏观传导链条中的核心变量之一。',
        '叙事有用，但必须建立在价格、仓位和制度激励都看清之后。',
        '同时阅读中文和英文来源，有助于发现每个信息世界天然忽略的部分。',
      ],
      frameworkTitle: '核心框架',
      framework: [
        {
          label: '重点变量',
          value: '利率、流动性、中国与大宗商品',
        },
        {
          label: '信息优势',
          value: '交叉阅读中英文世界的重叠地带',
        },
        {
          label: '校准方式',
          value: '先看一手材料，再看评论表达',
        },
      ],
      closing: '我的目标不是先有观点，而是先建立上下文，再形成判断。',
    },
    marketSources: {
      kicker: '市场',
      title: '市场信息书架',
      intro:
        '我会刻意把信息源压缩到一个足够小但足够稳的范围里: 既有快信号，也有慢分析，还有能看见机构激励和政策语言的材料。',
      quote:
        '重点不是信息量越多越好，而是让速度、深度和激励结构彼此平衡。',
    },
    beyondMarkets: {
      kicker: '市场之外',
      title: '历史、政治与社会经济',
      intro:
        '当价格波动被放回制度、国家能力、阶层结构和更长的历史弧线里，宏观研究通常会更可靠。',
      quote:
        '历史和政治不会直接给出价格答案，但它们会改变市场能够想象的边界。',
    },
    about: {
      kicker: '方法',
      title: '我如何尽量保持校准',
      intro: '简单说一下过程，因为过滤器往往比信息流本身更重要。',
      paragraphs: [
        '我更愿意把这个页面做成一份持续生长的工作笔记，而不是完整的个人履历。重点不是展示身份，而是把输入端变得清晰: 我读什么、反复听什么、哪些材料值得重读。',
        '很多真正有价值的宏观工作，来自比较那些彼此并不能完全翻译的世界。英文来源通常更强于全球框架和市场结构，中文来源通常更接近政策语言、产业信号和本土情绪。',
      ],
      principlesTitle: '工作规则',
      principles: [
        '尽量直接阅读一手材料。',
        '把官方语言和市场定价放在一起看。',
        '把历史当作概率过滤器，而不是类比机器。',
        '对新证据快速更新，对身份化观点缓慢承诺。',
      ],
    },
    mediumLabels: {
      read: '读',
      listen: '听',
      watch: '看',
    },
    sourceAction: '打开来源',
    footer: {
      note: '身份与联系方式暂时使用占位内容，整体结构已经可以直接上线，细节之后替换即可。',
      links: [
        {
          label: '邮件',
          href: 'mailto:hello@eastmeridian.example',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/DJiangwei',
        },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/placeholder',
        },
      ],
    },
  },
};

export const sourceMediumOrder: SourceMedium[] = ['read', 'listen', 'watch'];

export const sourceItems: SourceItem[] = [
  {
    id: 'financial-times',
    title: 'Financial Times',
    language: 'en',
    url: 'https://www.ft.com/',
    note: {
      en: 'Daily global market narrative with reliable coverage of rates, policy, and boardroom incentives.',
      zh: '高频跟踪全球市场叙事，尤其适合看利率、政策与机构激励如何相互作用。',
    },
    medium: 'read',
    domain: 'markets',
    tag: 'Macro',
  },
  {
    id: 'caixin',
    title: '财新',
    language: 'zh',
    url: 'https://www.caixin.com/',
    note: {
      en: 'Useful when I need China credit stress, policy messaging, and institutional detail closer to the source.',
      zh: '理解中国信用压力、政策信号和制度细节时，常常比二手转述更接近源头。',
    },
    medium: 'read',
    domain: 'markets',
    tag: 'China',
  },
  {
    id: 'bis-quarterly-review',
    title: 'BIS Quarterly Review',
    language: 'en',
    url: 'https://www.bis.org/publ/qtrpdf/index.htm',
    note: {
      en: 'Slow, dense, and worth revisiting whenever funding markets or balance-sheet plumbing matter.',
      zh: '节奏慢但非常扎实，特别适合在关注融资市场和金融体系管道时重读。',
    },
    medium: 'read',
    domain: 'markets',
    tag: 'Plumbing',
  },
  {
    id: 'odd-lots',
    title: 'Odd Lots',
    language: 'en',
    url: 'https://www.bloomberg.com/oddlots-podcast',
    note: {
      en: 'Good for translating market plumbing and specialist niches into language that sticks.',
      zh: '很擅长把市场微观结构和冷门角落讲得既具体又能留下记忆点。',
    },
    medium: 'listen',
    domain: 'markets',
    tag: 'Markets',
  },
  {
    id: 'macro-voices',
    title: 'Macro Voices',
    language: 'en',
    url: 'https://macrovoices.com/',
    note: {
      en: 'A recurring check on cross-asset macro narratives, especially when consensus feels too clean.',
      zh: '适合用来复核跨资产宏观叙事，尤其是在市场共识看起来过于整齐的时候。',
    },
    medium: 'listen',
    domain: 'markets',
    tag: 'Cross-asset',
  },
  {
    id: 'wallstreetcn-audio',
    title: '华尔街见闻 FM',
    language: 'zh',
    url: 'https://wallstreetcn.com/audio',
    note: {
      en: 'A quick Chinese-language pulse on domestic market mood, policy talk, and what traders are repeating.',
      zh: '用来抓中文市场语境里的情绪、政策讨论和交易员口径，速度很快。',
    },
    medium: 'listen',
    domain: 'markets',
    tag: 'Pulse',
  },
  {
    id: 'bloomberg-tv',
    title: 'Bloomberg Television',
    language: 'en',
    url: 'https://www.bloomberg.com/live/us',
    note: {
      en: 'Useful for staying close to real-time tone, especially around data releases and policy events.',
      zh: '在数据公布和政策事件窗口里，适合用来感受实时市场语气和节奏。',
    },
    medium: 'watch',
    domain: 'markets',
    tag: 'Live',
  },
  {
    id: 'real-vision',
    title: 'Real Vision',
    language: 'en',
    url: 'https://www.realvision.com/',
    note: {
      en: 'Helpful for longer-form interviews when I want to stress test a framework rather than chase a headline.',
      zh: '当我想检验一个框架而不是追逐单条新闻时，长访谈的价值会更高。',
    },
    medium: 'watch',
    domain: 'markets',
    tag: 'Interviews',
  },
  {
    id: 'yicai-video',
    title: '第一财经',
    language: 'zh',
    url: 'https://www.yicai.com/video/',
    note: {
      en: 'A grounded Chinese video stream for domestic policy, company tone, and local market framing.',
      zh: '偏本土语境的财经视频来源，适合观察政策口径、企业表达和国内市场叙事。',
    },
    medium: 'watch',
    domain: 'markets',
    tag: 'China',
  },
  {
    id: 'foreign-affairs',
    title: 'Foreign Affairs',
    language: 'en',
    url: 'https://www.foreignaffairs.com/',
    note: {
      en: 'Useful when statecraft and geopolitical strategy start leaking into macro assumptions.',
      zh: '当地缘战略和国家能力开始影响宏观假设时，这类材料能补上更长的政策视角。',
    },
    medium: 'read',
    domain: 'beyondMarkets',
    tag: 'Geopolitics',
  },
  {
    id: 'initium',
    title: '端传媒',
    language: 'zh',
    url: 'https://theinitium.com/',
    note: {
      en: 'Useful for essays that connect politics, society, and lived texture rather than only event headlines.',
      zh: '在政治、社会与现实肌理之间建立连接时，比单纯的事件快讯更有价值。',
    },
    medium: 'read',
    domain: 'beyondMarkets',
    tag: 'Society',
  },
  {
    id: 'nyrb',
    title: 'The New York Review of Books',
    language: 'en',
    url: 'https://www.nybooks.com/',
    note: {
      en: 'A reminder to slow down and test arguments against history, institutions, and ideas.',
      zh: '提醒自己放慢速度，把判断放回历史、制度和观念脉络里重新检验。',
    },
    medium: 'read',
    domain: 'beyondMarkets',
    tag: 'Ideas',
  },
  {
    id: 'conversations-with-tyler',
    title: 'Conversations with Tyler',
    language: 'en',
    url: 'https://conversationswithtyler.com/',
    note: {
      en: 'Consistently useful for hearing how smart people reveal their filters, not just their conclusions.',
      zh: '这个节目最有价值的地方，不只是观点，而是能听出一个人背后的过滤器和提问方式。',
    },
    medium: 'listen',
    domain: 'beyondMarkets',
    tag: 'Ideas',
  },
  {
    id: 'huzuohuyou',
    title: '忽左忽右',
    language: 'zh',
    url: 'https://guigu.fm/',
    note: {
      en: 'A strong Chinese-language shelf for history, politics, and intellectual context outside market jargon.',
      zh: '中文语境里很好的历史与政治播客来源，能把视角从市场行话里拉出来。',
    },
    medium: 'listen',
    domain: 'beyondMarkets',
    tag: 'History',
  },
  {
    id: 'bumingbai',
    title: '不明白播客',
    language: 'zh',
    url: 'https://bumingbai.net/',
    note: {
      en: 'Useful for hearing Chinese-language political and social conversations that do not map neatly onto market commentary.',
      zh: '适合补充那些无法直接被市场评论体系吸收的中文政治与社会讨论。',
    },
    medium: 'listen',
    domain: 'beyondMarkets',
    tag: 'Politics',
  },
  {
    id: 'pbs-frontline',
    title: 'PBS Frontline',
    language: 'en',
    url: 'https://www.pbs.org/wgbh/frontline/',
    note: {
      en: 'Long-form reporting that helps anchor abstract policy debates in institutions and human incentives.',
      zh: '长篇调查能把抽象的政策争论重新落回制度细节和真实激励之中。',
    },
    medium: 'watch',
    domain: 'beyondMarkets',
    tag: 'Institutions',
  },
  {
    id: 'dw-documentary',
    title: 'DW Documentary',
    language: 'en',
    url: 'https://www.youtube.com/@DWDocumentary',
    note: {
      en: 'A broad documentary stream that is useful when I want to widen the frame beyond immediate market concerns.',
      zh: '当我想主动把镜头拉远，不再只盯着市场时，这类纪录片很适合重建更大的背景。',
    },
    medium: 'watch',
    domain: 'beyondMarkets',
    tag: 'World',
  },
  {
    id: 'vistopia',
    title: '看理想',
    language: 'zh',
    url: 'https://www.vistopia.com.cn/',
    note: {
      en: 'A Chinese-language humanities shelf that keeps the page from collapsing into pure market utility.',
      zh: '它能提醒我不要把所有注意力都压缩成市场效率，而要保留更宽的人文尺度。',
    },
    medium: 'watch',
    domain: 'beyondMarkets',
    tag: 'Humanities',
  },
];

export function getSourcesByDomain(domain: SourceDomain): Record<SourceMedium, SourceItem[]> {
  return {
    read: sourceItems.filter((item) => item.domain === domain && item.medium === 'read'),
    listen: sourceItems.filter((item) => item.domain === domain && item.medium === 'listen'),
    watch: sourceItems.filter((item) => item.domain === domain && item.medium === 'watch'),
  };
}
