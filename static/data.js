export const categories = [
  {
    id: -1,
    name: "Все",
    link: "all",
    subs: [
      {
        name: "Все",
        link: "all"
      }
    ]
  },
  {
    id: 0,
    name: "Средства гигиены и косметика",
    link: "sredstva-gigieny-i-kosmetika",
    subs: [
      {
        name: "Шампуни",
        link: "shampuni"
      },
      {
        name: "Бальзамы и маски",
        link: "balzamy-i-maski"
      },
      {
        name: "Спреи и средства для груминга",
        link: "sprei-i-sredstva-dlya-gruminga"
      },
      {
        name: "Гигиена",
        link: "gigiena"
      }
    ]
  },
  {
    id: 1,
    name: "Содержание",
    link: "soderzhanie",
    subs: [
      {
        name: "Клетки и боксы",
        link: "kletky-i-boksi"
      },
      {
        name: "Расчески",
        link: "rascheski"
      }
    ]
  },
  {
    id: 2,
    name: "Корма",
    link: "korma",
    subs: [
      {
        name: "Для кошек (сухой)",
        link: "dlya-koshek-sukhoi"
      },
      {
        name: "Для кошек (влажный)",
        link: "dlya-koshek-vlazhnyi"
      },
      {
        name: "Для собак (сухой)",
        link: "dlya-sobak-sukhoi"
      },
      {
        name: "Для собак (влажный)",
        link: "dlya-sobak-vlazhnyi"
      }
    ]
  },
  {
    id: 3,
    name: "Витамины",
    link: "vitaminy",
    subs: [
      {
        name: "Суставы и кости",
        link: "systavy-i-kosti"
      },
      {
        name: "Шерсть",
        link: "sherst"
      },
      {
        name: "Пищеварение",
        link: "pishchevarenie"
      },
      {
        name: "Комплекс",
        link: "kompleks"
      }
    ]
  }
];

export const age = [
  {
    id: 0,
    name: "Всех возрастов",
    value: "all"
  },
  {
    id: 1,
    name: "Котенок/Щенок",
    value: "young"
  },
  {
    id: 2,
    name: "Взрослый",
    value: "adult"
  },
  {
    id: 3,
    name: "Пожилой",
    value: "old"
  }
];

export const flavor = [
  {
    id: 0,
    name: "Мясо",
    value: "meat"
  },
  {
    id: 1,
    name: "Птица",
    value: "bird"
  },
  {
    id: 2,
    name: "Рыба",
    value: "fish"
  },
  {
    id: 3,
    name: "Смешанное",
    value: "mixed"
  },
  {
    id: 4,
    name: "Вет. диета",
    value: "vet-diet"
  },
  {
    id: 5,
    name: "Другое",
    value: "other"
  }
];
