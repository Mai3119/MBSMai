/** Main module for managing all crafting-related additions */

"use strict";

import { MBS_MOD_API, waitFor, padArray } from "common";
import { settingsMBSLoaded } from "common_bc";
import { pushMBSSettings } from "settings";

const BC_SLOT_MAX_ORIGINAL = 400;
const MBS_SLOT_MAX_ORIGINAL = 400;

/** Serialize the passed crafting items. */
function craftingSerialize(items: null | readonly (null | CraftingItem)[]): string {
    if (items == null) {
        return "";
    }
    return items.map(C => {
        let P = "";
        if (C?.Item) {
            P += C.Item + "¶";
            P += (C.Property == null ? "" : C.Property) + "¶";
            P += (C.Lock == null ? "" : C.Lock) + "¶";
            P += (C.Name == null ? "" : C.Name.replace("¶", " ").replace("§", " ")) + "¶";
            P += (C.Description == null ? "" : C.Description.replace("¶", " ").replace("§", " ")) + "¶";
            P += (C.Color == null ? "" : C.Color.replace("¶", " ").replace("§", " ")) + "¶";
            P += ((C.Private != null && C.Private) ? "T" : "") + "¶";
            P += (C.Type == null ? "" : C.Type.replace("¶", " ").replace("§", " ")) + "¶";
            P += "¶";
            P += (C.ItemProperty == null ? "" : JSON.stringify(C.ItemProperty));
        }
        return P;
    }).join("§");
}

/**
 * Load crafting items from the MBS cache.
 * @param character The characer in question
 * @param craftingCache The crafting cache
 */
function loadCraftingCache(character: Character, craftingCache: string = ""): void {
    character.Crafting ??= [];
    padArray(character.Crafting, BC_SLOT_MAX_ORIGINAL, null);
    if (!craftingCache) {
        return;
    }

    const packet = LZString.compressToUTF16(craftingCache);
    const data: (null | CraftingItem)[] = CraftingDecompressServerData(packet);
    const oldCrafts = new Set(character.Crafting.map(i => JSON.stringify(i)));
    let refresh = false;
    let i = -1;
    for (const item of data) {
        i += 1;

        // Make sure that the item is a valid craft
        switch (CraftingValidate(<CraftingItem>item)) {
            case CraftingStatusType.OK: {
                const key = JSON.stringify(item);
                if (oldCrafts.has(key)) {
                    data[i] = null;
                }
                break;
            }
            case CraftingStatusType.ERROR: {
                const key = JSON.stringify(item);
                if (oldCrafts.has(key)) {
                    data[i] = null;
                } else {
                    refresh = true;
                }
                break;
            }
            case CraftingStatusType.CRITICAL_ERROR:
                data[i] = null;
                break;
        }
    }
    for (const item of data) {
        // Too many items, try to remove `null` entries or skip the rest if not possible
        if (character.Crafting.length >= MBS_SLOT_MAX_ORIGINAL) {
            if (item == null) {
                continue;
            } else if (character.Crafting.includes(null, BC_SLOT_MAX_ORIGINAL)) {
                character.Crafting = character.Crafting.filter((item, i) => i < BC_SLOT_MAX_ORIGINAL || item != null);
            } else if (character.Crafting.includes(null)) {
                character.Crafting = character.Crafting.filter(item => item != null);
            } else {
                break;
            }
        }
        character.Crafting.push(item);
    }
    if (refresh) {
        setTimeout(() => {
            refreshCraftingWindow(character, true);
        }, 1000);
    }
}

/**
 * Update the crafting cache for a character.
 * @param character The character in question
 */
async function updateCraftingCache(character: Character): Promise<void> {
    if (!character.Crafting) {
        return;
    }
    const packet = craftingSerialize(character.Crafting);
    const compressed = LZString.compressToUTF16(packet);
    const result = await MBS_MOD_API("crafting_cache_update", {
        AccountID: character.AccountID,
        Cache: compressed,
    });
    if (result) {
        character.CraftingCache = compressed;
    }
}

/**
 * Initialize the crafting module.
 */
export async function initializeCraftingModule(): Promise<void> {
    if (!settingsMBSLoaded()) {
        await waitFor(() => settingsMBSLoaded());
    }
    pushMBSSettings();
    loadCraftingCache(character, character.CraftingCache);
}

/**
 * Crafting menu offset.
 */
let CraftingOffset = 0;

/**
 * Generate the crafting menu.
 * @param character The character in question
 */
function generateCraftingMenu(character: Character): void {
    const craftingMenu = new Menu();

    for (let i = CraftingOffset; i < CraftingOffset + 20; i++) {
        const item = character.Crafting[i];
        if (item) {
            const menuItem = new MenuItem(item.Name, item.Description, async () => {
                // Handle crafting menu item selection
                await craftItem(character, item);
            });
            craftingMenu.add(menuItem);
        }
    }

    craftingMenu.draw();
}

/**
 * Handle the crafting menu navigation.
 * @param character The character in question
 * @param direction The navigation direction
 */
function navigateCraftingMenu(character: Character, direction: "next" | "previous"): void {
    if (direction === "next") {
        CraftingOffset += 20;
        if (CraftingOffset >= BC_SLOT_MAX_ORIGINAL) {
            CraftingOffset = 0;
        }
    } else if (direction === "previous") {
        CraftingOffset -= 20;
        if (CraftingOffset < 0) {
            CraftingOffset = BC_SLOT_MAX_ORIGINAL - 20;
        }
    }
    generateCraftingMenu(character);
}

/**
 * Craft an item.
 * @param character The character in question
 * @param item The item to craft
 */
async function craftItem(character: Character, item: CraftingItem): Promise<void> {
    // Craft the item logic
    // ...
    // ...
}

/**
 * Decompress the server data for crafting.
 * @param data The compressed data