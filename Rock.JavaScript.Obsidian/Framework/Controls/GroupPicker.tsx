// Rock.JavaScript.Obsidian\Framework\Controls\GroupPicker.tsx

import { Component, Prop, Vue } from "vue-property-decorator";
import BaseAsyncPicker from "./BaseAsyncPicker";
import { Http } from "@Obsidian/Utility/http";

/**
 * Shape of a single group returned by the API.
 */
export interface GroupDropdownOption {
    guid: string;
    name: string;
    isActive: boolean;
}

/**
 * A dropdown control for selecting a Group.
 * - Fetches from /api/v2/controls/GetGroupDropdownOptions
 * - Has a prop includeInactive to toggle showing inactive groups
 * - Extends BaseAsyncPicker so it can do async loading & searching
 */
@Component({
    name: "GroupPicker"
})
export default class GroupPicker extends BaseAsyncPicker<GroupDropdownOption> {
    /**
     * If true, include inactive groups in the dropdown.
     */
    @Prop({ type: Boolean, default: false })
    public includeInactive!: boolean;

    /**
     * Called by BaseAsyncPicker when it needs to load items.
     * Parameter `search` is the user’s search string (unused here, but could be passed to server).
     */
    protected async getItems(search: string): Promise<GroupDropdownOption[]> {
        // Build URL with query param includeInactive
        const includeParam = this.includeInactive ? "true" : "false";
        const url = `/api/v2/controls/GetGroupDropdownOptions?includeInactive=${includeParam}`;

        try {
            // Rock’s Http.get wraps Axios; response.data is our array
            const response = await Http.get<GroupDropdownOption[]>(url);
            return response.data;
        }
        catch (err) {
            console.error("Error loading groups in GroupPicker:", err);
            return [];
        }
    }

    /**
     * How to display each item’s label in the dropdown.
     */
    protected getText(item: GroupDropdownOption): string {
        return item.name;
    }

    /**
     * Which property to use as the value (GUID) for each item.
     */
    protected getValue(item: GroupDropdownOption): string {
        return item.guid;
    }
}
