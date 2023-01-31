import {Graph} from "./graph.model";

/**
 * Creates a new Tab Object
 * @param tabId id of the Tab
 * @param tabName name for the tab that will be displayed in frontend
 * @param graphs the graphs contained within this Tab
 */
export class Tab {
  constructor(
    public tabId: number,
    public tabName: string,
    public graphs: Graph[],
    public tabIndices: number,
){}
}
