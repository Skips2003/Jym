import { BodyHighlighterInstance, BodyHighlighterOptions, ModelType, Muscle, StyleObject } from './metadata';

import { anteriorData, posteriorData } from '../assets';
import { DEFAULT_BODY_COLOR, DEFAULT_HIGHLIGHTED_COLORS, DEFAULT_MODEL_TYPE } from '../constants';
import { ensure, fillIntensityColor, fillMuscleData } from '../utils';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_WRAPPER_CLASS = 'rbh-wrapper';

type InternalOptions = Required<Omit<BodyHighlighterOptions, 'style' | 'svgStyle' | 'onClick'>> & {
  style?: StyleObject;
  svgStyle?: StyleObject;
  onClick?: BodyHighlighterOptions['onClick'];
};

const toKebabCase = (property: string) =>
  property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^ms-/, '-ms-');

const applyInlineStyles = (element: HTMLElement | SVGElement, style?: StyleObject) => {
  element.removeAttribute('style');

  if (!style) {
    return;
  }

  for (const [property, value] of Object.entries(style)) {
    if (value == null) continue;

    element.style.setProperty(toKebabCase(property), String(value));
  }
};

const setChildren = (parent: Element, nodes: Node[]) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  for (const node of nodes) {
    parent.appendChild(node);
  }
};

const withDefaults = (options: BodyHighlighterOptions = {}): InternalOptions => ({
  bodyColor: options.bodyColor ?? DEFAULT_BODY_COLOR,
  data: options.data ?? [],
  highlightedColors: options.highlightedColors ? [...options.highlightedColors] : [...DEFAULT_HIGHLIGHTED_COLORS],
  onClick: options.onClick,
  container: options.container ?? null,
  wrapperClassName: options.wrapperClassName ?? DEFAULT_WRAPPER_CLASS,
  style: options.style,
  svgStyle: options.svgStyle,
  type: options.type ?? DEFAULT_MODEL_TYPE,
});

const pickModelData = (type: ModelType) => (type === ModelType.ANTERIOR ? anteriorData : posteriorData);

const buildPolygon = (
  muscle: Muscle,
  points: string,
  fillColor: string,
  onClick?: BodyHighlighterOptions['onClick'],
  muscleData?: ReturnType<typeof fillMuscleData>
) => {
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('points', points.trim());
  polygon.style.cursor = 'pointer';
  polygon.style.fill = fillColor;

  if (onClick && muscleData) {
    polygon.addEventListener('click', () => {
      onClick({ muscle, data: muscleData[muscle] });
    });
  }

  return polygon;
};

export const createBodyHighlighter = (options?: BodyHighlighterOptions): BodyHighlighterInstance => {
  const state = withDefaults(options);

  const wrapper = document.createElement('div');
  wrapper.className = state.wrapperClassName || DEFAULT_WRAPPER_CLASS;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('rbh');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 100 200');

  const render = () => {
    const muscleData = fillMuscleData([...state.data]);
    const modelData = pickModelData(state.type);

    const polygons = modelData.flatMap(item =>
      item.svgPoints.map(points =>
        buildPolygon(
          item.muscle,
          points,
          ensure(fillIntensityColor(muscleData, state.highlightedColors, item.muscle), state.bodyColor),
          state.onClick,
          muscleData
        )
      )
    );

    setChildren(svg, polygons);
  };

  const appendToContainer = () => {
    if (!state.container) return;
    if (wrapper.parentElement !== state.container) {
      state.container.appendChild(wrapper);
    }
  };

  const applyPresentation = () => {
    applyInlineStyles(wrapper, state.style);
    applyInlineStyles(svg, state.svgStyle);
  };

  wrapper.appendChild(svg);
  applyPresentation();
  render();
  appendToContainer();

  const update = (patch: Partial<BodyHighlighterOptions>) => {
    if (!patch) return;

    if (patch.bodyColor !== undefined) state.bodyColor = patch.bodyColor;
    if (patch.data !== undefined) state.data = patch.data;
    if (patch.highlightedColors !== undefined)
      state.highlightedColors = patch.highlightedColors ? [...patch.highlightedColors] : [];
    if (patch.onClick !== undefined) state.onClick = patch.onClick;
    if (patch.container !== undefined) {
      state.container = patch.container;

      if (state.container) {
        appendToContainer();
      } else if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
    if (patch.wrapperClassName !== undefined) {
      state.wrapperClassName = patch.wrapperClassName ?? DEFAULT_WRAPPER_CLASS;
      wrapper.className = state.wrapperClassName || DEFAULT_WRAPPER_CLASS;
    }
    if (patch.style !== undefined) state.style = patch.style;
    if (patch.svgStyle !== undefined) state.svgStyle = patch.svgStyle;
    if (patch.type !== undefined) state.type = patch.type;

    applyPresentation();
    render();
    if (state.container) {
      appendToContainer();
    }
  };

  const destroy = () => {
    setChildren(svg, []);
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  };

  return {
    element: wrapper,
    update,
    destroy,
  };
};

export default createBodyHighlighter;
