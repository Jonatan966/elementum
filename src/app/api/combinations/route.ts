import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { languages } from "@/app/i18n/settings";
import { openAI } from "@/lib/openai";
import { db } from "@/database";
import { combinations } from "@/database/schema";
import { and, eq } from "drizzle-orm";

interface Combination {
  emoji: string;
  element: {
    name: string;
    language: (typeof languages)[number];
  }[];
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { elementA, elementB, language } = z
    .object({
      elementA: z.string(),
      elementB: z.string(),
      language: z.string(),
    })
    .parse(body);

  const existentCombination = await db
    .select()
    .from(combinations)
    .where(
      and(
        eq(combinations.elementA, elementA),
        eq(combinations.elementB, elementB)
      )
    );

  if (existentCombination.length) {
    const { result: element, emoji } = existentCombination[0];

    return NextResponse.json({
      element,
      emoji,
      isNew: false,
    });
  }

  const completionResponse = await openAI.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Bem-vindo ao seu laboratório de combinação de elementos realistas! Você é um alquimista moderno, capaz de misturar elementos para criar novas substâncias. Sua tarefa é simples: misture dois elementos em um balde e informe qual substância foi formada. Suas misturas devem ser realistas e coerentes. Por exemplo, a combinação de "Terra" e "Água" pode resultar em "Lama". Sua saída deve incluir o nome da mistura e um emoji que represente a substância formada. Sempre forneça a mistura resultante nos seguintes idiomas: pt-BR, en. Use o formato JSON a seguir para a saída: {"emoji": "", "element": [{"language": "", "name": "Nome da substância"}]}`,
      },
      {
        role: "user",
        content: `elemento_a: """${elementA}""", elemento_b: """${elementB}"""`,
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 1,
    response_format: {
      type: "json_object",
    },
  });

  const combinationResult = JSON.parse(
    completionResponse.choices[0].message.content!
  ) as Combination;

  const parsedCombinations = combinationResult.element.map((element) => ({
    elementA,
    elementB,
    result: element.name,
    language: element.language,
    emoji: combinationResult.emoji,
  }));

  const targetCombination = parsedCombinations.find(
    (combination) => combination.language === language
  );

  await db.insert(combinations).values(parsedCombinations);

  return NextResponse.json({
    element: targetCombination?.result,
    emoji: targetCombination?.emoji,
    isNew: true,
  });
}
