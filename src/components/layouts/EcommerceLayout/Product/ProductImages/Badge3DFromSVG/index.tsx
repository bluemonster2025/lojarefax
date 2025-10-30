/** Badge3DFromSVG.tsx */
"use client";

export default function Badge3DFromSVG() {
  return (
    <>
      <div className="rf-badge3d">
        {/* SVG das setas orbitando */}
        <div className="ring">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10.0059 28.6667C5.62578 26.5867 2.49142 22.3467 2.00921 17.3333H0C0.669736 25.5467 7.58142 32 16.0067 32L16.8907 31.96L11.7874 26.88L10.0059 28.6667ZM16.0067 0L15.1226 0.04L20.226 5.12L22.0075 3.33333C26.3876 5.41333 29.522 9.64 29.9908 14.6667H32C31.3303 6.45333 24.432 0 16.0067 0Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Texto central */}
        <span className="label">3D</span>
      </div>

      <style jsx>{`
        .rf-badge3d {
          position: absolute;
          top: 0.75rem; /* top-3 */
          right: 0.75rem; /* right-3 */
          z-index: 20;

          width: 32px;
          height: 32px;
          border-radius: 9999px;

          display: grid;
          place-items: center;

          background: white;
          color: #282828; /* usa sua token se preferir */
          overflow: hidden;
        }

        .label {
          position: relative;
          font-weight: 700;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 0.02em;
          z-index: 2;
          user-select: none;
        }

        .ring {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 1;
          pointer-events: none;

          /* controles */
          --amp: 24deg; /* amplitude da rotação (quanto menor, mais sutil) */
          --dur: 0.5s; /* velocidade */

          transform-origin: 50% 50%;
          animation: swingSmall var(--dur) ease-in-out infinite alternate;
        }

        @keyframes swingSmall {
          0% {
            transform: rotate(calc(-1 * var(--amp)));
          }
          100% {
            transform: rotate(var(--amp));
          }
        }

        /* acessibilidade: respeita redução de movimento */
        @media (prefers-reduced-motion: reduce) {
          .ring {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
