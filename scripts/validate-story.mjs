import { COMPANIONS, INITIAL_STATE, SCENES, TAGS } from '../src/gameData.js'
import { normalExploreChoices } from '../src/story/shared.js'

const sceneIds = new Set(Object.keys(SCENES))
const tagIds = new Set(Object.keys(TAGS))
const companionIds = new Set(Object.keys(COMPANIONS))
const eventKeys = new Set(Object.keys(INITIAL_STATE.events))

const errors = []

function cloneState(overrides = {}) {
  const state = structuredClone(INITIAL_STATE)
  Object.assign(state, overrides)
  state.flags = { ...INITIAL_STATE.flags, ...(overrides.flags ?? {}) }
  state.events = { ...INITIAL_STATE.events, ...(overrides.events ?? {}) }
  state.sceneVisits = { ...INITIAL_STATE.sceneVisits, ...(overrides.sceneVisits ?? {}) }
  state.tags = [...(overrides.tags ?? [])]
  state.companions = [...(overrides.companions ?? [])]
  return state
}

function recordError(message) {
  errors.push(message)
}

function inspectSceneRef(label, nextValue) {
  if (!nextValue || typeof nextValue !== 'string') return
  if (!sceneIds.has(nextValue)) {
    recordError(`${label} -> missing scene "${nextValue}"`)
  }
}

function inspectStateDiff(label, before, after) {
  for (const tag of after.tags) {
    if (!before.tags.has(tag) && !tagIds.has(tag)) {
      recordError(`${label} added unknown tag "${tag}"`)
    }
  }

  for (const companion of after.companions) {
    if (!before.companions.has(companion) && !companionIds.has(companion)) {
      recordError(`${label} added unknown companion "${companion}"`)
    }
  }

  for (const [key, value] of Object.entries(after.events)) {
    if (!before.events.has(key) && value) {
      recordError(`${label} wrote unknown event key "${key}"`)
    }
  }
}

function inspectResolvedEffect(label, resolved) {
  if (!resolved || typeof resolved !== 'object') return

  const tagList = [
    ...(resolved.addTag ? [resolved.addTag] : []),
    ...(Array.isArray(resolved.addTags) ? resolved.addTags : []),
  ]
  for (const tag of tagList) {
    if (!tagIds.has(tag)) recordError(`${label} references unknown tag "${tag}"`)
  }

  const companionList = [
    ...(resolved.addCompanion ? [resolved.addCompanion] : []),
    ...(Array.isArray(resolved.removeCompanions) ? resolved.removeCompanions : []),
    ...(resolved.removeCompanion ? [resolved.removeCompanion] : []),
  ]
  for (const companion of companionList) {
    if (!companionIds.has(companion)) recordError(`${label} references unknown companion "${companion}"`)
  }

  if (resolved.setEvents) {
    for (const key of Object.keys(resolved.setEvents)) {
      if (!eventKeys.has(key)) recordError(`${label} references unknown event key "${key}"`)
    }
  }
}

function runEffects(label, effects, baseState) {
  const queue = Array.isArray(effects) ? effects : [effects]
  const state = structuredClone(baseState)
  const before = {
    tags: new Set(state.tags),
    companions: new Set(state.companions),
    events: new Set(Object.keys(state.events)),
  }

  for (const entry of queue) {
    try {
      const resolved = typeof entry === 'function' ? entry(state) : entry
      inspectResolvedEffect(label, resolved)
    } catch (error) {
      recordError(`${label} effects threw: ${error.message}`)
    }
  }

  inspectStateDiff(label, before, state)
  return state
}

function resolveValue(value, state, label) {
  try {
    return typeof value === 'function' ? value(state) : value
  } catch (error) {
    recordError(`${label} threw: ${error.message}`)
    return null
  }
}

function inspectOutcome(label, outcome, baseState) {
  if (!outcome || typeof outcome !== 'object') return
  const sceneRef = resolveValue(outcome.sceneId, structuredClone(baseState), `${label} sceneId`)
  inspectSceneRef(label, sceneRef)
  if (outcome.effects) {
    runEffects(`${label} effects`, outcome.effects, structuredClone(baseState))
  }
}

const sampleStates = [
  cloneState({ shelter: '山中别墅', day: 4, ammo: 20, supplies: 80 }),
  cloneState({ shelter: '城郊防空洞', day: 20, ammo: 40, supplies: 120, companions: ['lime'], flags: { radio: true, campUnlocked: true } }),
  cloneState({ shelter: '山中别墅', day: 35, ammo: 60, supplies: 160, companions: ['evelyn'], flags: { radio: true, campUnlocked: true } }),
  cloneState({ shelter: '城郊防空洞', day: 60, ammo: 80, supplies: 220, companions: ['luna', 'evelyn', 'infant'], tags: ['traverser'], flags: { radio: true, campUnlocked: true, promise: true } }),
]

const exploreResolutionCases = [
  { choiceId: 'explore_fifth', eventKey: 'fifthAvenueResolved', state: { day: 4 } },
  { choiceId: 'explore_factory', eventKey: 'canningFactoryResolved', state: { day: 5 } },
  { choiceId: 'explore_church', eventKey: 'churchResolved', state: { day: 20 } },
  { choiceId: 'explore_bar', eventKey: 'hopeBarResolved', state: { day: 20 } },
  { choiceId: 'explore_farmhouse', eventKey: 'farmhouseResolved', state: { day: 20 } },
  { choiceId: 'explore_street', eventKey: 'commercialStreetResolved', state: { day: 20 } },
  { choiceId: 'explore_kindergarten', eventKey: 'kindergartenResolved', state: { day: 20 } },
  { choiceId: 'explore_shop', eventKey: 'convenienceResolved', state: { day: 4 } },
  { choiceId: 'explore_hospital', eventKey: 'hospitalResolved', state: { day: 35 } },
  { choiceId: 'explore_evelyn_inn', eventKey: 'evelynInnResolved', state: { day: 45, companions: ['evelyn'] } },
  { choiceId: 'explore_evelyn_library', eventKey: 'evelynLibraryResolved', state: { day: 55, companions: ['evelyn'] } },
]

const deadlockCases = [
  { sceneId: 'airdrop_event', state: { ammo: 0, supplies: 60, flags: { nextHub: 'day50_hub' } } },
  { sceneId: 'hero_camp', state: { ammo: 0, supplies: 0, companions: ['evelyn'] } },
  { sceneId: 'rescue_with_evelyn', state: { ammo: 0, supplies: 80, companions: ['evelyn'] } },
  { sceneId: 'cliff_truth', state: { ammo: 0, supplies: 0 } },
  { sceneId: 'explore_hospital', state: { ammo: 0, supplies: 0, flags: { nextHub: 'day50_hub' } } },
]

function inspectExploreResolutionGates() {
  for (const testCase of exploreResolutionCases) {
    const beforeState = cloneState(testCase.state)
    const beforeIds = normalExploreChoices(beforeState).map((choice) => choice.id)
    if (!beforeIds.includes(testCase.choiceId)) {
      recordError(`explore gate setup missing choice "${testCase.choiceId}" before resolving ${testCase.eventKey}`)
      continue
    }

    const afterState = cloneState({
      ...testCase.state,
      events: {
        [testCase.eventKey]: true,
      },
    })
    const afterIds = normalExploreChoices(afterState).map((choice) => choice.id)
    if (afterIds.includes(testCase.choiceId)) {
      recordError(`explore choice "${testCase.choiceId}" still appears after resolving ${testCase.eventKey}`)
    }
  }
}

for (const [sceneId, scene] of Object.entries(SCENES)) {
  const sampleState = structuredClone(sampleStates[0])
  if (scene.onEnter?.effects) {
    runEffects(`scene ${sceneId} onEnter`, scene.onEnter.effects, sampleState)
  }

  for (const state of sampleStates) {
    const nextValue = resolveValue(scene.next, structuredClone(state), `scene ${sceneId} next`)
    inspectSceneRef(`scene ${sceneId}`, nextValue)
    inspectOutcome(`scene ${sceneId} deadlock`, resolveValue(scene.deadlock, structuredClone(state), `scene ${sceneId} deadlock`), structuredClone(state))

    const rawChoices = resolveValue(scene.choices ?? [], structuredClone(state), `scene ${sceneId} choices`)
    if (rawChoices == null) continue
    if (!Array.isArray(rawChoices)) {
      recordError(`scene ${sceneId} choices did not resolve to an array`)
      continue
    }

    const ids = new Set()
    for (const choice of rawChoices) {
      if (ids.has(choice.id)) recordError(`scene ${sceneId} has duplicate choice id "${choice.id}"`)
      ids.add(choice.id)

      const choiceState = choice.effects ? runEffects(`scene ${sceneId} choice ${choice.id}`, choice.effects, structuredClone(state)) : structuredClone(state)
      const next = resolveValue(choice.next, choiceState, `scene ${sceneId} choice ${choice.id} next`)
      inspectSceneRef(`scene ${sceneId} choice ${choice.id}`, next)
    }
  }
}

inspectExploreResolutionGates()

for (const testCase of deadlockCases) {
  const scene = SCENES[testCase.sceneId]
  if (!scene) {
    recordError(`deadlock case missing scene "${testCase.sceneId}"`)
    continue
  }

  const state = cloneState(testCase.state)
  const rawChoices = resolveValue(scene.choices ?? [], structuredClone(state), `deadlock case ${testCase.sceneId} choices`)
  if (!Array.isArray(rawChoices) || !rawChoices.length) {
    recordError(`deadlock case ${testCase.sceneId} did not resolve choices`)
    continue
  }

  const visibleChoices = rawChoices.filter((choice) => (choice.showIf ? Boolean(choice.showIf(state)) : true))
  const enabledChoices = visibleChoices.filter((choice) => (choice.requires ? Boolean(choice.requires(state)) : true))
  if (!visibleChoices.length) {
    recordError(`deadlock case ${testCase.sceneId} has no visible choices`)
    continue
  }

  if (!enabledChoices.length) {
    const deadlock = resolveValue(scene.deadlock, structuredClone(state), `deadlock case ${testCase.sceneId} deadlock`)
    if (!deadlock) {
      recordError(`deadlock case ${testCase.sceneId} has no enabled choices and no deadlock fallback`)
      continue
    }
    inspectOutcome(`deadlock case ${testCase.sceneId}`, deadlock, structuredClone(state))
  }
}

if (errors.length) {
  console.error('Story validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Story validation passed for ${sceneIds.size} scenes.`)
