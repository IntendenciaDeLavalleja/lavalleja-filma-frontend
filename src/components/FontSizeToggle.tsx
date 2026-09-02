import { useEffect, useState } from "react";
import {
  applyFontSize,
  changeFontSize,
  getInitialFontSize,
  type FontSize,
} from "../lib/fontSize";

const FONT_SIZE_PERCENTAGES: Record<FontSize, number> = {
  small: 90,
  normal: 100,
  large: 115,
  xlarge: 130,
};

export default function FontSizeToggle() {
  const [fontSize, setFontSize] = useState<FontSize>(getInitialFontSize);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const decreaseFontSize = () => {
    setFontSize((current) => changeFontSize(current, "decrease"));
  };

  const increaseFontSize = () => {
    setFontSize((current) => changeFontSize(current, "increase"));
  };

  const percentage = FONT_SIZE_PERCENTAGES[fontSize];

  return (
    <div
      className="lf-font-size-controls"
      role="group"
      aria-label={`Tamaño del texto: ${percentage}%`}
    >
      <button
        type="button"
        className="lf-font-size-toggle"
        onClick={decreaseFontSize}
        disabled={fontSize === "small"}
        title={`Achicar tamaño de texto (actual: ${percentage}%)`}
        aria-label="Achicar tamaño de texto"
      >
        <span className="lf-font-size-symbol" aria-hidden="true">
          A<sup>−</sup>
        </span>
      </button>
      <button
        type="button"
        className="lf-font-size-toggle"
        onClick={increaseFontSize}
        disabled={fontSize === "xlarge"}
        title={`Agrandar tamaño de texto (actual: ${percentage}%)`}
        aria-label="Agrandar tamaño de texto"
      >
        <span className="lf-font-size-symbol" aria-hidden="true">
          A<sup>+</sup>
        </span>
      </button>
    </div>
  );
}
