import { addUnique, gotoQueuedHub, normalExploreChoices } from './shared.js'
import { explorationCopy as copy } from './content-exploration.js'

export const scenesExploration = {
  explore_select: {
    theme: 'road',
    speaker: copy.explore_select.speaker,
    nameplate: copy.explore_select.nameplate,
    dialogues: copy.explore_select.dialogues,
    choices: normalExploreChoices,
  },

  explore_fifth_avenue: {
    theme: 'road',
    speaker: copy.explore_fifth_avenue.speaker,
    nameplate: copy.explore_fifth_avenue.nameplate,
    dialogues: copy.explore_fifth_avenue.dialogues,
    choices: [
      {
        id: 'fifth_help',
        text: copy.explore_fifth_avenue.choices.fifth_help.text,
        subtext: copy.explore_fifth_avenue.choices.fifth_help.subtext,
        next: 'explore_fifth_avenue_after',
        effects: (state) => {
          state.flags.fifthDirty = false
          return { supplies: 30, humanity: 10, toast: '你把司机和货一起拖回了据点：物资 +30 / 人性 +10' }
        },
      },
      {
        id: 'fifth_drop',
        text: copy.explore_fifth_avenue.choices.fifth_drop.text,
        subtext: copy.explore_fifth_avenue.choices.fifth_drop.subtext,
        next: 'explore_fifth_avenue_after',
        effects: (state) => {
          state.flags.fifthDirty = true
          return { supplies: 30, humanity: -10, toast: '你只把货带了回来：物资 +30 / 人性 -10' }
        },
      },
    ],
  },

  explore_fifth_avenue_after: {
    theme: 'road',
    speaker: copy.explore_fifth_avenue_after.speaker,
    nameplate: copy.explore_fifth_avenue_after.nameplate,
    dialogues: copy.explore_fifth_avenue_after.dialogues,
    choices: [
      {
        id: 'fifth_keep',
        text: copy.explore_fifth_avenue_after.choices.fifth_keep.text,
        subtext: copy.explore_fifth_avenue_after.choices.fifth_keep.subtext,
        next: gotoQueuedHub,
        effects: (state) => {
          state.humanity -= 30
          state.events.fifthAvenueResolved = true
          addUnique(state.tags, 'bottom_line')
          if (state.flags.fifthDirty) state.flags.campBlacklisted = true
          return { toast: '你把那批东西封进了冷库：人性 -30 / 获得词条' }
        },
      },
      {
        id: 'fifth_bury',
        text: copy.explore_fifth_avenue_after.choices.fifth_bury.text,
        subtext: copy.explore_fifth_avenue_after.choices.fifth_bury.subtext,
        next: gotoQueuedHub,
        effects: { supplies: -30, humanity: 15, addTag: 'gravestone', setEvents: { fifthAvenueResolved: true }, toast: '你把那批东西埋了：物资 -30 / 人性 +15 / 获得词条' },
      },
    ],
  },

  explore_church: {
    theme: 'street',
    speaker: copy.explore_church.speaker,
    nameplate: copy.explore_church.nameplate,
    dialogues: copy.explore_church.dialogues,
    choices: [
      {
        id: 'church_treat',
        text: copy.explore_church.choices.church_treat.text,
        subtext: copy.explore_church.choices.church_treat.subtext,
        next: gotoQueuedHub,
        requires: ({ supplies }) => supplies >= 10,
        disabledText: copy.explore_church.choices.church_treat.disabledText,
        effects: { supplies: -10, ammo: -1, humanity: 20, addTag: 'prophecy', setEvents: { churchResolved: true }, toast: '神父只留下一句像预言的话：物资 -10 / 弹药 -1 / 人性 +20 / 获得词条' },
      },
      {
        id: 'church_end',
        text: copy.explore_church.choices.church_end.text,
        subtext: copy.explore_church.choices.church_end.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_church.choices.church_end.disabledText,
        effects: { ammo: 9, supplies: 20, setEvents: { churchResolved: true }, toast: '神父把藏物资的位置告诉了你：净弹药 +9 / 物资 +20' },
      },
      {
        id: 'church_convert',
        text: copy.explore_church.choices.church_convert.text,
        subtext: copy.explore_church.choices.church_convert.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_church.choices.church_convert.disabledText,
        effects: { ammo: -1, humanity: -20, addTag: 'bottom_line', setEvents: { churchResolved: true }, toast: '你只剩下对物资的渴望：弹药 -1 / 人性 -20 / 获得词条' },
      },
    ],
  },

  explore_hope_bar: {
    theme: 'street',
    speaker: copy.explore_hope_bar.speaker,
    nameplate: copy.explore_hope_bar.nameplate,
    dialogues: copy.explore_hope_bar.dialogues,
    choices: [
      {
        id: 'bar_take_all',
        text: copy.explore_hope_bar.choices.bar_take_all.text,
        subtext: copy.explore_hope_bar.choices.bar_take_all.subtext,
        next: gotoQueuedHub,
        effects: { setFlags: { hopeBarVisited: true }, setEvents: { hopeBarResolved: true }, toast: '她在你离开后打开了音响引尸潮，什么都没给你剩下' },
      },
      {
        id: 'bar_take_half',
        text: copy.explore_hope_bar.choices.bar_take_half.text,
        subtext: copy.explore_hope_bar.choices.bar_take_half.subtext,
        next: 'explore_hope_bar_after',
        effects: { supplies: 20, setFlags: { hopeBarVisited: true, serenaAlive: true }, toast: '你只拿走了一半：物资 +20' },
      },
      {
        id: 'bar_leave',
        text: copy.explore_hope_bar.choices.bar_leave.text,
        subtext: copy.explore_hope_bar.choices.bar_leave.subtext,
        next: gotoQueuedHub,
        effects: { ammo: 10, humanity: 15, setFlags: { hopeBarVisited: true, serenaAlive: true, serenaUntouched: true }, setEvents: { hopeBarResolved: true }, toast: '瑟琳娜把子弹都送给了你：弹药 +10 / 人性 +15' },
      },
    ],
  },

  explore_hope_bar_after: {
    theme: 'street',
    speaker: copy.explore_hope_bar_after.speaker,
    nameplate: copy.explore_hope_bar_after.nameplate,
    dialogues: copy.explore_hope_bar_after.dialogues,
    choices: [
      {
        id: 'bar_leave_now',
        text: copy.explore_hope_bar_after.choices.bar_leave_now.text,
        subtext: copy.explore_hope_bar_after.choices.bar_leave_now.subtext,
        next: gotoQueuedHub,
        effects: { humanity: -5, setEvents: { hopeBarResolved: true }, toast: '你没再回头：人性 -5' },
      },
      {
        id: 'bar_invite',
        text: copy.explore_hope_bar_after.choices.bar_invite.text,
        subtext: copy.explore_hope_bar_after.choices.bar_invite.subtext,
        next: gotoQueuedHub,
        effects: { humanity: 10, addTag: 'last_light', setFlags: { serenaInvited: true }, setEvents: { hopeBarResolved: true }, toast: '她拒绝了你，但那点光还没灭：人性 +10 / 获得词条' },
      },
    ],
  },

  explore_convenience: {
    theme: 'street',
    speaker: copy.explore_convenience.speaker,
    nameplate: copy.explore_convenience.nameplate,
    dialogues: copy.explore_convenience.dialogues,
    choices: [
      {
        id: 'shop_watch',
        text: copy.explore_convenience.choices.shop_watch.text,
        subtext: copy.explore_convenience.choices.shop_watch.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 20, humanity: -20, setEvents: { convenienceResolved: true }, toast: '你等尸群散去后捡走了背包：物资 +20 / 人性 -20' },
      },
      {
        id: 'shop_help',
        text: copy.explore_convenience.choices.shop_help.text,
        subtext: copy.explore_convenience.choices.shop_help.subtext,
        next: 'explore_convenience_after',
        requires: ({ ammo }) => ammo >= 5,
        disabledText: copy.explore_convenience.choices.shop_help.disabledText,
        effects: { ammo: -5, toast: '你帮他打穿了包围圈：弹药 -5' },
      },
    ],
  },

  explore_convenience_after: {
    theme: 'street',
    speaker: copy.explore_convenience_after.speaker,
    nameplate: copy.explore_convenience_after.nameplate,
    dialogues: copy.explore_convenience_after.dialogues,
    choices: [
      {
        id: 'shop_threaten',
        text: copy.explore_convenience_after.choices.shop_threaten.text,
        subtext: copy.explore_convenience_after.choices.shop_threaten.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 30, humanity: -10, setEvents: { convenienceResolved: true }, toast: '你把获救这件事也转成了收益：物资 +30 / 人性 -10' },
      },
      {
        id: 'shop_drive',
        text: copy.explore_convenience_after.choices.shop_drive.text,
        subtext: copy.explore_convenience_after.choices.shop_drive.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 20, humanity: 10, setEvents: { convenienceResolved: true }, toast: '他把包里一部分物资分给了你：物资 +20 / 人性 +10' },
      },
      {
        id: 'shop_convert',
        text: copy.explore_convenience_after.choices.shop_convert.text,
        subtext: copy.explore_convenience_after.choices.shop_convert.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_convenience_after.choices.shop_convert.disabledText,
        effects: { ammo: -1, supplies: 50, humanity: -30, addTag: 'bottom_line', setEvents: { convenienceResolved: true }, toast: '你连救下的人也一起装进了库存：弹药 -1 / 物资 +50 / 人性 -30 / 获得词条' },
      },
    ],
  },
}
