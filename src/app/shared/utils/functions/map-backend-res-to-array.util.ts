export const mapResponseToStringArray = (response: string): string[] => {
  const list: string[] = [];
  response
    .split('|')
    .slice(4)
    .map(item => list.push(item));

  return list;
};
