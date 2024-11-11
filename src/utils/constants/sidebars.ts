const sideBarItems =  [
  {
    id: 'DASHBOARD',
    title: '',
    target: '#',
    icon: '',
    actions:[],
    isActive: false,
    isGroup: true,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-DASHBOARD',
    title: '',
    target: '/dash',
    icon: 'ri-dashboard-fill',
    actions:["VIE"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  // {
  //   id: 'WEBSITE',
  //   title: '',
  //   target: '#',
  //   icon: '',
  //   isActive: false,
  //   isGroup: true,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'F-WEBORDER',
  //   title: '',
  //   target: '/weborder',
  //   icon: 'ri-pantone-line',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'F-CUSTOMERREVIEW',
  //   title: '',
  //   target: '/customerreview',
  //   icon: 'ri-discuss-line',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  {
    id: 'RETAIL',
    title: '',
    target: '#',
    icon: '',
    actions:[],
    isActive: false,
    isGroup: true,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-RETAIL',
    title: '',
    target: '/retail',
    icon: 'ri-shopping-bag-3-fill',
    actions:["VIE","INS","UPD","DEL","UND","PDF","EXC"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'WAREHOUSE',
    title: '',
    target: '#',
    icon: '',
    actions:[],
    isActive: false,
    isGroup: true,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-IMPORT',
    title: '',
    target: '/import',
    icon: 'ri-inbox-archive-line',
    actions:["VIE","INS","DEL","UND","PDF","EXC"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-REMAIN',
    title: '',
    target: '/remain',
    icon: 'ri-archive-drawer-line',
    actions:["VIE","UPD","PDF","EXC"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-SEMI',
    title: '',
    target: '/semi',
    icon: 'ri-unsplash-fill',
    actions:["VIE","EXC"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-INVENTORY',
    title: '',
    target: '/inventory',
    icon: 'ri-calendar-check-fill',
    actions:["VIE","INS","UPD","DEL","UND","PDF","EXC"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  // {
  //   id: 'PAWN',
  //   title: '',
  //   target: '#',
  //   icon: '',
  //   isActive: false,
  //   isGroup: true,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'F-PAWN',
  //   title: '',
  //   target: '/pawn',
  //   icon: 'ri-scales-fill',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: [
  //     {
  //       id: 'F-ADDITION',
  //       parentId: 'F-PAWN',
  //       title: 'Addition',
  //       target: '/pawn-addition',
  //       icon: 'ri-coins-fill',
  //       isActive: false
  //     },
  //     {
  //       id: 'F-EXTEND',
  //       parentId: 'F-PAWN',
  //       title: 'Extend',
  //       target: '/pawn-extend',
  //       icon: 'ri-funds-fill',
  //       isActive: false
  //     },
  //     {
  //       id: 'F-LOST',
  //       parentId: 'F-PAWN',
  //       title: 'Lost',
  //       target: '/pawn-lost',
  //       icon: 'ri-search-eye-line',
  //       isActive: false
  //     },
  //     {
  //       id: 'F-REDEEM',
  //       parentId: 'F-PAWN',
  //       title: 'Redeem',
  //       target: '/pawn-redeem',
  //       icon: 'ri-hand-coin-fill',
  //       isActive: false
  //     },
  //     {
  //       id: 'F-LIQUID',
  //       parentId: 'F-PAWN',
  //       title: 'Liquid',
  //       target: '/pawn-liquid',
  //       icon: 'ri-creative-commons-zero-fill',
  //       isActive: false
  //     },
  //   ]
  // },
  // {
  //   id: 'F-PAWNSCAN',
  //   title: '',
  //   target: '/pawnscan',
  //   icon: 'ri-barcode-fill',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'CHAIN',
  //   title: '',
  //   target: '#',
  //   icon: '',
  //   isActive: false,
  //   isGroup: true,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'F-CHAIN',
  //   title: '',
  //   target: '/chain',
  //   icon: 'ri-star-fill',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  // {
  //   id: 'F-BRANCH',
  //   title: '',
  //   target: '/branch',
  //   icon: 'ri-store-fill',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  {
    id: 'CATEGORY',
    title: '',
    target: '#',
    icon: '',
    actions:[],
    isActive: false,
    isGroup: true,
    isExpanded: false,
    submenus: []
  },
  // {
  //   id: 'F-PRODUCT',
  //   title: '',
  //   target: '/product',
  //   icon: 'ri-star-fill',
  //   isActive: false,
  //   isGroup: false,
  //   isExpanded: false,
  //   submenus: []
  // },
  {
    id: 'F-GOLDTYPE',
    title: '',
    target: '/goldtype',
    icon: 'ri-copper-coin-line',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-GOLDGROUP',
    title: '',
    target: '/goldgroup',
    icon: 'ri-currency-fill',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-PRODUCTTYPE',
    title: '',
    target: '/producttype',
    icon: 'ri-list-ordered',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-WAREHOUSE',
    title: '',
    target: '/warehouse',
    icon: 'ri-home-5-fill',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-TAG',
    title: '',
    target: '/tag',
    icon: 'ri-price-tag-3-line',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'ADMIN',
    title: '',
    target: '#',
    icon: '',
    actions:[],
    isActive: false,
    isGroup: true,
    isExpanded: false,
    submenus: []
  },
  {
    id: 'F-USER',
    title: '',
    target: '/user',
    icon: 'ri-user-2-fill',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: [
      
    ]
  },
  {
    id: 'F-ROLE',
    title: '',
    target: '/role',
    icon: 'ri-secure-payment-fill',
    actions:["VIE","INS","UPD","DEL","UND"],
    isActive: false,
    isGroup: false,
    isExpanded: false,
    submenus: []
  },
]
export { sideBarItems }
