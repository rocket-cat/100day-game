import { COMPANIONS, INITIAL_STATE, TAGS, THEMES } from './story/shared.js'
import { scenesEndgame } from './story/scenes-endgame.js'
import { scenesExploration } from './story/scenes-exploration.js'
import { scenesExplorationExtra } from './story/scenes-exploration-extra.js'
import { scenesPrologue } from './story/scenes-prologue.js'
import { scenesSurvival } from './story/scenes-survival.js'

export { COMPANIONS, INITIAL_STATE, TAGS, THEMES }

export const SCENES = {
  ...scenesPrologue,
  ...scenesExploration,
  ...scenesExplorationExtra,
  ...scenesSurvival,
  ...scenesEndgame,
}
