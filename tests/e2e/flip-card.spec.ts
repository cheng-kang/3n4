import { expect, test, type Locator, type Page } from "@playwright/test";

const frontFace = (page: Page) => page.getByTestId("front-face");
const backFace = (page: Page) => page.getByTestId("back-face");
const flipWrapper = (page: Page) => page.getByTestId("flip-wrapper");
const flipRoot = (page: Page) => page.getByTestId("flip-root");
const flipTransform = (page: Page) => page.getByTestId("flip-transform");
const flipCard = (page: Page) => page.getByTestId("flip-card");

async function pointerEvents(locator: Locator) {
  return locator.evaluate((element) => getComputedStyle(element).pointerEvents);
}

async function inlineStyle(locator: Locator) {
  return locator.evaluate((element) => element.getAttribute("style") ?? "");
}

async function flatTilt(locator: Locator) {
  const style = await inlineStyle(locator);

  return (
    style.includes("transform: none") ||
    style.includes("rotateX(0deg) rotateY(0deg)")
  );
}

async function waitForFaceState(page: Page, state: "front" | "back") {
  await expect
    .poll(async () => ({
      front: await pointerEvents(frontFace(page)),
      back: await pointerEvents(backFace(page)),
    }))
    .toEqual(
      state === "front"
        ? { front: "auto", back: "none" }
        : { front: "none", back: "auto" },
    );
}

async function clickCardWhitespace(page: Page) {
  const box = await flipRoot(page).boundingBox();
  if (!box) throw new Error("flip root is not visible");

  await page.mouse.click(box.x + 40, box.y + 40);
}

async function settleCardHover(page: Page) {
  const box = await flipRoot(page).boundingBox();
  if (!box) throw new Error("flip root is not visible");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForFaceState(page, "front");
});

test("outer wrapper tilts only, card hover enlarges and flattens", async ({
  page,
}) => {
  const transformLayer = flipTransform(page);
  const wrapperBox = await flipWrapper(page).boundingBox();
  const cardBox = await flipRoot(page).boundingBox();
  if (!wrapperBox) throw new Error("wrapper is not visible");
  if (!cardBox) throw new Error("card is not visible");

  const initialStyle = await inlineStyle(transformLayer);

  await page.mouse.move(wrapperBox.x + 24, wrapperBox.y + 24);
  await expect
    .poll(async () => await inlineStyle(transformLayer))
    .not.toBe(initialStyle);
  await expect
    .poll(async () => await inlineStyle(transformLayer))
    .toContain("scale(1)");

  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2,
  );
  await expect(await flatTilt(transformLayer)).toBe(false);
  await expect
    .poll(async () => await inlineStyle(transformLayer))
    .toContain("scale(1.1)");
  await expect.poll(async () => await flatTilt(transformLayer)).toBe(true);
});

test("clicking card whitespace flips the active face", async ({ page }) => {
  await settleCardHover(page);
  await expect
    .poll(async () => await inlineStyle(flipTransform(page)))
    .toContain("scale(1.1)");
  await expect.poll(async () => await flatTilt(flipTransform(page))).toBe(true);

  const outerTransformBefore = await inlineStyle(flipTransform(page));
  const cardTransformBefore = await inlineStyle(flipCard(page));
  await expect
    .poll(async () => await inlineStyle(backFace(page)))
    .toContain("rotateY(180deg)");

  await clickCardWhitespace(page);
  await expect
    .poll(async () => await inlineStyle(flipCard(page)))
    .not.toBe(cardTransformBefore);
  await expect
    .poll(async () => await inlineStyle(flipCard(page)))
    .toContain("rotateY(180");
  await expect
    .poll(async () => await inlineStyle(flipTransform(page)))
    .toBe(outerTransformBefore);
  await expect
    .poll(async () => await inlineStyle(backFace(page)))
    .toContain("rotateY(180deg)");
  await waitForFaceState(page, "back");

  await clickCardWhitespace(page);
  await expect
    .poll(async () => {
      const style = await inlineStyle(flipCard(page));

      return style.includes("rotateY(0deg)") || style.includes("transform: none");
    })
    .toBe(true);
  await waitForFaceState(page, "front");
});

test("clicking text content does not flip the card", async ({ page }) => {
  await page.getByText("Ppl is").click();

  await waitForFaceState(page, "front");
});

test("clicking a link dispatches the link click and does not flip", async ({
  page,
}) => {
  await page.evaluate(() => {
    window.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (
          target instanceof Element &&
          target.closest('a[href="https://chengkang.me/about"]')
        ) {
          event.preventDefault();
          window.sessionStorage.setItem("about-link-clicked", "true");
        }
      },
      { capture: true },
    );
  });

  await settleCardHover(page);

  const rootBox = await flipRoot(page).boundingBox();
  if (!rootBox) throw new Error("flip root is not visible");

  await page.mouse.move(rootBox.x - 40, rootBox.y - 40, { steps: 8 });
  await page.waitForTimeout(150);
  await expect
    .poll(async () => await inlineStyle(flipTransform(page)))
    .not.toContain("rotateX(0deg) rotateY(0deg)");

  const about = page.getByRole("link", { name: "About" });
  const box = await about.boundingBox();
  if (!box) throw new Error("about link is not visible");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 8,
  });
  await page.waitForTimeout(100);
  const settledBox = await about.boundingBox();
  if (!settledBox) throw new Error("about link is not visible after hover");

  await expect.poll(async () => await flatTilt(flipTransform(page))).toBe(true);

  await page.mouse.move(
    settledBox.x + settledBox.width / 2,
    settledBox.y + settledBox.height / 2,
  );
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.up();

  await expect
    .poll(async () =>
      page.evaluate(() => sessionStorage.getItem("about-link-clicked")),
    )
    .toBe("true");
  await waitForFaceState(page, "front");
});

test("back links are interactive on first hover after flip", async ({ page }) => {
  await settleCardHover(page);
  await clickCardWhitespace(page);
  await waitForFaceState(page, "back");

  const backGithub = backFace(page).getByRole("link").first();
  const box = await backGithub.boundingBox();
  if (!box) throw new Error("back link is not visible");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

  await expect
    .poll(async () =>
      backGithub.evaluate((element) => getComputedStyle(element).cursor),
    )
    .toBe("pointer");
  await expect
    .poll(async () =>
      page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("a") !== null,
        { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      ),
    )
    .toBe(true);
});

test("drag-selecting text content does not flip the card", async ({ page }) => {
  await settleCardHover(page);

  const name = page.getByText("CHENG, KANG");
  let box = await name.boundingBox();
  if (!box) throw new Error("name text is not visible");

  await page.mouse.move(box.x + 4, box.y + box.height / 2, { steps: 8 });
  await page.waitForTimeout(100);

  box = await name.boundingBox();
  if (!box) throw new Error("name text is not visible after hover");

  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();

  await expect
    .poll(async () => page.evaluate(() => window.getSelection()?.toString() ?? ""))
    .toContain("CHENG");
  await waitForFaceState(page, "front");
});
