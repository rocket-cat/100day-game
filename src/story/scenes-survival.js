import { dayEnter, eventResolved, hasCompanion, isBunker, isVilla, nearDeath, queueNextHub, removeItem } from './shared.js'
import { survivalCopy as copy } from './content-survival.js'

export const scenesSurvival = {
  day4_hub: {
    theme: 'shelter',
    speaker: copy.day4_hub.speaker,
    nameplate: copy.day4_hub.nameplate,
    onEnter: dayEnter(4, 10),
    dialogues: (state) => [
      isVilla(state) && !eventResolved(state, 'blakeResolved') ? copy.day4_hub.dialogues.pendingBlake : copy.day4_hub.dialogues.default,
    ],
    choices: (state) => {
      const choices = []
      if (isVilla(state) && !eventResolved(state, 'blakeResolved')) {
        choices.push({ id: 'blake_event', text: copy.day4_hub.choices.blake_event.text, subtext: copy.day4_hub.choices.blake_event.subtext, next: 'blake_intro' })
      } else {
        choices.push({ id: 'stay_day4', text: copy.day4_hub.choices.stay_day4.text, subtext: copy.day4_hub.choices.stay_day4.subtext, next: 'day5_hub', effects: { humanity: -5, toast: '你在防空洞里越想越丧：人性 -5' } })
      }
      choices.push({ id: 'explore_day4', text: copy.day4_hub.choices.explore_day4.text, subtext: copy.day4_hub.choices.explore_day4.subtext, next: 'explore_select', effects: queueNextHub('day5_hub') })
      if (state.flags.radio && !state.flags.heardBroadcast) {
        choices.push({ id: 'radio_day4', text: copy.day4_hub.choices.radio_day4.text, subtext: copy.day4_hub.choices.radio_day4.subtext, next: 'radio_briefing', effects: queueNextHub('day5_hub') })
      }
      return choices
    },
  },

  radio_briefing: {
    theme: 'road',
    speaker: copy.radio_briefing.speaker,
    nameplate: copy.radio_briefing.nameplate,
    onEnter: { once: true, effects: { setFlags: { heardBroadcast: true } } },
    dialogues: copy.radio_briefing.dialogues,
    next: (state) => state.flags.nextHub || 'day80_hub',
  },

  blake_intro: {
    theme: 'shelter',
    speaker: copy.blake_intro.speaker,
    nameplate: copy.blake_intro.nameplate,
    dialogues: copy.blake_intro.dialogues,
    choices: [
      { id: 'blake_join', text: copy.blake_intro.choices.blake_join.text, subtext: copy.blake_intro.choices.blake_join.subtext, next: 'day5_hub', effects: { addCompanion: 'blake', supplies: 10, ammo: 5, humanity: 5, setEvents: { blakeResolved: true }, toast: '布莱克加入：物资 +10 / 弹药 +5 / 人性 +5' } },
      { id: 'blake_refuse', text: copy.blake_intro.choices.blake_refuse.text, subtext: copy.blake_intro.choices.blake_refuse.subtext, next: 'blake_showdown' },
    ],
  },

  blake_showdown: {
    theme: 'street',
    speaker: copy.blake_showdown.speaker,
    nameplate: copy.blake_showdown.nameplate,
    dialogues: copy.blake_showdown.dialogues,
    choices: [
      { id: 'blake_wrestle', text: copy.blake_showdown.choices.blake_wrestle.text, subtext: copy.blake_showdown.choices.blake_wrestle.subtext, next: 'blake_execution', effects: { supplies: -10, ammo: 5, toast: '扭打过后：物资 -10 / 弹药 +5' } },
      { id: 'blake_lime', text: copy.blake_showdown.choices.blake_lime.text, subtext: copy.blake_showdown.choices.blake_lime.subtext, next: 'blake_execution', showIf: (state) => hasCompanion(state, 'lime'), effects: { ammo: 5, toast: '莱姆帮你夺下了枪：弹药 +5' } },
      { id: 'blake_shoot', text: copy.blake_showdown.choices.blake_shoot.text, subtext: copy.blake_showdown.choices.blake_shoot.subtext, next: 'blake_execution', requires: ({ ammo }) => ammo >= 1, disabledText: copy.blake_showdown.choices.blake_shoot.disabledText, effects: { ammo: 4, humanity: -20, toast: '你先一步开枪结果了他：净弹药 +4 / 人性 -20' } },
      { id: 'blake_surrender', text: copy.blake_showdown.choices.blake_surrender.text, subtext: copy.blake_showdown.choices.blake_surrender.subtext, next: 'day5_hub', effects: { addCompanion: 'blake', supplies: 10, ammo: 5, humanity: 5, setEvents: { blakeResolved: true }, toast: '你把局面重新拉回了合作：物资 +10 / 弹药 +5 / 人性 +5' } },
      {
        id: 'blake_spare',
        text: copy.blake_showdown.choices.blake_spare.text,
        subtext: copy.blake_showdown.choices.blake_spare.subtext,
        next: 'near_death',
        effects: [
          { setEvents: { blakeResolved: true } },
          nearDeath('day5_hub', copy.blake_showdown.choices.blake_spare.crisisText, copy.blake_showdown.choices.blake_spare.deathText),
        ],
      },
    ],
  },

  blake_execution: {
    theme: 'shelter',
    speaker: copy.blake_execution.speaker,
    nameplate: copy.blake_execution.nameplate,
    dialogues: copy.blake_execution.dialogues,
    choices: [
      { id: 'blake_bury', text: copy.blake_execution.choices.blake_bury.text, subtext: copy.blake_execution.choices.blake_bury.subtext, next: 'day5_hub', effects: { humanity: 10, addTag: 'villa_owner', setEvents: { blakeResolved: true }, toast: '你给他留了墓：人性 +10 / 获得词条' } },
      { id: 'blake_convert', text: copy.blake_execution.choices.blake_convert.text, subtext: copy.blake_execution.choices.blake_convert.subtext, next: 'day5_hub', effects: { supplies: 30, humanity: -30, addTag: 'bottom_line', setEvents: { blakeResolved: true }, toast: '物资 +30 / 人性 -30 / 获得词条' } },
    ],
  },

  day5_hub: {
    theme: 'shelter',
    speaker: copy.day5_hub.speaker,
    nameplate: copy.day5_hub.nameplate,
    onEnter: dayEnter(5, 5),
    dialogues: (state) => [isBunker(state) ? copy.day5_hub.dialogues.bunker : copy.day5_hub.dialogues.default],
    choices: (state) => {
      const choices = []
      if (isBunker(state) && !eventResolved(state, 'lunaResolved')) {
        choices.push({ id: 'luna_event', text: copy.day5_hub.choices.luna_event.text, subtext: copy.day5_hub.choices.luna_event.subtext, next: 'luna_intro' })
      }
      choices.push({ id: 'stay_day5', text: copy.day5_hub.choices.stay_day5.text, subtext: copy.day5_hub.choices.stay_day5.subtext, next: 'day10_hub', effects: { humanity: 5, toast: '你在据点里熬到了晚上：人性 +5' } })
      choices.push({ id: 'explore_day5', text: copy.day5_hub.choices.explore_day5.text, subtext: copy.day5_hub.choices.explore_day5.subtext, next: 'explore_select', effects: queueNextHub('day10_hub') })
      return choices
    },
  },

  luna_intro: {
    theme: 'street',
    speaker: copy.luna_intro.speaker,
    nameplate: copy.luna_intro.nameplate,
    dialogues: copy.luna_intro.dialogues,
    choices: [
      { id: 'luna_open', text: copy.luna_intro.choices.luna_open.text, subtext: copy.luna_intro.choices.luna_open.subtext, next: 'luna_decision', effects: { humanity: 20, toast: '你把两人拉进了防空洞：人性 +20' } },
      { id: 'luna_drive', text: copy.luna_intro.choices.luna_drive.text, subtext: copy.luna_intro.choices.luna_drive.subtext, next: 'day10_hub', effects: { ammo: -1, humanity: -10, setEvents: { lunaResolved: true }, toast: '你把她们赶走了：弹药 -1 / 人性 -10' } },
    ],
  },

  luna_decision: {
    theme: 'shelter',
    speaker: copy.luna_decision.speaker,
    nameplate: copy.luna_decision.nameplate,
    dialogues: copy.luna_decision.dialogues,
    choices: [
      { id: 'luna_shoot', text: copy.luna_decision.choices.luna_shoot.text, subtext: copy.luna_decision.choices.luna_shoot.subtext, next: 'luna_shoot_aftermath', requires: ({ ammo }) => ammo >= 1, disabledText: copy.luna_decision.choices.luna_shoot.disabledText, effects: { ammo: -1, toast: '你在露娜面前开了枪：弹药 -1' } },
      { id: 'luna_isolate', text: copy.luna_decision.choices.luna_isolate.text, subtext: copy.luna_decision.choices.luna_isolate.subtext, next: 'luna_isolate_after' },
    ],
  },

  luna_shoot_aftermath: {
    theme: 'street',
    speaker: copy.luna_shoot_aftermath.speaker,
    nameplate: copy.luna_shoot_aftermath.nameplate,
    dialogues: copy.luna_shoot_aftermath.dialogues,
    choices: [
      {
        id: 'luna_kill_once',
        text: copy.luna_shoot_aftermath.choices.luna_kill_once.text,
        subtext: copy.luna_shoot_aftermath.choices.luna_kill_once.subtext,
        next: 'luna_body_aftermath',
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.luna_shoot_aftermath.choices.luna_kill_once.disabledText,
        effects: { ammo: -1, humanity: -10, toast: '你又开了一枪：弹药 -1 / 人性 -10' },
      },
      {
        id: 'luna_kill_burst',
        text: copy.luna_shoot_aftermath.choices.luna_kill_burst.text,
        subtext: copy.luna_shoot_aftermath.choices.luna_kill_burst.subtext,
        next: 'day10_hub',
        requires: ({ ammo }) => ammo >= 3,
        disabledText: copy.luna_shoot_aftermath.choices.luna_kill_burst.disabledText,
        effects: { ammo: 2, humanity: -10, setEvents: { lunaResolved: true }, toast: '你连开三枪后把尸体扔到了外面：净弹药 +2 / 人性 -10' },
      },
    ],
  },

  luna_body_aftermath: {
    theme: 'shelter',
    speaker: copy.luna_body_aftermath.speaker,
    nameplate: copy.luna_body_aftermath.nameplate,
    dialogues: copy.luna_body_aftermath.dialogues,
    choices: [
      { id: 'luna_throw', text: copy.luna_body_aftermath.choices.luna_throw.text, subtext: copy.luna_body_aftermath.choices.luna_throw.subtext, next: 'day10_hub', effects: { ammo: 5, setEvents: { lunaResolved: true }, toast: '你把尸体安放到远处，回来时捡到了子弹：弹药 +5' } },
      { id: 'luna_bury', text: copy.luna_body_aftermath.choices.luna_bury.text, subtext: copy.luna_body_aftermath.choices.luna_bury.subtext, next: 'day10_hub', effects: { setEvents: { lunaResolved: true }, toast: '你把她们埋进了防空洞外的土里' } },
      { id: 'luna_convert', text: copy.luna_body_aftermath.choices.luna_convert.text, subtext: copy.luna_body_aftermath.choices.luna_convert.subtext, next: 'day10_hub', effects: { supplies: 30, humanity: -30, addTag: 'bottom_line', setEvents: { lunaResolved: true }, toast: '你把母女二人也算进了库存：物资 +30 / 人性 -30 / 获得词条' } },
    ],
  },

  luna_isolate_after: {
    theme: 'shelter',
    speaker: copy.luna_isolate_after.speaker,
    nameplate: copy.luna_isolate_after.nameplate,
    dialogues: copy.luna_isolate_after.dialogues,
    choices: [
      { id: 'luna_join', text: copy.luna_isolate_after.choices.luna_join.text, subtext: copy.luna_isolate_after.choices.luna_join.subtext, next: 'day10_hub', effects: { addCompanion: 'luna', humanity: 10, setEvents: { lunaResolved: true }, toast: '露娜深深看了你一眼，决定留下：人性 +10 / 露娜加入' } },
      {
        id: 'luna_send',
        text: copy.luna_isolate_after.choices.luna_send.text,
        subtext: copy.luna_isolate_after.choices.luna_send.subtext,
        next: 'day10_hub',
        requires: ({ supplies }) => supplies >= 10,
        disabledText: copy.luna_isolate_after.choices.luna_send.disabledText,
        effects: { supplies: -10, addTag: 'luna_queen', setEvents: { lunaResolved: true }, toast: '你给她留了物资后送她离开：物资 -10 / 获得词条' },
      },
    ],
  },

  day10_hub: {
    theme: 'shelter',
    speaker: copy.day10_hub.speaker,
    nameplate: copy.day10_hub.nameplate,
    onEnter: dayEnter(10, 15),
    dialogues: copy.day10_hub.dialogues,
    choices: [
      {
        id: 'home_day10',
        text: copy.day10_hub.choices.home_day10.text,
        subtext: copy.day10_hub.choices.home_day10.subtext,
        next: 'day20_hub',
        effects: (state) => (isVilla(state) ? { supplies: 30, ammo: 10, toast: '别墅暗格里翻出霰弹枪和压缩饼干：物资 +30 / 弹药 +10' } : { toast: '你把防空洞重新整理了一遍' }),
      },
      { id: 'explore_day10', text: copy.day10_hub.choices.explore_day10.text, subtext: copy.day10_hub.choices.explore_day10.subtext, next: 'explore_select', effects: queueNextHub('day20_hub') },
    ],
  },

  day20_hub: {
    theme: 'camp',
    speaker: copy.day20_hub.speaker,
    nameplate: copy.day20_hub.nameplate,
    onEnter: { once: true, effects: [dayEnter(20, 15).effects, { setFlags: { campUnlocked: true } }] },
    dialogues: copy.day20_hub.dialogues,
    choices: (state) => {
      const choices = [
        { id: 'stay_day20', text: copy.day20_hub.choices.stay_day20.text, subtext: copy.day20_hub.choices.stay_day20.subtext, next: 'day30_hub', effects: { humanity: -5, toast: '你又苟掉一个阶段：人性 -5' } },
        { id: 'explore_day20', text: copy.day20_hub.choices.explore_day20.text, subtext: copy.day20_hub.choices.explore_day20.subtext, next: 'explore_select', effects: queueNextHub('day30_hub') },
      ]
      if (hasCompanion(state, 'lime') && !eventResolved(state, 'limeResolved')) {
        choices.splice(1, 0, { id: 'lime_event', text: copy.day20_hub.choices.lime_event.text, subtext: copy.day20_hub.choices.lime_event.subtext, next: 'lime_event' })
      }
      if (state.flags.campUnlocked && !state.flags.campBlacklisted) {
        choices.push({ id: 'camp_day20', text: copy.day20_hub.choices.camp_day20.text, subtext: copy.day20_hub.choices.camp_day20.subtext, next: 'camp_trade', effects: queueNextHub('day30_hub') })
      }
      return choices
    },
  },

  lime_event: {
    theme: 'road',
    speaker: copy.lime_event.speaker,
    nameplate: copy.lime_event.nameplate,
    dialogues: copy.lime_event.dialogues,
    choices: [
      { id: 'save_lime', text: copy.lime_event.choices.save_lime.text, subtext: copy.lime_event.choices.save_lime.subtext, next: 'day30_hub', effects: { humanity: 15, setEvents: { limeResolved: true }, toast: '你带着莱姆逃了出来：人性 +15' } },
      {
        id: 'save_child',
        text: copy.lime_event.choices.save_child.text,
        subtext: copy.lime_event.choices.save_child.subtext,
        next: 'day30_hub',
        effects: (state) => {
          state.humanity += 10
          state.ammo -= 5
          state.companions = removeItem(state.companions, 'lime')
          state.events.limeResolved = true
          return { toast: '小丧尸暴起，莱姆替你挡住了致命一口：人性 +10 / 弹药 -5 / 失去莱姆' }
        },
      },
    ],
  },

  camp_trade: {
    theme: 'camp',
    speaker: copy.camp_trade.speaker,
    nameplate: copy.camp_trade.nameplate,
    dialogues: copy.camp_trade.dialogues,
    choices: [
      { id: 'camp_buy_ammo', text: copy.camp_trade.choices.camp_buy_ammo.text, subtext: copy.camp_trade.choices.camp_buy_ammo.subtext, next: (state) => state.flags.nextHub || 'day80_hub', requires: ({ supplies }) => supplies >= 10, disabledText: copy.camp_trade.choices.camp_buy_ammo.disabledText, effects: { supplies: -10, ammo: 5, toast: '营地交易完成：物资 -10 / 弹药 +5' } },
      { id: 'camp_buy_supplies', text: copy.camp_trade.choices.camp_buy_supplies.text, subtext: copy.camp_trade.choices.camp_buy_supplies.subtext, next: (state) => state.flags.nextHub || 'day80_hub', requires: ({ ammo }) => ammo >= 5, disabledText: copy.camp_trade.choices.camp_buy_supplies.disabledText, effects: { ammo: -5, supplies: 10, toast: '营地交易完成：弹药 -5 / 物资 +10' } },
      { id: 'camp_leave', text: copy.camp_trade.choices.camp_leave.text, subtext: copy.camp_trade.choices.camp_leave.subtext, next: (state) => state.flags.nextHub || 'day80_hub' },
    ],
  },

  day30_hub: {
    theme: 'ending',
    speaker: copy.day30_hub.speaker,
    nameplate: copy.day30_hub.nameplate,
    onEnter: dayEnter(30, 15),
    dialogues: copy.day30_hub.dialogues,
    choices: [
      { id: 'cliff_route', text: copy.day30_hub.choices.cliff_route.text, subtext: copy.day30_hub.choices.cliff_route.subtext, next: 'cliff_truth', requires: ({ ammo }) => ammo >= 5, disabledText: copy.day30_hub.choices.cliff_route.disabledText, effects: { ammo: -5, toast: '你带着枪上路：弹药 -5' } },
      { id: 'home_route', text: copy.day30_hub.choices.home_route.text, subtext: copy.day30_hub.choices.home_route.subtext, next: 'home_revenge', requires: ({ ammo }) => ammo >= 3, disabledText: copy.day30_hub.choices.home_route.disabledText, effects: { ammo: -3, toast: '你带着旧账上路：弹药 -3' } },
      { id: 'stay_day30', text: copy.day30_hub.choices.stay_day30.text, subtext: copy.day30_hub.choices.stay_day30.subtext, next: 'day35_hub', effects: { humanity: 30, toast: '你任由疑惑烂在屋里：人性 +30' } },
    ],
  },

  cliff_truth: {
    theme: 'road',
    speaker: copy.cliff_truth.speaker,
    nameplate: copy.cliff_truth.nameplate,
    dialogues: copy.cliff_truth.dialogues,
    deadlock: {
      sceneId: 'day35_hub',
      effects: { humanity: -5, toast: '你没能继续深挖悬崖下的真相，只能先撤回据点：人性 -5' },
    },
    choices: [
      { id: 'cliff_bottom', text: copy.cliff_truth.choices.cliff_bottom.text, subtext: copy.cliff_truth.choices.cliff_bottom.subtext, next: 'day35_hub', requires: ({ supplies }) => supplies >= 10, disabledText: copy.cliff_truth.choices.cliff_bottom.disabledText, effects: { supplies: -10, addTag: 'traverser', toast: '你确认了自己是穿越者：物资 -10 / 获得词条' } },
      { id: 'cliff_home', text: copy.cliff_truth.choices.cliff_home.text, subtext: copy.cliff_truth.choices.cliff_home.subtext, next: 'day35_hub', requires: ({ ammo }) => ammo >= 5, disabledText: copy.cliff_truth.choices.cliff_home.disabledText, effects: { ammo: -5, supplies: 25, addTags: ['traverser', 'avenger'], toast: '你在真相和复仇里一起拿回了一部分自己：弹药 -5 / 物资 +25' } },
    ],
  },

  home_revenge: {
    theme: 'street',
    speaker: copy.home_revenge.speaker,
    nameplate: copy.home_revenge.nameplate,
    onEnter: { once: true, effects: { supplies: 25, addTag: 'avenger', toast: '你清掉了旧账：物资 +25 / 获得词条' } },
    dialogues: copy.home_revenge.dialogues,
    next: 'day35_hub',
  },

  day35_hub: {
    theme: 'winter',
    speaker: copy.day35_hub.speaker,
    nameplate: copy.day35_hub.nameplate,
    onEnter: dayEnter(35, 15),
    dialogues: copy.day35_hub.dialogues,
    choices: (state) => {
      const after35 = (innerState) => (hasCompanion(innerState, 'luna') && isBunker(innerState) && !innerState.flags.lunaFinalized ? 'day38_luna' : 'day50_hub')
      const queueAfter35 = (innerState) => {
        innerState.flags.nextHub = hasCompanion(innerState, 'luna') && isBunker(innerState) && !innerState.flags.lunaFinalized ? 'day38_luna' : 'day50_hub'
      }

      const choices = [
        { id: 'stay_day35', text: copy.day35_hub.choices.stay_day35.text, subtext: copy.day35_hub.choices.stay_day35.subtext, next: after35, effects: { humanity: -5, toast: '你什么也没做：人性 -5' } },
        { id: 'explore_day35', text: copy.day35_hub.choices.explore_day35.text, subtext: copy.day35_hub.choices.explore_day35.subtext, next: 'explore_select', effects: queueAfter35 },
      ]

      if (!eventResolved(state, 'evelynResolved')) {
        choices.splice(1, 0, { id: 'meet_evelyn', text: copy.day35_hub.choices.meet_evelyn.text, subtext: copy.day35_hub.choices.meet_evelyn.subtext, next: 'evelyn_intro' })
      }

      if (state.flags.radio) {
        choices.push({ id: 'airdrop_day35', text: copy.day35_hub.choices.airdrop_day35.text, subtext: copy.day35_hub.choices.airdrop_day35.subtext, next: 'airdrop_event', effects: queueAfter35 })
      }

      if (state.flags.campUnlocked && !state.flags.campBlacklisted) {
        choices.push({ id: 'camp_day35', text: copy.day35_hub.choices.camp_day35.text, subtext: copy.day35_hub.choices.camp_day35.subtext, next: 'camp_trade', effects: queueAfter35 })
      }

      return choices
    },
  },

  evelyn_intro: {
    theme: 'road',
    speaker: copy.evelyn_intro.speaker,
    nameplate: copy.evelyn_intro.nameplate,
    dialogues: copy.evelyn_intro.dialogues,
    choices: [
      { id: 'save_eve', text: copy.evelyn_intro.choices.save_eve.text, subtext: copy.evelyn_intro.choices.save_eve.subtext, next: 'evelyn_invite', effects: { supplies: 20, ammo: -5, setFlags: { evelynRescued: true }, toast: '你一边救人一边撤退：物资 +20 / 弹药 -5' } },
      { id: 'ignore_eve', text: copy.evelyn_intro.choices.ignore_eve.text, subtext: copy.evelyn_intro.choices.ignore_eve.subtext, next: 'evelyn_invite', requires: ({ ammo }) => ammo >= 5, disabledText: copy.evelyn_intro.choices.ignore_eve.disabledText, effects: { ammo: -5, setFlags: { evelynRescued: false }, toast: '你被迫帮她开路：弹药 -5' } },
    ],
  },

  evelyn_invite: {
    theme: 'road',
    speaker: copy.evelyn_invite.speaker,
    nameplate: copy.evelyn_invite.nameplate,
    dialogues: copy.evelyn_invite.dialogues,
    choices: [
      { id: 'eve_equal', text: copy.evelyn_invite.choices.eve_equal.text, subtext: copy.evelyn_invite.choices.eve_equal.subtext, next: (state) => (hasCompanion(state, 'luna') && isBunker(state) && !state.flags.lunaFinalized ? 'day38_luna' : 'day50_hub'), effects: { addCompanion: 'evelyn', supplies: 10, ammo: 20, setEvents: { evelynResolved: true }, toast: '伊芙琳加入：物资 +10 / 弹药 +20' } },
      {
        id: 'eve_promise',
        text: copy.evelyn_invite.choices.eve_promise.text,
        subtext: copy.evelyn_invite.choices.eve_promise.subtext,
        next: (state) => (hasCompanion(state, 'luna') && isBunker(state) && !state.flags.lunaFinalized ? 'day38_luna' : 'day50_hub'),
        effects: (state) => {
          if (!state.flags.evelynRescued) {
            state.events.evelynResolved = true
            if (!state.tags.includes('missed_partner')) state.tags.push('missed_partner')
            return { toast: '这句承诺来得太晚，伊芙琳拒绝了你：获得词条' }
          }
          return { addCompanion: 'evelyn', supplies: 10, ammo: 20, setFlags: { promise: true }, setEvents: { evelynResolved: true }, addTag: 'promise', toast: '伊芙琳沉默几秒后点了头：物资 +10 / 弹药 +20 / 获得词条' }
        },
      },
      { id: 'eve_gun', text: copy.evelyn_invite.choices.eve_gun.text, subtext: copy.evelyn_invite.choices.eve_gun.subtext, next: (state) => (hasCompanion(state, 'luna') && isBunker(state) && !state.flags.lunaFinalized ? 'day38_luna' : 'day50_hub'), effects: { ammo: 20, setEvents: { evelynResolved: true }, addTag: 'missed_partner', toast: '伊芙琳扔给你一把自动步枪后离开了：弹药 +20 / 获得词条' } },
    ],
  },

  airdrop_event: {
    theme: 'road',
    speaker: copy.airdrop_event.speaker,
    nameplate: copy.airdrop_event.nameplate,
    dialogues: copy.airdrop_event.dialogues,
    deadlock: {
      sceneId: 'near_death',
      crisisText: '你刚摸到空投点边缘就意识到，手里的火力根本撕不开这片尸潮。那只红眼怪物已经盯上了你。',
      deathText: '你没能离开空投点。那批补给最后和你一起留在了尸群中央。',
    },
    choices: [
      { id: 'airdrop_safe', text: copy.airdrop_event.choices.airdrop_safe.text, subtext: copy.airdrop_event.choices.airdrop_safe.subtext, next: 'day50_hub', requires: ({ ammo }) => ammo >= 10, disabledText: copy.airdrop_event.choices.airdrop_safe.disabledText, effects: { ammo: -10, supplies: 30, toast: '你从尸群里抠出一部分物资：弹药 -10 / 物资 +30' } },
      { id: 'airdrop_all', text: copy.airdrop_event.choices.airdrop_all.text, subtext: copy.airdrop_event.choices.airdrop_all.subtext, next: 'day50_hub', requires: ({ ammo }) => ammo >= 20, disabledText: copy.airdrop_event.choices.airdrop_all.disabledText, effects: { ammo: -20, supplies: 60, toast: '你带着整箱补给狼狈撤离：弹药 -20 / 物资 +60' } },
    ],
  },

  day38_luna: {
    theme: 'road',
    speaker: copy.day38_luna.speaker,
    nameplate: copy.day38_luna.nameplate,
    onEnter: { once: true, effects: (state) => { state.day = 38; return { toast: '惊变第 38 天' } } },
    dialogues: copy.day38_luna.dialogues,
    choices: [
      { id: 'luna_cover', text: copy.day38_luna.choices.luna_cover.text, subtext: copy.day38_luna.choices.luna_cover.subtext, next: 'day50_hub', requires: ({ ammo }) => ammo >= 20, disabledText: copy.day38_luna.choices.luna_cover.disabledText, effects: { ammo: -20, humanity: 50, removeCompanion: 'luna', setFlags: { lunaFinalized: true }, toast: '露娜最后把命还在了你前面：弹药 -20 / 人性 +50 / 失去露娜' } },
      { id: 'luna_leave', text: copy.day38_luna.choices.luna_leave.text, subtext: copy.day38_luna.choices.luna_leave.subtext, next: 'day50_hub', effects: { ammo: -5, humanity: -10, removeCompanion: 'luna', setFlags: { lunaFinalized: true }, toast: '你把露娜留在了尸潮里：弹药 -5 / 人性 -10 / 失去露娜' } },
    ],
  },
}
