import OpenAI from 'openai';

export const prosConsStreamUseCase = async (openai: OpenAI, prompt: string) => {
  const response = await openai.responses.create({
    model: 'gpt-4o',
    stream: true,
    instructions: `Se te dara una pregunta y tu tarea es dar una respuesta con 
    pros y contras, los pros y contras deberan estar en una lista. Damelo en texto plano,
    no markdown`,
    input: prompt,
  });

  return response;
};
