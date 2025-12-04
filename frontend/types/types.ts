
// Region: a strict union type listing every anatomical region
// allowed in the app. Ensures only these exact strings can be used.
export type Region =
  | "back"
  | "thorax"
  | "abdomen"
  | "pelvis"
  | "perineum"
  | "head"
  | "neck"
  | "upperlimb"
  | "lowerlimb";

  // Message: represents a single chat message.
  // type shows who sent it (user or GPT), and text
  export type Message = {
    type: "user" | "gpt";
    text: string;
  };


  