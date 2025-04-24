import OpenAI from 'openai';

export const getMessagesThreadUseCase = async (
  openia: OpenAI,
  threadId: string,
) => {
  const messageList = await openia.beta.threads.messages.list(threadId);

  console.log(JSON.stringify(messageList, null, 2));

  const messages = messageList.data.map((message) => ({
    role: message.role,
    content: message.content[0].type === 'text' ? message.content[0].text : '',
  }));

  return messages.reverse();
};
