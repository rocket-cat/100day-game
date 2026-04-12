export const explorationExtraCopy = {
  explore_canning_factory: {
    speaker: '罐头加工厂',
    nameplate: '区域探索',
    dialogues: ['你发现了一个罐头加工厂。工厂内，一个衣衫褴褛、眼窝深陷的男人正将罐头喂给被铁链锁住的尸化女人。男人虽然狼狈，但看着女人时，脸上还是会露出一丝幸福的微笑。'],
    choices: {
      factory_force: { text: '武力突破，占有这里的物资', subtext: '你不想废话，打算最快速地把整座工厂拿下。', disabledText: '弹药不足 2' },
      factory_lie: { text: '欺骗男人，用希望换物资', subtext: '你准备拿一个治疗谎言当筹码。', disabledText: '弹药不足 1' },
      factory_help: { text: '帮助他们', subtext: '给他更坚固的锁链和笼子，也给这段关系留一点体面。' },
    },
  },
  explore_farmhouse: {
    speaker: '农户家',
    nameplate: '区域探索',
    dialogues: ['你在一个农户家发现了一对老夫妻。老旧冰箱里存放着为数不多的食物，老妇人颤抖着跪下求你留条活路，老头则坚持想和你分享他们最后的晚餐。'],
    choices: {
      farm_loot: { text: '冷酷掠夺', subtext: '“末世之中，没有仁慈。”你准备直接清空他们的冰箱。' },
      farm_dinner: {
        text: '接受“善意”，共进晚餐',
        subtext: '你动了恻隐之心，但信任在末世里往往比饥饿更危险。',
        crisisText: '那顿晚饭里掺了药。你醒来时手脚发软，终于明白自己差点成了他们新的“储备粮”。',
        deathText: '你没能从那顿晚饭里醒过来。末世里，善意也可能是一张捕兽夹。',
      },
    },
  },
  explore_street_infant: {
    speaker: '商业街',
    nameplate: '区域探索',
    dialogues: ['你刚出门就在街边看到了一个破旧的襁褓。里面躺着一个看起来刚满月的婴儿，旁边还塞着一张纸条：“外面太危险了，求求你，给他一条生路。”'],
    choices: {
      street_adopt: { text: '收养', subtext: '你知道把他抱起来，也是在把后面的生存成本一起抱回家。' },
      street_leave_baby: { text: '不收养', subtext: '你还是把孩子放在了相对安全的地方，剩下的只能交给命运。' },
    },
  },
  explore_street_route: {
    speaker: '街区岔口',
    nameplate: '商业街后续',
    dialogues: ['将婴儿安置好之后，你知道附近还有两处地方可能有物资。'],
    choices: {
      street_fast_food: { text: '快餐店', subtext: '那边有大量土豆，但回去路上还要顺手清几只丧尸。', disabledText: '弹药不足 5' },
      street_ktv: { text: 'KTV', subtext: '这里像刚经历过一场恶战，也许还有别人没摸走的东西。' },
    },
  },
  explore_kindergarten: {
    speaker: '尸潮分流口',
    nameplate: '区域探索',
    dialogues: ['黑压压的尸潮正分两路前进，一路朝向医院，一路涌向幼儿园。你背包里那颗声波手雷只能扔向其中一处，另一边的人会因此获得生路。'],
    choices: {
      kindergarten_hospital: { text: '医院', subtext: '“孩子才是未来。”你准备把尸潮引向医院。', disabledText: '弹药不足 1' },
      kindergarten_school: { text: '幼儿园', subtext: '“对不起了，孩子们……”你准备保住医院那边的人。', disabledText: '弹药不足 1' },
      kindergarten_self: {
        text: '自己',
        subtext: '你准备把尸潮和爆炸都引向自己，给两边同时争出一条生路。',
        disabledText: '弹药不足 1',
        crisisText: '你把尸潮和爆炸一起引向自己。等你再喘过气来时，浑身都像被铁锤砸过一遍。',
        deathText: '你没能从那场爆炸和尸潮里爬起来。',
      },
      kindergarten_leave: { text: '转身离开', subtext: '末世之中，你不想承担这份风险，也不想替任何一边做决定。' },
    },
  },
  explore_hospital: {
    speaker: '医院',
    nameplate: '区域探索',
    dialogues: ['你在医院药局找到了一些抗生素，正要离开时，医院内游荡的尸群开始朝你逼近。你急忙躲进医生办公室，却发现这里还有一个抱着婴儿的女人。'],
    choices: {
      hospital_share_food: { text: '给婴儿分一些食物，缓和他的情绪', subtext: '你准备先想办法把哭声压下去。', disabledText: '物资不足 5' },
      hospital_kill: { text: '结果掉这对陌生母子', subtext: '你打算把风险直接掐死在屋里。', disabledText: '弹药不足 2' },
    },
  },
  explore_hospital_mother: {
    speaker: '抱着孩子的女人',
    nameplate: '医院后续',
    dialogues: ['你让女人顶住大门，自己去隔壁办公室找水和奶粉。可等你回来时，发现她正在偷翻你的背包。她哭着跪下来，说自己病了，没有药就活不下去，孩子也一样。'],
    choices: {
      hospital_forgive: { text: '原谅她，将抗生素分给她一半', subtext: '你决定给她和孩子再留一条路。' },
      hospital_bait: { text: '将她和婴儿推出去当诱饵', subtext: '你不打算再给她第二次机会。' },
    },
  },
  explore_hospital_aftermath: {
    speaker: '医院后门',
    nameplate: '医院后续',
    dialogues: ['过了很长一段时间，门外的尸潮终于散去，地上只剩下那对母子的尸体。你知道，这一步是你自己选的。'],
    choices: {
      hospital_bury: { text: '埋葬', subtext: '至少给这件事一个像人的收尾。' },
      hospital_ignore: { text: '扔在这不管', subtext: '你不想再为这件事多停一秒。' },
      hospital_convert: { text: '转化为物资', subtext: '最冷，也最容易滑过去的一步。' },
    },
  },
  explore_evelyn_inn: {
    speaker: '旅店走廊',
    nameplate: '双人探索',
    dialogues: ['你和伊芙琳在旅店里发现一间上锁的“物资房”。门缝后是三名被铁链锁住的幸存者，转身的那一刻，店主的枪口已经顶上来。'],
    choices: {
      inn_protect: { text: '挺身而出，先保住那三个人', subtext: '要在狭窄走廊里狠狠干一场。', disabledText: '弹药不足 5' },
      inn_leave: {
        text: '不多管闲事，直接撤',
        subtext: '你想离开，但对方未必愿意放你走。',
        crisisText: '你刚想抽身，背后就挨了一枪。伊芙琳把你从旅店里硬拖出来，这一整天都像在血里泡着。',
        deathText: '你倒在旅店门口，连回头的机会都没争到。',
      },
    },
  },
  explore_evelyn_inn_after: {
    speaker: '被制服的店主',
    nameplate: '旅店后续',
    dialogues: ['店主开口求饶，说只要你放他一命，就把冰箱里剩下的“物资”全都送给你。伊芙琳站在一边，等你表态。'],
    choices: {
      inn_execute: { text: '直接结果他', subtext: '这笔账不该再拖。', disabledText: '弹药不足 1' },
      inn_take_all: { text: '收下他的“物资”', subtext: '你知道自己会顺手连更脏的东西一起带走。', disabledText: '弹药不足 1' },
    },
  },
  explore_evelyn_inn_rescue: {
    speaker: '锁链后的幸存者',
    nameplate: '旅店后续',
    dialogues: ['枪声停了，三个被锁住的人还缩在角落里。现在，轮到你决定他们该不该活着走出这家旅店。'],
    choices: {
      inn_free: { text: '解救他们', subtext: '今天至少让这地方少一层恶。' },
      inn_convert: { text: '把他们也转成物资', subtext: '你决定一路冷到底。' },
    },
  },
  explore_evelyn_library: {
    speaker: '图书馆门口',
    nameplate: '双人探索',
    dialogues: ['一位母亲拦住了你和伊芙琳，说女儿被困在图书馆里，只要把人带回来，她愿意把所有弹药都给你。'],
    choices: {
      library_accept: { text: '接受请求', subtext: '报酬诱人，里面也一定够险。' },
      library_scam: { text: '拿上预付弹药，然后消失', subtext: '你准备把希望也一起骗走。' },
    },
  },
  explore_evelyn_library_after: {
    speaker: '图书馆深处',
    nameplate: '图书馆后续',
    dialogues: ['你们在书架深处找到了那个女孩，可她已经尸变。伊芙琳看了你一眼，等你决定接下来该怎么把这件事收住。'],
    choices: {
      library_disguise: { text: '把她伪装成活人带回去', subtext: '你准备把报酬先拿到手。' },
      library_end_child: { text: '结束她的痛苦', subtext: '至少别再让她母亲抱着幻想。', disabledText: '弹药不足 1' },
    },
  },
  explore_evelyn_library_mother: {
    speaker: '图书馆门口',
    nameplate: '图书馆后续',
    dialogues: ['听完真相后，那位母亲还是冲进了图书馆。你知道她八成回不来了，但现在折返依旧有机会。'],
    choices: {
      library_rescue_mother: { text: '和伊芙琳折返回去救她', subtext: '要再冒一次险，但至少问心无愧。', disabledText: '弹药不足 5' },
      library_leave_mother: { text: '太危险了，只能离开', subtext: '你知道这会留下一根刺。' },
    },
  },
}
