import './style.css'
import { COMPANIONS, INITIAL_STATE, SCENES, TAGS, THEMES } from './gameData.js'

const SAVE_KEY = 'j100days-mobile-share'
const SAVE_VERSION = 4 // Bump when story/state structure changes incompatibly.
const PREFS_KEY = 'j100days-mobile-share-prefs'
const DEFAULT_PREFS = {
  textSpeed: 'normal',
  reducedMotion: false,
}
const FAILURE_TEXT = {
  supplies: '你的物资已经耗尽。饥饿、寒冷和疲惫比下一次机会先一步拖垮了你。',
  humanity: '你的人性终于被末世磨空了。就算身体还站着，这一轮的你也已经走不回人类那边。',
  deadlock: '你已经没有任何能执行的行动，只能在资源耗尽和迟疑里被末世吞掉。',
}

const app = document.querySelector('#app')
const toastHost = getToastHost()
const TOAST_TIMEOUT_MS = 8000
const HIGHLIGHT_TOKENS = createHighlightTokens()
const HIGHLIGHT_CLASS_MAP = new Map(HIGHLIGHT_TOKENS.map(({ keyword, className }) => [keyword, className]))
const HIGHLIGHT_PATTERN = HIGHLIGHT_TOKENS.length
  ? new RegExp(HIGHLIGHT_TOKENS.map(({ keyword }) => escapeRegExp(keyword)).sort((left, right) => right.length - left.length).join('|'), 'g')
  : null

let state = readSave() ?? createState()
let prefs = readPrefs()
let bootScreen = true
let panel = null
let typingTimer = null
let typingDone = true
let renderedLine = ''
let savePulseTimer = null
let lastSaveAt = 0

render()

function getToastHost() {
  const existing = document.querySelector('#global-toast-host')
  if (existing) return existing
  const host = document.createElement('div')
  host.id = 'global-toast-host'
  document.body.appendChild(host)
  return host
}

function createHighlightTokens() {
  const tokens = new Map()
  const register = (keyword, className) => {
    if (!keyword || tokens.has(keyword)) return
    tokens.set(keyword, className)
  }

  ;['物资', '弹药', '人性', '补给', '食物', '药品', '子弹', '枪', '武器'].forEach((keyword) => {
    register(keyword, 'story-mark--resource')
  })

  ;['丧尸', '尸潮', '危机', '绝望', '濒死', '死亡', '崩溃', '受伤', '围困', '感染'].forEach((keyword) => {
    register(keyword, 'story-mark--risk')
  })

  Object.values(COMPANIONS).forEach(({ name }) => {
    register(name, 'story-mark--name')
  })

  return Array.from(tokens, ([keyword, className]) => ({ keyword, className }))
}

function createState() {
  return {
    saveVersion: SAVE_VERSION,
    ...structuredClone(INITIAL_STATE),
  }
}

function readSave() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const normalized = normalizeState(JSON.parse(raw))
    if (normalized.saveVersion !== SAVE_VERSION) {
      clearSave()
      return null
    }
    return normalized
  } catch {
    return null
  }
}

function readPrefs() {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return structuredClone(DEFAULT_PREFS)
    return normalizePrefs(JSON.parse(raw))
  } catch {
    return structuredClone(DEFAULT_PREFS)
  }
}

function normalizeState(raw) {
  const base = createState()
  const rawVersion = raw?.saveVersion ?? 1
  return {
    ...base,
    ...raw,
    saveVersion: rawVersion,
    companions: Array.isArray(raw?.companions) ? raw.companions : [],
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    flags: {
      ...base.flags,
      ...(raw?.flags ?? {}),
    },
    events: {
      ...base.events,
      ...(raw?.events ?? {}),
    },
    sceneVisits: {
      ...base.sceneVisits,
      ...(raw?.sceneVisits ?? {}),
    },
  }
}

function normalizePrefs(raw) {
  return {
    textSpeed: ['normal', 'fast', 'instant'].includes(raw?.textSpeed) ? raw.textSpeed : DEFAULT_PREFS.textSpeed,
    reducedMotion: Boolean(raw?.reducedMotion),
  }
}

function save() {
  lastSaveAt = Date.now()
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  pulseSaveIndicator()
}

function clearSave() {
  window.localStorage.removeItem(SAVE_KEY)
}

function hasResumeSave() {
  return Boolean(readSave()?.started)
}

function savePrefs() {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

function setTextSpeed(value) {
  if (!['normal', 'fast', 'instant'].includes(value) || prefs.textSpeed === value) return
  prefs = {
    ...prefs,
    textSpeed: value,
  }
  savePrefs()
  render()
}

function toggleReducedMotion() {
  prefs = {
    ...prefs,
    reducedMotion: !prefs.reducedMotion,
  }
  savePrefs()
  render()
}

function resetRun() {
  state = createState()
  panel = null
  save()
}

function getScene() {
  return SCENES[state.sceneId]
}

function resolveValue(value) {
  return typeof value === 'function' ? value(state) : value
}

function getSceneThemeId(scene = getScene()) {
  return resolveValue(scene?.theme) ?? 'prelude'
}

function getSceneDialogues(scene = getScene()) {
  return resolveValue(scene?.dialogues) ?? []
}

function getSceneChoices(scene = getScene()) {
  const choices = resolveValue(scene?.choices) ?? []
  return choices.filter(choiceVisible)
}

function getSceneSpeaker(scene = getScene()) {
  return resolveValue(scene?.speaker) ?? '系统'
}

function getSceneNameplate(scene = getScene()) {
  return resolveValue(scene?.nameplate) ?? THEMES[getSceneThemeId(scene)]?.name ?? '未命名节点'
}

function getSceneNext(scene = getScene()) {
  return resolveValue(scene?.next) ?? null
}

function startNewRun() {
  state.started = true
  state.sceneId = 'intro_rebirth'
  state.dialogueIndex = 0
  bootScreen = false
  panel = null
  applySceneEnter(getScene(), true)
  stabilizeSceneState()
  save()
  render()
}

function requestNewRun() {
  if (hasResumeSave() && !window.confirm('重新开始会覆盖这台设备上的当前进度，确定继续吗？')) return
  state = createState()
  startNewRun()
}

function continueGame() {
  const saved = readSave()
  if (!saved?.started) {
    requestNewRun()
    return
  }
  state = saved
  bootScreen = false
  panel = null
  stabilizeSceneState()
  save()
  render()
}

function returnToTitle() {
  clearTyping()
  panel = null
  bootScreen = true
  render()
}

function restartFromMenu() {
  if (!window.confirm('重新开始会覆盖当前本地进度，确定继续吗？')) return
  state = createState()
  startNewRun()
}

function clearLocalProgress() {
  if (!hasResumeSave()) return
  if (!window.confirm('清除后将无法在这台设备上继续当前进度，确定清除吗？')) return
  clearTyping()
  clearSave()
  state = createState()
  panel = null
  bootScreen = true
  render()
}

function goto(sceneId) {
  if (!sceneId || !SCENES[sceneId]) return
  state.sceneId = sceneId
  state.dialogueIndex = 0
  applySceneEnter(getScene(), false)
  stabilizeSceneState()
  save()
  render()
}

function applySceneEnter(scene, force) {
  if (!scene?.onEnter) return
  const count = state.sceneVisits[state.sceneId] ?? 0
  const shouldRun = force || !scene.onEnter.once || count === 0
  state.sceneVisits[state.sceneId] = count + 1
  if (!shouldRun) return

  if (typeof scene.onEnter.day === 'number') {
    state.day = scene.onEnter.day
  }
  applyEffects(scene.onEnter.effects)
}

function applyEffects(effects = {}) {
  const queue = Array.isArray(effects) ? effects : [effects]

  for (const entry of queue) {
    const resolved = resolveValue(entry)
    if (!resolved) continue

    if (resolved.resetRun) {
      resetRun()
      state.started = true
      continue
    }

    if (typeof resolved.supplies === 'number') state.supplies += resolved.supplies
    if (typeof resolved.ammo === 'number') state.ammo += resolved.ammo
    if (typeof resolved.humanity === 'number') state.humanity += resolved.humanity
    if (typeof resolved.shelter === 'string') state.shelter = resolved.shelter

    if (typeof resolved.setSupplies === 'number') state.supplies = resolved.setSupplies
    if (typeof resolved.setAmmo === 'number') state.ammo = resolved.setAmmo
    if (typeof resolved.setHumanity === 'number') state.humanity = resolved.setHumanity

    if (resolved.halveSupplies) state.supplies = Math.floor(state.supplies / 2)

    if (resolved.setFlags) Object.assign(state.flags, resolved.setFlags)
    if (resolved.setEvents) Object.assign(state.events, resolved.setEvents)

    if (Array.isArray(resolved.clearFlags)) {
      resolved.clearFlags.forEach((key) => {
        delete state.flags[key]
      })
    }

    if (resolved.addCompanion && !state.companions.includes(resolved.addCompanion)) {
      state.companions.push(resolved.addCompanion)
    }

    if (Array.isArray(resolved.removeCompanions)) {
      state.companions = state.companions.filter((id) => !resolved.removeCompanions.includes(id))
    }

    if (resolved.removeCompanion) {
      state.companions = state.companions.filter((id) => id !== resolved.removeCompanion)
    }

    if (resolved.addTag && !state.tags.includes(resolved.addTag)) {
      state.tags.push(resolved.addTag)
    }

    if (Array.isArray(resolved.addTags)) {
      resolved.addTags.forEach((tag) => {
        if (!state.tags.includes(tag)) state.tags.push(tag)
      })
    }

    if (Array.isArray(resolved.removeTags)) {
      state.tags = state.tags.filter((id) => !resolved.removeTags.includes(id))
    }

    if (resolved.removeTag) {
      state.tags = state.tags.filter((id) => id !== resolved.removeTag)
    }

    clampState()

    if (resolved.toast) showToast(resolved.toast)
  }
}

function clampState() {
  state.supplies = Math.max(0, state.supplies)
  state.ammo = Math.max(0, state.ammo)
  state.humanity = Math.max(-100, Math.min(100, state.humanity))
}

function normalizeSceneOutcome(outcome) {
  if (!outcome) return null
  const recoveryScene = resolveValue(outcome.recoveryScene)
  return {
    sceneId: resolveValue(outcome.sceneId) ?? 'death_end',
    crisisText: typeof outcome.crisisText === 'string' ? outcome.crisisText : null,
    deathText: typeof outcome.deathText === 'string' ? outcome.deathText : null,
    recoveryScene: typeof recoveryScene === 'string' ? recoveryScene : null,
    effects: outcome.effects ?? null,
  }
}

function getDeadlockOutcome(scene = getScene()) {
  const choices = getSceneChoices(scene)
  if (!choices.length || choices.some(choiceEnabled)) return null
  return normalizeSceneOutcome(
    resolveValue(scene?.deadlock) ?? {
      sceneId: 'death_end',
      deathText: FAILURE_TEXT.deadlock,
    },
  )
}

function getForcedSceneOutcome(scene = getScene()) {
  if (!state.started || state.sceneId === 'death_end') return null
  if (state.day <= 0 || scene?.skipFailureCheck) return null

  if (state.supplies <= 0) {
    return normalizeSceneOutcome({
      sceneId: 'death_end',
      deathText: FAILURE_TEXT.supplies,
    })
  }

  if (state.humanity <= 0) {
    return normalizeSceneOutcome({
      sceneId: 'death_end',
      deathText: FAILURE_TEXT.humanity,
    })
  }

  return getDeadlockOutcome(scene)
}

function applySceneOutcome(outcome) {
  if (!outcome) return false
  if (outcome.effects) applyEffects(outcome.effects)
  if (typeof outcome.crisisText === 'string') state.flags.crisisText = outcome.crisisText
  if (typeof outcome.deathText === 'string') state.flags.deathText = outcome.deathText
  if (typeof outcome.recoveryScene === 'string') state.flags.recoveryScene = outcome.recoveryScene
  state.sceneId = outcome.sceneId
  state.dialogueIndex = 0
  applySceneEnter(getScene(), false)
  return true
}

function stabilizeSceneState() {
  let guard = 0
  while (guard < 4) {
    const outcome = getForcedSceneOutcome(getScene())
    if (!outcome) return
    applySceneOutcome(outcome)
    guard += 1
  }
}

function currentLine() {
  const scene = getScene()
  return getSceneDialogues(scene)[state.dialogueIndex] ?? ''
}

function shouldShowChoices(scene = getScene()) {
  const dialogues = getSceneDialogues(scene)
  return Boolean(state.started && typingDone && state.dialogueIndex >= dialogues.length - 1 && getSceneChoices(scene).length)
}

function choiceVisible(choice) {
  return choice.showIf ? Boolean(choice.showIf(state)) : true
}

function choiceEnabled(choice) {
  return choice.requires ? Boolean(choice.requires(state)) : true
}

function advanceDialogue() {
  if (!state.started) return

  if (!typingDone) {
    finishTyping()
    return
  }

  const scene = getScene()
  const dialogues = getSceneDialogues(scene)
  const atLastLine = state.dialogueIndex >= dialogues.length - 1
  const hasChoices = Boolean(getSceneChoices(scene).length)

  if (atLastLine && hasChoices) return

  if (atLastLine && getSceneNext(scene)) {
    goto(getSceneNext(scene))
    return
  }

  state.dialogueIndex += 1
  save()
  render()
}

function pickChoice(index) {
  const scene = getScene()
  const choice = getSceneChoices(scene)[index]
  if (!choice || !choiceEnabled(choice)) return

  if (!typingDone) {
    finishTyping()
    return
  }

  if (choice.effects) applyEffects(choice.effects)

  const nextScene = resolveValue(choice.next)
  if (nextScene) {
    goto(nextScene)
  } else {
    stabilizeSceneState()
    save()
    render()
  }
}

function render() {
  const scene = getScene()
  const themeId = getSceneThemeId(scene)
  const theme = THEMES[themeId]
  const dialogues = getSceneDialogues(scene)
  const visibleChoices = getSceneChoices(scene)
  const resumeState = readSave()
  const resumeAvailable = Boolean(resumeState?.started)
  const showGameplay = !bootScreen && state.started
  const showChoices = showGameplay && shouldShowChoices(scene)
  const saveRecently = Date.now() - lastSaveAt < 1200
  document.body.classList.toggle('is-reduced-motion', prefs.reducedMotion)

  app.innerHTML = `
    <div id="app-frame" class="theme-${themeId} ${showGameplay ? 'is-playing' : 'is-title'}">
      <div class="scene-backdrop">
        <div class="scene-backdrop__gradient"></div>
        <div class="scene-backdrop__grid"></div>
        <div class="scene-backdrop__art art-${theme.backdrop}"></div>
      </div>

      <div id="start-screen" class="${bootScreen ? '' : 'is-hidden'}">
        <div class="title-glow"></div>
        <div class="title-copy">
          <span class="title-copy__sub">SURVIVAL REBIRTH</span>
          <h1>惊变100天</h1>
          <p>前 80 天是生存阶段，80 天后进入终局分线，并在第 100 天落下正式结局。</p>
        </div>
        ${
          resumeAvailable
            ? `
              <div class="resume-card">
                <span class="resume-card__eyebrow">上次进度</span>
                <strong>第 ${escapeHtml(String(resumeState.day))} 天</strong>
                <p>${escapeHtml(resumeState.shelter || '据点未确认')} · ${escapeHtml(getSceneNameplate(SCENES[resumeState.sceneId]) || '起始节点')}</p>
              </div>
            `
            : ''
        }
        <div class="title-actions">
          ${
            resumeAvailable
              ? `
                <button class="title-button" data-ui="continue">继续上次</button>
                <button class="title-button title-button--secondary" data-ui="start">重新开始</button>
              `
              : '<button class="title-button" data-ui="start">开始生存</button>'
          }
        </div>
        <p class="title-save-note">本机自动存档，仅保存在当前浏览器，不上传云端。</p>
      </div>

      <div id="play-shell" class="${showGameplay ? 'is-visible' : ''}">
        <div id="top-bar" class="${showGameplay ? 'is-visible' : ''}">
          <div class="top-bar__row">
            <div class="top-bar__actions">
              <button class="mini-button" data-panel="system">菜单</button>
              <button class="mini-button" data-panel="companions">伙伴</button>
              <button class="mini-button" data-panel="tags">词条</button>
            </div>
            <div class="top-bar__status">
              <div class="save-pill ${saveRecently ? 'is-pulsing' : ''}" id="save-indicator">本地自动存档</div>
              <div class="day-pill">第 ${state.day} 天</div>
            </div>
          </div>
          <div class="top-bar__stats">
            ${renderStat('人性', state.humanity, 'mind')}
            ${renderStat('物资', state.supplies, 'supplies')}
            ${renderStat('弹药', state.ammo, 'ammo')}
          </div>
        </div>

        <div id="stage-area" class="${showGameplay ? 'is-visible' : ''}">
          <div id="sprite-layer" class="${showGameplay ? 'is-visible' : ''}">
            ${renderSprite(theme.sprite)}
          </div>
        </div>

        <div id="story-rail" class="${showGameplay ? 'is-visible' : ''} ${showChoices ? 'has-choices' : ''}">
          <div id="dialog-area" class="${showGameplay ? 'is-visible' : ''}">
            <div id="speaker-name">${escapeHtml(getSceneSpeaker(scene))}</div>
            <div id="dialog-box">
              <div class="dialog-box__meta">
                <span>${escapeHtml(getSceneNameplate(scene))}</span>
                <span>${escapeHtml(theme.weather)}</span>
                <span>${escapeHtml(theme.mood)}</span>
              </div>
              <div id="dialog-text"></div>
              <div class="dialog-box__footer">
                <span class="dialog-progress">段落 ${state.dialogueIndex + 1}/${dialogues.length}</span>
                <span class="dialog-hint">${escapeHtml(getDialogHint(showChoices))}</span>
              </div>
            </div>
          </div>

          <div id="choice-area" class="${showChoices ? 'is-visible' : ''}">
            ${visibleChoices.map(renderChoice).join('')}
          </div>
        </div>
      </div>

      ${renderPanel(scene)}
    </div>
  `

  bindUI()
  if (showGameplay) {
    startTyping(currentLine())
  } else {
    clearTyping()
  }
}

function bindUI() {
  app.querySelectorAll('[data-ui="start"]').forEach((button) => {
    button.addEventListener('click', requestNewRun)
  })

  app.querySelectorAll('[data-ui="continue"]').forEach((button) => {
    button.addEventListener('click', continueGame)
  })

  app.querySelectorAll('[data-ui="title"]').forEach((button) => {
    button.addEventListener('click', returnToTitle)
  })

  app.querySelectorAll('[data-ui="restart"]').forEach((button) => {
    button.addEventListener('click', restartFromMenu)
  })

  app.querySelectorAll('[data-ui="clear-save"]').forEach((button) => {
    button.addEventListener('click', clearLocalProgress)
  })

  app.querySelectorAll('[data-setting="text-speed"]').forEach((button) => {
    button.addEventListener('click', () => {
      setTextSpeed(button.dataset.value)
    })
  })

  app.querySelectorAll('[data-toggle="motion"]').forEach((button) => {
    button.addEventListener('click', toggleReducedMotion)
  })

  app.querySelector('#app-frame')?.addEventListener('click', handleFrameTap)

  app.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      pickChoice(Number(button.dataset.choice))
    })
  })

  app.querySelectorAll('[data-panel]').forEach((button) => {
    button.addEventListener('click', () => {
      toastHost.querySelectorAll('.toast').forEach((item) => dismissToast(item, true))
      panel = button.dataset.panel
      render()
    })
  })

  app.querySelectorAll('[data-close-panel]').forEach((button) => {
    button.addEventListener('click', () => {
      panel = null
      render()
    })
  })

  document.onkeydown = (event) => {
    if (event.key === 'Escape' && panel) {
      panel = null
      render()
      return
    }

    if (!state.started || bootScreen || panel || event.metaKey || event.ctrlKey || event.altKey) return
    const number = Number(event.key)
    if (!Number.isNaN(number) && number >= 1 && number <= 9) {
      if (!typingDone) {
        finishTyping()
        return
      }
      pickChoice(number - 1)
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      advanceDialogue()
    }
  }
}

function getDialogHint(showChoices) {
  if (!typingDone) return '轻触任意区域立即显示'
  if (showChoices) return '请选择下方行动'
  return '轻触场景任意区域继续'
}

function handleFrameTap(event) {
  if (!state.started || bootScreen || panel) return
  if (shouldIgnoreFrameTap(event.target)) return
  if (shouldShowChoices()) return
  advanceDialogue()
}

function shouldIgnoreFrameTap(target) {
  return Boolean(
    target.closest(
      'button, [data-choice], [data-panel], [data-ui], [data-setting], [data-toggle], .overlay-panel__sheet, .overlay-panel__backdrop',
    ),
  )
}

function renderStat(label, value, tone) {
  return `
    <div class="stat-badge stat-badge--${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `
}

function renderChoice(choice, index) {
  const enabled = choiceEnabled(choice)
  const secondaryText = enabled ? (choice.showSubtext === true ? choice.subtext : '') : (choice.disabledText ?? '当前不可执行')
  return `
    <button
      class="choice-button ${enabled ? '' : 'is-disabled'}"
      data-choice="${index}"
      data-choice-id="${escapeHtml(choice.id ?? String(index))}"
      ${enabled ? '' : 'disabled'}
    >
      <div class="choice-button__main">
        <span class="choice-button__index">${index + 1}</span>
        <div class="choice-button__copy">
          <strong>${formatInlineText(choice.text)}</strong>
          ${secondaryText ? `<span>${formatInlineText(secondaryText)}</span>` : ''}
        </div>
      </div>
      <span class="choice-button__tail" aria-hidden="true">${enabled ? '›' : '×'}</span>
    </button>
  `
}

function renderSettingButton(label, value, activeValue) {
  return `
    <button
      class="segmented-button ${value === activeValue ? 'is-active' : ''}"
      data-setting="text-speed"
      data-value="${value}"
    >
      ${label}
    </button>
  `
}

function renderSprite(type) {
  return `
    <div class="sprite sprite--${type}">
      <div class="sprite__shape"></div>
      <div class="sprite__label">${escapeHtml(spriteLabel(type))}</div>
    </div>
  `
}

function spriteLabel(type) {
  if (type === 'camp') return '营地剪影'
  if (type === 'lime') return '莱姆'
  if (type === 'evelyn') return '伊芙琳'
  if (type === 'john') return '约翰'
  return '尼奥'
}

function renderPanel(scene) {
  if (!panel) return ''

  let title = '状态面板'
  let body = ''

  if (panel === 'system') {
    title = '系统菜单'
    body = `
      <article class="panel-card">
        <span class="panel-card__eyebrow">本机自动存档</span>
        <h3>当前进度</h3>
        <p>第 ${escapeHtml(String(state.day))} 天 · ${escapeHtml(state.shelter || '据点未确认')} · ${escapeHtml(getSceneNameplate(scene))}</p>
      </article>
      <article class="panel-card">
        <span class="panel-card__eyebrow">基础设置</span>
        <h3>阅读与动效</h3>
        <div class="setting-group">
          <span class="setting-label">文字速度</span>
          <div class="segmented-control">
            ${renderSettingButton('正常', 'normal', prefs.textSpeed)}
            ${renderSettingButton('快速', 'fast', prefs.textSpeed)}
            ${renderSettingButton('瞬间', 'instant', prefs.textSpeed)}
          </div>
        </div>
        <div class="setting-group">
          <span class="setting-label">动态效果</span>
          <button class="toggle-button ${prefs.reducedMotion ? 'is-on' : ''}" data-toggle="motion">
            ${prefs.reducedMotion ? '已减弱' : '标准'}
          </button>
        </div>
      </article>
      <article class="panel-card">
        <span class="panel-card__eyebrow">当前目标</span>
        <h3>阶段目标说明</h3>
        <p>前 80 天先活下来并攒出关键分支；到第 80 天后进入终局线，故事结局会继续收束到第 100 天。</p>
      </article>
      <article class="panel-card">
        <span class="panel-card__eyebrow">当前版本</span>
        <h3>手机优先的正式分享版</h3>
        <p>直接分享链接即可开始；同一台设备上会自动续玩，进度只保存在本机浏览器。</p>
      </article>
      <div class="panel-actions">
        <button class="panel-action" data-close-panel>继续游戏</button>
        <button class="panel-action panel-action--secondary" data-ui="title">返回标题</button>
        <button class="panel-action panel-action--secondary" data-ui="restart">重新开始</button>
        <button class="panel-action panel-action--ghost" data-ui="clear-save">清除本地存档</button>
      </div>
    `
  }

  if (panel === 'companions') {
    title = '伙伴列表'
    body = state.companions.length
      ? state.companions
          .map((id) => {
            const info = COMPANIONS[id]
            return `
              <article class="panel-card">
                <h3>${escapeHtml(info.name)}</h3>
                <p>${escapeHtml(info.desc)}</p>
              </article>
            `
          })
          .join('')
      : '<p class="panel-empty">目前还是独行状态。后续遇到的幸存者和伙伴会记录在这里。</p>'
  }

  if (panel === 'tags') {
    title = '词条档案'
    body = state.tags.length
      ? state.tags
          .map((id) => {
            const info = TAGS[id]
            return `
              <article class="panel-card">
                <h3>${escapeHtml(info.title)}</h3>
                <p>${escapeHtml(info.desc)}</p>
              </article>
            `
          })
          .join('')
      : '<p class="panel-empty">还没有解锁词条。关键事件和结局记录会保存在这里。</p>'
  }

  return `
    <div class="overlay-panel is-visible">
      <button class="overlay-panel__backdrop" data-close-panel></button>
      <div class="overlay-panel__sheet">
        <button class="overlay-panel__close" data-close-panel>关闭</button>
        <div class="overlay-panel__head">
          <span>${escapeHtml(getSceneNameplate(scene))}</span>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <div class="overlay-panel__body">${body}</div>
      </div>
    </div>
  `
}

function startTyping(text) {
  clearTyping()
  typingDone = false
  renderedLine = text
  syncDialogAffordance()

  const target = app.querySelector('#dialog-text')
  if (!target) return

  if (prefs.textSpeed === 'instant') {
    finishTyping()
    return
  }

  const chars = [...text]
  let index = 0
  const tick = () => {
    index += prefs.textSpeed === 'fast' ? 5 : 3
    target.innerHTML = formatText(chars.slice(0, index).join(''))
    if (index >= chars.length) {
      finishTyping()
    }
  }

  typingTimer = window.setInterval(tick, prefs.reducedMotion ? 12 : 18)
  tick()
}

function finishTyping() {
  clearTyping()
  typingDone = true
  const target = app.querySelector('#dialog-text')
  if (target) target.innerHTML = formatText(renderedLine)
  syncDialogAffordance()
}

function clearTyping() {
  if (typingTimer) {
    window.clearInterval(typingTimer)
    typingTimer = null
  }
}

function syncDialogAffordance() {
  const showChoices = shouldShowChoices()
  app.querySelector('#choice-area')?.classList.toggle('is-visible', showChoices)
  app.querySelector('#story-rail')?.classList.toggle('has-choices', showChoices)
  const hint = app.querySelector('.dialog-hint')
  if (hint) hint.textContent = getDialogHint(showChoices)
}

function pulseSaveIndicator() {
  const indicator = document.querySelector('#save-indicator')
  if (!indicator) return
  indicator.classList.add('is-pulsing')
  if (savePulseTimer) window.clearTimeout(savePulseTimer)
  savePulseTimer = window.setTimeout(() => {
    indicator.classList.remove('is-pulsing')
  }, 1200)
}

function showToast(text) {
  if (!text) return
  toastHost.querySelectorAll('.toast').forEach((item) => {
    dismissToast(item, true)
  })

  const item = document.createElement('div')
  item.className = 'toast'
  item.innerHTML = `
    <div class="toast__text">${formatInlineText(text)}</div>
    <button class="toast__close" type="button" aria-label="关闭提示">关闭</button>
  `
  toastHost.appendChild(item)
  item.querySelector('.toast__close')?.addEventListener('click', (event) => {
    event.stopPropagation()
    dismissToast(item)
  })
  item.addEventListener('click', () => dismissToast(item))
  requestAnimationFrame(() => item.classList.add('is-visible'))
  item.dataset.timerId = String(
    window.setTimeout(() => {
      dismissToast(item)
    }, TOAST_TIMEOUT_MS),
  )
}

function formatText(text) {
  return text
    .split('\n\n')
    .map((line) => `<p>${formatInlineText(line).replaceAll('\n', '<br>')}</p>`)
    .join('')
}

function dismissToast(item, immediate = false) {
  if (!item) return
  const timerId = Number(item.dataset.timerId)
  if (timerId) window.clearTimeout(timerId)
  if (immediate) {
    item.remove()
    return
  }
  item.classList.remove('is-visible')
  window.setTimeout(() => item.remove(), 260)
}

function formatInlineText(text) {
  const escaped = escapeHtml(text)
  if (!HIGHLIGHT_PATTERN) return escaped
  return escaped.replace(HIGHLIGHT_PATTERN, (match) => {
    const className = HIGHLIGHT_CLASS_MAP.get(match)
    return className ? `<span class="story-mark ${className}">${match}</span>` : match
  })
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
