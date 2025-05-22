import { useEffect, useState } from "react";
import Card from "./Card";

export default function Board() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  function buildCards() {
    let vetCards = [];
    for (let i = 0; i < 8; i++) {
      let imgid = Math.floor(Math.random() * 100);
      vetCards.push({ id: `${i}-a`, imgid, isOpen: false });
      vetCards.push({ id: `${i}-b`, imgid, isOpen: false });
    }
    // Embaralhar
    vetCards = vetCards.sort(() => 0.5 - Math.random());
    setCards(vetCards);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
  }

  useEffect(() => {
    buildCards();
  }, []);

  function onClick(card) {
    if (
      isChecking ||
      flipped.length === 2 ||
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.imgid)
    )
      return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isOpen: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        const [first, second] = newFlipped;
        if (first.imgid === second.imgid) {
          setMatched((prev) => [...prev, first.imgid]);
        } else {
          const resetCards = updatedCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isOpen: false }
              : c
          );
          setCards(resetCards);
        }
        setFlipped([]);
        setIsChecking(false);
      }, 800);
    }
  }

  const allMatched = matched.length === cards.length / 2;

  return (
    <div className="m-4 p-4 border rounded shadow bg-white max-w-xl mx-auto">
      <div className="text-lg mb-2">
        <span className="font-medium">Tentativas:</span>
        <span className="ml-2 text-xl font-bold text-blue-600">{attempts}</span>
      </div>
      <hr className="mb-4" />
      <div className="grid grid-cols-4 gap-3 justify-items-center">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            id={card.id}
            imgid={card.imgid}
            isOpen={card.isOpen || matched.includes(card.imgid)}
            onClick={onClick}
          />
        ))}
      </div>
      {allMatched && (
        <div className="mt-6 text-green-600 text-center font-bold text-xl">
          🎉 Parabéns! Você venceu!
        </div>
      )}
    </div>
  );
}

