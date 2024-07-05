/**
 * Notion Empty Trash Console Script
 *
 * by Franz Nkemaka
 *
 * This script  deletes all your Notion trash by pressing on the delete button one-by-one
 * It is async to add a delay in-between interactions.
 *
 * !!! Please have a look at the code if you're afraid
 */

// -- CONFIG

// -- when set true, it will run in a loop
const emptyTrashEntirely = true;
const timeoutInBetweenDeletions = 100; // ms

const deleteVisibleItemsInsideDeleteDialog = async () => {
  // -- select all trash icons in current page
  let items = fetchDeleteDialogItems();

  for (const item of items) {
    const trashButton = item.querySelector(
      'div > div:nth-child(3) > div > div[role="button"]:nth-child(2)'
    );
    trashButton.click();

    await timeout(timeoutInBetweenDeletions);

    // -- confirm page deletion with the popup
    const deleteBtn = document.evaluate(
      '//div[text()="Yes. Delete this page"]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    ).iterateNext();
    deleteBtn.click();

    await timeout(timeoutInBetweenDeletions);
  }
};

const fetchDeleteDialogItems = () =>
  document.querySelectorAll(
    '.notion-sidebar-trash-menu > .notion-scroller > div > div > div[role="menuitem"]'
  );

const isTrashEmpty = () => {
  return fetchDeleteDialogItems().length == 0;
};

const timeout = async (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  // -- Main thread execution

  const isTrashMenuVisible = document.querySelector(
    ".notion-sidebar-trash-menu"
  );
  if (!isTrashMenuVisible) {
    // -- open it
    const sidebarTrash = document.querySelector(".newSidebarTrash");
    const trashBtn = sidebarTrash.closest('div[role="button"]');
    trashBtn.click();

    // -- wait to load
    await timeout(1500);
  }

  if (emptyTrashEntirely) {
    while (!isTrashEmpty()) {
      deleteVisibleItemsInsideDeleteDialog();

      // -- for Notion to fetch next page items
      await timeout(1000);
    }
  } else {
    deleteVisibleItemsInsideDeleteDialog();
  }
};

main();
