import { useState, useEffect } from "react";

const ALPHABET = [
  "А","Б","В","Г","Д","Е","Ё","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я"
];

const RAINBOW = [
  "#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4","#2196F3","#9C27B0",
  "#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4","#2196F3","#9C27B0",
  "#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4","#2196F3","#9C27B0",
  "#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4","#2196F3","#9C27B0",
  "#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4",
];

const CONFETTI_COLORS = ["#FF3B3B","#FF6B2B","#FFD700","#4CAF50","#00BCD4","#9C27B0","#FF69B4","#00E5FF"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
  spin: number;
  type: "circle" | "rect" | "ribbon";
  opacity: number;
}

interface Balloon {
  id: number;
  x: number;
  color: string;
  speed: number;
  size: number;
  delay: number;
}

function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const initial: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      y: randomBetween(-20, -2),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: randomBetween(8, 18),
      speed: randomBetween(1.5, 3.5),
      angle: randomBetween(-30, 30),
      spin: randomBetween(-3, 3),
      type: (["circle", "rect", "ribbon"] as const)[i % 3],
      opacity: 1,
    }));
    setPieces(initial);
  }, []);

  useEffect(() => {
    if (pieces.length === 0) return;
    const raf = requestAnimationFrame(() => {
      setPieces(prev => {
        const updated = prev.map(p => ({
          ...p,
          y: p.y + p.speed * 0.35,
          x: p.x + Math.sin((p.y / 30) + p.angle) * 0.3,
          angle: p.angle + p.spin * 0.05,
          opacity: p.y > 105 ? 0 : 1,
        })).filter(p => p.y < 115);
        if (updated.length < 20) {
          return [
            ...updated,
            ...Array.from({ length: 15 }, (_, i) => ({
              id: Date.now() + i,
              x: randomBetween(0, 100),
              y: randomBetween(-15, 0),
              color: CONFETTI_COLORS[(Date.now() + i) % CONFETTI_COLORS.length],
              size: randomBetween(8, 18),
              speed: randomBetween(1.5, 3.5),
              angle: randomBetween(-30, 30),
              spin: randomBetween(-3, 3),
              type: (["circle", "rect", "ribbon"] as const)[(Date.now() + i) % 3],
              opacity: 1,
            })),
          ];
        }
        return updated;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pieces]);

  return pieces;
}

export default function Index() {
  const [clickedLetter, setClickedLetter] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [balloons] = useState<Balloon[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: randomBetween(2, 96),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      speed: randomBetween(9, 18),
      size: randomBetween(38, 68),
      delay: randomBetween(0, 8),
    }))
  );
  const confetti = useConfetti();

  const handleLetterClick = (letter: string) => {
    setClickedLetter(letter);
    setTimeout(() => setClickedLetter(null), 700);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff9c4 0%, #ffd6e0 30%, #c8f5ff 60%, #d4f5c4 100%)" }}>

      {/* Воздушные шары */}
      {balloons.map(b => (
        <div
          key={b.id}
          className="absolute pointer-events-none"
          style={{
            left: `${b.x}%`,
            bottom: "-90px",
            animation: `floatUp ${b.speed}s ease-in-out ${b.delay}s infinite`,
            zIndex: 1,
          }}
        >
          <div style={{ position: "relative", width: b.size, height: b.size * 1.3 }}>
            <div style={{
              width: b.size,
              height: b.size,
              borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
              background: `radial-gradient(circle at 35% 35%, ${b.color}ff, ${b.color}99)`,
              boxShadow: `inset -5px -5px 15px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.12)`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "18%", left: "22%",
                width: "30%", height: "22%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.6)",
                transform: "rotate(-20deg)"
              }} />
            </div>
            <svg width="6" height={b.size * 0.9} style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: b.size - 2 }}>
              <path d={`M3 0 Q9 ${b.size * 0.25} 3 ${b.size * 0.5} Q-3 ${b.size * 0.7} 3 ${b.size * 0.9}`}
                stroke={b.color} strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </div>
        </div>
      ))}

      {/* Конфетти */}
      {confetti.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            transform: `rotate(${p.angle}deg)`,
            zIndex: 2,
          }}
        >
          {p.type === "circle" && (
            <div style={{ width: p.size, height: p.size, borderRadius: "50%", background: p.color }} />
          )}
          {p.type === "rect" && (
            <div style={{ width: p.size * 0.6, height: p.size, background: p.color, borderRadius: 2 }} />
          )}
          {p.type === "ribbon" && (
            <div style={{ width: p.size * 1.6, height: p.size * 0.4, background: p.color, borderRadius: 3 }} />
          )}
        </div>
      ))}

      {/* Декоративные ленточки */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${8 + i * 12}%`,
            left: i % 2 === 0 ? "-4%" : "92%",
            width: "110px",
            height: "10px",
            background: `linear-gradient(90deg, ${CONFETTI_COLORS[i % 8]}, ${CONFETTI_COLORS[(i + 4) % 8]})`,
            borderRadius: "5px",
            transform: `rotate(${i % 2 === 0 ? 30 + i * 6 : -(30 + i * 6)}deg)`,
            opacity: 0.75,
            animation: `sway ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite alternate`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
          }} />
        ))}
      </div>

      {/* Основной контент */}
      <div className="relative flex flex-col items-center min-h-screen py-8 px-4" style={{ zIndex: 10 }}>

        {/* Заголовок */}
        <div className="text-center mb-6 mt-4">
          <h1 style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: "clamp(1.9rem, 5.5vw, 3.8rem)",
            background: "linear-gradient(135deg, #FF3B3B 0%, #FF6B2B 20%, #FFD700 40%, #4CAF50 60%, #2196F3 80%, #9C27B0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.25,
            marginBottom: "6px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}>
            Азбука, прощай!
          </h1>
          <p style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#6a3e9a",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}>
            🎉 Мы выучили все буквы! 🎉
          </p>
        </div>

        {/* Книга в центре + буквы в разнобой вокруг */}
        <div style={{
          position: "relative",
          width: "min(820px, 100%)",
          height: "clamp(420px, 65vw, 620px)",
          marginBottom: "32px",
        }}>
          {/* Буквы — абсолютно, в разнобой вокруг книги */}
          {ALPHABET.map((letter, idx) => {
            const isHovered = hoveredIdx === idx;
            const isClicked = clickedLetter === letter;
            const color = RAINBOW[idx];

            // Позиции в разнобой по кругу, избегая центр (35-65% по x, 30-70% по y)
            const positions = [
              { x: 2,  y: 2  }, { x: 12, y: 0  }, { x: 22, y: 3  }, { x: 78, y: 1  },
              { x: 88, y: 3  }, { x: 94, y: 0  }, { x: 5,  y: 14 }, { x: 90, y: 12 },
              { x: 1,  y: 26 }, { x: 92, y: 24 }, { x: 3,  y: 38 }, { x: 91, y: 36 },
              { x: 0,  y: 50 }, { x: 93, y: 50 }, { x: 2,  y: 62 }, { x: 92, y: 63 },
              { x: 4,  y: 74 }, { x: 90, y: 75 }, { x: 8,  y: 86 }, { x: 88, y: 87 },
              { x: 18, y: 93 }, { x: 30, y: 96 }, { x: 42, y: 94 }, { x: 54, y: 96 },
              { x: 65, y: 93 }, { x: 76, y: 90 }, { x: 32, y: 4  }, { x: 44, y: 2  },
              { x: 56, y: 5  }, { x: 68, y: 3  }, { x: 15, y: 50 }, { x: 80, y: 50 },
              { x: 48, y: 92 },
            ];
            const pos = positions[idx] || { x: idx * 3 % 90, y: idx * 7 % 90 };
            const rotate = [-18, 12, -8, 22, -15, 8, -25, 18, -10, 20, -5, 15, -20, 10, -12, 25, -7, 16, -22, 9, -14, 19, -6, 23, -11, 17, -3, 21, -16, 7, -24, 13, -9][idx] || 0;
            const size = [52, 48, 56, 44, 58, 46, 54, 50, 52, 48, 56, 44, 58, 46, 54, 50, 52, 48, 56, 44, 58, 46, 54, 50, 52, 48, 56, 44, 58, 46, 54, 50, 52][idx] || 50;

            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  fontFamily: "'Rubik', sans-serif",
                  fontWeight: 900,
                  fontSize: isClicked ? "1.6rem" : isHovered ? "1.4rem" : "1.1rem",
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "14px",
                  border: `3px solid ${color}`,
                  background: isHovered || isClicked
                    ? `linear-gradient(135deg, ${color}ee, ${color}bb)`
                    : `${color}22`,
                  color: isHovered || isClicked ? "#fff" : color,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)",
                  transform: isClicked
                    ? `rotate(${rotate}deg) scale(1.5)`
                    : isHovered
                      ? `rotate(${rotate}deg) scale(1.2)`
                      : `rotate(${rotate}deg) scale(1)`,
                  boxShadow: isHovered || isClicked
                    ? `0 8px 24px ${color}88`
                    : `0 3px 10px ${color}44`,
                  outline: "none",
                  overflow: "hidden",
                  userSelect: "none",
                  zIndex: isHovered || isClicked ? 8 : 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isClicked && (
                  <span style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem",
                    animation: "popStar 0.65s ease-out forwards",
                    pointerEvents: "none",
                  }}>⭐</span>
                )}
                {letter}
              </button>
            );
          })}

          {/* Книга — строго по центру */}
          <div style={{
            position: "absolute",
            top: "18%",
            left: "26%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            animation: "bookFloat 3s ease-in-out infinite",
            pointerEvents: "none",
          }}>
            <img
              src="https://cdn.poehali.dev/projects/f7bc0a31-be8b-44e8-86fe-6d14ed2a2b60/bucket/9b0880ca-224e-4d5f-a8df-6fd3b0be86e0.jpg"
              alt="Азбука"
              style={{
                width: "clamp(280px, 42vw, 480px)",
                height: "auto",
                borderRadius: "16px",
                boxShadow: "0 24px 70px rgba(100,60,200,0.38), 0 8px 24px rgba(0,0,0,0.18)",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Блок учебника */}
        <div style={{
          background: "rgba(255,255,255,0.88)",
          borderRadius: "28px",
          padding: "28px 36px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(100,60,200,0.18)",
          border: "3px solid #FFD700",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Радужная полоска сверху */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "7px",
            background: "linear-gradient(90deg, #FF3B3B, #FF6B2B, #FFD700, #4CAF50, #2196F3, #9C27B0)",
          }} />
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>📖</div>
          <h2 style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: "1.6rem",
            color: "#6a3e9a",
            marginBottom: "10px",
          }}>
            Наша азбука
          </h2>
          <p style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: "1.05rem",
            color: "#555",
            lineHeight: 1.7,
          }}>
            33 буквы выучены! ✨
          </p>
          <div style={{
            marginTop: "18px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}>
            {["🎈","🎊","⭐","🎉","🌈","🎀","✨","🎁"].map((emoji, i) => (
              <span key={i} style={{
                fontSize: "1.7rem",
                animation: `bounce 1.6s ease-in-out ${i * 0.18}s infinite`,
                display: "inline-block",
              }}>{emoji}</span>
            ))}
          </div>
        </div>

        {/* Подпись */}
        <p style={{
          fontFamily: "'Rubik', sans-serif",
          marginTop: "28px",
          color: "#8a5db0",
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          opacity: 0.85,
        }}>
          🌟 Молодцы, первоклассники! 🌟
        </p>
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   translateX(0px);   opacity: 1; }
          20%  { transform: translateY(-20vh) translateX(18px);  }
          40%  { transform: translateY(-40vh) translateX(-15px); }
          60%  { transform: translateY(-60vh) translateX(20px);  }
          80%  { transform: translateY(-80vh) translateX(-10px); opacity: 0.7; }
          100% { transform: translateY(-115vh) translateX(0px); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes sway {
          from { transform: rotate(-22deg) translateX(-6px); }
          to   { transform: rotate(22deg)  translateX(6px); }
        }
        @keyframes popStar {
          0%   { opacity: 1; transform: scale(0.4); }
          60%  { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        @keyframes bookFloat {
          0%   { transform: rotate(-4deg) translateY(0px); }
          50%  { transform: rotate(-2deg) translateY(-12px); }
          100% { transform: rotate(-4deg) translateY(0px); }
        }
      `}</style>
    </div>
  );
}