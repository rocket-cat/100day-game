import { addUnique, chrisOutcomeDialogues, chrisOutcomeEffects, dayEnter, hasCompanion, hasTag, isBunker, isVilla, nearDeath, queueNextHub, removeItem, restartChoices } from './shared.js'
import { endgameCopy as copy } from './content-endgame.js'

export const scenesEndgame = {
  day50_hub: {
    theme: 'winter',
    speaker: copy.day50_hub.speaker,
    nameplate: copy.day50_hub.nameplate,
    onEnter: dayEnter(50, 20),
    dialogues: copy.day50_hub.dialogues,
    choices: [
      { id: 'stay_day50', text: copy.day50_hub.choices.stay_day50.text, subtext: copy.day50_hub.choices.stay_day50.subtext, next: 'day55_hub', effects: { humanity: 15, toast: '你让自己舒服了一次：人性 +15' } },
      { id: 'explore_day50', text: copy.day50_hub.choices.explore_day50.text, subtext: copy.day50_hub.choices.explore_day50.subtext, next: 'explore_select', effects: queueNextHub('day55_hub') },
      { id: 'camp_day50', text: copy.day50_hub.choices.camp_day50.text, subtext: copy.day50_hub.choices.camp_day50.subtext, next: 'camp_trade', showIf: (state) => state.flags.campUnlocked && !state.flags.campBlacklisted, effects: queueNextHub('day55_hub') },
    ],
  },

  day55_hub: {
    theme: 'winter',
    speaker: copy.day55_hub.speaker,
    nameplate: copy.day55_hub.nameplate,
    onEnter: dayEnter(55, 20),
    dialogues: copy.day55_hub.dialogues,
    choices: [
      { id: 'chris_day55', text: copy.day55_hub.choices.chris_day55.text, subtext: copy.day55_hub.choices.chris_day55.subtext, next: 'chris_event' },
      { id: 'explore_day55', text: copy.day55_hub.choices.explore_day55.text, subtext: copy.day55_hub.choices.explore_day55.subtext, next: 'explore_select', effects: queueNextHub('day60_hub') },
      { id: 'heat_day55', text: copy.day55_hub.choices.heat_day55.text, subtext: copy.day55_hub.choices.heat_day55.subtext, next: 'day60_hub', showIf: (state) => !state.flags.heated, requires: ({ ammo }) => ammo >= 10, disabledText: copy.day55_hub.choices.heat_day55.disabledText, effects: { ammo: -10, setFlags: { heated: true }, toast: '供暖完成：弹药 -10' } },
      { id: 'stay_day55', text: copy.day55_hub.choices.stay_day55.text, subtext: copy.day55_hub.choices.stay_day55.subtext, next: 'day60_hub', effects: { humanity: 5, toast: '你没让今天冒头：人性 +5' } },
    ],
  },

  chris_event: {
    theme: 'shelter',
    speaker: copy.chris_event.speaker,
    nameplate: copy.chris_event.nameplate,
    dialogues: copy.chris_event.dialogues,
    choices: [
      { id: 'chris_no', text: copy.chris_event.choices.chris_no.text, subtext: copy.chris_event.choices.chris_no.subtext, next: 'day60_hub', effects: { humanity: -5, setFlags: { hopeBarLocked: true }, toast: '你把克里斯打发走了：人性 -5' } },
      { id: 'chris_yes', text: copy.chris_event.choices.chris_yes.text, subtext: copy.chris_event.choices.chris_yes.subtext, next: 'chris_outcome', requires: ({ supplies }) => supplies >= 20, disabledText: copy.chris_event.choices.chris_yes.disabledText, effects: { supplies: -20, toast: '你把 20 物资递了出去' } },
    ],
  },

  chris_outcome: {
    theme: 'shelter',
    speaker: copy.chris_outcome.speaker,
    nameplate: copy.chris_outcome.nameplate,
    onEnter: { once: true, effects: chrisOutcomeEffects },
    dialogues: chrisOutcomeDialogues,
    choices: (state) => {
      if (!state.flags.hopeBarVisited || state.flags.serenaAlive) {
        return [{ id: 'chris_done', text: copy.chris_outcome.choices.chris_done.text, subtext: copy.chris_outcome.choices.chris_done.subtext, next: 'day60_hub' }]
      }
      return [
        {
          id: 'chris_confess',
          text: copy.chris_outcome.choices.chris_confess.text,
          subtext: copy.chris_outcome.choices.chris_confess.subtext,
          next: 'near_death',
          effects: nearDeath('day60_hub', copy.chris_outcome.choices.chris_confess.crisisText, copy.chris_outcome.choices.chris_confess.deathText),
        },
        { id: 'chris_silence', text: copy.chris_outcome.choices.chris_silence.text, subtext: copy.chris_outcome.choices.chris_silence.subtext, next: 'day60_hub', effects: { humanity: -30, addTag: 'good_person', toast: '你没说出口的事开始反噬你：人性 -30 / 获得词条' } },
      ]
    },
  },

  day60_hub: {
    theme: 'winter',
    speaker: copy.day60_hub.speaker,
    nameplate: copy.day60_hub.nameplate,
    onEnter: dayEnter(60, 20),
    dialogues: copy.day60_hub.dialogues,
    choices: [
      { id: 'stay_day60', text: copy.day60_hub.choices.stay_day60.text, subtext: copy.day60_hub.choices.stay_day60.subtext, next: 'day70_hub', effects: (state) => (hasCompanion(state, 'evelyn') ? { toast: '你在屋里整理装备，等着下一次出门' } : { humanity: -5, toast: '你一个人待在屋里开始发霉：人性 -5' }) },
      { id: 'explore_day60', text: copy.day60_hub.choices.explore_day60.text, subtext: copy.day60_hub.choices.explore_day60.subtext, next: 'explore_select', effects: queueNextHub('day70_hub') },
      { id: 'evelyn_heart', text: copy.day60_hub.choices.evelyn_heart.text, subtext: copy.day60_hub.choices.evelyn_heart.subtext, next: 'evelyn_heart', showIf: (state) => hasCompanion(state, 'evelyn') },
    ],
  },

  evelyn_heart: {
    theme: 'romance',
    speaker: copy.evelyn_heart.speaker,
    nameplate: copy.evelyn_heart.nameplate,
    dialogues: copy.evelyn_heart.dialogues,
    choices: [
      { id: 'heart_partner', text: copy.evelyn_heart.choices.heart_partner.text, subtext: copy.evelyn_heart.choices.heart_partner.subtext, next: 'day70_hub', effects: { supplies: 40, humanity: 20, addTag: 'partner', toast: '她松开了你的衣领：物资 +40 / 人性 +20 / 获得词条' } },
      { id: 'heart_tactic', text: copy.evelyn_heart.choices.heart_tactic.text, subtext: copy.evelyn_heart.choices.heart_tactic.subtext, next: 'day70_hub', effects: { supplies: 30, toast: '你们还是把设备带回了家：物资 +30' } },
    ],
  },

  day70_hub: {
    theme: 'camp',
    speaker: copy.day70_hub.speaker,
    nameplate: copy.day70_hub.nameplate,
    onEnter: dayEnter(70, 20),
    dialogues: copy.day70_hub.dialogues,
    choices: [
      { id: 'stay_day70', text: copy.day70_hub.choices.stay_day70.text, subtext: copy.day70_hub.choices.stay_day70.subtext, next: 'day75_hub', effects: { humanity: -5, toast: '你把那封信扔到了一边：人性 -5' } },
      { id: 'hero_day70', text: copy.day70_hub.choices.hero_day70.text, subtext: copy.day70_hub.choices.hero_day70.subtext, next: 'hero_camp' },
      { id: 'explore_day70', text: copy.day70_hub.choices.explore_day70.text, subtext: copy.day70_hub.choices.explore_day70.subtext, next: 'explore_select', effects: queueNextHub('day75_hub') },
    ],
  },

  hero_camp: {
    theme: 'camp',
    speaker: copy.hero_camp.speaker,
    nameplate: copy.hero_camp.nameplate,
    dialogues: copy.hero_camp.dialogues,
    deadlock: {
      sceneId: 'near_death',
      recoveryScene: 'day75_hub',
      crisisText: '你既拿不出买路钱，也没有足够的火力掀桌。卡尔的人围上来时，你只能拿身体去撞出一条缝。',
      deathText: '你没能走出那座大楼。所谓英雄营地，不过是另一种更干净的坟场。',
    },
    choices: [
      { id: 'hero_pay', text: copy.hero_camp.choices.hero_pay.text, subtext: copy.hero_camp.choices.hero_pay.subtext, next: 'day75_hub', requires: ({ supplies }) => supplies >= 10, disabledText: copy.hero_camp.choices.hero_pay.disabledText, effects: { supplies: -10, humanity: 10, toast: '你交钱离场：物资 -10 / 人性 +10' } },
      {
        id: 'hero_fight',
        text: copy.hero_camp.choices.hero_fight.text,
        subtext: copy.hero_camp.choices.hero_fight.subtext,
        next: 'day75_hub',
        requires: ({ ammo, supplies }) => ammo >= 5 && supplies >= 20,
        disabledText: copy.hero_camp.choices.hero_fight.disabledText,
        effects: { ammo: -5, supplies: -20, toast: '你们火拼失败，只能再交买命钱：弹药 -5 / 物资 -20' },
      },
      { id: 'hero_snipe', text: copy.hero_camp.choices.hero_snipe.text, subtext: copy.hero_camp.choices.hero_snipe.subtext, next: 'day75_hub', showIf: (state) => hasCompanion(state, 'evelyn'), requires: ({ ammo }) => ammo >= 15, disabledText: copy.hero_camp.choices.hero_snipe.disabledText, effects: { ammo: -5, supplies: 30, toast: '伊芙琳一枪带走卡尔：净弹药 -5 / 物资 +30' } },
      {
        id: 'hero_all_in',
        text: copy.hero_camp.choices.hero_all_in.text,
        subtext: copy.hero_camp.choices.hero_all_in.subtext,
        next: 'day75_hub',
        showIf: (state) => hasCompanion(state, 'evelyn') && hasCompanion(state, 'lime'),
        requires: ({ ammo }) => ammo >= 15,
        disabledText: copy.hero_camp.choices.hero_all_in.disabledText,
        effects: { ammo: 15, supplies: 60, toast: '你们把英雄营地彻底端掉了：净弹药 +15 / 物资 +60' },
      },
    ],
  },

  day75_hub: {
    theme: 'winter',
    speaker: copy.day75_hub.speaker,
    nameplate: copy.day75_hub.nameplate,
    onEnter: dayEnter(75, 20),
    dialogues: copy.day75_hub.dialogues,
    choices: [
      { id: 'stay_day75', text: copy.day75_hub.choices.stay_day75.text, subtext: copy.day75_hub.choices.stay_day75.subtext, next: 'day80_hub', effects: { humanity: 20, toast: '你让自己缓了最后一次：人性 +20' } },
      { id: 'market_day75', text: copy.day75_hub.choices.market_day75.text, subtext: copy.day75_hub.choices.market_day75.subtext, next: 'day80_hub', effects: { supplies: 60, toast: '你摸到了一处能养活上百人的仓库：物资 +60' } },
    ],
  },

  day80_hub: {
    theme: 'lab',
    speaker: copy.day80_hub.speaker,
    nameplate: copy.day80_hub.nameplate,
    onEnter: dayEnter(80, 20),
    dialogues: (state) => [
      copy.day80_hub.dialogues.intro,
      hasCompanion(state, 'evelyn') ? copy.day80_hub.dialogues.withEvelyn : copy.day80_hub.dialogues.alone,
    ],
    choices: [
      { id: 'save_john', text: copy.day80_hub.choices.save_john.text, subtext: copy.day80_hub.choices.save_john.subtext, next: (state) => (hasCompanion(state, 'evelyn') ? 'rescue_with_evelyn' : 'rescue_alone'), requires: ({ ammo }) => ammo >= 30, disabledText: copy.day80_hub.choices.save_john.disabledText, effects: { ammo: -30, toast: '你决定把 30 发弹药押给科研基地' } },
      {
        id: 'skip_john',
        text: copy.day80_hub.choices.skip_john.text,
        subtext: copy.day80_hub.choices.skip_john.subtext,
        next: 'lone_wolf_setup',
        effects: (state) => {
          if (hasCompanion(state, 'evelyn')) {
            state.companions = removeItem(state.companions, 'evelyn')
            addUnique(state.tags, 'selfish_coward')
            return { toast: '伊芙琳带着失望离开了你：失去伊芙琳 / 获得词条' }
          }
          return { toast: '你把整个人类的问题从自己肩上卸了下去' }
        },
      },
    ],
  },

  rescue_alone: {
    theme: 'lab',
    speaker: copy.rescue_alone.speaker,
    nameplate: copy.rescue_alone.nameplate,
    onEnter: { once: true, effects: { addCompanion: 'john', addTag: 'savior', toast: '你把约翰带回了庇护所：获得约翰 / 获得词条' } },
    dialogues: (state) => [
      copy.rescue_alone.dialogues.intro,
      hasTag(state, 'traverser') ? copy.rescue_alone.dialogues.traverser : copy.rescue_alone.dialogues.default,
    ],
    next: 'savior_city',
  },

  rescue_with_evelyn: {
    theme: 'lab',
    speaker: copy.rescue_with_evelyn.speaker,
    nameplate: copy.rescue_with_evelyn.nameplate,
    dialogues: copy.rescue_with_evelyn.dialogues,
    deadlock: {
      sceneId: 'death_end',
      deathText: '你扑向两人之间，却连最后的火力都不够。尸群合拢时，你谁也没能带出去。',
    },
    choices: (state) => {
      const choices = [
        { id: 'save_eve', text: copy.rescue_with_evelyn.choices.save_eve.text, subtext: copy.rescue_with_evelyn.choices.save_eve.subtext, next: 'rescue_choice', requires: ({ ammo }) => ammo >= 10, disabledText: copy.rescue_with_evelyn.choices.save_eve.disabledText, effects: { ammo: -10, toast: '你转身冲向伊芙琳：弹药 -10' } },
      ]
      if (!state.flags.promise) {
        choices.unshift({
          id: 'save_john_with_eve',
          text: copy.rescue_with_evelyn.choices.save_john_with_eve.text,
          subtext: copy.rescue_with_evelyn.choices.save_john_with_eve.subtext,
          next: 'savior_city',
          requires: ({ ammo }) => ammo >= 10,
          disabledText: copy.rescue_with_evelyn.choices.save_john_with_eve.disabledText,
          effects: (innerState) => {
            innerState.ammo -= 10
            innerState.companions = removeItem(innerState.companions, 'evelyn')
            addUnique(innerState.tags, 'evelyn')
            addUnique(innerState.tags, 'savior')
            addUnique(innerState.companions, 'john')
            return { toast: '你带走了约翰，伊芙琳留在了基地：弹药 -10 / 获得约翰 / 获得词条' }
          },
        })
      }
      return choices
    },
  },

  rescue_choice: {
    theme: 'romance',
    speaker: copy.rescue_choice.speaker,
    nameplate: copy.rescue_choice.nameplate,
    dialogues: copy.rescue_choice.dialogues,
    choices: [
      { id: 'adam_plain', text: copy.rescue_choice.choices.adam_plain.text, subtext: copy.rescue_choice.choices.adam_plain.subtext, next: 'adam_eve_85', effects: { humanity: 10, toast: '她眼里的怒气稍微退了一点：人性 +10' } },
      { id: 'adam_promise', text: copy.rescue_choice.choices.adam_promise.text, subtext: copy.rescue_choice.choices.adam_promise.subtext, next: 'adam_eve_85', showIf: (state) => state.flags.promise, effects: { humanity: 30, toast: '承诺兑现：人性 +30' } },
    ],
  },

  savior_city: {
    theme: 'ending',
    speaker: copy.savior_city.speaker,
    nameplate: copy.savior_city.nameplate,
    dialogues: (state) => [
      copy.savior_city.dialogues.intro,
      hasTag(state, 'traverser') ? copy.savior_city.dialogues.traverser : copy.savior_city.dialogues.default,
    ],
    choices: [
      { id: 'savior_villa', text: copy.savior_city.choices.savior_villa.text, subtext: copy.savior_city.choices.savior_villa.subtext, next: 'savior_final', showIf: isVilla, effects: { addTag: 'high_wall', toast: '你选择了高墙之内' } },
      { id: 'savior_bunker', text: copy.savior_city.choices.savior_bunker.text, subtext: copy.savior_city.choices.savior_bunker.subtext, next: 'savior_final', showIf: isBunker, effects: { addTag: 'underground_city', toast: '你选择了地底之城' } },
    ],
  },

  savior_final: {
    theme: 'ending',
    speaker: copy.savior_final.speaker,
    nameplate: copy.savior_final.nameplate,
    dialogues: (state) => (isVilla(state) ? copy.savior_final.dialogues.villa : copy.savior_final.dialogues.bunker),
    choices: restartChoices(),
  },

  lone_wolf_setup: {
    theme: 'ending',
    speaker: copy.lone_wolf_setup.speaker,
    nameplate: copy.lone_wolf_setup.nameplate,
    onEnter: { once: true, effects: { supplies: 10000, toast: '你把整座超市慢慢搬回了据点：物资 +10000' } },
    dialogues: copy.lone_wolf_setup.dialogues,
    next: 'lone_wolf_final',
  },

  lone_wolf_final: {
    theme: 'ending',
    speaker: copy.lone_wolf_final.speaker,
    nameplate: copy.lone_wolf_final.nameplate,
    onEnter: { once: true, effects: (state) => { addUnique(state.tags, isVilla(state) ? 'lonely_fortress' : 'underground_kingdom'); addUnique(state.tags, 'neo_death') } },
    dialogues: (state) => (isVilla(state) ? copy.lone_wolf_final.dialogues.villa : copy.lone_wolf_final.dialogues.bunker),
    choices: restartChoices(),
  },

  adam_eve_85: {
    theme: 'romance',
    speaker: copy.adam_eve_85.speaker,
    nameplate: copy.adam_eve_85.nameplate,
    onEnter: { once: true, effects: { supplies: 10000, toast: '你和伊芙琳把超市搬空回家：物资 +10000' } },
    dialogues: copy.adam_eve_85.dialogues,
    choices: [
      { id: 'adam_dinner', text: copy.adam_eve_85.choices.adam_dinner.text, subtext: copy.adam_eve_85.choices.adam_dinner.subtext, next: 'adam_eve_90', effects: { supplies: -50, toast: '你们浪费般地庆祝了一次：物资 -50' } },
      { id: 'adam_build', text: copy.adam_eve_85.choices.adam_build.text, subtext: copy.adam_eve_85.choices.adam_build.subtext, next: 'adam_eve_90', effects: { ammo: 20, toast: '你们换回了更多弹药和生活设备：弹药 +20' } },
    ],
  },

  adam_eve_90: {
    theme: 'romance',
    speaker: copy.adam_eve_90.speaker,
    nameplate: copy.adam_eve_90.nameplate,
    dialogues: copy.adam_eve_90.dialogues,
    choices: [
      { id: 'lover_yes', text: copy.adam_eve_90.choices.lover_yes.text, subtext: copy.adam_eve_90.choices.lover_yes.subtext, next: 'adam_eve_100', effects: { addTag: 'lovers', toast: '你们终于不再只叫彼此搭档' } },
      { id: 'lover_no', text: copy.adam_eve_90.choices.lover_no.text, subtext: copy.adam_eve_90.choices.lover_no.subtext, next: 'adam_eve_100', effects: { addTag: 'survival_rule', toast: '你把关系按回了理性那一边' } },
    ],
  },

  adam_eve_100: {
    theme: 'ending',
    speaker: copy.adam_eve_100.speaker,
    nameplate: copy.adam_eve_100.nameplate,
    onEnter: { once: true, effects: (state) => { if (hasTag(state, 'lovers')) addUnique(state.tags, 'true_savior'); else addUnique(state.tags, 'neo_and_neo') } },
    dialogues: (state) => (hasTag(state, 'lovers') ? copy.adam_eve_100.dialogues.lovers : copy.adam_eve_100.dialogues.default),
    choices: restartChoices(),
  },

  near_death: {
    theme: 'ending',
    speaker: copy.near_death.speaker,
    nameplate: copy.near_death.nameplate,
    dialogues: (state) => [state.flags.crisisText || copy.near_death.dialogues.default],
    choices: [
      {
        id: 'pay_30',
        text: copy.near_death.choices.pay_30.text,
        subtext: copy.near_death.choices.pay_30.subtext,
        next: (state) => state.flags.recoveryScene || state.flags.nextHub || 'day2_hub',
        requires: ({ supplies }) => supplies >= 30,
        disabledText: copy.near_death.choices.pay_30.disabledText,
        effects: (state) => {
          state.supplies -= 30
          state.flags.crisisText = ''
          state.flags.deathText = ''
          state.flags.recoveryScene = ''
          return { toast: '你用 30 物资把自己拖过了今天' }
        },
      },
      { id: 'accept_death', text: copy.near_death.choices.accept_death.text, subtext: copy.near_death.choices.accept_death.subtext, next: 'death_end' },
    ],
  },

  death_end: {
    theme: 'ending',
    speaker: copy.death_end.speaker,
    nameplate: copy.death_end.nameplate,
    dialogues: (state) => [state.flags.deathText || copy.death_end.dialogues.default],
    choices: restartChoices(),
  },
}
