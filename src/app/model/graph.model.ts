/**
 * Creates a new Graph Object
 * @param id id of the graph
 * @param type Type of Chart
 * @param tabId Unique number to identify the tab
 */
export class Graph {
  constructor(
    public name: string,
    public type: string,
    public tabId: number,
    public settings: any,
  ){}

}
