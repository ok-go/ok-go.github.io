interface RowItemProps {
  value: number | string | undefined
  darker?: boolean
  onClick?: () => void
}

export function RowItem(props: RowItemProps) {
  return (
    <div
      className={`scoreitem ${props.darker ? 'darker' : ''}`}
      onClick={props.onClick}
    >
      {props.value ?? '0'}
    </div>
  )
}

