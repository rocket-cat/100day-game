import { dayEnter, queueNextHub } from './shared.js'
import { prologueCopy as copy } from './content-prologue.js'

export const scenesPrologue = {
  intro_rebirth: {
    theme: 'prelude',
    speaker: copy.intro_rebirth.speaker,
    nameplate: copy.intro_rebirth.nameplate,
    dialogues: copy.intro_rebirth.dialogues,
    next: 'pick_shelter',
  },

  pick_shelter: {
    theme: 'prelude',
    speaker: copy.pick_shelter.speaker,
    nameplate: copy.pick_shelter.nameplate,
    dialogues: copy.pick_shelter.dialogues,
    choices: [
      {
        id: 'villa',
        text: copy.pick_shelter.choices.villa.text,
        subtext: copy.pick_shelter.choices.villa.subtext,
        next: 'pick_supply',
        effects: { shelter: '山中别墅', supplies: 50, ammo: 5, toast: '山中别墅入手：物资 +50 / 弹药 +5' },
      },
      {
        id: 'bunker',
        text: copy.pick_shelter.choices.bunker.text,
        subtext: copy.pick_shelter.choices.bunker.subtext,
        next: 'pick_supply',
        effects: { shelter: '城郊防空洞', supplies: 40, ammo: 10, toast: '防空洞入手：物资 +40 / 弹药 +10' },
      },
    ],
  },

  pick_supply: {
    theme: 'shelter',
    speaker: copy.pick_supply.speaker,
    nameplate: copy.pick_supply.nameplate,
    dialogues: copy.pick_supply.dialogues,
    choices: [
      { id: 'food', text: copy.pick_supply.choices.food.text, subtext: copy.pick_supply.choices.food.subtext, next: 'dog_event', effects: { supplies: 70, toast: '补足食物：物资 +70' } },
      { id: 'meds', text: copy.pick_supply.choices.meds.text, subtext: copy.pick_supply.choices.meds.subtext, next: 'dog_event', effects: { supplies: 40, humanity: 5, toast: '补足药品：物资 +40 / 人性 +5' } },
      { id: 'guns', text: copy.pick_supply.choices.guns.text, subtext: copy.pick_supply.choices.guns.subtext, next: 'dog_event', effects: { ammo: 5, toast: '黑市补枪：弹药 +5' } },
    ],
  },

  dog_event: {
    theme: 'street',
    speaker: copy.dog_event.speaker,
    nameplate: copy.dog_event.nameplate,
    dialogues: copy.dog_event.dialogues,
    choices: [
      {
        id: 'save_dog',
        text: copy.dog_event.choices.save_dog.text,
        subtext: copy.dog_event.choices.save_dog.subtext,
        next: 'choose_creed',
        requires: ({ ammo }) => ammo >= 3,
        disabledText: copy.dog_event.choices.save_dog.disabledText,
        effects: { ammo: -3, humanity: 10, addCompanion: 'lime', toast: '救下莱姆：弹药 -3 / 人性 +10 / 伙伴加入' },
      },
      { id: 'ignore_dog', text: copy.dog_event.choices.ignore_dog.text, subtext: copy.dog_event.choices.ignore_dog.subtext, next: 'choose_creed', effects: { humanity: -5, toast: '人性 -5' } },
      { id: 'eat_dog', text: copy.dog_event.choices.eat_dog.text, subtext: copy.dog_event.choices.eat_dog.subtext, next: 'choose_creed', effects: { supplies: 10, humanity: -30, toast: '物资 +10 / 人性 -30' } },
    ],
  },

  choose_creed: {
    theme: 'shelter',
    speaker: copy.choose_creed.speaker,
    nameplate: copy.choose_creed.nameplate,
    dialogues: copy.choose_creed.dialogues,
    choices: [
      { id: 'live', text: copy.choose_creed.choices.live.text, subtext: copy.choose_creed.choices.live.subtext, next: 'day2_hub', effects: { humanity: -10, toast: '人性 -10' } },
      { id: 'human', text: copy.choose_creed.choices.human.text, subtext: copy.choose_creed.choices.human.subtext, next: 'day2_hub', effects: { humanity: 10, toast: '人性 +10' } },
      { id: 'truth', text: copy.choose_creed.choices.truth.text, subtext: copy.choose_creed.choices.truth.subtext, next: 'day2_hub', effects: { setFlags: { truthSeeker: true }, toast: '你决定追查真相' } },
    ],
  },

  day2_hub: {
    theme: 'shelter',
    speaker: copy.day2_hub.speaker,
    nameplate: copy.day2_hub.nameplate,
    onEnter: dayEnter(2, 5),
    dialogues: copy.day2_hub.dialogues,
    choices: [
      { id: 'stay_day2', text: copy.day2_hub.choices.stay_day2.text, subtext: copy.day2_hub.choices.stay_day2.subtext, next: 'day4_hub', effects: { humanity: 5, toast: '你在屋里苟过了今天：人性 +5' } },
      {
        id: 'clear_day2',
        text: copy.day2_hub.choices.clear_day2.text,
        subtext: copy.day2_hub.choices.clear_day2.subtext,
        next: 'day4_hub',
        requires: ({ ammo }) => ammo >= 5,
        disabledText: copy.day2_hub.choices.clear_day2.disabledText,
        effects: { ammo: -5, setFlags: { radio: true }, toast: '你从尸体上摸到一台收音机：弹药 -5' },
      },
      { id: 'explore_day2', text: copy.day2_hub.choices.explore_day2.text, subtext: copy.day2_hub.choices.explore_day2.subtext, next: 'explore_select', effects: queueNextHub('day4_hub') },
    ],
  },
}
