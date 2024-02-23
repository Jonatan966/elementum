interface MakeCombinationParams {
  elementA: string;
  elementB: string;
  language: string;
}

interface Combination {
  emoji: string;
  element: string;
  isNew: boolean;
}

export async function makeCombination({
  elementA,
  elementB,
  language,
}: MakeCombinationParams) {
  const combinationResponse = await fetch("/api/combinations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      elementA,
      elementB,
      language,
    }),
    next: { revalidate: 0 },
  });

  const combination = (await combinationResponse.json()) as Combination;

  return combination;
}
