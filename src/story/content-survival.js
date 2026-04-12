export const survivalCopy = {
  day4_hub: {
    speaker: '控制台',
    nameplate: '惊变第 4 天',
    dialogues: {
      pendingBlake: '你打算犒劳自己一下，刚煎好一份牛排，别墅的房门却突然被打开了。一个陌生男人惊讶地看着正在吃牛排的你。',
      default: '你看着防空洞的天花板，有些无聊，开始思考人生，结果 emo 了。',
    },
    choices: {
      blake_event: { text: '先处理闯进门的原主人', subtext: '他说这是他的房子，而你也知道这件事没那么容易谈拢。' },
      stay_day4: { text: '苟在家里', subtext: '今天不想出门，只想对着天花板发会儿呆。' },
      explore_day4: { text: '外出探索物资', subtext: '把今天押给附近区域。' },
      radio_day4: { text: '收听收音机', subtext: '注意收听最新播报，了解约翰博士的进展。' },
    },
  },
  radio_briefing: {
    speaker: '收音机',
    nameplate: '紧急播报',
    dialogues: [
      '“请幸存者尽量不要外出。如必须外出，请尽可能保留 10 颗以上的弹药，以防万一。”',
      '“约翰博士正在尝试研发丧尸病毒血清，请留意后续播报。”',
    ],
  },
  blake_intro: {
    speaker: '布莱克',
    nameplate: '别墅事件',
    dialogues: ['“伙计，这是我的房子，你怎么会在这里？”布莱克看了看你，又看了一眼桌上的牛排。很快，他提出可以一起生存，只要物资共享。'],
    choices: {
      blake_join: { text: '同意一起住', subtext: '虽然物资是你的，但庇护所毕竟是他的。' },
      blake_refuse: { text: '不同意，庇护所不会有两个人存在', subtext: '你摇头的那一刻，他的手就会摸向后腰。' },
    },
  },
  blake_showdown: {
    speaker: '尼奥',
    nameplate: '别墅冲突',
    dialogues: ['布莱克的声音逐渐变冷，手也已经摸向了后腰。“真的没得商量了吗？”空气陡然变得紧绷。'],
    choices: {
      blake_wrestle: { text: '与其搏斗', subtext: '你得在他掏枪前先把人扑倒，但自己也会受伤。' },
      blake_lime: { text: '叫莱姆一起战斗', subtext: '如果莱姆还在，它会给你一次更干净的机会。' },
      blake_shoot: { text: '先一步掏枪', subtext: '你打算在他反应过来前直接结果他。', disabledText: '弹药不足 1' },
      blake_surrender: { text: '大哥我闹着玩呢，欢迎回家', subtext: '你临时改口，准备把局面重新拉回合作。' },
      blake_spare: {
        text: '制服后放他走',
        subtext: '心软会很快回来报账。',
        crisisText: '深夜，布莱克利用对别墅的熟悉完成反扑。你侥幸没死，却也几乎把命留在这间屋里。',
        deathText: '你倒在别墅地板上，意识到放走原主人是一件多蠢的事。',
      },
    },
  },
  blake_execution: {
    speaker: '系统残响',
    nameplate: '别墅事件后',
    dialogues: ['布莱克失去了生命体征。你叹了口气，甩开脑中那些复杂的道德情绪，接下来，你得决定怎么处理他的尸体。'],
    choices: {
      blake_bury: { text: '在院中安葬', subtext: '至少让这件事还有最后一点像人的收尾。' },
      blake_convert: { text: '转化为 30 点物资', subtext: '末世下，你告诉自己必须利用一切资源。' },
    },
  },
  day5_hub: {
    speaker: '控制台',
    nameplate: '惊变第 5 天',
    dialogues: {
      bunker: '今天外面正下着冰冷的雨，金属门外传来急促又微弱的哀求声：“救命啊，我知道里面有人……”',
      default: '惊变第五天，第一周快过去了。你开始适应这种醒来就要盘点物资的生活。',
    },
    choices: {
      luna_event: { text: '看看门外那对母女', subtext: '你知道开门意味着把风险一起放进防空洞。' },
      stay_day5: { text: '苟在家里', subtext: '给自己做一份珍藏的意大利面，再苟过一天。' },
      explore_day5: { text: '外出探索物资', subtext: '继续把活动半径往外推。' },
    },
  },
  luna_intro: {
    speaker: '门外的女孩',
    nameplate: '露娜事件',
    dialogues: ['你用潜望镜看见门外是一对母女。母亲浑身湿透、脸色惨白，倒在女儿怀里已经奄奄一息。那女孩和你年纪相仿，正跪在雨里哭着向你求救，而远处似乎已经有黑影蹒跚着靠近。'],
    choices: {
      luna_open: { text: '开门接纳', subtext: '你无法对这样一对无助的母女硬起心肠。' },
      luna_drive: { text: '冷酷驱逐', subtext: '你准备用枪声把她们和风险一起赶离门口。' },
    },
  },
  luna_decision: {
    speaker: '系统残响',
    nameplate: '露娜事件',
    dialogues: ['老母亲双眼浑浊，呼吸急促，左臂伤口边缘已经泛起不自然的黑青色。凭着前世经验，你知道这是感染晚期，她很快就会变成丧尸。'],
    choices: {
      luna_shoot: { text: '当机立断，在变异前终结她母亲', subtext: '这是最果断的做法，也会把很多东西一起打碎。', disabledText: '弹药不足 1' },
      luna_isolate: { text: '时间还够，先将母亲隔离', subtext: '至少让她还有最后一点作为人的尊严。' },
    },
  },
  luna_shoot_aftermath: {
    speaker: '露娜',
    nameplate: '露娜事件',
    dialogues: ['你一把推开哭泣的露娜，对准她母亲的额头开了枪。可你刚刚在一个女儿面前杀死了她的母亲，她红着眼举起匕首，根本听不进任何解释。'],
    choices: {
      luna_kill_once: { text: '不识好歹，陪你妈妈去吧', subtext: '你觉得自己明明救了她，却只换来新的麻烦。', disabledText: '弹药不足 1' },
      luna_kill_burst: { text: '越想越气，连开三枪', subtext: '你不想再解释，也不想再留任何后患。', disabledText: '弹药不足 3' },
    },
  },
  luna_body_aftermath: {
    speaker: '系统残响',
    nameplate: '露娜事件后',
    dialogues: ['看着躺在地上的母女二人，你心中不免有些感慨。接下来，该怎么处理她们？'],
    choices: {
      luna_throw: { text: '扔出去', subtext: '你只想尽快把这件事收掉。' },
      luna_bury: { text: '埋葬', subtext: '至少给她们一个体面的收尾。' },
      luna_convert: { text: '转化为物资', subtext: '你决定把她们也算进生存成本里。' },
    },
  },
  luna_isolate_after: {
    speaker: '露娜',
    nameplate: '露娜事件后',
    dialogues: ['你将母亲隔离后，密室里很快传来抓挠和嘶吼。露娜终于相信你说的都是真的，她提出想亲自送母亲最后一程。安葬之后，关于露娜，你还要做最后一个决定。'],
    choices: {
      luna_join: { text: '接纳她作为同伴', subtext: '你决定把她也留在防空洞里。' },
      luna_send: { text: '送她离开', subtext: '你的物资不够两个人生存，但至少会给她带上一些。', disabledText: '物资不足 10' },
    },
  },
  day10_hub: {
    speaker: '控制台',
    nameplate: '惊变第 10 天',
    dialogues: ['转眼间末世已经开启十天了。全球电力系统瘫痪，大部分地区接连爆炸，甚至出现了核泄漏，天空也开始变得异常。好在你的庇护所暂时还足够安全。'],
    choices: {
      home_day10: { text: '苟在家里', subtext: '今天不打算出门，不同据点会给你不同的收获。' },
      explore_day10: { text: '外出探索物资', subtext: '继续往外翻地图。' },
    },
  },
  day20_hub: {
    speaker: '控制台',
    nameplate: '惊变第 20 天',
    dialogues: ['根据上一世的记忆，从今天开始，郊外会出现一个名叫“黎明者营地”的交易点。'],
    choices: {
      stay_day20: { text: '苟在家里', subtext: '没风险，但情绪会一点点发霉。' },
      explore_day20: { text: '外出探索物资', subtext: '继续从普通区域抠补给。' },
      lime_event: { text: '带莱姆去高风险区', subtext: '这次路线会偏离常规，也更难控制。' },
      camp_day20: { text: '前往黎明者营地', subtext: '换弹药、换物资，或者看一眼赌台。' },
    },
  },
  lime_event: {
    speaker: '莱姆',
    nameplate: '莱姆事件',
    dialogues: ['你带着莱姆去了危险区。回程时，一片住宅区突然起火，里面传来孩子的哭声，莱姆想都没想就冲了进去。'],
    choices: {
      save_lime: { text: '先救莱姆', subtext: '听起来不够“正确”，但它才是一路陪你走到这里的那个。' },
      save_child: { text: '先救那个小女孩', subtext: '如果那真的是个孩子的话。' },
    },
  },
  camp_trade: {
    speaker: '营地看守',
    nameplate: '黎明者营地',
    dialogues: ['天台上的营地没有慈善，只有明码标价的交换和看热闹的人群。你今天想从这里拿走什么？'],
    choices: {
      camp_buy_ammo: { text: '10 物资换 5 弹药', subtext: '最直接的交换。', disabledText: '物资不足 10' },
      camp_buy_supplies: { text: '5 弹药换 10 物资', subtext: '把火力折成生存成本。', disabledText: '弹药不足 5' },
      camp_leave: { text: '回家', subtext: '今天就先这样。' },
    },
  },
  day30_hub: {
    speaker: '尼奥',
    nameplate: '惊变第 30 天',
    dialogues: ['整整一个月。上一世的你就是死在这一天。关于“重生”的怀疑，再也压不住了。'],
    choices: {
      cliff_route: { text: '前往悬崖调查', subtext: '那地方像一根一直没拔掉的刺。', disabledText: '弹药不足 5' },
      home_route: { text: '回上一世的家复仇', subtext: '旧账一直在催你回去把它结掉。', disabledText: '弹药不足 3' },
      stay_day30: { text: '留在据点里', subtext: '你明知道该去查，却还是懒得动。' },
    },
  },
  cliff_truth: {
    speaker: '悬崖下的风',
    nameplate: '真相节点',
    dialogues: [
      '你赶到悬崖时，正好看见“另一个你”被尸群逼到绝境，然后一跃而下。',
      '也许这根本不是重生，而是一条已经闭合的时间线。',
    ],
    choices: {
      cliff_bottom: { text: '下到崖底调查', subtext: '额外消耗 10 物资，但你会真正看清这件事的轮廓。', disabledText: '物资不足 10' },
      cliff_home: { text: '穿过尸潮回上一世的家', subtext: '既查真相，也顺手把旧账一起清了。', disabledText: '弹药不足 5' },
    },
  },
  home_revenge: {
    speaker: '上一世的家',
    nameplate: '复仇节点',
    dialogues: ['你回到上一世的家时，坑害过你的亲人根本不相信你会站在门口。答案和上一世一模一样，于是你把这笔账彻底结了。'],
  },
  day35_hub: {
    speaker: '控制台',
    nameplate: '惊变第 35 天',
    dialogues: ['灰色的雪开始落下来，丧尸也变得更难处理。真正麻烦的阶段到了。'],
    choices: {
      stay_day35: { text: '留在庇护所', subtext: '什么都不做也是一种选择，只是会让你更烦。' },
      explore_day35: { text: '探索周边区域', subtext: '普通区域里仍然能抠出一些关键资源。' },
      meet_evelyn: { text: '深入商场搜刮物资', subtext: '这趟搜刮更深、更险，也更容易出意外。' },
      airdrop_day35: { text: '追踪空投坐标', subtext: '坐标看着像真货，但去的人不会少。' },
      camp_day35: { text: '前往黎明者营地', subtext: '至少那边的坏是明码标价的坏。' },
    },
  },
  evelyn_intro: {
    speaker: '尼奥',
    nameplate: '伊芙琳事件',
    dialogues: [
      '你在商场里捞到一大批物资，临走时却误触了警报器。',
      '尸群压过来时，一个女人也被困在另一头。她朝你这边开了一枪，像是在提醒你她还活着。',
    ],
    choices: {
      save_eve: { text: '过去营救', subtext: '你会丢掉一部分刚拿到的物资，但能把她带出来。' },
      ignore_eve: { text: '转身离开', subtext: '她不会让你干净地走掉，你至少还得补 5 发弹药。', disabledText: '弹药不足 5' },
    },
  },
  evelyn_invite: {
    speaker: '伊芙琳',
    nameplate: '商场外',
    dialogues: ['“成为你的伙伴？那我能得到什么好处？”伊芙琳靠着车门，眼神很直。你知道这次回答会一路追到结局。'],
    choices: {
      eve_equal: { text: '一切平等，没人想一直流浪', subtext: '最稳的一种说法。' },
      eve_promise: { text: '我不会让你死在我前面', subtext: '这是一句很重的话，一旦说出口就得算数。' },
      eve_gun: { text: '不邀请，只要一把自动步枪', subtext: '更实际，也更像你最初那套做法。' },
    },
  },
  airdrop_event: {
    speaker: '空投点',
    nameplate: '空投事件',
    dialogues: ['空投点比你想象得更糟。大量丧尸围着补给箱，还有一只红眼怪物一直没离开你的视野。'],
    choices: {
      airdrop_safe: { text: '量力而行，只拿一部分', subtext: '先把小命保住。', disabledText: '弹药不足 10' },
      airdrop_all: { text: '狠狠干到底，整箱带走', subtext: '会伤得很重，但回报更夸张。', disabledText: '弹药不足 20' },
    },
  },
  day38_luna: {
    speaker: '军事基地',
    nameplate: '惊变第 38 天',
    dialogues: ['军事基地里有成堆弹药，露娜坚持要和你一起去。尖啸响起时，你知道这次撤退一定要丢点什么。'],
    choices: {
      luna_cover: { text: '回头开枪，帮露娜吸引火力', subtext: '这是唯一像搭档的做法。', disabledText: '弹药不足 20' },
      luna_leave: { text: '不管了，先保自己', subtext: '你会活下来，但也会一直记得这个动作。' },
    },
  },
}
