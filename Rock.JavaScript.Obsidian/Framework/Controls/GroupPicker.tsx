// Rock.JavaScript.Obsidian/Framework/Controls/GroupPicker.tsx
// ----------------------------------------------------------------
// A Vue 3 + TypeScript control that fetches "Small Group" records
// from your custom API endpoint and renders them in a searchable,
// async dropdown. The parent can pass `includeInactive` to toggle
// whether inactive groups are returned.
//
// Requirements satisfied:
//  1) Fetches data from the REST API you created.
//  2) Uses a prop to determine whether inactive items should be included.
//  3) Utilizes BaseAsyncPicker to present the dropdown selection list.
// 
// Place this file under:
//    Rock.JavaScript.Obsidian/Framework/Controls/GroupPicker.tsx
// ----------------------------------------------------------------

import { defineComponent, ref, watch, PropType } from "vue";
import { useSecurityGrantToken } from "@Obsidian/Utility/block";
import BaseAsyncPicker from "@Obsidian/Controls/baseAsyncPicker.obs";
import { ListItemBag } from "@Obsidian/ViewModels/Utility/listItemBag";
import { Guid } from "@Obsidian/Types";

// ----------------------------------------------------------
// 1) Define the shape of a raw group object returned by your API
// ----------------------------------------------------------
interface IRawGroup {
    guid: string;
    name: string;
    isActive: boolean;
}

// ----------------------------------------------------------
// 2) Define and export the Vue component
// ----------------------------------------------------------
export default defineComponent({
    name: "GroupPicker",

    // ------------------------------------------------------
    // 3) Props: 
    //    • modelValue   – for v-model binding (single or multiple)
    //    • includeInactive – toggle whether to include inactive groups
    //    • multiple     – toggle single vs. multi-select
    // ------------------------------------------------------
    props: {
        /** v-model binding: either a single ListItemBag, an array of them, or null */
        modelValue: {
            type: [Object, Array] as PropType<ListItemBag | ListItemBag[] | null>,
            default: null
        },
        /** If true, API will return inactive groups as well */
        includeInactive: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        /** If true, allows selecting multiple groups */
        multiple: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },

    // ------------------------------------------------------
    // 4) Emits: 
    //    • update:modelValue when selection changes
    // ------------------------------------------------------
    emits: {
        "update:modelValue": (_val: ListItemBag | ListItemBag[] | null) => true
    },

    setup(props, { emit }) {
        // --------------------------------------------------
        // 5) Internal ref to mirror v-model so we can emit updates
        // --------------------------------------------------
        const internalValue = ref<ListItemBag | ListItemBag[] | null>(props.modelValue);

        // Whenever the parent’s modelValue changes, update internalValue
        watch(
            () => props.modelValue,
            (newVal) => {
                internalValue.value = newVal;
            }
        );

        // Whenever internalValue changes (user picks/clears), emit it back out
        watch(
            internalValue,
            (newVal) => {
                emit("update:modelValue", newVal);
            }
        );

        // --------------------------------------------------
        // 6) Grab Obsidian’s security grant token (if needed by your API)
        // --------------------------------------------------
        const securityGrantToken = useSecurityGrantToken();

        // --------------------------------------------------
        // 7) Define getGroupOptions(filterText): 
        //    Called by BaseAsyncPicker whenever the user types. 
        //    Builds a URL like: 
        //       GET /api/v2/controls/GetGroupDropdownOptions?includeInactive=true&filter=abc
        //    Maps each raw group to a ListItemBag.
        // --------------------------------------------------
        const getGroupOptions = async (filterText: string): Promise<ListItemBag[]> => {
            // 7a) Build the URL to your API endpoint
            const url = new URL("/api/v2/controls/GetGroupDropdownOptions", window.location.origin);

            // Append includeInactive flag
            url.searchParams.append("includeInactive", props.includeInactive ? "true" : "false");

            // If the user has typed at least 1 character, send it as 'filter'
            if (filterText && filterText.length > 0) {
                url.searchParams.append("filter", filterText);
            }

            // 7b) Fetch from the API
            const response = await fetch(url.toString(), {
                headers: {
                    "Content-Type": "application/json",
                    // If your endpoint requires the security token:
                    "Security-Grant-Token": securityGrantToken.value || ""
                }
            });

            if (!response.ok) {
                console.error("Error fetching group options:", response.statusText);
                return [];
            }

            // 7c) Parse JSON into IRawGroup[]
            const rawGroups = (await response.json()) as IRawGroup[];

            // 7d) Map to ListItemBag[]
            return rawGroups.map((g) => ({
                value: g.guid as Guid,
                text: g.name,
                // You could add `category: g.isActive ? "" : "(Inactive)"` or similar if desired.
            })) as ListItemBag[];
        };

        // --------------------------------------------------
        // 8) Return the render function: a single BaseAsyncPicker
        // --------------------------------------------------
        return () => (
            <BaseAsyncPicker
                modelValue={internalValue.value}
                multiple={props.multiple}
                placeholder="Select a Group..."
                debounce="300"         // wait 300ms after typing before calling getOptions
                minSearchLength="0"    // 0 = show all groups (no filter) when dropdown opens
                getOptions={getGroupOptions}
                allowClear
            />
        );
    }
});
