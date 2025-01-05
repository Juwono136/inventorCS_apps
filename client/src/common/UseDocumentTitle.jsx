import { useEffect, useRef } from "react";

const UseDocumentTitle = (title, prevailOnUnmount = false) => {
  const defaultTitle = useRef(document.title);
  const titlePrefix = "InventoryCS";

  useEffect(() => {
    document.title = `${title} | ${titlePrefix}`;
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    [prevailOnUnmount]
  );
};

export default UseDocumentTitle;
