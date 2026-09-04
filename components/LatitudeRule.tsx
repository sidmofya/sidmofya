/**
 * The recurring 23° South motif: a hairline carrying a coordinate label.
 * A lens and point of view, not a geographic visualization.
 */
export default function LatitudeRule({ className = "" }: { className?: string }) {
  return (
    <div className={`latitude ${className}`} aria-hidden="true">
      <span>23° S</span>
    </div>
  );
}
