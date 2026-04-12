export const explorationCopy = {
  explore_select: {
    speaker: '地图边缘',
    nameplate: '区域探索',
    dialogues: ['今天还能去这些地方。每一处都不只是在做数值加减，也在定义这一轮的尼奥到底会成为什么样的人。'],
  },
  explore_fifth_avenue: {
    speaker: '第五大道',
    nameplate: '区域探索',
    dialogues: ['外出探索时，你在第五大道发现了一个受伤昏迷的司机。他的面包车上装着丰富的物资，车身还写着“黎明者营地”。'],
    choices: {
      fifth_help: {
        text: '救助他',
        subtext: '把他带回庇护所救治，哪怕他大概率还是撑不过去。',
      },
      fifth_drop: {
        text: '把他扔下，带物资回庇护所',
        subtext: '你认为如果今天不是你碰见他，他也已经凶多吉少。',
      },
    },
  },
  explore_fifth_avenue_after: {
    speaker: '冷库白灯',
    nameplate: '第五大道后续',
    dialogues: ['你清点着从面包车上带回的这批“物资”，起初的喜悦很快被一种莫名的不安取代。它们不只是补给，而是会把这轮路线彻底定色的东西。'],
    choices: {
      fifth_keep: {
        text: '留下这些“物资”',
        subtext: '末世之中，道德与文明在死亡面前一文不值，它们会变成你的底牌。',
      },
      fifth_bury: {
        text: '安葬这些“物资”',
        subtext: '虽然会失去珍贵的口粮，但你至少能守住作为人的底线。',
      },
    },
  },
  explore_church: {
    speaker: '教堂',
    nameplate: '区域探索',
    dialogues: ['外出探索时，你在教堂中发现了奄奄一息的神父。看见你时，他眼里像突然亮起了什么。'],
    choices: {
      church_treat: {
        text: '治疗他',
        subtext: '你打算先尽力救人，哪怕最后听见的更像一段临终神谕。',
        disabledText: '物资不足 10',
      },
      church_end: {
        text: '帮他结束痛苦',
        subtext: '出于人道主义，你决定替他把最后这一步做完。',
        disabledText: '弹药不足 1',
      },
      church_convert: {
        text: '转化为物资',
        subtext: '你眼里只剩下对物资的渴望，根本不觉得他还是同类。',
        disabledText: '弹药不足 1',
      },
    },
  },
  explore_hope_bar: {
    speaker: '希望酒吧',
    nameplate: '区域探索',
    dialogues: [
      '你在外出探索时发现了一个名为“希望”的酒吧。酒吧里居然有个女人，这是她的庇护所。',
      '她说自己叫瑟琳娜，一直在这里等丈夫回来。她祈求你不要拿走太多物资，但你也不想白跑一趟。',
    ],
    choices: {
      bar_take_all: {
        text: '拿走 40 物资',
        subtext: '这无疑是在直接判她死刑。',
      },
      bar_take_half: {
        text: '只拿走 20 物资',
        subtext: '你给她留下一半活路，但这点余地还远远算不上善良。',
      },
      bar_leave: {
        text: '一分不拿',
        subtext: '末世之下，人性反而成了最稀有的东西。',
      },
    },
  },
  explore_hope_bar_after: {
    speaker: '瑟琳娜',
    nameplate: '希望酒吧后续',
    dialogues: ['全部拿走无疑是要了她的命。你只拿走一半后，女人还是精神崩溃地哭了起来。你现在还能做最后一个动作。'],
    choices: {
      bar_leave_now: {
        text: '依然拿走物资',
        subtext: '你觉得自己已经足够仁慈，不打算再为她停留。',
      },
      bar_invite: {
        text: '邀请她去你的据点',
        subtext: '你实在听不了她的哭声，决定给她递出一条路。',
      },
    },
  },
  explore_convenience: {
    speaker: '便利店',
    nameplate: '区域探索',
    dialogues: ['你在外出探索时，听到便利店门口传来激烈的搏斗声。一个幸存者正被几只丧尸包围，而他的背包塞得异常的满。'],
    choices: {
      shop_watch: {
        text: '静观其变，坐收渔利',
        subtext: '你打算等尸群散去后，再小心翼翼地去捡那个包。',
      },
      shop_help: {
        text: '出手相助',
        subtext: '你瞄准尸群开枪，为他争取逃跑的机会。',
        disabledText: '弹药不足 5',
      },
    },
  },
  explore_convenience_after: {
    speaker: '获救的幸存者',
    nameplate: '便利店后续',
    dialogues: ['他惊魂未定地向你表达了感谢。现在，你要决定这声“谢谢”到底值多少钱。'],
    choices: {
      shop_threaten: {
        text: '举起枪威胁他，把所有物资都给自己',
        subtext: '你脸上的友善消失了，准备把这场营救彻底变现。',
      },
      shop_drive: {
        text: '开车送他回据点',
        subtext: '你打算把他送回庇护所，换一份还算体面的谢礼。',
      },
      shop_convert: {
        text: '把他也转化为物资',
        subtext: '你从一开始盯上的，就不只是那只背包，还有一切能换成物资的东西。',
        disabledText: '弹药不足 1',
      },
    },
  },
}
