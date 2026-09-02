import type { AnchorHTMLAttributes, MouseEvent } from "react";

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

interface SpaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function SpaLink({ href, onClick, children, ...props }: SpaLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || isModifiedClick(event) || props.target === "_blank") {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
