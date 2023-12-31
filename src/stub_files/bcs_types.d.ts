type FWObjectOption = WheelFortuneOptionType;

/** Type representing MBS `FWItemSet` fortune wheel options */
interface FWItemSetOption extends Required<FWObjectOption> {
    /**
     * An optional script that will be executed whenever the option is picked.
     * @param character The to-be affected player- or simple character
     */
    readonly Script: (character?: null | Character) => void,
    /** The parent item set */
    readonly Parent: import("common_bc").FWItemSet,
}

/** Type representing MBS `FWCommand` fortune wheel options */
interface FWCommandOption extends FWObjectOption {
    /**
     * Unused field for `FWCommand`.
     * An optional script that will be executed whenever the option is picked.
     */
    readonly Script: undefined,
    /**
     * Unused field for `FWCommand`.
     * The type of lock flavor.
     */
    readonly Flag: undefined,
    /** A description of the option */
    readonly Description: string,
    /** Whether the option should be enabled by default */
    readonly Default: boolean,
    /** Whether this is a custom user-specified option */
    readonly Custom: true,
    /** The parent item set */
    readonly Parent: import("common_bc").FWCommand,
}

interface FWFlagBase<Type extends AssetLockType> {
    /** The lock type associated with the flag */
    readonly type: Type,
    /** Whether the user has enabled the flag or not */
    enabled: boolean,
}

type FWFlagExclusivePadlock = FWFlagBase<"ExclusivePadlock">;
type FWFlagHighSecurityPadlock = FWFlagBase<"HighSecurityPadlock">;
interface FWFlagTimerPasswordPadlock extends FWFlagBase<"TimerPasswordPadlock"> {
    /** The lock duration in seconds; value must fall in the `[60, 240 * 60]` interval */
    time: number,
}

type FWFlag = FWFlagExclusivePadlock | FWFlagTimerPasswordPadlock | FWFlagHighSecurityPadlock;

/**
 * An enum with various strip levels for {@link characterStrip}.
 * All items up to and including the specified levels will be removed.
 */
type StripLevel = 0 | 1 | 2 | 3 | 4;

interface FWItemBase {
    /** The name of the item */
    Name: string,
    /** The group of the item */
    Group: AssetGroupName,
    /** The optional color of the item */
    Color?: readonly string[],
    /** An optional callback whose output denotes whether the item should be equipped */
    Equip?: (character: Character) => boolean,
    /** Optional crafted item data */
    Craft?: Partial<CraftingItem>,
    /** An optional callback for post-processing the item after it's equipped and its type is set */
    ItemCallback?: FortuneWheelCallback;
    /** Whether this is a custom user-specified item set */
    Custom?: boolean,
    /** The type of the item; should preferably be specified in `Craft.Type` */
    Type?: null | string,
    /**
     * The properties of the item.
     * Note that {@link FWItemBase.Type}-specific properties should be excluded from here.
     */
    Property?: ItemProperties,
}

interface FWItem extends Readonly<FWItemBase> {
    /** Optional crafted item data */
    readonly Craft: undefined | Readonly<CraftingItem>,
    /** Whether this is a custom user-specified item set */
    readonly Custom: boolean,
    /** The type of the item; should preferably be specified in `Craft.Type` */
    readonly Type: null | string,
    /**
     * The properties of the item.
     * Note that {@link FWItemBase.Type}-specific properties should be excluded from here.
     */
    readonly Property: Readonly<ItemProperties>,
    /** The optional color of the item */
    readonly Color: undefined | readonly string[],
    /** An optional callback for post-processing the item after it's equipped and its type is set */
    readonly ItemCallback: undefined | FortuneWheelCallback;
    /** An optional callback whose output denotes whether the item should be equipped */
    readonly Equip: undefined | ((character: Character) => boolean),
}

/** A union with the names of all pre-defined MBS item sets. */
type FortuneWheelNames = "leash_candy" | "mummy" | "maid" | "statue";

/** Wheel of fortune callbacks that are to-be applied to individual items */
type FortuneWheelCallback = (item: Item, character: Character) => void;

/**
 * Wheel of fortune callbacks that are to-be applied to the entire item list.
 * The callback must return either a new or the original item list.
 */
type FortuneWheelPreRunCallback = (
    itemList: readonly FWItem[],
    character: Character,
) => readonly FWItem[];

/** A union of valid wheel of fortune button colors */
type FortuneWheelColor = "Blue" | "Gold" | "Gray" | "Green" | "Orange" | "Purple" | "Red" | "Yellow";

/** The (unparsed) MBS settings */
interface MBSProtoSettings {
    /** The MBS version */
    Version?: string,
    /** A backup string containing the serialized crafting data of all crafting items beyond the BC default */
    CraftingCache?: string,
    /** A sealed array with all custom user-created wheel of fortune item sets */
    FortuneWheelItemSets?: (null | FWSimpleItemSet)[],
    /** A sealed array with all custom user-created wheel of fortune command sets */
    FortuneWheelCommands?: (null | FWSimpleCommand)[],
    /** @deprecated alias for {@link MBSSettings.FortuneWheelItemSets} */
    FortuneWheelSets?: MBSProtoSettings["FortuneWheelItemSets"],
}

/** The MBS settings */
interface MBSSettings {
    /** The MBS version */
    readonly Version: typeof import("common").MBS_VERSION,
    /** A backup string containing the serialized crafting data of all crafting items beyond the BC default */
    CraftingCache: string,
    /** A sealed array with all custom user-created wheel of fortune item sets */
    readonly FortuneWheelItemSets: (null | import("common_bc").FWItemSet)[],
    /** A sealed array with all custom user-created wheel of fortune command sets */
    readonly FortuneWheelCommands: (null | import("common_bc").FWCommand)[],
}

/** An interface for representing clickable buttons */
interface ClickAction {
    /** A 4-tuple with the buttons X & Y coordinates, its width and its height */
    readonly coords: readonly [X: number, Y: number, W: number, H: number],
    /** A callback to-be executed when the button is clicked */
    readonly next: () => void,
    /** Whether the button click requires a player character */
    readonly requiresPlayer: boolean,
}

/** A simplified interface representing {@link FWItemSet} */
interface FWSimpleItemSet {
    name: string,
    itemList: readonly FWItem[],
    stripLevel: StripLevel,
    equipLevel: StripLevel,
    flags: readonly Readonly<FWFlag>[],
    custom: boolean,
    hidden: boolean,
    preRunCallback: FortuneWheelPreRunCallback | null,
}

/** A simplified (partial) interface representing {@link FWItemSet} */
interface FWSimplePartialItemSet extends Partial<FWSimpleItemSet>{
    name: string,
    itemList: readonly FWItem[],
}

/** A simplified interface representing {@link FWCommand} */
interface FWSimpleCommand {
    name: string,
    hidden: boolean,
}

/** A simplified (partial) interface representing {@link FWCommand} */
interface FWSimplePartialCommand extends Partial<FWSimpleCommand> {
    name: string,
}
