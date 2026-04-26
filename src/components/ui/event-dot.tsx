interface EventDotProps {
  color: string;
  size?: number;
}

export function EventDot({ color, size = 8 }: EventDotProps) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}
