export interface Command {
  type: "ADD_CHILD" | "GET_RELATIONSHIP";
  params: string[];
}
