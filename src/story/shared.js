import { sharedCopy as copy } from './content-shared.js'

export const hasCompanion = (state, id) => state.companions.includes(id)
export const hasTag = (state, id) => state.tags.includes(id)
export const visited = (state, sceneId) => (state.sceneVisits[sceneId] ?? 0) > 0
export const eventResolved = (state, eventId) => Boolean(state.events?.[eventId])
export const isVilla = (state) => state.shelter === '山中别墅'
export const isBunker = (state) => state.shelter === '城郊防空洞'

export function addUnique(list, value) {
  if (!list.includes(value)) list.push(value)
}

export function removeItem(list, value) {
  return list.filter((entry) => entry !== value)
}

function humanUpkeep(state) {
  let total = 0
  if (hasCompanion(state, 'blake')) total += 10
  if (hasCompanion(state, 'luna')) total += 5
  if (hasCompanion(state, 'infant')) total += 5
  if (hasCompanion(state, 'evelyn')) total += 10
  return total
}

export function queueNextHub(nextHub) {
  return (state) => {
    state.flags.nextHub = nextHub
  }
}

export function gotoQueuedHub(state) {
  return state.flags.nextHub || 'day80_hub'
}

export function dayEnter(day, baseCost) {
  return {
    once: true,
    effects: (state) => {
      state.day = day
      state.flags.nextHub = ''
      state.flags.crisisText = ''
      state.flags.deathText = ''
      state.flags.recoveryScene = ''
      const total = Math.max(0, baseCost + humanUpkeep(state) - (state.flags.heated ? 5 : 0))
      state.supplies -= total
      return {
        toast: total > 0 ? `第 ${day} 天：物资 -${total}` : `第 ${day} 天`,
      }
    },
  }
}

export function nearDeath(recoveryScene, crisisText, deathText) {
  return (state) => {
    state.flags.recoveryScene = recoveryScene
    state.flags.crisisText = crisisText
    state.flags.deathText = deathText
  }
}

export function restartChoices() {
  return [
    {
      id: 'restart',
      text: copy.restart.text,
      subtext: copy.restart.subtext,
      next: 'intro_rebirth',
      effects: {
        resetRun: true,
      },
    },
  ]
}

export function normalExploreChoices(state) {
  const choices = []

  if (!eventResolved(state, 'fifthAvenueResolved')) {
    choices.push({
      id: 'explore_fifth',
      text: copy.normalExploreChoices.explore_fifth.text,
      subtext: copy.normalExploreChoices.explore_fifth.subtext,
      next: 'explore_fifth_avenue',
    })
  }

  if (state.day >= 5 && !eventResolved(state, 'canningFactoryResolved')) {
    choices.push({
      id: 'explore_factory',
      text: copy.normalExploreChoices.explore_factory.text,
      subtext: copy.normalExploreChoices.explore_factory.subtext,
      next: 'explore_canning_factory',
    })
  }

  if (state.day <= 30 && !eventResolved(state, 'churchResolved')) {
    choices.push({
      id: 'explore_church',
      text: copy.normalExploreChoices.explore_church.text,
      subtext: copy.normalExploreChoices.explore_church.subtext,
      next: 'explore_church',
    })
  }

  if (state.day >= 20 && !state.flags.hopeBarLocked && !eventResolved(state, 'hopeBarResolved')) {
    choices.push({
      id: 'explore_bar',
      text: copy.normalExploreChoices.explore_bar.text,
      subtext: copy.normalExploreChoices.explore_bar.subtext,
      next: 'explore_hope_bar',
    })
  }

  if (state.day >= 10 && !eventResolved(state, 'farmhouseResolved')) {
    choices.push({
      id: 'explore_farmhouse',
      text: copy.normalExploreChoices.explore_farmhouse.text,
      subtext: copy.normalExploreChoices.explore_farmhouse.subtext,
      next: 'explore_farmhouse',
    })
  }

  if (state.day >= 20 && !eventResolved(state, 'commercialStreetResolved')) {
    choices.push({
      id: 'explore_street',
      text: copy.normalExploreChoices.explore_street.text,
      subtext: copy.normalExploreChoices.explore_street.subtext,
      next: 'explore_street_infant',
    })
  }

  if (state.day >= 20 && !eventResolved(state, 'kindergartenResolved')) {
    choices.push({
      id: 'explore_kindergarten',
      text: copy.normalExploreChoices.explore_kindergarten.text,
      subtext: copy.normalExploreChoices.explore_kindergarten.subtext,
      next: 'explore_kindergarten',
    })
  }

  if (!eventResolved(state, 'convenienceResolved')) {
    choices.push({
      id: 'explore_shop',
      text: copy.normalExploreChoices.explore_shop.text,
      subtext: copy.normalExploreChoices.explore_shop.subtext,
      next: 'explore_convenience',
    })
  }

  if (state.day >= 30 && !eventResolved(state, 'hospitalResolved')) {
    choices.push({
      id: 'explore_hospital',
      text: copy.normalExploreChoices.explore_hospital.text,
      subtext: copy.normalExploreChoices.explore_hospital.subtext,
      next: 'explore_hospital',
    })
  }

  if (hasCompanion(state, 'evelyn') && state.day >= 40 && !eventResolved(state, 'evelynInnResolved')) {
    choices.push({
      id: 'explore_evelyn_inn',
      text: copy.normalExploreChoices.explore_evelyn_inn.text,
      subtext: copy.normalExploreChoices.explore_evelyn_inn.subtext,
      next: 'explore_evelyn_inn',
    })
  }

  if (hasCompanion(state, 'evelyn') && state.day >= 50 && !eventResolved(state, 'evelynLibraryResolved')) {
    choices.push({
      id: 'explore_evelyn_library',
      text: copy.normalExploreChoices.explore_evelyn_library.text,
      subtext: copy.normalExploreChoices.explore_evelyn_library.subtext,
      next: 'explore_evelyn_library',
    })
  }

  choices.push({
    id: 'explore_generic',
    text: copy.normalExploreChoices.explore_generic.text,
    subtext: copy.normalExploreChoices.explore_generic.subtext,
    next: gotoQueuedHub,
    effects: {
      supplies: 20,
      toast: '你沿着熟路搜刮了一圈：物资 +20',
    },
  })

  return choices
}

export function chrisOutcomeDialogues(state) {
  if (state.flags.serenaAlive && state.flags.serenaInvited) {
    return [
      '第二天，克里斯把瑟琳娜带来了。',
      '两个人都还活着，这已经比很多承诺更像奇迹。临走前，他们把一袋物资放在门口。',
    ]
  }

  if (state.flags.serenaAlive && state.flags.serenaUntouched) {
    return [
      '第二天，克里斯带着瑟琳娜一起来到你的据点。',
      '“谢谢你当初在酒吧什么都没拿。”他说，“这种事现在已经很少见了。”',
    ]
  }

  if (state.flags.hopeBarVisited) {
    return [
      '第二天，克里斯一个人回来了，脸色灰败。',
      '“我还是晚了。”他说。你知道他口中的“她”是谁，也知道自己在那间酒吧里做过什么。',
    ]
  }

  return [
    '第二天，克里斯按约回来，把借走的物资翻倍还你。',
    '末世里，这种守约已经足够稀有。',
  ]
}

export function chrisOutcomeEffects(state) {
  state.flags.hopeBarLocked = true
  if (state.flags.serenaAlive && state.flags.serenaInvited) return { supplies: 60, toast: '克里斯和瑟琳娜留下谢礼：物资 +60' }
  if (state.flags.serenaAlive && state.flags.serenaUntouched) return { supplies: 60, ammo: 20, toast: '他们留下了物资和弹药：物资 +60 / 弹药 +20' }
  if (state.flags.hopeBarVisited) return { supplies: 20, toast: '克里斯至少还了你借出去的那一份：物资 +20' }
  return { supplies: 40, toast: '克里斯翻倍归还了借款：物资 +40' }
}

export const INITIAL_STATE = {
  started: false,
  sceneId: 'intro_rebirth',
  dialogueIndex: 0,
  day: 0,
  humanity: 50,
  supplies: 0,
  ammo: 0,
  shelter: '',
  companions: [],
  tags: [],
  events: {
    fifthAvenueResolved: false,
    canningFactoryResolved: false,
    churchResolved: false,
    hopeBarResolved: false,
    farmhouseResolved: false,
    commercialStreetResolved: false,
    kindergartenResolved: false,
    convenienceResolved: false,
    hospitalResolved: false,
    blakeResolved: false,
    lunaResolved: false,
    limeResolved: false,
    evelynResolved: false,
    evelynInnResolved: false,
    evelynLibraryResolved: false,
  },
  flags: {
    truthSeeker: false,
    radio: false,
    heardBroadcast: false,
    campUnlocked: false,
    campBlacklisted: false,
    heated: false,
    promise: false,
    evelynRescued: false,
    lunaFinalized: false,
    hopeBarVisited: false,
    hopeBarLocked: false,
    serenaAlive: false,
    serenaUntouched: false,
    serenaInvited: false,
    nextHub: '',
    crisisText: '',
    deathText: '',
    recoveryScene: '',
  },
  sceneVisits: {},
}

export const COMPANIONS = {
  lime: { id: 'lime', name: '莱姆', desc: '忠诚的狗，不消耗物资，但会把很多节点的情绪温度直接改掉。' },
  blake: { id: 'blake', name: '布莱克', desc: '别墅的原主人。表面和善，骨子里始终带着会翻脸的狠劲。' },
  luna: { id: 'luna', name: '露娜', desc: '防空洞门外救下来的女孩。每个阶段会额外消耗 5 物资。' },
  infant: { id: 'infant', name: '婴儿', desc: '襁褓里的火种。每个阶段会额外消耗 5 物资，但也会持续提醒你为何而活。' },
  evelyn: { id: 'evelyn', name: '伊芙琳', desc: '流浪者、枪手、搭档。每个阶段会额外消耗 10 物资。' },
  john: { id: 'john', name: '约翰', desc: '血清计划的关键博士，比任何一箱物资都更重要。' },
}

export const TAGS = {
  bottom_line: { id: 'bottom_line', title: '《底线》', desc: '你开始把人和资源放进同一个判断体系里。' },
  gravestone: { id: 'gravestone', title: '《人性的墓碑》', desc: '你损失了口粮，却保住了灵魂。' },
  villa_owner: { id: 'villa_owner', title: '《别墅的主人》', desc: '布莱克死后，这座房子终于真正属于你。' },
  promise: { id: 'promise', title: '《承诺》', desc: '“我不会让你死在我前面。”这句话会在结局里回来。' },
  traverser: { id: 'traverser', title: '《穿越者》', desc: '你终于明白，这不是重生，而是一条已经闭合的时间线。' },
  avenger: { id: 'avenger', title: '《复仇者》', desc: '你替上一世的自己完成了复仇。' },
  prophecy: { id: 'prophecy', title: '《神谕》', desc: '神父死前那句话，比安慰更像预言。' },
  hope_thief: { id: 'hope_thief', title: '《希望的盗贼》', desc: '你拿走的不只是物资，还有别人死守着的那一点盼头。' },
  deathless_love: { id: 'deathless_love', title: '《超越生死的爱恋》', desc: '末世没有把那段感情磨碎，反而把它照得更刺眼。' },
  last_supper: { id: 'last_supper', title: '《最后的晚餐》', desc: '在末世里，善意有时比饥饿更危险。' },
  infant: { id: 'infant', title: '《婴儿》', desc: '这个脆弱的生命，会变成你日后最沉也最亮的一块石头。' },
  martyr: { id: 'martyr', title: '《殉道者》', desc: '你把自己留给了尸潮，也把希望留给了别人。' },
  forgiveness_light: { id: 'forgiveness_light', title: '《宽恕之光》', desc: '你在最脏的一幕里，还是给了别人第二次机会。' },
  last_light: { id: 'last_light', title: '《最后一丝光亮》', desc: '你没有把酒吧里最后那点希望也顺手掐灭。' },
  covenant: { id: 'covenant', title: '《约定》', desc: '你和那对夫妻都守住了自己的承诺。' },
  good_person: { id: 'good_person', title: '《善良的人》', desc: '最讽刺的一句夸奖，偏偏落在最不配的人身上。' },
  greater_demon: { id: 'greater_demon', title: '《更大的恶魔》', desc: '你除掉了恶魔，却顺手坐上了他的位子。' },
  hunter: { id: 'hunter', title: '《猎魔人》', desc: '你清掉了那家旅店里真正该被清掉的东西。' },
  blood_reward: { id: 'blood_reward', title: '《沾血的报酬》', desc: '你拿到了那袋弹药，也把一对母女一起送进了更深的黑里。' },
  luna_queen: { id: 'luna_queen', title: '《末世女王》', desc: '你送走了露娜，而她最终在末世中走出了属于自己的路。' },
  missed_partner: { id: 'missed_partner', title: '《错过的伙伴》', desc: '你遇到过一个看起来很可靠的人，却还是和她错开了。' },
  selfish_coward: { id: 'selfish_coward', title: '《自私的胆小鬼》', desc: '你拒绝救博士时，伊芙琳留给你的评价。' },
  evelyn: { id: 'evelyn', title: '《伊芙琳》', desc: '她死在你救出博士的那一刻，也死成了这一线最重的一页。' },
  savior: { id: 'savior', title: '《救世主》', desc: '如果不是你带出约翰，人类根本等不到血清。' },
  partner: { id: 'partner', title: '《搭档》', desc: '你和伊芙琳已经不只是临时同伴。' },
  lovers: { id: 'lovers', title: '《恋人》', desc: '你终于承认了这段关系。' },
  survival_rule: { id: 'survival_rule', title: '《末世生存守则》', desc: '你仍然选择把情感挡在门外。' },
  true_savior: { id: 'true_savior', title: '《真正的救世主》', desc: '伊芙琳把答案继续交给了下一个生命。' },
  neo_and_neo: { id: 'neo_and_neo', title: '《尼奥与尼奥》', desc: '人类尼奥和丧尸尼奥，在第 100 天完成闭环。' },
  high_wall: { id: 'high_wall', title: '《高墙之内》', desc: '别墅外真正竖起了人类的高墙。' },
  underground_city: { id: 'underground_city', title: '《地底之城》', desc: '防空洞被扩成了属于人类的地下城。' },
  lonely_fortress: { id: 'lonely_fortress', title: '《孤独堡垒》', desc: '你把自己关进了一座绝对安全的山腰堡垒。' },
  underground_kingdom: { id: 'underground_kingdom', title: '《地下王国》', desc: '你把防空洞打造成了只属于自己的地下王国。' },
  neo_death: { id: 'neo_death', title: '《尼奥之死》', desc: '你以为自己赢了末日，最后却还是死在因果上。' },
}

export const THEMES = {
  prelude: { name: '前夜', weather: '乌云压城', mood: '末世还没正式开口', backdrop: 'prelude', sprite: 'neo' },
  shelter: { name: '庇护所', weather: '封闭空间', mood: '物资和情绪一起被堆放', backdrop: 'shelter', sprite: 'neo' },
  street: { name: '街区', weather: '警报和尸吼', mood: '任何一次停车都可能引出事故', backdrop: 'street', sprite: 'neo' },
  road: { name: '探索路段', weather: '风、雨或灰雪', mood: '每条路都在逼你表态', backdrop: 'road', sprite: 'neo' },
  camp: { name: '黎明者营地', weather: '天台强风', mood: '交易与试探混在一起', backdrop: 'camp', sprite: 'camp' },
  ending: { name: '正式结局', weather: '天色发白', mood: '所有选择都在这里回响', backdrop: 'ending', sprite: 'neo' },
  winter: { name: '灰雪期', weather: '零下三十五度', mood: '生存成本被天气再抬高一层', backdrop: 'ending', sprite: 'neo' },
  lab: { name: '科研基地', weather: '金属警报', mood: '血清和尸潮同时逼近', backdrop: 'ending', sprite: 'john' },
  romance: { name: '并肩之后', weather: '近到能听见呼吸', mood: '枪火缝隙里也会长出情绪', backdrop: 'shelter', sprite: 'evelyn' },
}
