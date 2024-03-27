import { useRef } from "preact/compat";
import { ShotInfo } from "../../imodels/session";

const shotRad = 8
const targetSize = 550

export function TargetFace(props: {
  shots?: ShotInfo[],
  update: (x: number, y: number) => void
}) {
  const {shots, update} = props
  const selfRef = useRef<SVGSVGElement>(null)
  const onClick = (ev: PointerEvent) => {
    if (!selfRef.current) {
      return
    }
    if (ev.detail > 1) {
      return
    }

    update(
      targetSize * ev.offsetX / selfRef.current.clientWidth,
      targetSize * ev.offsetY / selfRef.current.clientHeight
    )
  }

  if (selfRef !== undefined && selfRef.current) {
    selfRef.current.onclick = (ev) => onClick(ev as any)
  }

  return (
    <svg ref={selfRef} className='targetface' /*onClick={onClick as any} */ viewBox={`0 0 ${targetSize} ${targetSize}`}
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shotFilter">
          <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color='#242424' />
        </filter>
      </defs>
      <Face />
      {shots?.filter((s) => s !== undefined).map((s) => (
        <circle className={`shot`} r={shotRad} cx={s.x} cy={s.y} style='filter:url(#shotFilter)' />
      ))}
    </svg>
  )
}

function Face() {
  const center = targetSize / 2
  return (
    <>
      <ellipse ry="250" rx="250" id="svg_6" cy={center} cx={center} stroke="#000" fill="#56aaff" />
      <ellipse ry="200" rx="200" id="svg_7" cy={center} cx={center} stroke="#000" fill="#ff5656" />
      <ellipse ry="150" rx="150" id="svg_8" cy={center} cx={center} stroke="#000" fill="#ff5656" />
      <ellipse ry="100" rx="100" id="svg_9" cy={center} cx={center} stroke="#000" fill="#ffff56" />
      <ellipse ry="50" rx="50" id="svg_10" cy={center} cx={center} stroke="#000" fill="#ffff56" />
      <ellipse ry="25" rx="25" id="svg_x" cy={center} cx={center} stroke="#000" fill="#ffff56" />
    </>
  )
}

export function getCode(x: number, y: number): string {
  const center = targetSize / 2
  const dist = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2)) - shotRad
  if (dist < 25) {
    return "X"
  } else if (dist < 50) {
    return "10"
  } else if (dist < 100) {
    return "9"
  } else if (dist < 150) {
    return "8"
  } else if (dist < 200) {
    return "7"
  } else if (dist < 250) {
    return "6"
  } else {
    return "M"
  }
}

export function codeToValue(c?: string): number {
  switch (c) {
    case 'X':
    case '10':
      return 10
    case '9':
    case '8':
    case '7':
    case '6':
      return parseInt(c, 10)
    default:
      return 0
  }
}
