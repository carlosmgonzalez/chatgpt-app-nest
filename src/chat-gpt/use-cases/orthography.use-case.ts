import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const checkOrtographyUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const response = await openai.responses.create({
    model: 'gpt-4o',
    instructions: `Revisa la ortografía y la gramática del siguiente texto en español, 
      sin cambiar el contenido ni el estilo del autor, solo corrige errores ortográficos y gramaticales:'`,
    input: prompt,
  });

  return {
    message: response.output_text,
  };
};
