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

const deleteAllPagesVisible = async () => {
    // -- select all trash icons in current page
    let allTrashIcons = fetchCurrentPageItems();

    for (const trashIcon of allTrashIcons) {
        const parentDiv = trashIcon.closest('div');
        parentDiv.click();

        await timeout(timeoutInBetweenDeletions);

        // -- confirm page deletion with the popup
        let deleteButton = document.querySelector('div[style*="999999"]  .notion-focusable');
        deleteButton.click();

        await timeout(timeoutInBetweenDeletions);
    }
};

const fetchCurrentPageItems = () => {
    return document.querySelectorAll('.notion-sidebar-trash-menu > .notion-scroller .notion-focusable .trash');
};

const isTrashEmpty = () => {
    return fetchCurrentPageItems().length == 0;
};

const timeout = async (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
    // -- Main thread execution

    const isTrashMenuVisible = document.querySelector('.notion-sidebar-trash-menu');
    if (!isTrashMenuVisible) {
        // -- open it
        const sidebarTrash = document.querySelector('.sidebarTrash');
        const trashBtn = sidebarTrash.closest('div');
        trashBtn.click();

        // -- wait to load
        await timeout(1500);
    }

    if (emptyTrashEntirely) {
        while (!isTrashEmpty()) {
            deleteAllPagesVisible();

            // -- for Notion to fetch next page items
            await timeout(1000);
        }
    } else {
        deleteAllPagesVisible();
    }
};

main();
