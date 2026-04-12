import { gotoQueuedHub, nearDeath } from './shared.js'
import { explorationExtraCopy as copy } from './content-exploration-extra.js'

export const scenesExplorationExtra = {
  explore_canning_factory: {
    theme: 'road',
    speaker: copy.explore_canning_factory.speaker,
    nameplate: copy.explore_canning_factory.nameplate,
    dialogues: copy.explore_canning_factory.dialogues,
    choices: [
      {
        id: 'factory_force',
        text: copy.explore_canning_factory.choices.factory_force.text,
        subtext: copy.explore_canning_factory.choices.factory_force.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 2,
        disabledText: copy.explore_canning_factory.choices.factory_force.disabledText,
        effects: { ammo: -2, supplies: 30, humanity: -20, setEvents: { canningFactoryResolved: true }, toast: '你带走了整座工厂的罐头：弹药 -2 / 物资 +30 / 人性 -20' },
      },
      {
        id: 'factory_lie',
        text: copy.explore_canning_factory.choices.factory_lie.text,
        subtext: copy.explore_canning_factory.choices.factory_lie.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_canning_factory.choices.factory_lie.disabledText,
        effects: { ammo: -1, supplies: 30, humanity: -5, addTag: 'hope_thief', setEvents: { canningFactoryResolved: true }, toast: '你带着罐头离开了工厂：弹药 -1 / 物资 +30 / 人性 -5 / 获得词条' },
      },
      {
        id: 'factory_help',
        text: copy.explore_canning_factory.choices.factory_help.text,
        subtext: copy.explore_canning_factory.choices.factory_help.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 20, humanity: 20, addTag: 'deathless_love', setEvents: { canningFactoryResolved: true }, toast: '男人把一部分罐头送给了你：物资 +20 / 人性 +20 / 获得词条' },
      },
    ],
  },

  explore_farmhouse: {
    theme: 'road',
    speaker: copy.explore_farmhouse.speaker,
    nameplate: copy.explore_farmhouse.nameplate,
    dialogues: copy.explore_farmhouse.dialogues,
    choices: [
      {
        id: 'farm_loot',
        text: copy.explore_farmhouse.choices.farm_loot.text,
        subtext: copy.explore_farmhouse.choices.farm_loot.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 15, humanity: -15, setEvents: { farmhouseResolved: true }, toast: '你清空了他们的冰箱：物资 +15 / 人性 -15' },
      },
      {
        id: 'farm_dinner',
        text: copy.explore_farmhouse.choices.farm_dinner.text,
        subtext: copy.explore_farmhouse.choices.farm_dinner.subtext,
        next: 'near_death',
        effects: [
          { addTag: 'last_supper', setEvents: { farmhouseResolved: true } },
          nearDeath('', copy.explore_farmhouse.choices.farm_dinner.crisisText, copy.explore_farmhouse.choices.farm_dinner.deathText),
        ],
      },
    ],
  },

  explore_street_infant: {
    theme: 'road',
    speaker: copy.explore_street_infant.speaker,
    nameplate: copy.explore_street_infant.nameplate,
    dialogues: copy.explore_street_infant.dialogues,
    choices: [
      {
        id: 'street_adopt',
        text: copy.explore_street_infant.choices.street_adopt.text,
        subtext: copy.explore_street_infant.choices.street_adopt.subtext,
        next: 'explore_street_route',
        effects: { humanity: 20, addCompanion: 'infant', addTag: 'infant', toast: '你把婴儿带回了车上：人性 +20 / 获得伙伴 / 获得词条' },
      },
      {
        id: 'street_leave_baby',
        text: copy.explore_street_infant.choices.street_leave_baby.text,
        subtext: copy.explore_street_infant.choices.street_leave_baby.subtext,
        next: 'explore_street_route',
        effects: { humanity: -10, toast: '你把孩子留在了街角：人性 -10' },
      },
    ],
  },

  explore_street_route: {
    theme: 'road',
    speaker: copy.explore_street_route.speaker,
    nameplate: copy.explore_street_route.nameplate,
    dialogues: copy.explore_street_route.dialogues,
    choices: [
      {
        id: 'street_fast_food',
        text: copy.explore_street_route.choices.street_fast_food.text,
        subtext: copy.explore_street_route.choices.street_fast_food.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 5,
        disabledText: copy.explore_street_route.choices.street_fast_food.disabledText,
        effects: { ammo: -5, supplies: 20, setEvents: { commercialStreetResolved: true }, toast: '你拖回了一批土豆和补给：弹药 -5 / 物资 +20' },
      },
      {
        id: 'street_ktv',
        text: copy.explore_street_route.choices.street_ktv.text,
        subtext: copy.explore_street_route.choices.street_ktv.subtext,
        next: gotoQueuedHub,
        effects: { ammo: 5, setEvents: { commercialStreetResolved: true }, toast: '你在尸体边摸到一把手枪和子弹：弹药 +5' },
      },
    ],
  },

  explore_kindergarten: {
    theme: 'road',
    speaker: copy.explore_kindergarten.speaker,
    nameplate: copy.explore_kindergarten.nameplate,
    dialogues: copy.explore_kindergarten.dialogues,
    choices: [
      {
        id: 'kindergarten_hospital',
        text: copy.explore_kindergarten.choices.kindergarten_hospital.text,
        subtext: copy.explore_kindergarten.choices.kindergarten_hospital.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_kindergarten.choices.kindergarten_hospital.disabledText,
        effects: { ammo: -1, supplies: 20, humanity: 10, setEvents: { kindergartenResolved: true }, toast: '你带着孩子们撤了出来：弹药 -1 / 物资 +20 / 人性 +10' },
      },
      {
        id: 'kindergarten_school',
        text: copy.explore_kindergarten.choices.kindergarten_school.text,
        subtext: copy.explore_kindergarten.choices.kindergarten_school.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_kindergarten.choices.kindergarten_school.disabledText,
        effects: { ammo: -1, supplies: 30, humanity: 10, setEvents: { kindergartenResolved: true }, toast: '医护人员给了你药品和补给：弹药 -1 / 物资 +30 / 人性 +10' },
      },
      {
        id: 'kindergarten_self',
        text: copy.explore_kindergarten.choices.kindergarten_self.text,
        subtext: copy.explore_kindergarten.choices.kindergarten_self.subtext,
        next: 'near_death',
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_kindergarten.choices.kindergarten_self.disabledText,
        effects: [
          { ammo: -1, humanity: 50, addTag: 'martyr', setEvents: { kindergartenResolved: true } },
          nearDeath('', copy.explore_kindergarten.choices.kindergarten_self.crisisText, copy.explore_kindergarten.choices.kindergarten_self.deathText),
        ],
      },
      {
        id: 'kindergarten_leave',
        text: copy.explore_kindergarten.choices.kindergarten_leave.text,
        subtext: copy.explore_kindergarten.choices.kindergarten_leave.subtext,
        next: gotoQueuedHub,
        effects: { humanity: -20, setEvents: { kindergartenResolved: true }, toast: '你把两边都留给了命运：人性 -20' },
      },
    ],
  },

  explore_hospital: {
    theme: 'road',
    speaker: copy.explore_hospital.speaker,
    nameplate: copy.explore_hospital.nameplate,
    onEnter: { once: true, effects: { supplies: 30, toast: '你在药局找到一批抗生素：物资 +30' } },
    dialogues: copy.explore_hospital.dialogues,
    deadlock: {
      sceneId: gotoQueuedHub,
      effects: {
        humanity: -10,
        setEvents: { hospitalResolved: true },
        toast: '你既拿不出食物，也没有开枪的余地，只能从医院退走：人性 -10',
      },
    },
    choices: [
      {
        id: 'hospital_share_food',
        text: copy.explore_hospital.choices.hospital_share_food.text,
        subtext: copy.explore_hospital.choices.hospital_share_food.subtext,
        next: 'explore_hospital_mother',
        requires: ({ supplies }) => supplies >= 5,
        disabledText: copy.explore_hospital.choices.hospital_share_food.disabledText,
        effects: { supplies: -5, toast: '你把背包里的食物分了出去：物资 -5' },
      },
      {
        id: 'hospital_kill',
        text: copy.explore_hospital.choices.hospital_kill.text,
        subtext: copy.explore_hospital.choices.hospital_kill.subtext,
        next: 'explore_hospital_aftermath',
        requires: ({ ammo }) => ammo >= 2,
        disabledText: copy.explore_hospital.choices.hospital_kill.disabledText,
        effects: { ammo: -2, humanity: -20, toast: '你为了自保开了枪：弹药 -2 / 人性 -20' },
      },
    ],
  },

  explore_hospital_mother: {
    theme: 'street',
    speaker: copy.explore_hospital_mother.speaker,
    nameplate: copy.explore_hospital_mother.nameplate,
    dialogues: copy.explore_hospital_mother.dialogues,
    choices: [
      {
        id: 'hospital_forgive',
        text: copy.explore_hospital_mother.choices.hospital_forgive.text,
        subtext: copy.explore_hospital_mother.choices.hospital_forgive.subtext,
        next: gotoQueuedHub,
        effects: { supplies: -15, ammo: 10, humanity: 20, addTag: 'forgiveness_light', setEvents: { hospitalResolved: true }, toast: '女人把剩下的子弹都塞给了你：物资 -15 / 弹药 +10 / 人性 +20 / 获得词条' },
      },
      {
        id: 'hospital_bait',
        text: copy.explore_hospital_mother.choices.hospital_bait.text,
        subtext: copy.explore_hospital_mother.choices.hospital_bait.subtext,
        next: gotoQueuedHub,
        effects: { humanity: -20, setEvents: { hospitalResolved: true }, toast: '门外的尸群很久才散去：人性 -20' },
      },
    ],
  },

  explore_hospital_aftermath: {
    theme: 'street',
    speaker: copy.explore_hospital_aftermath.speaker,
    nameplate: copy.explore_hospital_aftermath.nameplate,
    dialogues: copy.explore_hospital_aftermath.dialogues,
    choices: [
      {
        id: 'hospital_bury',
        text: copy.explore_hospital_aftermath.choices.hospital_bury.text,
        subtext: copy.explore_hospital_aftermath.choices.hospital_bury.subtext,
        next: gotoQueuedHub,
        effects: { humanity: 5, setEvents: { hospitalResolved: true }, toast: '你在医院后面挖了个浅坑：人性 +5' },
      },
      {
        id: 'hospital_ignore',
        text: copy.explore_hospital_aftermath.choices.hospital_ignore.text,
        subtext: copy.explore_hospital_aftermath.choices.hospital_ignore.subtext,
        next: gotoQueuedHub,
        effects: { humanity: -10, setEvents: { hospitalResolved: true }, toast: '你转身离开了医院：人性 -10' },
      },
      {
        id: 'hospital_convert',
        text: copy.explore_hospital_aftermath.choices.hospital_convert.text,
        subtext: copy.explore_hospital_aftermath.choices.hospital_convert.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 30, humanity: -30, addTag: 'bottom_line', setEvents: { hospitalResolved: true }, toast: '你把尸体也算进了库存：物资 +30 / 人性 -30 / 获得词条' },
      },
    ],
  },

  explore_evelyn_inn: {
    theme: 'romance',
    speaker: copy.explore_evelyn_inn.speaker,
    nameplate: copy.explore_evelyn_inn.nameplate,
    dialogues: copy.explore_evelyn_inn.dialogues,
    choices: [
      {
        id: 'inn_protect',
        text: copy.explore_evelyn_inn.choices.inn_protect.text,
        subtext: copy.explore_evelyn_inn.choices.inn_protect.subtext,
        next: 'explore_evelyn_inn_after',
        requires: ({ ammo }) => ammo >= 5,
        disabledText: copy.explore_evelyn_inn.choices.inn_protect.disabledText,
        effects: { ammo: -5, toast: '你和伊芙琳压住了店主的枪线：弹药 -5' },
      },
      {
        id: 'inn_leave',
        text: copy.explore_evelyn_inn.choices.inn_leave.text,
        subtext: copy.explore_evelyn_inn.choices.inn_leave.subtext,
        next: 'near_death',
        effects: [
          { setEvents: { evelynInnResolved: true } },
          nearDeath('', copy.explore_evelyn_inn.choices.inn_leave.crisisText, copy.explore_evelyn_inn.choices.inn_leave.deathText),
        ],
      },
    ],
  },

  explore_evelyn_inn_after: {
    theme: 'romance',
    speaker: copy.explore_evelyn_inn_after.speaker,
    nameplate: copy.explore_evelyn_inn_after.nameplate,
    dialogues: copy.explore_evelyn_inn_after.dialogues,
    choices: [
      {
        id: 'inn_execute',
        text: copy.explore_evelyn_inn_after.choices.inn_execute.text,
        subtext: copy.explore_evelyn_inn_after.choices.inn_execute.subtext,
        next: 'explore_evelyn_inn_rescue',
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_evelyn_inn_after.choices.inn_execute.disabledText,
        effects: { ammo: -1, toast: '你朝他补了一枪：弹药 -1' },
      },
      {
        id: 'inn_take_all',
        text: copy.explore_evelyn_inn_after.choices.inn_take_all.text,
        subtext: copy.explore_evelyn_inn_after.choices.inn_take_all.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_evelyn_inn_after.choices.inn_take_all.disabledText,
        effects: { ammo: -1, supplies: 50, humanity: -50, removeCompanion: 'evelyn', addTag: 'greater_demon', setEvents: { evelynInnResolved: true }, toast: '伊芙琳看着你把一切都装上车：弹药 -1 / 物资 +50 / 人性 -50 / 失去伊芙琳 / 获得词条' },
      },
    ],
  },

  explore_evelyn_inn_rescue: {
    theme: 'romance',
    speaker: copy.explore_evelyn_inn_rescue.speaker,
    nameplate: copy.explore_evelyn_inn_rescue.nameplate,
    dialogues: copy.explore_evelyn_inn_rescue.dialogues,
    choices: [
      {
        id: 'inn_free',
        text: copy.explore_evelyn_inn_rescue.choices.inn_free.text,
        subtext: copy.explore_evelyn_inn_rescue.choices.inn_free.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 10, ammo: 10, humanity: 20, addTag: 'hunter', setEvents: { evelynInnResolved: true }, toast: '伊芙琳在仓库里翻出酒和弹药：物资 +10 / 弹药 +10 / 人性 +20 / 获得词条' },
      },
      {
        id: 'inn_convert',
        text: copy.explore_evelyn_inn_rescue.choices.inn_convert.text,
        subtext: copy.explore_evelyn_inn_rescue.choices.inn_convert.subtext,
        next: gotoQueuedHub,
        effects: { supplies: 40, humanity: -30, removeCompanion: 'evelyn', addTag: 'bottom_line', setEvents: { evelynInnResolved: true }, toast: '伊芙琳当场和你分道扬镳：物资 +40 / 人性 -30 / 失去伊芙琳 / 获得词条' },
      },
    ],
  },

  explore_evelyn_library: {
    theme: 'romance',
    speaker: copy.explore_evelyn_library.speaker,
    nameplate: copy.explore_evelyn_library.nameplate,
    dialogues: copy.explore_evelyn_library.dialogues,
    choices: [
      {
        id: 'library_accept',
        text: copy.explore_evelyn_library.choices.library_accept.text,
        subtext: copy.explore_evelyn_library.choices.library_accept.subtext,
        next: 'explore_evelyn_library_after',
        effects: { ammo: 5, toast: '那位母亲先塞给了你 5 发子弹' },
      },
      {
        id: 'library_scam',
        text: copy.explore_evelyn_library.choices.library_scam.text,
        subtext: copy.explore_evelyn_library.choices.library_scam.subtext,
        next: gotoQueuedHub,
        effects: { ammo: 5, humanity: -15, removeCompanion: 'evelyn', addTag: 'hope_thief', setEvents: { evelynLibraryResolved: true }, toast: '伊芙琳无法接受这件事：弹药 +5 / 人性 -15 / 失去伊芙琳 / 获得词条' },
      },
    ],
  },

  explore_evelyn_library_after: {
    theme: 'romance',
    speaker: copy.explore_evelyn_library_after.speaker,
    nameplate: copy.explore_evelyn_library_after.nameplate,
    onEnter: { once: true, effects: { ammo: -5, toast: '你和伊芙琳打穿了图书馆入口：弹药 -5' } },
    dialogues: copy.explore_evelyn_library_after.dialogues,
    choices: [
      {
        id: 'library_disguise',
        text: copy.explore_evelyn_library_after.choices.library_disguise.text,
        subtext: copy.explore_evelyn_library_after.choices.library_disguise.subtext,
        next: gotoQueuedHub,
        effects: { ammo: 10, humanity: -20, addTag: 'blood_reward', setEvents: { evelynLibraryResolved: true }, toast: '你把那袋弹药拿到了手：弹药 +10 / 人性 -20 / 获得词条' },
      },
      {
        id: 'library_end_child',
        text: copy.explore_evelyn_library_after.choices.library_end_child.text,
        subtext: copy.explore_evelyn_library_after.choices.library_end_child.subtext,
        next: 'explore_evelyn_library_mother',
        requires: ({ ammo }) => ammo >= 1,
        disabledText: copy.explore_evelyn_library_after.choices.library_end_child.disabledText,
        effects: { ammo: -1, humanity: 5, toast: '你替孩子把这一步做完了：弹药 -1 / 人性 +5' },
      },
    ],
  },

  explore_evelyn_library_mother: {
    theme: 'romance',
    speaker: copy.explore_evelyn_library_mother.speaker,
    nameplate: copy.explore_evelyn_library_mother.nameplate,
    dialogues: copy.explore_evelyn_library_mother.dialogues,
    choices: [
      {
        id: 'library_rescue_mother',
        text: copy.explore_evelyn_library_mother.choices.library_rescue_mother.text,
        subtext: copy.explore_evelyn_library_mother.choices.library_rescue_mother.subtext,
        next: gotoQueuedHub,
        requires: ({ ammo }) => ammo >= 5,
        disabledText: copy.explore_evelyn_library_mother.choices.library_rescue_mother.disabledText,
        effects: { ammo: 10, humanity: 10, setEvents: { evelynLibraryResolved: true }, toast: '你们把她拖出来后亲手送了她最后一程：弹药 +10 / 人性 +10' },
      },
      {
        id: 'library_leave_mother',
        text: copy.explore_evelyn_library_mother.choices.library_leave_mother.text,
        subtext: copy.explore_evelyn_library_mother.choices.library_leave_mother.subtext,
        next: gotoQueuedHub,
        effects: { humanity: -5, setEvents: { evelynLibraryResolved: true }, toast: '你和伊芙琳沉默着离开了街口：人性 -5' },
      },
    ],
  },
}
