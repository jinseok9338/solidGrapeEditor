export class Frame {
  id: number;
  content_id: number;
  position: number;
  parentId: number | null;

  // if the inner frame is not null, it means that the frame is a nested frame and has no children

  constructor(
    id: number,
    content_id: number,
    position: number,
    parentId: number | null
  ) {
    // this is id of the frame in that is unique
    this.id = id;
    // this is used to map to the content of the frame
    this.content_id = content_id;
    // this is the position
    this.position = position;
    this.parentId = parentId;
  }
}

export class Component {
  // this is used to map to the content of the frame
  id: number;
  content: {
    tag: string;
    attrs?: Record<string, string>;
    text?: string | null;
  };

  constructor(
    id: number,
    content: {
      tag: string;
      attrs?: Record<string, string>;
      text?: string | null;
    }
  ) {
    this.id = id;
    this.content = content;
  }
}
