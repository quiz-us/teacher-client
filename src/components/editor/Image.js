import React, { useState, useEffect } from "react";

const Image = ({ node, attributes, editor }) => {
  const [src, setSrc] = useState("");
  const { data } = node;
  const file = data.get("file");

  const load = async file => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setSrc(reader.result);
      // replace file with data:image src:
      editor.setNodeByKey(node.key, { ...node, data: { file: reader.result } });
    });
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const doesS3UrlExist = typeof file === "string"
    if (doesS3UrlExist) {
      setSrc(file);
      return;
    }
    load(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return src ? (
    // alt should be passed in through attributes:
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...attributes} src={src} />
  ) : (
    <div {...attributes}>Loading...</div>
  );
};

export default Image;
