from __future__ import annotations

import argparse
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


SAVE_KEY = "j100days-mobile-share"
PREFS_KEY = "j100days-mobile-share-prefs"
RUNTIME_DIR = Path(__file__).resolve().parents[1] / ".runtime"


def choice_locator(page: Page):
    return page.locator("#choice-area.is-visible [data-choice-id]")


def choice_ids(page: Page) -> list[str]:
    locator = choice_locator(page)
    return [locator.nth(index).get_attribute("data-choice-id") or "" for index in range(locator.count())]


def advance_to_choices(page: Page, label: str, max_taps: int = 12) -> list[str]:
    for _ in range(max_taps):
        ids = choice_ids(page)
        if ids:
            return ids
        page.locator("#dialog-box").click()
        page.wait_for_timeout(90)
    raise RuntimeError(f"{label}: choices did not appear after {max_taps} taps")


def click_choice(page: Page, choice_id: str) -> None:
    locator = page.locator(f'#choice-area.is-visible [data-choice-id="{choice_id}"]').first
    locator.wait_for()
    locator.click()
    page.wait_for_timeout(140)


def assert_contains(ids: list[str], choice_id: str, label: str) -> None:
    if choice_id not in ids:
        raise RuntimeError(f'{label}: missing expected choice "{choice_id}"')


def assert_not_contains(ids: list[str], choice_id: str, label: str) -> None:
    if choice_id in ids:
        raise RuntimeError(f'{label}: unexpected choice "{choice_id}" still visible')


def assert_choice_and_dialog_stacked(page: Page) -> None:
    choice_box = page.locator("#choice-area.is-visible").bounding_box()
    dialog_box = page.locator("#dialog-area").bounding_box()
    if not choice_box or not dialog_box:
        raise RuntimeError("could not read choice/dialog layout boxes")
    if dialog_box["y"] + dialog_box["height"] > choice_box["y"] + 1:
        raise RuntimeError("dialog box overlaps choice list on mobile layout")


def assert_enabled_choices_hide_subtext(page: Page, label: str) -> None:
    spans = page.locator("#choice-area.is-visible [data-choice-id]:not([disabled]) .choice-button__copy span")
    if spans.count() != 0:
        raise RuntimeError(f"{label}: enabled choices still show secondary hint text")


def assert_toast_can_close(page: Page) -> None:
    toast = page.locator(".toast.is-visible")
    toast.wait_for()
    toast.locator(".toast__close").click()
    page.wait_for_timeout(120)
    if page.locator(".toast.is-visible").count():
        raise RuntimeError("toast close button did not dismiss the result card")


def main() -> None:
    parser = argparse.ArgumentParser(description="Mobile smoke test for the single-player shareable build")
    parser.add_argument("--url", default="http://127.0.0.1:4173", help="Target URL, default: %(default)s")
    args = parser.parse_args()

    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        iphone = playwright.devices["iPhone 12"]
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(**iphone, locale="zh-CN", color_scheme="dark")
        page = context.new_page()

        page.goto(args.url, wait_until="networkidle")
        page.evaluate(
            """([save_key, prefs_key]) => {
                localStorage.removeItem(save_key)
                localStorage.setItem(
                  prefs_key,
                  JSON.stringify({ textSpeed: "instant", reducedMotion: true }),
                )
            }""",
            [SAVE_KEY, PREFS_KEY],
        )
        page.reload(wait_until="networkidle")

        page.locator('[data-ui="start"]').click()

        ids = advance_to_choices(page, "pick_shelter")
        assert_contains(ids, "villa", "pick_shelter")
        assert_contains(ids, "bunker", "pick_shelter")
        assert_enabled_choices_hide_subtext(page, "pick_shelter")
        page.screenshot(path=str(RUNTIME_DIR / "smoke-mobile-pick-shelter.png"), full_page=True)

        click_choice(page, "villa")
        assert_toast_can_close(page)

        ids = advance_to_choices(page, "pick_supply")
        assert_contains(ids, "food", "pick_supply")
        assert_contains(ids, "meds", "pick_supply")
        assert_contains(ids, "guns", "pick_supply")
        click_choice(page, "food")

        ids = advance_to_choices(page, "dog_event")
        assert_contains(ids, "save_dog", "dog_event")
        click_choice(page, "save_dog")

        ids = advance_to_choices(page, "choose_creed")
        assert_contains(ids, "live", "choose_creed")
        click_choice(page, "live")

        ids = advance_to_choices(page, "day2_hub")
        assert_contains(ids, "explore_day2", "day2_hub")

        page.locator('[data-panel="system"]').click()
        page.locator(".overlay-panel").wait_for()
        page.screenshot(path=str(RUNTIME_DIR / "smoke-mobile-system-panel.png"), full_page=True)
        page.locator(".overlay-panel__close").click()
        page.locator(".overlay-panel").wait_for(state="hidden")

        click_choice(page, "explore_day2")
        ids = advance_to_choices(page, "explore_select")
        assert_contains(ids, "explore_church", "explore_select")
        assert_contains(ids, "explore_shop", "explore_select")
        assert_choice_and_dialog_stacked(page)
        page.screenshot(path=str(RUNTIME_DIR / "smoke-mobile-explore-day2.png"), full_page=True)

        click_choice(page, "explore_church")
        ids = advance_to_choices(page, "explore_church")
        assert_contains(ids, "church_end", "explore_church")
        click_choice(page, "church_end")

        ids = advance_to_choices(page, "day4_hub")
        assert_contains(ids, "explore_day4", "day4_hub")
        click_choice(page, "explore_day4")

        ids = advance_to_choices(page, "explore_select_after_church")
        assert_not_contains(ids, "explore_church", "explore_select_after_church")
        assert_choice_and_dialog_stacked(page)
        page.screenshot(path=str(RUNTIME_DIR / "smoke-mobile-explore-day4-after-church.png"), full_page=True)

        print("Mobile smoke passed:")
        print("- fresh start reaches the prologue choices without false death routing")
        print("- enabled choices hide spoiler subtext")
        print("- result toast can be manually dismissed")
        print("- dialog and choice areas stay vertically separated on mobile")
        print("- resolved church event does not reappear in explore list")

        context.close()
        browser.close()


if __name__ == "__main__":
    main()
