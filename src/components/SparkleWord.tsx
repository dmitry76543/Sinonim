type SparkleWordProps = {
  children: React.ReactNode;
  className?: string;
};

export function SparkleWord({ children, className = "" }: SparkleWordProps) {
  return (
    <span className={`diamond-sparkle-word ${className}`.trim()}>
      <span className="relative z-[1]">{children}</span>
      <span className="diamond-sparkle-glint diamond-sparkle-glint-1" aria-hidden="true" />
      <span className="diamond-sparkle-glint diamond-sparkle-glint-2" aria-hidden="true" />
      <span className="diamond-sparkle-glint diamond-sparkle-glint-3" aria-hidden="true" />
    </span>
  );
}
