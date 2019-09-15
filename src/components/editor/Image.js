import React, {useState, useEffect} from 'react';



const Image = ({ node, attributes }) => {
  const [src, setSrc] = useState('');

  const load = (file) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setSrc(reader.result);
    });
    reader.readAsDataURL(file)
  }
  useEffect(() => {
    const { data } = node
    const file = data.get('file')
    load(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return src ? (
    // alt should be passed in through attributes:
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...attributes} src={src} />
  ) : (
      <div {...attributes}>Loading...</div>
    )
}

export default Image;
