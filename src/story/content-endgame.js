export const endgameCopy = {
  day50_hub: {
    speaker: '控制台',
    nameplate: '惊变第 50 天',
    dialogues: ['不知何种原因，天空开始不间断地下着灰色的雪。室外温度降到零下 35 摄氏度，本就残酷的末世又被天气再抬高了一层难度。'],
    choices: {
      stay_day50: { text: '苟在家里', subtext: '物资还算充沛，你准备犒劳自己一次，吃一顿热气腾腾的火锅。' },
      explore_day50: { text: '外出探索物资', subtext: '普通区域还能继续给你补资源。' },
      camp_day50: { text: '前往黎明者营地', subtext: '营地那边 50 天后还会多出一项更狠的玩法。' },
    },
  },
  day55_hub: {
    speaker: '控制台',
    nameplate: '惊变第 55 天',
    dialogues: ['天越来越冷，物资消耗也越来越快。偏偏在这个时候，清晨的庇护所大门被人敲响了。'],
    choices: {
      chris_day55: { text: '查看门外来客', subtext: '门外的人自称克里斯，带着请求，也可能带着麻烦。' },
      explore_day55: { text: '外出探索物资', subtext: '还有最后几次补资源的窗口。' },
      heat_day55: { text: '加固庇护所', subtext: '你想换一套自循环供暖装置，把后面的消耗压下去。', disabledText: '弹药不足 10' },
      stay_day55: { text: '苟在家里', subtext: '今天不碰新的事，至少风险最低。' },
    },
  },
  chris_event: {
    speaker: '门外的男人',
    nameplate: '克里斯事件',
    dialogues: ['“你好兄弟，我叫克里斯。我在找我妻子，但身上的物资已经不够了。”', '“借我 20 物资，我保证明早之前加倍还你。”外面的人虽然在乞求，但声音始终很从容。'],
    choices: {
      chris_no: { text: '我这里不是慈善机构，请你快点离开', subtext: '这是最像末世的回答。' },
      chris_yes: { text: '好吧，给你', subtext: '你赌的不是物资，是这世界里还剩几个守约的人。', disabledText: '物资不足 20' },
    },
  },
  chris_outcome: {
    speaker: '系统残响',
    nameplate: '克里斯事件后',
    choices: {
      chris_done: { text: '收下回礼，继续活下去', subtext: '在末世里，守约已经算稀有的善意了。' },
      chris_confess: {
        text: '说出瑟琳娜真正的死因',
        subtext: '如果你在酒吧里做过脏事，这一步几乎等于对着枪口说话。',
        crisisText: '克里斯听完真相后当场暴起。你虽然没被当场打死，却也被这场迟到的清算狠狠干翻在地。',
        deathText: '克里斯比你更快拔枪。有些债不是不报，只是会绕一圈回来。',
      },
      chris_silence: { text: '沉默，把这件事烂在心里', subtext: '他会感谢你，你也会因为那句感谢再掉一次人性值。' },
    },
  },
  day60_hub: {
    speaker: '控制台',
    nameplate: '惊变第 60 天',
    dialogues: ['昨天外出探索时，你恍惚间好像看到了一个长得和自己很像的丧尸，一晃又不见了。你不确定那是不是错觉。'],
    choices: {
      stay_day60: { text: '苟在家里', subtext: '如果身边没人，这会更像纯粹地开始 emo。' },
      explore_day60: { text: '外出探索物资', subtext: '普通区域还没彻底榨干。' },
      evelyn_heart: { text: '与伊芙琳一起探索物资', subtext: '适合出门，也适合把没说清的话说清。' },
    },
  },
  evelyn_heart: {
    speaker: '伊芙琳',
    nameplate: '伊芙琳心动事件',
    dialogues: [
      '你和伊芙琳去商场找取暖设备，返程时却被一群丧尸堵在货架区。',
      '她低声骂了一句，而你第一次很清楚地意识到，如果她真死在你前面，你会受不了。',
    ],
    choices: {
      heart_partner: { text: '“因为我不想让你陷入危险。”', subtext: '这不是战术回答，但她真正等的也不是战术回答。' },
      heart_tactic: { text: '“这是最合理的战术选择。”', subtext: '你说的是对的，但她明显并不满意。' },
    },
  },
  day70_hub: {
    speaker: '邀请函',
    nameplate: '惊变第 70 天',
    dialogues: ['“咚咚咚。”门被敲响了，外面却没有人，门口只留下一封信。所谓“英雄营地”邀请所有幸存者去青鸟大厦楼顶，商议人类的未来走向。'],
    choices: {
      stay_day70: { text: '苟在家里', subtext: '80 天越来越近，你已经没心情再见新组织。' },
      hero_day70: { text: '前往英雄营地', subtext: '你关心人类的未来，也想亲眼看看这帮人到底想干什么。' },
      explore_day70: { text: '外出探索物资', subtext: '先把能抠的最后一点物资补齐。' },
    },
  },
  hero_camp: {
    speaker: '卡尔',
    nameplate: '英雄营地事件',
    dialogues: ['“幸存者们，你们好。我是英雄营地的领袖，卡尔。”卡尔站在天台的太阳能板上激情演讲，台下站满了幸存者。你很快听懂了他的意思：所谓团结，本质就是让所有人带着物资加入他。'],
    choices: {
      hero_pay: { text: '不惹闲事，上交 10 物资', subtext: '你懒得陪这群披着英雄皮的强盗打架。', disabledText: '物资不足 10' },
      hero_fight: { text: '和其他幸存者联合火拼', subtext: '你想掀桌，但他们显然提前防着这一手。', disabledText: '需要 5 弹药且至少留有 20 物资' },
      hero_snipe: { text: '让伊芙琳狙掉卡尔', subtext: '最像你们俩的打法，快、脏、有效。', disabledText: '弹药不足 15' },
      hero_all_in: { text: '全军出击', subtext: '伊芙琳在暗处狙击，莱姆正面扑杀，你想把他们一锅端了。', disabledText: '需要伊芙琳、莱姆与 15 弹药' },
    },
  },
  day75_hub: {
    speaker: '控制台',
    nameplate: '惊变第 75 天',
    dialogues: ['马上就到第 80 天了，你紧张不已，总觉得会有大事发生。趁现在，你决定再多储备一些弹药和物资。'],
    choices: {
      stay_day75: { text: '苟在家里', subtext: '你提醒自己，真相和结果都未必比“顺着内心做事”更重要。' },
      market_day75: { text: '外出探索物资', subtext: '你不敢懈怠，决定先把大型超市和卡车的问题解决。' },
    },
  },
  day80_hub: {
    speaker: '收音机',
    nameplate: '惊变第 80 天',
    dialogues: {
      intro: '“滋滋。幸存者们你们好，我是约翰。科研基地遭到尸潮围攻，恐难抵挡，丧尸血清计划将会被搁置，请有能力的幸存者前来营救我。”',
      withEvelyn: '“尼奥，我们应该去救博士。虽然你我合作不难生存，但人类文明恐怕难以延续。”伊芙琳恳请你一起前往营救博士。',
      alone: '最近你刚找到一处足够养活上百人的大型超市。救，还是不救，这会直接影响最终结局走向。',
    },
    choices: {
      save_john: { text: '救', subtext: '至少需要 30 发弹药，这是整轮最重的一次开销。', disabledText: '弹药不足 30' },
      skip_john: { text: '不救', subtext: '你会活得更稳，也会更像一头独狼。' },
    },
  },
  rescue_alone: {
    speaker: '系统残响',
    nameplate: '救世主线',
    dialogues: {
      intro: '你独自潜入科研基地，靠音箱把尸群引走，最终把约翰和设备一起拖回了据点。',
      traverser: '失去意识前，你忽然意识到另一件事: 如果这不是重生，那你也许早就已经在别的时间线上“走过”一遍尸变。',
      default: '约翰抽走你的血液，把你绑在床边，说他会试着把你从尸变里拉回来。',
    },
  },
  rescue_with_evelyn: {
    speaker: '伊芙琳',
    nameplate: '科研基地',
    dialogues: ['你和伊芙琳把计划执行得很好，直到那只巨型丧尸把她和约翰一起撞飞。两个人分落在你左右，尸群已经重新压上来。你只能救一个。'],
    choices: {
      save_eve: { text: '救伊芙琳', subtext: '先保住身边的人，再承担后果。', disabledText: '弹药不足 10' },
      save_john_with_eve: { text: '救约翰博士', subtext: '把这次行动押给更大的目标。', disabledText: '弹药不足 10' },
    },
  },
  rescue_choice: {
    speaker: '伊芙琳',
    nameplate: '科研基地外',
    dialogues: ['你抱着伊芙琳冲出基地，博士则被尸群吞没在远处。', '“为什么救我？你明明可以把约翰带出来！”她几乎是在冲你吼。'],
    choices: {
      adam_plain: { text: '“我不是那种能看着伙伴死掉的人。”', subtext: '这不是大义凛然的答案，但它是真话。' },
      adam_promise: { text: '“我说过，不会让你死在我前面。”', subtext: '这是承诺回来的时刻。' },
    },
  },
  savior_city: {
    speaker: '约翰',
    nameplate: '救世主结局',
    dialogues: {
      intro: '血清做出来了，数量却远远不够。你和约翰决定把现有据点扩成第一座真正属于“人类”的聚落。',
      traverser: '你把悬崖和“另一个自己”的记忆全告诉了约翰。博士最后只说了一句: “也许你既是解药，也是毒药。”',
      default: '接下来要做的，不只是生存，而是重建。',
    },
    choices: {
      savior_villa: { text: '在别墅外竖起高墙', subtext: '把这里变成人类新的山腰城市。' },
      savior_bunker: { text: '把防空洞扩成地底之城', subtext: '把所有幸存者拉到地下，硬顶过后面的进化期。' },
    },
  },
  savior_final: {
    speaker: '系统残响',
    nameplate: '正式结局',
    dialogues: {
      villa: ['围绕着山中别墅，幸存者开始修筑真正的高墙。温室、过滤系统和血清实验室一起运转，人类终于不再只是单纯逃命。', '墙外的丧尸越来越强，但墙内第一次重新像“社会”而不是“临时据点”。'],
      bunker: ['防空洞被扩成真正的地下城。种植、研发、储水和繁衍都被重新安放进这套庞大的地下系统里。', '你不知道人类多久后才能重见天日，但至少他们终于有了能一直活下去的地方。'],
    },
  },
  lone_wolf_setup: {
    speaker: '系统残响',
    nameplate: '独狼线',
    dialogues: ['你最终没有去救约翰，而是把所有精力都放在那座大型超市上。几天后，你再也不缺物资了。'],
  },
  lone_wolf_final: {
    speaker: '系统残响',
    nameplate: '正式结局',
    dialogues: {
      villa: ['你把别墅改造成了真正的孤独堡垒。瞭望哨、喷火装置、冷库和娱乐室一应俱全，除非必要，你再也不轻易下山。', '但惊变第 100 天，一只懂密码的丧尸走到了门口。它遮着脸，吃力地吐出两个字: “因……果……”', '你倒了下去，终于意识到自己不是输给了资源，而是输给了那条始终没被斩断的线。'],
      bunker: ['你把防空洞扩成了真正的地下王国。陷阱、密码门、培育室和循环系统把你与世界彻底切开。', '但惊变第 100 天，一只懂密码的丧尸走到了门口。它像是专程来完成某件事，撞开你所有安全感的最后一层。', '你这才明白，就算把自己藏得再深，有些因果也还是会一路找上门来。'],
    },
  },
  adam_eve_85: {
    speaker: '系统残响',
    nameplate: '亚当夏娃线',
    dialogues: ['约翰死了，你和伊芙琳把那座大型超市彻底搬回了据点。末世第一次看起来像可以“活下去”，而不是单纯“别死”。'],
    choices: {
      adam_dinner: { text: '做一顿真正的大餐', subtext: '把这一轮最富裕的一天过成庆祝。' },
      adam_build: { text: '继续加固据点和生活设施', subtext: '把“活下来”升级成“活得像个人”。' },
    },
  },
  adam_eve_90: {
    speaker: '伊芙琳',
    nameplate: '惊变第 90 天',
    dialogues: ['这天夜里，伊芙琳主动找到你。', '“我不是个委婉的人。”她盯着你说，“我觉得我们的关系应该再往前走一步。”'],
    choices: {
      lover_yes: { text: '同意', subtext: '你终于不再装作听不懂她这些日子的变化。' },
      lover_no: { text: '拒绝', subtext: '你知道情感在末世里很贵，而你还是选择继续回避。' },
    },
  },
  adam_eve_100: {
    speaker: '系统残响',
    nameplate: '惊变第 100 天',
    dialogues: {
      lovers: ['你回到据点时，大门大开。站在屋里的那只丧尸，赫然长着你自己的脸。', '它咬伤你后迅速离开，而你的尸体在伊芙琳眼前慢慢消失。很久以后，她发现自己怀了孕，并把活下去的任务转移到那个孩子身上。'],
      default: ['你回到据点时，大门大开。站在屋里的那只丧尸，赫然长着你自己的脸。', '它咬伤你后迅速离开，而你的尸体在伊芙琳眼前慢慢消失。后来她终于明白，人类尼奥和丧尸尼奥，在第 100 天完成了同一条闭环。'],
    },
  },
  near_death: {
    speaker: '系统残响',
    nameplate: '濒死',
    dialogues: {
      default: '你重伤倒地，只剩下一次靠物资硬扛过去的机会。',
    },
    choices: {
      pay_30: { text: '消耗 30 物资硬扛过去', subtext: '这不是疗伤，只是强行把这一天拖过去。', disabledText: '物资不足 30' },
      accept_death: { text: '扛不住了', subtext: '就让这轮故事停在这里。' },
    },
  },
  death_end: {
    speaker: '系统残响',
    nameplate: '结局中断',
    dialogues: {
      default: '你没能撑过这一天。末世没有给你第二个动作。',
    },
  },
}
