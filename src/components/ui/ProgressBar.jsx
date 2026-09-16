import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  height = 'h-2',
  color = 'bg-[rgb(var(--color-primary))]',
  trackColor = 'bg-[rgb(var(--color-container-high))]',
  animated = true,
  showLabel = false,
  labelPrefix = '',
  labelSuffix = '%'
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono mb-1 text-[rgb(var(--color-muted))]">
          <span>{labelPrefix}</span>
          <span className="font-semibold text-[rgb(var(--color-text))]">{Math.round(percentage)}{labelSuffix}</span>
        </div>
      )}
      <div className={`w-full ${height} ${trackColor} rounded-full overflow-hidden relative`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
}
