import { useState } from "react";
import { track } from "~/lib/analytics";

/**
 * A poster-framed 16:9 player that fetches the clip only on play
 * (`preload="none"` + a poster image), so a large file never blocks first
 * paint. Unlike the Hero's muted ambient loop, this is an explainer meant to
 * be HEARD — it plays with sound and native controls on click (the click is
 * the user gesture that lets sound autoplay) and returns to the poster when it
 * ends. It renders only the media tile; the surrounding copy is the caller's,
 * so it can sit inside a hero.
 */
export function VideoExplainer({
  src,
  poster,
  label,
  duration,
  className = "",
}: {
  src: string;
  poster: string;
  /** names the clip for the play button's accessible label */
  label: string;
  /** small badge on the poster, e.g. "0:59" */
  duration?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-black ring-1 ring-ivory/12 ${className}`}
    >
      {playing ? (
        <video
          className="absolute inset-0 h-full w-full"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="none"
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            track("video_play", { page: "off-plan", asset: "serene-offplan" });
          }}
          aria-label={`Play the video: ${label}`}
          className="group absolute inset-0 block cursor-pointer"
        >
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {/* scrim keeps the affordance and badge legible over any frame */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25 transition-colors duration-500 group-hover:from-ink/60"
          />
          {/* play affordance — a radius-0 platinum square, per the brand */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ink/30 ring-1 ring-ivory/70 backdrop-blur-sm transition duration-300 group-hover:bg-ink/10 group-hover:ring-ivory md:size-20"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-ivory md:h-7 md:w-7" aria-hidden>
              <path d="M6 4.5v15l13-7.5z" />
            </svg>
          </span>
          {duration && (
            <span className="type-cap absolute bottom-4 right-4 bg-ink/50 px-2 py-1 text-ivory/85 backdrop-blur-sm">
              {duration}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
